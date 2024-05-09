import React, { useEffect, useRef } from 'react';
import './ErrorSetting.scss';

import { COLOR } from '../../App';
import { useIntl } from 'react-intl';

import { IoClose } from 'react-icons/io5';

export default function CreateErrSetting(props) {
    const dataLang = useIntl();
    const codeRef1 = useRef("A");
    const codeRef2 = useRef("");
    const codeRef3 = useRef("");

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
        <form className="DAT_CreateErrSetting" onSubmit={(e) => {
            props.handleConfirm(
                e,
                codeRef1.current.value,
                codeRef2.current.value,
                codeRef3.current.value
            )
        }}>
            <div className="DAT_CreateErrSetting_Head">
                <div className="DAT_CreateErrSetting_Head_Left">
                    {dataLang.formatMessage({ id: "createNew" })}
                </div>
                <div className="DAT_CreateErrSetting_Head_Right">
                    <div className="DAT_CreateErrSetting_Head_Right_Icon"
                        id="Popup"
                        onClick={() => (props.handleClose())}
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")}
                    >
                        <IoClose size={25} />
                    </div>
                </div>
            </div>

            <div className="DAT_CreateErrSetting_Body">
                <span>{dataLang.formatMessage({ id: "errcode" })}:</span>
                <select ref={codeRef1}>
                    <option value="A">A</option>
                    <option value="E">E</option>
                </select>
                <input
                    type='number' ref={codeRef2} max={1000} min={0}
                />
                <input
                    type='number' ref={codeRef3} max={1000} min={0}
                />
            </div>

            <div className="DAT_CreateErrSetting_Foot">
                <div className="DAT_CreateErrSetting_Foot_Left">
                    <span style={{ color: "red" }}>*</span>
                    <div className="DAT_CreateErrSetting_Foot_Left_Item">
                        <span>A: {dataLang.formatMessage({ id: "notice" })}</span>
                        <span>E: {dataLang.formatMessage({ id: "alert" })}</span>
                    </div>
                </div>

                <div className="DAT_CreateErrSetting_Foot_Right">
                    <button
                        style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
                        onClick={(e) => {
                            props.handleConfirm(
                                e,
                                codeRef1.current.value,
                                codeRef2.current.value,
                                codeRef3.current.value
                            )
                        }}
                    >
                        {dataLang.formatMessage({ id: "confirm" })}
                    </button>
                </div>
            </div>
        </form>
    );
}

