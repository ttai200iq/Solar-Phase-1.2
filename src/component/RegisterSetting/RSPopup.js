import React, { useEffect, useRef, useState } from 'react';
import './RegisterSetting.scss';

import { useIntl } from 'react-intl';
import { IoClose } from 'react-icons/io5';
import { COLOR } from '../../App';
import { inverterListRS, loggerListRS, registerID, tabRS } from './RegisterSetting';
import { alertDispatch } from '../Alert/Alert';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';

export default function RSPopup(props) {
    const dataLang = useIntl();
    const typeName = useRef();
    const key = useRef();
    const child_key = useRef();
    const register = useRef();
    const scale = useRef();
    // const note = useRef();
    const [dataType, setDataType] = useState('normal');
    const [type_, setType_] = useState('real');
    const [key_, setKey_] = useState('');
    const [child_key_, setChild_key_] = useState('');

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        switch (props.type) {
            case 'addType':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp === undefined) {
                        const d = await callApi("post", host.DATA + "/addLoggertemplateType", {
                            data: {},
                            setting: {},
                            type: typeName.current.value,
                            brand: registerID.value,
                            version_: '0.1',
                        });
                        console.log(d);
                        // const data = {
                        //     id_: loggerListRS.value.length + 1,
                        //     data_: {},
                        //     setting: {},
                        //     type_: typeName.current.value,
                        //     brand_: registerID.value,
                        //     version_: '0.1',
                        // };
                        // const newData = [...loggerListRS.value, data];
                        // loggerListRS.value = newData;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp === undefined) {
                        const d = await callApi("post", host.DATA + "/addInvertertemplateType", {
                            data: {},
                            setting: {},
                            type: typeName.current.value,
                            brand: registerID.value,
                        });
                        console.log(d);
                        // const data = {
                        //     id_: inverterListRS.value.length + 1,
                        //     data_: {},
                        //     setting: {},
                        //     type_: typeName.current.value,
                        //     brand_: registerID.value,
                        // };
                        // const newData = [...inverterListRS.value, data];
                        // inverterListRS.value = newData;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                }
                break;
            case 'changeName':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type);
                    let temp_ = loggerListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp_ === undefined) {
                        const d = await callApi("post", host.DATA + "/updateLoggertemplateType", {
                            type: temp.type_,
                            newtype: typeName.current.value,
                        });
                        console.log(d);
                        // temp.type_ = typeName.current.value;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type);
                    let temp_ = inverterListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp_ === undefined) {
                        const d = await callApi("post", host.DATA + "/updateInvertertemplateType", {
                            type: temp.type_,
                            newtype: typeName.current.value,
                        });
                        console.log(d);
                        // temp.type_ = typeName.current.value;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                }
                break;
            case 'deleteType':
                if (tabRS.value === 'logger') {
                    const d = await callApi("post", host.DATA + "/removeLoggertemplateType", {
                        type: props.info.type,
                    });
                    console.log(d);
                    // let temp = loggerListRS.value.filter(item => item.type_ !== props.info.type);
                    // loggerListRS.value = temp;
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                    props.handleClose();
                } else {
                    const d = await callApi("post", host.DATA + "/removeInvertertemplateType", {
                        type: props.info.type,
                    });
                    console.log(d);
                    // let temp = inverterListRS.value.filter(item => item.type_ !== props.info.type);
                    // inverterListRS.value = temp;
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                    props.handleClose();
                }
                break;
            case 'addTemplate':
                if (tabRS.value === 'logger') {
                    // logger
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        let keyList = Object.entries(temp.data_).map(([key, value]) => key);
                        if (dataType === 'object') {
                            if (keyList.includes(key.current.value)) {
                                let keyList_ = Object.entries(temp.data_[key.current.value]).map(([key, value]) => key);
                                if (keyList_.includes(child_key.current.value)) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.data_[key.current.value], [child_key.current.value]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                                    const newData_ = { ...temp.data_, [key.current.value]: data };
                                    // temp.data_ = newData_;
                                    const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                        type: props.info.type_,
                                        data: newData_,
                                    });
                                    console.log(d);
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.data_, [key.current.value]: { [child_key.current.value]: { register: register.current.value, cal: scale.current.value, type: type_ } } };
                                // temp.data_ = newData;
                                const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                    type: props.info.type_,
                                    data: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                const newData = { ...temp.data_, [key.current.value]: { cal: scale.current.value, type: type_, register: register.current.value, } };
                                // temp.data_ = newData;
                                const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                    type: props.info.type_,
                                    data: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    } else {
                        // setting
                        let keyList = Object.entries(temp.setting).map(([key, value]) => key);
                        if (dataType === 'object') {
                            if (keyList.includes(key.current.value)) {
                                let keyList_ = Object.entries(temp.setting[key.current.value]).map(([key, value]) => key);
                                if (keyList_.includes(child_key.current.value)) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.setting[key.current.value], [child_key.current.value]: register.current.value };
                                    const newData_ = { ...temp.setting, [key.current.value]: data };
                                    // temp.setting = newData_;
                                    const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                        type: props.info.type_,
                                        setting: newData_,
                                    });
                                    console.log(d);
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.setting, [key.current.value]: { [child_key.current.value]: register.current.value } };
                                // temp.setting = newData;
                                const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                    type: props.info.type_,
                                    setting: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                const newData = { ...temp.setting, [key.current.value]: register.current.value };
                                // temp.setting = newData;
                                const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                    type: props.info.type_,
                                    setting: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    }
                } else {
                    // inverter
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        let keyList = Object.entries(temp.data_).map(([key, value]) => key);
                        if (dataType === 'object') {
                            if (keyList.includes(key.current.value)) {
                                let keyList_ = Object.entries(temp.data_[key.current.value]).map(([key, value]) => key);
                                if (keyList_.includes(child_key.current.value)) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.data_[key.current.value], [child_key.current.value]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                                    const newData_ = { ...temp.data_, [key.current.value]: data };
                                    // temp.data_ = newData_;
                                    const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                        type: props.info.type_,
                                        data: newData_,
                                    });
                                    console.log(d);
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.data_, [key.current.value]: { [child_key.current.value]: { register: register.current.value, cal: scale.current.value, type: type_ } } };
                                // temp.data_ = newData;
                                const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                    type: props.info.type_,
                                    data: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                const newData = { ...temp.data_, [key.current.value]: { cal: scale.current.value, type: type_, register: register.current.value, } };
                                // temp.data_ = newData;
                                const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                    type: props.info.type_,
                                    data: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    } else {
                        // setting
                        let keyList = Object.entries(temp.setting).map(([key, value]) => key);
                        if (dataType === 'object') {
                            if (keyList.includes(key.current.value)) {
                                let keyList_ = Object.entries(temp.setting[key.current.value]).map(([key, value]) => key);
                                if (keyList_.includes(child_key.current.value)) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.setting[key.current.value], [child_key.current.value]: { cal: scale.current.value, type: type_, register: register.current.value } };
                                    const newData_ = { ...temp.setting, [key.current.value]: data };
                                    // temp.setting = newData_;
                                    const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                        type: props.info.type_,
                                        setting: newData_,
                                    });
                                    console.log(d);
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.setting, [key.current.value]: { [child_key.current.value]: { cal: scale.current.value, type: type_, register: register.current.value } } };
                                // temp.setting = newData;
                                const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                    type: props.info.type_,
                                    setting: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                const newData = { ...temp.setting, [key.current.value]: { cal: scale.current.value, type: type_, register: register.current.value } };
                                // temp.setting = newData;
                                const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                    type: props.info.type_,
                                    setting: newData,
                                });
                                console.log(d);
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    }
                }
                break;
            case 'editTemplate':
                if (tabRS.value === 'logger') {
                    // logger
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                            const newData = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.data_[id[0]] = newData;
                            const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            const newData = { ...temp.data_, [props.info.key]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.data_ = newData;
                            const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        //setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                            const newData = { ...temp.setting[id[0]], [id[1]]: register.current.value };
                            temp.setting[id[0]] = newData;
                            const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            const newData_ = { ...temp.setting, [props.info.key]: register.current.value };
                            temp.setting = newData_;
                            const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    }
                } else {
                    // inverter
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                            const newData = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.data_[id[0]] = newData;
                            const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            const newData = { ...temp.data_, [props.info.key]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.data_ = newData;
                            const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        //setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                            const newData = { ...temp.setting[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.setting[id[0]] = newData;
                            const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            const newData_ = { ...temp.setting, [props.info.key]: { register: register.current.value, cal: scale.current.value, type: type_ } };
                            temp.setting = newData_;
                            const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);

                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    }
                }
                break;
            case 'deleteTemplate':
                if (tabRS.value === 'logger') {
                    // logger
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                            if (Object.entries(temp.data_[id[0]]).length === 0) {
                                temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== id[0]));
                            }
                            const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            const d = await callApi("post", host.DATA + "/addLoggertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        // setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                            if (Object.entries(temp.setting[id[0]]).length === 0) {
                                temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== id[0]));
                            }
                            const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            const d = await callApi("post", host.DATA + "/addLoggertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    }
                } else {
                    // inverter
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                            if (Object.entries(temp.data_[id[0]]).length === 0) {
                                temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== id[0]));
                            }
                            const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            const d = await callApi("post", host.DATA + "/addInvertertemplateData", {
                                type: props.info.type_,
                                data: temp.data_,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        // setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                            if (Object.entries(temp.setting[id[0]]).length === 0) {
                                temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== id[0]));
                            }
                            const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            const d = await callApi("post", host.DATA + "/addInvertertemplateSetting", {
                                type: props.info.type_,
                                setting: temp.setting,
                            });
                            console.log(d);
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    }
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (props.type === 'editTemplate') {
            if (props.info.key.includes('(', ')')) {
                setDataType('object');
                let id = props.info.key.split(/[()]/);
                setKey_(id[0]);
                setChild_key_(id[1]);
            } else {
                setDataType('normal');
                setKey_(props.info.key);
            }
        }
    }, [props]);

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                props.handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <form className="DAT_RSPopup" onSubmit={(e) => handleConfirm(e)}>
            <div className="DAT_RSPopup_Head">
                <div className="DAT_RSPopup_Head_Left">
                    {(() => {
                        switch (props.type) {
                            case 'addType':
                                return <span>{dataLang.formatMessage({ id: "add" })}</span>;
                            case 'changeName':
                                return <span>{dataLang.formatMessage({ id: "edit" })}</span>
                            case 'deleteType':
                                return <span>{dataLang.formatMessage({ id: "delete" })}</span>
                            case 'addTemplate':
                                return <span>{dataLang.formatMessage({ id: "add" })}</span>;
                            case 'editTemplate':
                                return <span>{dataLang.formatMessage({ id: "edit" })}</span>
                            case 'deleteTemplate':
                                return <span>{dataLang.formatMessage({ id: "delete" })}</span>
                            default:
                                return <></>;
                        }
                    })()}
                </div>

                <div className="DAT_RSPopup_Head_Right">
                    <div className="DAT_RSPopup_Head_Right_Icon"
                        id="Popup"
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")}
                        onClick={() => props.handleClose()}
                    >
                        <IoClose size={25} />
                    </div>
                </div>
            </div>

            <div className="DAT_RSPopup_Body">
                {(() => {
                    switch (props.type) {
                        case 'addType':
                            return <div className='DAT_RSPopup_Body_Info'>
                                <label>{dataLang.formatMessage({ id: 'name' })}</label>
                                <input type="text" ref={typeName} required />
                            </div>;
                        case 'changeName':
                            return <div className='DAT_RSPopup_Body_Info'>
                                <label>{dataLang.formatMessage({ id: 'name' })}</label>
                                <input type="text" defaultValue={props.info.type === 'undefined' ? '' : props.info.type} ref={typeName} required />
                            </div>
                        case 'deleteType':
                            return <span>{dataLang.formatMessage({ id: 'delTypemess' })} &nbsp;
                                <span style={{ fontFamily: 'segoeuib' }}>{props.info.type}</span>
                            </span>;
                        case 'addTemplate':
                            return <div className='DAT_RSPopup_Body_Info'>
                                <label>data type</label>
                                <select onChange={(e) => setDataType(e.target.value)}>
                                    <option value='normal'>single</option>
                                    <option value='object'>multiple</option>
                                </select>

                                {(() => {
                                    switch (dataType) {
                                        case 'object':
                                            return <>
                                                <label>key</label>
                                                <input type="text" ref={key} />

                                                <label>child key</label>
                                                <input type="text" ref={child_key} />
                                            </>;
                                        default:
                                            return <>
                                                <label>key</label>
                                                <input type="text" ref={key} />
                                            </>;
                                    }
                                })()}

                                <label>register</label>
                                <textarea type="text" ref={register} />

                                <label>scale</label>
                                <input type="text" ref={scale} />

                                <label>type</label>
                                {/* <input type="text" ref={type} /> */}
                                <select onChange={(e) => setType_(e.target.value)}>
                                    <option value='real'>real</option>
                                    <option value='word'>word</option>
                                    <option value='sum'>sum</option>
                                    <option value='bit'>bit</option>
                                    <option value='concat'>concat</option>
                                </select>

                                {/* <label>note</label>
                                <input type="text" ref={note} /> */}
                            </div>;
                        case 'editTemplate':
                            return <div className='DAT_RSPopup_Body_Info'>
                                {(() => {
                                    switch (dataType) {
                                        case 'object':
                                            return <>
                                                <label>key</label>
                                                <input type="text" defaultValue={key_} disabled />

                                                <label>child key</label>
                                                <input type="text" defaultValue={child_key_} disabled />
                                            </>;
                                        default:
                                            return <>
                                                <label>key</label>
                                                <input type="text" defaultValue={key_} disabled />
                                            </>;
                                    }
                                })()}

                                <label>register</label>
                                <textarea type="text" defaultValue={props.info.register === 'undefined' ? '' : props.info.register} ref={register} />

                                <label>scale</label>
                                <input type="text" defaultValue={props.info.scale === 'undefined' ? '' : props.info.scale} ref={scale} />

                                <label>type</label>
                                {/* <input type="text" defaultValue={props.info.type === 'undefined' ? '' : props.info.type} ref={type} /> */}
                                <select defaultValue={props.info.type} onChange={(e) => setType_(e.target.value)}>
                                    <option value='real'>real</option>
                                    <option value='word'>word</option>
                                    <option value='sum'>sum</option>
                                    <option value='bit'>bit</option>
                                    <option value='concat'>concat</option>
                                </select>

                                {/* <label>note</label>
                                <input type="text" ref={note} /> */}
                            </div>;
                        case 'deleteTemplate':
                            return <span>{dataLang.formatMessage({ id: 'delTemplatemess' })} &nbsp;
                                <span style={{ fontFamily: 'segoeuib' }}>{props.info.key}</span>
                            </span>
                        default:
                            return <></>;
                    }
                })()}
            </div>

            <div className="DAT_RSPopup_Foot">
                <button style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}>
                    {dataLang.formatMessage({ id: "confirm" })}
                </button>
            </div>
        </form>
    );
}
