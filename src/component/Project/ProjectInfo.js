import React from "react";
import "./Project.scss";

import { useIntl } from "react-intl";
import { projectData } from "./Project";
import { convertUnit, showUnitk } from "../../App";
import { isBrowser } from "react-device-detect";

export default function ProjectInfo(props) {
  const dataLang = useIntl();

  return (
    <div className="DAT_ProjectData_NewDashboard_More_Left">
      {isBrowser ?
        <>
          <div className="DAT_ProjectData_NewDashboard_More_Left_Tit">
            <span>{dataLang.formatMessage({ id: "projectInfo" })}</span>
          </div>

          <div className="DAT_ProjectData_NewDashboard_More_Left_Content">
            <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left">
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                  {dataLang.formatMessage({ id: "companyName" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                  {projectData.value.business}
                </div>
              </div>

              {/* Type */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                  {dataLang.formatMessage({ id: "projType" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                  {projectData.value.planttype === "industrial" ? (
                    <>{dataLang.formatMessage({ id: "factory" })}</>
                  ) : (
                    <>{dataLang.formatMessage({ id: "household" })}</>
                  )}
                </div>
              </div>

              {/* Capacity */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                  {dataLang.formatMessage({ id: "inCapacity" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                  <div>
                    <span>
                      {Number(
                        parseFloat(convertUnit(projectData.value.capacity)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "12px" }}>
                      {showUnitk(projectData.value.capacity)}Wp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right">
              {/* Contact Name */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                  {dataLang.formatMessage({ id: "contactName" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                  {projectData.value.contact}
                </div>
              </div>

              {/* Contact Number*/}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                  {dataLang.formatMessage({ id: "phone" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                  {projectData.value.phone}
                </div>
              </div>

              {/* Address */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                  {dataLang.formatMessage({ id: "address" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                  {projectData.value.addr}
                </div>
              </div>
            </div>
          </div>
        </>
        :
        <>
          INFO
        </>
      }

    </div>
  );
}
