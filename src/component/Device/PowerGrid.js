import React, { useState } from 'react';
import "./Device.scss";
import { IoIosArrowUp } from 'react-icons/io';

export default function PowerGrid(props) {
    const [display, setDisplay] = useState(true);

    return (
        <div className="DAT_Info_Databox" id="PowerGrid">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">Mạng lưới điện</div>
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
                            <p>Dòng điện rò rỉ: 1,40 mA</p>
                            <p>Nguồn cấp vào lưới tích lũy: 0,00 kWh</p>
                            <p>Năng lượng mua hàng ngày: 0,00 kWh</p>
                            <p>Máy đo pha R Công suất: 0,00 W</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>Điện áp NBUS: 363,10 V</p>
                            <p>Năng lượng tích lũy đã mua: 0,00 kWh</p>
                            <p>Máy đo công suất: 0,00 W</p>
                            <p>Máy đo pha S Công suất: 0,00 W</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>Cấp điện áp lưới: 0</p>
                            <p>Nguồn cấp vào lưới hàng ngày: 0,00 kWh</p>
                            <p>Điện áp PBUS1:365,00 V</p>
                            <p>Máy đo pha T Công suất: 0,00 W</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
