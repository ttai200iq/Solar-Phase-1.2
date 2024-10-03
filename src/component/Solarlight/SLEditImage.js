import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useIntl } from 'react-intl';
import { signal } from "@preact/signals-react";
import { callApi, From } from '../Api/Api';
import { host } from '../Lang/Contant';
import { slProjectData } from './SLProjectlist';

export const SLDiagramImg = signal();

export default function SLEditImage(props) {
    const dataLang = useIntl();
    const [ava, setAva] = useState(slProjectData.value.solar?.data || '');

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

    const handleChooseAvatar = async (e) => {
        SLDiagramImg.value = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setAva(reader.result);
        }
    };

    const handleSave = async () => {
        let upload = await From(host.DATA + '/uploadFile', SLDiagramImg.value, slProjectData.value.plantname);
        console.log(upload);
        if (upload.status) {
            setAva(upload.data);
            let d = await callApi('post', host.DATA + '/updatePlantSolar', { plantid: slProjectData.value.plantid_, file: JSON.stringify({ data: upload.data, path: upload.path }) });
            console.log(d);
            if (d.status) {
                slProjectData.value.solar = { data: upload.data, path: upload.path };
            }
        }
        props.handleClose();
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
        <div className="DAT_SLEditImage">
            <div className="DAT_SLEditImage_Head">
                <div className="DAT_SLEditImage_Head_Left">
                    {dataLang.formatMessage({ id: 'edits' })}
                </div>
                <div className="DAT_SLEditImage_Head_Right">
                    <div className="DAT_SLEditImage_Head_Right_Icon"
                        id="Popup"
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")}
                        onClick={() => (props.handleClose())}
                    >
                        <IoClose size={25} />
                    </div>
                </div>
            </div>

            <div className="DAT_SLEditImage_Body">
                <div className="DAT_SLEditImage_Body_Avatar">
                    <div className="DAT_SLEditImage_Body_Avatar_Cover">
                        <img src={ava} alt="" />
                    </div>
                    <input
                        type="file"
                        id="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => handleChooseAvatar(e)}
                    />
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
                        {dataLang.formatMessage({ id: 'chooseImg' })}
                    </label>
                </div>
            </div>

            <div className="DAT_SLEditImage_Foot">
                <button
                    onClick={() => handleSave()}
                >
                    {dataLang.formatMessage({ id: 'save' })}
                </button>
            </div>
        </div>
    );
}