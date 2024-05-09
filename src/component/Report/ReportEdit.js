import React, { useEffect, useState } from "react";
import "./Report.scss";

import { editData, ReportData } from "./Report";
import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";

import { IoClose, IoSaveOutline } from "react-icons/io5";

const reportname = signal();


export const CheckBox = (props) => {
  const handleShow = (e) => {
    let arr = props.tab.split("_");

    switch (arr[1]) {
      case "content":
        editData.value = {
          ...editData.value,
          [arr[0]]: {
            ...editData.value[arr[0]],
            [props.num]: {
              ...editData.value[arr[0]][props.num],
              status: e.target.checked,
            },
          },
        };
        break;
      case "option":
        editData.value = {
          ...editData.value,
          [arr[0]]: {
            ...editData.value[arr[0]],
            option: {
              ...editData.value[arr[0]].option,
              [props.num]: {
                ...editData.value[arr[0]].option[props.num],
                status: e.target.checked,
              },
            },
          },
        };
        break;
      default:
        editData.value = {
          ...editData.value,
          [arr[0]]: {
            ...editData.value[arr[0]],
            status: e.target.checked,
          },
        };
        break;
    }
  };

  useEffect(() => {
    document.getElementById(props.id).checked = props.status;
  }, []);

  return (
    <div
      className="DAT_EditReport_Body_Item_Option_Check_SingleCheck"
      style={{ width: props.width }}
    >
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id={props.id}
          onChange={(e) => {
            handleShow(e);
          }}
        />
        <label
          className="form-check-label"
          style={{ cursor: "pointer", fontSize: "15px", color: "grey" }}
          htmlFor={props.id}
        >
          {props.id}
        </label>
      </div>
    </div>
  );
};

const DataReport = (props) => {
  const dataLang = useIntl();
  const [nameReport, setNameReport] = useState(editData.value.name);

  const handlePushName = (e) => {
    setNameReport(e.currentTarget.value);
    reportname.value = e.currentTarget.value;
  };

  useEffect(() => {
    reportname.value = editData.value.name;
  });

  useEffect(() => {
    reportname.value = nameReport;
  });

  return (
    <div className="DAT_EditReport_Body_Item">
      <div className="DAT_EditReport_Body_Item_Data">
        {(() => {
          switch (editData.value.type) {
            case "dailyReport":
              return (
                <>
                  <label style={{ fontWeight: "700", margin: "0" }}>
                    {dataLang.formatMessage({ id: "dailyReport" })}
                  </label>
                  <p style={{ color: "grey", margin: "0" }}>
                    {dataLang.formatMessage({ id: "dailyReportDesc" })}
                  </p>
                </>
              );
            case "monthlyReport":
              return (
                <>
                  <label style={{ fontWeight: "700", margin: "0" }}>
                    {dataLang.formatMessage({ id: "monthlyReport" })}
                  </label>
                  <p style={{ color: "grey", margin: "0" }}>
                    {dataLang.formatMessage({ id: "monthlyReportDesc" })}
                  </p>
                </>
              );
            case "yearlyReport":
              return (
                <>
                  <label style={{ fontWeight: "700", margin: "0" }}>
                    {dataLang.formatMessage({ id: "yearlyReport" })}
                  </label>
                  <p style={{ color: "grey", margin: "0" }}>
                    {dataLang.formatMessage({ id: "yearlyReportDesc" })}
                  </p>
                </>
              );
            case "totalReport":
              return (
                <>
                  <label style={{ fontWeight: "700", margin: "0" }}>
                    {dataLang.formatMessage({ id: "totalReport" })}
                  </label>
                  <p style={{ color: "grey", margin: "0" }}>
                    {dataLang.formatMessage({ id: "yearlyReportDesc" })}
                  </p>
                </>
              );
            default:
              return (
                <>
                  <label style={{ fontWeight: "700", margin: "0" }}>
                    {dataLang.formatMessage({ id: "dailyReport" })}
                  </label>
                  <p style={{ color: "grey", margin: "0" }}>
                    {dataLang.formatMessage({ id: "dailyReportDesc" })}
                  </p>
                </>
              );
          }
        })()}

        <div className="DAT_EditReport_Body_Item_Data_Name">
          <label>{dataLang.formatMessage({ id: "reportName" })}: </label>
          <input
            placeholder={dataLang.formatMessage({ id: "required" })}
            value={nameReport}
            required
            onChange={(e) => handlePushName(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default function ReportEdit(props) {
  const dataLang = useIntl();
  const [widthCheckBox, setWidwidthCheckBox] = useState("");

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

  const handleSaveData = async () => {
    const updateReport = await callApi("post", host.DATA + "/updateReport", {
      name: reportname.value,
      type: editData.value.type,
      inf: JSON.stringify(editData.value.inf),
      customdata: JSON.stringify(editData.value.customdata),
      reportid: editData.value.id,
    });

    if (updateReport.status) {
      props.handleClose();
      const index = ReportData.value.findIndex((item) => {
        return item.id === editData.value.id;
      });
      ReportData.value[index] = editData.value;
      ReportData.value[index] = {
        ...ReportData.value[index],
        name: reportname.value,
      };
      alertDispatch(dataLang.formatMessage({ id: "alert_41" }));
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
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
    <div className="DAT_EditReport">
      <div className="DAT_EditReport_Header">
        <div className="DAT_EditReport_Header_Left">
          <p style={{ fontSize: "20px" }}>
            {dataLang.formatMessage({ id: "change" })}
          </p>
        </div>

        <div className="DAT_EditReport_Header_Right">
          <div className="DAT_EditReport_Header_Right_Save"
            onClick={() => handleSaveData()}
          >
            <IoSaveOutline size={20} color="white" />
            <span>{dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div className="DAT_EditReport_Header_Right_Close">
            <IoClose size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
              onClick={() => props.handleClose()} />
          </div>
        </div>
      </div>

      <div className="DAT_EditReport_Body">
        <DataReport />
        <div className="DAT_EditReport_Body_Item">
          <div className="DAT_EditReport_Body_Item_Option">
            <label style={{ margin: "0" }}>
              {dataLang.formatMessage({ id: "customOpt" })}
            </label>
            <div className="DAT_EditReport_Body_Item_Option_Check">
              <p style={{ color: "grey" }}>
                {dataLang.formatMessage({ id: "projectInfo" })}
              </p>
              {Object.entries(editData.value.inf).map(([key, value]) => (
                <CheckBox
                  key={key}
                  num={String(key)}
                  tab={"inf_content"}
                  status={editData.value.inf[key].status}
                  id={dataLang.formatMessage({
                    id: editData.value.inf[key].id,
                  })}
                  width={widthCheckBox}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="DAT_EditReport_Body_Item"
          style={{ border: "none" }}
        >
          <div className="DAT_EditReport_Body_Item_Option">
            <label style={{ margin: "0" }}>
              {dataLang.formatMessage({ id: "dataPref" })}
            </label>
            <div className="DAT_EditReport_Body_Item_Option_Check">
              <p style={{ color: "grey" }}>
                {dataLang.formatMessage({ id: "projData" })}
              </p>
              {Object.entries(editData.value.customdata).map(([key, value]) => (
                <CheckBox
                  key={key}
                  num={String(key)}
                  tab={"customdata_content"}
                  status={editData.value.customdata[key].status}
                  id={dataLang.formatMessage({
                    id: editData.value.customdata[key].id,
                  })}
                  width={widthCheckBox}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
