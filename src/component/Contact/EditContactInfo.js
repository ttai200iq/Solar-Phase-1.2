import React, { useEffect } from "react";
import "./Contact.scss";

import { COLOR, partnerInfor } from "../../App";
import { signal } from "@preact/signals-react";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { useIntl } from "react-intl";
import { alertDispatch } from "../Alert/Alert";
import { isMobile } from "../Navigation/Navigation";

import { IoClose } from "react-icons/io5";

const Type = signal({
  onm: { name: "onm", checked: false },
  investor: { name: "investor", checked: false },
  distributor: { name: "distributor", checked: false },
  manufacturer: { name: "manufacturer", checked: false },
})

export default function EditContactInfo(props) {
  const dataLang = useIntl();

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

  const handeTypeChange = (e) => {
    Object.entries(Type.value).forEach(async ([key, value]) => {
      if (key === e.target.id) {
        Type.value = { ...Type.value, [key]: { ...Type.value[key], checked: !Type.value[key].checked } }
        const d = await callApi('post', host.DATA + '/updatePartner', { code: partnerInfor.value.code, type: 'businesstype', data: key })
        if (d.status) {
          alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
          partnerInfor.value = {
            ...partnerInfor.value,
            businesstype: key
          }
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
      } else {
        Type.value = { ...Type.value, [key]: { ...Type.value[key], checked: false } }
      }
    })
  }

  const handeUpdate = async (e) => {
    const id = e.currentTarget.id
    let data = document.getElementById(`${id}_input`).value
    if (data !== "") {
      const d = await callApi('post', host.DATA + '/updatePartner', { code: partnerInfor.value.code, type: id, data: data })
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
        partnerInfor.value = {
          ...partnerInfor.value,
          [id]: data
        }
        props.handleClose();
      } else {
        alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
      }
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
    }
  }

  useEffect(() => {
    Type.value[partnerInfor.value.businesstype] = { ...Type.value[partnerInfor.value.businesstype], checked: true }
  }, [])

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
    <div className="DAT_EditContactInfo">
      <div className="DAT_EditContactInfo_Header">
        <div className="DAT_EditContactInfo_Header_Left">
          {dataLang.formatMessage({ id: 'edits' })}
        </div>

        <div className="DAT_EditContactInfo_Header_Right">
          <div className="DAT_EditContactInfo_Header_Right_Close"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => { props.handleClose() }}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_EditContactInfo_Body">
        {props.mode === 'RegisterInf'
          ? <>
            <div className="DAT_EditContactInfo_Body_Row2">
              <div className="DAT_EditContactInfo_Body_Row2_Item"
                style={{ marginBottom: isMobile.value ? "0px" : "16px" }}
              >
                <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                  {dataLang.formatMessage({ id: 'businessModel' })}
                </div>

                <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                  <input
                    type="text"
                    id="businessmodel_input"
                    defaultValue={partnerInfor.value.businessmodel}
                  />
                  <span
                    style={{ cursor: "pointer", color: COLOR.value.PrimaryColor }}
                    id='businessmodel'
                    onClick={(e) => handeUpdate(e)}
                  >
                    {dataLang.formatMessage({ id: 'save' })}
                  </span>
                </div>
              </div>

              <div className="DAT_EditContactInfo_Body_Row2_Item"
                style={{ marginBottom: isMobile.value ? "0px" : "16px" }}
              >
                <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                  {dataLang.formatMessage({ id: 'businessname' })}
                </div>

                <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                  <input
                    type="text"
                    id="businessname_input"
                    defaultValue={partnerInfor.value.businessname}
                  />
                  <span
                    style={{ cursor: "pointer", color: COLOR.value.PrimaryColor }}
                    id="businessname"
                    onClick={(e) => handeUpdate(e)}
                  >
                    {dataLang.formatMessage({ id: 'save' })}</span>
                </div>
              </div>

              <div className="DAT_EditContactInfo_Body_Row2_Item"
                style={{ marginBottom: "0px" }}
              >
                <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                  {dataLang.formatMessage({ id: 'area' })}
                </div>

                <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                  <input
                    type="text"
                    id="area_input"
                    defaultValue={partnerInfor.value.area}
                  />
                  <span
                    style={{ cursor: "pointer", color: COLOR.value.PrimaryColor }}
                    id="area"
                    onClick={(e) => handeUpdate(e)}
                  >
                    {dataLang.formatMessage({ id: 'save' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="DAT_EditContactInfo_Body_Row1">
              <div className="DAT_EditContactInfo_Body_Row1_Tit">
                {dataLang.formatMessage({ id: 'businesstype' })}
              </div>
              <div className="DAT_EditContactInfo_Body_Row1_Content">
                {Object.keys(Type.value).map((key) => {
                  return (
                    <div className="DAT_EditContactInfo_Body_Row1_Content_Item" key={key}>
                      <input
                        type="radio"
                        id={key}
                        checked={Type.value[key].checked}
                        onChange={(e) => handeTypeChange(e)}
                      />
                      <span>
                        {dataLang.formatMessage({ id: Type.value[key].name })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
          :
          <div className="DAT_EditContactInfo_Body_Row2">
            <div className="DAT_EditContactInfo_Body_Row2_Item"
              style={{ marginBottom: isMobile.value ? "0px" : "16px" }}
            >
              <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                {dataLang.formatMessage({ id: 'name' })}
              </div>
              <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                <input
                  type="text"
                  id="name_input"
                  defaultValue={partnerInfor.value.name}
                />
                <span
                  style={{ cursor: "pointer", color: "rgba(11, 25, 103)" }}
                  id='name'
                  onClick={(e) => handeUpdate(e)}
                >
                  {dataLang.formatMessage({ id: 'save' })}
                </span>
              </div>
            </div>

            <div className="DAT_EditContactInfo_Body_Row2_Item"
              style={{ marginBottom: isMobile.value ? "0px" : "16px" }}
            >
              <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                {dataLang.formatMessage({ id: 'phone' })}
              </div>

              <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                <input
                  type="number"
                  id="phone_input"
                  defaultValue={partnerInfor.value.phone}
                />
                <span
                  style={{ cursor: "pointer", color: "rgba(11, 25, 103)" }}
                  id="phone"
                  onClick={(e) => handeUpdate(e)}
                >
                  {dataLang.formatMessage({ id: 'save' })}
                </span>
              </div>
            </div>

            <div className="DAT_EditContactInfo_Body_Row2_Item"
              style={{ marginBottom: isMobile.value ? "16px" : "0px" }}
            >
              <div className="DAT_EditContactInfo_Body_Row2_Item_Tit">
                E-mail
              </div>

              <div className="DAT_EditContactInfo_Body_Row2_Item_Content">
                <input
                  type="email"
                  id="mail_input"
                  defaultValue={partnerInfor.value.mail}
                />
                <span
                  style={{ cursor: "pointer", color: "rgba(11, 25, 103)" }}
                  id="mail"
                  onClick={(e) => handeUpdate(e)}
                >
                  {dataLang.formatMessage({ id: 'save' })}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    </div >
  );
}
