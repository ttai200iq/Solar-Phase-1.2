import React, { useEffect, useReducer, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { signal } from '@preact/signals-react';
import { Token } from '../../App';
import { alertDispatch } from '../Alert/Alert';

import { IoIosArrowUp } from 'react-icons/io';
import { type } from 'jquery';

const remote = signal(255);

export default function GridVolt(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);

    const config_grid = [
        { key: "ac_under_voltage_1", type: "number" },
        { key: "ac_over_voltage_1", type: "number" },
        { key: "ac_under_voltagetime_1", type: "time" },
        { key: "ac_over_voltagetime_1", type: "time" },
        { key: "ac_under_voltage_2", type: "number" },
        { key: "ac_over_voltage_2", type: "number" },
        { key: "ac_under_voltagetime_2", type: "time" },
        { key: "ac_over_voltagetime_2", type: "time" },
        { key: "ac_under_fre_1", type: "number" },
        { key: "ac_over_fre_1", type: "number" },
        { key: "ac_under_fretime_1", type: "time" },
        { key: "ac_over_fretime_1", type: "time" },
        { key: "ac_under_fre_2", type: "number" },
        { key: "ac_over_fre_2", type: "number" },
        { key: "ac_under_fretime_2", type: "time" },
        { key: "ac_over_fretime_2", type: "time" },
    ]

    const config_hybrid = [
        { key: "ac_under_voltage_1", type: "number" },
        { key: "ac_over_voltage_1", type: "number" },
        { key: "ac_under_voltagetime_1", type: "time" },
        { key: "ac_over_voltagetime_1", type: "time" },
        { key: "ac_under_voltage_2", type: "number" },
        { key: "ac_over_voltage_2", type: "number" },
        { key: "ac_under_voltagetime_2", type: "time" },
        { key: "ac_over_voltagetime_2", type: "time" },
        { key: "ac_under_fre_1", type: "number" },
        { key: "ac_over_fre_1", type: "number" },
        { key: "ac_under_fretime_1", type: "time" },
        { key: "ac_over_fretime_1", type: "time" },
        { key: "ac_under_fre_2", type: "number" },
        { key: "ac_over_fre_2", type: "number" },
        { key: "ac_under_fretime_2", type: "time" },
        { key: "ac_over_fretime_2", type: "time" },
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
        <div className="DAT_Info_Databox" id="GridVolt">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'GridVFreqP' })}</div>
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
                                    return <form className="DAT_Info_Databox_GridVolt" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridVolt_Content">
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Right_Item" style={{ marginBottom: "24px" }}>
                      <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Tit">
                        AC Under Volt 3:
                      </div>
                      <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Content">
                        <input />
                        V
                      </div>
                    </div> */}
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Left_Item" style={{ marginBottom: "24px" }}>
                      <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Tit">
                        {dataLang.formatMessage({ id: 'ACUnderVolt3Time' })}:
                      </div>
                      <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Content">
                        <input />
                        ms
                      </div>
                    </div> */}
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item" >
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Item">
                      <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                        {dataLang.formatMessage({ id: 'FreqSetting' })}:
                      </div>
                      <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                        <select>
                          <option defaultValue={1} style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                          <option>50Hz</option>
                          <option>60Hz</option>
                        </select>
                      </div>
                    </div> */}
                                        </div>

                                        <div className="DAT_Info_Databox_GridVolt_Foot">
                                            <button onClick={(e) => handleRead(e)}>
                                                {dataLang.formatMessage({ id: 'read' })}
                                            </button>
                                            <button>
                                                {dataLang.formatMessage({ id: 'setup' })}
                                            </button>
                                        </div>
                                    </form>
                                case "CONSUMPTION":
                                    return <form className="DAT_Info_Databox_GridVolt" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridVolt_Content">
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Right_Item" style={{ marginBottom: "24px" }}>
                      <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Tit">
                        AC Under Volt 3:
                      </div>
                      <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Content">
                        <input />
                        V
                      </div>
                    </div> */}
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Left_Item" style={{ marginBottom: "24px" }}>
                      <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Tit">
                        {dataLang.formatMessage({ id: 'ACUnderVolt3Time' })}:
                      </div>
                      <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Content">
                        <input />
                        ms
                      </div>
                    </div> */}
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item" >
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'FreqSetting' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <select>
                                                        <option defaultValue={1} style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                                        <option>50Hz</option>
                                                        <option>60Hz</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>

                                        <div className="DAT_Info_Databox_GridVolt_Foot">
                                            <button onClick={(e) => handleRead(e)}>
                                                {dataLang.formatMessage({ id: 'read' })}
                                            </button>
                                            <button>
                                                {dataLang.formatMessage({ id: 'setup' })}
                                            </button>
                                        </div>
                                    </form>
                                default:
                                    return <form className="DAT_Info_Databox_GridVolt" onSubmit={(e) => handleSetup(e)}>
                                        <div className="DAT_Info_Databox_GridVolt_Content">
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_1" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_under_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="10.0 ~ 1000.0" type="number" min={10} max={1000} step="any" id="ac_over_voltage_2" />
                                                    V
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverVolt2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_voltagetime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Right_Item" style={{ marginBottom: "24px" }}>
                        <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Tit">
                          AC Under Volt 3:
                        </div>
                        <div className="DAT_Info_Databox_GridVolt_Content_Right_Item_Content">
                          <input />
                          V
                        </div>
                      </div> */}
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Left_Item" style={{ marginBottom: "24px" }}>
                        <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Tit">
                          {dataLang.formatMessage({ id: 'ACUnderVolt3Time' })}:
                        </div>
                        <div className="DAT_Info_Databox_GridVolt_Content_Left_Item_Content">
                          <input />
                          ms
                        </div>
                      </div> */}
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_1" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq1Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_1" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_under_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="45.00 ~ 65.00" type="number" min={45} max={65} step="any" id="ac_over_fre_2" />
                                                    Hz
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACUnderFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_under_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            <div className="DAT_Info_Databox_GridVolt_Content_Item" >
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'ACOverFreq2Time' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <input placeholder="20 ~ 5000" type="number" min={20} max={5000} step="any" id="ac_over_fretime_2" />
                                                    ms
                                                </div>
                                            </div>
                                            {/* <div className="DAT_Info_Databox_GridVolt_Content_Item">
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Tit">
                                                    {dataLang.formatMessage({ id: 'FreqSetting' })}:
                                                </div>
                                                <div className="DAT_Info_Databox_GridVolt_Content_Item_Content">
                                                    <select>
                                                        <option defaultValue={1} style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                                        <option>50Hz</option>
                                                        <option>60Hz</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>

                                        <div className="DAT_Info_Databox_GridVolt_Foot">
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
