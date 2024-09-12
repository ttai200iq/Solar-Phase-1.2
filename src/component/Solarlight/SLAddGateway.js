import React, { useEffect, useRef, useState } from "react";

import { slinverterDB, slloggerDB, sltab_ } from "./SLProjectData";
import { slProjectData } from "./SLProjectlist";
import { callApi } from "../Api/Api";
import { brands, host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { Token } from "../../App";

import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";
import axios from "axios";

import { IoClose, IoSyncOutline } from "react-icons/io5";

const type_ = signal('');

export default function SLAddGateway(props) {
  const dataLang = useIntl();
  const sn = useRef();
  const name = useRef();
  const [brand, setBrand] = useState();
  const [loggerType, setLoggerType] = useState();
  const type = useRef();
  const ogLog = useRef();
  const brand_ = useRef();

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

  const handleSave = async (e) => {
    if (sn.current.value === "" || name.current.value === "") {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
    } else if (sltab_.value === 'logger') {
      const d = await callApi("post", host.DATA + "/addLogger", {
        plantid: slProjectData.value.plantid_,
        sn: sn.current.value,
        name: name.current.value,
        type: type.current.value,
        mode: 'solarlight',
      });
      if (d.status) {
        slloggerDB.value = [...slloggerDB.value, d.data];
        props.handleInvt(sn.current.value)
        type_.value = type.current.value;
      }
      if (d.status === true) {
        alertDispatch(dataLang.formatMessage({ id: "alert_32" }))
        props.handleClose();
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
    } else {
      let async_ = await callApi("post", host.DATA + "/addInverter", {
        loggersn: ogLog.current.value,
        invertersn: sn.current.value,
        type: type_.value,
        plantid: slProjectData.value.plantid_,
      });
      console.log(async_);
      if (async_.status) {
        slinverterDB.value = [...slinverterDB.value, async_.data];
        alertDispatch(dataLang.formatMessage({ id: "alert_32" }))
        props.handleClose();
      } else if (async_.number === 1) {
        alertDispatch(dataLang.formatMessage({ id: "alert_35" }))
      }
    }
  };

  const handleBrand = (e) => {
    setBrand(loggerType.filter((item) => item.brand_ === e.target.value));
  };

  const handleCheck = async () => {
    if (ogLog.current.value === '') {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
    } else {
      const res = await invtCloud('{"deviceCode":"' + ogLog.current.value + '"}', Token.value.token);
      if (res.ret === 0) {
        const decimalArray = JSON.parse(slloggerDB.value[0].setting.sn)
        const hexString = decimalArray.map((num) => parseInt(res.data[num]).toString(16)).join('');
        const invertersn = hexString.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        if (invertersn === '') {
          alertDispatch(dataLang.formatMessage({ id: "alert_34" }))
        } else {
          document.getElementById('sn').value = invertersn;
        }
      }
    }
  };

  useEffect(() => {
    const getLoggerTemplate = async () => {
      let d = await callApi("get", host.DATA + "/getLoggerTemplate");
      if (d.status === true) {
        setLoggerType(d.data.sort((a, b) => a.id_ - b.id_));
      }
    };
    getLoggerTemplate();
  }, []);

  useEffect(() => {
    if (sltab_.value === 'logger') {
      if (loggerType !== undefined) {
        setBrand(loggerType.filter((item) => item.brand_ === brand_.current.value));
      }
    }
  }, [loggerType]);

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
          {sltab_.value === 'logger'
            ? <p>{dataLang.formatMessage({ id: 'ADD' })} Gateway/Logger</p>
            : <p>{dataLang.formatMessage({ id: 'ADD' })} Inverter</p>
          }
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

      {sltab_.value === 'logger'
        ?
        <div className="DAT_AddGateway_Body">
          <div className="DAT_AddGateway_Body_Input">
            <span>SN:</span>
            <input id="sn" type="text" placeholder={dataLang.formatMessage({ id: 'enterCode' })} ref={sn} />
          </div>

          <div className="DAT_AddGateway_Body_Input">
            <span>{dataLang.formatMessage({ id: 'name' })}:</span>
            <input id="name" type="text" placeholder={dataLang.formatMessage({ id: 'enterDev' })} ref={name} />
          </div>

          <div className="DAT_AddGateway_Body_Select">
            <span>{dataLang.formatMessage({ id: 'brand' })}:</span>
            <select onChange={(e) => handleBrand(e)} ref={brand_}>
              {Object.entries(brands).map(([key, value]) => {
                return (
                  <option key={key} value={key}>
                    {key}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="DAT_AddGateway_Body_Select">
            <span>{dataLang.formatMessage({ id: 'type' })}:</span>
            <select ref={type}>
              {loggerType !== undefined
                ?
                brand !== undefined
                  ?
                  brand.map((item, index) => {
                    return (
                      <option key={index} value={item.type_}>
                        {item.type_}
                      </option>
                    );
                  })
                  : <></>
                :
                <></>
              }
            </select>
          </div>
        </div>
        :
        <div className="DAT_AddGateway_Body">
          <div className="DAT_AddGateway_Body_Input">
            <span>{dataLang.formatMessage({ id: 'ogLog' })}:</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input id="ogLog" type="text" placeholder={dataLang.formatMessage({ id: 'enterLogger' })} ref={ogLog} />
              <span style={{ cursor: 'pointer' }} onClick={() => handleCheck()}><IoSyncOutline size={20} color="blue" /></span>
            </div>
          </div>

          <div className="DAT_AddGateway_Body_Input">
            <span>Inverter SN:</span>
            <input id="sn" type="text" placeholder={dataLang.formatMessage({ id: 'enterCode' })} ref={sn} />
          </div>

          <div className="DAT_AddGateway_Body_Input">
            <span>{dataLang.formatMessage({ id: 'name' })}:</span>
            <input id="name" type="text" placeholder={dataLang.formatMessage({ id: 'enterDev' })} ref={name} />
          </div>
        </div>
      }

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
