import React, { Suspense, useEffect, useState } from "react";
import "./index.scss";

import Alert from "./component/Alert/Alert";
import Navigation from "./component/Navigation/Navigation";
import Sidenar from "./component/Sidenar/Sidenar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClockLoader, PacmanLoader } from "react-spinners";
import Login from "./component/Login/Login";
import Verify from "./component/Verify/Verify";
import { useDispatch, useSelector } from "react-redux";
import { brands, host } from "./component/Lang/Contant";
import adminslice from "./component/Redux/adminslice";
import { callApi } from "./component/Api/Api";
import { signal } from "@preact/signals-react";
import { closed, dataWarn, open } from "./component/Warn/Warn";
import { useIntl } from "react-intl";
import ErrorSetting from "./component/ErrorSetting/ErrorSetting";
import { io } from "socket.io-client";
import NotfoundErr from "./NotfoundErr";
import RegisterSetting from "./component/RegisterSetting/RegisterSetting";
import Solarlight from './component/Solarlight/SLProjectlist'

const Home = React.lazy(() => import("./component/Home/Home"));
const Project = React.lazy(() => import("./component/Project/Project"));
const Device = React.lazy(() => import("./component/Device/Device"));
const Warn = React.lazy(() => import("./component/Warn/Warn"));
const Report = React.lazy(() => import("./component/Report/Report"));
const Analytics = React.lazy(() => import("./component/Analytics/Analytics"));
const User = React.lazy(() => import("./component/User/User"));
const Role = React.lazy(() => import("./component/Role/Role"));
const GroupRole = React.lazy(() => import("./component/GroupRole/GroupRole"));
const Log = React.lazy(() => import("./component/Log/Log"));
const Language = React.lazy(() => import("./component/Language/Language"));
const Contact = React.lazy(() => import("./component/Contact/Contact"));
const Rule = React.lazy(() => import("./component/Rule/Rule"));

export const socket = signal(io.connect(process.env.REACT_APP_SOLAR));
export const phuhosting = signal("http://192.168.68.6:3001");
export const Token = signal({
  token: "",
  date: "",
});

export const userInfor = signal({
  usrid: "",
  name: "",
  phone: "",
  addr: "",
  ruleid: "2",
  partnerid: "1",
  package: "Limited",
  type: "user",
  avatar: "",
});

export const ruleInfor = signal({
  ruleid: "",
  name: "",
  setting: {
    contact: { edit: false },
    device: { add: false, modify: false, remove: false },
    partner: { modify: false },
    project: { add: false, modify: false, remove: false, share: false },
    report: { add: false, modify: false, remove: false },
    rule: { add: false, active: false, modify: false, remove: false },
    user: { add: false, modify: false, remove: false },
    warn: { remove: false },
  },
});

export const partnerInfor = signal({
  partnerid: "",
  code: "",
  name: "",
  phone: "",
  mail: "",
  businessname: "",
  businessmodel: "",
  businesstype: "",
  area: "",
  logo: "",
});

export const COLOR = signal({
  PrimaryColor: "rgba(11, 25, 103)",
  SecondaryColor: "rgba(43, 195, 253)",
  DarkGreenColor: "rgba(0, 163, 0)",
  GreenColor: "rgba(77, 255, 0)",
  DarkOrangeColor: "rgba(247, 148, 29)",
  OrangeColor: "rgba(254, 194, 14)",
  GrayColor: "rgba(95, 95, 98)",
  LightpurpleColor: "rgba(97,88,194,0.8)",
  LightGrayColor: "rgba(233, 233, 233, 0.5)",
  WarningColor: "rgba(255, 0, 0)",
  NoticeColor: "rgba(255, 255, 0)",
  grayText: "grey",
});

export const convertUnit = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2);
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2);
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2);
  } else {
    return value;
  }
};

export const showUnit = (value) => {
  if (value >= 1000000000) {
    return "G";
  } else if (value >= 1000000) {
    return "M";
  } else {
    return "k";
  }
};

export const showUnitk = (value) => {
  if (value >= 1000000) {
    return "G";
  } else if (value >= 1000) {
    return "M";
  } else {
    return "k";
  }
};

export const checkBrand = (brand) => {
  if (brands.INVT.type.find((item) => item == brand)) return 'INVT'
  else if (brands.SUNGROW.type.find((item) => item == brand)) return 'SUNGROW'
  else return 'UNKNOW'
};

export default function App() {
  const dataLang = useIntl();
  const [loading, setLoading] = useState(true);
  const usr = useSelector((state) => state.admin.usr);
  const status = useSelector((state) => state.admin.status);
  const rootDispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (
        window.location.pathname !== "/Verify" &&
        window.location.pathname !== "/VerifyRegister"
      ) {
        let inf = await callApi("get", host.AUTH + "/Inf");
        if (inf.status) {
          rootDispatch(adminslice.actions.setstatus(inf.status));
          rootDispatch(adminslice.actions.setusr(inf.data.usr));
          rootDispatch(adminslice.actions.setlang(inf.data.lang));
          rootDispatch(adminslice.actions.setmail(inf.data.mail));
          userInfor.value = {
            usrid: inf.data.usrid,
            name: inf.data.name,
            phone: inf.data.phone,
            addr: inf.data.addr,
            ruleid: inf.data.ruleid,
            partnerid: inf.data.partnerid,
            package: inf.data.package,
            type: inf.data.type,
            avatar: inf.data.avatar,
          };
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };

    const checkRule = async (id) => {
      const data = await callApi("post", host.AUTH + "/Rule", { ruleid: id });
      if (data.status) {
        ruleInfor.value = {
          ruleid: data.data.ruleid,
          name: data.data.name,
          setting: data.data.setting,
        };
      }
    };

    const checkPartner = async (id) => {
      const data = await callApi("post", host.AUTH + "/Partner", {
        partnerid: id,
      });
      if (data.status) {
        partnerInfor.value = {
          partnerid: data.data.partnerid,
          code: data.data.code,
          name: data.data.name,
          phone: data.data.phone,
          mail: data.data.mail,
          businessname: data.data.businessname,
          businessmodel: data.data.businessmodel,
          businesstype: data.data.businesstype,
          area: data.data.area,
          logo: data.data.logo,
        };
      }
    };

    const checkToken = async () => {
      const d = await callApi("get", host.DATA + "/getToken");
      if (d.status) {
        Token.value = {
          token: d.data.token,
          date: d.data.date,
        };
      }
    };

    const checkApi = async () => { };
    checkAuth();

    if (status) {
      checkRule(userInfor.value.ruleid);
      checkPartner(userInfor.value.partnerid);
      checkToken();
    }
    checkApi();
  }, [status]);

  useEffect(() => {
    const getwarn = async (usr, partnerid, type) => {
      const warn = await callApi("post", host.DATA + "/getWarn", {
        usr: usr,
        partnerid: partnerid,
        type: type,
      });
      if (warn.status) {
        let newdb = warn.data.sort(
          (a, b) => new Date(b.opentime_) - new Date(a.opentime_)
        );
        newdb.map((item, index) => {
          dataWarn.value = [
            ...dataWarn.value,
            {
              boxid: item.boxid_,
              warnid: item.warnid_,
              plant: item.plantname_,
              device: item.sn_,
              status: item.status_,
              opentime: item.opentime_,
              closedtime: item.closedtime_,
              level: item.level_,
              state: item.state_, // 1:false, 0:true
              plantid: item.plantid_,
            },
          ];
        });
        open.value = dataWarn.value.filter((item) => item.status == "open");
        closed.value = dataWarn.value.filter((item) => item.status == "closed");
      }
    };
    if (userInfor.value.type && partnerInfor.value.partnerid && usr) {
      getwarn(usr, partnerInfor.value.partnerid, userInfor.value.type);
    }
  }, [userInfor.value.type, partnerInfor.value.partnerid, usr]);

  const handleOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {userInfor.value.partnerid === "0" ? (
        <div className="DAT_Clock">
          <div className="DAT_Clock_Infor">
            <div className="DAT_Clock_Infor_Tit">
              {dataLang.formatMessage({ id: "notification" })}
            </div>
            <div className="DAT_Clock_Infor_Content">
              {dataLang.formatMessage({ id: "accountLockAlert" })}
            </div>
            <div className="DAT_Clock_Infor_Btn">
              <button
                onClick={() => {
                  handleOut();
                }}
              >
                {dataLang.formatMessage({ id: "quit" })}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Router>
        <Alert />
        {loading ? (
          window.location.pathname === "/Verify" ||
            window.location.pathname === "/VerifyRegister" ? (
            <Verify path={window.location.pathname} />
          ) : (
            <div className="DAT_Loading">
              <PacmanLoader color="#007bff" size={40} loading={loading} />
            </div>
          )
        ) : (
          <>
            {status ? (<><Navigation /><div className="DAT_App"><Sidenar />
              <div className="DAT_App_Content">
                <Routes>
                  {userInfor.value.type === "master" ? (
                    <>
                      <Route path="/Role" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Role /></Suspense>} />
                      <Route path="/GroupRole" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><GroupRole /></Suspense>} />
                      <Route path="/User" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><User /></Suspense>} />
                      <Route path="/Contact" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Contact /></Suspense>} />
                      <Route path="/ErrorSetting" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><ErrorSetting /></Suspense>} />
                      <Route path="/RegisterSetting" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><RegisterSetting /></Suspense>} />
                      <Route path="/Rule" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Rule /></Suspense>} />
                    </>
                  ) : (<></>)}

                  {userInfor.value.type === "mainadmin" || userInfor.value.type === "admin" ? (
                    <>
                      <Route path="/Role" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Role /></Suspense>} />
                      <Route path="/GroupRole" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><NotfoundErr /></Suspense>} />
                      <Route path="/User" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><User /></Suspense>} />
                      <Route path="/Contact" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Contact /></Suspense>} />
                      <Route path="/ErrorSetting" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><ErrorSetting /></Suspense>} />
                      <Route path="/RegisterSetting" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><RegisterSetting /></Suspense>} />
                      <Route path="/Rule" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Rule /></Suspense>} />
                    </>
                  ) : (<></>)}

                  {userInfor.value.type === "user" ? (
                    <>
                      <Route path="/Role" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><NotfoundErr /></Suspense>} />
                      <Route path="/GroupRole" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><NotfoundErr /></Suspense>} />
                      <Route path="/User" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><User /></Suspense>} />
                      <Route path="/Contact" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Contact /></Suspense>} />
                      <Route path="/ErrorSetting" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><NotfoundErr /></Suspense>} />
                      <Route path="/Rule" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><NotfoundErr /></Suspense>} />
                    </>
                  ) : (<></>)}


                  <Route exact path="/" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Home /></Suspense>} />
                  <Route path="/Project" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Project /></Suspense>} />
                  <Route path="/Solarlight" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Solarlight /></Suspense>} />
                  <Route path="/Device" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Device /></Suspense>} />
                  <Route path="/Warn" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Warn /></Suspense>} />
                  <Route path="/Report" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Report /></Suspense>} />
                  <Route path="/Analytics" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Analytics /></Suspense>} />
                  <Route path="/Log" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Log /></Suspense>} />
                  <Route path="/Language" element={<Suspense fallback={<div className="DAT_Loading"><ClockLoader color="#007bff" size={50} loading={loading} /></div>}><Language /></Suspense>} />
                  <Route path="/Login" element={<Navigate to="/" />} />
                  <Route path="/Logout" element={<Navigate to="/Login" />} />
                  <Route path="*" element={<NotfoundErr />} />

                </Routes>
              </div>
            </div>
            </>
            ) : (
              <Login />
            )}
          </>
        )}
      </Router >
    </>
  );
}
