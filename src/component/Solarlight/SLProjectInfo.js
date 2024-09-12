import React from "react";

import { useIntl } from "react-intl";
import { convertUnit, showUnitk } from "../../App";
import { isBrowser } from "react-device-detect";
import { isDesktop } from "../Home/Home";
import { slProjectData } from "./SLProjectlist";

export default function SLProjectInfo(props) {
  const dataLang = useIntl();

  return (
    <>
      {isBrowser ?
        isDesktop.value
          ?
          <div className="DAT_ProjectData_NewDashboard_More_Left">
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
                    {slProjectData.value.business}
                  </div>
                </div>

                {/* Type */}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                    {dataLang.formatMessage({ id: "projType" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                    {slProjectData.value.planttype === "industrial" ? (
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
                          parseFloat(convertUnit(slProjectData.value.capacity)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "12px" }}>
                        {showUnitk(slProjectData.value.capacity)}Wp
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
                    {slProjectData.value.contact}
                  </div>
                </div>

                {/* Contact Number*/}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                    {dataLang.formatMessage({ id: "phone" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                    {slProjectData.value.phone}
                  </div>
                </div>

                {/* Address */}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item"
                  style={{ paddingBottom: "15px" }}
                >
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                    {dataLang.formatMessage({ id: "address" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                    {slProjectData.value.addr}
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="DAT_ProjectData_NewDashboard_More_Left">
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
                    {slProjectData.value.business}
                  </div>
                </div>

                {/* Type */}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                    {dataLang.formatMessage({ id: "projType" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                    {slProjectData.value.planttype === "industrial" ? (
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
                          parseFloat(convertUnit(slProjectData.value.capacity)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "12px" }}>
                        {showUnitk(slProjectData.value.capacity)}Wp
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
                    {slProjectData.value.contact}
                  </div>
                </div>

                {/* Contact Number*/}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                    {dataLang.formatMessage({ id: "phone" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                    {slProjectData.value.phone}
                  </div>
                </div>

                {/* Address */}
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item"
                  style={{ paddingBottom: "15px" }}
                >
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                    {dataLang.formatMessage({ id: "address" })}:
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                    {slProjectData.value.addr}
                  </div>
                </div>
              </div>
            </div>
          </div>
        :
        <div className="DAT_ProjectData_NewDashboard_More_Left">
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
                  {slProjectData.value.business}
                </div>
              </div>

              {/* Type */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Title">
                  {dataLang.formatMessage({ id: "projType" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Left_Item_Content">
                  {slProjectData.value.planttype === "industrial" ? (
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
                        parseFloat(convertUnit(slProjectData.value.capacity)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "12px" }}>
                      {showUnitk(slProjectData.value.capacity)}Wp
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
                  {slProjectData.value.contact}
                </div>
              </div>

              {/* Contact Number*/}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item">
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                  {dataLang.formatMessage({ id: "phone" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                  {slProjectData.value.phone}
                </div>
              </div>

              {/* Address */}
              <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item"
                style={{ paddingBottom: "15px" }}
              >
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Title">
                  {dataLang.formatMessage({ id: "address" })}:
                </div>
                <div className="DAT_ProjectData_NewDashboard_More_Left_Content_Right_Item_Content">
                  {slProjectData.value.addr}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
