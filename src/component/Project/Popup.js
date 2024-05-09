import React, { useEffect, useRef } from "react";
import "./Project.scss";

import { dataproject, popupState, projectData } from "./Project";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { inverterDB, temp } from "./ProjectData";
import { userInfor } from "../../App";
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
    switch (props.type) {
      case "plant":
        const dropProject = async () => {
          let d = await callApi('post', host.DATA + '/dropPlant', {
            plantid: props.plantid,
            usr: props.usr,
            partnerid: userInfor.value.partnerid,
            type: userInfor.value.type
          })
          if (d.status === true) {
            alertDispatch(dataLang.formatMessage({ id: 'alert_24' }));

            dataproject.value = dataproject.value.filter(
              (item) => item.plantid_ != props.plantid
            );
            popupState.value = false;
          }
        };
        dropProject()
        break;
      case "logger":
        const dropLogger = async () => {
          let d = await callApi('post', host.DATA + '/dropLogger', {
            plantid: props.plantid, sn: props.sn
          });
          if (d.status === true) {
            temp.value = temp.value.filter((item) => item.sn != props.sn);
            inverterDB.value = inverterDB.value.filter((item) => item.logger_ != props.sn);
            alertDispatch(dataLang.formatMessage({ id: 'alert_25' }))
            popupState.value = false;
          } else if (d.number == 0) {
            alertDispatch(dataLang.formatMessage({ id: 'alert_26' }))
          } else if (d.number == 1) {
            alertDispatch(dataLang.formatMessage({ id: 'alert_27' }))
          }
        }
        dropLogger();
        break;
      default:
        break;
    }
  };

  const handleUpdate = (e) => {
    switch (props.devtype) {
      case "inverter":
        const updateInverter = async () => {
          let d = await callApi('post', host.DATA + '/updateInverter', { sn: props.sn, type: "name", data: name.current.value });
          if (name.current.value === "") {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
          } else if (d.status === true) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
            let newData = inverterDB.value
            let index = newData.findIndex((item) => item.sn == props.sn);
            newData[index].name = name.current.value;
            inverterDB.value = [...newData];
            popupState.value = false;
          }
        }
        updateInverter();
        break;
      default:
        const updateLogger = async () => {
          let d = await callApi('post', host.DATA + '/updateLogger', { sn: props.sn, type: "name", data: name.current.value });
          if (name.current.value === "") {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
          } else if (d.status === true) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
            let newData = temp.value
            let index = newData.findIndex((item) => item.sn == props.sn);
            newData[index].name = name.current.value;
            temp.value = [...newData];
            popupState.value = false;
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
        popupState.value = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    props.func === "remove"
      ?
      <div className="DAT_Popup_Box">
        <div className="DAT_Popup_Box_Head">
          <div className="DAT_Popup_Box_Head_Left">
            {dataLang.formatMessage({ id: 'delete' })}
          </div>
          <div className="DAT_Popup_Box_Head_Right">
            <div className="DAT_Popup_Box_Head_Right_Icon"
              onClick={() => (popupState.value = false)}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>

        <div className="DAT_Popup_Box_Body">
          <span>
            {props.type === "plant" ?
              dataLang.formatMessage({ id: 'delPlant' })
              : dataLang.formatMessage({ id: 'delDevicemess' })}
            &nbsp;
            <span style={{ fontFamily: "Montserrat-Bold" }}>
              {props.type === "plant" ? projectData.value.plantname : props.sn}
            </span>
          </span>
        </div>

        <div className="DAT_Popup_Box_Foot">
          <button
            style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
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
            <div className="DAT_Popup_Box_Head_Right_Icon"
              onClick={() => (popupState.value = false)}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
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
          <button
            style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
            onClick={(e) => handleUpdate(e)}
          >
            {dataLang.formatMessage({ id: 'confirm' })}
          </button>
        </div>
      </div>
  );
}
