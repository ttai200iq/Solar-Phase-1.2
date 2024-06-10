import React from "react";
import "./Project.scss";

import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import Production from "./Production";
import Consumption from "./Consumption";
import Grid from "./Grid";
import Battery from "./Battery";
import { IoClose } from "react-icons/io5";
import { isBrowser } from "react-device-detect";

export default function Data(props) {
  const dataLang = useIntl();
  const cal = useSelector((state) => state.tool.cal);

  const popup_state = {
    pre: {
      transform: "rotate(0deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
    new: {
      transform: "rotate(90deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const tit = {
    production: "productionData",
    consumption: "consumptionData",
    grid: "grid",
    battery: "batteryData",
  };

  return (
    <>
      {isBrowser
        ?
        <div className="DAT_ProjectData_Dashboard_Data_Left">
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "segoeui-sb",
                fontSize: "19px",
              }}
            >
              {dataLang.formatMessage({ id: tit[props.type] })}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => props.setType("default")}
              >
                <IoClose
                  size={25}
                  id="Popup"
                  onMouseEnter={(e) => handlePopup("new")}
                  onMouseLeave={(e) => handlePopup("pre")}
                />
              </div>
            </div>
            <div
              style={{
                fontFamily: "segoeui",
                color: "grey",
                fontSize: "14px",
              }}
            >
              {(() => {
                switch (props.type) {
                  case "production":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "ProductionDesc" })}
                      </>
                    );
                  case "consumption":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "ConsumptionDesc" })}
                      </>
                    );
                  case "grid":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "GridDesc" })}
                      </>
                    );
                  case "battery":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "BatteryDesc" })} <br />
                        {dataLang.formatMessage({ id: "SoCDesc" })}
                      </>
                    );
                  default:
                    return <></>;
                }
              })()}
            </div>
          </div>

          {(() => {
            switch (props.type) {
              case "production":
                return <Production cal={cal} />;
              case "consumption":
                return <Consumption cal={cal} />;
              case "grid":
                return <Grid cal={cal} />;
              case "battery":
                return <Battery cal={cal} />;
              default:
                <></>;
            }
          })()}
        </div>
        :
        <div className="DAT_ProjectData_Dashboard_Data_LeftMobile">
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "segoeui-sb",
                fontSize: "19px",
              }}
            >
              {dataLang.formatMessage({ id: tit[props.type] })}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => props.setType("default")}
              >
                <IoClose
                  size={25}
                  id="Popup"
                  onMouseEnter={(e) => handlePopup("new")}
                  onMouseLeave={(e) => handlePopup("pre")}
                />
              </div>
            </div>
            <div
              style={{
                fontFamily: "segoeui",
                color: "grey",
                fontSize: "14px",
              }}
            >
              {(() => {
                switch (props.type) {
                  case "production":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "ProductionDesc" })}
                      </>
                    );
                  case "consumption":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "ConsumptionDesc" })}
                      </>
                    );
                  case "grid":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "GridDesc" })}
                      </>
                    );
                  case "battery":
                    return (
                      <>
                        {dataLang.formatMessage({ id: "BatteryDesc" })} <br />
                        {dataLang.formatMessage({ id: "SoCDesc" })}
                      </>
                    );
                  default:
                    return <></>;
                }
              })()}
            </div>
          </div>

          {(() => {
            switch (props.type) {
              case "production":
                return <Production cal={cal} />;
              case "consumption":
                return <Consumption cal={cal} />;
              case "grid":
                return <Grid cal={cal} />;
              case "battery":
                return <Battery cal={cal} />;
              default:
                <></>;
            }
          })()}
        </div>
      }
    </>
  );
}
