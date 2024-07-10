import React, { useEffect, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info, tab } from './Device';

import { IoIosArrowUp } from 'react-icons/io';
import { checkBrand } from '../../App';

export default function VersionInfo(props) {
    const dataLang = useIntl()
    const [display, setDisplay] = useState(true);

    useEffect(() => {
        // let masterver = JSON.parse(info.value.pdata.masterver.register);
        // console.log(masterver.map((item, index) => { return info.value.invt[item]; }));
        // const hexString = masterver.map((item, index) => parseInt(info.value.invt[item]).toString(16)).join("");
        // const asciiString = hexString.match(/.{2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
        // console.log(asciiString);

        let vicever = JSON.parse(info.value.pdata.vicever.register);
        // console.log(vicever.map((item, index) => { return info.value.invt[item]; }));
        const hexString = vicever.map((item, index) => parseInt(info.value.invt[item]).toString(16)).join("");
        const asciiString = hexString.match(/.{2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
        console.log(asciiString);

        // const decimalArray = JSON.parse(item.setting.sn);
        //   const hexString = decimalArray.map((num) => parseInt(res.data[num]).toString(16)).join("");
        //   const asciiString = hexString.match(/.{2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
    }, []);

    return (
        <div className="DAT_Info_Databox" id="Version Information">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'versionInfo' })}</div>
                <div className="DAT_Info_Databox_Title_Right" onClick={() => setDisplay(!display)}>
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
                    <div className="DAT_Info_Databox_Content">
                        {(() => {
                            switch (tab.value) {
                                case 'logger':
                                    return (
                                        <div className="DAT_Info_Databox_Content_Column">
                                            <p>
                                                {dataLang.formatMessage({ id: 'moduleVersion' })}: {info.value.pversion}
                                            </p>
                                        </div>
                                    )
                                case 'inverter':
                                    return (
                                        <>
                                            {(() => {
                                                switch (checkBrand(info.value.type)) {
                                                    case 'SUNGROW':
                                                        return (<>
                                                            <div className="DAT_Info_Databox_Content_Column">
                                                                <p>
                                                                    {dataLang.formatMessage({ id: 'masterVersion' })}: {`${info.value.invt[info.value.pdata.masterver.register]?.[0] || 0}.${info.value.invt[info.value.pdata.masterver.register]?.[1] || 0}.${info.value.invt[info.value.pdata.masterver.register]?.[2] || 0}`}
                                                                </p>
                                                            </div>
                                                            <div className="DAT_Info_Databox_Content_Column">
                                                                <p>
                                                                    {dataLang.formatMessage({ id: 'viceVersion' })}: {`${info.value.invt[info.value.pdata.vicever.register]?.[0] || 0}.${info.value.invt[info.value.pdata.vicever.register]?.[1] || 0}.${info.value.invt[info.value.pdata.vicever.register]?.[2] || 0}`}
                                                                </p>
                                                            </div>
                                                        </>);
                                                    case 'INVT':
                                                        return (<>
                                                            <div className="DAT_Info_Databox_Content_Column">
                                                                <p>
                                                                    {dataLang.formatMessage({ id: 'masterVersion' })}: {`${info.value.invt[info.value.pdata.masterver.register]?.[0] || 0}.${info.value.invt[info.value.pdata.masterver.register]?.[1] || 0}.${info.value.invt[info.value.pdata.masterver.register]?.[2] || 0}`}
                                                                </p>
                                                            </div>
                                                            <div className="DAT_Info_Databox_Content_Column">
                                                                <p>
                                                                    {dataLang.formatMessage({ id: 'viceVersion' })}: {`${info.value.invt[info.value.pdata.vicever.register]?.[0] || 0}.${info.value.invt[info.value.pdata.vicever.register]?.[1] || 0}.${info.value.invt[info.value.pdata.vicever.register]?.[2] || 0}`}
                                                                </p>
                                                            </div>
                                                            <div className="DAT_Info_Databox_Content_Column">
                                                                <p>
                                                                    {dataLang.formatMessage({ id: 'hmiVersion' })}: {`${info.value.invt[info.value.pdata.hmiver.register]?.[0] || 0}.${info.value.invt[info.value.pdata.hmiver.register]?.[1] || 0}.${info.value.invt[info.value.pdata.hmiver.register]?.[2] || 0}`}
                                                                </p>
                                                            </div>
                                                        </>);
                                                    default:
                                                        return (<></>);
                                                }
                                            })()}
                                        </>
                                    )
                                default:
                                    <></>
                            }
                        })()}

                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
}
