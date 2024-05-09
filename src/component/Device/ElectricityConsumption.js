import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';

import { IoIosArrowUp } from 'react-icons/io';

export default function ElectricityConsumption(props) {
    const [display, setDisplay] = useState(true);
    const dataLang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="ElectricityConsumption">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">
                    {dataLang.formatMessage({ id: "electricConsumption" })}
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
                            <p>{dataLang.formatMessage({ id: "totalConsumption" })}: 0,00 W</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>Tiêu thụ tích lũy: 0,00 kWh</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>{dataLang.formatMessage({ id: "dailyConsumption" })}:  kWh</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
