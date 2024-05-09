import React, { useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { info } from './Device';

import { IoIosArrowUp } from 'react-icons/io';

export default function ElectricityGeneration(props) {
    const dataLang = useIntl()
    const [display, setDisplay] = useState(true);

    const dataAC = [
        {
            ac: "R",
            voltage: parseFloat(info.value.invt[info.value.pdata.pha.voltage.register] * info.value.pdata.pha.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.pha.current.register] * info.value.pdata.pha.current.cal).toFixed(2) + " A",
            frequency: parseFloat(info.value.invt[info.value.pdata.fre.register] * info.value.pdata.fre.cal).toFixed(2) + " Hz",
        },
        {
            ac: "S",
            voltage: parseFloat(info.value.invt[info.value.pdata.phb.voltage.register] * info.value.pdata.phb.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.phb.current.register] * info.value.pdata.phb.current.cal).toFixed(2) + " A",
            frequency: "--",
        },
        {
            ac: "T",
            voltage: parseFloat(info.value.invt[info.value.pdata.phc.voltage.register] * info.value.pdata.phc.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.phc.current.register] * info.value.pdata.phc.current.cal).toFixed(2) + " A",
            frequency: "--",
        },
    ];

    const dataTemp = [
        {
            dc: "PV1",
            voltage: parseFloat(info.value.invt[info.value.pdata.pv1.voltage.register] * info.value.pdata.pv1.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.pv1.current.register] * info.value.pdata.pv1.current.cal).toFixed(2) + " A",
            power: parseFloat(((info.value.invt[info.value.pdata.pv1.voltage.register] * info.value.pdata.pv1.voltage.cal) * (info.value.invt[info.value.pdata.pv1.current.register] * info.value.pdata.pv1.current.cal)) / 1000).toFixed(2) + " kW",
        },
        {
            dc: "PV2",
            voltage: parseFloat(info.value.invt[info.value.pdata.pv2.voltage.register] * info.value.pdata.pv2.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.pv2.current.register] * info.value.pdata.pv2.current.cal).toFixed(2) + " A",
            power: parseFloat(((info.value.invt[info.value.pdata.pv2.voltage.register] * info.value.pdata.pv2.voltage.cal) * (info.value.invt[info.value.pdata.pv2.current.register] * info.value.pdata.pv2.current.cal)) / 1000).toFixed(2) + " kW",
        },
        {
            dc: "PV3",
            voltage: parseFloat(info.value.invt[info.value.pdata.pv3.voltage.register] * info.value.pdata.pv3.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.pv3.current.register] * info.value.pdata.pv3.current.cal).toFixed(2) + " A",
            power: parseFloat(((info.value.invt[info.value.pdata.pv3.voltage.register] * info.value.pdata.pv3.voltage.cal) * (info.value.invt[info.value.pdata.pv3.current.register] * info.value.pdata.pv3.current.cal)) / 1000).toFixed(2) + " kW",
        },
        {
            dc: "PV4",
            voltage: parseFloat(info.value.invt[info.value.pdata.pv4.voltage.register] * info.value.pdata.pv4.voltage.cal).toFixed(2) + " V",
            current: parseFloat(info.value.invt[info.value.pdata.pv4.current.register] * info.value.pdata.pv4.current.cal).toFixed(2) + " A",
            power: parseFloat(((info.value.invt[info.value.pdata.pv4.voltage.register] * info.value.pdata.pv4.voltage.cal) * (info.value.invt[info.value.pdata.pv4.current.register] * info.value.pdata.pv4.current.cal)) / 1000).toFixed(2) + " kW",
        },
        // {
        //   dc: "PV5",
        //   voltage: "0 V",
        //   current: "0 A",
        //   power: "1.3763 kW",
        // },
        // {
        //   dc: "PV6",
        //   voltage: "0 V",
        //   current: "0 A",
        //   power: "1.3763 kW",
        // },
        // {
        //   dc: "PV7",
        //   voltage: "0 V",
        //   current: "0 A",
        //   power: "1.3763 kW",
        // },
        // {
        //   dc: "PV8",
        //   voltage: "0 V",
        //   current: "0 A",
        //   power: "1.3763 kW",
        // },
    ];

    return (
        <div className="DAT_Info_Databox" id="Electricity Generation">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'ElectricityGeneration' })}</div>
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
                    <>
                        <div className="DAT_Info_Databox_Content">
                            <div className="DAT_Info_Databox_Content_ColumnElec">
                                <div className="DAT_Info_Databox_Content_ColumnElec_Head">
                                    <p>DC</p>
                                    <p>{dataLang.formatMessage({ id: 'voltage' })}</p>
                                    <p>{dataLang.formatMessage({ id: 'current' })}</p>
                                    <p>{dataLang.formatMessage({ id: 'powerFactor' })}</p>
                                </div>
                                {dataTemp.map((item, index) => {
                                    return (
                                        <div key={index} className="DAT_Info_Databox_Content_ColumnElec_Body">
                                            <p>{item.dc}</p>
                                            <p>{item.voltage}</p>
                                            <p>{item.current}</p>
                                            <p>{item.power}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="DAT_Info_Databox_Content_ColumnElec">
                                <div className="DAT_Info_Databox_Content_ColumnElec_Art">
                                    <div className="DAT_Info_Databox_Content_ColumnElec_Art_BarLeft"></div>
                                    <div className="DAT_Info_Databox_Content_ColumnElec_Art_Icon">
                                        DC/AC
                                    </div>
                                    <div className="DAT_Info_Databox_Content_ColumnElec_Art_BarRight"></div>
                                </div>
                            </div>
                            <div className="DAT_Info_Databox_Content_ColumnElec">
                                <div className="DAT_Info_Databox_Content_ColumnElec_Head">
                                    <p>AC</p>
                                    <p>{dataLang.formatMessage({ id: 'voltage' })}</p>
                                    <p>{dataLang.formatMessage({ id: 'current' })}</p>
                                    <p>{dataLang.formatMessage({ id: 'frequencyInv' })}</p>
                                </div>
                                {dataAC.map((item, index) => {
                                    return (
                                        <div key={index} className="DAT_Info_Databox_Content_ColumnElec_Body">
                                            <p>{item.ac}</p>
                                            <p>{item.voltage}</p>
                                            <p>{item.current}</p>
                                            <p>{item.frequency}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* <div className="DAT_Info_Databox_Content">
              <div className="DAT_Info_Databox_Content_ColumnElec">
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
              </div>
              <div className="DAT_Info_Databox_Content_ColumnElec">
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
              </div>
              <div className="DAT_Info_Databox_Content_ColumnElec">
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
                <p>String Input Current1：0.54 A</p>
              </div>
            </div> */}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

