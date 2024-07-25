import React, { useEffect, useRef } from 'react';
import './RegisterSetting.scss';

import { useIntl } from 'react-intl';
import { IoClose } from 'react-icons/io5';
import { COLOR } from '../../App';
import { inverterListRS, loggerListRS, registerID, tabRS } from './RegisterSetting';
import { alertDispatch } from '../Alert/Alert';

export default function RSPopup(props) {
    const dataLang = useIntl();
    const brandName = useRef();
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
            case 'editBrand':
                console.log(brandName.current.value);
                break;
            case 'deleteBrand':
                break;
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
                console.log(key.current.value);
                console.log(register.current.value);
                console.log(scale.current.value);
                console.log(type.current.value);
                console.log(note.current.value);
                break;
            case 'editTemplate':
                console.log(key.current.value);
                console.log(register.current.value);
                console.log(scale.current.value);
                console.log(type.current.value);
                console.log(note.current.value);
                break;
            case 'deleteTemplate':
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
                            case 'editBrand':
                                return <span>{dataLang.formatMessage({ id: "edit" })}</span>;
                            case 'deleteBrand':
                                return <span>{dataLang.formatMessage({ id: "delete" })}</span>;
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
                        case 'editBrand':
                            return <div className='DAT_RSPopup_Body_Info'>
                                <label>{dataLang.formatMessage({ id: 'name' })}</label>
                                <input type="text" defaultValue={registerID.value} ref={brandName} />
                            </div>;
                        case 'deleteBrand':
                            return <span>{dataLang.formatMessage({ id: 'delBrandmess' })} &nbsp;
                                <span style={{ fontFamily: 'segoeuib' }}>{registerID.value}</span>
                            </span>;
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
