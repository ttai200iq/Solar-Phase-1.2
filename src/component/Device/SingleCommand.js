import React, { useEffect, useReducer, useState } from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { signal } from '@preact/signals-react';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { info } from './Device';
import { COLOR, Token } from '../../App';
import { alertDispatch } from '../Alert/Alert';
import { BeatLoader } from 'react-spinners';

import { FaCheckCircle } from 'react-icons/fa';

const remote = signal(255);

export default function SingleCommand(props) {
    const dataLang = useIntl();
    const [step, setStep] = useState(0);
    const [invt, setInvt] = useState({});
    const intervalIDRef = useReducer(null);
    const [commandtype, setCommandType] = useState("");
    const [commandName, setCommandName] = useState("");
    const [key, setKey] = useState("");
    const [datatype, setDatatype] = useState("");
    const [unit, setUnit] = useState("");
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const commandData = [
        // AC Start Voltage
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
            type: "read",
            key: 'ac_high_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
            type: "Set",
            key: 'ac_high_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
            type: "read",
            key: 'ac_low_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
            type: "Set",
            key: 'ac_low_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        //AC Start Frequency 
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
            type: "read",
            key: 'ac_high_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
            type: "Set",
            key: 'ac_high_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
            type: "read",
            key: 'ac_low_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
            type: "Set",
            key: 'ac_low_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        //AC Start Volt level 1 
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
            type: "read",
            key: 'ac_under_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
            type: "Set",
            key: 'ac_under_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
            type: "read",
            key: 'ac_over_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
            type: "Set",
            key: 'ac_over_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        //AC Start Volt 1 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
            type: "read",
            key: 'ac_under_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
            type: "Set",
            key: 'ac_under_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
            type: "read",
            key: 'ac_over_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
            type: "Set",
            key: 'ac_over_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        // //AC Start Volt 2
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
            type: "read",
            key: 'ac_under_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
            type: "Set",
            key: 'ac_under_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
            type: "read",
            key: 'ac_over_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
            type: "Set",
            key: 'ac_over_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        //AC Start Volt 2 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
            type: "read",
            key: 'ac_under_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
            type: "Set",
            key: 'ac_under_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
            type: "read",
            key: 'ac_over_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
            type: "Set",
            key: 'ac_over_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        //AC Frequency level 1
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
            type: "read",
            key: 'ac_under_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
            type: "Set",
            key: 'ac_under_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
            type: "read",
            key: 'ac_over_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
            type: "Set",
            key: 'ac_over_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        //AC Frequency 1 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
            type: "read",
            key: 'ac_under_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
            type: "Set",
            key: 'ac_under_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
            type: "read",
            key: 'ac_over_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
            type: "Set",
            key: 'ac_over_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        //AC Frequency level 2
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
            type: "read",
            key: 'ac_under_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
            type: "Set",
            key: 'ac_under_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
            type: "read",
            key: 'ac_over_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
            type: "Set",
            key: 'ac_over_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        //AC Frequency 2 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
            type: "read",
            key: 'ac_under_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
            type: "Set",
            key: 'ac_under_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
            type: "read",
            key: 'ac_over_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
            type: "Set",
            key: 'ac_over_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        //Other Options
        // {
        //     name: dataLang.formatMessage({ id: 'ReadInverters' })
        // },
        // {
        //     name: dataLang.formatMessage({ id: 'SetInverters' })
        // },
        // {
        //     name: dataLang.formatMessage({ id: 'ReadCTRatio' })
        // },
        // {
        //     name: dataLang.formatMessage({ id: 'SetCTRatio' })
        // },
    ];

    const commandData_hybrid = [
        // GridStartSettings
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
            type: "read",
            key: 'ac_high_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
            type: "Set",
            key: 'ac_high_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
            type: "read",
            key: 'ac_low_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
            type: "Set",
            key: 'ac_low_voltage',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
            type: "read",
            key: 'ac_high_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
            type: "Set",
            key: 'ac_high_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
            type: "read",
            key: 'ac_low_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
            type: "Set",
            key: 'ac_low_fre',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " Start Delay Time:",
            type: "read",
            key: 'start_delay_time',
            datatype: 'time',
            min: "20",
            max: "600",
            unit: "s",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " Start Delay Time:",
            type: "Set",
            key: 'start_delay_time',
            datatype: 'time',
            min: "20",
            max: "600",
            unit: "s",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " Restart Delay Time:",
            type: "read",
            key: 'restart_delay_time',
            datatype: 'time',
            min: "20",
            max: "1000",
            unit: "s",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " Restart Delay Time:",
            type: "Set",
            key: 'restart_delay_time',
            datatype: 'time',
            min: "20",
            max: "1000",
            unit: "s",
        },
        // GridVolt
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
            type: "read",
            key: 'ac_under_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
            type: "Set",
            key: 'ac_under_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
            type: "read",
            key: 'ac_over_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
            type: "Set",
            key: 'ac_over_voltage_1',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
            type: "read",
            key: 'ac_under_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
            type: "Set",
            key: 'ac_under_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
            type: "read",
            key: 'ac_over_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
            type: "Set",
            key: 'ac_over_voltagetime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
            type: "read",
            key: 'ac_under_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
            type: "Set",
            key: 'ac_under_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
            type: "read",
            key: 'ac_over_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
            type: "Set",
            key: 'ac_over_voltage_2',
            datatype: 'number',
            min: "10.0",
            max: "1000.0",
            unit: "V",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
            type: "read",
            key: 'ac_under_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
            type: "Set",
            key: 'ac_under_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
            type: "read",
            key: 'ac_over_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
            type: "Set",
            key: 'ac_over_voltagetime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
            type: "read",
            key: 'ac_under_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
            type: "Set",
            key: 'ac_under_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
            type: "read",
            key: 'ac_over_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
            type: "Set",
            key: 'ac_over_fre_1',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
            type: "read",
            key: 'ac_under_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
            type: "Set",
            key: 'ac_under_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
            type: "read",
            key: 'ac_over_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
            type: "Set",
            key: 'ac_over_fretime_1',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
            type: "read",
            key: 'ac_under_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
            type: "Set",
            key: 'ac_under_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
            type: "read",
            key: 'ac_over_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
            type: "Set",
            key: 'ac_over_fre_2',
            datatype: 'number',
            min: "45.00",
            max: "65.00",
            unit: "Hz",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
            type: "read",
            key: 'ac_under_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
            type: "Set",
            key: 'ac_under_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
            type: "read",
            key: 'ac_over_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
            type: "Set",
            key: 'ac_over_fretime_2',
            datatype: 'time',
            min: "20",
            max: "5000",
            unit: "ms",
        },
    ];

    const invtCloud = async (data, token) => {
        var reqData = {
            data: data,
            token: token,
        };

        try {
            const response = await axios({
                url: host.CLOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData)
                    .map(function (key) {
                        return (
                            encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
                        );
                    })
                    .join("&"),
            });
            return response.data;
        } catch (e) {
            return { ret: 1, msg: "cloud err" };
        }
    };

    const remotecloud = async (data, token) => {
        var reqData = {
            "data": data,
            "token": token
        };

        try {
            const response = await axios({
                url: host.RMCLOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]) }).join('&'),
            });
            return response.data
        } catch (e) {
            return ({ ret: 1, msg: "cloud err" })
        }
    }

    const startTimer = () => {
        intervalIDRef.current = setInterval(async () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;

            if (commandtype === "read") {
                if (step === 0) {
                    let res = await invtCloud('{"deviceCode": "' + info.value.plogger + '"}', Token.value.token)
                    console.log(res)
                    if (res.ret === 0) {
                        setLoading(false)
                        setInvt(res.data)
                        setStep(1)
                    }
                }
            }

            if (commandtype === "Set") {
                remote.value = 0
                console.log('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}')
                let res = await remotecloud('{"deviceCode":"' + info.value.plogger + '","address":"' + info.value.psetting[key].register + '","value":"' + parseInt(document.getElementById(key).value / info.value.psetting[key].cal) + '"}', Token.value.token)
                console.log(res)
                if (res.ret === 0) {
                    setLoading(false)
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))

                    let number = document.getElementById(key).value;
                    setResult(number);
                    let name = commandData.find(item => item.key === key && item.type === commandtype).name;
                    setCommandName(name);
                    let unit = commandData.find(item => item.key === key && item.type === commandtype).unit;
                    setUnit(unit);
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                }
            }
        }, 2000)
    };

    const handleChange = (e) => {
        const type = e.target.value.split("-")[0];
        const key = e.target.value.split("-")[1];
        const datatype = e.target.value.split("-")[2];
        const min = e.target.value.split("-")[3];
        const max = e.target.value.split("-")[4];
        setCommandType(type);
        setKey(key);
        setDatatype(datatype);
        setMin(min);
        setMax(max);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        startTimer();
    };

    useEffect(() => {
        if (step) {
            setStep(0)
            switch (info.value.pdata.mode) {
                case "HYBRID":
                    let number_hybrid = datatype === 'number' ? parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2) : parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                    setResult(number_hybrid);
                    let name_hybrid = commandData_hybrid.find(item => item.key === key).name;
                    setCommandName(name_hybrid);
                    let unit_hybrid = commandData_hybrid.find(item => item.key === key).unit;
                    setUnit(unit_hybrid);
                    break;
                case "CONSUMPTION":
                    let number_con = datatype === 'number' ? parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2) : parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                    setResult(number_con);
                    let name_con = commandData.find(item => item.key === key).name;
                    setCommandName(name_con);
                    let unit_con = commandData.find(item => item.key === key).unit;
                    setUnit(unit_con);
                    break;
                default:
                    let number = datatype === 'number' ? parseFloat(invt[info.value.psetting[key].register] * info.value.psetting[key].cal).toFixed(2) : parseInt(invt[info.value.psetting[key].register] * info.value.psetting[key].cal)
                    setResult(number);
                    let name = commandData.find(item => item.key === key).name;
                    setCommandName(name);
                    let unit = commandData.find(item => item.key === key).unit;
                    setUnit(unit);
                    break;
            }
        }
    }, [step])

    return (
        <>
            <div className="DAT_Info_Databox" id="LastCommandRecord">
                <div className="DAT_Info_Databox_Title">
                    <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'LastCommandRecord' })}</div>
                </div>

                <div className="DAT_Info_Databox_SingleCommand">
                    <div className="DAT_Info_Databox_SingleCommand_Content">
                        <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'CommandName' })}:
                            </div>
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                {commandName}
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'ReadResult' })}:
                            </div>
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                {result} {unit}
                            </div>
                        </div>

                        <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'CommandState' })}:
                            </div>
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                {loading
                                    ? <>
                                        <BeatLoader color={COLOR.value.SecondaryColor} size={10} />
                                        <span style={{ color: COLOR.value.SecondaryColor }}>
                                            {dataLang.formatMessage({ id: 'Loading' })}
                                        </span>
                                    </>
                                    : <>
                                        {result === ""
                                            ? <></>
                                            : <>
                                                <FaCheckCircle size={16} color="green" />
                                                <span style={{ color: "green" }}>
                                                    {dataLang.formatMessage({ id: 'success' })}
                                                </span>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>

                        {/* <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'SendTime' })}:
                            </div>
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                2024/03/25 10:30:49 UTC+07:00
                            </div>
                        </div> */}

                        {/* <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'FeedbackTime' })}:
                            </div>
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                2024/03/25 10:30:50 UTC+07:00
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="DAT_Info_Databox" id="SelectCommand">
                <div className="DAT_Info_Databox_Title">
                    <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'SelCommand' })}</div>
                </div>

                <form className="DAT_Info_Databox_SingleCommand" onSubmit={(e) => handleSend(e)}>
                    <div className="DAT_Info_Databox_SingleCommand_Content">
                        <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                            <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                {dataLang.formatMessage({ id: 'CommandName' })}:
                            </div>

                            {(() => {
                                switch (info.value.pdata.mode) {
                                    case "HYBRID":
                                        return <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                            <select onChange={(e) => handleChange(e)}>
                                                <option style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                                {commandData_hybrid.map((item, i) => {
                                                    return <option key={i} value={`${item.type}-${item.key}-${item.datatype}-${item.min}-${item.max}`}>{item.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    case "CONSUMPTION":
                                        return <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                            <select onChange={(e) => handleChange(e)}>
                                                <option style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                                {commandData.map((item, i) => {
                                                    return <option key={i} value={`${item.type}-${item.key}-${item.datatype}-${item.min}-${item.max}`}>{item.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    default:
                                        return <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                            <select onChange={(e) => handleChange(e)}>
                                                <option style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                                {commandData.map((item, i) => {
                                                    return <option key={i} value={`${item.type}-${item.key}-${item.datatype}-${item.min}-${item.max}`}>{item.name}</option>
                                                })}
                                            </select>
                                        </div>
                                }
                            })()}
                        </div>

                        {commandtype === ""
                            ? <></>
                            : <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                                <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'CommandType' })}:
                                </div>
                                <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                    {dataLang.formatMessage({ id: commandtype })}
                                </div>
                            </div>
                        }

                        {commandtype === "" || commandtype === "read"
                            ? <></>
                            : <div className="DAT_Info_Databox_SingleCommand_Content_Item">
                                <div className="DAT_Info_Databox_SingleCommand_Content_Item_Tit">
                                    {dataLang.formatMessage({ id: 'Inputs' })}:
                                </div>
                                <div className="DAT_Info_Databox_SingleCommand_Content_Item_Content">
                                    <input placeholder={`${min} ~ ${max}`} type="number" min={min} max={max} step="any" id={key} required />
                                    {unit}
                                </div>
                            </div>
                        }
                    </div>

                    <div className="DAT_Info_Databox_SingleCommand_Foot">
                        {/* <div className="DAT_Info_Databox_SingleCommand_Foot_Item">
                            <span>
                                {dataLang.formatMessage({ id: 'Timeout' })}:
                            </span>
                            <input />
                            <span>{dataLang.formatMessage({ id: 'Timeout' })}</span>

                            <div className="DAT_Home_Overview-Main-Percent-Icon" style={{ cursor: 'pointer' }}>
                                <PopupState variant="popper" popupId="demo-popup-popper">
                                    {(popupState) => (
                                        <div style={{ cursor: 'pointer' }}>
                                            <HelpOutlineIcon
                                                {...bindHover(popupState)}
                                                color="action"
                                                fontSize="9px" />
                                            <Popper {...bindPopper(popupState)} transition >
                                                {({ TransitionProps }) => (
                                                    <Fade {...TransitionProps} timeout={350}>
                                                        <Paper sx={{ width: '400px', marginLeft: '200px', p: 2 }}>
                                                            <Typography sx={{ fontSize: '12px', textAlign: 'justify', marginBottom: 1.7 }}>
                                                                {dataLang.formatMessage({ id: 'timeoutInfo' })}
                                                            </Typography>
                                                        </Paper>
                                                    </Fade>
                                                )}
                                            </Popper>
                                        </div>
                                    )}
                                </PopupState>
                            </div>
                        </div> */}

                        <button>{dataLang.formatMessage({ id: 'SendCommand' })}</button>
                    </div>
                </form >
            </div >
        </>
    );
}
