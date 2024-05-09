import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import moment from 'moment-timezone';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { signal } from '@preact/signals-react';
import { info } from './Device';
import { alertDispatch } from '../Alert/Alert';
import { Token } from '../../App';

import { IoIosArrowUp } from 'react-icons/io';

const remote = signal(255);

export default function SystemTime(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);

    const date = useRef(moment(new Date()).format("yyyy-MM-DD"));
    const time = useRef(moment(new Date()).format("HH:mm:ss"));
    // const [datetime, setDatetime] = useState({
    //     yearmonth: 0,
    //     minutesecond: 0,
    //     dayhour: 0,
    // });

    const config = [
        "realtime_dayhour",
        "realtime_minutesecond",
        "realtime_yearmonth",
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

    const startTimer = (yearmonth, minutesecond, dayhour) => {
        intervalIDRef.current = setInterval(async () => {
            if (remote.value !== 255) {
                if (remote.value < config.length) {
                    let key = config[remote.value]
                    let value = 0;

                    if (key === 'realtime_dayhour') {
                        value = dayhour;
                    }

                    if (key === 'realtime_minutesecond') {
                        value = minutesecond;
                    }

                    if (key === 'realtime_yearmonth') {
                        value = yearmonth;
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

    const hanleSetup = (e) => {
        e.preventDefault();
        remote.value = 0

        let yearmonth = (Number(date.current.value.split('-')[0].slice(2)) << 8) | Number(date.current.value.split('-')[1]);
        let minutesecond = (Number(time.current.value.split(':')[1]) << 8) | Number(time.current.value.split(':')[2]);
        let dayhour = (Number(date.current.value.split('-')[2]) << 8) | Number(time.current.value.split(':')[0]);

        startTimer(yearmonth, minutesecond, dayhour)
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
            let day = 0;
            let month = 0;
            let year = 0;
            let hour = 0;
            let minute = 0;
            let second = 0;
            config.map((key) => {
                let fullNumber = parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal);
                if (key === 'realtime_dayhour') {
                    day = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    hour = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }

                if (key === 'realtime_minutesecond') {
                    minute = ((fullNumber >> 8) & 0xFF) < 10 ? '0' + ((fullNumber >> 8) & 0xFF) : ((fullNumber >> 8) & 0xFF);
                    second = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }

                if (key === 'realtime_yearmonth') {
                    year = (fullNumber >> 8) & 0xFF;
                    month = (fullNumber & 0xFF) < 10 ? '0' + (fullNumber & 0xFF) : (fullNumber & 0xFF);
                }
                date.current.value = (moment(new Date(`${month}/${day}/${year + 2000}`)).format("yyyy-MM-DD"))
                time.current.value = (`${hour}:${minute}:${second}`)
            })
        }
    }, [step]);

    return (
        <div className="DAT_Info_Databox" id="SystemTime">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: "SystemTime" })}</div>
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
                    <form className="DAT_Info_Databox_ExportPowerSettings" onSubmit={(e) => hanleSetup(e)}>
                        <div className="DAT_Info_Databox_ExportPowerSettings_Content">
                            <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item">
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: "SystemTime" })}:
                                    {/* <span id='realtime_dayhour'></span> <span id='realtime_minutesecond'></span> <span id='realtime_yearmonth'></span> */}
                                </div>
                                <div className="DAT_Info_Databox_ExportPowerSettings_Content_Item_Content">
                                    <input
                                        type='date'
                                        style={{ width: "150px", height: "25px", }}
                                        defaultValue={date.current}
                                        ref={date}
                                    />

                                    <input
                                        type='time'
                                        style={{ width: "150px", height: "25px", }}
                                        defaultValue={time.current}
                                        ref={time}
                                        step='any'
                                    />
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

