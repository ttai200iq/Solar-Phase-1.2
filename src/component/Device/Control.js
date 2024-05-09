import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';

import { IoIosArrowUp } from 'react-icons/io';

export default function Control(props) {
    const [display, setDisplay] = useState(true);
    const datalang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="Control">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{datalang.formatMessage({ id: 'control' })}</div>
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
                            <p>Bảo vệ hiệu ứng đảo: 0</p>
                            <p>Thời gian tắt khi điện áp quá thấp: 1800 ms</p>
                            <p>Thời gian ngắt kết nối khi tần số quá cao: 180 ms</p>
                            <p>Thời gian tắt tần số thứ cấp: 180 ms</p>
                            <p>Giá trị cài đặt công suất hoạt động: 044C KW</p>
                            <p>Chế độ giảm tải: 4</p>
                            <p>Khôi phục cài đặt gốc: 0</p>
                            <p>DCI pha T (mA): 1.00 mA</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>Tắt từ xa: 21845</p>
                            <p>Thời gian tắt quá áp thứ hai: 40 ms</p>
                            <p>Thời gian tắt tần số thấp: 180 ms</p>
                            <p>
                                Tỉ lệ Thay đổi Hoạt động Giảm công suất Quá tần số: 12%/0.1Hz
                            </p>
                            <p>Công suất giảm: 35.8032 kW</p>
                            <p>Phương pháp kiểm soát phản ứng: 0</p>
                            <p>Dòng DCI pha R(mA): -12.10 mA</p>
                        </div>
                        <div className="DAT_Info_Databox_Content_Column">
                            <p>Thời gian ngắt kết nối quá áp: 1800 ms</p>
                            <p>Thời gian tắt điện áp thấp cấp hai: 100 ms</p>
                            <p>Thời gian tắt tần số quá mức cấp hai: 180 ms</p>
                            <p>Chức năng giảm tải và tần số quá mức: 0</p>
                            <p>Cài đặt giá trị phản ứng: 0.00%</p>
                            <p>Xóa dữ liệu sản xuất: 0</p>
                            <p>Dòng DCI giai đoạn S (mA): 19,10 mA</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
