import React, { useEffect, useRef, useState } from "react";
import "./Rule.scss";

import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";
import { datarule } from "./Rule";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";

import { IoClose, IoSaveOutline } from "react-icons/io5";

export const editruledata = signal();
const temp = signal();

export const CheckBox = (props) => {
  const handleShow = (e) => {
    let arr = props.html.split("_");
    temp.value = {
      ...editruledata.value,
    };
    editruledata.value.setting[props.rights][props.custom] = e.target.checked;
  };

  return (
    <div className="DAT_CreateRule_Body_Item_Option_Check_SingleCheck"
      style={{ width: props.width }}
    >
      <div className="form-check">
        <input className="form-check-input"
          type="checkbox"
          value=""
          id={props.html}
          defaultChecked={props.status}
          onChange={(e) => {
            handleShow(e);
          }}
        />
        <label className="form-check-label"
          style={{ cursor: "pointer", fontSize: "15px", color: "grey" }}
          htmlFor={props.html}
        >
          {props.id}
        </label>
      </div>
    </div>
  );
};

export default function EditRule(props) {
  const dataLang = useIntl();
  const [widthCheckBox, setWidwidthCheckBox] = useState("");
  const rulenameRef = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const TypeReport = (props) => {
    return (
      <div className="DAT_CreateRule_Body_Item"
        style={{ borderBottom: "dashed 1px rgba(198, 197, 197, 0.5)" }}
      >
        <div className="DAT_CreateRule_Body_Item_Data">
          <div className="DAT_CreateRule_Body_Item_Data_Name">
            <label>{dataLang.formatMessage({ id: "ruleName" })}: </label>
            <input
              type="text"
              placeholder={dataLang.formatMessage({ id: "required" })}
              required
              id="reportname"
              defaultValue={editruledata.value.rulename_}
              ref={rulenameRef}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    if (rulenameRef.current.value !== "") {
      let d = await callApi("post", host.DATA + "/updateRule", {
        ruleid: editruledata.value.ruleid_,
        name: rulenameRef.current.value,
        setting: JSON.stringify(editruledata.value.setting),
      });
      if (d.status) {
        let newData = datarule.value;
        let index = newData.findIndex(
          (d) => d.ruleid_ == editruledata.value.ruleid_
        );
        newData[index].rulename_ = rulenameRef.current.value;
        datarule.value = [...newData];
        props.handleClose();
        alertDispatch(dataLang.formatMessage({ id: "alert_62" }));
      }
    }
    else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
    }
  };

  useEffect(() => {
    if (isMobile.value) {
      setWidwidthCheckBox("50%");
    } else {
      setWidwidthCheckBox("25%");
    }
  }, [isMobile.value]);

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        props.handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="DAT_CreateRule">
      <div className="DAT_CreateRule_Header">
        <div className="DAT_CreateRule_Header_Left">
          <p>
            {dataLang.formatMessage({ id: "editRule" })}
          </p>
        </div>

        <div className="DAT_CreateRule_Header_Right">
          <div className="DAT_CreateRule_Header_Right_Save"
            onClick={() => handleSave()}
          >
            <IoSaveOutline size={20} color={'white'} />
            <span>{dataLang.formatMessage({ id: "save" })}</span>
          </div>

          <div className="DAT_CreateRule_Header_Right_Close"
            id="Popup"
            onClick={() => (props.handleClose())}
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_CreateRule_Body">
        <TypeReport />
        <div className="DAT_CreateRule_Body_Item">
          <div className="DAT_CreateRule_Body_Item_Option">
            <label className="DAT_CreateRule_Body_Item_Option_Title"
              style={{ margin: "0" }}
            >
              {dataLang.formatMessage({ id: "ruleOptions" })}
            </label>

            {Object.entries(editruledata.value.setting).map(
              ([key, value], index) => (
                <div className="DAT_CreateRule_Body_Item_Option_Check"
                  key={key}
                >
                  <p style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: key })}
                  </p>
                  {Object.entries(value).map(([key_, value_], index_) => (
                    <CheckBox
                      key={index_}
                      rights={key}
                      custom={key_}
                      status={value_}
                      id={dataLang.formatMessage({ id: key_ })}
                      html={index + "_" + index_}
                      width={widthCheckBox}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
