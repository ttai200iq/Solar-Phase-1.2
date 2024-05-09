import React, { useEffect } from "react";
import "./GroupRole.scss";

import { groupID, groupUser, userDel } from "./GroupRole";
import { useIntl } from "react-intl";
import { alertDispatch } from "../Alert/Alert";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR } from "../../App";

import { IoClose } from "react-icons/io5";

export default function Popup(props) {
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

  const handleDelete = async (e) => {
    const i = groupUser.value.findIndex(
      (item) => item.id_ == parseInt(userDel.value)
    );

    let d = await callApi("post", host.DATA + "/removeUsrPartner", {
      mail: groupUser.value[i].mail_,
      partnerid: String(groupID.value),
    });
    if (d.status) {
      groupUser.value = groupUser.value.filter(
        (item) => item.id_ != parseInt(userDel.value)
      );
      props.handleClose();
      alertDispatch(dataLang.formatMessage({ id: "alert_55" }));
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
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
    <div className="DAT_Popup_Box">
      <div className="DAT_Popup_Box_Head">
        <div className="DAT_Popup_Box_Head_Left">
          <p>{dataLang.formatMessage({ id: "delAccount" })}</p>
        </div>

        <div className="DAT_Popup_Box_Head_Right">
          <div
            className="DAT_Popup_Box_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_Popup_Box_Body">
        {dataLang.formatMessage({ id: "delaccountmess" })}
      </div>

      <div className="DAT_Popup_Box_Foot">
        <button
          style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
          onClick={() => { handleDelete(); }}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
