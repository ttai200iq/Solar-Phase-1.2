import React, { useEffect, useState } from 'react';

import { signal } from "@preact/signals-react";
import { MdOutlineDashboard, MdOutlineSettings } from 'react-icons/md';
import { TbSolarPanel2 } from 'react-icons/tb';
import { Slider } from '@mui/material';
import { useSelector } from 'react-redux';
import { slloggerDB } from './SLProjectData';
import axios from 'axios';
import { host } from '../Lang/Contant';
import { alertDispatch } from '../Alert/Alert';
import { useIntl } from 'react-intl';
import { Token } from '../../App';
import { isBrowser } from 'react-device-detect';
import { slProjectData } from './SLProjectlist';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { callApi } from '../Api/Api';
import SLEditImage, { SLDiagramImg } from './SLEditImage';
import SemiCircleProgressBar from "react-progressbar-semicircle";
import SLGraph from './SLGraph';

export const viewSL = signal("dashboard");
export const SLloggerSn = signal('');

export default function SolarLight(props) {
    const device_status = {
        0: 'Processing',
        1: 'Sleep',
        10: 'Charge prepro',
        11: 'Charge',
        12: 'Charge idle',
        13: 'Full',
        16: 'Charge OC',
        21: 'Discharge',
        22: 'Discharge idle',
    };

    const operation_mode = {
        0: 'Model 1',
        1: 'Model 2',
        2: 'Model 3',
        3: 'Model 4',
        4: 'Model 5',
        5: 'Discharge idle',
        6: 'Discharge Morning',
        7: 'Stop',
    };

    const dataLang = useIntl();
    const cal = useSelector((state) => state.tool.cal);
    const [addLightState, setAddLightState] = useState(false);
    const [dashboardMode, setDashboardMode] = useState('map');
    const [editDiagram, setEditDiagram] = useState(false);
    const [level_light_1, setLevelLight1] = useState(0);
    const [level_light_2, setLevelLight2] = useState(0);
    const [level_light_3, setLevelLight3] = useState(0);
    const [level_light_4, setLevelLight4] = useState(0);
    const [level_light_5, setLevelLight5] = useState(0);
    const config = [
        'led_manual_control',
        'sleep_control',
        'led_lighting_method',
        'level_light_1',
        'timing_light_1',
        'level_light_2',
        'timing_light_2',
        'level_light_3',
        'timing_light_3',
        'level_light_4',
        'timing_light_4',
        'level_light_5',
        'timing_light_5',
        'number_cell_battery',
        'bat_over_dsch_volt',
        'over_dsch_return_volt',
        'max_current_pv_charge',
        'stop_charge_current',
        'volt_overcharge',
        'over_dsch_delay',
        'undervolt_warn',
        'volt_overcharge_return',
        'priority_given',
        'switch_volt',
    ];

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

    const handleChangeLogger = (e) => {
        SLloggerSn.value = e.target.value;
    };

    const handleSwitch = (e) => {
        switch (e.currentTarget.id) {
            case 'led_lighting_method':
                let item__ = document.getElementById(e.currentTarget.id);
                if (item__.value === '0.00') {
                    item__.value = '2.00';
                    item__.children[0].style.backgroundColor = 'green';
                    item__.children[0].style.color = 'green';
                    item__.children[1].style.backgroundColor = 'rgb(248, 249, 250)';
                    item__.children[1].style.color = 'black';
                } else {
                    item__.value = '0.00';
                    item__.children[0].style.backgroundColor = 'rgb(248, 249, 250)';
                    item__.children[0].style.color = 'black';
                    item__.children[1].style.backgroundColor = 'green';
                    item__.children[1].style.color = 'green';
                }
                break;
            case 'priority_given':
                let item_ = document.getElementById(e.currentTarget.id);
                if (item_.value === '0.00') {
                    item_.value = '1.00';
                    item_.children[0].style.backgroundColor = 'green';
                    item_.children[0].style.color = 'green';
                    item_.children[1].style.backgroundColor = 'rgb(248, 249, 250)';
                    item_.children[1].style.color = 'black';
                } else {
                    item_.value = '0.00';
                    item_.children[0].style.backgroundColor = 'rgb(248, 249, 250)';
                    item_.children[0].style.color = 'black';
                    item_.children[1].style.backgroundColor = 'green';
                    item_.children[1].style.color = 'green';
                }
                break;
            default:
                let item = document.getElementById(e.currentTarget.id);
                if (item.value === '0.00') {
                    item.value = '1.00';
                    item.children[0].style.backgroundColor = 'rgb(248, 249, 250)';
                    item.children[0].style.color = 'black';
                    item.children[1].style.backgroundColor = 'green';
                    item.children[1].style.color = 'green';
                } else {
                    item.value = '0.00';
                    item.children[0].style.backgroundColor = 'red';
                    item.children[0].style.color = 'red';
                    item.children[1].style.backgroundColor = 'rgb(248, 249, 250)';
                    item.children[1].style.color = 'black';
                }
                break;
        }
    };

    const handleCloseEditImg = () => {
        setEditDiagram(false);
    };

    const handleSlide = (e) => {
        switch (e.target.name) {
            case 'level_light_1':
                document.getElementById(e.target.name).value = parseFloat((e.target.value * 90) / 100).toFixed(2);
                setLevelLight1(e.target.value);
                break;
            case 'level_light_2':
                document.getElementById(e.target.name).value = parseFloat((e.target.value * 90) / 100).toFixed(2);
                setLevelLight2(e.target.value);
                break;
            case 'level_light_3':
                document.getElementById(e.target.name).value = parseFloat((e.target.value * 90) / 100).toFixed(2);
                setLevelLight3(e.target.value);
                break;
            case 'level_light_4':
                document.getElementById(e.target.name).value = parseFloat((e.target.value * 90) / 100).toFixed(2);
                setLevelLight4(e.target.value);
                break;
            case 'level_light_5':
                document.getElementById(e.target.name).value = parseFloat((e.target.value * 90) / 100).toFixed(2);
                setLevelLight5(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleRead = (e) => {
        config.map((key) => {
            switch (key) {
                case 'led_manual_control': case 'sleep_control':
                    document.getElementById(key).value = cal[key];
                    if (document.getElementById(key).value === '0.00') {
                        document.getElementById(key).children[0].style.backgroundColor = 'red';
                        document.getElementById(key).children[0].style.color = 'red';
                        document.getElementById(key).children[1].style.backgroundColor = 'rgb(248, 249, 250)';
                        document.getElementById(key).children[1].style.color = 'black';
                    } else {
                        document.getElementById(key).children[0].style.backgroundColor = 'rgb(248, 249, 250)';
                        document.getElementById(key).children[0].style.color = 'black';
                        document.getElementById(key).children[1].style.backgroundColor = 'green';
                        document.getElementById(key).children[1].style.color = 'green';
                    }
                    break;
                case 'priority_given': case 'led_lighting_method':
                    document.getElementById(key).value = cal[key];
                    if (document.getElementById(key).value === '0.00') {
                        document.getElementById(key).children[0].style.backgroundColor = 'rgb(248, 249, 250)';
                        document.getElementById(key).children[0].style.color = 'black';
                        document.getElementById(key).children[1].style.backgroundColor = 'green';
                        document.getElementById(key).children[1].style.color = 'green';
                    } else {
                        document.getElementById(key).children[0].style.backgroundColor = 'green';
                        document.getElementById(key).children[0].style.color = 'green';
                        document.getElementById(key).children[1].style.backgroundColor = 'rgb(248, 249, 250)';
                        document.getElementById(key).children[1].style.color = 'black';
                    }
                    break;
                case 'level_light_1':
                    document.getElementById(key).value = parseFloat(cal[key]).toFixed(2);
                    setLevelLight1(parseInt((cal[key] / 90) * 100));
                    break;
                case 'level_light_2':
                    document.getElementById(key).value = parseFloat(cal[key]).toFixed(2);
                    setLevelLight2(parseInt((cal[key] / 90) * 100));
                    break;
                case 'level_light_3':
                    document.getElementById(key).value = parseFloat(cal[key]).toFixed(2);
                    setLevelLight3(parseInt((cal[key] / 90) * 100));
                    break;
                case 'level_light_4':
                    document.getElementById(key).value = parseFloat(cal[key]).toFixed(2);
                    setLevelLight4(parseInt((cal[key] / 90) * 100));
                    break;
                case 'level_light_5':
                    document.getElementById(key).value = parseFloat(cal[key]).toFixed(2);
                    setLevelLight5(parseInt((cal[key] / 90) * 100));
                    break;
                default:
                    document.getElementById(key).value = cal[key];
                    break;
            }
        });
    };

    const handleWrite = async (e) => {
        for (const key of config) {
            try {
                // console.log(key, cal[key]);
                console.log('{"deviceCode":"' + slloggerDB.value[0].sn + '","address":"' + slloggerDB.value[0].data[key].register + '","value":"' + parseInt(document.getElementById(key).value) + '"}')
                let res = await remotecloud('{"deviceCode":"' + slloggerDB.value[0].sn + '","address":"' + slloggerDB.value[0].data[key].register + '","value":"' + parseInt(document.getElementById(key).value) + '"}', Token.value.token)
                console.log(res)
                if (res.ret === 0) {
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                }
            } catch (e) {
                console.log('error');
            }
        }
    };

    const loader = new Loader({
        apiKey: process.env.REACT_APP_GGKEY,
        version: "weekly",
        libraries: ["places"],
    });

    const handleUpdateLoggerPosition = async (sn, newdata) => {
        let res_ = await callApi("post", host.DATA + "/updateLogger", {
            sn: sn,
            type: "setting",
            data: newdata,
        });
        console.log(res_);
    };

    const handleEditMap = () => {
        loader.load().then(async (google) => {
            const defaultProps = {
                center: {
                    lat: parseFloat(slProjectData.value.lat),
                    lng: parseFloat(slProjectData.value.long),
                },
                zoom: 19.0,
                mapId: "DEMO_MAP_ID",
                fullscreenControl: false,
            };

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            let map = new Map(document.getElementById("map"), defaultProps);

            const markerList = slloggerDB.value.map((item, index) => {
                const lightImg = document.createElement("div");
                const src = `/dat_picture/solar_light.png`
                lightImg.className = "light-tag";
                lightImg.innerHTML = `<img src='${src}'></img>`

                const marker = { lat: parseFloat(item.setting.lat), lng: parseFloat(item.setting.long) };
                const markerElement = new AdvancedMarkerElement({
                    position: marker,
                    map: map,
                    title: item.name,
                    content: lightImg,
                    gmpDraggable: true,
                });

                markerElement.addListener("dragend", (mapsMouseEvent) => {
                    slloggerDB.value.map(item_ => {
                        if (item_.sn === item.sn) {
                            item_.setting.lat = mapsMouseEvent.latLng.toJSON().lat;
                            item_.setting.long = mapsMouseEvent.latLng.toJSON().lng;
                        }
                        return item;
                    });

                    handleUpdateLoggerPosition(item.sn, JSON.stringify({ lat: String(mapsMouseEvent.latLng.toJSON().lat), long: String(mapsMouseEvent.latLng.toJSON().lng) }));
                });

                return markerElement;
            });

            new MarkerClusterer({ markers: markerList, map: map });
        })
    };

    const initMap = async (name, lat, long) => {

        loader.load().then(async (google) => {
            const defaultProps = {
                center: {
                    lat: lat,
                    lng: long,
                },
                zoom: 19.0,
                mapId: "DEMO_MAP_ID",
                fullscreenControl: false,
            };

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            let map = new Map(document.getElementById("map"), defaultProps);

            const markerList = slloggerDB.value.map((item, index) => {
                const myLatlng = { lat: lat, lng: long };

                let infoWindow = new google.maps.InfoWindow({
                    content: 'Your position',
                    position: myLatlng,
                });

                map.addListener("click", () => { infoWindow.close() });

                const lightImg = document.createElement("div");
                const src = `/dat_picture/solar_light.png`
                lightImg.className = "light-tag";
                lightImg.innerHTML = `<img src='${src}'></img>`

                const marker = { lat: parseFloat(item.setting.lat), lng: parseFloat(item.setting.long) };
                const markerElement = new AdvancedMarkerElement({
                    position: marker,
                    map: map,
                    title: item.name,
                    content: lightImg,
                });

                markerElement.addListener("click", () => {
                    SLloggerSn.value = item.sn;

                    // Close the current InfoWindow.
                    infoWindow.close();
                    // Create a new InfoWindow.
                    infoWindow = new google.maps.InfoWindow({
                        anchor: markerElement,
                        map: map,
                        shouldFocus: false,
                    });

                    infoWindow.setContent(`
                            <div class="InfoWindowCustom">
                                <div class="InfoWindowCustom_Title">${item.name}</div>
                                <div class="InfoWindowCustom_Row">
                                    <span>Status</span>
                                    <span>${device_status[parseFloat(cal?.device_status).toFixed(0)]}</span>
                                </div>
                                <div class="InfoWindowCustom_Row">
                                    <span>Battery Voltage (V)</span>
                                    <span>${parseFloat(cal?.bat_volt).toFixed(1)}</span>
                                </div>
                                <div class="InfoWindowCustom_Row">
                                    <span>Operation Mode</span>
                                    <span>${operation_mode[parseFloat(cal?.mode_operating).toFixed(0)]}</span>
                                </div>
                            </div>
                            `);

                    infoWindow.open(map, markerElement);
                });

                return markerElement;
            });

            new MarkerClusterer({ markers: markerList, map: map });
        })
    };

    useEffect(() => {
        if (viewSL.value === 'dashboard') {
            initMap(
                slProjectData.value.plantname,
                parseFloat(slProjectData.value.lat),
                parseFloat(slProjectData.value.long)
            );
        } else {
            SLloggerSn.value = document.getElementById('select_sn').value;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewSL.value]);

    useEffect(() => {
        return () => {
            viewSL.value = 'dashboard';
            SLloggerSn.value = '';
        };
    }, []);

    return (
        <>
            {isBrowser
                ?
                <div className='DAT_ProjectData_SolarLight'>
                    {(() => {
                        switch (viewSL.value) {
                            case 'monitor':
                                return (
                                    <div className="DAT_ProjectData_SolarLight_Dashboard">
                                        <select id='select_sn' className="DAT_ProjectData_SolarLight_Dashboard_Select" onChange={(e) => handleChangeLogger(e)}>
                                            {slloggerDB.value.map((item, index) => {
                                                return <option key={index} value={item.sn}>{item.name}</option>
                                            })}
                                        </select>

                                        {/* <div className="DAT_ProjectData_SolarLight_Dashboard_Title">
                                            GENERAL PARAMETER MONITORING
                                        </div> */}

                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item">
                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Device Status
                                                        {(() => {
                                                            switch (parseFloat(cal?.device_status).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Processing</span>
                                                                case '1':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Sleep</span>
                                                                case '10':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Charge prepro</span>
                                                                case '11':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Charge</span>
                                                                case '12':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Charge idle</span>
                                                                case '13':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Full</span>
                                                                case '16':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Charge OC</span>
                                                                case '21':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Discharge</span>
                                                                case '22':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Discharge idle</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Mode Operating
                                                        {(() => {
                                                            switch (parseFloat(cal?.mode_operating).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Model 1</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Model 2</span>
                                                                case '2':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Model 3</span>
                                                                case '3':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Model 4</span>
                                                                case '4':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Model 5</span>
                                                                case '5':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Discharge idle</span>
                                                                case '6':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Discharge Morning</span>
                                                                case '7':
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>Stop</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Priority given BAT or Grid
                                                        {(() => {
                                                            switch (parseFloat(cal?.priority_given).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>BAT Priority</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Grid Priority</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Cost Saving (VND)
                                                        <span style={{ color: 'blue', fontSize: '22px' }}>{parseFloat((cal?.cost_saving)).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.cost_saving) * 194.3).toFixed(1)}</span>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Power Supply Status
                                                        {(() => {
                                                            switch (parseFloat(cal?.power_supply_status).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>PV Power Supply</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '22px' }}>Grid Power Supply</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '22px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Item_Row_Item">
                                                        Ambient Temp (°C)
                                                        <span style={{ color: 'blue', fontSize: '22px' }}>{parseFloat((cal?.ambient_temp)).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.ambient_temp) - 40).toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left">
                                                <SLGraph state={slProjectData.value.state} />
                                            </div>

                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right">
                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            Mode 1
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top"
                                                                    style={{ marginTop: '-10px' }}
                                                                >
                                                                    <SemiCircleProgressBar
                                                                        percentage={Number(parseFloat((cal?.level_light_1 / 90) * 100).toFixed(0)) || 0}
                                                                        showPercentValue
                                                                        strokeWidth={15}
                                                                        diameter={130}
                                                                    />
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    Level lighting
                                                                </div>
                                                            </div>

                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top">
                                                                    <img alt='' src='/dat_icon/clock_1.png' />
                                                                    <div>
                                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_1).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_1).toFixed(1)}</span>
                                                                        <div>
                                                                            min
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot">
                                                                    Timing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            Mode 2
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top"
                                                                    style={{ marginTop: '-10px' }}
                                                                >
                                                                    <SemiCircleProgressBar
                                                                        percentage={Number(parseFloat((cal?.level_light_2 / 90) * 100).toFixed(0)) || 0}
                                                                        showPercentValue
                                                                        strokeWidth={15}
                                                                        diameter={130}
                                                                    />
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    Level lighting
                                                                </div>
                                                            </div>

                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top">
                                                                    <img alt='' src='/dat_icon/clock_1.png' />
                                                                    <div>
                                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_2).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_2).toFixed(1)}</span>
                                                                        <div>
                                                                            min
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot">
                                                                    Timing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            Mode 3
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top"
                                                                    style={{ marginTop: '-10px' }}
                                                                >
                                                                    <SemiCircleProgressBar
                                                                        percentage={Number(parseFloat((cal?.level_light_3 / 90) * 100).toFixed(0)) || 0}
                                                                        showPercentValue
                                                                        strokeWidth={15}
                                                                        diameter={130}
                                                                    />
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    Level lighting
                                                                </div>
                                                            </div>

                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top">
                                                                    <img alt='' src='/dat_icon/clock_1.png' />
                                                                    <div>
                                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_3).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_3).toFixed(1)}</span>
                                                                        <div>
                                                                            min
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot">
                                                                    Timing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            Mode 4
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top"
                                                                    style={{ marginTop: '-10px' }}
                                                                >
                                                                    <SemiCircleProgressBar
                                                                        percentage={Number(parseFloat((cal?.level_light_4 / 90) * 100).toFixed(0)) || 0}
                                                                        showPercentValue
                                                                        strokeWidth={15}
                                                                        diameter={130}
                                                                    />
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    Level lighting
                                                                </div>
                                                            </div>

                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top">
                                                                    <img alt='' src='/dat_icon/clock_1.png' />
                                                                    <div>
                                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_4).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_4).toFixed(1)}</span>
                                                                        <div>
                                                                            min
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot">
                                                                    Timing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row"
                                            style={{ marginTop: '16px' }}
                                        >
                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left">
                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left_Title">
                                                    Output Parameter
                                                </div>

                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left_Content">
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left_Content_Item">
                                                        Switch Voltage
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.switch_volt).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.switch_volt) * 0.01 * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left_Content_Item">
                                                        DC BAT over Dschg Voltage
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.dc_bat_over_dsch_volt).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.dc_bat_over_dsch_volt) * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Left_Content_Item">
                                                        BAT Dschg Voltage Return
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.bat_dsch_volt_return).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.bat_dsch_volt_return) * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right">
                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            Mode 5
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top"
                                                                    style={{ marginTop: '-10px' }}
                                                                >
                                                                    <SemiCircleProgressBar
                                                                        percentage={Number(parseFloat((cal?.level_light_5 / 90) * 100).toFixed(0)) || 0}
                                                                        showPercentValue
                                                                        strokeWidth={15}
                                                                        diameter={130}
                                                                    />
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    Level lighting
                                                                </div>
                                                            </div>

                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Top">
                                                                    <img alt='' src='/dat_icon/clock_1.png' />
                                                                    <div>
                                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_5).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_5).toFixed(1)}</span>
                                                                        <div>
                                                                            min
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot">
                                                                    Timing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            LED Lighting Function
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <div>
                                                                    {(() => {
                                                                        switch (parseFloat(cal?.led_lighting_function).toFixed(0)) {
                                                                            case '0':
                                                                                return <img alt='' src='/dat_icon/light_off.png' />
                                                                            case '1':
                                                                                return <img alt='' src='/dat_icon/light_off.png' />
                                                                            default:
                                                                                return <img alt='' src='/dat_icon/light_off.png' />
                                                                        }
                                                                    })()}
                                                                </div>
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    {(() => {
                                                                        switch (parseFloat(cal?.led_lighting_function).toFixed(0)) {
                                                                            case '0':
                                                                                return <span style={{ color: 'blue', fontSize: '20px' }}>Turn off</span>
                                                                            case '1':
                                                                                return <span style={{ color: 'blue', fontSize: '20px' }}>Turn on</span>
                                                                            default:
                                                                                return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item">
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Title">
                                                            LED Lighting Method
                                                        </div>
                                                        <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content">
                                                            <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item">
                                                                <img alt='' src='/dat_icon/clock_1.png' />
                                                                <div className="DAT_ProjectData_SolarLight_Dashboard_Row_Right_Row_Item_Content_Item_Bot"
                                                                    style={{ marginTop: '0px' }}
                                                                >
                                                                    {(() => {
                                                                        switch (parseFloat(cal?.led_lighting_method).toFixed(0)) {
                                                                            case '0':
                                                                                return <span style={{ color: 'blue', fontSize: '20px' }}>Light Control</span>
                                                                            case '1':
                                                                                return <span style={{ color: 'blue', fontSize: '20px' }}>Time Period Control</span>
                                                                            case '2':
                                                                                return <span style={{ color: 'blue', fontSize: '20px' }}>Time Control</span>
                                                                            default:
                                                                                return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            case 'setting':
                                return (
                                    <div className="DAT_ProjectData_SolarLight_Setting">
                                        <select id='select_sn' className="DAT_ProjectData_SolarLight_Setting_Select" onChange={(e) => handleChangeLogger(e)}>
                                            {slloggerDB.value.map((item, index) => {
                                                return <option key={index} value={item.sn}>{item.name}</option>
                                            })}
                                        </select>

                                        {/* <div className="DAT_ProjectData_SolarLight_Setting_Title">
                                            SETTING PANEL
                                        </div> */}

                                        <div className="DAT_ProjectData_SolarLight_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLight_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Title">
                                                    Street Lamp Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        LED Manual Control
                                                        <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button'
                                                            style={{ marginTop: '8px' }}
                                                            id={'led_manual_control'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                ON
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                OFF
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Sleep Control
                                                        <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button'
                                                            style={{ marginTop: '8px' }}
                                                            id={'sleep_control'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                ON
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                OFF
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        LED Lighting Method
                                                        <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button'
                                                            style={{ marginTop: '8px' }}
                                                            id={'led_lighting_method'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                Light control
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                Time control
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLight_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLight_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Title">
                                                    Setting Mode Operation
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Mode 1
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_1'
                                                                name='level_light_1'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_1}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_1' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Mode 2
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_2'
                                                                name='level_light_2'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_2}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_2' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Mode 3
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_3'
                                                                name='level_light_3'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_3}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_3' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Mode 4
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_4'
                                                                name='level_light_4'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_4}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_4' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Mode 5
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_5'
                                                                name='level_light_5'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_5}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_5' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLight_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLight_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Title">
                                                    Battery Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Number cell battery
                                                        <input id='number_cell_battery' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Battery on Dschg voltage (V)
                                                        <input id='bat_over_dsch_volt' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Over Dschg return voltage (V)
                                                        <input id='over_dsch_return_volt' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Max current PV charge (A)
                                                        <input id='max_current_pv_charge' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Stop charging current (A)
                                                        <input id='stop_charge_current' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Voltage overcharged (V)
                                                        <input id='volt_overcharge' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Over Discharge delay (s)
                                                        <input id='over_dsch_delay' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Undervoltage warning (V)
                                                        <input id='undervolt_warn' placeholder='120.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Voltage overcharged return (V)
                                                        <input id='volt_overcharge_return' placeholder='120.0' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLight_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLight_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Title">
                                                    Output Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Switch Voltage (V)
                                                        <input id='switch_volt' placeholder='280.0' />
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item">
                                                        Priority given BAT or Grid
                                                        <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button'
                                                            style={{ marginTop: '8px' }}
                                                            id={'priority_given'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                BAT priority
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLight_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                Grid priority
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            default:
                                return (
                                    <div className="DAT_ProjectData_SolarLight_Light">
                                        {dashboardMode === 'map'
                                            ? <div id="map" style={{ width: "100%", height: "100%" }}></div>
                                            : <img alt='' src={SLDiagramImg.value} />
                                        }
                                    </div>
                                )
                        }
                    })()}

                    <div className='DAT_ProjectData_SolarLight_Nav'>
                        <span><TbSolarPanel2 size={20} color={viewSL.value === 'dashboard' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'dashboard'} /></span>
                        <span><MdOutlineDashboard size={20} color={viewSL.value === 'monitor' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'monitor'} /></span>
                        <span><MdOutlineSettings size={20} color={viewSL.value === 'setting' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'setting'} /></span>
                    </div>

                    {viewSL.value === 'setting'
                        ?
                        <div className='DAT_ProjectData_SolarLight_Func'>
                            <button onClick={(e) => handleRead(e)}>Read</button>
                            <button onClick={(e) => handleWrite(e)}>Write</button>
                        </div>
                        : <></>
                    }

                    {viewSL.value === 'dashboard'
                        ?
                        <>
                            <div className='DAT_ProjectData_SolarLight_DashboardMode'>
                                {dashboardMode === 'map'
                                    ? <button onClick={() => setDashboardMode('diagram')}>{dataLang.formatMessage({ id: 'diagram' })}</button>
                                    : <button onClick={() => { setDashboardMode('map'); initMap(slProjectData.value.plantname, parseFloat(slProjectData.value.lat), parseFloat(slProjectData.value.long)) }}>{dataLang.formatMessage({ id: 'map' })}</button>
                                }
                            </div>

                            {dashboardMode === 'map'
                                ?
                                <div className='DAT_ProjectData_SolarLight_EditMap'>
                                    {addLightState === true
                                        ? <button onClick={() => { initMap(slProjectData.value.plantname, parseFloat(slProjectData.value.lat), parseFloat(slProjectData.value.long)); setAddLightState(false) }}>{dataLang.formatMessage({ id: 'quit' })}</button>
                                        : <button onClick={() => { handleEditMap(); setAddLightState(true) }}>{dataLang.formatMessage({ id: 'edit' })}</button>
                                    }
                                </div>
                                :
                                <div className='DAT_ProjectData_SolarLight_EditMap'>
                                    <button onClick={() => setEditDiagram(true)}>{dataLang.formatMessage({ id: 'edit' })}</button>
                                </div>
                            }
                        </>
                        : <></>
                    }

                    {editDiagram === true
                        ? <div className='DAT_ExportBG'>
                            <SLEditImage handleClose={handleCloseEditImg} />
                        </div>
                        : <></>
                    }
                </div>
                :
                <div className='DAT_ProjectData_SolarLightMobile'>
                    {(() => {
                        switch (viewSL.value) {
                            case 'monitor':
                                return (
                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard">
                                        <select id='select_sn' className="DAT_ProjectData_SolarLight_Dashboard_Select" onChange={(e) => handleChangeLogger(e)}>
                                            {slloggerDB.value.map((item, index) => {
                                                return <option key={index} value={item.sn}>{item.name}</option>
                                            })}
                                        </select>

                                        {/* <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Title">
                                            GENERAL PARAMETER MONITORING
                                        </div> */}

                                        <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Device Status
                                                        {(() => {
                                                            switch (parseFloat(cal?.device_status).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Processing</span>
                                                                case '1':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Sleep</span>
                                                                case '10':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Charge prepro</span>
                                                                case '11':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Charge</span>
                                                                case '12':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Charge idle</span>
                                                                case '13':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Full</span>
                                                                case '16':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Charge OC</span>
                                                                case '21':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Discharge</span>
                                                                case '22':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Discharge idle</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode Operating
                                                        {(() => {
                                                            switch (parseFloat(cal?.mode_operating).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Model 1</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Model 2</span>
                                                                case '2':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Model 3</span>
                                                                case '3':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Model 4</span>
                                                                case '4':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Model 5</span>
                                                                case '5':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Discharge idle</span>
                                                                case '6':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Discharge Morning</span>
                                                                case '7':
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>Stop</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Priority given BAT or Grid
                                                        {(() => {
                                                            switch (parseFloat(cal?.priority_given).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>BAT Priority</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Grid Priority</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Power Supply Status
                                                        {(() => {
                                                            switch (parseFloat(cal?.power_supply_status).toFixed(0)) {
                                                                case '0':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>PV Power Supply</span>
                                                                case '1':
                                                                    return <span style={{ color: 'blue', fontSize: '20px' }}>Grid Power Supply</span>
                                                                default:
                                                                    return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Cost Saving (VND)
                                                        <span style={{ color: 'blue', fontSize: '20px' }}>{parseFloat((cal?.cost_saving)).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.cost_saving) * 194.3).toFixed(1)}</span>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Ambient Temp (°C)
                                                        <span style={{ color: 'blue', fontSize: '20px' }}>{parseFloat((cal?.ambient_temp)).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.ambient_temp) - 40).toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item"
                                                style={{ padding: '0px 8px' }}
                                            >
                                                <SLGraph state={slProjectData.value.state} />
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item">
                                                {/* <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Title">
                                                    Light mode and Operation time
                                                </div> */}
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode 1
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <span style={{ color: 'blue' }}>{parseFloat(cal?.level_light_1).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.level_light_1 / 90) * 100).toFixed(1)}</span> */}
                                                                <SemiCircleProgressBar
                                                                    percentage={Number(parseFloat((cal?.level_light_1 / 90) * 100).toFixed(0)) || 0}
                                                                    showPercentValue
                                                                    strokeWidth={15}
                                                                    diameter={110}
                                                                />
                                                                <div style={{ fontSize: '12px' }}>Level lighting</div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img alt='' src='/dat_icon/clock_1.png' style={{ width: '30px', height: '30px' }} />
                                                                <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_1).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_1).toFixed(1)}</span>
                                                                <div style={{ fontSize: '12px' }}>(min)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode 2
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <span style={{ color: 'blue' }}>{parseFloat(cal?.level_light_2).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.level_light_2 / 90) * 100).toFixed(1)}</span> */}
                                                                <SemiCircleProgressBar
                                                                    percentage={Number(parseFloat((cal?.level_light_2 / 90) * 100).toFixed(0)) || 0}
                                                                    showPercentValue
                                                                    strokeWidth={15}
                                                                    diameter={110}
                                                                />
                                                                <div style={{ fontSize: '12px' }}>Level lighting</div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img alt='' src='/dat_icon/clock_1.png' style={{ width: '30px', height: '30px' }} />
                                                                <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_2).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_2).toFixed(1)}</span>
                                                                <div style={{ fontSize: '12px' }}>(min)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode 3
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <span style={{ color: 'blue' }}>{parseFloat(cal?.level_light_3).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.level_light_3 / 90) * 100).toFixed(1)}</span> */}
                                                                <SemiCircleProgressBar
                                                                    percentage={Number(parseFloat((cal?.level_light_3 / 90) * 100).toFixed(0)) || 0}
                                                                    showPercentValue
                                                                    strokeWidth={15}
                                                                    diameter={110}
                                                                />
                                                                <div style={{ fontSize: '12px' }}>Level lighting</div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img alt='' src='/dat_icon/clock_1.png' style={{ width: '30px', height: '30px' }} />
                                                                <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_3).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_3).toFixed(1)}</span>
                                                                <div style={{ fontSize: '12px' }}>(min)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode 4
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <span style={{ color: 'blue' }}>{parseFloat(cal?.level_light_4).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.level_light_4 / 90) * 100).toFixed(1)}</span> */}
                                                                <SemiCircleProgressBar
                                                                    percentage={Number(parseFloat((cal?.level_light_4 / 90) * 100).toFixed(0)) || 0}
                                                                    showPercentValue
                                                                    strokeWidth={15}
                                                                    diameter={110}
                                                                />
                                                                <div style={{ fontSize: '12px' }}>Level lighting</div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img alt='' src='/dat_icon/clock_1.png' style={{ width: '30px', height: '30px' }} />
                                                                <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_4).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_4).toFixed(1)}</span>
                                                                <div style={{ fontSize: '12px' }}>(min)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Mode 5
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <span style={{ color: 'blue' }}>{parseFloat(cal?.level_light_5).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.level_light_5 / 90) * 100).toFixed(1)}</span> */}
                                                                <SemiCircleProgressBar
                                                                    percentage={Number(parseFloat((cal?.level_light_5 / 90) * 100).toFixed(0)) || 0}
                                                                    showPercentValue
                                                                    strokeWidth={15}
                                                                    diameter={110}
                                                                />
                                                                <div style={{ fontSize: '12px' }}>Level lighting</div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img alt='' src='/dat_icon/clock_1.png' style={{ width: '30px', height: '30px' }} />
                                                                <span style={{ color: 'blue' }}>{parseFloat(cal?.timing_light_5).toFixed(1) === 'NaN' ? '--' : parseFloat(cal?.timing_light_5).toFixed(1)}</span>
                                                                <div style={{ fontSize: '12px' }}>(min)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div>LED Lighting Function</div>
                                                            {(() => {
                                                                switch (parseFloat(cal?.led_lighting_function).toFixed(0)) {
                                                                    case '0':
                                                                        return <span style={{ color: 'blue', fontSize: '20px' }}>Turn off function</span>
                                                                    case '1':
                                                                        return <span style={{ color: 'blue', fontSize: '20px' }}>Turn on function</span>
                                                                    default:
                                                                        return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                                }
                                                            })()}
                                                        </div>

                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div>LED Lighting Method</div>
                                                            {(() => {
                                                                switch (parseFloat(cal?.led_lighting_method).toFixed(0)) {
                                                                    case '0':
                                                                        return <span style={{ color: 'blue', fontSize: '20px' }}>Light Control</span>
                                                                    case '1':
                                                                        return <span style={{ color: 'blue', fontSize: '20px' }}>Time Period Control</span>
                                                                    case '2':
                                                                        return <span style={{ color: 'blue', fontSize: '20px' }}>Time Control</span>
                                                                    default:
                                                                        return <span style={{ color: 'red', fontSize: '20px' }}>UNVALID</span>
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Title">
                                                    Output Parameter
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        Switch Voltage
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.switch_volt).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.switch_volt) * 0.01 * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        DC BAT over Dschg Voltage
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.dc_bat_over_dsch_volt).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.dc_bat_over_dsch_volt) * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Dashboard_Row_Item_Row_Item">
                                                        BAT Dschg Voltage Return
                                                        <span style={{ color: 'blue' }}>{parseFloat(cal?.bat_dsch_volt_return).toFixed(1) === 'NaN' ? '--' : parseFloat((cal?.bat_dsch_volt_return) * 4).toFixed(1)} <span style={{ fontSize: '14px' }}>(V)</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            case 'setting':
                                return (
                                    <div className="DAT_ProjectData_SolarLightMobile_Setting">
                                        <select id='select_sn' className="DAT_ProjectData_SolarLight_Setting_Select" onChange={(e) => handleChangeLogger(e)}>
                                            {slloggerDB.value.map((item, index) => {
                                                return <option key={index} value={item.sn}>{item.name}</option>
                                            })}
                                        </select>

                                        {/* <div className="DAT_ProjectData_SolarLightMobile_Setting_Title">
                                            SETTING PANEL
                                        </div> */}

                                        <div className="DAT_ProjectData_SolarLightMobile_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Title">
                                                    Street Lamp Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item"
                                                        style={{ gap: '8px' }}
                                                    >
                                                        LED Manual Control
                                                        <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button'
                                                            id={'led_manual_control'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                ON
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                OFF
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item"
                                                        style={{ gap: '8px' }}
                                                    >
                                                        Sleep Control
                                                        <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button'
                                                            id={'sleep_control'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                ON
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                OFF
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item"
                                                        style={{ gap: '8px' }}
                                                    >
                                                        LED Lighting Method
                                                        <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button'
                                                            id={'led_lighting_method'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                Light control
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                Time control
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Title">
                                                    Setting Mode Operation
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Mode 1
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_1'
                                                                name='level_light_1'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_1}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_1' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Mode 2
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_2'
                                                                name='level_light_2'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_2}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_2' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Mode 3
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_3'
                                                                name='level_light_3'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_3}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_3' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Mode 4
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_4'
                                                                name='level_light_4'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_4}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_4' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Mode 5
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <div style={{ color: 'blue', fontSize: '14px' }}>Level lighting (%)</div>
                                                            <Slider
                                                                id='level_light_5'
                                                                name='level_light_5'
                                                                onChange={(e) => handleSlide(e)}
                                                                style={{ height: '10px' }}
                                                                aria-label="Always visible"
                                                                valueLabelDisplay="auto"
                                                                value={level_light_5}
                                                                step={10}
                                                                min={0}
                                                                max={100}
                                                                marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                                                                track="normal"
                                                                size="medium"
                                                            />
                                                            <div
                                                                style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                                                            >
                                                                <span>Timing set (min):</span>
                                                                <input id='timing_light_5' placeholder='120.0' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Title">
                                                    Battery Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Number cell battery
                                                        <input id='number_cell_battery' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Battery on Dschg voltage (V)
                                                        <input id='bat_over_dsch_volt' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Over Dschg return voltage (V)
                                                        <input id='over_dsch_return_volt' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Max current PV charge (A)
                                                        <input id='max_current_pv_charge' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Stop charging current (A)
                                                        <input id='stop_charge_current' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Voltage overcharged (V)
                                                        <input id='volt_overcharge' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Over Discharge delay (s)
                                                        <input id='over_dsch_delay' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Undervoltage warning (V)
                                                        <input id='undervolt_warn' placeholder='120.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Voltage overcharged return (V)
                                                        <input id='volt_overcharge_return' placeholder='120.0' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="DAT_ProjectData_SolarLightMobile_Setting_Row">
                                            <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item">
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Title">
                                                    Output Parameter Setting Area
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item">
                                                        Switch Voltage (V)
                                                        <input id='switch_volt' placeholder='280.0' />
                                                    </div>
                                                </div>
                                                <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row">
                                                    <div className="DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item"
                                                        style={{ gap: '8px' }}
                                                    >
                                                        Priority given BAT or Grid
                                                        <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button'
                                                            id={'priority_given'}
                                                            onClick={(e) => handleSwitch(e)}
                                                        >
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }}
                                                            >
                                                                BAT priority
                                                            </div>
                                                            <div className='DAT_ProjectData_SolarLightMobile_Setting_Row_Item_Row_Item_Button_Item'
                                                                style={{ width: '100px', borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                                                            >
                                                                Grid priority
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            default:
                                return (
                                    <div className="DAT_ProjectData_SolarLightMobile_Light">
                                        {dashboardMode === 'map'
                                            ? <div id="map" style={{ width: "100%", height: "100%" }}></div>
                                            : <img alt='' src={SLDiagramImg.value} />
                                        }
                                    </div>
                                )
                        }
                    })()}

                    <div className='DAT_ProjectData_SolarLightMobile_Nav'>
                        <span><TbSolarPanel2 size={20} color={viewSL.value === 'dashboard' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'dashboard'} /></span>
                        <span><MdOutlineDashboard size={20} color={viewSL.value === 'monitor' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'monitor'} /></span>
                        <span><MdOutlineSettings size={20} color={viewSL.value === 'setting' ? 'blue' : 'grey'} onClick={() => viewSL.value = 'setting'} /></span>
                    </div>

                    {viewSL.value === 'setting'
                        ?
                        <div className='DAT_ProjectData_SolarLightMobile_Func'>
                            <button onClick={(e) => handleRead(e)}>Read</button>
                            <button onClick={(e) => handleWrite(e)}>Write</button>
                        </div>
                        : <></>
                    }

                    {viewSL.value === 'dashboard'
                        ?
                        <>
                            <div className='DAT_ProjectData_SolarLight_DashboardMode'>
                                {dashboardMode === 'map'
                                    ? <button onClick={() => setDashboardMode('diagram')}>{dataLang.formatMessage({ id: 'diagram' })}</button>
                                    : <button onClick={() => { setDashboardMode('map'); initMap(slProjectData.value.plantname, parseFloat(slProjectData.value.lat), parseFloat(slProjectData.value.long)) }}>{dataLang.formatMessage({ id: 'map' })}</button>
                                }
                            </div>

                            {dashboardMode === 'map'
                                ?
                                <div className='DAT_ProjectData_SolarLight_EditMap'>
                                    {addLightState === true
                                        ? <button onClick={() => { initMap(slProjectData.value.plantname, parseFloat(slProjectData.value.lat), parseFloat(slProjectData.value.long)); setAddLightState(false) }}>{dataLang.formatMessage({ id: 'quit' })}</button>
                                        : <button onClick={() => { handleEditMap(); setAddLightState(true) }}>{dataLang.formatMessage({ id: 'edit' })}</button>
                                    }
                                </div>
                                :
                                <div className='DAT_ProjectData_SolarLight_EditMap'>
                                    <button onClick={() => setEditDiagram(true)}>{dataLang.formatMessage({ id: 'edit' })}</button>
                                </div>
                            }
                        </>
                        : <></>
                    }

                    {editDiagram === true
                        ? <div className='DAT_ExportBG'>
                            <SLEditImage handleClose={handleCloseEditImg} />
                        </div>
                        : <></>
                    }
                </div>
            }
        </>
    );
}
