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

export default function BatteryFirst(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);
    const [bat1, setBat1] = useState(true);
    const [bat2, setBat2] = useState(true);
    const [bat3, setBat3] = useState(true);
    const bat_starttime_1 = useRef();
    const bat_endtime_1 = useRef();
    const bat_starttime_2 = useRef();
    const bat_endtime_2 = useRef();
    const bat_starttime_3 = useRef();
    const bat_endtime_3 = useRef();

    const config = [
        "bat_starttime_1",
        "bat_endtime_1",
        "bat_enable_1",
        "bat_starttime_2",
        "bat_endtime_2",
        "bat_enable_2",
        "bat_starttime_3",
        "bat_endtime_3",
        "bat_enable_3",
        "charge_powerperlimit_1",
        "stop_soc_whilecharge",
        "inverter_charge_enable",
    ];

    const handleChangeBat1 = (e) => {
        if (e.target.value === "enable") {
            setBat1(false);
        } else {
            setBat1(true);
        }
    };

    const handleChangeBat2 = (e) => {
        if (e.target.value === "enable") {
            setBat2(false);
        } else {
            setBat2(true);
        }
    };

    const handleChangeBat3 = (e) => {
        if (e.target.value === "enable") {
            setBat3(false);
        } else {
            setBat3(true);
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

                    if (key === "bat_starttime_1") {
                        value = hourminute1;
                    }

                    if (key === "bat_endtime_1") {
                        value = hourminute1_;
                    }

                    if (key === "bat_enable_1") {
                        value = document.getElementById("bat_enable_1").value === "enable" ? 1 : 0;
                    }

                    if (key === "bat_starttime_2") {
                        value = hourminute2;
                    }

                    if (key === "bat_endtime_2") {
                        value = hourminute2_;
                    }

                    if (key === "bat_enable_2") {
                        value = document.getElementById("bat_enable_2").value === "enable" ? 1 : 0;
                    }

                    if (key === "bat_starttime_3") {
                        value = hourminute3;
                    }

                    if (key === "bat_endtime_3") {
                        value = hourminute3_;
                    }

                    if (key === "bat_enable_3") {
                        value = document.getElementById("bat_enable_3").value === "enable" ? 1 : 0;
                    }

                    if (key === "charge_powerperlimit_1") {
                        value = parseInt(document.getElementById("charge_powerperlimit_1").value);
                    }

                    if (key === "stop_soc_whilecharge") {
                        value = parseInt(document.getElementById("stop_soc_whilecharge").value);
                    }

                    if (key === "inverter_charge_enable") {
                        value = document.getElementById("inverter_charge_enable").value === "enable" ? 1 : 0;
                    }

                    console.log('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + value + '"}')
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

        let hourminute1 = (Number(bat_starttime_1.current.value.split(":")[0]) << 8) | Number(bat_starttime_1.current.value.split(":")[1]);
        let hourminute1_ = (Number(bat_endtime_1.current.value.split(":")[0]) << 8) | Number(bat_endtime_1.current.value.split(":")[1]);
        let hourminute2 = (Number(bat_starttime_2.current.value.split(":")[0]) << 8) | Number(bat_starttime_2.current.value.split(":")[1]);
        let hourminute2_ = (Number(bat_endtime_2.current.value.split(":")[0]) << 8) | Number(bat_endtime_2.current.value.split(":")[1]);
        let hourminute3 = (Number(bat_starttime_3.current.value.split(":")[0]) << 8) | Number(bat_starttime_3.current.value.split(":")[1]);
        let hourminute3_ = (Number(bat_endtime_3.current.value.split(":")[0]) << 8) | Number(bat_endtime_3.current.value.split(":")[1]);

        startTimer(hourminute1, hourminute1_, hourminute2, hourminute2_, hourminute3, hourminute3_)
    };

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
    };

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

                if (key === "charge_powerperlimit_1" || key === "stop_soc_whilecharge") {
                    document.getElementById(key).value = fullNumber;
                }

                if (key === "bat_enable_1") {
                    if (fullNumber === 1) {
                        setBat1(false);
                        document.getElementById("bat_enable_1").value = "enable";
                    } else {
                        setBat1(true);
                        document.getElementById("bat_enable_1").value = "disable";
                    }
                }

                if (key === "bat_enable_2") {
                    if (fullNumber === 1) {
                        setBat2(false);
                        document.getElementById("bat_enable_2").value = "enable";
                    } else {
                        setBat2(true);
                        document.getElementById("bat_enable_2").value = "disable";
                    }
                }

                if (key === "bat_enable_3") {
                    if (fullNumber === 1) {
                        setBat3(false);
                        document.getElementById("bat_enable_3").value = "enable";
                    } else {
                        setBat3(true);
                        document.getElementById("bat_enable_3").value = "disable";
                    }
                }

                if (key === "inverter_charge_enable") {
                    if (fullNumber === 1) {
                        document.getElementById("inverter_charge_enable").value = "enable";
                    } else {
                        document.getElementById("inverter_charge_enable").value = "disable";
                    }
                }

                if (key === "bat_starttime_1") {
                    hour1 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute1 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_starttime_1.current.value = (`${hour1}:${minute1}`);

                if (key === "bat_endtime_1") {
                    hour1_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute1_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_endtime_1.current.value = (`${hour1_}:${minute1_}`);

                if (key === "bat_starttime_2") {
                    hour2 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute2 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_starttime_2.current.value = (`${hour2}:${minute2}`);

                if (key === "bat_endtime_2") {
                    hour2_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute2_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_endtime_2.current.value = (`${hour2_}:${minute2_}`);

                if (key === "bat_starttime_3") {
                    hour3 = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute3 = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_starttime_3.current.value = (`${hour3}:${minute3}`);

                if (key === "bat_endtime_3") {
                    hour3_ = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    minute3_ = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                bat_endtime_3.current.value = (`${hour3_}:${minute3_}`);
            });
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="BatteryFirst">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: "BatteryFirst" })}</div>
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
                                    {dataLang.formatMessage({ id: "BatteryFirstStartTime" })}:
                                    {/* <span id="bat_starttime_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat1 ? true : false}
                                        ref={bat_starttime_1}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEndTime" })}:
                                    {/* <span id="bat_endtime_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat1 ? true : false}
                                        ref={bat_endtime_1}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEnable" })}:
                                    {/* <span id="bat_enable_1"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="bat_enable_1" onChange={(e) => handleChangeBat1(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstStartTime2" })}:
                                    {/* <span id="bat_starttime_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat2 ? true : false}
                                        ref={bat_starttime_2}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEndTime2" })}:
                                    {/* <span id="bat_endtime_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat2 ? true : false}
                                        ref={bat_endtime_2}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEnable2" })}:
                                    {/* <span id="bat_enable_2"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="bat_enable_2" onChange={(e) => handleChangeBat2(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstStartTime3" })}:
                                    {/* <span id="bat_starttime_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat3 ? true : false}
                                        ref={bat_starttime_3}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEndTime3" })}:
                                    {/* <span id="bat_endtime_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input
                                        type='time'
                                        disabled={bat3 ? true : false}
                                        ref={bat_endtime_3}
                                        step='any'
                                    />
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryFirstEnable3" })}:
                                    {/* <span id="bat_enable_3"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="bat_enable_3" onChange={(e) => handleChangeBat3(e)}>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "ChargePowerLimit" })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" id="charge_powerperlimit_1" />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "ChargePowerLimit2" })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" disabled />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "ChargePowerLimit3" })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" disabled />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "StopSOCatCharge" })}:
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" id="stop_soc_whilecharge" />
                                    %
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_GridFirst_Content_Item">
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "InverterChargeEnable" })}:
                                    {/* <span id="inverter_charge_enable"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_GridFirst_Content_Item_Content">
                                    <select id="inverter_charge_enable" >
                                        <option value={"enable"}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                        <option value={"disable"}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                    </select>
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
