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

export default function ExportPowerSettings(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);
    const [inverter, setInverter] = useState();

    const config_grid = [
        "export_power_enable",
        "export_power_limit",
        "meter_type",
        "export_limitpower_type",
    ]

    const config_hybrid = [
        "export_power_enable",
        "export_power_limit",
        "meter_type",
    ]

    const handleChange = (e) => {
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

    const startTimer = () => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                switch (info.value.pdata.mode) {
                    case 'CONSUMPTION':
                        if (remote.value < config_grid.length) {
                            let key = config_grid[remote.value]
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
                            let key = config_hybrid[remote.value]
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
                            let key = config_grid[remote.value]
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

    const handleSetup = (e) => {
        e.preventDefault();
        remote.value = 0
        startTimer()
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
            let pha = 0;
            let phb = 0;
            let phc = 0;

            pha = parseFloat(invt[info.value.pdata.pha.voltage.register] * info.value.pdata.pha.voltage.cal).toFixed(2);
            phb = parseFloat(invt[info.value.pdata.phb.voltage.register] * info.value.pdata.phb.voltage.cal).toFixed(2);
            phc = parseFloat(invt[info.value.pdata.phc.voltage.register] * info.value.pdata.phc.voltage.cal).toFixed(2);

            if (pha > 180 && phb > 180 && phc > 180) {
                setInverter("three_phase")
            } else {
                setInverter("single_phase")
            }

            switch (info.value.pdata.mode) {
                case 'CONSUMPTION':
                    config_grid.map((key) => {
                        if (key === "export_power_limit") {
                            document.getElementById(key).value = parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2);
                        }

                        if (key === "meter_type" || key === "export_limitpower_type") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
                        }

                        if (key === "export_power_enable") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                        }
                    })
                    break;
                case 'HYBRID':
                    config_hybrid.map((key) => {
                        if (key === "export_power_limit") {
                            document.getElementById(key).value = parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2);
                        }

                        if (key === "meter_type") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
                        }

                        if (key === "export_power_enable") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                        }
                    })
                    break;
                default:
                    config_grid.map((key) => {
                        if (key === "export_power_limit") {
                            document.getElementById(key).value = parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2);
                        }

                        if (key === "meter_type" || key === "export_limitpower_type") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
                        }

                        if (key === "export_power_enable") {
                            document.getElementById(key).value = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                        }
                    })
                    break;
            }
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="ExportPowerSettings">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'ExportPSetting' })}</div>
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
                                    return <form className="DAT_Info_Databox_ExportPowerSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_ExportPowerSettings_Content">
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPEnable' })}:
                                                    {/* &nbsp;
                                                    <span id="export_power_enable"></span> */}
                                                    {/* &nbsp;
                                                    <span id="inverter">{inverter}</span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="export_power_enable">
                                                        <option value={inverter === "three_phase" ? 59 : 33}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                        <option value={inverter === "three_phase" ? 58 : 32}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'MetterType' })}:
                                                    {/* &nbsp;
                                                    <span id="meter_type"></span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="meter_type" onChange={(e) => handleChange(e)}>
                                                        <option value={0}>CT</option>
                                                        <option value={1}>Tandardel Meter</option>
                                                        <option value={2}>DFUN Meter</option>
                                                        <option value={3}>Eastron Meter</option>
                                                        <option value={4}>Chint Meter</option>
                                                        <option value={5}>Gridbox2</option>
                                                        <option value={6}>Anti-Rejection Box</option>
                                                        <option value={7}>Yada Meter</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPLimit' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <input placeholder="-600.0 ~ 600.0" type="number" min={-600} max={600} step="any" id="export_power_limit" />
                                                    kW
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item" style={{ marginBottom: "24px" }}>
                                                    <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Tit">
                                                        Multi ExportLimit:
                                                        {dataLang.formatMessage({ id: 'MultiExportLimit' })}:
                                                    </div>
                                                    <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Content">
                                                        <select>
                                                        <option>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                        <option>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                                        </select>
                                                    </div>
                                                </div> */}
                                            {/* <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                    <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                        {dataLang.formatMessage({ id: 'ExportLimitWay' })}: <span id="export_limitpower_type"></span>
                                                    </div>
                                                    <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                        <select>
                                                        <option>{dataLang.formatMessage({ id: 'LimitSinglePhase' })}</option>
                                                        <option>{dataLang.formatMessage({ id: 'LimitThreePhase' })}</option>
                                                        </select>
                                                    </div>
                                                </div> */}
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
                                case "CONSUMPTION":
                                    return <form className="DAT_Info_Databox_ExportPowerSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_ExportPowerSettings_Content">
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPEnable' })}:
                                                    {/* &nbsp;
                                                <span id="export_power_enable"></span> */}
                                                    {/* &nbsp;
                                                    <span id="inverter">{inverter}</span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="export_power_enable">
                                                        <option value={inverter === "single_phase" ? 33 : 59}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                        <option value={inverter === "single_phase" ? 32 : 58}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPLimit' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <input placeholder="-600.0 ~ 600.0" type="number" min={-600} max={600} step="any" id="export_power_limit" />
                                                    kW
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item" style={{ marginBottom: "24px" }}>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Tit">
                                            Multi ExportLimit:
                                            {dataLang.formatMessage({ id: 'MultiExportLimit' })}:
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Content">
                                            <select>
                                                <option>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                <option>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                            </select>
                                            </div>
                                        </div> */}
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportLimitWay' })}:
                                                    {/* &nbsp;
                                                <span id="export_limitpower_type"></span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="export_limitpower_type" onChange={(e) => handleChange(e)}>
                                                        <option value={0}>{dataLang.formatMessage({ id: 'LimitSinglePhase' })}</option>
                                                        <option value={1}>{dataLang.formatMessage({ id: 'LimitThreePhase' })}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'MetterType' })}:
                                                    {/* &nbsp;
                                                <span id="meter_type"></span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="meter_type" onChange={(e) => handleChange(e)}>
                                                        <option value={0}>CT</option>
                                                        <option value={1}>Tandardel Meter</option>
                                                        <option value={2}>DFUN Meter</option>
                                                        <option value={3}>Eastron Meter</option>
                                                        <option value={4}>Chint Meter</option>
                                                        <option value={5}>Gridbox2</option>
                                                        <option value={6}>Anti-Rejection Box</option>
                                                        <option value={7}>Yada Meter</option>
                                                    </select>
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
                                default:
                                    return <form className="DAT_Info_Databox_ExportPowerSettings" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_ExportPowerSettings_Content">
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPEnable' })}:
                                                    {/* &nbsp;
                                                    <span id="export_power_enable"></span> */}
                                                    {/* &nbsp;
                                                    <span id="inverter">{inverter}</span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="export_power_enable">
                                                        <option value={inverter === "single_phase" ? 33 : 59}>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                        <option value={inverter === "single_phase" ? 32 : 58}>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportPLimit' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <input placeholder="-600.0 ~ 600.0" type="number" min={-600} max={600} step="any" id="export_power_limit" />
                                                    kW
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item" style={{ marginBottom: "24px" }}>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Tit">
                                                Multi ExportLimit:
                                                {dataLang.formatMessage({ id: 'MultiExportLimit' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Center_Item_Content">
                                                <select>
                                                    <option>{dataLang.formatMessage({ id: 'Enable' })}</option>
                                                    <option>{dataLang.formatMessage({ id: 'Disable' })}</option>
                                                </select>
                                                </div>
                                            </div> */}
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ExportLimitWay' })}:
                                                    {/* &nbsp;
                                                    <span id="export_limitpower_type"></span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="export_limitpower_type" onChange={(e) => handleChange(e)}>
                                                        <option value={0}>{dataLang.formatMessage({ id: 'LimitSinglePhase' })}</option>
                                                        <option value={1}>{dataLang.formatMessage({ id: 'LimitThreePhase' })}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'MetterType' })}:
                                                    {/* &nbsp;
                                                    <span id="meter_type"></span> */}
                                                </div>
                                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                                    <select id="meter_type" onChange={(e) => handleChange(e)}>
                                                        <option value={0}>CT</option>
                                                        <option value={1}>Tandardel Meter</option>
                                                        <option value={2}>DFUN Meter</option>
                                                        <option value={3}>Eastron Meter</option>
                                                        <option value={4}>Chint Meter</option>
                                                        <option value={5}>Gridbox2</option>
                                                        <option value={6}>Anti-Rejection Box</option>
                                                        <option value={7}>Yada Meter</option>
                                                    </select>
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

