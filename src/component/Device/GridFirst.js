import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { signal } from '@preact/signals-react';
import { alertDispatch } from '../Alert/Alert';
import { Token } from '../../App';

import { IoIosArrowUp } from 'react-icons/io';

const remote = signal(255);

export default function GridFirst(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);
    const [grid1, setgrid1] = useState(true);
    const [grid2, setgrid2] = useState(true);
    const [grid3, setgrid3] = useState(true);
    const grid_starttime_1 = useRef();
    const grid_endtime_1 = useRef();
    const grid_starttime_2 = useRef();
    const grid_endtime_2 = useRef();
    const grid_starttime_3 = useRef();
    const grid_endtime_3 = useRef();

    const config = [
        "grid_starttime_1",
        "grid_endtime_1",
        "grid_enable_1",
        "grid_starttime_2",
        "grid_endtime_2",
        "grid_enable_2",
        "grid_starttime_3",
        "grid_endtime_3",
        "grid_enable_3",
        "discharge_powerperlimit_1",
        "stop_soc_atdischarge",
    ]

    const handleChangegrid1 = (e) => {
        if (e.target.value === "enable") {
            setgrid1(false);
        } else {
            setgrid1(true);
        }
    };

    const handleChangegrid2 = (e) => {
        if (e.target.value === "enable") {
            setgrid2(false);
        } else {
            setgrid2(true);
        }
    };

    const handleChangegrid3 = (e) => {
        if (e.target.value === "enable") {
            setgrid3(false);
        } else {
            setgrid3(true);
        }
    };

    const invtCloud = async (data, token) => {
        var reqData = {
            data: data,
            token: token,
        };

        try {
            const response = await axios({
                url: host.CLOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData)
                    .map(function (key) {
                        return (
                            encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
                        );
                    })
                    .join("&"),
            });
            return response.data;
        } catch (e) {
            return { ret: 1, msg: "cloud err" };
        }
    };

    const remotecloud = async (data, token) => {
        var reqData = {
            "data": data,
            "token": token
        };

        try {
            const response = await axios({
                url: host.RMCLOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]) }).join('&'),
            });
            return response.data
        } catch (e) {
            return ({ ret: 1, msg: "cloud err" })
        }
    };

    const stopTimer = () => {
        clearInterval(intervalIDRef.current);
        intervalIDRef.current = null;
    };

    const startTimer = (hourminute1, hourminute1_, hourminute2, hourminute2_, hourminute3, hourminute3_) => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                if (remote.value < config.length) {
                    let key = config[remote.value]

                    let value = 0;

                    if (key === "grid_starttime_1") {
                        value = hourminute1;
                    }

                    if (key === "grid_endtime_1") {
                        value = hourminute1_;
                    }

                    if (key === "grid_enable_1") {
                        value = document.getElementById("grid_enable_1").value === "enable" ? 1 : 0;
                    }

                    if (key === "grid_starttime_2") {
                        value = hourminute2;
                    }

                    if (key === "grid_endtime_2") {
                        value = hourminute2_;
                    }

                    if (key === "grid_enable_2") {
                        value = document.getElementById("grid_enable_2").value === "enable" ? 1 : 0;
                    }

                    if (key === "grid_starttime_3") {
                        value = hourminute3;
                    }

                    if (key === "grid_endtime_3") {
                        value = hourminute3_;
                    }

                    if (key === "grid_enable_3") {
                        value = document.getElementById("grid_enable_3").value === "enable" ? 1 : 0;
                    }

                    if (key === "discharge_powerperlimit_1") {
                        value = parseInt(document.getElementById("discharge_powerperlimit_1").value);
                    }

                    if (key === "stop_soc_atdischarge") {
                        value = parseInt(document.getElementById("stop_soc_atdischarge").value);
                    }

                    let res = await remotecloud('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + value + '"}', Token.value.token)
                    console.log(res)
                    if (res.ret === 0) {
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                    }
                    remote.value = remote.value + 1
                } else {
                    remote.value = 255
                    stopTimer()
                }
            }
        }, 500);
    };

    const handleSetup = (e) => {
        e.preventDefault();
        remote.value = 0

        let hourminute1 = (Number(grid_starttime_1.current.value.split(":")[0]) << 8) | Number(grid_starttime_1.current.value.split(":")[1]);
        let hourminute1_ = (Number(grid_endtime_1.current.value.split(":")[0]) << 8) | Number(grid_endtime_1.current.value.split(":")[1]);
        let hourminute2 = (Number(grid_starttime_2.current.value.split(":")[0]) << 8) | Number(grid_starttime_2.current.value.split(":")[1]);
        let hourminute2_ = (Number(grid_endtime_2.current.value.split(":")[0]) << 8) | Number(grid_endtime_2.current.value.split(":")[1]);
        let hourminute3 = (Number(grid_starttime_3.current.value.split(":")[0]) << 8) | Number(grid_starttime_3.current.value.split(":")[1]);
        let hourminute3_ = (Number(grid_endtime_3.current.value.split(":")[0]) << 8) | Number(grid_endtime_3.current.value.split(":")[1]);

        startTimer(hourminute1, hourminute1_, hourminute2, hourminute2_, hourminute3, hourminute3_)
    }

    const handleRead = async (e) => {
        e.preventDefault();

        if (step === 0) {
            let res = await invtCloud('{"deviceCode": "' + info.value.plogger + '"}', Token.value.token)
            console.log(res)
            if (res.ret === 0) {
                setInvt(res.data)
                setStep(1)
            }
        }
    }

    useEffect(() => {
        if (step) {
            setStep(0)
            let hour1 = 0;
            let minute1 = 0;
            let hour1_ = 0;
            let minute1_ = 0;
            let hour2 = 0;
            let minute2 = 0;
            let hour2_ = 0;
            let minute2_ = 0;
            let hour3 = 0;
            let minute3 = 0;
            let hour3_ = 0;
            let minute3_ = 0;
            config.map((key) => {
                let fullNumber = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);

                if (key == "discharge_powerperlimit_1" || key == "stop_soc_atdischarge") {
                    document.getElementById(key).value = fullNumber;
                }

                if (key === "grid_enable_1") {
                    if (fullNumber === 1) {
                        setgrid1(false);
                        document.getElementById("grid_enable_1").value = "enable";
                    } else {
                        setgrid1(true);
                        document.getElementById("grid_enable_1").value = "disable";
                    }
                }

                if (key === "grid_enable_2") {
                    if (fullNumber === 1) {
                        setgrid2(false);
                        document.getElementById("grid_enable_2").value = "enable";
                    } else {
                        setgrid2(true);
                        document.getElementById("grid_enable_2").value = "disable";
                    }
                }

                if (key === "grid_enable_3") {
                    if (fullNumber === 1) {
                        setgrid3(false);
                        document.getElementById("grid_enable_3").value = "enable";
                    } else {
                        setgrid3(true);
                        document.getElementById("grid_enable_3").value = "disable";
                    }
                }

                if (key === "grid_starttime_1") {
                    hour1 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute1 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_starttime_1.current.value = (`${hour1}:${minute1}`);

                if (key === "grid_endtime_1") {
                    hour1_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute1_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_endtime_1.current.value = (`${hour1_}:${minute1_}`);

                if (key === "grid_starttime_2") {
                    hour2 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute2 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_starttime_2.current.value = (`${hour2}:${minute2}`);

                if (key === "grid_endtime_2") {
                    hour2_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute2_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_endtime_2.current.value = (`${hour2_}:${minute2_}`);

                if (key === "grid_starttime_3") {
                    hour3 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute3 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_starttime_3.current.value = (`${hour3}:${minute3}`);

                if (key === "grid_endtime_3") {
                    hour3_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute3_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                grid_endtime_3.current.value = (`${hour3_}:${minute3_}`);
            });
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="SystemTime">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: "GridFirst" })}</div>
                <div className="DAT_Info_Databox_Title_Right"
                    onClick={() => setDisplay(!display)}
                >
                    <IoIosArrowUp
                        size={20}
                        style={{
                            transform: display ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.5s",
                        }}
                    />
                </div>
            </div>

            <div className="Animation"
                style={{ height: display ? "100%" : "0px", transition: "0.5s" }}
            >
                {display ? (
                    <form className="DAT_Info_Databox_GridFirst" onSubmit={(e) => handleSetup(e)}>
                        <div className="DAT_Info_Databox_GridFirst_Content">
                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "GridFirstStartTime" })}:
                                    {/* <span id="grid_starttime_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid1 ? true : false}
                                        ref={grid_starttime_1}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEndTime' })}:
                                    {/* <span id="grid_endtime_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid1 ? true : false}
                                        ref={grid_endtime_1}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEnable' })}:
                                    {/* <span id="grid_enable_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="grid_enable_1" onChange={(e) => handleChangegrid1(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "GridFirstStartTime2" })}:
                                    {/* <span id="grid_starttime_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid2 ? true : false}
                                        ref={grid_starttime_2}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEndTime2' })}:
                                    {/* <span id="grid_endtime_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid2 ? true : false}
                                        ref={grid_endtime_2}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEnable2' })}:
                                    {/* <span id="grid_enable_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="grid_enable_2" onChange={(e) => handleChangegrid2(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "GridFirstStartTime3" })}:
                                    {/* <span id="grid_starttime_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid3 ? true : false}
                                        ref={grid_starttime_3}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEndTime3' })}:
                                    {/* <span id="grid_endtime_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={grid3 ? true : false}
                                        ref={grid_endtime_3}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'GridFirstEnable3' })}:
                                    {/* <span id="grid_enable_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="grid_enable_3" onChange={(e) => handleChangegrid3(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'DischargePowerLimit' })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" id="discharge_powerperlimit_1" />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'DischargePowerLimit2' })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" disabled />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'DischargePowerLimit3' })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" disabled />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'StopSOCatDischarge' })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" id="stop_soc_atdischarge" />
                                    %
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_GridFirst_Foot">
                            <button onClick={(e) => handleRead(e)}>
                                {dataLang.formatMessage({ id: 'read' })}
                            </button>
                            <button>
                                {dataLang.formatMessage({ id: 'setup' })}
                            </button>
                        </div>
                    </form>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
