import React, { useEffect, useRef } from "react";
import "./Device.scss"

import { inverterList, loggerList } from "./Device";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";

export default function Popup(props) {
  const dataLang = useIntl();
  const name = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" }
  }

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup")
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  }

  const handleDelete = (e) => {
    const dropLogger = async () => {
      let d = await callApi('post', host.DATA + '/dropLogger', { plantid: props.plantid, sn: props.sn });
      if (d.status === true) {
        loggerList.value = loggerList.value.filter((item) => item.psn != props.sn);
        inverterList.value = inverterList.value.filter((item) => item.plogger != props.sn);
        alertDispatch(dataLang.formatMessage({ id: "alert_25" }))
        props.handleClose();
      } else if (d.number == 0) {
        alertDispatch(dataLang.formatMessage({ id: "alert_26" }))
      } else if (d.number == 1) {
        alertDispatch(dataLang.formatMessage({ id: "alert_27" }))
      }
    }
    dropLogger();
  }

  const handleUpdate = (e) => {
    switch (props.devtype) {
      case "inverter":
        const updateInverter = async () => {
          let d = await callApi('post', host.DATA + '/updateInverter', { sn: props.sn, type: "name", data: name.current.value });
          if (name.current.value === "") {
            alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
          } else if (d.status === true) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
            let newData = inverterList.value
            let index = newData.findIndex((item) => item.psn == props.sn);
            newData[index].pname = name.current.value;
            inverterList.value = [...newData];
            props.handleClose();
          }
        }
        updateInverter();
        break;
      default:
        const updateLogger = async () => {
          let d = await callApi('post', host.DATA + '/updateLogger', { sn: props.sn, type: "name", data: name.current.value });
          if (name.current.value === "") {
            alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
          } else if (d.status === true) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
            let newData = loggerList.value
            let index = newData.findIndex((item) => item.psn == props.sn);
            newData[index].pname = name.current.value;
            loggerList.value = [...newData];
            props.handleClose();
          }
        }
        updateLogger();
        break;
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
    props.type === "remove"
      ?
      <div className="DAT_Popup_Box">
        <div className="DAT_Popup_Box_Head">
          <div className="DAT_Popup_Box_Head_Left">
            {dataLang.formatMessage({ id: 'delDevice' })}
          </div>
          <div className="DAT_Popup_Box_Head_Right">
            <div
              className="DAT_Popup_Box_Head_Right_Icon"
              onClick={() => props.handleClose()}
              id="Popup"
              onMouseEnter={e => (handlePopup("new"))}
              onMouseLeave={e => (handlePopup("pre"))}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>

        <div className="DAT_Popup_Box_Body">
          {dataLang.formatMessage({ id: 'delDevicemess' })}
          &nbsp;
          <span style={{ fontFamily: "Montserrat-Bold" }}>
            {props.sn} ?
          </span>
        </div>

        <div className="DAT_Popup_Box_Foot">
          <button style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
            onClick={(e) => handleDelete(e)}
          >
            {dataLang.formatMessage({ id: 'confirm' })}
          </button>
        </div>
      </div>
      :
      <div className="DAT_Popup_Box">
        <div className="DAT_Popup_Box_Head">
          <div className="DAT_Popup_Box_Head_Left">
            {dataLang.formatMessage({ id: 'edits' })}
          </div>
          <div className="DAT_Popup_Box_Head_Right">
            <div
              className="DAT_Popup_Box_Head_Right_Icon"
              onClick={() => props.handleClose()}
              id="Popup"
              onMouseEnter={e => (handlePopup("new"))}
              onMouseLeave={e => (handlePopup("pre"))}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>

        <div className="DAT_Popup_Box_Body">
          <div style={{ marginBottom: "8px" }}>{dataLang.formatMessage({ id: 'name' })}:</div>
          <input type="text" ref={name} defaultValue={props.name} />
        </div>

        <div className="DAT_Popup_Box_Foot">
          <button style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
            onClick={(e) => handleUpdate(e)}
          >
            {dataLang.formatMessage({ id: 'confirm' })}
          </button>
        </div>
      </div>
  );
}
