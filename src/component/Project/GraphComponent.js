import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Project.scss";

import { projectData } from './Project';
import { useIntl } from 'react-intl';
import { CiClock1 } from 'react-icons/ci';
import { FcAlarmClock } from "react-icons/fc";
import Graph from './Graph';
import { useSelector } from 'react-redux';
import { signal } from "@preact/signals-react";
const second = signal(0);

export default function GraphComponent(props) {
    const dataLang = useIntl();
    const cal = useSelector((state) => state.tool.cal);
    const intervalIDRef = useReducer(null);
    const dashArray = 10 * Math.PI * 2;
    const max = 258


    useEffect(function () {


        second.value = 0
        const startTimer = () => {

            intervalIDRef.current = setInterval(() => {
                second.value = second.value + 1

                if (second.value === max) {
                    second.value = 0
                }
            }, 1000);
        };

        const stopTimer = () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
        };

        if (projectData.value.state) {
            startTimer();
        }


        return () => {

            stopTimer();

        }

    }, [cal])


    return (
        <div className="DAT_ProjectData_Dashboard_Data_Center">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Tit">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Tit_Item">
                    {(() => {
                        switch (projectData.value.plantmode) {
                            case "consumption":
                                return (
                                    <>
                                        {dataLang.formatMessage({
                                            id: "consumptionType",
                                        })}
                                    </>
                                );
                            case "hybrid":
                                return (
                                    <>
                                        {dataLang.formatMessage({
                                            id: "hybridType",
                                        })}
                                    </>
                                );
                            case "ESS":
                                return (
                                    <>{dataLang.formatMessage({ id: "ESS" })}</>
                                );
                            default:
                                return (
                                    <>
                                        {dataLang.formatMessage({ id: "gridType" })}
                                    </>
                                );
                        }
                    })()}
                </div>
                {projectData.value.state
                    ? <div className="DAT_ProjectData_Dashboard_Data_Center_Tit_Timer" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                        <svg viewBox='0 0 24 24' xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                            style={{
                                rotate: '-90deg',
                            }}
                        >
                            <circle
                                className="circle" cx="12" cy="12" r="10"
                                style={{

                                    fill: 'transparent',
                                    stroke: 'rgba(0, 163, 0,0.7)',
                                    strokeWidth: '2',
                                    strokeDashoffset: (dashArray - (dashArray * second.value) / (max)) || (dashArray - (dashArray * 0) / max),
                                    strokeDasharray: dashArray,
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                }}

                            ></circle>
                            <image href="/dat_icon/clock.png" x="4" y="4" width="16" height="16" />
                        </svg>
                    </div>
                    : <></>}

            </div>
            <Graph
                type={projectData.value.plantmode}
                state={projectData.value.state}
                cal={cal}
            />
        </div >
    );
}

