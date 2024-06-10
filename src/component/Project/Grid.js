import React from "react";
import "./Project.scss";

import { useIntl } from "react-intl";
import { convertUnit, showUnit, showUnitk } from "../../App";
import { useSelector } from "react-redux";
import { isBrowser } from "react-device-detect";

export default function Grid(props) {
  const dataLang = useIntl();
  const month = useSelector((state) => state.tool.month);
  const year = useSelector((state) => state.tool.year);

  return (
    <>
      {isBrowser
        ?
        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid">
          <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data_Img">
              <img
                src="/dat_icon/electric-pole.png"
                alt=""
                style={{ width: "90px", height: "100px" }}
              />
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data_Data">
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "gridData_" })}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "32px",
                    color: props.cal?.grid_1 < 0 ? "red" : "black",
                  }}
                >
                  {Number(
                    parseFloat(
                      convertUnit(Math.abs(props.cal?.grid_1 || 0) / 1000)
                    ).toFixed(2)
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnit(props.cal?.grid_1 || 0)}W
                </span>
              </div>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Line"></div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit">
                {dataLang.formatMessage({ id: "gridfeed" })}
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "today" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      {Number(
                        parseFloat(convertUnit(props.cal?.grid_in_1 || 0)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(props.cal?.grid_in_1 || 0)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "month" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      {Number(
                        parseFloat(convertUnit(month.grid_in_month)).toFixed(2)
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(month.grid_in_month)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "year" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      {Number(
                        parseFloat(convertUnit(year.grid_in_year)).toFixed(2)
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(year.grid_in_year)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "total" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      {Number(
                        parseFloat(convertUnit(props.cal?.grid_in_2 || 0)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(props.cal?.grid_in_2 || 0)}Wh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit">
                {dataLang.formatMessage({ id: "purchaseE" })}
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "today" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span style={{ fontSize: "26px" }}>
                      {Number(
                        parseFloat(convertUnit(props.cal?.grid_out_1 || 0)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(props.cal?.grid_out_1 || 0)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "month" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span style={{ fontSize: "26px" }}>
                      {Number(
                        parseFloat(convertUnit(month.grid_out_month)).toFixed(2)
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(month.grid_out_month)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "year" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span style={{ fontSize: "26px" }}>
                      {Number(
                        parseFloat(convertUnit(year.grid_out_year)).toFixed(2)
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(year.grid_out_year)}Wh
                    </span>
                  </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                    {dataLang.formatMessage({ id: "total" })}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                    <span style={{ fontSize: "26px" }}>
                      {Number(
                        parseFloat(convertUnit(props.cal?.grid_out_2 || 0)).toFixed(
                          2
                        )
                      ).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "18px", color: "grey" }}>
                      {showUnitk(props.cal?.grid_out_2 || 0)}Wh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile">
          <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Data">
            <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Data_Img">
              <img
                src="/dat_icon/electric-pole.png"
                alt=""
                style={{ width: "90px", height: "100px" }}
              />
            </div>
            <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Data_Data">
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "GridMobileData_" })}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "32px",
                    color: props.cal?.grid_1 < 0 ? "red" : "black",
                  }}
                >
                  {Number(
                    parseFloat(
                      convertUnit(Math.abs(props.cal?.grid_1 || 0) / 1000)
                    ).toFixed(2)
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnit(props.cal?.grid_1 || 0)}W
                </span>
              </div>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Line"></div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row">
            <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Tit"
                style={{ borderBottom: "solid 1px rgba(198, 197, 197, 0.5)" }}
              >
                {dataLang.formatMessage({ id: "gridfeed" })}
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data">
                <div style={{ flex: "5" }}>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "today" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span
                        style={{
                          fontSize: "26px",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(props.cal?.grid_in_1 || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(props.cal?.grid_in_1 || 0)}Wh
                      </span>
                    </div>
                  </div>

                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "month" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span
                        style={{
                          fontSize: "26px",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(month.grid_in_month)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(month.grid_in_month)}Wh
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: "5" }}>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "year" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span
                        style={{
                          fontSize: "26px",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(year.grid_in_year)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(year.grid_in_year)}Wh
                      </span>
                    </div>
                  </div>

                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "total" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span
                        style={{
                          fontSize: "26px",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(props.cal?.grid_in_2 || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(props.cal?.grid_in_2 || 0)}Wh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Tit"
                style={{ borderBottom: "solid 1px rgba(198, 197, 197, 0.5)" }}
              >
                {dataLang.formatMessage({ id: "purchaseE" })}
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data">
                <div style={{ flex: "5" }}>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "today" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span style={{ fontSize: "26px" }}>
                        {Number(
                          parseFloat(convertUnit(props.cal?.grid_out_1 || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(props.cal?.grid_out_1 || 0)}Wh
                      </span>
                    </div>
                  </div>

                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "month" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span style={{ fontSize: "26px" }}>
                        {Number(
                          parseFloat(convertUnit(month.grid_out_month)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(month.grid_out_month)}Wh
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: "5" }}>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "year" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span style={{ fontSize: "26px" }}>
                        {Number(
                          parseFloat(convertUnit(year.grid_out_year)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(year.grid_out_year)}Wh
                      </span>
                    </div>
                  </div>

                  <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Tit">
                      {dataLang.formatMessage({ id: "total" })}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_GridMobile_Row_Left_Data_Item_Data">
                      <span style={{ fontSize: "26px" }}>
                        {Number(
                          parseFloat(convertUnit(props.cal?.grid_out_2 || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span style={{ fontSize: "18px", color: "grey" }}>
                        {showUnitk(props.cal?.grid_out_2 || 0)}Wh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
