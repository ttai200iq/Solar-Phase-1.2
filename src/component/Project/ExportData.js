import React, { useEffect, useRef, useState } from "react";
import "../Role/Role.scss";

// import { Usr_, popupState, roleData, roleState } from "./Role";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";
import { partnerInfor, userInfor } from "../../App";
import { datarule } from "../Rule/Rule";
import { host } from "../Lang/Contant";
import { Download, callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";
import { projectData } from "./Project";
import { ReportData } from "../Report/Report";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";

export default function ExportData(props) {
  const dataLang = useIntl();
  const idRef = useRef();
  //   const ruleidRef = useRef(0);
  const [type, setType] = useState("dailyReport");
  const usr = useSelector((state) => state.admin.usr);

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

  const handleConfirm = async (e) => {
    const t = ReportData.value.find((item) => item.id == idRef.current.value);
    if (t) {
      const d = await Download(
        host.DATA + "/Report",
        {
          plant: props.plant,
          report: t,
          datetime: props.datetime,
        }
      )

      if (d.type === 'application/json') {
        alertDispatch(dataLang.formatMessage({ id: "alert_7" }))

      } else {
        fileDownload(d, `${t.name}_${props.datetime}.xlsx`)

      }
      props.handleClose();
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_48" }));
    }
  };

  useEffect(() => {
    const getReport = async () => {
      const d = await callApi("post", host.DATA + "/getReport", {
        usr: usr,
        partnerid: userInfor.value.partnerid,
        type: userInfor.value.type,
      });
      if (d.status) {
        ReportData.value = d.data;
        const t = ReportData.value.filter((item) => item.type == type);
      }
    };
    getReport();
  }, []);

  useEffect(() => {
    switch (props.typereport) {
      case "date":
        setType("dailyReport");
        break;
      case "month":
        setType("monthlyReport");
        break;
      case "year":
        setType("yearlyReport");
        break;
      case "total":
        setType("totalReport");
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className="DAT_EditRole">
      <div className="DAT_EditRole_Head">
        <div className="DAT_EditRole_Head_Left">
          <p>{dataLang.formatMessage({ id: "export" })}</p>
        </div>

        <div className="DAT_EditRole_Head_Right">
          <div
            className="DAT_EditRole_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25}></IoClose>
          </div>
        </div>
      </div>

      <div className="DAT_EditRole_Body">
        <div className="DAT_EditRole_Body_Row">
          <div className="DAT_EditRole_Body_Row_Left">
            {dataLang.formatMessage({ id: "projname" })}:
          </div>
          {projectData.value.plantname}
        </div>

        {/* <div className="DAT_EditRole_Body_Row">
          <div className="DAT_EditRole_Body_Row_Left">
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "grey" }}>
              {dataLang.formatMessage({ id: "account" })}: &nbsp;
            </span>
          </div>
        </div> */}

        <div className="DAT_EditRole_Body_Row">
          <div className="DAT_EditRole_Body_Row_Left">
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "grey", marginRight: "18px" }}>
              {dataLang.formatMessage({ id: "report" })}: &nbsp;
            </span>
          </div>
          <select
            // onChange={(e) => handlePickReport(e)}
            // defaultValue={pick}
            ref={idRef}
          >
            {ReportData.value
              .filter((item) => item.type == type)
              .map((rp, key) => {
                return (
                  <option key={key} value={rp.id}>
                    {rp.name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      <div className="DAT_EditRole_Foot">
        {/* <button
          style={{
            border: "1px solid #505050",
            backgroundColor: "white",
            color: "#505050",
          }}
          onClick={() => (popupState.value = "default")}
        >
          Hủy
        </button> */}
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
