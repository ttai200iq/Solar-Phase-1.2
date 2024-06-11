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

    return (
        <>
            <div className="DAT_ProjectData_Dashboard_Data_Center_Graph">
                {(() => {
                    switch (props.type) {
                        case "grid":
                            return <GraphGrid cal={props.cal} state={props.state} setType={handleDataType} />;
                        case "consumption":
                            return <GraphConsumption cal={props.cal} state={props.state} setType={handleDataType} />;
                        case "hybrid":
                            return <GraphFull cal={props.cal} state={props.state} setType={handleDataType} />;
                        case "ESS":
                            return <GraphFull cal={props.cal} state={props.state} setType={handleDataType} />;
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
                        <>
                            {isLandscape
                                ?
                                <div className="DAT_ViewPopupMobile">
                                    <Data type={dataType} setType={handleDataType} />
                                </div>
                                :
                                <div className="DAT_PopupBGMobile">
                                    <Data type={dataType} setType={handleDataType} />
                                </div>
                            }
                        </>
                    }
                </>
            )}
        </>
    );
}


const Proref = signal({ lineA: { count: 0, x: 225.457, y: 30.115 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } });

const GraphGrid = (props) => {
    const dataLang = useIntl();
    const intervalA = useReducer(null)
    const intervalD = useReducer(null)
    const [lineA_, setLinA] = useState("Default");


    useEffect(() => {
        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                setLinA("moveLtoR");
            } else {
                setLinA("Default");
            }
        }
    }, [props.cal.pro_1]);






    useEffect(() => {

        const animateA = () => {

            const path = document.getElementById("LineA");
            if (Proref.value.lineA.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineA.count + 1);
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


        };

        const animateD = () => {

            const path = document.getElementById("LineD");
            if (Proref.value.lineD.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineD.count + 1);
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

        };


        if (lineA_ === "moveLtoR") {
            intervalA.current = setInterval(animateA, 8);
            intervalD.current = setInterval(animateD, 8);
        } else {
            clearInterval(intervalA.current);
            clearInterval(intervalD.current);
            intervalA.current = null
            intervalD.current = null
        }


        return () => {
            clearInterval(intervalA.current);
            clearInterval(intervalD.current);
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
        };
    }, [lineA_]);



    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"

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

    const LineC = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 601.149 135.223 L 696.884 135.573 C 719.203 136.618 732.281 127.521 734.692 104.41 L 734.609 67.814 C 734.769 44.157 750.385 33.903 769.04 34.374 L 870.22 34.48"
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

                <foreignObject x="0" y="20" width="220" height="100" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="185" y="0" width="70" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/solar-cell.png" width="65" height="65" />
                </foreignObject>

                <foreignObject x="860" y="0" width="50" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
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

const GraphConsumption = (props) => {
    const dataLang = useIntl();
    const intervalA = useReducer(null)
    const intervalC = useReducer(null)
    const intervalD = useReducer(null)
    const [lineA_, setLinA] = useState("Default");
    const [lineC_, setLinC] = useState("Default");
    const [lineD_, setLinD] = useState("Default");

    useEffect(() => {
        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                setLinA("moveLtoR");
            } else {
                setLinA("Default");
            }

            // if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
            //     setLinB("moveRtoL");
            // } else {
            //     setLinB("Default");
            // }
            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                setLinC("moveLtoR");
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                setLinC("moveRtoL");
            } else {
                setLinC("Default");
            }

            // if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
            //     setLinD("moveRtoL");
            // } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
            //     setLinD("moveLtoR");
            // } else {
            //     setLinD("Default");
            // }


            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                setLinD("moveRtoL");
            } else {
                setLinD("Default");
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1]);

    useEffect(() => {

        const animateA = () => {

            const path = document.getElementById("LineA");
            if (Proref.value.lineA.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineA.count + 1);
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


        };

        // const animateB = () => {

        //     const path = document.getElementById("LineB");
        //     if (Proref.value.lineB.count + 1 <= path.getTotalLength()) {
        //         const point = path.getPointAtLength(Proref.value.lineB.count + 1);
        //         Proref.value = {
        //             ...Proref.value,
        //             lineB: {
        //                 ...Proref.value.lineB,
        //                 x: point.x - 10,
        //                 y: point.y - 10,
        //                 count: Proref.value.lineB.count + 1
        //             }
        //         }

        //     } else {
        //         Proref.value.lineB = {
        //             ...Proref.value.lineB,
        //             count: 0
        //         };
        //     }


        // };

        const animateC = () => {

            const path = document.getElementById("LineC");
            if (Proref.value.lineC.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineC.count + 1);
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


        };

        const animateD = () => {

            const path = document.getElementById("LineD");
            if (Proref.value.lineD.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineD.count + 1);
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

        };


        if (lineA_ === "moveLtoR") {
            intervalA.current = setInterval(animateA, 8);
        } else {
            clearInterval(intervalA.current);
            intervalA.current = null
        }


        // if (lineB_ === "Default") {
        //     clearInterval(intervalB.current);
        //     intervalB.current = null
        // } else {
        //     intervalB.current = setInterval(animateB, 8);
        // }

        if (lineC_ === "Default") {
            clearInterval(intervalC.current);
            intervalC.current = null
        } else {
            intervalC.current = setInterval(animateC, 8);
        }


        if (lineD_ === "moveLtoR") {
            intervalA.current = setInterval(animateD, 8);
        } else {
            clearInterval(intervalD.current);
            intervalD.current = null
        }
        return () => {
            clearInterval(intervalA.current);
            clearInterval(intervalC.current);
            clearInterval(intervalD.current);
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
        };
    }, [lineA_, lineC_, lineD_]);

    const LineA = (props) => {
        return (
            <>
                <path
                    id="LineA"

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

    const LineC = (props) => {
        return (
            <>
                <path
                    id="LineC"
                    className="path"
                    d={lineC_ === "moveLtoR"
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

                <foreignObject x="0" y="20" width="220" height="100" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", cursor: "pointer" }} onClick={() => props.setType("production")}>
                    <Solar label={dataLang.formatMessage({ id: "productionData" })} color="black" align="flex-start" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="185" y="0" width="70" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
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

const GraphFull = (props) => {
    const dataLang = useIntl();
    const intervalA = useReducer(null)
    const intervalB = useReducer(null)
    const intervalC = useReducer(null)
    const intervalD = useReducer(null)
    const [lineA_, setLinA] = useState("Default");
    const [lineB_, setLinB] = useState("Default");
    const [lineC_, setLinC] = useState("Default");
    const [lineD_, setLinD] = useState("Default");

    useEffect(() => {

        if (props.state) {
            if (parseFloat(props.cal?.pro_1 / 1000).toFixed(2) > 0) {
                setLinA("moveLtoR");
            } else {
                setLinA("Default");
            }

            // if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
            //     setLinB("moveRtoL");
            // } else {
            //     setLinB("Default");
            // }
            if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
                setLinB("moveLtoR");
            } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
                setLinB("moveRtoL");
            } else {
                setLinB("Default");
            }

            if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) > 0) {
                setLinC("moveRtoL");
            } else if (parseFloat(props.cal?.bat_1 / 1000).toFixed(2) < 0) {
                setLinC("moveLtoR");
            } else {
                setLinC("Default");
            }


            // if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) > 0) {
            //     setLinD("moveLtoR");
            // } else if (parseFloat(props.cal?.grid_1 / 1000).toFixed(2) < 0) {
            //     setLinD("moveRtoL");
            // } else {
            //     setLinD("Default");
            // }
            if (parseFloat(props.cal?.con_1).toFixed(2) > 0) {
                setLinD("moveLtoR");
            } else {
                setLinD("Default");
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1, props.cal.bat_1]);

    useEffect(() => {

        const animateA = () => {

            const path = document.getElementById("LineA");
            if (Proref.value.lineA.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineA.count + 1);
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


        };

        const animateB = () => {

            const path = document.getElementById("LineB");
            if (Proref.value.lineB.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineB.count + 1);
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


        };

        const animateC = () => {

            const path = document.getElementById("LineC");
            if (Proref.value.lineC.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineC.count + 1);
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


        };

        const animateD = () => {

            const path = document.getElementById("LineD");
            if (Proref.value.lineD.count + 1 <= path.getTotalLength()) {
                const point = path.getPointAtLength(Proref.value.lineD.count + 1);
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

        };


        if (lineA_ === "moveLtoR") {
            intervalA.current = setInterval(animateA, 8);
        } else {
            clearInterval(intervalA.current);
            intervalA.current = null
        }


        if (lineB_ === "Default") {
            clearInterval(intervalB.current);
            intervalB.current = null
        } else {
            intervalB.current = setInterval(animateB, 8);
        }

        if (lineC_ === "Default") {
            clearInterval(intervalC.current);
            intervalC.current = null
        } else {
            intervalC.current = setInterval(animateC, 8);
        }


        if (lineD_ === "moveLtoR") {
            intervalA.current = setInterval(animateD, 8);
        } else {
            clearInterval(intervalD.current);
            intervalD.current = null
        }
        return () => {
            clearInterval(intervalA.current);
            clearInterval(intervalB.current);
            clearInterval(intervalC.current);
            clearInterval(intervalD.current);
            Proref.value = { lineA: { count: 0, x: 225.457, y: 30.115 }, lineB: { count: 0, x: 222.205, y: 258.641 }, lineC: { count: 0, x: 586.323, y: 124.583 }, lineD: { count: 0, x: 586.323, y: 160.217 } };
        };
    }, [lineA_, lineB_, lineC_, lineD_]);



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
                    d={lineB_ === "moveLtoR"
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
                    d={lineC_ === "moveLtoR"
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
                    <Solar label={dataLang.formatMessage({ id: "gridData" })} color="black" align="flex-end" val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="860" y="0" width="50" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/electric-pole.png" width="45" height="65" />
                </foreignObject>


                <foreignObject x="0" y="180" width="220" height="100" style={{ overflow: "hidden", padding: "2px", cursor: "pointer" }} onClick={() => props.setType("battery")}>
                    <Solar label={dataLang.formatMessage({ id: "batteryData" })} color={props.cal?.bat_1 < 0 ? "red" : "black"} align="flex-start" val={Number(parseFloat(Math.abs(props.cal?.bat_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>
                <foreignObject x="200" y="230" width="45" height="70" style={{ overflow: "hidden", padding: "1px", boxSizing: "border-box", }}>
                    <Icon src="/dat_icon/battery_100.png" width="40" height="65" />
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