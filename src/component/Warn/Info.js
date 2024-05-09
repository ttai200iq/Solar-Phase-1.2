import React, { useEffect } from "react";
import "./Warn.scss";

import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function Info(props) {
  const dataLang = useIntl();
  const lang = useSelector((state) => state.admin.lang);

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
    <div className="DAT_ReportPopup">
      <div className="DAT_PopupReportInfo_Box">
        <div className="DAT_PopupReportInfo_Box_Head">
          <div className="DAT_PopupReportInfo_Box_Head_Left">
            {props.level == 'warn' ? (
              <div className="DAT_PopupReportInfo_Box_Head_Left_TableWarning">
                {dataLang.formatMessage({ id: props.boxid, defaultMessage: props.boxid })}
              </div>
            ) : (
              <div className="DAT_PopupReportInfo_Box_Head_Left_TableNotice">
                {dataLang.formatMessage({ id: props.boxid, defaultMessage: props.boxid })}
              </div>
            )}
          </div>

          <div className="DAT_PopupReportInfo_Box_Head_Right">
            <div
              className="DAT_PopupReportInfo_Box_Head_Right_Icon"
              onClick={() => props.handleClose()}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoClose size={25}></IoClose>
            </div>
          </div>
        </div>

        <div className="DAT_PopupReportInfo_Box_Body">
          <div className="DAT_PopupReportInfo_Box_Body_Item">
            {dataLang.formatMessage({ id: "project" })}:
            &nbsp;
            {props.plant}
          </div>

          <div className="DAT_PopupReportInfo_Box_Body_Item">
            {dataLang.formatMessage({ id: "device" })}:
            &nbsp;
            {props.device}
          </div>

          <div
            style={{ marginBottom: "8px" }}
          >
            {dataLang.formatMessage({ id: "cause" })}:
          </div>

          <div className="DAT_PopupReportInfo_Box_Body_Item_Box">
            {props.cause.map((item, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {item[lang]}
              </div>
            ))}
          </div>

          <div
            style={{ marginBottom: "8px" }}
          >
            {dataLang.formatMessage({ id: "solution" })} :
          </div>

          <div className="DAT_PopupReportInfo_Box_Body_Item_Box">
            {props.solution.map((item, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {item[lang]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}
