import React, { useEffect, useState } from "react";
import "./Login.scss";

import { useIntl } from "react-intl";
import { alertDispatch } from "../Alert/Alert";
import { useDispatch } from "react-redux";
import adminslice from "../Redux/adminslice";
import { host } from "../Lang/Contant";
import { signal } from "@preact/signals-react";
import { callApi } from "../Api/Api";

import { CiBarcode, CiMail, CiUser } from "react-icons/ci";
import { MdLanguage, MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";
import { LuUserCheck } from "react-icons/lu";
import { BsTelephoneInbound } from "react-icons/bs";
import { HiOutlineMapPin } from "react-icons/hi2";
import { IoMdArrowBack } from "react-icons/io";

const tab = signal("login");

export default function Login(props) {
  const dataLang = useIntl();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [mail, setMail] = useState("");
  const [newpwd, setNewpwd] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [savepwd, setSavepwd] = useState(false);
  const [join, setJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const rootDispatch = useDispatch();
  const [showpass, setShowpass] = useState(false);
  const [showpass2, setShowpass2] = useState(false);
  const [OTP, setOTP] = useState("");
  const [joinOTP, setJoinOTP] = useState("");
  const [lang, setLang] = useState("vi");
  //const status = useSelector((state) => state.admin.status)

  const colorWhite = "white";

  useEffect(function () {
    setOTP(generateOTP());
    rootDispatch(adminslice.actions.setlang(lang));
  }, []);

  const generateOTP = () => {
    let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let OTP_ = "";

    for (let i = 0; i < 6; i++) {
      OTP_ += digits[Math.floor(Math.random() * 10)];
    }
    return OTP_;
  };

  const handleLogin = function (e) {
    e.preventDefault();

    let auth = async () => {
      let res = await callApi("post", host.AUTH + "/Login", {
        username: user,
        password: pass,
        lang: lang,
      });
      if (res.status) {
        if (savepwd) {
          localStorage.setItem("token", JSON.stringify(res.accessToken));
        } else {
          sessionStorage.setItem("token", JSON.stringify(res.accessToken));
        }
        window.location.reload();
        rootDispatch(adminslice.actions.setstatus(res.status));
        rootDispatch(adminslice.actions.setusr(res.user));
      } else {
        localStorage.clear();
        sessionStorage.clear();
        alertDispatch(dataLang.formatMessage({ id: "alert_0" }));
      }
    };

    auth();
  };

  const handleOTP = function (e) {
    //e.preventDefault();

    let sendOTP = async () => {
      let OTP_ = generateOTP();
      setOTP(OTP_);
      let res = await callApi("post", host.AUTH + "/SendOTP", {
        mail: mail,
        otp: OTP_,
        host: window.location.host,
      });
      console.log(res);
      if (res.status) {
        alertDispatch(dataLang.formatMessage({ id: "alert_13" }));
      } else {
        alertDispatch(dataLang.formatMessage({ id: "alert_14" }));
      }
    };
    if (mail) {
      sendOTP();
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_15" }));
    }
  };

  const handleAuth = function (e) {
    e.preventDefault();
    if (joinOTP === OTP) {
      tab.value = "pwd";
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_12" }));
    }
  };

  const handlePwd = function (e) {
    e.preventDefault();

    let resetpwd = async () => {
      let res = await callApi("post", host.AUTH + "/ResetPassword", {
        mail: mail,
        password: newpwd,
      });
      console.log(res);
      if (res.status) {
        tab.value = "otp";
        setJoinOTP("");
        setOTP(generateOTP());
        alertDispatch(dataLang.formatMessage({ id: "alert_1" }));
      } else {
        if (res.number) {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_3" }));
        }
      }
    };

    if (newpwd !== pass) {
      alertDispatch(dataLang.formatMessage({ id: "alert_5" }));
    } else {
      resetpwd();
    }
  };

  const handleRegister = function (e) {
    e.preventDefault();

    let register = async () => {
      let res = await callApi("post", host.AUTH + "/CheckUser", {
        usr: user,
        mail: mail,
        code: join ? joinCode : "S01",
      });
      if (res.status) {
        let res = await callApi("post", host.AUTH + "/Register", {
          usr: user,
          mail: mail,
          pwd: newpwd,
          name: name,
          phone: phone,
          addr: addr,
          type: "user",
          code: join ? joinCode : "S01",
          host: window.location.host,
        });
        if (res.status) {
          tab.value = "note";
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
      } else {
        if (res.number === 1) {
          alertDispatch(dataLang.formatMessage({ id: "alert_16" }));
        } else if (res.number === 0) {
          alertDispatch(dataLang.formatMessage({ id: "alert_10" }));
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
      }
    };

    if (newpwd !== pass) {
      alertDispatch(dataLang.formatMessage({ id: "alert_5" }));
    } else {
      register();
    }
  };

  const handleLang = function () {
    rootDispatch(adminslice.actions.setlang(lang === "vi" ? "en" : "vi"));
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <div className="DAT_Login">
      <div className="DAT_Login_Head">
        <div className="DAT_Login_Head_Logo">
          <img src={"/dat_icon/Embody_APP_24.png"} alt="" />
        </div>

        <div className="DAT_Login_Head_Title">
          <div className="DAT_Login_Head_Title_Main">
            {/* <img src={"/dat_icon/Embody_APP_27.png"} width={'150px'} height={'30px'} alt='' ></img> */}
            AIOT Energy
          </div>
          <div className="DAT_Login_Head_Title_Sub">
            {dataLang.formatMessage({ id: "sologon" })}{" "}
          </div>
        </div>

        <div
          className="DAT_Login_Head_Lang"
          onClick={(e) => {
            handleLang(e);
          }}
        >
          <span>{lang === "vi" ? "Vi" : "En"}</span>
          <span>
            <MdLanguage color={colorWhite} size={24} />
          </span>
        </div>
      </div>

      {(() => {
        switch (tab.value) {
          case "register_2":
            return (
              <form className="DAT_Login_Form" onSubmit={handleRegister}>
                <p>{dataLang.formatMessage({ id: "register" })}</p>
                <div className="DAT_Login_Form-input">
                  <CiMail color={colorWhite} size={24} />
                  <input
                    type="email"
                    placeholder={dataLang.formatMessage({ id: "email" })}
                    required
                    value={mail}
                    onChange={(e) => {
                      setMail(e.target.value);
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-input">
                  <MdPassword color={colorWhite} size={24} />
                  <input
                    type={showpass ? "text" : "password"}
                    placeholder={dataLang.formatMessage({ id: "password" })}
                    required
                    minLength="6"
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                  {showpass ? (
                    <FaRegEye
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  )}
                </div>

                <div className="DAT_Login_Form-input">
                  <TbPasswordFingerprint color={colorWhite} size={24} />
                  <input
                    type={showpass2 ? "text" : "password"}
                    placeholder={dataLang.formatMessage({ id: "auth_pwd" })}
                    required
                    minLength="6"
                    value={newpwd}
                    onChange={(e) => {
                      setNewpwd(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                  {showpass2 ? (
                    <FaRegEye
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass2(!showpass2)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass2(!showpass2)}
                    />
                  )}
                </div>

                <div
                  className="DAT_Login_Form-box"
                  style={{ marginBottom: join ? "10px" : "20px" }}
                >
                  <input
                    id="savepwd"
                    type="checkbox"
                    checked={join}
                    onChange={(e) => setJoin(e.target.checked)}
                  />
                  <label htmlFor="savepwd" />
                  {dataLang.formatMessage({ id: "join" })}
                </div>

                {join ? (
                  <div className="DAT_Login_Form-input">
                    <CiBarcode color={colorWhite} size={24} />
                    <input
                      type="text"
                      placeholder={dataLang.formatMessage({ id: "join" })}
                      minLength={3}
                      required={join}
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value.trim());
                      }}
                      autoComplete="on"
                    />
                  </div>
                ) : (
                  <></>
                )}

                <button>{dataLang.formatMessage({ id: "register" })}</button>

                <div className="DAT_Login_Form-footer">
                  <span onClick={() => (tab.value = "register_1")}>
                    {dataLang.formatMessage({ id: "previous" })}
                  </span>
                  <span onClick={() => (tab.value = "login")}>
                    {dataLang.formatMessage({ id: "login" })}
                  </span>
                </div>
              </form>
            );
          case "register_1":
            return (
              <form
                className="DAT_Login_Form"
                onSubmit={(e) => {
                  e.preventDefault();
                  tab.value = "register_2";
                }}
              >
                <p>{dataLang.formatMessage({ id: "register" })}</p>
                <div className="DAT_Login_Form-input">
                  <CiUser color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "username" })}
                    minLength={4}
                    required
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value.trim().toLocaleLowerCase());
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-input">
                  <LuUserCheck color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "name" })}
                    minLength={6}
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-input">
                  <BsTelephoneInbound color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "phone" })}
                    required
                    value={phone}
                    minLength={10}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-input">
                  <HiOutlineMapPin color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "addr" })}
                    minLength={6}
                    required
                    value={addr}
                    onChange={(e) => {
                      setAddr(e.target.value);
                    }}
                    autoComplete="on"
                  />
                </div>

                <button>{dataLang.formatMessage({ id: "next" })}</button>

                <div className="DAT_Login_Form-footer">
                  <span></span>
                  <span onClick={() => (tab.value = "login")}>
                    {dataLang.formatMessage({ id: "login" })}
                  </span>
                </div>
              </form>
            );
          case "otp":
            return (
              <form className="DAT_Login_Form" onSubmit={handleAuth}>
                <p>{dataLang.formatMessage({ id: "confirm" })}</p>
                <div className="DAT_Login_Form-input">
                  <CiMail color={colorWhite} size={24} />
                  <input
                    type="email"
                    placeholder={dataLang.formatMessage({ id: "email" })}
                    required
                    value={mail}
                    onChange={(e) => {
                      setMail(e.target.value);
                    }}
                    autoComplete="on"
                  />
                </div>
                <div className="DAT_Login_Form-input">
                  <CiBarcode color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "OTP" })}
                    minLength={4}
                    required
                    value={joinOTP}
                    onChange={(e) => {
                      setJoinOTP(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-box">
                  <span
                    onClick={(e) => handleOTP(e)}
                    style={{ cursor: "pointer", color: "#6495ed" }}
                  >
                    {dataLang.formatMessage({ id: "sendOTP" })}
                  </span>
                </div>

                <button>{dataLang.formatMessage({ id: "next" })}</button>

                <div className="DAT_Login_Form-footer">
                  <span
                    className="DAT_Login_Form-footer-back"
                    onClick={() => (tab.value = "login")}
                  >
                    <IoMdArrowBack size={18} />
                    {dataLang.formatMessage({ id: "previous" })}
                  </span>
                </div>
              </form>
            );
          case "pwd":
            return (
              <form className="DAT_Login_Form" onSubmit={handlePwd}>
                <p>{dataLang.formatMessage({ id: "pwd" })}</p>

                <div className="DAT_Login_Form-input">
                  <MdPassword color={colorWhite} size={24} />
                  <input
                    type={showpass ? "text" : "password"}
                    placeholder={dataLang.formatMessage({ id: "new_pwd" })}
                    required
                    minLength="6"
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                  {showpass ? (
                    <FaRegEye
                      color="gray"
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color="gray"
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  )}
                </div>

                <div className="DAT_Login_Form-input">
                  <TbPasswordFingerprint color="gray" size={24} />
                  <input
                    type={showpass2 ? "text" : "password"}
                    placeholder={dataLang.formatMessage({ id: "auth_pwd" })}
                    required
                    minLength="6"
                    value={newpwd}
                    onChange={(e) => {
                      setNewpwd(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                  {showpass2 ? (
                    <FaRegEye
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass2(!showpass2)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass2(!showpass2)}
                    />
                  )}
                </div>

                <button>{dataLang.formatMessage({ id: "update" })}</button>

                <div className="DAT_Login_Form-footer">
                  <span></span>
                  <span onClick={() => (tab.value = "login")}>
                    {dataLang.formatMessage({ id: "login" })}
                  </span>
                </div>
              </form>
            );
          case "login":
            return (
              <form className="DAT_Login_Form" onSubmit={handleLogin}>
                <p>{dataLang.formatMessage({ id: "login" })}</p>
                <div className="DAT_Login_Form-input">
                  <CiUser color={colorWhite} size={24} />
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "username" })}
                    required
                    minLength="4"
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value.trim().toLocaleLowerCase());
                    }}
                    autoComplete="on"
                  />
                </div>

                <div className="DAT_Login_Form-input">
                  <MdPassword color={colorWhite} size={24} />
                  <input
                    type={showpass ? "text" : "password"}
                    placeholder={dataLang.formatMessage({ id: "password" })}
                    required
                    minLength="4"
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value.trim());
                    }}
                    autoComplete="on"
                  />
                  {showpass ? (
                    <FaRegEye
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color={colorWhite}
                      size={24}
                      onClick={() => setShowpass(!showpass)}
                    />
                  )}
                </div>

                <div className="DAT_Login_Form-box">
                  <input
                    id="savepwd"
                    type="checkbox"
                    checked={savepwd}
                    onChange={(e) => setSavepwd(e.target.checked)}
                  />
                  <label htmlFor="savepwd" />
                  {dataLang.formatMessage({ id: "save_login" })}
                </div>

                <button>{dataLang.formatMessage({ id: "login" })}</button>

                <div className="DAT_Login_Form-footer">
                  <span onClick={() => (tab.value = "register_1")}>
                    {dataLang.formatMessage({ id: "register" })}
                  </span>
                  <span onClick={() => (tab.value = "otp")}>
                    {dataLang.formatMessage({ id: "forgot_pwd" })}
                  </span>
                </div>
              </form>
            );
          default:
            return (
              <form className="DAT_Login_Form" onSubmit={handleLogin}>
                <p>DAT GROUP</p>
                <div
                  className="DAT_Login_Form-note"
                  style={{ textAlign: "justify" }}
                >
                  {dataLang.formatMessage({ id: "alert_8" })}
                </div>

                <div className="DAT_Login_Form-footer">
                  <span></span>
                  <span onClick={() => (tab.value = "login")}>
                    {dataLang.formatMessage({ id: "login" })}
                  </span>
                </div>
              </form>
            );
        }
      })()}

      <div className="DAT_Login_Footer">
        <div className="DAT_Login_Footer_Info">
          <span className="DAT_Login_Footer_Info_Version">
            {dataLang.formatMessage({ id: "version" })}:{" "}
            {process.env.REACT_APP_VER}
          </span>
          &nbsp;
          <span className="DAT_Login_Footer_Info_Title">Embody Platform</span>
        </div>
      </div>
    </div>
  );
}
