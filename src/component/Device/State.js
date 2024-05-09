import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';

export default function State(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="State">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'stateInverter' })}: &nbsp;
                    {(() => {
                        switch (parseInt(info.value.invt[info.value.pdata.status])) {
                            case 0:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'initialization' })}
                                    </span>
                                )
                            case 1:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'wait' })}
                                    </span>
                                )
                            case 2:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'gridconnection' })}
                                    </span>
                                )
                            case 3:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'failure' })}
                                    </span>
                                )
                            case 4:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'burn' })}
                                    </span>
                                )
                            case 5:
                                return (
                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                        {dataLang.formatMessage({ id: 'offgrid' })}
                                    </span>
                                )
                            default:
                                <></>
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}
