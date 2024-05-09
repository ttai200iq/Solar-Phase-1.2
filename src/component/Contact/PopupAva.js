import React, { useState } from "react";
import "./Contact.scss";

import { partnerInfor } from "../../App";
import Resizer from "react-image-file-resizer";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

export default function PopupAva(props) {
  const dataLang = useIntl();
  const [ava, setAva] = useState(partnerInfor.value.logo ? partnerInfor.value.logo : "/dat_icon/logo_DAT.png");

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

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        150,
        150,
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

    if (e.target.files[0].size > 100000) {
      const image = await resizeFile(e.target.files[0]);
      reader.readAsDataURL(image);
      reader.onload = () => {
        setAva(reader.result);

      };
    } else {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setAva(reader.result);
      };
    }
  };

  const handleSave = async (e) => {
    const d = await callApi('post', host.DATA + '/updatePartner', { code: partnerInfor.value.code, type: 'logo', data: ava })
    if (d.status) {
      alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
      partnerInfor.value = {
        ...partnerInfor.value,
        logo: ava
      }
      props.handleClose();
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
    }
  }

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
    <div className="DAT_PopupAva">
      <div className="DAT_PopupAva_Head">
        <div className="DAT_PopupAva_Head_Left">
          <p>{dataLang.formatMessage({ id: 'edits' })}</p>
        </div>

        <div className="DAT_PopupAva_Head_Right">
          <div className="DAT_PopupAva_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_PopupAva_Body">
        <div className="DAT_PopupAva_Body_Ava">
          <div className="DAT_PopupAva_Body_Ava_Img">
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

      <div className="DAT_PopupAva_Foot">
        <button
          onClick={() => { handleSave() }}
        >
          {dataLang.formatMessage({ id: 'save' })}
        </button>
      </div>
    </div>
  );
}
