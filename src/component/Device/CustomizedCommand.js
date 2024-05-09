import React from 'react';
import "./Device.scss";
import { useIntl } from 'react-intl';

export default function CustomizedCommand(props) {
    const dataLang = useIntl();

    return (
        <>
            <div className="DAT_Info_Databox" id="CustomizedCommand">
                <div className="DAT_Info_Databox_CustomizedCommand">
                    <div className="DAT_Info_Databox_CustomizedCommand_Content" style={{ height: "300px" }}>
                    </div>
                </div>
            </div>

            <div className="DAT_Info_Databox" id="CustomizedCommand">
                <div className="DAT_Info_Databox_CustomizedCommand">
                    <div className="DAT_Info_Databox_CustomizedCommand_Foot">
                        <div className="DAT_Info_Databox_CustomizedCommand_Foot_Func">
                            <select>
                                <option>{dataLang.formatMessage({ id: 'OneminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'TwominsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'ThreeminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'FourminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'FiveminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'SixminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'SevenminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'EightminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'NineminsTimeout' })}</option>
                                <option>{dataLang.formatMessage({ id: 'TenminsTimeout' })}</option>
                            </select>
                            <button>{dataLang.formatMessage({ id: 'ClickCalculateCRC' })}</button>
                        </div>
                        <textarea placeholder="Please Enter Command" />
                        <div className="DAT_Info_Databox_CustomizedCommand_Foot_Button">
                            <button>{dataLang.formatMessage({ id: 'confirm' })}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
