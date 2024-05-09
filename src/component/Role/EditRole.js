import React, { useEffect, useRef } from "react";
import "./Role.scss";

import { Usr_, access, roleData } from "./Role";
import { useIntl } from "react-intl";
import { datarule } from "../Rule/Rule";
import { host } from "../Lang/Contant";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";

import { IoClose } from "react-icons/io5";
import { partnerInfor, userInfor } from "../../App";
import { groupID } from "../GroupRole/GroupRole";

export default function EditRole(props) {
  const dataLang = useIntl();
  const roleRef = useRef(roleData.value.type_);
  const ruleidRef = useRef(0);

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

  useEffect(() => {
    const getRule = async (partnerid) => {
      const rule = await callApi("post", host.DATA + "/getRule", {
        partnerid: partnerInfor.value.partnerid,
      });
      if (rule.status) {
        datarule.value = rule.data;
        datarule.value = datarule.value.sort((a, b) => a.ruleid_ - b.ruleid_);
      }
    };
    getRule();
  }, [partnerInfor.value.partnerid]);

  const handleConfirm = async () => {
    const updateRoleUser = await callApi(
      "post",
      host.DATA + "/updateRoleUser",
      {
        usr: roleData.value.usr_,
        role: roleRef.current.value,
        ruleid: parseInt(ruleidRef.current.value),
      }
    );

    if (updateRoleUser.status) {
      let newData = Usr_.value;
      let index = Usr_.value.findIndex((d) => d.usr_ == roleData.value.usr_);
      let rulename = datarule.value.find(
        (d) => d.ruleid_ == parseInt(ruleidRef.current.value)
      ).rulename_;
      newData[index].type_ = roleRef.current.value;
      newData[index].ruleid_ = parseInt(ruleidRef.current.value);
      newData[index].rulename_ = rulename;
      Usr_.value = [...newData];
      props.handleClose();
      alertDispatch(dataLang.formatMessage({ id: "alert_43" }));
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_44" }));
    }
  };

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

  useEffect(() => {
    const getRule = async (partnerid) => {
      const rule = await callApi("post", host.DATA + "/getRule", {
        partnerid: groupID.value,
      });
      if (rule.status) {
        datarule.value = rule.data;
        datarule.value = datarule.value.sort((a, b) => a.ruleid_ - b.ruleid_);
        // setdatafilter(rule.data);
      }
    };
    getRule();
  }, [partnerInfor.value.partnerid]);

  return (
    <div className="DAT_EditRole">
      <div className="DAT_EditRole_Head">
        <div className="DAT_EditRole_Head_Left">
          {dataLang.formatMessage({ id: "edits" })}
        </div>

        <div className="DAT_EditRole_Head_Right">
          <div
            className="DAT_EditRole_Head_Right_Icon"
            onClick={() => props.handleClose()}
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_EditRole_Body">
        <div className="DAT_EditRole_Body_Row">
          <div className="DAT_EditRole_Body_Row_Left">
            {dataLang.formatMessage({ id: "username" })}:
          </div>
          {roleData.value.name_}
        </div>

        <div className="DAT_EditRole_Body_Row">
          <div className="DAT_EditRole_Body_Row_Left">
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "grey" }}>
              {dataLang.formatMessage({ id: "account" })}: &nbsp;
            </span>
          </div>
          <select defaultValue={roleData.value.type_} ref={roleRef}>
            {(() => {
              switch (userInfor.value.type) {
                case "master":
                  return (
                    <>
                      <option value="admin">
                        {dataLang.formatMessage({ id: "admin" })}
                      </option>
                      <option value="mainadmin">
                        {dataLang.formatMessage({ id: "mainadmin" })}
                      </option>
                    </>
                  );
                case "mainadmin":
                  return (
                    <>
                      <option value="admin">
                        {dataLang.formatMessage({ id: "admin" })}
                      </option>
                    </>
                  );
                default:
                  return null;
              }
            })()}
            <option value="user">
              {dataLang.formatMessage({ id: "user" })}
            </option>
          </select>
        </div>

        <div className="DAT_EditRole_Body_Row" style={{ marginBottom: "0px" }}>
          <div className="DAT_EditRole_Body_Row_Left">
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "grey", marginRight: "18px" }}>
              {dataLang.formatMessage({ id: "rule" })}: &nbsp;
            </span>
          </div>
          <select defaultValue={roleData.value.ruleid_} ref={ruleidRef}>
            {datarule.value
              .filter((item, key) => item.ruleid_ !== 1)
              .map((item, key) => (
                <option key={key} value={item.ruleid_}>
                  {item.rulename_}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="DAT_EditRole_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => {
            handleConfirm(e);
          }}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
