import React from 'react';
import "./Project.scss";

import { useIntl } from 'react-intl';
import { convertUnit, showUnit, showUnitk } from '../../App';
import { isMobile } from '../Navigation/Navigation';
import { useSelector } from 'react-redux';

export default function Grid(props) {
    const dataLang = useIntl();
    const month = useSelector((state) => state.tool.month);
    const year = useSelector((state) => state.tool.year);

    return (
        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid">
            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data_Img">
                    <img src="/dat_icon/grid.png" alt="" style={{ width: "35px", height: "35px" }} />
                </div>
                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Data_Data">
                    <span>{dataLang.formatMessage({ id: "gridData_" })}</span>
                    &nbsp;
                    <span style={{ fontWeight: "650", fontFamily: "sans-serif", color: props.cal?.grid_1 < 0 ? "red" : "black" }}>
                        {Number(parseFloat(convertUnit((Math.abs(props.cal?.grid_1 || 0)) / 1000)).toFixed(2)).toLocaleString("en-US")}
                    </span>
                    &nbsp;
                    <span style={{ fontSize: "12px", color: "grey" }}>
                        {showUnit(props.cal?.grid_1 || 0)}W
                    </span>
                </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row">
                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left"
                    style={{ backgroundColor: "white" }}
                >
                    {isMobile.value ? (
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit"
                            style={{ borderBottom: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "gridfeed" })}
                        </div>
                    ) : (
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit"
                            style={{ borderRight: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "gridfeed" })}
                        </div>
                    )}

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "today" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.grid_in_1 || 0)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.grid_in_1 || 0)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "month" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(month.grid_in_month)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(month.grid_in_month)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "year" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(year.grid_in_year)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(year.grid_in_year)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "total" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.grid_in_2 || 0)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.grid_in_2 || 0)}Wh
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left"
                    style={{ backgroundColor: "white" }}
                >
                    {isMobile.value ? (
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit"
                            style={{ borderBottom: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "purchaseE" })}
                        </div>
                    ) : (
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Tit"
                            style={{ borderRight: "solid 1px rgba(198, 197, 197, 0.5)" }}
                        >
                            {dataLang.formatMessage({ id: "purchaseE" })}
                        </div>
                    )}

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "today" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.grid_out_1 || 0)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.grid_out_1 || 0)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "month" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(month.grid_out_month)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(month.grid_out_month)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "year" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(year.grid_out_year)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(year.grid_out_year)}Wh
                                </span>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Tit">
                                {dataLang.formatMessage({ id: "total" })}
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Grid_Row_Left_Data_Item_Data">
                                <span style={{ fontWeight: "650", fontFamily: "sans-serif" }}>
                                    {Number(parseFloat(convertUnit(props.cal?.grid_out_2 || 0)).toFixed(2)).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "12px", color: "grey" }}>
                                    {showUnitk(props.cal?.grid_out_2 || 0)}Wh
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

