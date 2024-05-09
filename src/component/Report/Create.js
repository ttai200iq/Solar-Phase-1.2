import React, { useEffect, useRef, useState } from "react";
import "./Report.scss";

import { ReportData } from "./Report";
import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { userInfor } from "../../App";
import { alertDispatch } from "../Alert/Alert";

import { IoClose, IoSaveOutline } from "react-icons/io5";

const newdata = signal({
  id: 1,
  name: "",
  type: "",
  create: "",
  date: "",
  inf: {
    1: { id: "projname", status: false },
    2: { id: "address", status: false },
    3: { id: "coord", status: false },
    4: { id: "projType", status: false },
    5: { id: "inCapacity", status: false },
    6: { id: "tiltAngle", status: false },
    7: { id: "electricType", status: false },
    // 8: { id: "gridData", status: false },
    // 9: { id: "currency", status: false },
    10: { id: "unitPrice", status: false },
    11: { id: "contactName", status: false },
    12: { id: "phone", status: false },
    13: { id: "companyName", status: false },
  },
  customdata: {
    value: { id: "production", status: false },
    value2: { id: "grid", status: false },
    value3: { id: "consumption", status: false },
    value4: { id: "batteryData", status: false },
  },
});

const temp = signal(newdata.value);

const show = signal({ id: "none", status: false });

export const CheckBox = (props) => {
  const handleShow = (e) => {
    let arr = props.tab.split("_");
    switch (arr[1]) {
      case "content":
        newdata.value = {
          ...newdata.value,
          [arr[0]]: {
            ...newdata.value[arr[0]],
            [props.num]: {
              ...newdata.value[arr[0]][props.num],
              status: e.target.checked,
            },
          },
        };
        break;
      case "option":
        newdata.value = {
          ...newdata.value,
          [arr[0]]: {
            ...newdata.value[arr[0]],
            option: {
              ...newdata.value[arr[0]].option,
              [props.num]: {
                ...newdata.value[arr[0]].option[props.num],
                status: e.target.checked,
              },
            },
          },
        };
        break;
      case "tit":
        newdata.value = {
          ...newdata.value,
          [arr[0]]: {
            ...newdata.value[arr[0]],
            status: e.target.checked,
          },
        };
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="DAT_Create_Body_Item_Option_Check_SingleCheck"
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

export default function Create(props) {
  const dataLang = useIntl();
  const [widthCheckBox, setWidwidthCheckBox] = useState("");
  const [reportType, setReportType] = useState("dailyReport");
  const reportnameRef = useRef("");
  //DAT_MASTER
  const usr = useSelector((state) => state.admin.usr);

  const TypeReport = (props) => {
    const dataLang = useIntl();

    const handerChangeReportName = (e) => {
      reportnameRef.current = e.target.value;
      //document.getElementById("reportname").value = e.target.value
    };

    return (
      <div className="DAT_Create_Body_Item">
        <div className="DAT_Create_Body_Item_Data">
          {(() => {
            switch (reportType) {
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

          <div className="DAT_Create_Body_Item_Data_Name">
            <label>{dataLang.formatMessage({ id: "reportName" })}: </label>
            <input
              type="text"
              placeholder={dataLang.formatMessage({ id: "required" })}
              required
              //ref={reportnameRef}
              id="reportname"
              defaultValue={reportnameRef.current}
              // value={newdata.value.name}
              onChange={(e) => handerChangeReportName(e)}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleCreate = async () => {
    const today = new Date();
    if (reportnameRef.current === "") {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
    } else {
      const addReport = await callApi("post", host.DATA + "/addReport", {
        usr: usr,
        partnerid: userInfor.value.partnerid,
        name: reportnameRef.current,
        type: reportType,
        date: moment(today).format("MM/DD/YYYY HH:mm:ss"),
        createby: userInfor.value.name,
        inf: JSON.stringify(newdata.value.inf),
        customdata: JSON.stringify(newdata.value.customdata),
      });
      if (addReport.status) {
        // lastID.value = lastID.value + 1;
        newdata.value = {
          ...newdata.value,
          name: reportnameRef.current,
          type: reportType,
          id: addReport.id,
          date: moment(today).format("MM/DD/YYYY HH:mm:ss"),
        };
        ReportData.value.push(newdata.value);
        alertDispatch(dataLang.formatMessage({ id: "alert_40" }));
        //BAT TAT TRANG
        props.handleClose();

        newdata.value = temp.value;
      }
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

  const handleDataType = (e) => {
    setReportType(e.currentTarget.value);
    if (e.currentTarget.value === "dailyReport") {
      newdata.value = {
        ...newdata.value,
        customdata: {
          value: { id: "production", status: false },
          value2: { id: "grid", status: false },
          value3: { id: "consumption", status: false },
          value4: { id: "batteryData", status: false },
          // 6: { id: "weatherinfo", status: false },
          // 7: { id: "kWhonkWp", status: false },
        },
      }

    } else {
      newdata.value = {
        ...newdata.value,
        customdata: {
          value: { id: "production", status: true },
          value2: { id: "consumption", status: false },
          value3: { id: "gridfeed", status: false },
          value4: { id: "purchaseE", status: false },
          value5: { id: "charge", status: false },
          value6: { id: "discharge", status: false },
        },
      }
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
    <div className="DAT_Create">
      <div className="DAT_Create_Header">
        <div className="DAT_Create_Header_Left">
          <p style={{ fontSize: "20px" }}>
            {dataLang.formatMessage({ id: "createReport" })}
          </p>
        </div>
        <div className="DAT_Create_Header_Right">
          <div
            className="DAT_Create_Header_Right_Save"
            onClick={() => handleCreate()}
          >
            <IoSaveOutline size={20} color="white" />
            <span>{dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div
            className="DAT_Create_Header_Right_Close"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_Create_Body">
        <div className="DAT_Create_Body_Item">
          <div className="DAT_Create_Body_Item_Type">
            <h4>{dataLang.formatMessage({ id: "reportType" })}</h4>
            <select
              className="form-select form-select-sm mt-3"
              defaultValue={"dailyReport"}
              onChange={(e) => {
                handleDataType(e);
              }}
            >
              <option value={"dailyReport"}>
                {dataLang.formatMessage({ id: "dailyReport" })}
              </option>
              <option value={"monthlyReport"}>
                {dataLang.formatMessage({ id: "monthlyReport" })}
              </option>
              <option value={"yearlyReport"}>
                {dataLang.formatMessage({ id: "yearlyReport" })}
              </option>
              <option value={"totalReport"}>
                {dataLang.formatMessage({ id: "totalReport" })}
              </option>
            </select>
          </div>
        </div>

        <TypeReport />

        <div className="DAT_Create_Body_Item">
          <div className="DAT_Create_Body_Item_Option">
            <label style={{ margin: "0" }}>
              {dataLang.formatMessage({ id: "customOpt" })}
            </label>
            <div className="DAT_Create_Body_Item_Option_Check">
              <p style={{ color: "grey" }}>
                {dataLang.formatMessage({ id: "reportprojectitem" })}
              </p>
              {Object.entries(newdata.value.inf).map(([key, value]) => (
                <CheckBox
                  key={key}
                  num={String(key)}
                  tab="inf_content"
                  status={newdata.value.inf[key].status}
                  id={dataLang.formatMessage({
                    id: newdata.value.inf[key].id,
                  })}
                  width={widthCheckBox}
                />
              ))}
            </div>

            {/* <div className="DAT_Create_Body_Item_Option_Check"
                style={{
                  border: newdata.value.subinf.status
                    ? "1px solid grey"
                    : "0px",
                  paddingBottom: newdata.value.subinf.status ? "20px" : "0",
                  transition: "0.5s",
                }}
              >
                <div className="DAT_Create_Body_Item_Option_Check_Head">
                  <CheckBox
                    tab="subinf_tit"
                    id={newdata.value.subinf.id}
                    status={newdata.value.subinf.status}
                    width="fit-content"
                  />
                </div>
                {newdata.value.subinf.status ? (
                  <>
                    {Object.entries(newdata.value.subinf.option).map(
                      ([key, value]) => (
                        <CheckBox
                          key={key}
                          num={String(key)}
                          tab="subinf_option"
                          status={newdata.value.subinf.option[key].status}
                          id={newdata.value.subinf.option[key].id}
                          width={widthCheckBox}
                        />
                      )
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="DAT_Create_Body_Item_Option_Check"
                style={{
                  border: newdata.value.deviceinfo.status
                    ? "1px solid grey"
                    : "0px",
                  paddingBottom: newdata.value.deviceinfo.status ? "20px" : "0",
                  transition: "0.5s",
                }}
              >
                <div className="DAT_Create_Body_Item_Option_Check_Head">
                  <CheckBox
                    tab="deviceinfo_tit"
                    id={newdata.value.deviceinfo.id}
                    status={newdata.value.deviceinfo.status}
                    width="fit-content"
                  />
                </div>
                {newdata.value.deviceinfo.status ? (
                  <>
                    {Object.entries(newdata.value.deviceinfo.option).map(
                      ([key, value]) => (
                        <CheckBox
                          key={key}
                          num={String(key)}
                          tab="deviceinfo_option"
                          status={newdata.value.deviceinfo.option[key].status}
                          id={newdata.value.deviceinfo.option[key].id}
                          width={widthCheckBox}
                        />
                      )
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div> */}
          </div>
        </div>

        <div className="DAT_Create_Body_Item"
          style={{ border: "none" }}
        >
          <div className="DAT_Create_Body_Item_Option">
            <label style={{ margin: "0" }}>
              {dataLang.formatMessage({ id: "dataPref" })}
            </label>
            <div className="DAT_Create_Body_Item_Option_Check">
              <p style={{ color: "grey" }}>
                {dataLang.formatMessage({ id: "projData" })}
              </p>
              {Object.entries(newdata.value.customdata).map(
                ([key, value]) => (
                  <CheckBox
                    key={key}
                    num={String(key)}
                    tab="customdata_content"
                    status={newdata.value.customdata[key].status}
                    id={dataLang.formatMessage({
                      id: newdata.value.customdata[key].id,
                    })}
                    width={widthCheckBox}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
