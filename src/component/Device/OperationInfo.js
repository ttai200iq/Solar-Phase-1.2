import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';

import { IoIosArrowUp } from 'react-icons/io';

export default function OperationInfo(props) {
    const dataLang = useIntl()
    const [display, setDisplay] = useState(true);

    return (
        <div className="DAT_Info_Databox" id="Version Information">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">
                    {dataLang.formatMessage({ id: 'operationInfo' })}
                </div>
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
                    <div className="DAT_Info_Databox_Content">
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>{dataLang.formatMessage({ id: 'dataUpload' })}: 5m</p>
                            <p>{dataLang.formatMessage({ id: 'signalStrength' })}: 74</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>{dataLang.formatMessage({ id: 'dataAcquisition' })}: 60s</p>
                            <p>{dataLang.formatMessage({ id: 'moduleMac' })}: F0FE6B2D42F6</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>{dataLang.formatMessage({ id: 'maxDevices' })}: 1 </p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
