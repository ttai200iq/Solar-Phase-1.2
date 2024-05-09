import React, { useEffect, useRef, useState } from "react";
import "./Project.scss";

import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { COLOR } from "../../App";
import { host } from "../Lang/Contant";
import { shareState } from "./Project";

import { IoClose, IoTrashOutline } from "react-icons/io5";


export default function ShareBox(props) {
    const dataLang = useIntl();
    const mail = useRef();
    const [shared, setShared] = useState([]);

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

    const handleShared = async (e) => {
        e.preventDefault();
        let req = await callApi("post", host.DATA + "/addPlantmem", { mail: mail.current.value, plantid: props.plantid, usr: props.usr });
        if (req.status) {
            mail.current.value = "";
            setShared([...shared, req.data]);
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
        } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
    }

    const handleDel = async (e) => {
        e.preventDefault();
        let arr = e.currentTarget.id.split('_');
        let req = await callApi("post", host.DATA + "/removePlantmem", { mail: arr[0], plantid: props.plantid });
        if (req.status) {
            let newData = shared.filter((item) => item.mail_ != arr[0]);
            setShared(newData)
            alertDispatch(dataLang.formatMessage({ id: "alert_53" }));
        } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
    }

    useEffect(() => {
        const getShared = async () => {
            let req = await callApi("post", host.DATA + "/getmailPlantmem", { plantid: props.plantid, usr: props.usr });
            if (req.status) {
                setShared(req.data)
            }
        }
        getShared();
    }, [])

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                shareState.value = false
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareState.value]);

    return (
        <form className="DAT_SharePopup_Box" onSubmit={(e) => handleShared(e)}>
            <div className="DAT_SharePopup_Box_Head">
                <div className="DAT_SharePopup_Box_Head_Left">
                    {dataLang.formatMessage({ id: "share" })}
                </div>

                <div className="DAT_SharePopup_Box_Head_Right">
                    <div
                        className="DAT_SharePopup_Box_Head_Right_Icon"
                        onClick={() => (shareState.value = false)}
                        id="Popup"
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")}
                    >
                        <IoClose size={25}></IoClose>
                    </div>
                </div>
            </div>

            <div className="DAT_SharePopup_Box_Body">
                <div>
                    <p>{dataLang.formatMessage({ id: "email" })}:</p>
                    <input
                        type="email"
                        required
                        ref={mail}
                        placeholder={dataLang.formatMessage({ id: "enterEmail" })}>
                    </input>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span>{shared.map((mem) =>
                        <div key={mem.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '5px', padding: '5px' }} >
                            <div>{mem.mail_}</div>
                            <IoTrashOutline size={14} id={`${mem.mail_}_DEL`} style={{ cursor: 'pointer' }} onClick={(e) => handleDel(e)} />
                        </div>
                    )}
                    </span>
                </div>
            </div>

            <div className="DAT_SharePopup_Box_Foot">
                <button
                    style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
                >
                    {dataLang.formatMessage({ id: "confirm" })}
                </button>
            </div>
        </form>
    );
}
