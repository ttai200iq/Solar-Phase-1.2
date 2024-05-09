import React, { useEffect, useState } from 'react';
import "./Device.scss";

import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import moment from 'moment-timezone';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import { info } from './Device';
import { isMobile } from '../Navigation/Navigation';
import DatePicker from "react-datepicker";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, } from "recharts";
import { COLOR } from '../../App';

import { IoCalendarOutline } from 'react-icons/io5';
import { IoIosArrowUp } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';

export default function HistoricalData(props) {
    const lang = useSelector((state) => state.admin.lang);
    const dataLang = useIntl();
    const [display, setDisplay] = useState(true);
    const [dropConfig, setDropConfig] = useState(false);
    const chooseParaId = dataLang.formatMessage({ id: "choosePara" });
    const minimizeId = dataLang.formatMessage({ id: "minimize" });
    const [configname, setConfigname] = useState(chooseParaId);
    const [chart, setChart] = useState([]);
    const [acfre, setACFre] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [acrcur, setACRcur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [acscur, setACScur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [actcur, setACTcur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [acrvolt, setACRvolt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [acsvolt, setACSvolt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [actvolt, setACTvolt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv1cur, setPV1cur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv2cur, setPV2cur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv3cur, setPV3cur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv4cur, setPV4cur] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv1volt, setPV1volt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv2volt, setPV2volt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv3volt, setPV3volt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv4volt, setPV4volt] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv1power, setPV1pow] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv2power, setPV2pow] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv3power, setPV3pow] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [pv4power, setPV4pow] = useState(dataLang.formatMessage({ id: "unknown" }));
    const [dateType, setDateType] = useState("date");
    const [mode, setMode] = useState('ACVOLT');
    const [d, setD] = useState({
        date: moment(new Date()).format("MM/DD/YYYY"),
    });

    const [dataoption, setDataoption] = useState({
        basicinfo: {
            RatedPower: true,
        },
        electricitygeneration: {
            DCVoltPV1: true, //use
            DCVoltPV2: true, //use
            DCVoltPV3: true, //use
            DCVoltPV4: true, //use
            DCCurrentPV1: true, //use
            DCCurrentPV2: true, //use
            DCCurrentPV3: true, //use
            DCCurrentPV4: true, //use
            DCPowerPV1: true, //use
            DCPowerPV2: true, //use
            DCPowerPV3: true, //use
            DCPowerPV4: true, //use
            ACVoltRUA: true, //use
            ACVoltSUA: true, //use
            ACVoltTUA: true, //use
            ACCurrentRUA: true, //use
            ACCurrentSUA: true, //use
            ACCurrentTUA: true, //use
            ACOutputFreqR: true, //use
            totalACOutput: true,
            reactivePower: true,
            dailyOutput: true,
            LoadActivePower: true,
        },
        powergrid: {
            LeakCurrent: true,
            TotalGridPower: true,
            CumulativeGridFeedin: true,
            CumulativeEnergyPurchased: true,
            DailyGridFeedin: true,
            DailyEnergyPurchased: true,
            MeterPower: true
        },
        batteryData: {
            BatteryVolt: true,
            BatteryCurrent: true,
            MaxChargingCur: true,
            MaxDischargingCur: true,
            BatteryPower: true,
            SoC: true,
            SoH: true,
            TotalchargingEnergy: true,
            TotaldischargingEnergy: true,
            DailychargingEnergy: true,
        },
        BMS: {
            BMSMaxChargingCur: true,
            MaxDischargingCur: true,
            BMSChargeVoltage: true,
            BMSDischargeVoltage: true,
        },
        state: {
            DCInsulationResistance: true,

        },
        EPS: {
            RphaseEPSvoltage: true,
            RphaseEPScurrent: true,
            EPSRphaseActivePower: true,
            EPSFrequency: true,
        }
    });
    const [option, setOption] = useState(dataoption);

    useEffect(() => {
        const getChart = async () => {
            const req = await callApi("post", host.DATA + "/getInverterChart", {
                sn: info.value.psn,
                date: moment(new Date()).format("MM/DD/YYYY")
            });
            if (req.status) {
                let vACFre_ = dataLang.formatMessage({ id: "acfre" });
                let vACRcur_ = dataLang.formatMessage({ id: "acrcur" });
                let vACScur_ = dataLang.formatMessage({ id: "acscur" });
                let vACTcur_ = dataLang.formatMessage({ id: "actcur" });
                let vACRvolt_ = dataLang.formatMessage({ id: "acrvolt" });
                let vACSvolt_ = dataLang.formatMessage({ id: "acsvolt" });
                let vACTvol_ = dataLang.formatMessage({ id: "actvolt" });
                let vpv1cur_ = dataLang.formatMessage({ id: "pv1cur" });
                let vpv2cur_ = dataLang.formatMessage({ id: "pv2cur" });
                let vpv3cur_ = dataLang.formatMessage({ id: "pv3cur" });
                let vpv4cur_ = dataLang.formatMessage({ id: "pv4cur" });
                let vpv1volt_ = dataLang.formatMessage({ id: "pv1volt" });
                let vpv2volt_ = dataLang.formatMessage({ id: "pv2volt" });
                let vpv3volt_ = dataLang.formatMessage({ id: "pv3volt" });
                let vpv4volt_ = dataLang.formatMessage({ id: "pv4volt" });
                let vpv1pow_ = dataLang.formatMessage({ id: "pv1pow" });
                let vpv2pow_ = dataLang.formatMessage({ id: "pv2pow" });
                let vpv3pow_ = dataLang.formatMessage({ id: "pv3pow" });
                let vpv4pow_ = dataLang.formatMessage({ id: "pv4pow" });
                let x = []
                req.data.data.map((item) => {
                    let arr = item.time.split(":");
                    x = [
                        ...x,
                        {
                            time: `${arr[0]}:${arr[1]}`,
                            [vACFre_]: item.acfre,
                            [vACRcur_]: item.acrcur,
                            [vACScur_]: item.acscur,
                            [vACTcur_]: item.actcur,
                            [vACRvolt_]: item.acrvolt,
                            [vACSvolt_]: item.acsvolt,
                            [vACTvol_]: item.actvolt,
                            [vpv1cur_]: item.pv1cur,
                            [vpv2cur_]: item.pv2cur,
                            [vpv3cur_]: item.pv3cur,
                            [vpv4cur_]: item.pv4cur,
                            [vpv1volt_]: item.pv1volt,
                            [vpv2volt_]: item.pv2volt,
                            [vpv3volt_]: item.pv3volt,
                            [vpv4volt_]: item.pv4volt,
                            [vpv1pow_]: item.pv1pow,
                            [vpv2pow_]: item.pv2pow,
                            [vpv3pow_]: item.pv3pow,
                            [vpv4pow_]: item.pv4pow,
                        }

                    ]
                })

                for (let i = x.length; i < 500; i++) {
                    if (
                        moment(x[x.length - 1].time, "HH:mm") < moment("23:55", "HH:mm")
                    ) {
                        let nextTime = moment(x[x.length - 1].time, "HH:mm")
                            .add(5, "minutes")
                            .format("HH:mm");
                        x.push({
                            time: nextTime,
                            [vACFre_]: 0,
                            [vACRcur_]: 0,
                            [vACScur_]: 0,
                            [vACTcur_]: 0,
                            [vACRvolt_]: 0,
                            [vACSvolt_]: 0,
                            [vACTvol_]: 0,
                            [vpv1cur_]: 0,
                            [vpv2cur_]: 0,
                            [vpv3cur_]: 0,
                            [vpv4cur_]: 0,
                            [vpv1volt_]: 0,
                            [vpv2volt_]: 0,
                            [vpv3volt_]: 0,
                            [vpv4volt_]: 0,
                            [vpv1pow_]: 0,
                            [vpv2pow_]: 0,
                            [vpv3pow_]: 0,
                            [vpv4pow_]: 0

                        });
                    }
                }

                setACFre(dataLang.formatMessage({ id: "acfre" }));
                setACRcur(dataLang.formatMessage({ id: "acrcur" }));
                setACScur(dataLang.formatMessage({ id: "acscur" }));
                setACTcur(dataLang.formatMessage({ id: "actcur" }));
                setACRvolt(dataLang.formatMessage({ id: "acrvolt" }));
                setACSvolt(dataLang.formatMessage({ id: "acsvolt" }));
                setACTvolt(dataLang.formatMessage({ id: "actvolt" }));
                setPV1cur(dataLang.formatMessage({ id: "pv1cur" }));
                setPV2cur(dataLang.formatMessage({ id: "pv2cur" }));
                setPV3cur(dataLang.formatMessage({ id: "pv3cur" }));
                setPV4cur(dataLang.formatMessage({ id: "pv4cur" }));
                setPV1volt(dataLang.formatMessage({ id: "pv1volt" }));
                setPV2volt(dataLang.formatMessage({ id: "pv2volt" }));
                setPV3volt(dataLang.formatMessage({ id: "pv3volt" }));
                setPV4volt(dataLang.formatMessage({ id: "pv4volt" }));
                setPV1pow(dataLang.formatMessage({ id: "pv1pow" }));
                setPV2pow(dataLang.formatMessage({ id: "pv2pow" }));
                setPV3pow(dataLang.formatMessage({ id: "pv3pow" }));
                setPV4pow(dataLang.formatMessage({ id: "pv4pow" }));
                setChart([...x])
            } else {
                setChart([])
            }
        }

        getChart()
    }, [lang])

    const handleChart = (date) => {
        setD({ ...d, date: moment(date).format("MM/DD/YYYY") })
        const getChart = async () => {
            const req = await callApi("post", host.DATA + "/getInverterChart", {
                sn: info.value.psn,
                date: moment(date).format("MM/DD/YYYY")
            });
            if (req.status) {
                let vACFre_ = dataLang.formatMessage({ id: "acfre" });
                let vACRcur_ = dataLang.formatMessage({ id: "acrcur" });
                let vACScur_ = dataLang.formatMessage({ id: "acscur" });
                let vACTcur_ = dataLang.formatMessage({ id: "actcur" });
                let vACRvolt_ = dataLang.formatMessage({ id: "acrvolt" });
                let vACSvolt_ = dataLang.formatMessage({ id: "acsvolt" });
                let vACTvol_ = dataLang.formatMessage({ id: "actvolt" });
                let vpv1cur_ = dataLang.formatMessage({ id: "pv1cur" });
                let vpv2cur_ = dataLang.formatMessage({ id: "pv2cur" });
                let vpv3cur_ = dataLang.formatMessage({ id: "pv3cur" });
                let vpv4cur_ = dataLang.formatMessage({ id: "pv4cur" });
                let vpv1volt_ = dataLang.formatMessage({ id: "pv1volt" });
                let vpv2volt_ = dataLang.formatMessage({ id: "pv2volt" });
                let vpv3volt_ = dataLang.formatMessage({ id: "pv3volt" });
                let vpv4volt_ = dataLang.formatMessage({ id: "pv4volt" });
                let vpv1pow_ = dataLang.formatMessage({ id: "pv1pow" });
                let vpv2pow_ = dataLang.formatMessage({ id: "pv2pow" });
                let vpv3pow_ = dataLang.formatMessage({ id: "pv3pow" });
                let vpv4pow_ = dataLang.formatMessage({ id: "pv4pow" });
                let x = []
                req.data.data.map((item) => {
                    let arr = item.time.split(":");
                    x = [
                        ...x,
                        {
                            time: `${arr[0]}:${arr[1]}`,
                            [vACFre_]: item.acfre,
                            [vACRcur_]: item.acrcur,
                            [vACScur_]: item.acscur,
                            [vACTcur_]: item.actcur,
                            [vACRvolt_]: item.acrvolt,
                            [vACSvolt_]: item.acsvolt,
                            [vACTvol_]: item.actvolt,
                            [vpv1cur_]: item.pv1cur,
                            [vpv2cur_]: item.pv2cur,
                            [vpv3cur_]: item.pv3cur,
                            [vpv4cur_]: item.pv4cur,
                            [vpv1volt_]: item.pv1volt,
                            [vpv2volt_]: item.pv2volt,
                            [vpv3volt_]: item.pv3volt,
                            [vpv4volt_]: item.pv4volt,
                            [vpv1pow_]: item.pv1pow,
                            [vpv2pow_]: item.pv2pow,
                            [vpv3pow_]: item.pv3pow,
                            [vpv4pow_]: item.pv4pow,
                        }

                    ]
                })

                for (let i = x.length; i < 500; i++) {
                    if (
                        moment(x[x.length - 1].time, "HH:mm") < moment("23:55", "HH:mm")
                    ) {
                        let nextTime = moment(x[x.length - 1].time, "HH:mm")
                            .add(5, "minutes")
                            .format("HH:mm");
                        x.push({
                            time: nextTime,
                            [vACFre_]: 0,
                            [vACRcur_]: 0,
                            [vACScur_]: 0,
                            [vACTcur_]: 0,
                            [vACRvolt_]: 0,
                            [vACSvolt_]: 0,
                            [vACTvol_]: 0,
                            [vpv1cur_]: 0,
                            [vpv2cur_]: 0,
                            [vpv3cur_]: 0,
                            [vpv4cur_]: 0,
                            [vpv1volt_]: 0,
                            [vpv2volt_]: 0,
                            [vpv3volt_]: 0,
                            [vpv4volt_]: 0,
                            [vpv1pow_]: 0,
                            [vpv2pow_]: 0,
                            [vpv3pow_]: 0,
                            [vpv4pow_]: 0

                        });
                    }
                }

                setACFre(dataLang.formatMessage({ id: "acfre" }));
                setACRcur(dataLang.formatMessage({ id: "acrcur" }));
                setACScur(dataLang.formatMessage({ id: "acscur" }));
                setACTcur(dataLang.formatMessage({ id: "actcur" }));
                setACRvolt(dataLang.formatMessage({ id: "acrvolt" }));
                setACSvolt(dataLang.formatMessage({ id: "acsvolt" }));
                setACTvolt(dataLang.formatMessage({ id: "actvolt" }));
                setPV1cur(dataLang.formatMessage({ id: "pv1cur" }));
                setPV2cur(dataLang.formatMessage({ id: "pv2cur" }));
                setPV3cur(dataLang.formatMessage({ id: "pv3cur" }));
                setPV4cur(dataLang.formatMessage({ id: "pv4cur" }));
                setPV1volt(dataLang.formatMessage({ id: "pv1volt" }));
                setPV2volt(dataLang.formatMessage({ id: "pv2volt" }));
                setPV3volt(dataLang.formatMessage({ id: "pv3volt" }));
                setPV4volt(dataLang.formatMessage({ id: "pv4volt" }));
                setPV1pow(dataLang.formatMessage({ id: "pv1pow" }));
                setPV2pow(dataLang.formatMessage({ id: "pv2pow" }));
                setPV3pow(dataLang.formatMessage({ id: "pv3pow" }));
                setPV4pow(dataLang.formatMessage({ id: "pv4pow" }));
                setChart([...x])
            } else {
                setChart([])
            }
        }

        getChart()
    }

    // const handleMode = () => {
    //   if (mode === 'AC') {
    //     setMode('DC')
    //   } else {
    //     setMode('AC')
    //   }
    // }

    const handleChartMode = (e) => {
        setMode(e.target.value)
    }

    const handleShowConfig = (e) => {
        if (configname === chooseParaId) {
            setConfigname(minimizeId);
        } else if (configname === minimizeId) {
            setConfigname(chooseParaId);
        }
    };

    useEffect(() => {
        setOption(dataoption);
    }, []);

    const handleCheck = (e) => {
        const arr = e.currentTarget.id.split("_");
        setOption({
            ...option,
            [arr[0]]: {
                ...option[arr[0]],
                [arr[1]]: e.currentTarget.checked
            }
        })
    };

    const handleCancelChangeChart = () => {
        setOption(dataoption);
    }

    const handleConfirmChangeChart = () => {
        setDataoption(option);
    }

    const renderTooltipContent = (o) => {
        const { payload = [], label } = o;
        return (
            <div className="customized-tooltip-content"
                style={{ backgroundColor: "white", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
                <span className="total">{`${label}`}</span>
                <div className="list">
                    {payload.map((entry, index) => (
                        <div key={`item-${index}`} style={{ color: entry.color, marginTop: "8px" }}>
                            {`${entry.name}: ${entry.value}`}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="DAT_Info_Databox" id="HistoricalData">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'historyInverter' })}</div>
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
                {display ?
                    <>
                        {isMobile.value ?
                            <div className="DAT_Info_Databox_HistoriccalData">
                                <div className="DAT_Info_Databox_HistoricalData_Picker">
                                    <select onChange={(e) => handleChartMode(e)}>
                                        <option value={"ACVOLT"}>{dataLang.formatMessage({ id: "ACVolt" })}(V)</option>
                                        <option value={"ACCUR"}>{dataLang.formatMessage({ id: "ACCurrent" })}(A)</option>
                                        <option value={"ACFRE"}>{dataLang.formatMessage({ id: "acfre" })}(Hz)</option>
                                        <option value={"DCVOLT"}>{dataLang.formatMessage({ id: "DCVolt" })}(V)</option>
                                        <option value={"DCCUR"}>{dataLang.formatMessage({ id: "DCCurrent" })}(A)</option>
                                        <option value={"DCPOWER"}>{dataLang.formatMessage({ id: "DCPower" })}(kW)</option>
                                    </select>
                                    {/* <div className="DAT_Info_Databox_HistoricalData_Picker_Type">
                                        <p>{dataLang.formatMessage({ id: "day" })}</p>
                                        <p>{dataLang.formatMessage({ id: "month" })}</p>
                                        <p>{dataLang.formatMessage({ id: "year" })}</p>
                                        <p>{dataLang.formatMessage({ id: "total" })}</p>
                                    </div>
                                    <div className="DAT_Info_Databox_HistoricalData_Picker_ParametersPicker">
                                        <div>{dataLang.formatMessage({ id: "choosePara" })}</div>
                                    </div>
                                    <div className="DAT_Info_Databox_HistoricalData_Picker_Export">
                                        <div>{dataLang.formatMessage({ id: "export" })}</div>
                                    </div> */}
                                    <div className="DAT_Info_Databox_HistoricalData_Picker_ParametersPicker">
                                        <button onClick={() => { setOption(dataoption) }}>
                                            {dataLang.formatMessage({ id: "choosePara" })}
                                        </button>
                                    </div>
                                    <DatePicker
                                        onChange={(date) => handleChart(date)}
                                        customInput={
                                            <button className="DAT_CustomPicker" >
                                                <span>{d[dateType]}</span>
                                                <IoCalendarOutline color="gray" />
                                            </button>
                                        }
                                    />
                                </div>
                                <div className="DAT_Info_Databox_HistoricalData_Chart">
                                    {(() => {
                                        switch (mode) {
                                            case "ACFRE":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >
                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acfre],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.ACOutputFreqR ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acfre}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                :
                                                                <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "ACVOLT":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >


                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acrvolt],
                                                                            y: item[acsvolt],
                                                                            z: item[actvolt],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]} />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.ACVoltRUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acrvolt}
                                                                    stroke="red"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACVoltSUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acsvolt}
                                                                    stroke="green"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACVoltTUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={actvolt}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                /> : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "ACCUR":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acrcur],
                                                                            y: item[acscur],
                                                                            z: item[actcur],

                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.ACCurrentRUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acrcur}
                                                                    stroke="red"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACCurrentSUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acscur}
                                                                    stroke="green"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACCurrentTUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={actcur}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                /> : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "DCCUR":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1cur],
                                                                            y: item[pv2cur],
                                                                            z: item[pv3cur],
                                                                            t: item[pv4cur],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />

                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.DCVoltPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1volt}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2volt}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3volt}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4volt}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case 'DCVOLT':
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1volt],
                                                                            y: item[pv2volt],
                                                                            z: item[pv3volt],
                                                                            w: item[pv4volt],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.DCVoltPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1volt}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2volt}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3volt}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4volt}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case 'DCPOWER':
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1power],
                                                                            y: item[pv2power],
                                                                            z: item[pv3power],
                                                                            w: item[pv4power],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            {dataoption.electricitygeneration.DCPowerPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1power}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2power}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3power}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4power}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            default:
                                                return <></>;
                                        }
                                    })()}
                                </div>
                            </div>
                            :
                            <div className="DAT_Info_Databox_HistoriccalData">
                                <div className="DAT_Info_Databox_HistoricalData_Picker">
                                    {/* <div className="DAT_Info_Databox_HistoricalData_Picker_Type">
                                        <p>{dataLang.formatMessage({ id: "day" })}</p>
                                        <p>{dataLang.formatMessage({ id: "month" })}</p>
                                        <p>{dataLang.formatMessage({ id: "year" })}</p>
                                        <p>{dataLang.formatMessage({ id: "total" })}</p>
                                    </div>
                                    <div className="DAT_Info_Databox_HistoricalData_Picker_Export">
                                        <div>{dataLang.formatMessage({ id: "export" })}</div>
                                    </div> */}
                                    <div className="DAT_Info_Databox_HistoricalData_Picker_ParametersPicker">
                                        <button
                                            onClick={(e) => {
                                                handleShowConfig(e);
                                                setDropConfig(!dropConfig);
                                                setOption(dataoption);
                                            }}
                                        >
                                            {configname}
                                        </button>
                                    </div>
                                    <DatePicker
                                        onChange={(date) => handleChart(date)}
                                        customInput={
                                            <button className="DAT_CustomPicker" >
                                                <span>{d[dateType]}</span>
                                                <IoCalendarOutline color="gray" />
                                            </button>
                                        }
                                    />
                                </div>

                                <div className="DAT_Info_Databox_HistoricalData_Chart">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", marginBottom: "16px" }}>
                                        <div style={{ cursor: "pointer", color: mode === "ACVOLT" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('ACVOLT')}>{dataLang.formatMessage({ id: "ACVolt" })}(V)</div>
                                        <div style={{ cursor: "pointer", color: mode === "ACCUR" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('ACCUR')}>{dataLang.formatMessage({ id: "ACCurrent" })}(A)</div>
                                        <div style={{ cursor: "pointer", color: mode === "ACFRE" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('ACFRE')}>{dataLang.formatMessage({ id: "acfre" })}(Hz)</div>
                                        <div style={{ cursor: "pointer", color: mode === "DCVOLT" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('DCVOLT')}>{dataLang.formatMessage({ id: "DCVolt" })}(V)</div>
                                        <div style={{ cursor: "pointer", color: mode === "DCCUR" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('DCCUR')}>{dataLang.formatMessage({ id: "DCCurrent" })}(A)</div>
                                        <div style={{ cursor: "pointer", color: mode === "DCPOWER" ? "rgb(4,143,255)" : "black" }} onClick={() => setMode('DCPOWER')}>{dataLang.formatMessage({ id: "DCPower" })}(kW)</div>
                                    </div>
                                    {(() => {
                                        switch (mode) {
                                            case "ACFRE":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >


                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acfre],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.ACOutputFreqR ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acfre}
                                                                    stroke="red"
                                                                    dot={false}
                                                                /> :
                                                                <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "ACVOLT":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >


                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acrvolt],
                                                                            y: item[acsvolt],
                                                                            z: item[actvolt],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]} />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.ACVoltRUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acrvolt}
                                                                    stroke="red"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACVoltSUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acsvolt}
                                                                    stroke="green"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACVoltTUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={actvolt}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                /> : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "ACCUR":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[acrcur],
                                                                            y: item[acscur],
                                                                            z: item[actcur],

                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.ACCurrentRUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acrcur}
                                                                    stroke="red"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACCurrentSUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={acscur}
                                                                    stroke="green"
                                                                    dot={false}
                                                                /> : <></>}
                                                            {dataoption.electricitygeneration.ACCurrentTUA ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={actcur}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                /> : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case "DCCUR":
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1cur],
                                                                            y: item[pv2cur],
                                                                            z: item[pv3cur],
                                                                            t: item[pv4cur],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />

                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.DCCurrentPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1cur}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCCurrentPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2cur}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCCurrentPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3cur}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCCurrentPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4cur}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case 'DCVOLT':
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1volt],
                                                                            y: item[pv2volt],
                                                                            z: item[pv3volt],
                                                                            w: item[pv4volt],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.DCVoltPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1volt}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2volt}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3volt}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCVoltPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4volt}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            case 'DCPOWER':
                                                return (
                                                    <ResponsiveContainer
                                                        style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                                                    >

                                                        <LineChart width={100} height={500} data={chart}>
                                                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                domain={[
                                                                    0,
                                                                    chart.reduce((max, item) => {
                                                                        const values = Object.values({
                                                                            x: item[pv1power],
                                                                            y: item[pv2power],
                                                                            z: item[pv3power],
                                                                            w: item[pv4power],
                                                                        });
                                                                        const currentMax = Math.max(...values.map(Number));
                                                                        return currentMax > max ? currentMax : max;
                                                                    }, -Infinity),
                                                                ]}
                                                            />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip content={renderTooltipContent} />
                                                            <Legend iconType="plainline" />
                                                            {dataoption.electricitygeneration.DCPowerPV1 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv1power}
                                                                    stroke="rgb(4,143,255)"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV2 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv2power}
                                                                    stroke="red"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV3 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv3power}
                                                                    stroke="green"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                            {dataoption.electricitygeneration.DCPowerPV4 ?
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey={pv4power}
                                                                    stroke="purple"
                                                                    dot={false}
                                                                />
                                                                : <></>}
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            default:
                                                return <></>;
                                        }
                                    })()}
                                </div>

                                <div className="DAT_Info_Databox_HistoricalData_SubConfig"
                                    style={{
                                        height: dropConfig ? "calc(100vh - 180px)" : "0px",
                                        transition: "0.5s",
                                    }}
                                >
                                    {dropConfig ?
                                        <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown"
                                            style={{
                                                height: dropConfig ? "auto" : "0px",
                                                transition: "0.5s",
                                            }}
                                        >
                                            <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Search">
                                                <input type="text" placeholder={dataLang.formatMessage({ id: "SearchbyPara" })} />
                                                <CiSearch color="gray" size={20} />
                                            </div>

                                            <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item">
                                                <table className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table">
                                                    <tbody>
                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {dataLang.formatMessage({ id: "basicInfo" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td" >
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"basicinfo_RatedPower"}
                                                                        checked={option.basicinfo.RatedPower}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"basicinfo_RatedPower"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "RatedPower" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {dataLang.formatMessage({ id: "ElectricityGeneration" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td" >
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCVoltPV1"}
                                                                        checked={option.electricitygeneration.DCVoltPV1}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCVoltPV1"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCVolt" })} PV1
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCVoltPV2"}
                                                                        checked={option.electricitygeneration.DCVoltPV2}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCVoltPV2"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCVolt" })} PV2
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCVoltPV3"}
                                                                        checked={option.electricitygeneration.DCVoltPV3}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCVoltPV3"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCVolt" })} PV3
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCVoltPV4"}
                                                                        checked={option.electricitygeneration.DCVoltPV4}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCVoltPV4"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCVolt" })} PV4
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCCurrentPV1"}
                                                                        checked={option.electricitygeneration.DCCurrentPV1}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCCurrentPV1"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCCurrent" })} PV1
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCCurrentPV2"}
                                                                        checked={option.electricitygeneration.DCCurrentPV2}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCCurrentPV2"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCCurrent" })} PV2
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCCurrentPV3"}
                                                                        checked={option.electricitygeneration.DCCurrentPV3}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCCurrentPV3"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCCurrent" })} PV3
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCCurrentPV4"}
                                                                        checked={option.electricitygeneration.DCCurrentPV4}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCCurrentPV4"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCCurrent" })} PV4
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCPowerPV1"}
                                                                        checked={option.electricitygeneration.DCPowerPV1}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCPowerPV1"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCPower" })} PV1
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCPowerPV2"}
                                                                        checked={option.electricitygeneration.DCPowerPV2}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCPowerPV2"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCPower" })} PV2
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCPowerPV3"}
                                                                        checked={option.electricitygeneration.DCPowerPV3}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCPowerPV3"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCPower" })} PV3
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_DCPowerPV4"}
                                                                        checked={option.electricitygeneration.DCPowerPV4}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_DCPowerPV4"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DCPower" })} PV4
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACVoltRUA"}
                                                                        checked={option.electricitygeneration.ACVoltRUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACVoltRUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACVolt" })} R/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACVoltSUA"}
                                                                        checked={option.electricitygeneration.ACVoltSUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACVoltSUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACVolt" })} S/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACVoltTUA"}
                                                                        checked={option.electricitygeneration.ACVoltTUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACVoltTUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACVolt" })} T/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACCurrentRUA"}
                                                                        checked={option.electricitygeneration.ACCurrentRUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACCurrentRUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACCurrent" })} R/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACCurrentSUA"}
                                                                        checked={option.electricitygeneration.ACCurrentSUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACCurrentSUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACCurrent" })} S/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACCurrentTUA"}
                                                                        checked={option.electricitygeneration.ACCurrentTUA}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACCurrentTUA"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACCurrent" })} T/U/A
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"electricitygeneration_ACOutputFreqR"}
                                                                        checked={option.electricitygeneration.ACOutputFreqR}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"electricitygeneration_ACOutputFreqR"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "ACOutputFreq" })}
                                                                    </label>
                                                                </div>

                                                                {/* <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"totalACOutput"}
                                                                        defaultValue={option.electricitygeneration.totalACOutput}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"totalACOutput"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "totalACOutput" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"reactivePower"}
                                                                        defaultValue={option.electricitygeneration.reactivePower}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"reactivePower"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "reactivePower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"dailyOutput"}
                                                                        defaultValue={option.electricitygeneration.dailyOutput}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"dailyOutput"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "dailyOutput" })}
                                                                    </label>
                                                                </div> */}
                                                                {/* 
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"LoadActivePower"}
                                                                        defaultValue={option.electricitygeneration.dailyOutput}
                                                                        onChange={(e) => handleCheck(e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={"LoadActivePower"}
                                                                    >
                                                                        {/* Load Active Power */}
                                                                {/* {dataLang.formatMessage({ id: "LoadActivePower" })} */}
                                                                {/* </label> */}
                                                                {/* </div> */}
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {/* Power Grid: */}
                                                                {dataLang.formatMessage({ id: "PowerGrid" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"LeakCurrent"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"LeakCurrent"}
                                                                    >
                                                                        {/* Leak Current */}
                                                                        {dataLang.formatMessage({ id: "LeakCurrent" })}:
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"TotalGridPower"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"TotalGridPower"}
                                                                    >
                                                                        {/* Total Grid Power */}
                                                                        {dataLang.formatMessage({ id: "TotalGridPower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"CumulativeGridFeedin"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"CumulativeGridFeedin"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "CumulativeGridFeedin" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"CumulativeEnergyPurchased"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"CumulativeEnergyPurchased"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "CumulativeEnergyPurchased" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"DailyGridFeedin"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"DailyGridFeedin"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DailyGridFeedin" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"DailyEnergyPurchased"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"DailyEnergyPurchased"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DailyEnergyPurchased" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"MeterPower"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"MeterPower"}
                                                                    >
                                                                        {/* Meter Power */}
                                                                        {dataLang.formatMessage({ id: "MeterPower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"CTcur"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"CTcur"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "CTcur" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {dataLang.formatMessage({ id: "electricConsumption" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"Total Consumption Power"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"Total Consumption Power"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "TotalConsumptionPower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"Cumulative Consumption"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"Cumulative Consumption"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "CumulativeConsumption" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"Daily Consumption"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"Daily Consumption"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DailyConsumptionPower" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {dataLang.formatMessage({ id: "batteryData" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BatteryVolt"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BatteryVolt"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "BatteryVolt" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BatteryCurrent"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BatteryCurrent"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "BatteryCurrent" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"MaxChargingCur"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"MaxChargingCur"}
                                                                    >
                                                                        {/* Max. Charging Current */}
                                                                        {dataLang.formatMessage({ id: "MaxChargingCur" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"MaxDischargingCur"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"MaxDischargingCur"}
                                                                    >
                                                                        {/* Max. Discharging Current */}
                                                                        {dataLang.formatMessage({ id: "MaxDischargingCur" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BatteryPower"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BatteryPower"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "BatteryPower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"SoC"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"SoC"}
                                                                    >
                                                                        SoC
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"SoH"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"SoH"}
                                                                    >
                                                                        SoH
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"TotalchargingEnergy"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"TotalchargingEnergy"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "TotalchargingEnergy" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"TotaldischargingEnergy"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"TotaldischargingEnergy"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "TotaldischargingEnergy" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"DailychargingEnergy"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"DailychargingEnergy"}
                                                                    >
                                                                        {dataLang.formatMessage({ id: "DailychargingEnergy" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                BMS:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BMSMaxChargingCur"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BMSMaxChargingCur"}
                                                                    >
                                                                        {/* BMS Max Charge Current */}
                                                                        {dataLang.formatMessage({ id: "BMSMaxChargingCur" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"MaxDischargingCur"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"MaxDischargingCur"}
                                                                    >
                                                                        {/* BMS Max Discharge Current */}
                                                                        {dataLang.formatMessage({ id: "MaxDischargingCur" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BMSChargeVoltage"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BMSChargeVoltage"}
                                                                    >
                                                                        {/* BMS Charge Voltage */}
                                                                        {dataLang.formatMessage({ id: "BMSChargeVoltage" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"BMSDischargeVoltage"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"BMSDischargeVoltage"}
                                                                    >
                                                                        {/* BMS Discharge Voltage */}
                                                                        {dataLang.formatMessage({ id: "BMSDischargeVoltage" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                {/* State: */}
                                                                {dataLang.formatMessage({ id: "State" })}:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"DCInsulationResistance"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"DCInsulationResistance"}
                                                                    >
                                                                        {/* DC Insulation Resistance */}
                                                                        {dataLang.formatMessage({ id: "DCInsulationResistance" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr">
                                                            <th className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                                EPS:
                                                            </th>
                                                            <td className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"RphaseEPSvoltage"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"RphaseEPSvoltage"}
                                                                    >
                                                                        {/* R phase EPS voltage */}
                                                                        {dataLang.formatMessage({ id: "RphaseEPSvoltage" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"RphaseEPScurrent"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"RphaseEPScurrent"}
                                                                    >
                                                                        {/* R phase EPS current */}
                                                                        {dataLang.formatMessage({ id: "RphaseEPScurrent" })}
                                                                    </label>
                                                                </div>
                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"EPSRphaseActivePower"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"EPSRphaseActivePower"}
                                                                    >
                                                                        {/* EPSR phase active power */}
                                                                        {dataLang.formatMessage({ id: "EPSRphaseActivePower" })}
                                                                    </label>
                                                                </div>

                                                                <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={"EPSFrequency"}
                                                                    />
                                                                    <label
                                                                        htmlFor={"EPSFrequency"}
                                                                    >
                                                                        {/* EPS Frequency */}
                                                                        {dataLang.formatMessage({ id: "EPSFrequency" })}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="DAT_Info_Databox_HistoricalData_SubConfig_Dropdown_Bottom">
                                                <button
                                                    style={{
                                                        backgroundColor: "white",
                                                        color: "black",
                                                    }}
                                                    onClick={(e) => {
                                                        handleShowConfig(e);
                                                        setDropConfig(!dropConfig);
                                                        handleCancelChangeChart(e);
                                                    }}
                                                >
                                                    {dataLang.formatMessage({ id: "cancel" })}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        handleShowConfig(e);
                                                        setDropConfig(!dropConfig);
                                                        handleConfirmChangeChart();
                                                    }}
                                                    style={{
                                                        backgroundColor: COLOR.value.PrimaryColor,
                                                        color: "white",
                                                    }}
                                                >
                                                    {dataLang.formatMessage({ id: "confirm" })}
                                                </button>
                                            </div>
                                        </div>
                                        : <></>
                                    }
                                </div>
                            </div>
                        }
                    </>
                    :
                    <></>
                }
            </div>
        </div >
    );
}
