import React, { useEffect, useReducer, useState } from 'react';
import "./Project.scss";
import { signal } from "@preact/signals-react";

const move = signal({
    moveLtoR: 0,
    moveRtoL: 200,
    Default: 0
})

export default function Graph(props) {
    const intervalIDRef = useReducer(null);
    useEffect(function () {
        const startTimer = () => {

            intervalIDRef.current = setInterval(() => {
                move.value = {
                    moveLtoR: move.value.moveLtoR + 1,
                    moveRtoL: move.value.moveRtoL - 1
                }

                if (move.value.moveLtoR === 200) {
                    move.value.moveLtoR = 0
                }
                if (move.value.moveRtoL === 0) {
                    move.value.moveRtoL = 200
                }
            }, 30);
        };

        const stopTimer = () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
        };
        if (props.state) {
            startTimer();
        }

        return () => {
            stopTimer();
        }

    }, [])

    return (
        <div className="DAT_ProjectData_Dashboard_Data_Center_Graph">
            {(() => {
                switch (props.type) {
                    case "grid":
                        return <GraphGrid cal={props.cal} state={props.state} />;
                    case "consumption":
                        return <GraphConsumption cal={props.cal} state={props.state} />;
                    case "hybrid":
                        return <GraphFull cal={props.cal} state={props.state} />;
                    case "ESS":
                        return <GraphFull cal={props.cal} state={props.state} />;
                    default:
                        <></>;
                }
            })()}
        </div>
    );
}

const GraphGrid = (props) => {

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

    const LineA = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 230.857 133.65 L 231.165 38.854 C 231.618 33.403 228.857 31.82 223.463 32.163 L 82.444 32.537"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineA_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(43, 195, 253)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineA_],
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />
            </>
        );
    };

    const LineB = (props) => {
        return (
            <>
                <path
                    d="M 258.136 132.82 L 258.703 39.488 C 258.59 34.811 259.013 31.481 266.609 31.554 L 413.676 31.085"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: "rgba(0, 163, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        // strokeDasharray: "20",
                        overflow: "hidden",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />

            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    d="M 241.751 145.923 L 242.029 243.54"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: "rgba(247, 148, 29)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: "20",
                        strokeDashoffset: props.state ? move.value.moveRtoL : '0',
                        // animation: `moveRtoL ${props.dur} linear infinite`,
                    }}
                />

            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
                <div>
                    <div style={{ color: props.color }}>
                        {props.val}
                    </div>
                    <span style={{ color: "gray", fontSize: "13px" }}>{props.unit}</span>
                </div>
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
                viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" state={props.state} />
                <LineB dur="10s" strokeWidth="3" state={props.state} />
                <LineD dur="10s" strokeWidth="3" state={props.state} />

                <foreignObject x="5" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-09.png" width="30" color="black" height="30" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(3)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="193" y="233" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <SolarImg src="/dat_icon/3_Icon_AppEmbody-14.png" width="30" height="30" />
                </foreignObject>


                <foreignObject x="395" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <SolarImg src="/dat_icon/3_Icon_AppEmbody-10.png" width="30" height="30" />
                </foreignObject>

                <foreignObject x="193" y="92" width="102.628" height="68.353" style={{ overflow: "hidden", padding: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        {/* <img src="/dat_icon/3_Icon_AppEmbody-15.png" width="60" height="60" alt="" /> */}
                        <img src="/dat_icon/inverter_2.png" width="100" height="100" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};

const GraphConsumption = (props) => {
    const [lineA_, setLinA] = useState("Default");
    const [lineB_, setLinB] = useState("Default");
    const [lineD_, setLinD] = useState("Default")

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

    const LineA = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 230.857 133.65 L 231.165 38.854 C 231.618 33.403 228.857 31.82 223.463 32.163 L 82.444 32.537"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineA_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(43, 195, 253)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineA_],
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />
            </>
        );
    };

    const LineB = (props) => {
        return (
            <>
                <path
                    d="M 258.136 132.82 L 258.703 39.488 C 258.59 34.811 259.013 31.481 266.609 31.554 L 413.676 31.085"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineB_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(0, 163, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineB_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineB_],
                        // animation: `${lineB_}  ${props.dur} linear infinite`,

                    }}
                />

            </>
        );
    };

    const LineD = (props) => {
        return (
            <>
                <path
                    d="M 241.751 145.923 L 242.029 243.54"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: lineD_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(247, 148, 29)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
                <div>
                    <div style={{ color: props.color }}>
                        {props.val}
                    </div>
                    <span style={{ color: "gray", fontSize: "13px" }}>{props.unit}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" />
                <LineB dur="10s" strokeWidth="3" />
                <LineD dur="10s" strokeWidth="3" />

                <foreignObject x="5" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-09.png" width="30" height="30" color="black" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="193" y="233" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-14.png" width="30" height="30" color="black" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="395" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-10.png" width="30" height="30" color={props.cal?.grid_1 < 0 ? "red" : "black"} val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="193" y="92" width="102.628" height="68.353" style={{ overflow: "hidden", padding: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        {/* <img src="/dat_icon/3_Icon_AppEmbody-15.png" width="60" height="60" alt="" /> */}
                        <img src="/dat_icon/inverter_2.png" width="100" height="100" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};

const GraphFull = (props) => {
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
            // }W
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
                setLinD("moveRtoL");
            } else {
                setLinD("Default");
            }
        }

    }, [props.cal.pro_1, props.cal.con_1, props.cal.grid_1, props.cal.bat_1]);

    const LineA = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 228.806 133.65 L 229.114 38.854 C 229.567 33.403 226.806 31.82 221.412 32.163 L 80.393 32.537"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineA_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(43, 195, 253)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDashoffset: move.value[lineA_],
                        strokeDasharray: lineA_ === "Default" ? "0" : "20",
                        // animation: `${lineA_} ${props.dur} linear infinite`,
                    }}
                />
            </>
        );
    };

    const LineB = (props) => {
        return (
            <>
                <path
                    d="M 260.699 133.333 L 261.266 40.001 C 261.153 35.324 261.576 31.994 269.172 32.067 L 416.239 31.598"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineB_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(0, 163, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineB_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineB_],
                        // animation: `${lineB_}  ${props.dur} linear infinite`,

                    }}
                />

            </>
        );
    };

    const LineC = (props) => {
        return (
            <>
                <path
                    className="path"
                    d="M 228.667 160.393 L 228.945 258.01 C 229.368 266.375 227.129 267.296 219.38 267.022 L 77.86 266.635"
                    style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: lineC_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(77, 255, 0)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineC_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineC_],
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
                    d="M 259.847 158.807 L 260.426 257.115 C 260.454 264.712 260.978 265.95 269.285 266.088 L 417.823 266.733"
                    width="100%"
                    height="100%"
                    style={{
                        fill: "none",
                        stroke: lineD_ === "Default" ? "rgb(182, 182, 182,0.3)" : "rgba(247, 148, 29)",
                        strokeWidth: props.strokeWidth,
                        strokeLinecap: "round",
                        overflow: "hidden",
                        strokeDasharray: lineD_ === "Default" ? "0" : "20",
                        strokeDashoffset: move.value[lineD_],
                        // animation: `${lineD_} ${props.dur} linear infinite`,
                    }}
                />

            </>
        );
    };

    const Solar = (props) => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px", width: "100%", height: "100%", border: "1px solid rgba(233, 233, 233, 0.8)", borderRadius: "3px", padding: "5px", boxSizing: "border-box", backgroundColor: "white", overflow: "hidden" }}>
                <img src={props.src} width={`${props.width}px`} height={`${props.height}px`} alt="" />
                <div>
                    <div style={{ color: props.color }}>
                        {props.val}
                    </div>
                    <span style={{ color: "gray", fontSize: "13px" }}>{props.unit}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <svg
                viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}
                style={{
                    backgroundColor: "white"
                }}
            >
                <LineA dur="10s" strokeWidth="3" />
                <LineB dur="10s" strokeWidth="3" />
                <LineC dur="10s" strokeWidth="3" />
                <LineD dur="10s" strokeWidth="3" />

                <foreignObject x="5" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-09.png" width="30" height="30" color="black" val={Number(parseFloat(props.cal?.pro_1 / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                {/* <foreignObject x="395" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/consumption.png" width="30" height="30" color="black" val={Number(parseFloat(props.cal?.con_1).toFixed(2) || 0).toLocaleString("en-US")} unit="kW" />
                </foreignObject> */}
                <foreignObject x="395" y="5" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-10.png" width="30" height="30" color={props.cal?.grid_1 < 0 ? "red" : "black"} val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="5" y="235" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-11.png" width="30" height="30" color={props.cal?.bat_1 < 0 ? "red" : "black"} val={Number(parseFloat(Math.abs(props.cal?.bat_1) / 1000 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                {/* <foreignObject x="395" y="235" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/grid.png" width="30" height="30" color={props.cal?.grid_1 < 0 ? "red" : "black"} val={Number(parseFloat(Math.abs(props.cal?.grid_1) / 1000).toFixed(2) || 0).toLocaleString("en-US")} unit="kW" />
                </foreignObject> */}

                <foreignObject x="395" y="235" width="100" height="60" style={{ overflow: "hidden", padding: "2px" }}>
                    <Solar src="/dat_icon/3_Icon_AppEmbody-14.png" width="30" height="30" color="black" val={Number(parseFloat(props.cal?.con_1 || 0).toFixed(2)).toLocaleString("en-US")} unit="kW" />
                </foreignObject>

                <foreignObject x="5.138" y="215.936" width="99.953" height="22.554" style={{ overflow: "hidden", padding: "2px" }}>
                    <div style={{ color: "gray", fontSize: "13px", width: "100%", textAlign: "center", alignItems: "center" }} >SoC: <span style={{ color: "black" }}>{parseInt(props.cal?.bat_2 || 0)}%</span></div>
                </foreignObject>



                <foreignObject x="193" y="112" width="102" height="68" style={{ overflow: "hidden", padding: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }}>
                        {/* <img src="/dat_icon/3_Icon_AppEmbody-15.png" width="60" height="60" alt="" /> */}
                        <img src="/dat_icon/inverter_2.png" width="100" height="100" alt="" />
                    </div>
                </foreignObject>
            </svg>
        </>
    );
};