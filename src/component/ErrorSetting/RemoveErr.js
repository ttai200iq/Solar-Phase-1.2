import React, { useEffect } from "react";
import "./ErrorSetting.scss";

import { COLOR } from "../../App";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";

export default function RemoveErr(props) {
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
    <div className="DAT_RemoveErr">
      <div className="DAT_RemoveErr_Head">
        <div className="DAT_RemoveErr_Head_Left">
          {dataLang.formatMessage({ id: "delete" })}
        </div>
        <div className="DAT_RemoveErr_Head_Right">
          <div
            className="DAT_RemoveErr_Head_Right_Icon"
            id="Popup"
            onClick={() => props.handleClose()}
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      {(() => {
        switch (props.type) {
          case "REMOVECAUSE":
            return (
              <div className="DAT_RemoveErr_Body">
                {dataLang.formatMessage({ id: 'delCause' })}
              </div>
            )
          case "REMOVESOLUTION":
            return (
              <div className="DAT_RemoveErr_Body">
                {dataLang.formatMessage({ id: 'delSolution' })}
              </div>
            )
          default:
            return (
              <div className="DAT_RemoveErr_Body">
                {dataLang.formatMessage({ id: 'delErrorInfo' })}
              </div>
            )
        }
      })()}

      <div className="DAT_RemoveErr_Foot">
        <button
          style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
          onClick={(e) => {
            props.confirmDel(e);
          }}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
