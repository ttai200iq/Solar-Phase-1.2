import React, { useEffect, useRef, useState } from "react";
import "./Device.scss";

import { info, tab } from "./Device";
import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";
import BasicInfo from "./BasicInfo";
import VersionInfo from "./VersionInfo";
import OperationInfo from "./OperationInfo";
import Temperature from "./Temperature";
import ElectricityGeneration from "./ElectricityGeneration";
import State from "./State";
import HistoricalData from "./HistoricalData";
import GridStartSettings from "./GridStartSettings";
import GridVolt from "./GridVolt";
import SystemTime from "./SystemTime";
import GridFirst from "./GridFirst";
import BatteryFirst from "./BatteryFirst";
import ExportPowerSettings from "./ExportPowerSettings";
import BatterySettings from "./BatterySettings";
import DeviceSettings from "./DeviceSettings";
import GridInfo from "./GridInfo";
import SingleCommand from "./SingleCommand";
import CustomizedCommand from "./CustomizedCommand";
import ControlLog from "./ControlLog";
import FirmwareUpgrade from "./FirmwareUpgrade";
import UpgradelLog from "./UpgradelLog";
import PowerGrid from "./PowerGrid";
import ElectricityConsumption from "./ElectricityConsumption";
import Control from "./Control";

import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

const viewNav = signal(false);
const viewStateNav = signal([false, false]);

export default function Info(props) {
  const dataLang = useIntl();
  const [dropState, setDropState] = useState(false);
  const [view, setView] = useState("detail");
  const [nav, setNav] = useState("batch");
  const [nav_, setNav_] = useState("firmware");
  const box = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "rgba(11, 25, 103)" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "rgba(11, 25, 103)" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleOutsideDevice = (e) => {
    if (!box.current.contains(e.target)) {
      props.handleClose();
    }
  };

  const handleOutsideView = (e) => {
    setTimeout(() => {
      if (viewStateNav.value[1] == false) {
        viewNav.value = false;
        viewStateNav.value = [false, false];
      }
      clearTimeout();
    }, 250);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideDevice);
    return () => {
      document.removeEventListener("mousedown", handleOutsideDevice);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    console.log(info.value);
  }, []);

  return (
    <div ref={box} style={{ width: "98%", margin: "auto" }}>
      <div className="DAT_Info">
        <div className="DAT_Info_Header">
          <div className="DAT_Info_Header_Left">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px" }}>
              {info.value.pname}: {info.value.psn}
              {tab.value == "logger"
                ? <>
                  {info.value.pstate == 1 ? (
                    <FaCheckCircle size={20} color="green" />
                  ) : (
                    <MdOutlineError size={22} color="red" />
                  )}
                </>
                : <>
                  {info.value.invt?.[info.value.pdata.status] == 2 ? (
                    <FaCheckCircle size={20} color="green" />
                  ) : (
                    <MdOutlineError size={22} color="red" />
                  )}
                </>
              }
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px" }}>
              {(() => {
                switch (tab.value) {
                  case 'logger':
                    return (
                      <div className="DAT_Info_Header_Left_Close" onClick={() => props.handleClose()}>
                        <IoClose
                          id="Popup"
                          onMouseEnter={(e) => handlePopup("new")}
                          onMouseLeave={(e) => handlePopup("pre")}
                          size={25}
                          color="rgba(11, 25, 103)"
                        />
                      </div>
                    )
                  case 'inverter':
                    return (
                      <>
                        <div className="DAT_Info_Header_Left_More">
                          <BsThreeDotsVertical
                            size={20}
                            color="#9e9e9e"
                            onClick={() => {
                              setDropState(!dropState);
                              viewNav.value = true;
                              viewStateNav.value = [true, false];
                            }}
                            onMouseLeave={() => handleOutsideView()}
                          />
                        </div>

                        <div className="DAT_Info_Header_Left_Close" onClick={() => props.handleClose()}>
                          <IoClose
                            id="Popup"
                            onMouseEnter={(e) => handlePopup("new")}
                            onMouseLeave={(e) => handlePopup("pre")}
                            size={25}
                            color="rgba(11, 25, 103)"
                          />
                        </div>
                      </>
                    )
                  default:
                    return <></>
                }
              })()}
            </div>
          </div>

          <div className="DAT_Info_Header_Right">
            {(() => {
              switch (view) {
                case "control":
                  return (
                    <div style={{ display: "flex", alignItems: "center", paddingLeft: isMobile.value ? "0px" : "16px", boxSizing: "border-box" }}>
                      <button className="DAT_Info_Header_Right_Item"
                        id="batch"
                        onClick={() => { setNav("batch") }}
                        style={{ color: nav === "batch" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav === "batch" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "BatchCommand" })}
                      </button>
                      <button className="DAT_Info_Header_Right_Item"
                        id="single"
                        onClick={() => { setNav("single") }}
                        style={{ color: nav === "single" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav === "single" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "SingleCommand" })}
                      </button>
                      {/* <button className="DAT_Info_Header_Right_Item"
                        id="customized"
                        onClick={() => { setNav("customized") }}
                        style={{ color: nav === "customized" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav === "customized" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "CustomizedCommand" })}
                      </button> */}
                      <button className="DAT_Info_Header_Right_Item"
                        id="log"
                        onClick={() => { setNav("log") }}
                        style={{ color: nav === "log" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav === "log" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "ControlLog" })}
                      </button>
                    </div>
                  )
                case "update":
                  return (
                    <div style={{ display: "flex", alignItems: "center", paddingLeft: isMobile.value ? "0px" : "16px", boxSizing: "border-box" }}>
                      <button className="DAT_Info_Header_Right_Item"
                        id="firmware"
                        onClick={() => { setNav_("firmware") }}
                        style={{ color: nav_ === "firmware" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav_ === "firmware" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "FirmwareUpgrade" })}
                      </button>
                      <button className="DAT_Info_Header_Right_Item"
                        id="upgrade"
                        onClick={() => { setNav_("upgrade") }}
                        style={{ color: nav_ === "upgrade" ? "rgba(11, 25, 103)" : "gray", borderBottom: nav_ === "upgrade" ? "solid 2px rgba(11, 25, 103)" : "solid 2px white" }}
                      >
                        {dataLang.formatMessage({ id: "UpdateLog" })}
                      </button>
                    </div>
                  )
                default:
                  return <></>
              }
            })()}
          </div>
        </div>

        {(() => {
          switch (tab.value) {
            case "inverter":
              return (
                <>
                  {(() => {
                    switch (view) {
                      case "control":
                        return (
                          <>
                            {(() => {
                              switch (nav) {
                                case "single":
                                  return (
                                    <SingleCommand />
                                  )
                                case "customized":
                                  return (
                                    <CustomizedCommand />
                                  )
                                case "log":
                                  return (
                                    <ControlLog />
                                  )
                                default:
                                  return (
                                    <>
                                      {(() => {
                                        switch (info.value.pdata.mode) {
                                          case "HYBRID":
                                            return (
                                              <>
                                                <GridStartSettings />
                                                <GridVolt />
                                                <SystemTime />
                                                <GridFirst />
                                                <BatteryFirst />
                                                <ExportPowerSettings />
                                                <DeviceSettings />
                                                <BatterySettings />
                                              </>
                                            )
                                          case "CONSUMPTION":
                                            return (
                                              <>
                                                <GridStartSettings />
                                                <GridVolt />
                                                <ExportPowerSettings />
                                                <DeviceSettings />
                                                <GridInfo />
                                              </>
                                            )
                                          default:
                                            return (
                                              <>
                                                <GridStartSettings />
                                                <GridVolt />
                                                <ExportPowerSettings />
                                                <DeviceSettings />
                                                <GridInfo />
                                              </>
                                            )
                                        }
                                      })()}
                                    </>
                                  )
                              }
                            })()}
                          </>
                        )
                      case "update":
                        return (
                          <>
                            {(() => {
                              switch (nav_) {
                                case "upgrade":
                                  return (
                                    <>
                                      <UpgradelLog />
                                    </>
                                  )
                                default:
                                  return (
                                    <>
                                      <FirmwareUpgrade />
                                    </>
                                  )
                              }
                            })()}
                          </>
                        )
                      default:
                        return (
                          <>
                            <BasicInfo />
                            <VersionInfo />
                            <ElectricityGeneration />
                            {/* <PowerGrid /> */}
                            {/* <ElectricityConsumption /> */}
                            <Temperature />
                            <State />
                            {/* <Control /> */}
                            <HistoricalData />
                          </>
                        )
                    }
                  })()}
                </>
              );
            case "meter":
              return (
                <>
                  <BasicInfo />
                  <VersionInfo />
                </>
              );
            case "logger":
              return (
                <>
                  <BasicInfo />
                  <VersionInfo />
                  <OperationInfo />
                </>
              );
            default:
              return <></>;
          }
        })()}

        {dropState ? (
          <div className="DAT_InfoDrop"
            style={{ display: viewNav.value ? "block" : "none" }}
            onMouseEnter={() => {
              viewStateNav.value = [true, true];
            }}
            onMouseLeave={() => {
              viewNav.value = false;
              viewStateNav.value = [false, false];
            }}
          >
            {(() => {
              switch (view) {
                case "control":
                  return <>
                    <div className="DAT_InfoDrop_Item"
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                      onClick={() => { setView("detail"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'monitor' })}
                    </div>
                    <div className="DAT_InfoDrop_Item"
                      onClick={() => { setView("update"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'update' })}
                    </div>
                  </>
                case "update":
                  return <>
                    <div className="DAT_InfoDrop_Item"
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                      onClick={() => { setView("detail"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'monitor' })}
                    </div>
                    <div className="DAT_InfoDrop_Item"
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                      onClick={() => { setView("control"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'control' })}
                    </div>
                  </>
                default:
                  return <>
                    <div className="DAT_InfoDrop_Item"
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                      onClick={() => { setView("control"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'control' })}
                    </div>
                    <div className="DAT_InfoDrop_Item"
                      onClick={() => { setView("update"); setDropState(false) }}
                    >
                      {dataLang.formatMessage({ id: 'update' })}
                    </div>
                  </>
              }
            })()}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
