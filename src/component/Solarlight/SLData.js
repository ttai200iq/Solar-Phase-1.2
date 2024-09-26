import React, { useEffect } from 'react';
import { isBrowser } from 'react-device-detect';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

export default function SLData(props) {
    const cal = useSelector((state) => state.tool.cal);

    const popup_state = {
        pre: {
            transform: "rotate(0deg)",
            transition: "0.5s",
            color: "rgba(11, 25, 103)",
        },
        new: {
            transform: "rotate(90deg)",
            transition: "0.5s",
            color: "rgba(11, 25, 103)",
        },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                props.setType("default");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isBrowser
                ?
                <div className="DAT_ProjectData_Dashboard_Data_Left">
                    <div style={{ padding: "16px" }} >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontFamily: "segoeui-sb",
                                fontSize: "19px",
                            }}
                        >
                            {props.type}
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => props.setType("default")}
                            >
                                <IoClose
                                    size={25}
                                    id="Popup"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                />
                            </div>
                        </div>
                        {/* <div
                            style={{
                                fontFamily: "segoeui",
                                color: "grey",
                                fontSize: "14px",
                            }}
                        >
                            {(() => {
                                switch (props.type) {
                                    case "production":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "ProductionDesc" })}
                                            </>
                                        );
                                    case "consumption":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "ConsumptionDesc" })}
                                            </>
                                        );
                                    case "grid":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "GridDesc" })}
                                            </>
                                        );
                                    case "battery":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "BatteryDesc" })} <br />
                                                {dataLang.formatMessage({ id: "SoCDesc" })}
                                            </>
                                        );
                                    default:
                                        return <></>;
                                }
                            })()}
                        </div> */}
                    </div>

                    {(() => {
                        switch (props.type) {
                            case "PV Panel":
                                return <PVPanel cal={cal} />;
                            case "LED Light":
                                return <LEDLight cal={cal} />;
                            case "Grid":
                                return <Grid cal={cal} />;
                            case "Battery":
                                return <Battery cal={cal} />;
                            default:
                                <></>;
                        }
                    })()}
                </div>
                :
                <div className="DAT_ProjectData_Dashboard_Data_LeftMobile">
                    <div
                        style={{
                            padding: "16px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontFamily: "segoeui-sb",
                                fontSize: "19px",
                            }}
                        >
                            {props.type}
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => props.setType("default")}
                            >
                                <IoClose
                                    size={25}
                                    id="Popup"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                />
                            </div>
                        </div>
                        {/* <div
                            style={{
                                fontFamily: "segoeui",
                                color: "grey",
                                fontSize: "14px",
                            }}
                        >
                            {(() => {
                                switch (props.type) {
                                    case "production":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "ProductionDesc" })}
                                            </>
                                        );
                                    case "consumption":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "ConsumptionDesc" })}
                                            </>
                                        );
                                    case "grid":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "GridDesc" })}
                                            </>
                                        );
                                    case "battery":
                                        return (
                                            <>
                                                {dataLang.formatMessage({ id: "BatteryDesc" })} <br />
                                                {dataLang.formatMessage({ id: "SoCDesc" })}
                                            </>
                                        );
                                    default:
                                        return <></>;
                                }
                            })()}
                        </div> */}
                    </div>

                    {(() => {
                        switch (props.type) {
                            case "PV Panel":
                                return <PVPanel cal={cal} />;
                            case "LED Light":
                                return <LEDLight cal={cal} />;
                            case "Grid":
                                return <Grid cal={cal} />;
                            case "Battery":
                                return <Battery cal={cal} />;
                            default:
                                <></>;
                        }
                    })()}
                </div>
            }
        </>
    );
}

const PVPanel = (props) => {
    return (
        <>
            {isBrowser
                ? <div className="DAT_ProjectData_Dashboard_Data_Center_Production">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Icon">
                            <img
                                src="/dat_icon/solar-cell.png"
                                alt=""
                                style={{ width: "110px", height: "100px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Detail" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.pv_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.pv_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat((props.cal?.pv_volt) * (props.cal?.pv_current)).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className="DAT_ProjectData_Dashboard_Data_Center_Production">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Icon">
                            <img
                                src="/dat_icon/solar-cell.png"
                                alt=""
                                style={{ width: "110px", height: "100px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Detail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.pv_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.pv_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat((props.cal?.pv_volt) * (props.cal?.pv_current)).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};

const LEDLight = (props) => {
    return (
        <>
            {isBrowser
                ? <div className="DAT_ProjectData_Dashboard_Data_Center_Production">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Icon">
                            <img
                                src="/dat_icon/smart-house.png"
                                alt=""
                                style={{ width: "120px", height: "100px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Detail" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_power).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className="DAT_ProjectData_Dashboard_Data_Center_Production">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Icon">
                            <img
                                src="/dat_icon/smart-house.png"
                                alt=""
                                style={{ width: "120px", height: "100px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Production_Data_Detail" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.led_power).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};

const Grid = (props) => {
    return (
        <>
            {isBrowser
                ? <div className="DAT_ProjectData_Dashboard_Data_Center_Battery">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Img">
                            <img
                                src="/dat_icon/electric-pole.png"
                                alt=""
                                style={{ width: "90px", height: "100px" }}
                            />
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Line"></div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                Today Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data">
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.grid_dsch_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                History Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Operation Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.operation_time_with_grid).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_energy_from_grid).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Capacity Grid Discharge
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_capacity_grid_dsch).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Ah
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className="DAT_ProjectData_Dashboard_Data_Center_Battery">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Img">
                            <img
                                src="/dat_icon/electric-pole.png"
                                alt=""
                                style={{ width: "90px", height: "100px" }}
                            />
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Line"></div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                Today Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data">
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.grid_dsch_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                History Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Operation Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.operation_time_with_grid).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_energy_from_grid).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Capacity Grid Discharge
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_capacity_grid_dsch).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Ah
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};

const Battery = (props) => {
    const dataLang = useIntl();

    return (
        <>
            {isBrowser
                ? <div className="DAT_ProjectData_Dashboard_Data_Center_Battery">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Img">
                            <img
                                src={parseFloat(props.cal?.device_status).toFixed(0) === '11' || '21' ? "/dat_icon/battery-50_-removebg-preview.png" : "/dat_icon/battery_100.png"}
                                alt=""
                                style={{ width: "50px", height: "90px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Status">
                            {/* <div>
                                <span>SoC:</span>
                                &nbsp;
                                <span style={{ fontSize: "26px" }}>
                                    {Number(
                                        parseFloat(props.cal?.bat_2 || 0).toFixed(2)
                                    ).toLocaleString("en-US")}
                                </span>
                                &nbsp;
                                <span style={{ fontSize: "18px", color: "grey" }}>%</span>
                            </div> */}
                            {parseFloat(props.cal?.device_status).toFixed(0) === '11' ? (
                                <FaArrowLeftLong color="green" size={30} />
                            ) : (
                                <FaArrowRightLong color="red" size={25} />
                            )}
                            <span style={{ fontSize: "16px" }}>
                                {parseFloat(props.cal?.device_status).toFixed(0) === '11'
                                    ? dataLang.formatMessage({ id: "charge" })
                                    : dataLang.formatMessage({ id: "discharge" })}
                            </span>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Data" style={{ flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.bat_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.charging_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.charging_power).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Line"></div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                Today Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px', marginBottom: '8px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.bat_dsch_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat((props.cal?.dsch_time) / 60).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_time).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Min
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Capacity
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_capacity).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Ah
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                History Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Operation Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.operation_time_with_bat).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy Charge
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_energy_charge).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy from BAT
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat((props.cal?.cost_saving) * 0.1).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className="DAT_ProjectData_Dashboard_Data_Center_Battery">
                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Img">
                            <img
                                src={parseFloat(props.cal?.device_status).toFixed(0) === '11' || '21' ? "/dat_icon/battery-50_-removebg-preview.png" : "/dat_icon/battery_100.png"}
                                alt=""
                                style={{ width: "50px", height: "90px" }}
                            />
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Status">
                            {/* <div>
                            <span>SoC:</span>
                            &nbsp;
                            <span style={{ fontSize: "26px" }}>
                                {Number(
                                    parseFloat(props.cal?.bat_2 || 0).toFixed(2)
                                ).toLocaleString("en-US")}
                            </span>
                            &nbsp;
                            <span style={{ fontSize: "18px", color: "grey" }}>%</span>
                        </div> */}
                            {parseFloat(props.cal?.device_status).toFixed(0) === '11' ? (
                                <FaArrowLeftLong color="green" size={30} />
                            ) : (
                                <FaArrowRightLong color="red" size={25} />
                            )}
                            <span style={{ fontSize: "16px" }}>
                                {parseFloat(props.cal?.device_status).toFixed(0) === '11'
                                    ? dataLang.formatMessage({ id: "charge" })
                                    : dataLang.formatMessage({ id: "discharge" })}
                            </span>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Data_Data" >
                            <div>
                                <div style={{ color: "grey" }}>
                                    Voltage
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.bat_volt).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        V
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Current
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.charging_current).toFixed(2)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        A
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ color: "grey" }}>
                                    Power
                                </div>
                                <div>
                                    <span style={{ fontSize: "32px", color: 'blue' }} >
                                        {parseFloat(props.cal?.charging_power).toFixed(1)}
                                    </span>
                                    &nbsp;
                                    <span style={{ fontSize: "24px", color: "grey" }}>
                                        W
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Line"></div>

                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row">
                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                Today Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px', marginBottom: '8px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.bat_dsch_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Discharge Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat((props.cal?.dsch_time) / 60).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Energy
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_energy).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Wh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_time).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Min
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Charging Capacity
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.charging_capacity).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Ah
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left">
                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Tit">
                                History Data
                            </div>

                            <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data" style={{ gap: '16px' }}>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Operation Time
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.operation_time_with_bat).toFixed(1)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            Hours
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy Charge
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat(props.cal?.total_energy_charge).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>
                                <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item">
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Tit">
                                        Total Energy from BAT
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_Data_Center_Battery_Row_Left_Data_Item_Data">
                                        <span style={{ fontSize: "26px", color: 'blue' }}>
                                            {parseFloat((props.cal?.cost_saving) * 0.1).toFixed(2)}
                                        </span>
                                        &nbsp;
                                        <span style={{ fontSize: "18px", color: "grey" }}>
                                            kWh
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};