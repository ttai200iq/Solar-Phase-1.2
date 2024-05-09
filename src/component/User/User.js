import React, { useState } from "react";
import "./User.scss";

import Popup from "./Popup";
import { userInfor } from "../../App";
import { useIntl } from "react-intl";

import { VscAccount } from "react-icons/vsc";

export default function User(props) {
  const dataLang = useIntl();
  const [popupState, setPopupState] = useState(false);
  const [editType, setEditType] = useState("");

  const handleClose = () => {
    setPopupState(false);
  };

  return (
    <>
      <div className="DAT_UsrHeader">
        <div className="DAT_UsrHeader_Title">
          <VscAccount color="gray" size={25} />
          <span>
            {dataLang.formatMessage({ id: 'account' })}
          </span>
        </div>
      </div>

      <div className="DAT_Usr">
        <div className="DAT_Usr_Item"
          style={{ paddingTop: "0px" }}
        >
          <div className="DAT_Usr_Item_Content">
            <div className="DAT_Usr_Item_Content_Title">
              {dataLang.formatMessage({ id: 'imgInfo' })}
            </div>
            <img src={userInfor.value.avatar
              ? userInfor.value.avatar
              : "/dat_icon/user_manager.png"}
              alt=""
              onClick={() => {
                (setPopupState(true));
                setEditType("avatar")
              }}
            />
          </div>
        </div>

        <div className="DAT_Usr_Item">
          <div className="DAT_Usr_Item_Content">
            <div className="DAT_Usr_Item_Content_Title">
              {dataLang.formatMessage({ id: 'name' })}
            </div>
            <div className="DAT_Usr_Item_Content_Label">
              {userInfor.value.name}
            </div>
          </div>
          <span onClick={() => {
            (setPopupState(true));
            setEditType("name")
          }}
          >
            {dataLang.formatMessage({ id: 'edits' })}
          </span>
        </div>

        <div className="DAT_Usr_Item">
          <div className="DAT_Usr_Item_Content">
            <div className="DAT_Usr_Item_Content_Title">
              {dataLang.formatMessage({ id: 'phone' })}
            </div>
            <div className="DAT_Usr_Item_Content_Label">
              {userInfor.value.phone}
            </div>
          </div>
          <span onClick={() => {
            (setPopupState(true));
            setEditType("phone")
          }}
          >
            {dataLang.formatMessage({ id: 'edits' })}
          </span>
        </div>

        <div className="DAT_Usr_Item">
          <div className="DAT_Usr_Item_Content">
            <div className="DAT_Usr_Item_Content_Title">
              {dataLang.formatMessage({ id: 'address' })}
            </div>
            <div className="DAT_Usr_Item_Content_Label">
              {userInfor.value.addr}
            </div>
          </div>
          <span onClick={() => {
            (setPopupState(true));
            setEditType("addr")
          }}
          >
            {dataLang.formatMessage({ id: 'edits' })}
          </span>
        </div>

        <div className="DAT_Usr_Item">
          <div className="DAT_Usr_Item_Content">
            <div className="DAT_Usr_Item_Content_Title">
              {dataLang.formatMessage({ id: 'password' })}
            </div>
            <div className="DAT_Usr_Item_Content_Label">
              ********
            </div>
          </div>
          <span onClick={() => {
            (setPopupState(true));
            setEditType("password")
          }}
          >
            {dataLang.formatMessage({ id: 'editPassword' })}
          </span>
        </div>
      </div>

      {popupState ? (
        <div className="DAT_PopupBG">
          <Popup handleClose={handleClose} editType={editType} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
