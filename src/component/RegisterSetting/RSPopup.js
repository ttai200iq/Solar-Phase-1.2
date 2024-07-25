import React, { useEffect, useRef } from 'react';
import './RegisterSetting.scss';

import { useIntl } from 'react-intl';
import { IoClose } from 'react-icons/io5';
import { COLOR } from '../../App';
import { inverterListRS, loggerListRS, tabRS } from './RegisterSetting';
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
                console.log(typeName.current.value);
                // if (tabRS.value === 'logger') {
                //     let temp = loggerListRS.value.find(item => item.type_ === typeName.current.value);
                //     console.log(temp);
                //     if (temp === undefined) {
                //         // loggerListRS.value.push({ type_: typeName.current.value, brand_: registerID.value, data_: {}, setting_: {}, version_: '0.1', id_: '0' });
                //         alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                //         props.handleClose();
                //     } else {
                //         alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
                //     }
                // } else {

                // }
                break;
            case 'changeName':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type);
                    temp.type_ = typeName.current.value;
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                    props.handleClose();
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type);
                    temp.type_ = typeName.current.value;
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
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
                }
                break;
            case 'addTemplate':
                console.log(props.info.templatetype);
                console.log(key.current.value);
                console.log(register.current.value);
                console.log(scale.current.value);
                console.log(type.current.value);
                console.log(note.current.value);
                // if (props.info.templatetype === 'data') {
                //     console.log(loggerListRS.value);
                // } else {

                // }
                break;
            case 'editTemplate':
                console.log(key.current.value);
                console.log(register.current.value);
                console.log(scale.current.value);
                console.log(type.current.value);
                console.log(note.current.value);

                // let temp = loggerListRS.value.find(item => item.type_ === props.info.type_);
                // console.log(temp);
                // if (props.info.templateType === 'data') {
                //     // console.log(temp.data_[props.info.key]);
                //     let data = Object.entries(temp.data_).find(([key, value]) => key === props.info.key);
                //     data[0] = key.current.value;
                //     data[1].register = register.current.value;
                //     data[1].cal = scale.current.value;
                //     data[1].type = type.current.value;
                //     console.log(data);
                //     // temp.data_[props.info.key] = data;
                //     // console.log(temp.data_[props.info.key]);

                //     // temp.data_[props.info.key].register = register.current.value;
                //     // temp.data_[props.info.key].cal = scale.current.value;
                //     // temp.data_[props.info.key].type = type.current.value;
                //     // console.log(temp.data_[props.info.key]);
                //     alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                //     props.handleClose();
                // } else {

                // }
                break;
            case 'deleteTemplate':
                if (tabRS.value === 'logger') {
                    let temp = loggerListRS.value.find(item => item.type_ === props.info.type_);
                    switch (props.info.templateType) {
                        case 'data':
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        case 'setting':
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        case 'setting_':
                            let id = props.info.key.split('_');
                            temp.setting[id[0]] = Object.fromEntries(Object.entries(temp.setting[id[0]]).filter(([key, value]) => key !== id[1]));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        default:
                            break;
                    }
                } else {
                    let temp = inverterListRS.value.find(item => item.type_ === props.info.type_);
                    switch (props.info.templateType) {
                        case 'data':
                            temp.data_ = Object.fromEntries(Object.entries(temp.data_).filter(([key, value]) => key !== props.info.key));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        case 'data_':
                            let id = props.info.key.split('_');
                            temp.data_[id[0]] = Object.fromEntries(Object.entries(temp.data_[id[0]]).filter(([key, value]) => key !== id[1]));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        case 'setting':
                            temp.setting = Object.fromEntries(Object.entries(temp.setting).filter(([key, value]) => key !== props.info.key));
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                            props.handleClose();
                            break;
                        default:
                            break;
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
                <button
                    style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
                // onClick={() => handleConfirm()}
                >
                    {dataLang.formatMessage({ id: "confirm" })}
                </button>
            </div>
        </form>
    );
}
