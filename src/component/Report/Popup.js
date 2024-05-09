import React, { useEffect } from "react";
import "./Report.scss";

import { idReport, ReportData } from "./Report";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { userInfor } from "../../App";
import { alertDispatch } from "../Alert/Alert";

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

  const handleDeleteReport = async (e) => {
    const removeReport = await callApi("post", host.DATA + "/removeReport", {
      partnerid: userInfor.value.partnerid,
      reportid: idReport.value,
    });
    if (removeReport.status) {
      props.handleClose();
      const newDB = ReportData.value.filter(
        (item) => item.id !== parseInt(idReport.value)
      );
      alertDispatch(dataLang.formatMessage({ id: "alert_42" }));
      ReportData.value = newDB;
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
    <div className="DAT_PopupReport_Box">
      <div className="DAT_PopupReport_Box_Head">
        <div className="DAT_PopupReport_Box_Head_Left">
          {dataLang.formatMessage({ id: "delReport" })}
        </div>
        <div className="DAT_PopupReport_Box_Head_Right">
          <div
            className="DAT_PopupReport_Box_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_PopupReport_Box_Body">
        {dataLang.formatMessage({ id: "delreportmess" })}
      </div>

      <div className="DAT_PopupReport_Box_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => handleDeleteReport(e)}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
