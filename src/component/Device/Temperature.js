import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';

export default function Temperature(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="Temperature">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'temperatureInverter' })}: &nbsp;
                    <span style={{ color: "grey", fontSize: "14px" }}>
                        {parseFloat(info.value.invt[info.value.pdata.temp.register] * info.value.pdata.temp.cal).toFixed(2)} °C
                    </span>
                </div>
            </div>
        </div>
    );
}
