import React, { useEffect, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';

import { IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { info } from './Device';
import { Token } from '../../App';

export default function GridInfo(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});

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
            document.getElementById("inverter_status").value = parseInt(invt[info.value.psetting["inverter_status"].register] * info.value.psetting["inverter_status"].cal);
        }
    }, [step])

    return (
        <div className="DAT_Info_Databox" id="GridInfo">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'GridInfor' })}</div>
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
                    <form className="DAT_Info_Databox_GridInfo" onSubmit={(e) => handleRead(e)}>
                        <div className="DAT_Info_Databox_GridInfo_Content">
                            <div className="DAT_Info_Databox_GridInfo_Content_Item">
                                <div className="DAT_Info_Databox_GridInfo_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'InverterStatus' })}:
                                </div>
                                <div className="DAT_Info_Databox_GridInfo_Content_Item_Content">
                                    <select id='inverter_status'>
                                        <option value={0}>{dataLang.formatMessage({ id: 'StatusInit' })}</option>
                                        <option value={1}>{dataLang.formatMessage({ id: 'StatusWait' })}</option>
                                        <option value={2}>{dataLang.formatMessage({ id: 'StatusOnGrid' })}</option>
                                        <option value={3}>{dataLang.formatMessage({ id: 'failure' })}</option>
                                        <option value={4}>{dataLang.formatMessage({ id: 'burn' })}</option>
                                        <option value={5}>{dataLang.formatMessage({ id: 'StatusOffGrid' })}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_GridInfo_Foot">
                            <button>
                                {dataLang.formatMessage({ id: 'read' })}
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
