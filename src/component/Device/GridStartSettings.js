import React, { useEffect, useReducer, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { signal } from '@preact/signals-react';
import { info } from './Device';
import { alertDispatch } from '../Alert/Alert';
import { Token } from '../../App';

import { IoIosArrowUp } from 'react-icons/io';

const remote = signal(255);

export default function GridStartSettings(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);

    const config_hybrid = [
        { key: 'ac_high_fre', type: 'number' },
        { key: 'ac_low_fre', type: 'number' },
        { key: 'ac_high_voltage', type: 'number' },
        { key: 'ac_low_voltage', type: 'number' },
        { key: 'start_delay_time', type: 'time' },
        { key: 'restart_delay_time', type: 'time' },
    ]

    const config_grid = [
        { key: 'ac_high_fre', type: 'number' },
        { key: 'ac_low_fre', type: 'number' },
        { key: 'ac_high_voltage', type: 'number' },
        { key: 'ac_low_voltage', type: 'number' },
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
    }

    const stopTimer = () => {
        clearInterval(intervalIDRef.current);
        intervalIDRef.current = null;
    };

    const startTimer = () => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                switch (info.value.pdata.mode) {
                    case 'CONSUMPTION':
                        if (remote.value < config_grid.length) {
                            let key = config_grid[remote.value].key
                            console.log('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}')
                            let res = await remotecloud('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}', Token.value.token)
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
                        break;
                    case 'HYBRID':
                        if (remote.value < config_hybrid.length) {
                            let key = config_hybrid[remote.value].key
                            console.log('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}')
                            let res = await remotecloud('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}', Token.value.token)
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
                        break;
                    default:
                        if (remote.value < config_grid.length) {
                            let key = config_grid[remote.value].key
                            console.log('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}')
                            let res = await remotecloud('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}', Token.value.token)
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
                        break;
                }
            }
        }, 500);
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        remote.value = 0
        startTimer()
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
            switch (info.value.pdata.mode) {
                case 'CONSUMPTION':
                    config_grid.map((data) => {
                        document.getElementById(data.key).value = data.type === 'number' ? parseFloat(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal).toFixed(2) : parseInt(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal)
                    })
                    break;
                case 'HYBRID':
                    config_hybrid.map((data) => {
                        document.getElementById(data.key).value = data.type === 'number' ? parseFloat(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal).toFixed(2) : parseInt(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal)
                    })
                    break;
                default:
                    config_grid.map((data) => {
                        document.getElementById(data.key).value = data.type === 'number' ? parseFloat(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal).toFixed(2) : parseInt(invt[info.value.psetting[data.key].register] * info.value.psetting[data.key].cal)
                    })
                    break;
            }
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="GridStartSettings">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'Gridstartsettings' })}</div>
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
                    <>
                        {(() => {
                            switch (info.value.pdata.mode) {
                                case "HYBRID":
                                    return <form className="DAT_Info_Databox_GridStartSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridStartSettings_Content">
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_high_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_low_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_high_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_low_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    Start Delay Time:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="20 ~ 600" type="number" min={20} max={600} step="any" id={"start_delay_time"} />
                                                    s
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    Restart Delay Time:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="20 ~ 1000" type="number" min={20} max={1000} step="any" id={"restart_delay_time"} />
                                                    s
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_Info_Databox_GridStartSettings_Foot">
                                            <button onClick={(e) => handleRead(e)}>{dataLang.formatMessage({ id: 'read' })}</button>
                                            <button>{dataLang.formatMessage({ id: 'setup' })}</button>
                                        </div>
                                    </form>
                                case "CONSUMPTION":
                                    return <form className="DAT_Info_Databox_GridStartSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridStartSettings_Content">
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_high_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_low_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_high_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_low_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_Info_Databox_GridStartSettings_Foot">
                                            <button onClick={(e) => handleRead(e)}>{dataLang.formatMessage({ id: 'read' })}</button>
                                            <button>{dataLang.formatMessage({ id: 'setup' })}</button>
                                        </div>
                                    </form>
                                default:
                                    return <form className="DAT_Info_Databox_GridStartSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridStartSettings_Content">
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_high_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowVoltage' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id={"ac_low_voltage"} />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartHighFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_high_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridStartSettings_Content_Item">
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACStartLowFrequency' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridStartSettings_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id={"ac_low_fre"} />
                                                    Hz
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_Info_Databox_GridStartSettings_Foot">
                                            <button onClick={(e) => handleRead(e)}>{dataLang.formatMessage({ id: 'read' })}</button>
                                            <button>{dataLang.formatMessage({ id: 'setup' })}</button>
                                        </div>
                                    </form>
                            }
                        })()}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
