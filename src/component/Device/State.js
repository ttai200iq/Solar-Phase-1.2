import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';
import { checkBrand } from '../../App';

export default function State(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="State">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'stateInverter' })}: &nbsp;
                    {(() => {
                        switch (checkBrand(info.value.type)) {
                            case 'SUNGROW':
                                return (<>
                                    {(() => {
                                        switch (parseInt(info.value.invt[info.value.pdata.status])) {
                                            case 2:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'stop' })}
                                                    </span>
                                                )
                                            case 8:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'standby' })}
                                                    </span>
                                                )
                                            case 16:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'initialstandby' })}
                                                    </span>
                                                )
                                            case 32:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'startup' })}
                                                    </span>
                                                )
                                            case 64:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'running' })}
                                                    </span>
                                                )
                                            case 256:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'fault' })}
                                                    </span>
                                                )
                                            case 1024:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'runningmaintain' })}
                                                    </span>
                                                )
                                            case 2048:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'runningforce' })}
                                                    </span>
                                                )
                                            case 4096:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'runningoffgrid' })}
                                                    </span>
                                                )
                                            case 9473:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'restarting' })}
                                                    </span>
                                                )
                                            case 16384:
                                                return (
                                                    <span style={{ color: "grey", fontSize: "14px" }}>
                                                        {dataLang.formatMessage({ id: 'runningems' })}
                                                    </span>
                                                )
                                            default:
                                                <></>
                                        }
                                    })()}
                                </>);
                            case 'INVT':
                                return (<>
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
                                </>);
                            default:
                                return (<></>);
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}
