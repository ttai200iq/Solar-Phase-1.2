import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Project.scss";
import { signal } from "@preact/signals-react";
import { useIntl } from 'react-intl';
import Data from "./Data.js";
import { isBrowser, useMobileOrientation } from 'react-device-detect';

const move = signal({
    moveLtoR: 0,
    moveRtoL: 200,
    Default: 0
})

export default function Graph(props) {
    // const intervalIDRef = useReducer(null);
    // useEffect(function () {
    //     const startTimer = () => {

    //         intervalIDRef.current = setInterval(() => {
    //             move.value = {
    //                 moveLtoR: move.value.moveLtoR + 1,
    //                 moveRtoL: move.value.moveRtoL - 1
    //             }

    //             if (move.value.moveLtoR === 200) {
    //                 move.value.moveLtoR = 0
    //             }
    //             if (move.value.moveRtoL === 0) {
    //                 move.value.moveRtoL = 200
    //             }
    //         }, 30);
    //     };

    //     const stopTimer = () => {
    //         clearInterval(intervalIDRef.current);
    //         intervalIDRef.current = null;
    //     };
    //     if (props.state) {
    //         startTimer();
    //     }

    //     return () => {
    //         stopTimer();
    //     }

    // }, [])

    const [dataType, setDataType] = useState("default");
    const { isLandscape } = useMobileOrientation();

    const handleDataType = (type) => {
        setDataType(type);
    };

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setDataType("default");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Graph">
                {(() => {
                    switch (props.type) {
                        case "grid":
                            return (<>
                                {isBrowser
                                    ? <GraphGrid cal={props.cal} state={props.state} setType={handleDataType} />
                                    : <GraphGridMobile cal={props.cal} state={props.state} setType={handleDataType} />
                                }
                            </>)
                        case "consumption":
                            return (<>
                                {isBrowser
                                    ? <GraphConsumption cal={props.cal} state={props.state} setType={handleDataType} />
                                    : <GraphConsumptionMobile cal={props.cal} state={props.state} setType={handleDataType} />
                                }
                            </>)
                        case "hybrid":
                            return (<>
                                {isBrowser
                                    ? <GraphFull cal={props.cal} state={props.state} setType={handleDataType} />
                                    : <GraphFullMobile cal={props.cal} state={props.state} setType={handleDataType} />
                                }
                            </>)
                        case "ESS":
                            return (<>
                                {isBrowser
                                    ? <GraphFull cal={props.cal} state={props.state} setType={handleDataType} />
                                    : <GraphFullMobile cal={props.cal} state={props.state} setType={handleDataType} />
                                }
                            </>)
                        default:
                            <></>;
                    }
                })()}
            </div>

            {dataType === "default" ? (
                <> </>
            ) : (
                <>
                    {isBrowser
                        ?
                        <div className="DAT_ExportBG">
                            <Data type={dataType} setType={handleDataType} />
                        </div>
                        :
                        <div className="DAT_ViewPopupMobile">
                            <Data type={dataType} setType={handleDataType} />
                        </div>
                    }
                </>
            )}
        </>
    );
}


const Proref = signal({ lineA: { count: 0, x: 225.457, y: 30.115 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } });
const ProrefMobile = signal({ lineA: { count: 0, x: 90, y: 25 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 90, y: 253 }, lineC: { count: 0, x: 213, y: 133 }, lineD: { count: 0, x: 213, y: 158 } });
const lineA_ = signal("Default");
const lineB_ = signal("Default");
const lineC_ = signal("Default");
const lineD_ = signal("Default");
const GraphGrid = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)




    useEffect(() => {
        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                // setLinA("moveLtoR");
                lineA_.value = "moveLtoR";
            } else {
                // setLinA("Default");
                lineA_.value = "Default";
            }
        }
    }, [props.cal.pro_1]);






    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathD = document.getElementById("LineD");
            if (lineA_.value === "moveLtoR") {
                if (Proref.value.lineA2.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(Proref.value.lineA2.count + 10);
                    Proref.value = {
                        ...Proref.value,
                        lineA2: {
                            ...Proref.value.lineA2,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineA2.count + 1
                        }
                    }

                } else {
                    Proref.value.lineA2 = {
                        ...Proref.value.lineA2,
                        count: 0
                    };
                }
                if (Proref.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(Proref.value.lineD.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineD: {
                            ...Proref.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineD.count + 1
                        }
                    }

                } else {
                    Proref.value.lineD = {
                        ...Proref.value.lineD,
                        count: 0
                    };
                }
            }




        };





        interval.current = setInterval(animateA, 8);



        return () => {
            clearInterval(interval.current);
            interval.current = null;
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"

                    d="M 220.273 156.379 L 524.331 154.867"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />
                <foreignObject x={Proref.value.lineA2.x} y={Proref.value.lineA2.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>

        );
    };

    const LineC = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 610.082 134.618 L 715.972 134.607 C 736.637 135.652 748.747 126.555 750.979 103.444 L 750.902 66.848 C 751.05 43.191 765.509 32.937 782.783 33.408 L 876.466 33.514"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />


            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id="LineD"
                    d="M 610.962 174.984 L 715.43 175.675 C 722.258 175.065 747.419 179.077 750.463 202.02 L 751.66 236.348 C 751.437 250.755 762.334 262.284 780.339 262.808 L 878.195 264.08"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={Proref.value.lineD.x} y={Proref.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };




    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "20px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-end", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "40px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "25px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    const SolarImg = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 1100 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" state={props.state} />
                <LineC dur="10s" strokeWidth="3" state={props.state} />
                <LineD dur="10s" strokeWidth="3" state={props.state} />

                <foreignObject x="0" y="140.692" width="220" height="100" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="185" y="120" width="70" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="65" height="65" />
                </foreignObject>

                <foreignObject x="850" y="0" width="50" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="45" height="65" />
                </foreignObject>

                <foreignObject x="840" y="230" width="80" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="75" height="65" />
                </foreignObject>


                <foreignObject x="485" y="110" width="130" height="95" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>

                        <img src="/dat_icon/inverter_2.png" width="129" height="95" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};
const GraphGridMobile = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)




    useEffect(() => {
        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                // setLinA("moveLtoR");
                lineA_.value = "moveLtoR";

            } else {
                // setLinA("Default");
                lineA_.value = "Default";
            }
        }
    }, [props.cal.pro_1]);






    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathD = document.getElementById("LineD");
            if (lineA_.value === "moveLtoR") {
                if (ProrefMobile.value.lineA.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(ProrefMobile.value.lineA.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineA: {
                            ...ProrefMobile.value.lineA,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineA.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineA = {
                        ...ProrefMobile.value.lineA,
                        count: 0
                    };
                }
                if (ProrefMobile.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(ProrefMobile.value.lineD.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineD: {
                            ...ProrefMobile.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineD.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineD = {
                        ...ProrefMobile.value.lineD,
                        count: 0
                    };
                }
            }




        };





        interval.current = setInterval(animateA, 8);



        return () => {
            clearInterval(interval.current);
            interval.current = null;
            ProrefMobile.value = { lineA: { count: 0, x: 90, y: 25 }, lineA2: { count: 0, x: 215, y: 149 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 90, y: 253 }, lineC: { count: 0, x: 213, y: 133 }, lineD: { count: 0, x: 213, y: 158 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"
                    className="path"
                    d="M 102.445 36.045 L 120.733 36.271 C 144.438 37.286 144.507 57.052 144.135 69.402 L 144.115 108.779 C 142.137 142.915 159.02 143.045 168.405 144.382 L 185.194 144.543"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject x={ProrefMobile.value.lineA.x} y={ProrefMobile.value.lineA.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>
            </>

        );
    };
    const LineC = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 297.725 33.615 L 279.467 33.361 C 259.082 35.268 258.831 60.082 258.997 69.703 L 259.81 109.364 C 260.126 126.021 261.785 141.51 236.689 143.251 L 217.087 143.216"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />


            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id="LineD"
                    d="M 202.571 167.389 L 203.127 266.388"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={ProrefMobile.value.lineD.x} y={ProrefMobile.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };




    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "14px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "center", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "24px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "12px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };


    const SolarImg = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" state={props.state} />
                <LineC dur="10s" strokeWidth="3" state={props.state} />
                <LineD dur="10s" strokeWidth="3" state={props.state} />


                <foreignObject x="0" y="20" width="100" height="90" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="75" y="0" width="50" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="45" height="45" />
                </foreignObject>

                <foreignObject x="280" y="0" width="30" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="25" height="45" />
                </foreignObject>

                <foreignObject x="170" y="250" width="65" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="55" height="45" />
                </foreignObject>


                <foreignObject x="161" y="125" width="81" height="61" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        <img src="/dat_icon/inverter_2.png" width="81" height="61" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};


const GraphConsumption = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)

    // const [lineA_, setLinA] = useState("Default");
    // const [lineC_, setLinC] = useState("Default");
    // const [lineD_, setLinD] = useState("Default");

    useEffect(() => {
        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                // setLinA("moveLtoR");
                lineA_.value = "moveLtoR";
            } else {
                // setLinA("Default");
                lineA_.value = "Default";
            }

            // if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
            //     setLinB("moveRtoL");
            // } else {
            //     setLinB("Default");
            // }
            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                // setLinC("moveLtoR");
                lineC_.value = "moveLtoR";
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                // setLinC("moveRtoL");
                lineC_.value = "moveRtoL";
            } else {
                // setLinC("Default");
                lineC_.value = "Default";
            }

            // if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
            //     setLinD("moveRtoL");
            // } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
            //     setLinD("moveLtoR");
            // } else {
            //     setLinD("Default");
            // }


            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                // setLinD("moveRtoL");
                // setLinD("moveRtoL");
                lineD_.value = "moveLtoR";
            } else {
                // setLinD("Default");
                // setLinD("Default");
                lineD_.value = "Default";
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1]);

    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathC = document.getElementById("LineC");
            const pathD = document.getElementById("LineD");

            if (lineA_.value === "moveLtoR") {
                if (Proref.value.lineA2.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(Proref.value.lineA2.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineA2: {
                            ...Proref.value.lineA2,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineA2.count + 1
                        }
                    }

                } else {
                    Proref.value.lineA2 = {
                        ...Proref.value.lineA2,
                        count: 0
                    };
                }
            }

            if (lineC_.value !== "Default") {
                if (Proref.value.lineC.count + 1 <= pathC.getTotalLength()) {
                    const point = pathC.getPointAtLength(Proref.value.lineC.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineC: {
                            ...Proref.value.lineC,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineC.count + 1
                        }
                    }

                } else {
                    Proref.value.lineC = {
                        ...Proref.value.lineC,
                        count: 0
                    };
                }
            }

            if (lineD_.value === "moveLtoR") {
                if (Proref.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(Proref.value.lineD.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineD: {
                            ...Proref.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineD.count + 1
                        }
                    }

                } else {
                    Proref.value.lineD = {
                        ...Proref.value.lineD,
                        count: 0
                    };
                }
            }



        };


        interval.current = setInterval(animateA, 8);

        return () => {
            clearInterval(interval.current);
            interval.current = null;
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);

    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"

                    d="M 220.273 156.379 L 524.331 154.867"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />
                <foreignObject x={Proref.value.lineA2.x} y={Proref.value.lineA2.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>

        );
    };

    const LineC = (props) => {
        return (
            <>
                <path
                    id="LineC"
                    className="path"
                    d={lineC_.value === "moveLtoR"
                        ? "M 601.149 135.223 L 696.884 135.573 C 719.203 136.618 732.281 127.521 734.692 104.41 L 734.609 67.814 C 734.769 44.157 750.385 33.903 769.04 34.374 L 870.22 34.48"
                        : "M 874.976 33.648 L 782.298 33.465 C 764.322 33.289 751.035 45.043 750.907 64.042 L 751.08 100.624 C 750.611 120.776 740.72 135.7 719.136 134.917 L 611.488 134.815"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />
                <foreignObject x={Proref.value.lineC.x} y={Proref.value.lineC.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(247, 0, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>


            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id="LineD"
                    d="M 602.564 170.506 L 710.596 170.293 C 720.999 170.474 740.619 174.006 739.282 200.91 L 739.195 237.889 C 737.531 252.936 751.62 273.459 774.016 272.031 L 871.214 271.311"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={Proref.value.lineD.x} y={Proref.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };




    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "20px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-end", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "40px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "25px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    const SolarImg = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };


    return (
        <>
            <svg
                viewBox="0 0 1100 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" state={props.state} />
                <LineC dur="10s" strokeWidth="3" state={props.state} />
                <LineD dur="10s" strokeWidth="3" state={props.state} />

                <foreignObject x="0" y="140.692" width="220" height="100" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="185" y="120" width="70" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="65" height="65" />
                </foreignObject>


                <foreignObject x="880" y="20" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("grid")}>
                    <Solar label={dataLang.formatMessage({ id: "gridData" })} color="black" align="flex-end" val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="860" y="0" width="50" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="45" height="65" />
                </foreignObject>

                <foreignObject x="880" y="180" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("consumption")}>
                    <Solar label={dataLang.formatMessage({ id: "consumptionData" })} color="black" align="flex-end" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="840" y="230" width="80" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="75" height="65" />
                </foreignObject>


                <foreignObject x="485" y="110" width="130" height="95" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>

                        <img src="/dat_icon/inverter_2.png" width="129" height="95" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    )
};
const GraphConsumptionMobile = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)


    useEffect(() => {

        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                lineA_.value = "moveLtoR";
            } else {
                lineA_.value = "Default";

            }


            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                lineC_.value = "moveLtoR";
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                lineC_.value = "moveRtoL";
            } else {
                lineC_.value = "Default";
            }




            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                lineD_.value = "moveLtoR";
            } else {
                lineD_.value = "Default";
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1, props.cal.bat_1]);

    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathC = document.getElementById("LineC");
            const pathD = document.getElementById("LineD");
            if (lineA_.value === "moveLtoR") {
                if (ProrefMobile.value.lineA.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(ProrefMobile.value.lineA.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineA: {
                            ...ProrefMobile.value.lineA,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineA.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineA = {
                        ...ProrefMobile.value.lineA,
                        count: 0
                    };
                }
            }

            if (lineC_.value !== "Default") {
                if (ProrefMobile.value.lineC.count + 1 <= pathC.getTotalLength()) {
                    const point = pathC.getPointAtLength(ProrefMobile.value.lineC.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineC: {
                            ...ProrefMobile.value.lineC,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineC.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineC = {
                        ...ProrefMobile.value.lineC,
                        count: 0
                    };
                    // if(lineC_.value === "moveRtoL"){
                    //     lineC_.value = "moveLtoR";
                    // }else{
                    //     lineC_.value = "moveRtoL";
                    // }


                    console.log(lineC_.value);
                }
            }

            if (lineD_.value === "moveLtoR") {
                if (ProrefMobile.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(ProrefMobile.value.lineD.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineD: {
                            ...ProrefMobile.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineD.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineD = {
                        ...ProrefMobile.value.lineD,
                        count: 0
                    };

                }
            }

        };
        interval.current = setInterval(animateA, 8);
        return () => {
            clearInterval(interval.current);
            interval.current = null;
            ProrefMobile.value = { lineA: { count: 0, x: 90, y: 25 }, lineA2: { count: 0, x: 215, y: 149 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 90, y: 253 }, lineC: { count: 0, x: 213, y: 133 }, lineD: { count: 0, x: 213, y: 158 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"
                    className="path"
                    d="M 102.445 36.045 L 120.733 36.271 C 144.438 37.286 144.507 57.052 144.135 69.402 L 144.115 108.779 C 142.137 142.915 159.02 143.045 168.405 144.382 L 185.194 144.543"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject x={ProrefMobile.value.lineA.x} y={ProrefMobile.value.lineA.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>
            </>

        );
    };


    const LineC = (props) => {
        return (
            <>
                <path
                    id="LineC"
                    className="path"
                    d={lineC_.value === "moveLtoR"
                        ? "M 217.155 143.227 L 236.624 143.216 C 261.348 141.454 259.925 127.217 259.79 109.401 L 259.12 69.691 C 257.87 49.284 265.582 33.565 279.427 33.441 L 297.761 33.52"
                        : "M 297.725 33.615 L 279.467 33.361 C 259.082 35.268 258.831 60.082 258.997 69.703 L 259.81 109.364 C 260.126 126.021 261.785 141.51 236.689 143.251 L 217.087 143.216"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />
                <foreignObject x={ProrefMobile.value.lineC.x} y={ProrefMobile.value.lineC.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(247, 0, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id='LineD'
                    d="M 219.446 168.199 L 238.394 168.371 C 256.607 169.694 259.922 178.56 259.277 197.294 L 259.618 234.236 C 259.555 249.74 264.674 263.614 278.444 263.856 L 295.746 264.08"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={ProrefMobile.value.lineD.x} y={ProrefMobile.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>


            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "14px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "center", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "24px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "12px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" />

                <LineC dur="10s" strokeWidth="3" />
                <LineD dur="10s" strokeWidth="3" />

                <foreignObject x="0" y="20" width="100" height="90" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="75" y="0" width="50" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="45" height="45" />
                </foreignObject>


                <foreignObject x="300" y="20" width="100" height="90" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("grid")}>
                    <Solar label={dataLang.formatMessage({ id: "gridData" })} color="black" align="flex-end" val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="280" y="0" width="30" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="25" height="45" />
                </foreignObject>

                <foreignObject x="300" y="190" width="100" height="90" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("consumption")}>
                    <Solar label={dataLang.formatMessage({ id: "consumptionData" })} color="black" align="flex-end" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="270" y="250" width="65" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="55" height="45" />
                </foreignObject>


                <foreignObject x="161" y="125" width="81" height="61" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        <img src="/dat_icon/inverter_2.png" width="81" height="61" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};

const GraphFull = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)
    const [source, setSource] = useState("");

    useEffect(() => {
        if (parseFloat(props.cal?.bat_2) == 0) {
            setSource("/dat_icon/battery-0_-removebg-preview.png");
        } else if (parseFloat(props.cal?.bat_2) <= 25) {
            setSource("/dat_icon/battery-25_-removebg-preview.png");
        } else if (parseFloat(props.cal?.bat_2) <= 50) {
            setSource("/dat_icon/battery-50_-removebg-preview.png");
        } else if (parseFloat(props.cal?.bat_2) <= 75) {
            setSource("/dat_icon/battery-75_-removebg-preview.png");
        } else {
            setSource("/dat_icon/battery_100.png");
        }
    }, [props.cal?.bat_2]);

    useEffect(() => {

        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                lineA_.value = "moveLtoR";
            } else {
                lineA_.value = "Default";

            }


            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                lineC_.value = "moveRtoL";
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                lineC_.value = "moveLtoR";
            } else {
                lineC_.value = "Default";
            }

            if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) > 0) {
                lineB_.value = "moveRtoL";
            } else if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) < 0) {
                lineB_.value = "moveLtoR";
            } else {
                lineB_.value = "Default";
            }




            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                lineD_.value = "moveLtoR";
            } else {
                lineD_.value = "Default";
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1, props.cal.bat_1]);

    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathB = document.getElementById("LineB");
            const pathC = document.getElementById("LineC");
            const pathD = document.getElementById("LineD");
            if (lineA_.value === "moveLtoR") {
                if (Proref.value.lineA.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(Proref.value.lineA.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineA: {
                            ...Proref.value.lineA,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineA.count + 1
                        }
                    }

                } else {
                    Proref.value.lineA = {
                        ...Proref.value.lineA,
                        count: 0
                    };
                }
            }

            if (lineB_.value !== "Default") {
                if (Proref.value.lineB.count + 1 <= pathB.getTotalLength()) {
                    const point = pathB.getPointAtLength(Proref.value.lineB.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineB: {
                            ...Proref.value.lineB,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineB.count + 1
                        }
                    }

                } else {
                    Proref.value.lineB = {
                        ...Proref.value.lineB,
                        count: 0
                    };
                }
            }

            if (lineC_.value !== "Default") {
                if (Proref.value.lineC.count + 1 <= pathC.getTotalLength()) {
                    const point = pathC.getPointAtLength(Proref.value.lineC.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineC: {
                            ...Proref.value.lineC,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineC.count + 1
                        }
                    }

                } else {
                    Proref.value.lineC = {
                        ...Proref.value.lineC,
                        count: 0
                    };
                }
            }

            if (lineD_.value === "moveLtoR") {
                if (Proref.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(Proref.value.lineD.count + 1);
                    Proref.value = {
                        ...Proref.value,
                        lineD: {
                            ...Proref.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: Proref.value.lineD.count + 1
                        }
                    }

                } else {
                    Proref.value.lineD = {
                        ...Proref.value.lineD,
                        count: 0
                    };
                }
            }


        };

        interval.current = setInterval(animateA, 8);
        return () => {
            clearInterval(interval.current);
            interval.current = null;
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"
                    className="path"
                    d="M 229.71 35.949 L 342.716 36.205 C 357.001 35.249 368.365 42.708 369.257 61.071 L 369.813 110.008 C 369.716 126.273 379.301 134.236 394.538 134.25 L 508.738 134.715"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject x={Proref.value.lineA.x} y={Proref.value.lineA.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>
            </>

        );
    };

    const LineB = (props) => {
        return (
            <>
                <path
                    id="LineB"
                    d={lineB_.value === "moveLtoR"
                        ? "M 227.005 263.799 L 341.311 263.966 C 360.601 264.246 369.371 259.904 369.711 234.664 L 369.51 203.755 C 368.878 184.178 381.558 171.501 397.068 172.557 L 502.332 172.914"
                        : "M 493.637 169.087 L 394.014 168.978 C 375.369 168.369 360.705 179.803 359.663 199.807 L 360.075 239.26 C 358.57 255.41 349.147 269.519 329.029 270.528 L 226.283 269.895"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(30, 142, 247)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineB_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineB_],
                        // animation: `${lineB_}  ${props.dur} linear infinite`,

                    }}
                />

                <foreignObject x={Proref.value.lineB.x} y={Proref.value.lineB.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(30, 142, 247)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>






            </>
        );
    };

    const LineC = (props) => {
        return (
            <>
                <path
                    id="LineC"
                    className="path"
                    d={lineC_.value === "moveLtoR"
                        ? "M 601.149 135.223 L 696.884 135.573 C 719.203 136.618 732.281 127.521 734.692 104.41 L 734.609 67.814 C 734.769 44.157 750.385 33.903 769.04 34.374 L 870.22 34.48"
                        : "M 874.976 33.648 L 782.298 33.465 C 764.322 33.289 751.035 45.043 750.907 64.042 L 751.08 100.624 C 750.611 120.776 740.72 135.7 719.136 134.917 L 611.488 134.815"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />
                <foreignObject x={Proref.value.lineC.x} y={Proref.value.lineC.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(247, 0, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id='LineD'
                    d="M 602.564 170.506 L 710.596 170.293 C 720.999 170.474 740.619 174.006 739.282 200.91 L 739.195 237.889 C 737.531 252.936 751.62 273.459 774.016 272.031 L 871.214 271.311"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={Proref.value.lineD.x} y={Proref.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>


            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "20px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-end", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "40px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "25px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 1100 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" />
                <LineB dur="10s" strokeWidth="3" />
                <LineC dur="10s" strokeWidth="3" />
                <LineD dur="10s" strokeWidth="3" />

                <foreignObject x="0" y="20" width="220" height="100" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="185" y="0" width="70" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="65" height="65" />
                </foreignObject>


                <foreignObject x="880" y="20" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("grid")}>
                    <Solar label={dataLang.formatMessage({ id: "gridData" })} color={props.cal?.grid_1 < 0 ? "red" : "black"} align="flex-end" val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="860" y="0" width="50" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="45" height="65" />
                </foreignObject>


                <foreignObject x="0" y="180" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("battery")}>
                    <Solar label={dataLang.formatMessage({ id: "batteryData" })} color={props.cal?.bat_1 < 0 ? "red" : "black"} align="flex-start" val={Number(parseFloat(Math.abs(props.cal?.bat_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="200" y="230" width="45" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src={source} width="40" height="65" />
                </foreignObject>



                <foreignObject x="880" y="180" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("consumption")}>
                    <Solar label={dataLang.formatMessage({ id: "consumptionData" })} color="black" align="flex-end" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="840" y="230" width="80" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="75" height="65" />
                </foreignObject>







                <foreignObject x="485" y="110" width="130" height="95" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>

                        <img src="/dat_icon/inverter_2.png" width="129" height="95" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};

const GraphFullMobile = (props) => {
    const dataLang = useIntl();
    const interval = useReducer(null)


    useEffect(() => {

        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                lineA_.value = "moveLtoR";
            } else {
                lineA_.value = "Default";

            }


            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                lineC_.value = "moveRtoL";
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                lineC_.value = "moveLtoR";
            } else {
                lineC_.value = "Default";
            }

            if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) > 0) {
                lineB_.value = "moveRtoL";
            } else if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) < 0) {
                lineB_.value = "moveLtoR";
            } else {
                lineB_.value = "Default";
            }




            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                lineD_.value = "moveLtoR";
            } else {
                lineD_.value = "Default";
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1, props.cal.bat_1]);

    useEffect(() => {

        const animateA = () => {

            const pathA = document.getElementById("LineA");
            const pathB = document.getElementById("LineB");
            const pathC = document.getElementById("LineC");
            const pathD = document.getElementById("LineD");
            if (lineA_.value === "moveLtoR") {
                if (ProrefMobile.value.lineA.count + 1 <= pathA.getTotalLength()) {
                    const point = pathA.getPointAtLength(ProrefMobile.value.lineA.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineA: {
                            ...ProrefMobile.value.lineA,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineA.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineA = {
                        ...ProrefMobile.value.lineA,
                        count: 0
                    };
                }
            }


            if (lineB_.value !== "Default") {
                if (ProrefMobile.value.lineB.count + 1 <= pathB.getTotalLength()) {
                    const point = pathB.getPointAtLength(ProrefMobile.value.lineB.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineB: {
                            ...ProrefMobile.value.lineB,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineB.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineB = {
                        ...ProrefMobile.value.lineB,
                        count: 0
                    };
                }
            }
            if (lineC_.value !== "Default") {
                if (ProrefMobile.value.lineC.count + 1 <= pathC.getTotalLength()) {
                    const point = pathC.getPointAtLength(ProrefMobile.value.lineC.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineC: {
                            ...ProrefMobile.value.lineC,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineC.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineC = {
                        ...ProrefMobile.value.lineC,
                        count: 0
                    };
                    // if(lineC_.value === "moveRtoL"){
                    //     lineC_.value = "moveLtoR";
                    // }else{
                    //     lineC_.value = "moveRtoL";
                    // }


                    console.log(lineC_.value);
                }
            }

            if (lineD_.value === "moveLtoR") {
                if (ProrefMobile.value.lineD.count + 1 <= pathD.getTotalLength()) {
                    const point = pathD.getPointAtLength(ProrefMobile.value.lineD.count + 1);
                    ProrefMobile.value = {
                        ...ProrefMobile.value,
                        lineD: {
                            ...ProrefMobile.value.lineD,
                            x: point.x - 10,
                            y: point.y - 10,
                            count: ProrefMobile.value.lineD.count + 1
                        }
                    }

                } else {
                    ProrefMobile.value.lineD = {
                        ...ProrefMobile.value.lineD,
                        count: 0
                    };

                }
            }

        };
        interval.current = setInterval(animateA, 8);
        return () => {
            clearInterval(interval.current);
            interval.current = null;
            ProrefMobile.value = { lineA: { count: 0, x: 90, y: 25 }, lineA2: { count: 0, x: 215, y: 149 }, lineA2: { count: 0, x: 215, y: 149 }, lineB: { count: 0, x: 90, y: 253 }, lineC: { count: 0, x: 213, y: 133 }, lineD: { count: 0, x: 213, y: 158 } };
            lineA_.value = "Default";
            lineB_.value = "Default";
            lineC_.value = "Default";
            lineD_.value = "Default";
        };
    }, []);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"
                    className="path"
                    d="M 102.445 36.045 L 120.733 36.271 C 144.438 37.286 144.507 57.052 144.135 69.402 L 144.115 108.779 C 142.137 142.915 159.02 143.045 168.405 144.382 L 185.194 144.543"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(0, 195, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDashoffset: move.value[lineA_],
                        // strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject x={ProrefMobile.value.lineA.x} y={ProrefMobile.value.lineA.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(0, 195, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>
            </>

        );
    };

    const LineB = (props) => {
        return (
            <>
                <path
                    id="LineB"
                    d={lineB_.value === "moveLtoR"
                        ? "M 103.98 264.014 L 120.13 264.148 C 143.669 265.59 143.526 247.024 144.372 234.518 L 144.544 198.199 C 143.594 178.352 147.849 168.44 166.922 166.147 L 182.31 166.216"
                        : "M 182.413 166.242 L 166.896 166.127 C 145.616 168.146 143.925 180.793 144.598 198.188 L 144.344 234.52 C 144.005 252.206 140.464 264.949 120.115 264.081 L 103.807 263.983"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgb(30, 142, 247)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineB_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineB_],
                        // animation: `${lineB_}  ${props.dur} linear infinite`,

                    }}
                />

                <foreignObject x={ProrefMobile.value.lineB.x} y={ProrefMobile.value.lineB.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(30, 142, 247)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>






            </>
        );
    };

    const LineC = (props) => {
        return (
            <>
                <path
                    id="LineC"
                    className="path"
                    d={lineC_.value === "moveLtoR"
                        ? "M 217.155 143.227 L 236.624 143.216 C 261.348 141.454 259.925 127.217 259.79 109.401 L 259.12 69.691 C 257.87 49.284 265.582 33.565 279.427 33.441 L 297.761 33.52"
                        : "M 297.725 33.615 L 279.467 33.361 C 259.082 35.268 258.831 60.082 258.997 69.703 L 259.81 109.364 C 260.126 126.021 261.785 141.51 236.689 143.251 L 217.087 143.216"
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(247, 0, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineC_],
                        // animation: `${lineC_} ${props.dur} linear infinite`,

                    }}
                />
                <foreignObject x={ProrefMobile.value.lineC.x} y={ProrefMobile.value.lineC.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(247, 0, 0)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>

            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    id='LineD'
                    d="M 219.446 168.199 L 238.394 168.371 C 256.607 169.694 259.922 178.56 259.277 197.294 L 259.618 234.236 C 259.555 249.74 264.674 263.614 278.444 263.856 L 295.746 264.08"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgb(242, 223, 46)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        // strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        // strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

                <foreignObject id='circleA' x={ProrefMobile.value.lineD.x} y={ProrefMobile.value.lineD.y} width="20" height="20" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgb(242, 223, 46)", borderRadius: "50%" }}>
                    </div>
                </foreignObject>


            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: props.align, alignItems: "flex-start", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "10px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                {/* <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" /> */}
                <div>
                    <div style={{ color: "rgba(11, 25, 103)", fontSize: "14px" }}>
                        <span>{props.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: props.align, alignItems: "center", gap: "5px" }}>
                        <div style={{ color: props.color, fontSize: "24px" }} >{props.val}</div> <div style={{ color: "gray", fontSize: "12px", paddingBottom: "6px" }}>{props.unit}</div>
                    </div>
                </div>

            </div>
        );
    };

    const Icon = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", border: "none", borderRadius: "3px", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" />
                <LineB dur="10s" strokeWidth="3" />
                <LineC dur="10s" strokeWidth="3" />
                <LineD dur="10s" strokeWidth="3" />

                <foreignObject x="0" y="20" width="100" height="90" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="75" y="0" width="50" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="45" height="45" />
                </foreignObject>


                <foreignObject x="300" y="20" width="100" height="90" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("grid")}>
                    <Solar label={dataLang.formatMessage({ id: "gridData" })} color="black" align="flex-end" val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="280" y="0" width="30" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="25" height="45" />
                </foreignObject>


                <foreignObject x="0" y="190" width="100" height="90" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("battery")}>
                    <Solar label={dataLang.formatMessage({ id: "batteryData" })} color={props.cal?.bat_1 < 0 ? "red" : "black"} align="flex-start" val={Number(parseFloat(Math.abs(props.cal?.bat_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="95" y="250" width="25" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/battery_100.png" width="20" height="45" />
                </foreignObject>



                <foreignObject x="300" y="190" width="100" height="90" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("consumption")}>
                    <Solar label={dataLang.formatMessage({ id: "consumptionData" })} color="black" align="flex-end" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="270" y="250" width="65" height="50" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/smart-house.png" width="55" height="45" />
                </foreignObject>


                <foreignObject x="161" y="125" width="81" height="61" style={{ overflow: "hidden", padding: "2px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        <img src="/dat_icon/inverter_2.png" width="81" height="61" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};