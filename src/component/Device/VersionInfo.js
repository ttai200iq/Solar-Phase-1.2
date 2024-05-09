import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info, tab } from './Device';

import { IoIosArrowUp } from 'react-icons/io';

export default function VersionInfo(props) {
    const dataLang = useIntl()
    const [display, setDisplay] = useState(true);

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
