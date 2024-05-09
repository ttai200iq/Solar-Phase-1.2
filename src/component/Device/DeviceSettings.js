import React, { useEffect, useReducer, useState } from 'react';
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

export default function DeviceSettings(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);
    const [manu, setManu] = useState(0);

    const config = [
        "remote_control",
        "safety_setting",
        "active_power_setting",
        "reactive_power_control",
        "input_mode_setting",
    ]

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

    const startTimer = (type) => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                if (remote.value < config.length) {
                    let key = config[remote.value]
                    let value = 0;

                    if (key === "safety_setting") {
                        value = type;
                    } else {
                        value = parseInt(document.getElementById(key).value / info.value.psetting[key].cal);
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

        let type = (Number(document.getElementById('safety_setting').value) << 8) | Number(manu);
        startTimer(type)
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
            let type = 0;
            config.map((key) => {
                let fullNumber = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
                if (key === "safety_setting") {
                    type = (fullNumber >> 8);
                    setManu(fullNumber & 0xFF);
                    document.getElementById(key).value = type;
                } else {
                    document.getElementById(key).value = fullNumber;
                }
            });
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="DeviceSettings">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'DeviceSettings' })}</div>
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
                {display ?
                    <form className="DAT_Info_Databox_DeviceSettings" onSubmit={(e) => handleSetup(e)}>
                        <div className="DAT_Info_Databox_DeviceSettings_Content">
                            {/* remote_control */}
                            <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'RemoteControl' })}:
                                    {/* &nbsp;
                                    <span id="remote_control"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Content">
                                    <select id="remote_control">
                                        <option value={21845}>{dataLang.formatMessage({ id: 'PowerOn' })}</option>
                                        <option value={43690}>{dataLang.formatMessage({ id: 'PowerOff' })}</option>
                                    </select>
                                </div>
                            </div>

                            {/* safety_setting */}
                            <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'SafetySetting' })}:
                                    {/* &nbsp;
                                    <span id="safety_setting"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Content">
                                    <select id="safety_setting">
                                        <option style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                        <option value={0}>CQC2013</option>
                                        <option value={1}>SKYWORTH</option>
                                        <option value={2}>EN50549</option>
                                        <option value={3}>Brazil</option>
                                        <option value={4}>{dataLang.formatMessage({ id: 'Spain' })}</option>
                                        <option value={5}>Philippines</option>
                                        <option value={6}>{dataLang.formatMessage({ id: 'India' })}</option>
                                        <option value={7}>{dataLang.formatMessage({ id: 'Belgium' })}</option>
                                        <option value={8}>EU EN50438</option>
                                        <option value={9}>{dataLang.formatMessage({ id: 'SouthAfrica' })}</option>
                                        <option value={10}>{dataLang.formatMessage({ id: 'WestAustralia' })}</option>
                                        <option value={11}>{dataLang.formatMessage({ id: 'Netherlands' })}</option>
                                        <option value={12}>{dataLang.formatMessage({ id: 'Thailand' })}</option>
                                        <option value={13}>Bangkok</option>
                                        <option value={14}>China CQC2018</option>
                                        <option value={15}>{dataLang.formatMessage({ id: 'Greece' })}</option>
                                        <option value={16}>{dataLang.formatMessage({ id: 'Norway' })}</option>
                                        <option value={17}>{dataLang.formatMessage({ id: 'SouthKorea' })}</option>
                                        <option value={18}>{dataLang.formatMessage({ id: 'Germany' })}</option>
                                        <option value={19}>{dataLang.formatMessage({ id: 'France' })}</option>
                                        <option value={20}>Ireland</option>
                                        <option value={21}>{dataLang.formatMessage({ id: 'Turkey' })}</option>
                                        <option value={22}>{dataLang.formatMessage({ id: 'Taiwan' })}</option>
                                        <option value={23}>{dataLang.formatMessage({ id: 'Italy' })}</option>
                                        <option value={24}>Slovakia</option>
                                        <option value={25}>Romania 280V</option>
                                    </select>
                                </div>
                            </div>

                            {/* <div className="DAT_Info_Databox_DeviceSettings_Content_Left_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Left_Item_Tit">
                                    AC High-Voltage Load Limit:
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Left_Item_Content">
                                    <select>
                                        <option>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                        <option>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                    </select>
                                </div>
                            </div> */}

                            {/* active_power_setting */}
                            <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'ActivePowerSetting' })}:
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Content">
                                    <input placeholder="0.0 ~ 100.0" type="number" min={0} max={100} step="any" id="active_power_setting" />
                                    %
                                </div>
                            </div>

                            {/* <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                    <div className="DAT_Info_Databox_DeviceSettings_Content_Center_Item_Tit">
                                        Virtual Zero Line Enable:
                                    </div>
                                    <div className="DAT_Info_Databox_DeviceSettings_Content_Center_Item_Content">
                                        <select>
                                        <option>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                        <option>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                        </select>
                                    </div>
                            </div> */}

                            {/* reactive_power_control */}
                            <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'ReactivePowerSetting' })}:
                                    {/* &nbsp;
                                    <span id="reactive_power_control"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Content">
                                    <select id="reactive_power_control">
                                        <option value={0}>{dataLang.formatMessage({ id: 'PowerFactor' })}</option>
                                        <option value={1}>{dataLang.formatMessage({ id: 'ReactivePPercentage' })}</option>
                                        <option value={2}>QV curve control</option>
                                    </select>
                                </div>
                            </div>

                            {/* input_mode_setting */}
                            <div className="DAT_Info_Databox_DeviceSettings_Content_Item">
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'InputModeSetting' })}:
                                    {/* &nbsp;
                                    <span id="input_mode_setting"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_DeviceSettings_Content_Item_Content">
                                    <select id="input_mode_setting">
                                        <option value={0}>{dataLang.formatMessage({ id: 'IndependentMode' })}</option>
                                        <option value={1}>{dataLang.formatMessage({ id: 'ParrallellMode' })}</option>
                                        <option value={2}>{dataLang.formatMessage({ id: 'DCSourceMode' })}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_DeviceSettings_Foot">
                            <button onClick={(e) => handleRead(e)}>
                                {dataLang.formatMessage({ id: 'read' })}
                            </button>
                            <button>
                                {dataLang.formatMessage({ id: 'setup' })}
                            </button>
                        </div>
                    </form>
                    :
                    <></>
                }
            </div>
        </div>
    );
}
