import React, { useEffect } from "react";
import "./Role.scss";

import { Usr_ } from "./Role";
import { useIntl } from "react-intl";
import { alertDispatch } from "../Alert/Alert";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";

import { IoClose } from "react-icons/io5";

export default function DeleteRole(props) {
  const dataLang = useIntl();

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

  const handleDelete = async () => {
    const d = await callApi("post", host.DATA + "/removeUser", {
      usr: props.user,
    });
    if (d.status === true) {
      Usr_.value = Usr_.value.filter((d) => d.usr_ !== props.user)
      props.handleClose();
      alertDispatch(dataLang.formatMessage({ id: 'alert_45' }))
    }
    else {
      alertDispatch(dataLang.formatMessage({ id: 'alert_46' }))
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

  return (
    <div className="DAT_DeleteRole">
      <div className="DAT_DeleteRole_Head">
        <div className="DAT_DeleteRole_Head_Left">
          {dataLang.formatMessage({ id: "delAccount" })}
        </div>
        <div className="DAT_DeleteRole_Head_Right">
          <div
            className="DAT_DeleteRole_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_DeleteRole_Body">
        {dataLang.formatMessage({ id: "delaccountmess" })}
      </div>

      <div className="DAT_DeleteRole_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => handleDelete(e)}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
