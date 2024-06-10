import React from "react";
import "./Project.scss";

import { useIntl } from "react-intl";
import { convertUnit, showUnitk } from "../../App";
import { useSelector } from "react-redux";

export default function Consumption(props) {
  const dataLang = useIntl();
  const month = useSelector((state) => state.tool.month);
  const year = useSelector((state) => state.tool.year);
  const total = useSelector((state) => state.tool.total);

  return (
    <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption">
      <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Data">
        <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Data_Img">
          <img
            src="/dat_icon/smart-house.png"
            alt=""
            style={{ width: "120px", height: "100px" }}
          />
        </div>
        <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Data_Data">
          <div style={{ marginBottom: "8px", color: "grey" }}>
            {dataLang.formatMessage({ id: "consumption" })}
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "32px",
              }}
            >
              {Number(
                parseFloat(convertUnit(props.cal?.con_1 || 0)).toFixed(2)
              ).toLocaleString("en-US")}
            </span>
            &nbsp;
            <span style={{ fontSize: "24px", color: "grey" }}>
              {showUnitk(props.cal?.con_1 || 0)}W
            </span>
          </div>
        </div>
      </div>

      <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Line"></div>

      <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total">
        <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left">
          <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item_Tit">
              {dataLang.formatMessage({ id: "today" })}
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item_Data">
              <span style={{ fontSize: "26px" }}>
                {Number(
                  parseFloat(convertUnit(props.cal?.con_2 || 0)).toFixed(2)
                ).toLocaleString("en-US")}
              </span>
              &nbsp;
              <span style={{ fontSize: "18px", color: "grey" }}>
                {showUnitk(props.cal?.con_2 || 0)}Wh
              </span>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item_Tit">
              {dataLang.formatMessage({ id: "year" })}
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Left_Item_Data">
              <span style={{ fontSize: "26px" }}>
                {Number(
                  parseFloat(convertUnit(year.con_year)).toFixed(2)
                ).toLocaleString("en-US")}
              </span>
              &nbsp;
              <span style={{ fontSize: "18px", color: "grey" }}>
                {showUnitk(year.con_year)}Wh
              </span>
            </div>
          </div>
        </div>

        <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right">
          <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item_Tit">
              {dataLang.formatMessage({ id: "month" })}
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item_Data">
              <span style={{ fontSize: "26px" }}>
                {Number(
                  parseFloat(convertUnit(month.con_month)).toFixed(2)
                ).toLocaleString("en-US")}
              </span>
              &nbsp;
              <span style={{ fontSize: "18px", color: "grey" }}>
                {showUnitk(month.con_month)}Wh
              </span>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item_Tit">
              {dataLang.formatMessage({ id: "total" })}
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Consumption_Total_Right_Item_Data">
              <span style={{ fontSize: "26px" }}>
                {Number(
                  parseFloat(convertUnit(total.con_total)).toFixed(2)
                ).toLocaleString("en-US")}
              </span>
              &nbsp;
              <span style={{ fontSize: "18px", color: "grey" }}>
                {showUnitk(total.con_total)}Wh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
