import React, { useEffect, useRef } from 'react';
import './RegisterSetting.scss';

import { useIntl } from 'react-intl';
import { IoClose } from 'react-icons/io5';
import { COLOR } from '../../App';
import { inverterListRS, loggerListRS, registerID, tabRS } from './RegisterSetting';
import { alertDispatch } from '../Alert/Alert';

export default function RSPopup(props) {
    const dataLang = useIntl();
    const typeName = useRef();
    const key = useRef();
    const register = useRef();
    const scale = useRef();
    const type = useRef();
    const note = useRef();

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

    const handleConfirm = (e) => {
        e.preventDefault();
        switch (props.type) {
            case 'addType':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp === undefined) {
                        const data = {
                            id_: loggerListRS.value.length + 1,
                            data_: {},
                            setting: {},
                            type_: typeName.current.value,
                            brand_: registerID.value,
                            version_: '0.1',
                        };
                        const newData = [...loggerListRS.value, data];
                        loggerListRS.value = newData;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp === undefined) {
                        const data = {
                            id_: inverterListRS.value.length + 1,
                            data_: {},
                            setting: {},
                            type_: typeName.current.value,
                            brand_: registerID.value,
                        };
                        const newData = [...inverterListRS.value, data];
                        inverterListRS.value = newData;
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
                        temp.type_ = typeName.current.value;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type);
                    let temp_ = inverterListRS.value.find(item => item.type_ === typeName.current.value);
                    if (temp_ === undefined) {
                        temp.type_ = typeName.current.value;
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                        props.handleClose();
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                    }
                }
                break;
            case 'deleteType':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.filter(item => item.type_ !== props.info.type);
                    loggerListRS.value = temp;
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                    props.handleClose();
                } else {
                    let temp = inverterListRS.value.filter(item => item.type_ !== props.info.type);
                    inverterListRS.value = temp;
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
                        if (keyList.includes(key.current.value)) {
                            alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                        } else if (key.current.value.includes('(', ')')) {
                            let id = key.current.value.split(/[()]/);
                            if (keyList.includes(id[0])) {
                                let keyList_ = Object.entries(temp.data_[id[0]]).map(([key, value]) => key);
                                if (keyList_.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    const newData_ = { ...temp.data_, [id[0]]: data };
                                    temp.data_ = newData_;
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.data_, [id[0]]: { [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } } };
                                temp.data_ = newData;
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            const newData = { ...temp.data_, [key.current.value]: { cal: scale.current.value, type: type.current.value, register: register.current.value, } };
                            temp.data_ = newData;
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        // setting
                        let keyList = Object.entries(temp.setting).map(([key, value]) => key);
                        if (keyList.includes(key.current.value)) {
                            alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                        } else if (key.current.value.includes('(', ')')) {
                            let id = key.current.value.split(/[()]/);
                            if (keyList.includes(id[0])) {
                                let keyList_ = Object.entries(temp.setting[id[0]]).map(([key, value]) => key);
                                if (keyList_.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.setting[id[0]], [id[1]]: register.current.value };
                                    const newData_ = { ...temp.setting, [id[0]]: data };
                                    temp.setting = newData_;
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.setting, [id[0]]: { [id[1]]: register.current.value } };
                                temp.setting = newData;
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            const newData = { ...temp.setting, [key.current.value]: register.current.value };
                            temp.setting = newData;
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    }
                } else {
                    // inverter
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type_);
                    if (props.info.templateType === 'data') {
                        // data
                        let keyList = Object.entries(temp.data_).map(([key, value]) => key);
                        if (keyList.includes(key.current.value)) {
                            alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                        } else if (key.current.value.includes('(', ')')) {
                            let id = key.current.value.split(/[()]/);
                            if (keyList.includes(id[0])) {
                                let keyList_ = Object.entries(temp.data_[id[0]]).map(([key, value]) => key);
                                if (keyList_.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    const newData_ = { ...temp.data_, [id[0]]: data };
                                    temp.data_ = newData_;
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.data_, [id[0]]: { [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } } };
                                temp.data_ = newData;
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            const newData = { ...temp.data_, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                            temp.data_ = newData;
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        }
                    } else {
                        // setting
                        let keyList = Object.entries(temp.setting).map(([key, value]) => key);
                        if (keyList.includes(key.current.value)) {
                            alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                        } else if (key.current.value.includes('(', ')')) {
                            let id = key.current.value.split(/[()]/);
                            if (keyList.includes(id[0])) {
                                let keyList_ = Object.entries(temp.setting[id[0]]).map(([key, value]) => key);
                                if (keyList_.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    const data = { ...temp.setting[id[0]], [id[1]]: { cal: scale.current.value, type: type.current.value, register: register.current.value, } };
                                    const newData_ = { ...temp.setting, [id[0]]: data };
                                    temp.setting = newData_;
                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                const newData = { ...temp.setting, [id[0]]: { [id[1]]: { cal: scale.current.value, type: type.current.value, register: register.current.value, } } };
                                temp.setting = newData;
                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        } else {
                            const newData = { ...temp.setting, [key.current.value]: { cal: scale.current.value, type: type.current.value, register: register.current.value, } };
                            temp.setting = newData;
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
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
                            let keyList = (Object.entries(temp.data_).map(([key, value]) => key)).filter(item => item !== id[0]);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                if (key.current.value.includes('(', ')')) {
                                    let id_ = key.current.value.split(/[()]/);
                                    let keyListObj = (Object.entries(temp.data_[id_[0]]).map(([key, value]) => key)).filter(item => item !== id[1]);
                                    if (keyListObj.includes(id_[1])) {
                                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                    } else {
                                        temp.data_[id_[0]] = Object.fromEntries(Object.entries(temp.data_[id_[0]]).filter(([key, value]) => key !== id[1]));
                                        const newData = { ...temp.data_[id_[0]], [id_[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                        temp.data_[id_[0]] = newData;

                                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                        props.handleClose();
                                    }
                                } else {
                                    temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                                    const newData = { ...temp.data_, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.data_ = newData;
                                    temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                                    if (Object.entries(temp.data_[id[0]]).length === 0) {
                                        temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== id[0]));
                                    }

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            }
                        } else {
                            let keyList = (Object.entries(temp.data_).map(([key, value]) => key)).filter(item => item !== props.info.key);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else if (key.current.value.includes('(', ')')) {
                                let id = key.current.value.split(/[()]/);
                                let keyListObj = (Object.entries(temp.data_[id[0]]).map(([key, value]) => key));
                                if (keyListObj.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                                    const newData = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.data_[id[0]] = newData;
                                    temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                                const newData = { ...temp.data_, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                temp.data_ = newData;

                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    } else {
                        //setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            let keyList = (Object.entries(temp.setting).map(([key, value]) => key)).filter(item => item !== id[0]);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                if (key.current.value.includes('(', ')')) {
                                    let id_ = key.current.value.split(/[()]/);
                                    let keyListObj = (Object.entries(temp.setting[id_[0]]).map(([key, value]) => key)).filter(item => item !== id[1]);
                                    if (keyListObj.includes(id_[1])) {
                                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                    } else {
                                        temp.setting[id_[0]] = Object.fromEntries(Object.entries(temp.setting[id_[0]]).filter(([key, value]) => key !== id[1]));
                                        const newData = { ...temp.setting[id_[0]], [id_[1]]: register.current.value };
                                        temp.setting[id_[0]] = newData;

                                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                        props.handleClose();
                                    }
                                } else {
                                    temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                                    const newData = { ...temp.setting, [key.current.value]: register.current.value };
                                    temp.setting = newData;
                                    temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                                    if (Object.entries(temp.setting[id[0]]).length === 0) {
                                        temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== id[0]));
                                    }

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            }
                        } else {
                            let keyList = Object.entries(temp.setting).map(([key, value]) => key).filter(item => item !== props.info.key);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else if (key.current.value.includes('(', ')')) {
                                let id = key.current.value.split(/[()]/);
                                let keyListObj = Object.entries(temp.setting[id[0]]).map(([key, value]) => key);
                                if (keyListObj.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                                    const newData__ = { ...temp.setting[id[0]], [id[1]]: register.current.value };
                                    temp.setting[id[0]] = newData__;
                                    temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                                const newData_ = { ...temp.setting, [key.current.value]: register.current.value };
                                temp.setting = newData_;

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
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            let keyList = (Object.entries(temp.data_).map(([key, value]) => key)).filter(item => item !== id[0]);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                if (key.current.value.includes('(', ')')) {
                                    let id_ = key.current.value.split(/[()]/);
                                    let keyListObj = (Object.entries(temp.data_[id_[0]]).map(([key, value]) => key)).filter(item => item !== id[1]);
                                    if (keyListObj.includes(id_[1])) {
                                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                    } else {
                                        temp.data_[id_[0]] = Object.fromEntries(Object.entries(temp.data_[id_[0]]).filter(([key, value]) => key !== id[1]));
                                        const newData = { ...temp.data_[id_[0]], [id_[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                        temp.data_[id_[0]] = newData;

                                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                        props.handleClose();
                                    }
                                } else {
                                    temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                                    const newData = { ...temp.data_, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.data_ = newData;
                                    temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                                    if (Object.entries(temp.data_[id[0]]).length === 0) {
                                        temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== id[0]));
                                    }

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            }
                        } else {
                            let keyList = (Object.entries(temp.data_).map(([key, value]) => key)).filter(item => item !== props.info.key);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else if (key.current.value.includes('(', ')')) {
                                let id = key.current.value.split(/[()]/);
                                let keyListObj = (Object.entries(temp.data_[id[0]]).map(([key, value]) => key));
                                if (keyListObj.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                                    const newData = { ...temp.data_[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.data_[id[0]] = newData;
                                    temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                                const newData = { ...temp.data_, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                temp.data_ = newData;

                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
                        }
                    } else {
                        //setting
                        if (props.info.key.includes('(', ')')) {
                            let id = props.info.key.split(/[()]/);
                            let keyList = (Object.entries(temp.setting).map(([key, value]) => key)).filter(item => item !== id[0]);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else {
                                if (key.current.value.includes('(', ')')) {
                                    let id_ = key.current.value.split(/[()]/);
                                    let keyListObj = (Object.entries(temp.setting[id_[0]]).map(([key, value]) => key)).filter(item => item !== id[1]);
                                    if (keyListObj.includes(id_[1])) {
                                        alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                    } else {
                                        temp.setting[id_[0]] = Object.fromEntries(Object.entries(temp.setting[id_[0]]).filter(([key, value]) => key !== id[1]));
                                        const newData = { ...temp.setting[id_[0]], [id_[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                        temp.setting[id_[0]] = newData;

                                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                        props.handleClose();
                                    }
                                } else {
                                    temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                                    const newData = { ...temp.setting, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.setting = newData;
                                    temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                                    if (Object.entries(temp.setting[id[0]]).length === 0) {
                                        temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== id[0]));
                                    }

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            }
                        } else {
                            let keyList = Object.entries(temp.setting).map(([key, value]) => key).filter(item => item !== props.info.key);
                            if (keyList.includes(key.current.value)) {
                                alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                            } else if (key.current.value.includes('(', ')')) {
                                let id = key.current.value.split(/[()]/);
                                let keyListObj = Object.entries(temp.setting[id[0]]).map(([key, value]) => key);
                                if (keyListObj.includes(id[1])) {
                                    alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                                } else {
                                    temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                                    const newData__ = { ...temp.setting[id[0]], [id[1]]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                    temp.setting[id[0]] = newData__;
                                    temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));

                                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                    props.handleClose();
                                }
                            } else {
                                temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                                const newData_ = { ...temp.setting, [key.current.value]: { register: register.current.value, cal: scale.current.value, type: type.current.value } };
                                temp.setting = newData_;

                                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                                props.handleClose();
                            }
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
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
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
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
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
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
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
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                        } else {
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
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
                                <label>key</label>
                                <input type="text" ref={key} />

                                <label>register</label>
                                <textarea type="text" ref={register} />

                                <label>scale</label>
                                <input type="text" ref={scale} />

                                <label>type</label>
                                <input type="text" ref={type} />

                                <label>note</label>
                                <input type="text" ref={note} />
                            </div>;
                        case 'editTemplate':
                            return <div className='DAT_RSPopup_Body_Info'>
                                <label>key</label>
                                <input type="text" defaultValue={props.info.key === 'undefined' ? '' : props.info.key} ref={key} />

                                <label>register</label>
                                <textarea type="text" defaultValue={props.info.register === 'undefined' ? '' : props.info.register} ref={register} />

                                <label>scale</label>
                                <input type="text" defaultValue={props.info.scale === 'undefined' ? '' : props.info.scale} ref={scale} />

                                <label>type</label>
                                <input type="text" defaultValue={props.info.type === 'undefined' ? '' : props.info.type} ref={type} />

                                <label>note</label>
                                <input type="text" ref={note} />
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
