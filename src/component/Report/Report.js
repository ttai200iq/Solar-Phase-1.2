import React, { useEffect, useState } from "react";
import "./Report.scss";

import { signal } from "@preact/signals-react";
import Create from "./Create";
import ReportEdit from "./ReportEdit";
import Popup from "./Popup";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { ruleInfor, userInfor } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";

import { HiOutlineDocumentReport } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePostAdd } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { isBrowser, useMobileOrientation } from "react-device-detect";

export const editData = signal({});
export const idReport = signal(0);
export const lastID = signal(2);
export const ReportData = signal([]);

export default function Report(props) {
  const dataLang = useIntl();
  const { isLandscape } = useMobileOrientation();
  const usr = useSelector((state) => state.admin.usr);
  const [viewState, setViewState] = useState("default");
  const [popupState, setPopupState] = useState(false);

  const handleDeleteReport = (e) => {
    setPopupState(true);
    idReport.value = e.currentTarget.id;
  };

  const handleCloseDel = () => {
    setPopupState(false);
  };

  const handleEditReport = (e) => {
    setViewState("edit");
    editData.value = ReportData.value.find(
      (item) => item.id == e.currentTarget.id
    ); //[{},{},{},{}] filrter [{}], find =>{}
  };

  const handleCloseView = () => {
    setViewState("default");
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
      }
    };
    getReport();
  }, []);

  return (
    <>
      {isBrowser
        ?
        <div
          style={{
            position: "relative",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="DAT_Header">
            <div className="DAT_Header_Title">
              <HiOutlineDocumentReport color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "report" })}</span>
            </div>
            {ruleInfor.value.setting.report.add ? (
              <button
                className="DAT_Header_New"
                onClick={() => setViewState("create")}
              >
                <span>
                  <MdOutlinePostAdd color="white" size={20} />
                  &nbsp;
                  {dataLang.formatMessage({ id: "createReport" })}
                </span>
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="DAT_Report"
          // style={{ height: isBrowser ? "82vh" : "72vh" }}
          >
            <div className="DAT_Report_List">
              {ReportData.value.map((item, i) => {
                return (
                  <div className="DAT_Report_List_Form" key={i}>
                    <div className="DAT_Report_List_Form_Title">{item.name}</div>
                    <div className="DAT_Report_List_Form_Type">
                      {dataLang.formatMessage({ id: "type" })}:{" "}
                      {item.type === 'solarLight' ? 'Solar light' : dataLang.formatMessage({ id: item.type })}
                    </div>
                    <div className="DAT_Report_List_Form_Create">
                      {dataLang.formatMessage({ id: "createBy" })}: {item.createby}
                    </div>
                    <div className="DAT_Report_List_Form_Date">
                      {dataLang.formatMessage({ id: "createdate" })}: {item.date}
                    </div>
                    <div className="DAT_Report_List_Form_Custom">
                      {ruleInfor.value.setting.report.modify ? (
                        <div
                          className="DAT_Report_List_Form_Custom_Edit"
                          id={item.id}
                          onClick={(e) => handleEditReport(e)}
                        >
                          <CiEdit
                            style={{ cursor: "pointer" }}
                            color="gray"
                            size={20}
                            id={item.id}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {ruleInfor.value.setting.report.remove ? (
                        <div
                          className="DAT_Report_List_Form_Custom_Remove"
                          id={item.id}
                          onClick={(e) => handleDeleteReport(e)}
                        >
                          <IoTrashOutline
                            style={{ cursor: "pointer" }}
                            color="red"
                            size={18}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="DAT_ViewPopup"
            style={{
              height: viewState === "default" ? "0px" : "100vh",
              transition: "0.5s",
            }}
          >
            {(() => {
              switch (viewState) {
                case "create":
                  return <Create handleClose={handleCloseView} />;
                case "edit":
                  return <ReportEdit handleClose={handleCloseView} />;
                default:
                  return <></>;
              }
            })()}
          </div>

          {popupState ? (
            <div className="DAT_PopupBG">
              <Popup handleClose={handleCloseDel} />
            </div>
          ) : (
            <></>
          )}
        </div>
        :
        <>
          <div className="DAT_Header">
            <div className="DAT_Header_Title">
              <HiOutlineDocumentReport color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "report" })}</span>
            </div>
            {ruleInfor.value.setting.report.add ? (
              <button
                className="DAT_Header_New"
                onClick={() => setViewState("create")}
              >
                <span>
                  <MdOutlinePostAdd color="white" size={20} />
                  &nbsp;
                  {dataLang.formatMessage({ id: "createReport" })}
                </span>
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="DAT_ReportMobile">
            <div className="DAT_ReportMobile_List"
              style={{ marginBottom: isLandscape ? "30px" : "100px" }}
            >
              {ReportData.value.map((item, i) => {
                return (
                  <div className="DAT_ReportMobile_List_Form" key={i}>
                    <div className="DAT_ReportMobile_List_Form_Title">{item.name}</div>
                    <div className="DAT_ReportMobile_List_Form_Type">
                      {dataLang.formatMessage({ id: "type" })}:{" "}
                      {item.type === 'solarLight' ? 'Solar light' : dataLang.formatMessage({ id: item.type })}
                    </div>
                    <div className="DAT_ReportMobile_List_Form_Create">
                      {dataLang.formatMessage({ id: "createBy" })}: {item.createby}
                    </div>
                    <div className="DAT_ReportMobile_List_Form_Date">
                      {dataLang.formatMessage({ id: "createdate" })}: {item.date}
                    </div>
                    <div className="DAT_ReportMobile_List_Form_Custom">
                      {ruleInfor.value.setting.report.modify ? (
                        <div
                          className="DAT_ReportMobile_List_Form_Custom_Edit"
                          id={item.id}
                          onClick={(e) => handleEditReport(e)}
                        >
                          <CiEdit
                            style={{ cursor: "pointer" }}
                            color="gray"
                            size={20}
                            id={item.id}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {ruleInfor.value.setting.report.remove ? (
                        <div
                          className="DAT_ReportMobile_List_Form_Custom_Remove"
                          id={item.id}
                          onClick={(e) => handleDeleteReport(e)}
                        >
                          <IoTrashOutline
                            style={{ cursor: "pointer" }}
                            color="red"
                            size={18}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="DAT_ViewPopupMobile"
            style={{
              height: viewState === "default" ? "0px" : "100vh",
              transition: "0.5s",
            }}
          >
            {(() => {
              switch (viewState) {
                case "create":
                  return <Create handleClose={handleCloseView} />;
                case "edit":
                  return <ReportEdit handleClose={handleCloseView} />;
                default:
                  return <></>;
              }
            })()}
          </div>

          {popupState ? (
            <div className="DAT_PopupBGMobile">
              <Popup handleClose={handleCloseDel} />
            </div>
          ) : (
            <></>
          )}
        </>
      }


    </>
  );
}
