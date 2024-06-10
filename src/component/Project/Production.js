import React, { useEffect, useState } from "react";
import "./Project.scss";

import { useIntl } from "react-intl";
import { projectData } from "./Project";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { convertUnit, showUnit, showUnitk } from "../../App";
import { useSelector } from "react-redux";
import { isBrowser } from "react-device-detect";

export default function Production(props) {
  const dataLang = useIntl();
  const month = useSelector((state) => state.tool.month);
  const year = useSelector((state) => state.tool.year);
  const in_max = 100;
  const in_min = 0;
  const out_max = -10;
  const out_min = 140;
  const [per, setPer] = useState(0);

  const mapValue = (data, in_min, in_max, out_min, out_max) => {
    return (
      ((data - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };

  useEffect(() => {
    let result = parseFloat(
      ((props.cal?.pro_1 / 1000 || 0) / projectData.value.capacity) * 100
    );

    setPer(mapValue(result, in_min, in_max, out_min, out_max));
  }, [props.cal.pro_1]);

  const keyframes = `
    @keyframes plant {
      0% { background-position: -1200px ${parseFloat(
    per
  )}px, -800px ${per}px, -400px ${per}px}
      100% { background-position: 200px ${parseFloat(
    per
  )}px;, 100x ${per}px, 0px ${per}px}
    }`;

  const divStyle = {
    animationName: "plant",
    animationDuration: "30s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  };

  return (
    <>
      {isBrowser
        ?
        <div className="DAT_ProjectData_Dashboard_Data_Center_Production">
          <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Icon">
              <img
                src="/dat_icon/solar-cell.png"
                alt=""
                style={{ width: "110px", height: "100px" }}
              />
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Chart">
              <div
                className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Chart_Data"
                style={divStyle}
              >
                <style>{keyframes}</style>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Chart_Data_value">
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Chart_Data_value_num">
                    {Number(
                      parseFloat(
                        ((props.cal?.pro_1 / 1000 || 0) /
                          projectData.value.capacity) *
                        100
                      ).toFixed(2)
                    ).toLocaleString("en-US")}
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Chart_Data_value_unit">
                    %
                  </div>
                </div>
              </div>

              <div
                className="DAT_Home_Overview-Main-Percent-Icon"
                style={{ cursor: "pointer" }}
              >
                <PopupState variant="popper" popupId="demo-popup-popper">
                  {(popupState) => (
                    <div style={{ cursor: "pointer" }}>
                      <HelpOutlineIcon
                        {...bindHover(popupState)}
                        color="action"
                        fontSize="9px"
                      />
                      <Popper {...bindPopper(popupState)} transition>
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper
                              sx={{ width: "400px", marginLeft: "235px", p: 2 }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  textAlign: "justify",
                                  marginBottom: 1.7,
                                }}
                              >
                                {dataLang.formatMessage({ id: "overview1" })}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  textAlign: "justify",
                                  marginBottom: 1.7,
                                }}
                              >
                                {dataLang.formatMessage({ id: "overview2" })}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "12px", textAlign: "justify" }}
                              >
                                {dataLang.formatMessage({ id: "overview3" })}
                              </Typography>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </div>
                  )}
                </PopupState>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Detail">
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "production" })}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "32px",
                  }}
                >
                  {Number(
                    parseFloat(convertUnit((props.cal?.pro_1 || 0) / 1000)).toFixed(
                      2
                    )
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnit((props.cal?.pro_1 || 0) / 1000)}W
                </span>
              </div>
              <div
                style={{
                  borderBottom: "solid 1px rgb(199, 199, 199)",
                  width: "50%",
                  marginBottom: "8px",
                }}
              />
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "inCapacity" })}
              </div>
              <div>
                <span
                  style={{
                    fontSize: "32px",
                  }}
                >
                  {Number(
                    parseFloat(convertUnit(projectData.value.capacity)).toFixed(2)
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnitk(projectData.value.capacity)}Wp
                </span>
              </div>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Line"></div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item_Tit">
                  {dataLang.formatMessage({ id: "today" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(props.cal?.pro_2 || 0)).toFixed(2)
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(props.cal?.pro_2 || 0)}Wh
                  </span>
                </div>
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item_Tit">
                  {dataLang.formatMessage({ id: "year" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Left_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(parseFloat(convertUnit(year.pro_year))).toLocaleString(
                      "en-US"
                    )}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(year.pro_year)}Wh
                  </span>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right">
              <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item_Tit">
                  {dataLang.formatMessage({ id: "month" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(month.pro_month))
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(month.pro_month)}Wh
                  </span>
                </div>
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item_Tit">
                  {dataLang.formatMessage({ id: "total" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Total_Right_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(props.cal?.pro_3 || 0))
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(props.cal?.pro_3 || 0)}Wh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile">
          <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data">
            <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top">
              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Icon">
                <img
                  src="/dat_icon/solar-cell.png"
                  alt=""
                  style={{ width: "110px", height: "100px" }}
                />
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Chart"
                style={{ marginTop: isBrowser ? "24px" : "0px" }}
              >
                <div
                  className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Chart_Data"
                  style={divStyle}
                >
                  <style>{keyframes}</style>
                  <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Chart_Data_value">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Chart_Data_value_num">
                      {Number(
                        parseFloat(
                          ((props.cal?.pro_1 / 1000 || 0) /
                            projectData.value.capacity) *
                          100
                        ).toFixed(2)
                      ).toLocaleString("en-US")}
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Top_Chart_Data_value_unit">
                      %
                    </div>
                  </div>
                </div>

                <div
                  className="DAT_Home_Overview-Main-Percent-Icon"
                  style={{ cursor: "pointer" }}
                >
                  <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                      <div style={{ cursor: "pointer" }}>
                        <HelpOutlineIcon
                          {...bindHover(popupState)}
                          color="action"
                          fontSize="9px"
                        />
                        <Popper {...bindPopper(popupState)} transition>
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                              <Paper
                                sx={{ width: "400px", marginLeft: "235px", p: 2 }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    textAlign: "justify",
                                    marginBottom: 1.7,
                                  }}
                                >
                                  {dataLang.formatMessage({ id: "overview1" })}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    textAlign: "justify",
                                    marginBottom: 1.7,
                                  }}
                                >
                                  {dataLang.formatMessage({ id: "overview2" })}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "12px", textAlign: "justify" }}
                                >
                                  {dataLang.formatMessage({ id: "overview3" })}
                                </Typography>
                              </Paper>
                            </Fade>
                          )}
                        </Popper>
                      </div>
                    )}
                  </PopupState>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Data_Detail">
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "production" })}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "32px",
                  }}
                >
                  {Number(
                    parseFloat(convertUnit((props.cal?.pro_1 || 0) / 1000)).toFixed(
                      2
                    )
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnit((props.cal?.pro_1 || 0) / 1000)}W
                </span>
              </div>
              <div
                style={{
                  borderBottom: "solid 1px rgb(199, 199, 199)",
                  width: "50%",
                  marginBottom: "8px",
                }}
              />
              <div style={{ marginBottom: "8px", color: "grey" }}>
                {dataLang.formatMessage({ id: "inCapacity" })}
              </div>
              <div>
                <span
                  style={{
                    fontSize: "32px",
                  }}
                >
                  {Number(
                    parseFloat(convertUnit(projectData.value.capacity)).toFixed(2)
                  ).toLocaleString("en-US")}
                </span>
                &nbsp;
                <span style={{ fontSize: "24px", color: "grey" }}>
                  {showUnitk(projectData.value.capacity)}Wp
                </span>
              </div>
            </div>
          </div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Line"></div>

          <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total">
            <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left">
              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item_Tit">
                  {dataLang.formatMessage({ id: "today" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(props.cal?.pro_2 || 0)).toFixed(2)
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(props.cal?.pro_2 || 0)}Wh
                  </span>
                </div>
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item_Tit">
                  {dataLang.formatMessage({ id: "year" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Left_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(parseFloat(convertUnit(year.pro_year))).toLocaleString(
                      "en-US"
                    )}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(year.pro_year)}Wh
                  </span>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right">
              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item_Tit">
                  {dataLang.formatMessage({ id: "month" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(month.pro_month))
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(month.pro_month)}Wh
                  </span>
                </div>
              </div>

              <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item">
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item_Tit">
                  {dataLang.formatMessage({ id: "total" })}
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_ProductionMobile_Total_Right_Item_Data">
                  <span style={{ fontSize: "26px" }}>
                    {Number(
                      parseFloat(convertUnit(props.cal?.pro_3 || 0))
                    ).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "18px", color: "grey" }}>
                    {showUnitk(props.cal?.pro_3 || 0)}Wh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
