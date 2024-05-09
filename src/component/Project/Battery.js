import React, { useEffect, useState } from 'react';
import "./Project.scss";

import { useIntl } from 'react-intl';
import { convertUnit, showUnit, showUnitk } from '../../App';
import { isMobile } from '../Navigation/Navigation';
import { useSelector } from 'react-redux';

import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

export default function Battery(props) {
    const dataLang = useIntl();
    const [state, setState] = useState(false);
    const month = useSelector((state) => state.tool.month);
    const year = useSelector((state) => state.tool.year);
    const total = useSelector((state) => state.tool.total);

    useEffect(() => {
        if (parseFloat(props.cal?.bat_1) > 0) {
            setState(true);
        } else {
            setState(false);
        }
    }, [props.cal.bat_1]);

    return (
        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Img">
                    <img src="/dat_icon/bat.png" alt="" style={{ width: "25px", height: "35px" }} />
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Status">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            gap: "4px",
                        }}
                    >
                        <span>SoC:</span>
                        <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                            {Number(parseFloat(props.cal?.bat_2 || 0).toFixed(2)).toLocaleString("en-US")}
                        </span>
                        <span style={{ fontSize: "12px", color: "grey" }}>%</span>
                    </div>
                    {state ? (
                        <FaArrowLeftLong color="green" size={30} />
                    ) : (
                        <FaArrowRightLong color="red" size={25} />
                    )}
                    <span style={{ fontSize: "13px" }}>
                        {state
                            ? dataLang.formatMessage({ id: "charge" })
                            : dataLang.formatMessage({ id: "discharge" })}
                    </span>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Data">
                    <span>{dataLang.formatMessage({ id: "batPower" })}</span>
                    &nbsp;
                    <span style={{ fontWeight: "650", fontFamily: "sans-serif", color: props.cal?.bat_1 < 0 ? "red" : "" }}>
                        {Number(parseFloat(convertUnit((Math.abs(props.cal?.bat_1 || 0)) / 1000)).toFixed(2) || 0).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "12px", color: "grey" }}>
                        {showUnit(props.cal?.bat_1 || 0)}W
                    </span>
                </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row">
                <div
                    className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left"
                    style={{ backgroundColor: "white" }}
                >
                    {isMobile.value ? (
                        <div
                            className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit"
                            style={{ borderBottom: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "charge" })}
                        </div>
                    ) : (
                        <div
                            className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit"
                            style={{ borderRight: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "charge" })}
                        </div>
                    )}

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "today" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.bat_in_1 || 0))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.bat_in_1 || 0)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "month" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(month.bat_in_month))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(month.bat_in_month)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "year" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(year.bat_in_year))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(year.bat_in_year)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "total" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(total.bat_in_total))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(total.bat_in_total)}Wh
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left"
                    style={{ backgroundColor: "white" }}
                >
                    {isMobile.value ? (
                        <div
                            className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit"
                            style={{ borderBottom: "solid 1px rgb(231, 231, 231)" }}
                        >
                            {dataLang.formatMessage({ id: "discharge" })}
                        </div>
                    ) : (
                        <div
                            className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit"
                            style={{ borderRight: "solid 1px rgb(231, 231, 231)" }}
                        >
                            {dataLang.formatMessage({ id: "discharge" })}
                        </div>
                    )}

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "today" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.bat_out_1 || 0))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.bat_out_1 || 0)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "month" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(month.bat_out_month))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(month.bat_out_month)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "year" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(year.bat_out_year))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(year.bat_out_year)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "total" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(total.bat_out_total))).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(total.bat_out_total)}Wh
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

