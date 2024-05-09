import React, { useEffect, useRef, useState } from "react";
import "./Rule.scss";

import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";
import { datarule } from "./Rule";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { userInfor } from "../../App";

import { IoClose, IoSaveOutline } from "react-icons/io5";

const temp = signal({
  ruleid_: 0,
  rulename_: "",
  setting: {
    contact: { edit: false },
    device: { add: false, modify: false, remove: false },
    project: {
      add: false,
      modify: false,
      remove: false,
    },
    report: {
      add: false,
      modify: false,
      remove: false,
    },
    rule: {
      // active: false,
      add: false,
      modify: false,
      remove: false,
    },
    user: { add: false, modify: false, remove: false },
    warn: { remove: false },
    partner: {
      modify: false,
    },
  },
});

const newruledata = signal(temp.value);

export const ruletitle = signal([
  "alert",
  "device",
  "partner",
  "plant",
  "report",
  "rule",
]);

export const CheckBox = (props) => {
  const handleShow = (e) => {
    let arr = props.html.split("_");
    newruledata.value.setting[props.rights][props.custom] = e.target.checked;
  };

  return (
    <div className="DAT_CreateRule_Body_Item_Option_Check_SingleCheck"
      style={{ width: props.width }}
    >
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id={props.html}
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

export default function CreateRule(props) {
  const dataLang = useIntl();
  const [widthCheckBox, setWidwidthCheckBox] = useState("");
  const rulenameRef = useRef("");

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
    const handerChangeReportName = (e) => {
      rulenameRef.current = e.target.value;
    };

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
              defaultValue={rulenameRef.current}
              onChange={(e) => handerChangeReportName(e)}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleCreate = async () => {
    let d = datarule.value.filter((item) => rulenameRef.current == item.rulename_)
    if (rulenameRef.current != "" && d.length == 0) {
      const createRule = await callApi("post", host.DATA + "/addRule", {
        name: rulenameRef.current,
        type: userInfor.value.type,
        partnerid: userInfor.value.partnerid,
        setting: JSON.stringify(newruledata.value.setting),
      });
      if (createRule.status) {
        datarule.value = [...datarule.value, createRule.data];
        props.handleClose();
        alertDispatch(dataLang.formatMessage({ id: "alert_61" }));
      }
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
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
            {dataLang.formatMessage({ id: "newRule" })}
          </p>
        </div>

        <div className="DAT_CreateRule_Header_Right">
          <div className="DAT_CreateRule_Header_Right_Save"
            onClick={() => handleCreate()}
          >
            <IoSaveOutline size={20} color={'white'} />
            <span>{dataLang.formatMessage({ id: 'save' })}</span>
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

            {Object.entries(newruledata.value.setting).map(
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
