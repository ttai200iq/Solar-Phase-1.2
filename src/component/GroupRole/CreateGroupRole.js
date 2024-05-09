import React, { useEffect, useState } from "react";
import "./GroupRole.scss";

import { group } from "./GroupRole";
import { alertDispatch } from "../Alert/Alert";
import { signal } from "@preact/signals-react";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR } from "../../App";

import { IoClose } from "react-icons/io5";

const idplus = signal(2);
const newdb = signal({
  id_: 0,
  name_: "",
  code_: "",
});
const temp = signal(newdb.value);

const CheckBox = (props) => {
  const handleCheck = (e) => {
    newdb.value = {
      ...newdb.value,
      role: {
        ...newdb.value.role,
        [props.num]: {
          ...newdb.value.role[props.num],
          status: e.target.checked,
        },
      },
    };
  };

  return (
    <div className="DAT_CreateGroupRole_Body_Item_Checkbox_Option">
      <div className="form-check">
        <input className="form-check-input"
          type="checkbox"
          id={props.info}
          onChange={(e) => handleCheck(e)}
        />
        <label className="form-check-label"
          style={{ cursor: "pointer", fontSize: "15px", color: "grey" }}
          htmlFor={props.info}
        >
          {props.info}
        </label>
      </div>
    </div>
  );
};

export default function CreateGroupRole(props) {
  const dataLang = useIntl();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleCreate = async () => {
    if (name !== "" && code !== "") {
      let res = await callApi("post", host.DATA + "/addPartner", {
        name: name,
        code: code
      });
      if (res.status) {
        group.value = [
          ...group.value,
          res.data
        ];
        props.handleClose();
        alertDispatch(dataLang.formatMessage({ id: "alert_31" }))
      } else {
        alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
      }
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
    }
  };

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
    <div className="DAT_CreateGroupRole">
      <div className="DAT_CreateGroupRole_Header">
        <div className="DAT_CreateGroupRole_Header_Left">
          {dataLang.formatMessage({ id: 'createNewGroup' })}
        </div>

        <div className="DAT_CreateGroupRole_Header_Right">
          <div className="DAT_CreateGroupRole_Header_Right_Close"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_CreateGroupRole_Body">
        <div className="DAT_CreateGroupRole_Body_Item">
          <span>{dataLang.formatMessage({ id: 'groupName' })}:</span>
          <div className="DAT_CreateGroupRole_Body_Item_Input">
            <input type="text" onChange={(e) => setName(e.target.value)} required />
          </div>

          <span>{dataLang.formatMessage({ id: 'join' })}:</span>
          <div className="DAT_CreateGroupRole_Body_Item_Input" >
            <input type="text" onChange={(e) => setCode(e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="DAT_CreateGroupRole_Foot">
        <button
          style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
          onClick={() => { handleCreate(); }}
        >
          {dataLang.formatMessage({ id: 'confirm' })}
        </button>
      </div>
    </div>
  );
}
