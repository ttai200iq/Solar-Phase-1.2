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

export default function BatterySettings(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);

    const config = [
        "bat_type",
        "bat_manufacture",
        "bat_depthdiscarge_dod",
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

    const startTimer = () => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                if (remote.value < config.length) {
                    let key = config[remote.value]
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
            }
        }, 500);
    };

    const handleSetup = (e) => {
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
            config.map((key) => {
                document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
            });
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="BatterySettings">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: "BatterySettings" })}</div>
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
                    <form className="DAT_Info_Databox_ExportPowerSettings" onSubmit={(e) => handleSetup(e)}>
                        <div className="DAT_Info_Databox_ExportPowerSettings_Content">
                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryType" })}:
                                    {/* &nbsp;
                                    <span id="bat_type"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                    <select id="bat_type">
                                        <option value={0}>{dataLang.formatMessage({ id: "LeadAcidBattery" })}</option>
                                        <option value={1}>{dataLang.formatMessage({ id: "LithumBattery" })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryManu" })}:
                                    {/* &nbsp;
                                    <span id="bat_manufacture"></span> */}
                                </div>
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                    <select id="bat_manufacture">
                                        {/* <option>Lead Acid Battery</option> */}
                                        <option value={1}>ATL Battery</option>
                                        <option value={2}>PYLON Battery</option>
                                        <option value={3}>Vestwoods Battery</option>
                                        <option value={4}>Topband Battery</option>
                                        <option value={5}>Sunwoda Battery</option>
                                        <option value={6}>HANCHU Battery</option>
                                        <option value={7}>INVT Battery</option>
                                        {/* <option>LiValley Battery</option>
                                        <option>DONGCI Battery</option>
                                        <option>JGNE Battery</option> */}
                                    </select>
                                </div>
                            </div>

                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "BatteryDOD" })}:
                                </div>
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                    <input placeholder="0 ~ 100" type="number" min={0} max={100} step="any" id="bat_depthdiscarge_dod" />
                                    %
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_ExportPowerSettings_Foot">
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
