import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info, tab } from './Device';

import { IoIosArrowUp } from 'react-icons/io';

export default function BasicInfo(props) {
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);

    return (
        <div className="DAT_Info_Databox" id="Basic Information">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'basicInfo' })}</div>
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
                                        <>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>SN: {info.value.psn}</p>
                                                {/* <p>Sản lượng hàng ngày: {info.value.dailyproduction}</p> */}
                                            </div>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>{dataLang.formatMessage({ id: 'name' })}: {info.value.pname}</p>
                                            </div>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>{dataLang.formatMessage({ id: 'project' })}: {info.value.pplantname}</p>
                                                {/* <p>Sản lượng: {info.value.production}</p> */}
                                                {/* <p>Cập nhật mới nhất: {info.value.updated}</p> */}
                                            </div>
                                        </>
                                    )
                                case 'inverter':
                                    return (
                                        <>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>SN: {info.value.psn}</p>
                                                {/* <p>Sản lượng hàng ngày: {info.value.dailyproduction}</p> */}
                                            </div>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>{dataLang.formatMessage({ id: 'name' })}: {info.value.pname}</p>
                                            </div>
                                            <div className="DAT_Info_Databox_Content_Column">
                                                <p>{dataLang.formatMessage({ id: 'project' })}: {info.value.pplantname}</p>
                                                {/* <p>Sản lượng: {info.value.production}</p> */}
                                                {/* <p>Cập nhật mới nhất: {info.value.updated}</p> */}
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
