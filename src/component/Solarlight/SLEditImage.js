import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useIntl } from 'react-intl';
import { signal } from "@preact/signals-react";
import Resizer from "react-image-file-resizer";

export const SLDiagramImg = signal();

export default function SLEditImage(props) {
    const dataLang = useIntl();
    const [ava, setAva] = useState();

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

    const resizeFilAvatar = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                180,
                180,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handleChooseAvatar = async (e) => {
        var reader = new FileReader();
        if (e.target.files[0].size > 50000) {
            const image = await resizeFilAvatar(e.target.files[0]);
            reader.readAsDataURL(image);
            reader.onload = () => {
                setAva(reader.result);
            }
        } else {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setAva(reader.result);
            };
        }
    };

    const handleSave = () => {
        SLDiagramImg.value = ava;
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