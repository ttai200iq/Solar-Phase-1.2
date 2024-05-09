import React, { useEffect, useRef } from "react";
import "./Role.scss";

import { roleState } from "./Role";
import { useIntl } from "react-intl";
import { alertDispatch } from "../Alert/Alert";
import { partnerInfor } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";

import { IoClose, IoSaveOutline } from "react-icons/io5";

export default function CreateRole(props) {
  const datalang = useIntl();
  const username = useRef();
  const mail = useRef();
  const pwd = useRef();
  const authpwd = useRef();
  const name = useRef();
  const phone = useRef();
  const role = useRef();
  const dataLang = useIntl();

  const handleSave = async (e) => {
    e.preventDefault();

    if (pwd.current.value === authpwd.current.value) {
      let res = await callApi("post", host.AUTH + "/CheckUser", {
        usr: username.current.value,
        mail: mail.current.value,
        code: partnerInfor.value.code,
      });
      if (res.status) {
        let register = await callApi("post", host.AUTH + "/Register", {
          usr: username.current.value,
          mail: mail.current.value,
          pwd: pwd.current.value,
          name: name.current.value,
          phone: phone.current.value,
          addr: "--",
          type: role.current.value,
          code: partnerInfor.value.code,
          host: window.location.host,
        });
        if (register.status) {
          props.handleClose();
          alertDispatch(datalang.formatMessage({ id: "alert_6" }));
        } else {
          alertDispatch(datalang.formatMessage({ id: "alert_7" }));
        }
      } else {
        if (res.number === 0) {
          alertDispatch(datalang.formatMessage({ id: "alert_10" }));
        } else {
          alertDispatch(datalang.formatMessage({ id: "alert_7" }));
        }
      }
    } else {
      alertDispatch(datalang.formatMessage({ id: "alert_18" }));
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
    <form className="DAT_CreateRole" onSubmit={handleSave}>
      <div className="DAT_CreateRole_Header">
        <div className="DAT_CreateRole_Header_Left">
          {dataLang.formatMessage({ id: "createAccount" })}
        </div>

        <div className="DAT_CreateRole_Header_Right">
          <div className="DAT_CreateRole_Header_Right_Save">
            <IoSaveOutline size={20} color="white" />
            <span>{dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div className="DAT_CreateRole_Header_Right_Close"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => props.handleClose()}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_CreateRole_Body">
        <div className="DAT_CreateRole_Body_Row2">
          <div className="DAT_CreateRole_Body_Row2_Left">
            <div className="DAT_CreateRole_Body_Row2_Left_Content">
              <div className="DAT_CreateRole_Body_Row2_Left_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "account" })}:
                </span>
              </div>
              <input
                type="text"
                ref={username}
                minLength="6"
                onChange={(e) =>
                (username.current.value = e.target.value
                  .trim()
                  .toLocaleLowerCase())
                }
                required
              />
            </div>
          </div>

          <div className="DAT_CreateRole_Body_Row2_Right">
            <div className="DAT_CreateRole_Body_Row2_Right_Content">
              <div className="DAT_CreateRole_Body_Row2_Right_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>Email:</span>
              </div>
              <input type="email" ref={mail} required></input>
            </div>
          </div>
        </div>

        <div className="DAT_CreateRole_Body_Row2">
          <div className="DAT_CreateRole_Body_Row2_Left">
            <div className="DAT_CreateRole_Body_Row2_Left_Content">
              <div className="DAT_CreateRole_Body_Row2_Left_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "name" })}:
                </span>
              </div>
              <input type="text" ref={name} required minLength="6" />
            </div>
          </div>

          <div className="DAT_CreateRole_Body_Row2_Right">
            <div className="DAT_CreateRole_Body_Row2_Right_Content">
              <div className="DAT_CreateRole_Body_Row2_Right_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "phone" })}:
                </span>
              </div>
              <input type="number" ref={phone} required minLength="10" />
            </div>
          </div>
        </div>

        <div className="DAT_CreateRole_Body_Row2">
          <div className="DAT_CreateRole_Body_Row2_Left">
            <div className="DAT_CreateRole_Body_Row2_Left_Content">
              <div className="DAT_CreateRole_Body_Row2_Left_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "password" })}:
                </span>
              </div>
              <input type="password" ref={pwd} required minLength="6" />
            </div>
          </div>

          <div className="DAT_CreateRole_Body_Row2_Right">
            <div className="DAT_CreateRole_Body_Row2_Right_Content">
              <div className="DAT_CreateRole_Body_Row2_Right_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "auth_pwd" })}:
                </span>
              </div>
              <input type="password" ref={authpwd} required minLength="6" />
            </div>
          </div>
        </div>

        <div className="DAT_CreateRole_Body_Row2">
          <div className="DAT_CreateRole_Body_Row2_Left">
            <div className="DAT_CreateRole_Body_Row2_Left_Content">
              <div className="DAT_CreateRole_Body_Row2_Left_Content_Tit">
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "grey" }}>
                  {dataLang.formatMessage({ id: "account" })}:
                </span>
              </div>
              <select ref={role}>
                <option value="admin">
                  {dataLang.formatMessage({ id: "admin" })}
                </option>
                <option value="user">
                  {dataLang.formatMessage({ id: "user" })}
                </option>
                {/* {datarule.value
                  .filter((item, key) => item.ruleid_ !== 1)
                  .map((item, key) => (
                    <option key={key} value={item.ruleid_}>
                      {item.rulename_}
                    </option>
                  ))} */}
              </select>
            </div>
          </div>

          <div className="DAT_CreateRole_Body_Row2_Right"></div>
        </div>
      </div>
    </form>
  );
}
