import React, { useState } from 'react';
import "./Project.scss";

import { useIntl } from 'react-intl';
import { projectData } from './Project';
import Production from './Production';
import Consumption from './Consumption';
import Grid from './Grid';
import Battery from './Battery';
import { useSelector } from 'react-redux';
import { isMobile } from '../Navigation/Navigation';
import { FaSolarPanel } from 'react-icons/fa';
import { MdBatteryCharging90, MdPower } from 'react-icons/md';
import { GiElectric } from 'react-icons/gi';

export default function Data(props) {
    const dataLang = useIntl();
    const cal = useSelector((state) => state.tool.cal);
    const [nav, setNav] = useState("production");

    const color = {
        cur: 'rgba(11, 25, 103)',
        pre: 'rgba(95, 95, 98,0.3)',
    };

    const handleNav = (e) => {
        var id = e.currentTarget.id;
        setNav(id);
    };

    const tit = {
        production: "productionData",
        consumption: "consumptionData",
        grid: "grid",
        battery: "batteryData"
    }

    return (
        <div className="DAT_ProjectData_Dashboard_Data_Left">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                <div style={{ width: "100%", paddingLeft: "10px", fontFamily: "Montserrat-SemiBold", display: "flex", alignItems: "center", justifyContent: "flex-start" }} >{dataLang.formatMessage({ id: tit[nav] })}</div>
                {isMobile ?
                    <div className="DAT_ProjectData_Dashboard_Data_Left_Tit">
                        <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                            id="production"
                            style={{
                                color: nav === "production" ? color.cur : color.pre,
                                transition: "all 0.5s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={(e) => handleNav(e)}
                        >
                            {/* {dataLang.formatMessage({ id: "productionData" })} */}
                            <FaSolarPanel size={20} />
                        </div>
                        {projectData.value.plantmode === "grid"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="consumption"
                                style={{
                                    color:
                                        nav === "consumption" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid"
                                    //         ? "none"
                                    //         : "block",
                                }}
                                onClick={(e) => handleNav(e)}
                            >

                                {/* {dataLang.formatMessage({ id: "consumptionData" })} */}
                                <MdPower size={20} />
                            </div>
                        }

                        {projectData.value.plantmode === "grid"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="grid"
                                style={{
                                    color: nav === "grid" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid"
                                    //         ? "none"
                                    //         : "block",

                                }}
                                onClick={(e) => handleNav(e)}
                            >
                                {/* {dataLang.formatMessage({ id: "grid" })} */}
                                <GiElectric size={20} />

                            </div>
                        }

                        {projectData.value.plantmode === "grid" || projectData.value.plantmode === "consumption"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="battery"
                                style={{
                                    color: nav === "battery" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid" ||
                                    //         projectData.value.plantmode === "consumption"
                                    //         ? "none"
                                    //         : "block",
                                }}
                                onClick={(e) => handleNav(e)}
                            >
                                {/* {dataLang.formatMessage({ id: "batteryData" })} */}
                                <MdBatteryCharging90 size={25} />
                            </div>
                        }
                    </div>

                    :
                    <div className="DAT_ProjectData_Dashboard_Data_Left_Tit">
                        <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                            id="production"
                            style={{
                                color: nav === "production" ? color.cur : color.pre,
                                transition: "all 0.5s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={(e) => handleNav(e)}
                        >
                            {/* {dataLang.formatMessage({ id: "productionData" })} */}
                            <FaSolarPanel size={20} />
                        </div>
                        {projectData.value.plantmode === "grid"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="consumption"
                                style={{
                                    color:
                                        nav === "consumption" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid"
                                    //         ? "none"
                                    //         : "block",
                                }}
                                onClick={(e) => handleNav(e)}
                            >
                                {/* {dataLang.formatMessage({ id: "consumptionData" })} */}
                                <MdPower size={20} />
                            </div>
                        }
                        {projectData.value.plantmode === "grid"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="grid"
                                style={{
                                    color: nav === "grid" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid"
                                    //         ? "none"
                                    //         : "block",
                                }}
                                onClick={(e) => handleNav(e)}
                            >
                                {/* {dataLang.formatMessage({ id: "grid" })} */}
                                <GiElectric size={20} />
                            </div>
                        }
                        {projectData.value.plantmode === "grid" || projectData.value.plantmode === "consumption"
                            ? <></>
                            : <div className="DAT_ProjectData_Dashboard_Data_Left_Tit_Item"
                                id="battery"
                                style={{
                                    color: nav === "battery" ? color.cur : color.pre,
                                    transition: "all 0.5s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // display:
                                    //     projectData.value.plantmode === "grid" ||
                                    //         projectData.value.plantmode === "consumption"
                                    //         ? "none"
                                    //         : "block",
                                }}
                                onClick={(e) => handleNav(e)}
                            >
                                {/* {dataLang.formatMessage({ id: "batteryData" })} */}
                                <MdBatteryCharging90 />
                            </div>
                        }
                    </div>
                }

            </div>

            {(() => {
                switch (nav) {
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
    );
}

