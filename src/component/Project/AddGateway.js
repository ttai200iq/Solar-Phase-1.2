import React, { useEffect, useRef } from "react";
import "./Project.scss";

import { projectData, } from "./Project";
import { useIntl } from "react-intl";
import { inverterDB, temp } from "./ProjectData";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import axios from "axios";
import { Token } from "../../App";

import { IoClose } from "react-icons/io5";

export default function AddGateway(props) {
  const dataLang = useIntl();
  const sn = useRef();
  const name = useRef();
  const type = useRef();

  const invtCloud = async (data, token) => {
    var reqData = {
      data: data,
      token: token,
    };

    try {
      const response = await axios({
        url: host.CLOUD,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Object.keys(reqData)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
            );
          })
          .join("&"),
      });

      return response.data;
    } catch (e) {
      return { ret: 1, msg: "cloud err" };
    }
  };

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

  const handleSave = async (e) => {
    if (sn.current.value === "" || name.current.value === "" || type.current.value === "") {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
    } else {
      const d = await callApi("post", host.DATA + "/addLogger", {
        plantid: projectData.value.plantid_,
        sn: sn.current.value,
        name: name.current.value,
        type: type.current.value,
      });
      if (d.status) {
        temp.value = [...temp.value, d.data];
        props.handleInvt(sn.current.value)
        const res = await invtCloud(
          '{"deviceCode":"' + sn.current.value + '"}',
          Token.value.token
        );
        if (res.ret === 0) {
          const decimalArray = JSON.parse(d.data.setting.sn)
          const hexString = decimalArray.map((num) => parseInt(res.data[num]).toString(16)).join('');
          const invertersn = hexString.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');

          let async_ = await callApi("post", host.DATA + "/addInverter", {
            loggersn: sn.current.value,
            invertersn: invertersn,
            type: d.data.type,
            plantid: projectData.value.plantid_,
          });
          if (async_.status) {
            inverterDB.value = [...inverterDB.value, async_.data];
          }
        }
        props.handleClose();
      }
      if (d.status === true) {
        alertDispatch(dataLang.formatMessage({ id: "alert_32" }))
      } else if (d.number === 0) {
        alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
      } else if (d.number === 1) {
        alertDispatch(dataLang.formatMessage({ id: "alert_34" }))
      } else if (d.number === 2) {
        alertDispatch(dataLang.formatMessage({ id: "alert_35" }))
      } else if (d.number === 3) {
        alertDispatch(dataLang.formatMessage({ id: "alert_34" }))
      } else if (d.number === 4) {
        alertDispatch(dataLang.formatMessage({ id: "alert_36" }))
      }
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
    <div className="DAT_AddGateway">
      <div className="DAT_AddGateway_Head">
        <div className="DAT_AddGateway_Head_Left">
          <p>{dataLang.formatMessage({ id: 'ADD' })} Gateway/Logger</p>
        </div>

        <div className="DAT_AddGateway_Head_Right">
          <div
            className="DAT_AddGateway_Head_Right_Icon"
            onClick={() => props.handleClose()}
          >
            <IoClose
              size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            />
          </div>
        </div>
      </div>

      <div className="DAT_AddGateway_Body">
        <div className="DAT_AddGateway_Body_Input">
          <span>SN:</span>
          <input id="sn" type="text" placeholder={dataLang.formatMessage({ id: 'enterCode' })} ref={sn} />
        </div>

        <div className="DAT_AddGateway_Body_Input">
          <span>{dataLang.formatMessage({ id: 'name' })}:</span>
          <input id="name" type="text" placeholder={dataLang.formatMessage({ id: 'enterDev' })} ref={name} />
        </div>

        <div className="DAT_AddGateway_Body_Input">
          <span>{dataLang.formatMessage({ id: 'type' })}:</span>
          <input id="type" type="text" placeholder={dataLang.formatMessage({ id: 'enterType' })} ref={type} />
        </div>
      </div>

      <div className="DAT_AddGateway_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => handleSave(e)}
        >
          {dataLang.formatMessage({ id: 'confirm' })}
        </button>
      </div>
    </div>
  );
}
