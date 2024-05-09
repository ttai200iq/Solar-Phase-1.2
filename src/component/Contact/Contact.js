import React, { useEffect, useState } from "react";
import "./Contact.scss";

import PopupAvatar from "./PopupAva";
import EditContactInfo from "./EditContactInfo";
import { partnerInfor, ruleInfor } from "../../App";
import { useIntl } from "react-intl";

import { MdOutlineContactPhone } from "react-icons/md";
import { isMobile } from "../Navigation/Navigation";

export default function Contact(props) {
  const dataLang = useIntl();
  const [contactState, setContactState] = useState("default");

  const handleClose = () => {
    setContactState("default");
  };

  return (
    <>
      <div className="DAT_ContactHeader">
        <div className="DAT_ContactHeader_Title">
          <MdOutlineContactPhone color="gray" size={25} />
          <span>
            {dataLang.formatMessage({ id: 'contact' })}
          </span>
        </div>
      </div>

      <div className="DAT_Contact">
        <div className="DAT_Contact_Item">
          <div className="DAT_Contact_Item_Registation"
            style={{ marginBottom: isMobile.value ? "0px" : "10px" }}
          >
            <div className="DAT_Contact_Item_Registation_Tit">
              <div>{dataLang.formatMessage({ id: 'registerInfo' })}</div>
              {ruleInfor.value.setting.contact.edit === false
                ? <div></div>
                : <div onClick={() => (setContactState("editRegisterInf"))}>
                  {dataLang.formatMessage({ id: 'edits' })}
                </div>
              }
            </div>

            <div className="DAT_Contact_Item_Registation_Content">
              <div>{dataLang.formatMessage({ id: 'businessModel' })}</div>
              <div>{partnerInfor.value.businessmodel}</div>
            </div>

            <div className="DAT_Contact_Item_Registation_Content">
              <div>{dataLang.formatMessage({ id: 'businessname' })}</div>
              <div>{partnerInfor.value.businessname}</div>
            </div>

            <div className="DAT_Contact_Item_Registation_Content">
              <div>{dataLang.formatMessage({ id: 'area' })}</div>
              <div>{partnerInfor.value.area}</div>
            </div>

            <div className="DAT_Contact_Item_Registation_Content"
              style={{ marginBottom: "0px" }}
            >
              <div>{dataLang.formatMessage({ id: 'businesstype' })}</div>
              <div>{dataLang.formatMessage({ id: partnerInfor.value?.businesstype ? partnerInfor.value.businesstype : "unknown", defaultMessage: "...", })}</div>
            </div>
          </div>
        </div>

        <div className="DAT_Contact_Item">
          <div className="DAT_Contact_Item_Contact">
            <div className="DAT_Contact_Item_Contact_Tit">
              <div>{dataLang.formatMessage({ id: 'contact' })}</div>
              {ruleInfor.value.setting.contact.edit === false
                ? <div></div>
                : <div onClick={() => (setContactState("editContactInf"))}>
                  {dataLang.formatMessage({ id: 'edits' })}
                </div>
              }
            </div>

            <div className="DAT_Contact_Item_Contact_Content">
              <div>{dataLang.formatMessage({ id: 'name' })}</div>
              <div>{partnerInfor.value.name}</div>
            </div>

            <div className="DAT_Contact_Item_Contact_Content">
              <div>{dataLang.formatMessage({ id: 'phone' })}</div>
              <div>{partnerInfor.value.phone}</div>
            </div>

            <div className="DAT_Contact_Item_Contact_Content"
              style={{ marginBottom: "0px" }}
            >
              <div>E-mail</div>
              <div>{partnerInfor.value.mail}</div>
            </div>
          </div>

          <div className="DAT_Contact_Item_Logo">
            <div className="DAT_Contact_Item_Logo_Tit">
              <div>Logo</div>
              {ruleInfor.value.setting.contact.edit === false
                ? <div></div>
                : <div onClick={() => (setContactState("editAva"))}>
                  {dataLang.formatMessage({ id: 'edits' })}
                </div>
              }
            </div>

            <div className="DAT_Contact_Item_Logo_Content">
              <img src={partnerInfor.value.logo ? partnerInfor.value.logo : "/dat_icon/logo_DAT.png"} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_PopupBG"
        style={{ height: contactState === "default" ? "0px" : "100vh" }}
      >
        {(() => {
          switch (contactState) {
            case "editRegisterInf":
              return <EditContactInfo mode="RegisterInf" handleClose={handleClose} />;
            case "editContactInf":
              return <EditContactInfo mode="ContactInf" handleClose={handleClose} />;
            case "editAva":
              return <PopupAvatar handleClose={handleClose} />;
            default:
              return <></>;
          }
        })()}
      </div>
    </>
  );
}
