import React, { useEffect, useState, useRef } from "react";
import "./Project.scss";

import AddGateway from "./AddGateway";
import Weather from "./Weather";
import Popup from "./Popup";
import Info from "../Device/Info";
import DashboardHistory from "./DashboardHistory";
import ProjectInfo from "./ProjectInfo";
import Benefit from "./Benefit";
import { Empty, plantState, projectData, popupState } from "./Project";
import { isMobile } from "../Navigation/Navigation";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR, Token, checkBrand, ruleInfor, socket } from "../../App";
import { info, tab } from "../Device/Device";
import { useDispatch, useSelector } from "react-redux";
import { signal } from "@preact/signals-react";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useIntl } from "react-intl";
import toolslice from "../Redux/toolslice";

import { IoIosArrowDown, IoIosArrowForward, IoMdMore } from "react-icons/io";
import { IoAddOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiFilter } from "react-icons/fi";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import GraphComponent from "./GraphComponent";
import { isDesktop } from "../Home/Home";

export const temp = signal([]);
export const inverterDB = signal([]);
export const coalsave = signal({
  value: 0,
  ef: 0.7221,
  avr: 0.517,
  tree: 0.054,
});

export const projectdatasize = signal({
  icon: { fontSize: 35 },
  label: { fontSize: 15 },
  value: { fontSize: 26 },
  unit: { fontSize: 18 },
  valuepro: { fontSize: 28 },
  unitpro: { fontSize: 26 },
  boxpro: { fontSize: 150 },
});

const tabMobile = signal(false);
const tabLable = signal("");
export const tab_ = signal("logger");
const viewNav = signal(false);
const viewStateNav = signal([false, false]);

export default function ProjectData(props) {
  const dataLang = useIntl();
  const { isLandscape } = useMobileOrientation();
  const lang = useSelector((state) => state.admin.lang);
  const user = useSelector((state) => state.admin.usr);
  const [view, setView] = useState("dashboard");
  const [dropState, setDropState] = useState(false);
  const [infoState, setInfoState] = useState(false);
  const [popupAddGateway, setPopupAddGateway] = useState(false);
  const [snlogger, setSnlogger] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [devname, setDevname] = useState("");
  const [devtype, setDevtype] = useState("");
  const [type, setType] = useState("");
  const [invt, setInvt] = useState({});
  const [getShared, setgetShared] = useState([]);
  const box = useRef();
  const rootDispatch = useDispatch();

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const listDeviceTab = [
    { id: "logger", name: "Logger" },
    { id: "inverter", name: "Inverter" },
    // { id: "meter", name: "Meter" },
  ];

  const columnInverter = [
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => (
        <div
          onClick={(e) => handleInfoInverter(e)}
          style={{ cursor: "pointer" }}
        >
          <div>{row.name}</div>
          <div style={{ color: "grey" }}>{row.sn}</div>
        </div>
      ),
      sortable: true,
      minWidth: "350px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "status" }),
      selector: (row) => {
        return <div>
          {(() => {
            switch (checkBrand(row.type)) {
              case 'SUNGROW':
                return <>
                  {invt[row.logger_]?.[row.data.status] == 64 || 1024 || 2048 || 4096 || 16384
                    ? <FaCheckCircle size={20} color="green" />
                    : <MdOutlineError size={22} color="red" />
                  }
                </>;
              default:
                return <>
                  {invt[row.logger_]?.[row.data.status] == 2
                    ? <FaCheckCircle size={20} color="green" />
                    : <MdOutlineError size={22} color="red" />
                  }
                </>;
            }
          })()}
        </div>;
      },
      width: "110px",
    },
    {
      name: dataLang.formatMessage({ id: "production" }),
      selector: (row) => {
        let power = 0;
        let d = JSON.parse(row.data.total?.register || "[]");

        switch (row.data.total?.type) {
          case "sum":
            let num = [];
            d.map((item, i) => { return num[i] = parseFloat(invt[row.logger_]?.[item] || 0) });
            power = parseFloat(num.reduce((a, b) => Number(a) + Number(b), 0) * row.data.total?.cal).toFixed(2);
            break;
          case "word":
            power = convertToDoublewordAndFloat([invt[row.logger_]?.[d[0]], invt[row.logger_]?.[d[1]]], "int") * row.data.total?.cal;
            break;
          default:
            break;
        };

        return <div>{parseFloat(power / 1000).toFixed(2)} kW</div>;
      },
      sortable: true,
      width: "200px",
    },
    {
      name: dataLang.formatMessage({ id: "daily" }),
      selector: (row) => (
        <>
          {row.data.daily?.register
            ? parseFloat(invt[row.logger_]?.[row.data.daily.register] * row.data.daily?.cal).toFixed(2)
            : 0
          }{" "}
          kWh
        </>
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: dataLang.formatMessage({ id: "ogLog" }),
      selector: (row) => row.logger_,
      sortable: true,
      width: "300px",
    },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <>
          {ruleInfor.value.setting.project.modify === true ||
            ruleInfor.value.setting.project.delete === true ? (
            projectData.value.shared == 1 ? (
              <></>
            ) : (
              // <div className="DAT_TableEdit">
              //   <span
              //     id={row.sn + "_MORE"}
              //     // onMouseEnter={(e) => handleModify(e, "block")}
              //     onClick={(e) => handleModify(e, "block")}
              //   >
              //     <IoMdMore size={20} />
              //   </span>
              // </div>
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div className="DAT_TableEdit">
                    <IoMdMore size={20} {...bindToggle(popupState)} />
                    <Menu {...bindMenu(popupState)}>
                      {ruleInfor.value.setting.project.modify === true ? (
                        <MenuItem
                          id={`${row.sn}_${row.name}_edit`}
                          onClick={(e) => {
                            handleEdit(e);
                            popupState.close();
                          }}
                        >
                          <FiEdit size={14} />
                          &nbsp;
                          {dataLang.formatMessage({ id: "change" })}
                        </MenuItem>
                      ) : (
                        <></>
                      )}
                    </Menu>
                  </div>
                )}
              </PopupState>
            )
          ) : (
            <div></div>
          )}
          {/* <div
            className="DAT_ModifyBox"
            id={row.sn + "_Modify"}
            style={{ display: "none" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div
              className="DAT_ModifyBox_Fix"
              id={`${row.sn}_${row.name}_edit`}
              onClick={(e) => handleEdit(e)}
            >
              <FiEdit size={14} />
              &nbsp;
              {dataLang.formatMessage({ id: "change" })}
            </div>
           
          </div> */}
        </>
      ),
      width: "100px",
    },
  ];

  const columnLogger = [
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => (
        <div style={{ cursor: "pointer" }} onClick={(e) => handleInfoLogger(e)}>
          <div>{row.name}</div>
          <div style={{ color: "grey" }}>{row.sn}</div>
        </div>
      ),
      sortable: true,
      // minWidth: "350px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "status" }),
      selector: (row) => (
        <>
          {row.state === 1 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </>
      ),
      // width: "110px",
    },
    {
      name: dataLang.formatMessage({ id: "type" }),
      selector: (row) => row.type,
      sortable: true,
      // width: "180px",
    },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <>
          {ruleInfor.value.setting.project.modify === true ||
            ruleInfor.value.setting.project.delete === true ? (
            projectData.value.shared == 1 ? (
              <></>
            ) : (
              // <div className="DAT_TableEdit">
              //   <span
              //     id={row.sn + "_MORE"}
              //     // onMouseEnter={(e) => handleModify(e, "block")}
              //     onClick={(e) => handleModify(e, "block")}
              //   >
              //     <IoMdMore size={20} />
              //   </span>
              // </div>
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div className="DAT_TableEdit">
                    <IoMdMore size={20} {...bindToggle(popupState)} />
                    <Menu {...bindMenu(popupState)}>
                      {ruleInfor.value.setting.project.modify === true ? (
                        <MenuItem
                          id={`${row.sn}_${row.name}_edit`}
                          onClick={(e) => {
                            handleEdit(e);
                            popupState.close();
                          }}
                        >
                          <FiEdit size={14} />
                          &nbsp;
                          {dataLang.formatMessage({ id: "change" })}
                        </MenuItem>
                      ) : (
                        <></>
                      )}
                      {ruleInfor.value.setting.project.remove === true ? (
                        <MenuItem
                          id={row.sn + "_remove"}
                          onClick={(e) => {
                            handleDelete(e);
                            popupState.close();
                          }}
                        >
                          <IoTrashOutline size={16} />
                          &nbsp;
                          {dataLang.formatMessage({ id: "delete" })}
                        </MenuItem>
                      ) : (
                        <></>
                      )}
                    </Menu>
                  </div>
                )}
              </PopupState>
            )
          ) : (
            <div></div>
          )}
          {/* <div
            className="DAT_ModifyBox"
            id={row.sn + "_Modify"}
            style={{ display: "none" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div
              className="DAT_ModifyBox_Fix"
              id={`${row.sn}_${row.name}_edit`}
              onClick={(e) => handleEdit(e)}
            >
              <FiEdit size={14} />
              &nbsp;
              {dataLang.formatMessage({ id: "change" })}
            </div>
            <div
              className="DAT_ModifyBox_Remove"
              id={row.sn + "_remove"}
              onClick={(e) => handleDelete(e)}
            >
              <IoTrashOutline size={16} />
              &nbsp;
              {dataLang.formatMessage({ id: "remove" })}
            </div>
          </div> */}
        </>
      ),
      width: "100px",
    },
  ];

  const columnShare = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, i) => i + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => row.name_,
      sortable: true,
      minWidth: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "phone" }),
      selector: (row) => row.phone_,
      minWidth: "200px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: "E-mail",
      selector: (row) => row.mail_,
      minWidth: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    // {
    //   name: dataLang.formatMessage({ id: "edits" }),
    //   selector: (row) => (
    //     <>
    //       <div className="DAT_TableEdit">
    //         <span
    //           id={row.mail_ + "_MORE"}
    //           onClick={(e) => handleModify(e, "block")}
    //         >
    //           <IoMdMore size={20} />
    //         </span>
    //       </div>

    //       <div
    //         className="DAT_ModifyBox"
    //         id={row.mail_ + "_Modify"}
    //         style={{ display: "none" }}
    //         onMouseLeave={(e) => handleModify(e, "none")}
    //       >
    //         <div
    //           className="DAT_ModifyBox_Remove"
    //           id={row.mail_}
    //           onClick={(e) => handleDeleteMem(e)}
    //         >
    //           <IoTrashOutline size={16} />
    //           &nbsp;
    //           {dataLang.formatMessage({ id: "remove" })}
    //         </div>
    //       </div>
    //     </>
    //   ),
    //   width: "100px",
    // },
  ];

  const popup_state = {
    pre: {
      transform: "rotate(0deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
    new: {
      transform: "rotate(90deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup_");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleInfoLogger = (e) => {
    setDropState(false);
    setInfoState(true);
    tab.value = "logger";
    let plantname = projectData.value.plantname;
    info.value = {
      psn: temp.value[0].sn,
      pname: temp.value[0].name,
      pplantname: plantname,
      pstate: temp.value[0].state,
      pversion: temp.value[0].version,
    };
  };

  const handleInfoInverter = (e) => {
    setDropState(false);
    setInfoState(true);
    tab.value = "inverter";
    let plantname = projectData.value.plantname;
    info.value = {
      psn: inverterDB.value[0].sn,
      pname: inverterDB.value[0].name,
      pplantname: plantname,
      pdata: inverterDB.value[0].data,
      psetting: inverterDB.value[0].setting,
      plogger: inverterDB.value[0].logger_,
      type: inverterDB.value[0].type,
    };
    info.value.invt = invt[inverterDB.value[0].logger_];
  };

  const handleCloseInfo = () => {
    setInfoState(false);
  };

  const handleClosePopupAddGateway = () => {
    setPopupAddGateway(false);
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

  const convertToDoublewordAndFloat = (word, type) => {
    var doubleword = (word[1] << 16) | word[0];
    var buffer = new ArrayBuffer(4);
    var intView = new Int32Array(buffer);
    var floatView = new Float32Array(buffer);
    intView[0] = doubleword;
    var float_value = floatView[0];
    return type === "int"
      ? parseFloat(doubleword).toFixed(2)
      : parseFloat(float_value).toFixed(2) || 0;
  };

  const handleView = (e) => {
    var id = e.currentTarget.id;
    setView(id);
    setDropState(false);
  };

  const handleTabMobileDevice = (e) => {
    const id = e.currentTarget.id;
    tab_.value = id;
    const newLabel = listDeviceTab.find((item) => item.id == id);
    tabLable.value = newLabel.name;
  };

  const handleOutsideUser = (e) => {
    if (!box.current.contains(e.target)) {
      // plantState.value = "default";
    }
  };

  const handleEdit = (e) => {
    popupState.value = true;
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    setSnlogger(idArr[0]);
    setDevname(idArr[1]);
    setType(idArr[2]);
    setDevtype(tab_.value);
  };

  const handleDelete = (e) => {
    popupState.value = true;
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    setSnlogger(idArr[0]);
    setType(idArr[1]);
  };

  const handleInvt = async (sn) => {
    const res = await invtCloud(
      '{"deviceCode":"' + sn + '"}',
      Token.value.token
    );
    if (res.ret === 0) {
      setInvt((pre) => ({ ...pre, [sn]: res.data }));
    }
  };

  const handleOutsideView = (e) => {
    setTimeout(() => {
      if (viewStateNav.value[1] == false) {
        viewNav.value = false;
        viewStateNav.value = [false, false];
      }
      clearTimeout();
    }, 250);
  };

  const handleWindowResize = () => {
    let home = document.getElementById("dashboard");
    // console.log(home.offsetWidth);

    if (home?.offsetWidth >= 1300) {
      // console.log("max");
      projectdatasize.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      // console.log("middle");
      projectdatasize.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
    } else {
      // console.log("small");
      projectdatasize.value = {
        icon: { fontSize: 25 },
        label: { fontSize: 11 },
        value: { fontSize: 20 },
        unit: { fontSize: 10 },
        valuepro: { fontSize: 22 },
        unitpro: { fontSize: 20 },
        boxpro: { fontSize: 130 },
      };
    }

    if (home?.offsetWidth > 900) {
      isDesktop.value = true;
    } else {
      isDesktop.value = false;
      // initMap(plant.value);
    }

    // else {
    //   console.log("min");
    //   sizedesktop.value = {
    //     icon: { fontSize: 25 },
    //     label: { fontSize: 11 },
    //     value: { fontSize: 20 },
    //     unit: { fontSize: 12 },
    //   };
    // }
  };

  useEffect(function () {
    let home = document.getElementById("dashboard");
    // console.log(home.offsetWidth);

    if (home?.offsetWidth >= 1300) {
      // console.log("max");
      projectdatasize.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      // console.log("middle");
      projectdatasize.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
    } else {
      // console.log("small");
      projectdatasize.value = {
        icon: { fontSize: 25 },
        label: { fontSize: 11 },
        value: { fontSize: 20 },
        unit: { fontSize: 10 },
        valuepro: { fontSize: 22 },
        unitpro: { fontSize: 20 },
        boxpro: { fontSize: 130 },
      };
    }

    if (home?.offsetWidth > 900) {
      isDesktop.value = true;
    } else {
      isDesktop.value = false;
      // initMap(plant.value);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    tabLable.value = listDeviceTab[0].name;

    const getShared = async () => {
      let req = await callApi("post", host.DATA + "/getmailPlantmem", {
        plantid: projectData.value.plantid_,
        usr: user,
      });
      if (req.status) {
        setgetShared(req.data);
      }
    };
    getShared();

    //data Logger
    const getLogger = async () => {
      let d = await callApi("post", host.DATA + "/getLogger", {
        plantid: projectData.value.plantid_,
      });
      temp.value = d;
      d.map(async (item) => {
        const res = await invtCloud('{"deviceCode":"' + item.sn + '"}', Token.value.token);
        if (res.ret === 0) {
          // let res_ = await callApi("post", host.DATA + "/updateLogger", {
          //   sn: item.sn,
          //   type: "state",
          //   data: res.data.enabled,
          // });
          setInvt((pre) => ({ ...pre, [item.sn]: res.data }));
          // const decimalArray = JSON.parse(item.setting.sn);
          // const hexString = decimalArray.map((num) => parseInt(res.data[num]).toString(16)).join("");
          // const asciiString = hexString.match(/.{2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
        } else {
          setInvt((pre) => ({ ...pre, [item.sn]: {} }));
        }

        let inverter = await callApi("post", host.DATA + "/getInverter", {
          loggerid: item.sn,
        });
        if (inverter.length > 0) {
          inverter.map((item) => { return item.type = temp.value.find((i) => i.sn === item.logger_).type });
          inverterDB.value = [...inverter];
        } else {
          inverterDB.value = [];
        }
      });
    };
    getLogger();

    return () => {
      tab_.value = "logger";
      inverterDB.value = [];
      temp.value = [];
      rootDispatch(
        toolslice.actions.setcal({
          pro_1: 0,
          pro_2: 0,
          pro_3: 0,
          bat_1: 0,
          bat_2: 0,
          bat_in_1: 0,
          bat_out_1: 0,
          con_1: 0,
          con_2: 0,
          con_3: 0,
          grid_1: 0,
          grid_in_1: 0,
          grid_in_2: 0,
          grid_out_1: 0,
          grid_out_2: 0,
        })
      );
    };
    // eslint-disable-next-line
  }, [lang]);

  useEffect(() => {
    var num_ = {
      bat_1: [],
      bat_2: [],
      bat_3: [],
      bat_4: [],
      bat_in_1: [],
      bat_out_1: [],
      con_1: [],
      con_2: [],
      con_3: [],
      grid_1: [],
      grid_in_1: [],
      grid_in_2: [],
      grid_out_1: [],
      grid_out_2: [],
      pro_1: [],
      pro_2: [],
      pro_3: [],
    };
    var cal_ = {
      pro_1: 0,
      pro_2: 0,
      pro_3: 0,
      bat_1: 0,
      bat_2: 0,
      bat_3: 0,
      bat_4: 0,
      bat_in_1: 0,
      bat_out_1: 0,
      con_1: 0,
      con_2: 0,
      grid_1: 0,
      grid_in_1: 0,
      grid_in_2: 0,
      grid_out_1: 0,
      grid_out_2: 0,
    };
    temp.value.map(async (item, i) => {
      Object.entries(item.data).map(([key, value]) => {
        switch (value.type) {
          case "sum":
            let inum = [];
            let register_ = JSON.parse(value.register);
            register_.map((reg, j) => {
              inum[j] = parseFloat(invt[item.sn]?.[reg] || 0);
            });

            num_[key][i] = inum.reduce((accumulator, currentValue) => {
              return Number(accumulator) + Number(currentValue);
            }, 0) * parseFloat(value.cal);

            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0)
              ).toFixed(2);
            }
            break;
          case "word":
            let d = JSON.parse(value.register);
            let e = [invt[item.sn]?.[d[0]] || 0, invt[item.sn]?.[d[1]] || 0];

            const convertToDoublewordAndFloat = (word, type) => {
              var doubleword = (word[1] << 16) | word[0];
              var buffer = new ArrayBuffer(4);
              var intView = new Int32Array(buffer);
              var floatView = new Float32Array(buffer);
              intView[0] = doubleword;
              var float_value = floatView[0];
              return type === "int"
                ? parseFloat(doubleword).toFixed(2)
                : parseFloat(float_value).toFixed(2) || 0;
            };
            num_[key][i] = convertToDoublewordAndFloat(e, "int") * parseFloat(value.cal);

            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0)
              ).toFixed(2);
            }
            break;
          case "real":
            num_[key][i] =
              parseFloat(invt[item.sn]?.[value.register] || 0) * parseFloat(value.cal);
            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                })
              ).toFixed(2);
            }
            break;
          case "bit":
            const numberToConvert = invt[item.sn]?.[value.register] || 0;
            const numberOfBits = 16; // 32-bits binary
            const arrBitwise = [0]; // save the resulting bitwise

            for (let i = 0; i < numberOfBits; i++) {
              let mask = 1;

              const bit = numberToConvert & (mask << i); // And bitwise with left shift

              if (bit === 0) {
                arrBitwise[i] = 0;
              } else {
                arrBitwise[i] = 1;
              }
            }
            const binary = arrBitwise.reverse().join("");
            num_[key][i] = Number(binary[15 - Number(value.cal)])
            // console.log(key, num_[key])
            if (i == temp.value.length - 1) {
              cal_[key] = num_[key].some(element => element === 1) ? 1 : 0;
              // console.log(key,cal_[key])
            }


            break;
          default:
            break;
        }
      });
    });

    coalsave.value = {
      ...coalsave.value,
      value: cal_.pro_3,
    };

    rootDispatch(toolslice.actions.setcal(cal_));

    document.addEventListener("mousedown", handleOutsideUser);
    return () => {
      document.removeEventListener("mousedown", handleOutsideUser);
    };

    // eslint-disable-next-line
  }, [invt]);

  useEffect(() => {
    if (temp.value.length > 0) {
      temp.value.map((item) => {
        socket.value.on("Server/" + item.sn, function (data) {
          Object.keys(data.data).map((keyName, i) => {
            setInvt((pre) => ({
              ...pre,
              [item.sn]: {
                ...pre[item.sn],
                [keyName]: data.data[keyName],
              },
            }));
          });
        });
      });
    }

    // eslint-disable-next-line
  }, [temp.value]);

  // Handle close when press ESC
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "Escape") {
  //       // if (popupAddGateway === false) {
  //       // plantState.value = "default";
  //       // }
  //       // setDropState(false);
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div ref={box}>
      <div className="DAT_ProjectData"
        style={{ marginBottom: isBrowser || isLandscape ? "30px" : "100px" }}
      >
        {isBrowser ? (
          <>
            <div className="DAT_ProjectData_Header">
              <div className="DAT_ProjectData_Header_Left">
                <img src={projectData.value.img
                  ? projectData.value.img
                  : "/dat_picture/solar_panel.png"} alt="" />
                {projectData.value.plantname}
                {projectData.value.state === 1 ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <MdOutlineError size={20} color="red" />
                )}
              </div>

              <div className="DAT_ProjectData_Header_Right">
                <div className="DAT_ProjectData_Header_Right_More">
                  <BsThreeDotsVertical
                    size={20}
                    color="#9e9e9e"
                    onClick={() => {
                      setDropState(!dropState);
                      viewNav.value = true;
                      viewStateNav.value = [true, false];
                    }}
                    onMouseLeave={() => handleOutsideView()}
                  />
                </div>

                {ruleInfor.value.setting.device.add ? (
                  projectData.value.shared === 1 ? (
                    <></>
                  ) : (
                    <div
                      className="DAT_ProjectData_Header_Right_Add"
                      style={{ display: view === "device" ? "block" : "none" }}
                    >
                      <button
                        id="add"
                        onClick={() => {
                          setPopupAddGateway(true);
                          setDropState(false);
                        }}
                      >
                        <IoAddOutline size={25} color="white" />
                      </button>
                    </div>
                  )
                ) : (
                  <></>
                )}

                <div
                  className="DAT_ProjectData_Header_Right_Close"
                  onClick={() => {
                    plantState.value = "default";
                    setDropState(false);
                  }}
                >
                  <IoClose
                    size={25}
                    color="rgba(11, 25, 103)"
                    id="Popup_"
                    onMouseEnter={(e) => handlePopup("new")}
                    onMouseLeave={(e) => handlePopup("pre")}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="DAT_ProjectData_Header">
              <div className="DAT_ProjectData_Header_Left"
                style={{ fontSize: "14px" }}
              >
                {projectData.value.plantname}
                {projectData.value.state === 1 ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <MdOutlineError size={20} color="red" />
                )}
              </div>

              <div className="DAT_ProjectData_Header_Right">
                <div className="DAT_ProjectData_Header_Right_More">
                  <BsThreeDotsVertical
                    size={20}
                    color="#9e9e9e"
                    onClick={() => {
                      setDropState(!dropState);
                      viewNav.value = true;
                      viewStateNav.value = [true, false];
                    }}
                    onMouseLeave={() => handleOutsideView()}
                  />
                </div>

                {/* {ruleInfor.value.setting.device.add ? (
                  projectData.value.shared === 1 ? (
                    <></>
                  ) : (
                    <div
                      className="DAT_ProjectData_Header_Right_Add"
                      style={{ display: view === "device" ? "block" : "none" }}
                    >
                      <button
                        id="add"
                        onClick={() => {
                          setPopupAddGateway(true);
                          setDropState(false);
                        }}
                      >
                        <IoAddOutline size={25} color="white" />
                      </button>
                    </div>
                  )
                ) : (
                  <></>
                )} */}

                <div
                  className="DAT_ProjectData_Header_Right_Close"
                  onClick={() => {
                    plantState.value = "default";
                    setDropState(false);
                  }}
                >
                  <IoClose
                    size={25}
                    color="rgba(11, 25, 103)"
                    id="Popup_"
                    onMouseEnter={(e) => handlePopup("new")}
                    onMouseLeave={(e) => handlePopup("pre")}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {(() => {
          switch (view) {
            case "dashboard":
              return (
                <>
                  {isBrowser
                    ? (
                      isDesktop.value
                        ?
                        <div id="dashboard">
                          <div className="DAT_ProjectData_NewDashboard_Top">
                            <div className="DAT_ProjectData_NewDashboard_Top_Left">
                              <div className="DAT_ProjectData_NewDashboard_Top_Left_Graph">
                                <GraphComponent />
                              </div>
                              <div className="DAT_ProjectData_NewDashboard_Top_Left_Impact">
                                <Benefit />
                              </div>
                            </div>
                            <div className="DAT_ProjectData_NewDashboard_Top_Right">
                              <div className="DAT_ProjectData_NewDashboard_Top_Right_Information">
                                <ProjectInfo />
                              </div>
                              <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg">
                                <Weather />
                              </div>
                            </div>
                          </div>
                          <div className="DAT_ProjectData_NewDashboard_Bottom">
                            <DashboardHistory />
                          </div>
                        </div>
                        :
                        <div id="dashboard">
                          <div className="DAT_ProjectData_Dashboard_Top">
                            <div className="DAT_ProjectData_Dashboard_Top_Left">
                              <div className="DAT_ProjectData_Dashboard_Top_Left_Graph">
                                <GraphComponent />
                              </div>
                              <div className="DAT_ProjectData_Dashboard_Top_Left_Impact">
                                <Benefit />
                              </div>
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Right">
                              <div className="DAT_ProjectData_Dashboard_Top_Right_Information">
                                <ProjectInfo />
                              </div>
                              <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg">
                                <Weather />
                              </div>
                            </div>
                          </div>
                          <div className="DAT_ProjectData_Dashboard_Bottom">
                            <DashboardHistory />
                          </div>
                        </div>
                    ) : (
                      <div id="dashboard">
                        <div className="DAT_ProjectData_Dashboard_Top">
                          <div className="DAT_ProjectData_Dashboard_Top_Left">
                            <div className="DAT_ProjectData_Dashboard_Top_Left_Graph">
                              <GraphComponent />
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Left_Impact">
                              <Benefit />
                            </div>
                          </div>
                          <div className="DAT_ProjectData_Dashboard_Top_Right">
                            <div className="DAT_ProjectData_Dashboard_Top_Right_Information">
                              <ProjectInfo />
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg">
                              <Weather />
                            </div>
                          </div>
                        </div>
                        <div className="DAT_ProjectData_Dashboard_Bottom">
                          <DashboardHistory />
                        </div>
                      </div>
                    )}
                </>
              );
            case "device":
              return (
                <div className="DAT_ProjectData_Device">
                  {isBrowser ? (
                    <>
                      <div className="DAT_ProjectData_Device_Table">
                        <div className="DAT_Toollist_Tab">
                          {listDeviceTab.map((item, i) => {
                            return tab_.value === item.id ? (
                              <div
                                className="DAT_Toollist_Tab_main"
                                key={"tab_" + i}
                              >
                                <p className="DAT_Toollist_Tab_main_left"></p>
                                <span
                                  className="DAT_Toollist_Tab_main_content1"
                                  id={item.id}
                                  style={{
                                    backgroundColor: "White",
                                    color: "black",
                                    borderRadius: "10px 10px 0 0",
                                  }}
                                  onClick={(e) => (tab_.value = item.id)}
                                >
                                  {item.name}
                                </span>
                                <p className="DAT_Toollist_Tab_main_right"></p>
                              </div>
                            ) : (
                              <span
                                className="DAT_Toollist_Tab_main_content2"
                                key={"tab_" + i}
                                id={item.id}
                                style={{ backgroundColor: "#dadada" }}
                                onClick={(e) => (tab_.value = item.id)}
                              >
                                {item.name}
                              </span>
                            );
                          })}
                        </div>

                        <div className="DAT_ProjectData_Device_Table_Content">
                          {(() => {
                            switch (tab_.value) {
                              case "inverter":
                                return (
                                  <DataTable
                                    className="DAT_Table_Device"
                                    columns={columnInverter}
                                    data={inverterDB.value}
                                    pagination
                                    paginationComponentOptions={
                                      paginationComponentOptions
                                    }
                                    // fixedHeader={true}
                                    noDataComponent={<Empty />}
                                  />
                                );
                              case "logger":
                                return (
                                  <DataTable
                                    className="DAT_Table_Device"
                                    columns={columnLogger}
                                    data={temp.value}
                                    pagination
                                    paginationComponentOptions={
                                      paginationComponentOptions
                                    }
                                    // fixedHeader={true}
                                    noDataComponent={<Empty />}
                                  />
                                );
                              default:
                                return <></>;
                            }
                          })()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="DAT_ProjectData_Device_TableMobile">
                        <div className="DAT_Toollist_Tab_Mobile">
                          <button
                            className="DAT_Toollist_Tab_Mobile_content"
                            onClick={() => (tabMobile.value = !tabMobile.value)}
                          >
                            <span> {tabLable.value}</span>
                            <FiFilter />
                            {tabMobile.value ? (
                              <IoIosArrowDown />
                            ) : (
                              <IoIosArrowForward />
                            )}
                          </button>
                          {ruleInfor.value.setting.device.add ? (
                            projectData.value.shared == 1 ? (
                              <></>
                            ) : (
                              <div
                                className="DAT_ProjectData_Device_Add"
                                style={{
                                  display: view === "device" ? "block" : "none",
                                }}
                              >
                                <button
                                  id="add"
                                  onClick={() => {
                                    setPopupAddGateway(true);
                                    setDropState(false);
                                  }}
                                >
                                  <IoAddOutline size={25} color="white" />
                                </button>
                              </div>
                            )
                          ) : (
                            <div></div>
                          )}
                          <div
                            className="DAT_Toollist_Tab_Mobile_list"
                            style={{
                              top: "50px",
                              height: tabMobile.value ? "70px" : "0px",
                              transition: "0.5s",
                              boxShadow: tabMobile.value
                                ? "0 0 4px 4px rgba(193, 193, 193, 0.5)"
                                : "none",
                            }}
                          >
                            {listDeviceTab.map((item, i) => {
                              return (
                                <div
                                  className="DAT_Toollist_Tab_Mobile_list_item"
                                  key={"tabmobile_" + i}
                                  id={item.id}
                                  onClick={(e) => {
                                    handleTabMobileDevice(e);
                                    tabMobile.value = false;
                                  }}
                                >
                                  {i + 1}: {item.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {(() => {
                          switch (tab_.value) {
                            case "logger":
                              return (
                                <>
                                  {temp.value?.map((item, i) => {
                                    return (
                                      <div
                                        className="DAT_ProjectData_Device_TableMobile_Content"
                                        key={i}
                                      >
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Type">
                                            {item.type}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                            <div
                                              className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
                                              onClick={(e) =>
                                                handleInfoLogger(e)
                                              }
                                            >
                                              {item.name}
                                            </div>
                                            <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Sn">
                                              SN: {item.sn}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_State">
                                            {item.state === 1 ? (
                                              <>
                                                <FaCheckCircle
                                                  size={16}
                                                  color="green"
                                                />
                                                <span>
                                                  {dataLang.formatMessage({
                                                    id: "online",
                                                  })}
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <MdOutlineError
                                                  size={18}
                                                  color="red"
                                                />
                                                <span>
                                                  {dataLang.formatMessage({
                                                    id: "offline",
                                                  })}
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right">
                                            {ruleInfor.value.setting.device
                                              .modify === true ? (
                                              <div
                                                className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
                                                id={`${item.sn}_${item.name}_edit`}
                                                onClick={(e) => handleEdit(e)}
                                              >
                                                <FiEdit size={20} />
                                              </div>
                                            ) : (
                                              <div></div>
                                            )}
                                            {ruleInfor.value.setting.device
                                              .remove === true ? (
                                              <div
                                                className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
                                                id={`${item.sn}_remove`}
                                                onClick={(e) => handleDelete(e)}
                                              >
                                                <IoTrashOutline size={20} />
                                              </div>
                                            ) : (
                                              <div></div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              );
                            case "inverter":
                              return (
                                <>
                                  {inverterDB.value?.map((item, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="DAT_ProjectData_Device_TableMobile_Content"
                                      >
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                          <div
                                            className="DAT_ProjectData_Device_TableMobile_Content_Top_Type"
                                            style={{
                                              backgroundColor:
                                                COLOR.value.DarkGreenColor,
                                            }}
                                          >
                                            {item.data.mode}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                            <div
                                              className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
                                              onClick={(e) =>
                                                handleInfoInverter(e)
                                              }
                                            >
                                              {item.name}
                                            </div>
                                            <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Sn">
                                              SN: {item.sn}
                                            </div>
                                            <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_OgLog">
                                              {dataLang.formatMessage({
                                                id: "ogLog",
                                              })}
                                              : {item.logger_}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_State">
                                            {invt[item.logger_]?.[
                                              item.data.status
                                            ] == 2 ? (
                                              <>
                                                <FaCheckCircle
                                                  size={16}
                                                  color="green"
                                                />
                                                <span>
                                                  {dataLang.formatMessage({
                                                    id: "online",
                                                  })}
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <MdOutlineError
                                                  size={18}
                                                  color="red"
                                                />
                                                <span>
                                                  {dataLang.formatMessage({
                                                    id: "offline",
                                                  })}
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right">
                                            {ruleInfor.value.setting.device
                                              .modify === true ? (
                                              <div
                                                className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
                                                id={`${item.sn}_${item.name}_edit`}
                                                onClick={(e) => handleEdit(e)}
                                              >
                                                <FiEdit size={20} />
                                              </div>
                                            ) : (
                                              <div></div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              );
                            case "meter":
                              return (
                                <>
                                  {/* {tempInverter.value?.map((item, i) => {
                                  return (
                                    <div
                                      key={i}
                                      className="DAT_ProjectData_Device_TableMobile_Content"
                                    >
                                      <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Left">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Left_Name">
                                            {dataLang.formatMessage({
                                              id: "name",
                                            })}
                                            : {item.name}
                                          </div>

                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Left_Sn">
                                            SN: {item.sn}
                                          </div>
                                        </div>

                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Right">
                                          {ruleInfor.value.setting.device
                                            .modify === true ? (
                                            <div
                                              className="DAT_ProjectData_Device_TableMobile_Content_Top_Right_Item"
                                              onClick={(e) => handleEdit(e)}
                                            >
                                              <MdEdit size={20} color="#216990" />
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}
                                          {ruleInfor.value.setting.device
                                            .remove === true ? (
                                            <div
                                              className="DAT_ProjectData_Device_TableMobile_Content_Top_Right_Item"
                                              id={item.sn}
                                              onClick={(e) => handleDelete(e)}
                                            >
                                              <MdDelete size={20} color="red" />
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom">
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_State">
                                          {item.state ? (
                                            <>
                                              <FaCheckCircle
                                                size={20}
                                                color="green"
                                              />
                                              <span>
                                                {dataLang.formatMessage({
                                                  id: "online",
                                                })}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <MdOutlineError
                                                size={22}
                                                color="red"
                                              />
                                              <span>
                                                {dataLang.formatMessage({
                                                  id: "offline",
                                                })}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Type">
                                          {dataLang.formatMessage({
                                            id: "type",
                                          })}
                                          : {item.type}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })} */}
                                </>
                              );
                            default:
                              return <></>;
                          }
                        })()}
                      </div>
                    </>
                  )}
                </div>
              );
            case "share":
              return (
                <div className="DAT_ProjectData_Share">
                  <div
                    className="DAT_ProjectData_Share_Header"
                    style={{
                      padding: "15px",
                      backgroundColor: "rgba(233, 233, 233, 0.5)",
                    }}
                  >
                    {dataLang.formatMessage({ id: "share" })}
                  </div>

                  {isBrowser ? (
                    <div className="DAT_ProjectData_Share_Content">
                      <DataTable
                        className="DAT_Table_Device"
                        columns={columnShare}
                        data={getShared}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    </div>
                  ) : (
                    <div className="DAT_ProjectData_Share_ContentMobile">
                      {getShared.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="DAT_ProjectData_Share_ContentMobile_Item"
                          >
                            <div className="DAT_ProjectData_Share_ContentMobile_Item_Left">
                              {i + 1}
                            </div>

                            <div className="DAT_ProjectData_Share_ContentMobile_Item_Right">
                              <div className="DAT_ProjectData_Share_ContentMobile_Item_Right_Name">
                                {item.name_}
                              </div>
                              <div className="DAT_ProjectData_Share_ContentMobile_Item_Right_Phone">
                                {item.phone_}
                              </div>
                              <div className="DAT_ProjectData_Share_ContentMobile_Item_Right_Email">
                                {item.mail_}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            default:
              <></>;
          }
        })()}
      </div>

      {popupAddGateway ? (
        isBrowser
          ?
          <div className="DAT_PopupBG">
            <AddGateway
              data={temp.value}
              handleInvt={handleInvt}
              handleClose={handleClosePopupAddGateway}
            />
          </div>
          :
          isLandscape
            ?
            <div className="DAT_ViewPopupMobile">
              <AddGateway
                data={temp.value}
                handleInvt={handleInvt}
                handleClose={handleClosePopupAddGateway}
              />
            </div>
            :
            <div className="DAT_PopupBGMobile">
              <AddGateway
                data={temp.value}
                handleInvt={handleInvt}
                handleClose={handleClosePopupAddGateway}
              />
            </div>
      ) : <></>}

      {popupState.value ? (
        <div className="DAT_PopupBG">
          <Popup
            plantid={projectData.value.plantid_}
            type="logger"
            sn={snlogger}
            data={temp.value}
            func={type}
            name={devname}
            devtype={devtype}
          />
        </div>
      ) : <> </>}

      {isMobile.value ? (
        <>
          {dropState ? (
            <div className="DAT_ProjectDataDrop">
              {(() => {
                switch (view) {
                  case "device":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="share"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "share" })}
                        </div>
                      </>
                    );
                  case "share":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>
                      </>
                    );
                  default:
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="share"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "share" })}
                        </div>
                      </>
                    );
                }
              })()}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {dropState ? (
            <div
              className="DAT_ProjectDataDrop"
              style={{ display: viewNav.value ? "block" : "none" }}
              onMouseEnter={() => {
                viewStateNav.value = [true, true];
              }}
              onMouseLeave={() => {
                viewNav.value = false;
                viewStateNav.value = [false, false];
              }}
            >
              {(() => {
                switch (view) {
                  case "device":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="share"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "share" })}
                        </div>
                      </>
                    );
                  case "share":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>
                      </>
                    );
                  default:
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="share"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "share" })}
                        </div>
                      </>
                    );
                }
              })()}
            </div>
          ) : (
            <></>
          )}
        </>
      )}

      <div className="DAT_ViewPopup"
        style={{ height: infoState ? "100%" : "0px", transition: "0.5s" }}
      >
        {infoState ? <Info handleClose={handleCloseInfo} /> : <></>}
      </div>
    </div>
  );
}
