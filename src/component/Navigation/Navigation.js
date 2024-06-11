import React, { useEffect, useRef, useState } from "react";
import "./Navigation.scss";

import { sidenar } from "../../component/Sidenar/Sidenar";
import { Link, useNavigate } from "react-router-dom";
import { signal } from "@preact/signals-react";
import { partnerInfor, userInfor } from "../../App";
import { sidebartab, sidebartabli } from "../../component/Sidenar/Sidenar";
import { useDispatch, useSelector } from "react-redux";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import adminslice from "../Redux/adminslice";
import { dataWarn } from "../Warn/Warn";

import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineLanguage } from "react-icons/md";
import { FaRegMessage } from "react-icons/fa6";
import { plantState, projectwarnfilter } from "../Project/Project";
import { IoLogInOutline } from "react-icons/io5";
import { PiUserCircle } from "react-icons/pi";
import { BiMessageAltX, BiMessageCheck } from "react-icons/bi";

const userNav = signal(false);
const langNav = signal(false);
const langStateNav = signal([false, false]);
const messageContent = signal([]);
const messageOption = signal("default");

export const warnfilter = signal({ warnid: "" });
export const isMobile = signal(false);
export const notifNav = signal(false);

export default function Navigation(props) {
  const dataLang = useIntl();
  const navigate = useNavigate();
  const user_icon = useRef();
  const user_box = useRef();
  const notif_icon = useRef();
  const notif_box = useRef();
  const mail = useSelector((state) => state.admin.mail);
  const lang = useSelector((state) => state.admin.lang);
  const usr = useSelector((state) => state.admin.usr);
  const rootDispatch = useDispatch();
  const [code, setCode] = useState("default");

  const handleWindowResize = () => {
    if (window.innerWidth >= 900) {
      isMobile.value = false;
      messageOption.value = "default";
    } else {
      isMobile.value = true;
      messageOption.value = "mess";
    }
  };

  const handleOutsideLang = () => {
    setTimeout(() => {
      if (langStateNav.value[1] == false) {
        langNav.value = false;
        langStateNav.value = [false, false];
      }
      clearTimeout();
    }, 250);
  };

  let handleOutsideUser = (e) => {
    if (!user_icon.current.contains(e.target)) {
      if (!user_box.current.contains(e.target)) {
        userNav.value = false;
      }
    }
  };

  let handleOutsideNotif = (e) => {
    if (!notif_icon.current.contains(e.target)) {
      if (!notif_box.current.contains(e.target)) {
        notifNav.value = false;
      }
    }
  };

  const handleMenu = (event) => {
    sidenar.value = !sidenar.value;
  };

  let logout = function () {
    //navigate('/Login');
    const setDefault = async () => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/Logout");
      window.location.reload();
    };
    setDefault();
  };

  const handleLang = async (lang_) => {
    let d = await callApi("post", host.DATA + "/updateUser", {
      usr: usr,
      type: "lang",
      data: lang_,
    });
    if (d.status) {
      alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
      rootDispatch(adminslice.actions.setlang(lang_));
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
    }
  };

  const handleFilterWarn = async (e) => {
    projectwarnfilter.value = 0;

    let newdata = dataWarn.value.find(
      (item) => item.warnid == parseInt(e.currentTarget.id)
    );

    warnfilter.value = newdata;
    notifNav.value = false;

    const state = await callApi("post", host.DATA + "/updateWarn", {
      id: e.currentTarget.id,
    });
    if (state.status) {
      notifNav.value = false;
    }
  };

  useEffect(function () {
    if (window.innerWidth >= 900) {
      isMobile.value = false;
      messageOption.value = "default";
    } else {
      isMobile.value = true;
      messageOption.value = "mess";
    }

    document.addEventListener("mousedown", handleOutsideUser);
    document.addEventListener("mousedown", handleOutsideNotif);
    window.addEventListener("resize", handleWindowResize);
    return () => {
      document.removeEventListener("mousedown", handleOutsideUser);
      document.removeEventListener("mousedown", handleOutsideNotif);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        notifNav.value = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="DAT_Navigation"
        onClick={() => (plantState.value = "default")}
      >
        <div className="DAT_Navigation-menu">
          <button
            id="DAT_menuaction"
            onClick={(event) => {
              handleMenu(event);
            }}
          >
            <BsFillMenuButtonWideFill color="rgba(11, 25, 103)" size={22} />
          </button>
        </div>

        <div className="DAT_Navigation_left">
          <div className="DAT_Navigation_left-logo">
            <img
              onClick={() => navigate("/")}
              src={
                partnerInfor.value.logo
                  ? partnerInfor.value.logo
                  : "/dat_icon/logo_DAT.png"
              }
              alt=""
              style={{ height: "40px", cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="DAT_Navigation_right">
          <button className="DAT_Navigation_right-item"
            id="notif"
            onClick={() => (notifNav.value = !notifNav.value)}
            ref={notif_icon}
          >
            <IoIosNotificationsOutline color="rgba(11, 25, 103)" size={22} />

            {dataWarn.value.filter((item) => item.state == 1).length === 0 ? (
              <></>
            ) : (
              <span>
                {dataWarn.value.filter((item) => item.state == 1).length}
              </span>
            )}
          </button>

          <button className="DAT_Navigation_right-language"
            id="lang"
            onClick={() => {
              langNav.value = true;
              langStateNav.value = [true, false];
            }}
            onMouseLeave={() => handleOutsideLang()}
          >
            <MdOutlineLanguage color="rgba(11, 25, 103)" size={22} />
            <span>{lang === "vi" ? "Vi" : "En"}</span>
          </button>

          <button className="DAT_Navigation_right-item"
            id="user"
            style={{
              backgroundColor: "rgba(159, 155, 155, 0.4)",
              overflow: "hidden",
            }}
            onClick={() => (userNav.value = !userNav.value)}
            ref={user_icon}
          >
            <img
              src={
                userInfor.value.avatar
                  ? userInfor.value.avatar
                  : "/dat_icon/user_manager.png"
              }
              alt=""
            />
          </button>
        </div>
      </div>

      <div className="DAT_NavUser"
        style={{ display: userNav.value ? "block" : "none" }}
        ref={user_box}
      >
        <div className="DAT_NavUser-inf">
          <div className="DAT_NavUser-inf-img">
            <img
              src={
                userInfor.value.avatar
                  ? userInfor.value.avatar
                  : "/dat_icon/user_manager.png"
              }
              alt=""
            />
          </div>

          <div className="DAT_NavUser-inf-content">
            <div className="DAT_NavUser-inf-content-name">
              {userInfor.value.name}
            </div>
            <div className="DAT_NavUser-inf-content-email">{mail}</div>
          </div>
        </div>

        <div
          className="DAT_NavUser-item"
          style={{ cursor: "pointer", borderBottom: "1px solid gray" }}
          onClick={() => {
            navigate("/User");
            sidebartab.value = "Setting";
            sidebartabli.value = "/User";
          }}
        >
          <PiUserCircle size={18} />
          &nbsp;
          <span>{dataLang.formatMessage({ id: "account" })}</span>
        </div>

        <div className="DAT_NavUser-item" onClick={() => logout()}>
          <IoLogInOutline size={18} />
          &nbsp;
          <span>{dataLang.formatMessage({ id: "logout" })}</span>
        </div>
      </div>

      <div className="DAT_NavNotif"
        style={{ display: notifNav.value ? "block" : "none" }}
        ref={notif_box}
      >
        <div className="DAT_NavNotif-title">
          <span>{dataLang.formatMessage({ id: "notification" })}</span>
        </div>

        <div className="DAT_NavNotif-content">
          <div className="DAT_NavNotif-content-main">
            {dataWarn.value.length !== 0 ? (
              <>
                {dataWarn.value.map((item, index) => (
                  <div className="DAT_NavNotif-content-main-group" key={index}>
                    <div className="DAT_NavNotif-content-main-group-datetime">
                      {item.opentime}
                    </div>
                    <Link
                      to="/Warn"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="DAT_NavNotif-content-main-group-content"
                        id={item.warnid}
                        style={{
                          textDecoration: "none",
                          backgroundColor:
                            parseInt(item.state) == 0
                              ? "rgb(201, 201, 201, 0.3)"
                              : "white",
                        }}
                        onClick={(e) => {
                          handleFilterWarn(e);
                          sidebartab.value = "Monitor";
                          sidebartabli.value = "/Warn";
                          item.state = 0;
                        }}
                      >
                        <div className="DAT_NavNotif-content-main-group-content-tit">
                          <span>
                            {dataLang.formatMessage({ id: item.boxid, defaultMessage: item.boxid })}
                          </span>
                          &nbsp;
                          {dataLang.formatMessage({ id: "at" })}
                          &nbsp;
                          {item.plant}
                        </div>
                        <div className="DAT_NavNotif-content-main-group-content-device">
                          {dataLang.formatMessage({ id: "device" })}: &nbsp;
                          <span style={{ color: "black" }}>{item.device}</span>
                        </div>
                        <div className="DAT_NavNotif-content-main-group-content-level">
                          {dataLang.formatMessage({ id: "level" })}: &nbsp;
                          <span
                            style={{
                              fontFamily: "Montserrat-SemiBold",
                              color: item.level == "warn" ? "red" : "rgba(247, 148, 29)",
                              // textTransform: "capitalize",
                            }}
                          >
                            {dataLang.formatMessage({ id: item.level })}
                          </span>
                        </div>
                        <div className="DAT_NavNotif-content-main-group-content-status">
                          {dataLang.formatMessage({
                            id: "remindAlert",
                          })}
                          <div className="DAT_NavNotif-content-main-group-content-status-read">
                            {item.state == 0 ? (
                              <div style={{ color: "grey", display: "flex", gap: "4px" }}>
                                {dataLang.formatMessage({ id: "readNotif" })}
                                <BiMessageCheck />
                              </div>
                            ) : (
                              <div style={{ color: "rgba(11, 25, 103)", display: "flex", gap: "4px", fontFamily: "Montserrat-SemiBold" }}>
                                {dataLang.formatMessage({ id: "unreadNotif" })}

                                <BiMessageAltX />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <div className="DAT_NavNotif-content-main-empty">
                <FaRegMessage size={60} color="gray" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="DAT_NavLang"
        style={{ display: langNav.value ? "block" : "none" }}
        onMouseEnter={() => {
          langStateNav.value = [true, true];
        }}
        onMouseLeave={() => {
          langNav.value = false;
          langStateNav.value = [false, false];
        }}
      >
        <div className="DAT_NavLang-item"
          style={{
            backgroundColor: lang === "vi" ? "rgba(43, 195, 253)" : "white",
            color: lang === "vi" ? "white" : "black",
          }}
          onClick={() => {
            handleLang("vi");
          }}
        >
          <span>Tiếng Việt</span>
        </div>
        <div className="DAT_NavLang-item"
          style={{
            backgroundColor: lang === "en" ? "rgba(43, 195, 253)" : "white",
            color: lang === "en" ? "white" : "black",
          }}
          onClick={() => {
            handleLang("en");
          }}
        >
          <span>English</span>
        </div>
      </div>
    </>
  );
}
