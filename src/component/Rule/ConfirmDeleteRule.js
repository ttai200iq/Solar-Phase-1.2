import React, { useEffect, useState } from "react";
import "./Rule.scss";

import { datarule } from "./Rule";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR, userInfor } from "../../App";

import { IoClose } from "react-icons/io5";

export default function ConfirmDeleteRule(props) {
  const dataLang = useIntl();
  const [del, setDel] = useState(true);

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

  const handleDeleteRule = async (e) => {
    const delRule = await callApi("post", host.DATA + "/removeRule", {
      partnerid: userInfor.value.partnerid,
      ruleid: props.id,
    });
    if (delRule.status) {
      datarule.value = datarule.value.filter(
        (item) => item.ruleid_ !== parseInt(props.id)
      );
      props.handleClose();
      alertDispatch(dataLang.formatMessage({ id: "alert_52" }));
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
    <div className="DAT_ConfirmPopup_Box">
      <div className="DAT_ConfirmPopup_Box_Head">
        <div className="DAT_ConfirmPopup_Box_Head_Left">
          {dataLang.formatMessage({ id: "delRule" })}
        </div>
        <div className="DAT_ConfirmPopup_Box_Head_Right">
          <div className="DAT_ConfirmPopup_Box_Head_Right_Icon"
            id="Popup"
            onClick={() => (props.handleClose())}
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_ConfirmPopup_Box_Body">
        {del
          ? <>{dataLang.formatMessage({ id: "delrulemess" })}</>
          : <>{dataLang.formatMessage({ id: "deleteDenied" })}</>
        }
      </div>

      <div className="DAT_ConfirmPopup_Box_Foot">
        {del
          ?
          <button
            style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
            onClick={(e) => handleDeleteRule(e)}
          >
            {dataLang.formatMessage({ id: "confirm" })}
          </button>
          :
          <button
            style={{
              border: "1px solid #505050",
              backgroundColor: "white",
              color: "#505050",
            }}
            onClick={() => (props.handleClose())}
          >
            {dataLang.formatMessage({ id: "quit" })}
          </button>
        }
      </div>
    </div>
  );
}
