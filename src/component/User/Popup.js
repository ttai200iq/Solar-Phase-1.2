import React, { useEffect, useRef, useState } from "react";
import "./User.scss";

import { alertDispatch } from "../Alert/Alert";
import Resizer from "react-image-file-resizer";
import { userInfor } from "../../App";
import { callApi } from "../Api/Api";
import { useSelector } from "react-redux";
import { host } from "../Lang/Contant";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

export default function Popup(props) {
  const dataLang = useIntl();
  const user = useSelector((state) => state.admin.usr);
  const [oldpass, setOldpass] = useState(true);
  const [newpass, setNewpass] = useState(true);
  const [ava, setAva] = useState(userInfor.value.avatar ? userInfor.value.avatar : "/dat_icon/user_manager.png");
  const [confirmpass, setConfirmpass] = useState(true);
  const oldpassRef = useRef();
  const newpassRef = useRef();
  const confirmpassRef = useRef();
  const renameRef = useRef(userInfor.value.name);
  const phoneRef = useRef(userInfor.value.phone);
  const addrRef = useRef(userInfor.value.addr);

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

  const handleSave = async () => {
    switch (props.editType) {
      case "avatar":
        let d = await callApi("post", host.DATA + "/updateUser", { usr: user, type: "avatar", data: ava });
        if (d.status) {
          alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
          userInfor.value = {
            ...userInfor.value,
            avatar: ava
          }
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
        props.handleClose();
        break;
      case "password":
        if (oldpassRef.current.value !== "" && newpassRef.current.value !== "" && confirmpassRef.current.value !== "" && oldpassRef.current.value !== newpassRef.current.value) {
          if (newpassRef.current.value === confirmpassRef.current.value) {
            let d = await callApi("post", host.AUTH + "/ChangePassword", { usr: user, type: "password", oldpass: oldpassRef.current.value, newpass: confirmpassRef.current.value });
            if (d.status) {
              alertDispatch(dataLang.formatMessage({ id: "alert_1" }));
              props.handleClose();
            } else {
              if (d.number) {
                alertDispatch(dataLang.formatMessage({ id: "alert_5" }));
              } else if (d.number == 0) {
                alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
              }
            }
          } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_5" }));
          }
        } else if (oldpassRef.current.value == "" || newpassRef.current.value == "" || confirmpassRef.current.value == "") {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_4" }));
        }
        break;
      case "name":
        if (renameRef.current.value !== "") {
          let d = await callApi("post", host.DATA + "/updateUser", { usr: user, type: "name", data: renameRef.current.value });
          if (d.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
            userInfor.value = {
              ...userInfor.value,
              name: renameRef.current.value
            }
          } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
          }
          props.handleClose();
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        }
        break;
      case "phone":
        if (phoneRef.current.value !== "") {
          let d = await callApi("post", host.DATA + "/updateUser", { usr: user, type: "phone", data: phoneRef.current.value });
          if (d.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
            userInfor.value = {
              ...userInfor.value,
              phone: phoneRef.current.value
            }
          } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
          }
          props.handleClose();
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        }
        break;
      case "addr":
        if (addrRef.current.value !== "") {
          let d = await callApi("post", host.DATA + "/updateUser", { usr: user, type: "addr", data: addrRef.current.value });
          if (d.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
            userInfor.value = {
              ...userInfor.value,
              addr: addrRef.current.value
            }
          } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
          }
          props.handleClose();
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        }
        break;
      default:
        break;
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
    <div className="DAT_PopupUser_Box">
      <div className="DAT_PopupUser_Box_Head">
        <div className="DAT_PopupUser_Box_Head_Left">
          {dataLang.formatMessage({ id: 'edits' })}
        </div>
        <div className="DAT_PopupUser_Box_Head_Right">
          <div className="DAT_PopupUser_Box_Head_Right_Icon"
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            onClick={() => (props.handleClose())}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_PopupUser_Box_Body">
        {(() => {
          switch (props.editType) {
            case "avatar":
              return (
                <div className="DAT_PopupUser_Box_Body_Avatar">
                  <div className="DAT_PopupUser_Box_Body_Avatar_Cover">
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
              );
            case "password":
              return (
                <div className="DAT_PopupUser_Box_Body_Info">
                  <label>
                    {dataLang.formatMessage({ id: 'curr_pwd' })}
                  </label>
                  <div className="DAT_PopupUser_Box_Body_Info_Input">
                    <div className="DAT_PopupUser_Box_Body_Info_Input_Pack">
                      <input
                        type={oldpass === true ? "password" : "text"}
                        ref={oldpassRef}
                      />
                      <label onClick={() => setOldpass(!oldpass)}>
                        {oldpass === false ? (
                          <LiaEyeSolid size={20} />
                        ) : (
                          <LiaEyeSlashSolid size={20} />
                        )}
                      </label>
                    </div>
                  </div>
                  <label>
                    {dataLang.formatMessage({ id: 'new_pwd' })}
                  </label>
                  <div className="DAT_PopupUser_Box_Body_Info_Input">
                    <div className="DAT_PopupUser_Box_Body_Info_Input_Pack">
                      <input
                        type={newpass === true ? "password" : "text"}
                        ref={newpassRef}
                      />
                      <label>
                        {newpass === false ? (
                          <LiaEyeSolid
                            size={20}
                            onClick={() => setNewpass(!newpass)}
                          />
                        ) : (
                          <LiaEyeSlashSolid
                            size={20}
                            onClick={() => setNewpass(!newpass)}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                  <label>
                    {dataLang.formatMessage({ id: 'auth_pwd' })}:
                  </label>
                  <div className="DAT_PopupUser_Box_Body_Info_Input"
                    style={{ marginBottom: "0px" }}
                  >
                    <div className="DAT_PopupUser_Box_Body_Info_Input_Pack">
                      <input
                        type={confirmpass === true ? "password" : "text"}
                        ref={confirmpassRef}
                      />
                      <label onClick={() => setConfirmpass(!confirmpass)}>
                        {confirmpass === false ? (
                          <LiaEyeSolid size={20} />
                        ) : (
                          <LiaEyeSlashSolid size={20} />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              );
            case "name":
              return (
                <div className="DAT_PopupUser_Box_Body_Info">
                  <label>
                    {dataLang.formatMessage({ id: 'name' })}
                  </label>
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: 'name' })}
                    defaultValue={userInfor.value.name} ref={renameRef}
                  />
                </div>
              );
            case "phone":
              return (
                <div className="DAT_PopupUser_Box_Body_Info">
                  <label>
                    {dataLang.formatMessage({ id: 'phone' })}
                  </label>
                  <input
                    type="number"
                    placeholder={dataLang.formatMessage({ id: 'phone' })}
                    defaultValue={userInfor.value.phone} ref={phoneRef}
                  />
                </div>
              );
            case "addr":
              return (
                <div className="DAT_PopupUser_Box_Body_Info">
                  <label>
                    {dataLang.formatMessage({ id: 'address' })}
                  </label>
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: 'address' })}
                    defaultValue={userInfor.value.addr} ref={addrRef}
                  />
                </div>
              );
            default:
              break;
          }
        })()}
      </div>

      <div className="DAT_PopupUser_Box_Foot">
        <button
          onClick={() => handleSave()}
        >
          {dataLang.formatMessage({ id: 'save' })}
        </button>
      </div>
    </div>
  );
}
