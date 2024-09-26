import React, { useEffect, useState } from "react";

import Info from "../Device/Info";
import SLAddGateway from "./SLAddGateway";
import SLPopup from "./SLPopup";
import SolarLight, { SLloggerSn } from "./SolarLight";
import SLProjectInfo from "./SLProjectInfo";
import SLWeather from "./SLWeather";
import SLBenefit from "./SLBenefit";
import SLHistory from "./SLHistory";
import { slPlantState, slPopupState, slProjectData } from "./SLProjectlist";
import { Empty } from "../Project/Project";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR, Token, checkBrand, ruleInfor, socket } from "../../App";
import { info, tab } from "../Device/Device";
import { isDesktop } from "../Home/Home";

import { useDispatch, useSelector } from "react-redux";
import { signal } from "@preact/signals-react";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useIntl } from "react-intl";
import toolslice from "../Redux/toolslice";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";
import { isBrowser, useMobileOrientation } from "react-device-detect";

import { IoIosArrowDown, IoIosArrowForward, IoMdMore } from "react-icons/io";
import { IoAddOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiFilter } from "react-icons/fi";

export const slloggerDB = signal([]);
export const slinverterDB = signal([]);
export const sltab_ = signal("logger");
export const slcoalsave = signal({
  value: 0,
  ef: 0.7221,
  avr: 0.517,
  tree: 0.054,
});

export const slprojectdatasize = signal({
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
const viewNav = signal(false);
const viewStateNav = signal([false, false]);

export default function SLProjectData(props) {
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
  // const box = useRef();
  const rootDispatch = useDispatch();

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const listDeviceTab = [
    { id: "logger", name: "Logger" },
    // { id: "inverter", name: "Inverter" },
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
    // {
    //   name: dataLang.formatMessage({ id: "production" }),
    //   selector: (row) => {
    //     let power = 0;
    //     let d = JSON.parse(row.data.total?.register || "[]");

    //     switch (row.data.total?.type) {
    //       case "sum":
    //         let num = [];
    //         d.map((item, i) => { return num[i] = parseFloat(invt[row.logger_]?.[item] || 0) });
    //         power = parseFloat(num.reduce((a, b) => Number(a) + Number(b), 0) * row.data.total?.cal).toFixed(2);
    //         break;
    //       case "word":
    //         power = convertToDoublewordAndFloat([invt[row.logger_]?.[d[0]], invt[row.logger_]?.[d[1]]], "int") * row.data.total?.cal;
    //         break;
    //       default:
    //         break;
    //     };

    //     return <div>{parseFloat(power / 1000).toFixed(2)} kW</div>;
    //   },
    //   sortable: true,
    //   width: "200px",
    // },
    // {
    //   name: dataLang.formatMessage({ id: "daily" }),
    //   selector: (row) => (
    //     <>
    //       {row.data.daily?.register
    //         ? parseFloat(invt[row.logger_]?.[row.data.daily.register] * row.data.daily?.cal).toFixed(2)
    //         : 0
    //       }{" "}
    //       kWh
    //     </>
    //   ),
    //   sortable: true,
    //   width: "200px",
    // },
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
            slProjectData.value.shared == 1 ? (
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
            slProjectData.value.shared == 1 ? (
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
  ];

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "rgba(11, 25, 103)", },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "rgba(11, 25, 103)", },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup_");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleView = (e) => {
    var id = e.currentTarget.id;
    setView(id);
    setDropState(false);
  };

  const handleOutsideView = (e) => {
    setTimeout(() => {
      if (viewStateNav.value[1] === false) {
        viewNav.value = false;
        viewStateNav.value = [false, false];
      }
      clearTimeout();
    }, 250);
  };

  const handleTabMobileDevice = (e) => {
    const id = e.currentTarget.id;
    sltab_.value = id;
    const newLabel = listDeviceTab.find((item) => item.id === id);
    tabLable.value = newLabel.name;
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

  const handleInvt = async (sn) => {
    const res = await invtCloud(
      '{"deviceCode":"' + sn + '"}',
      Token.value.token
    );
    if (res.ret === 0) {
      setInvt((pre) => ({ ...pre, [sn]: res.data }));
    }
  };

  const handleInfoLogger = (e) => {
    setDropState(false);
    setInfoState(true);
    tab.value = "logger";
    let plantname = slProjectData.value.plantname;
    info.value = {
      psn: slloggerDB.value[0].sn,
      pname: slloggerDB.value[0].name,
      pplantname: plantname,
      pstate: slloggerDB.value[0].state,
      pversion: slloggerDB.value[0].version,
    };
  };

  const handleInfoInverter = (e) => {
    setDropState(false);
    setInfoState(true);
    tab.value = "inverter";
    let plantname = slProjectData.value.plantname;
    info.value = {
      psn: slinverterDB.value[0].sn,
      pname: slinverterDB.value[0].name,
      pplantname: plantname,
      pdata: slinverterDB.value[0].data,
      psetting: slinverterDB.value[0].setting,
      plogger: slinverterDB.value[0].logger_,
      type: slinverterDB.value[0].type,
    };
    info.value.invt = invt[slinverterDB.value[0].logger_];
  };

  const handleEdit = (e) => {
    slPopupState.value = true;
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    setSnlogger(idArr[0]);
    setDevname(idArr[1]);
    setType(idArr[2]);
    setDevtype(sltab_.value);
  };

  const handleDelete = (e) => {
    slPopupState.value = true;
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    setSnlogger(idArr[0]);
    setType(idArr[1]);
  };

  const handleCloseInfo = () => {
    setInfoState(false);
  };

  const handleClosePopupAddGateway = () => {
    setPopupAddGateway(false);
  };

  // const convertToDoublewordAndFloat = (word, type) => {
  //   var doubleword = (word[1] << 16) | word[0];
  //   var buffer = new ArrayBuffer(4);
  //   var intView = new Int32Array(buffer);
  //   var floatView = new Float32Array(buffer);
  //   intView[0] = doubleword;
  //   var float_value = floatView[0];
  //   return type === "int"
  //     ? parseFloat(doubleword).toFixed(2)
  //     : parseFloat(float_value).toFixed(2) || 0;
  // };    

  // const handleOutsideUser = (e) => {
  //   if (!box.current.contains(e.target)) {
  //     // plantState.value = "default";
  //   }
  // };  

  const handleWindowResize = () => {
    let home = document.getElementById("dashboard");

    if (home?.offsetWidth >= 1300) {
      slprojectdatasize.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      slprojectdatasize.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
    } else {
      slprojectdatasize.value = {
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
    }
  };

  useEffect(function () {
    let home = document.getElementById("dashboard");

    if (home?.offsetWidth >= 1300) {
      slprojectdatasize.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      slprojectdatasize.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
    } else {
      slprojectdatasize.value = {
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
        plantid: slProjectData.value.plantid_,
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
        plantid: slProjectData.value.plantid_,
      });
      let newDB = d.sort((a, b) => a.name.localeCompare(b.name));
      slloggerDB.value = newDB;
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

        // //data Inverter
        // let inverter = await callApi("post", host.DATA + "/getInverter", {
        //   loggerid: item.sn,
        // });
        // if (inverter.length > 0) {
        //   inverter.map((item) => { return item.type = slloggerDB.value.find((i) => i.sn === item.logger_).type });
        //   slinverterDB.value = [...inverter];
        // } else {
        //   slinverterDB.value = [];
        // }
      });
    };
    getLogger();

    return () => {
      sltab_.value = "logger";
      // slinverterDB.value = [];
      // slloggerDB.value = [];
    };

    // eslint-disable-next-line
  }, [lang]);

  useEffect(() => {
    let item = slloggerDB.value.filter((item) => item.sn === SLloggerSn.value);
    // console.log(item);
    if (item.length === 0) return;

    var cal_ = {
      bat_volt: 0,
      device_status: 0,
      mode_operating: 0,
      priority_given: 0,
      power_supply_status: 0,
      cost_saving: 0,
      ambient_temp: 0,
      charging_current: 0,
      charging_power: 0,
      pv_volt: 0,
      pv_current: 0,
      led_volt: 0,
      led_current: 0,
      led_power: 0,
      level_light_1: 0,
      timing_light_1: 0,
      level_light_2: 0,
      timing_light_2: 0,
      level_light_3: 0,
      timing_light_3: 0,
      level_light_4: 0,
      timing_light_4: 0,
      level_light_5: 0,
      timing_light_5: 0,
      led_lighting_function: 0,
      led_lighting_method: 0,
      switch_volt: 0,
      dc_bat_over_dsch_volt: 0,
      bat_over_dsch_volt: 0,
      bat_dsch_volt_return: 0,
      grid_dsch_energy: 0,
      bat_dsch_energy: 0,
      dsch_time: 0,
      charging_energy: 0,
      charging_capacity: 0,
      charging_time: 0,
      operation_time_with_grid: 0,
      operation_time_with_bat: 0,
      total_energy_from_grid: 0,
      total_energy_charge: 0,
      total_capacity_grid_dsch: 0,
      number_cell_battery: 0,
      over_dsch_return_volt: 0,
      max_current_pv_charge: 0,
      stop_charge_current: 0,
      volt_overcharge: 0,
      over_dsch_delay: 0,
      undervolt_warn: 0,
      volt_overcharge_return: 0,
      led_manual_control: 0,
      sleep_control: 0,
    };

    item.map(async (item, i) => {
      Object.entries(item.data).map(([key, value]) => {
        switch (value.type) {
          case "sum":
            let inum = [];
            let register_ = JSON.parse(value.register);
            register_.map((reg, j) => {
              inum[j] = parseFloat(invt[item.sn]?.[reg] || 0);
            });

            cal_[key] = inum.reduce((accumulator, currentValue) => {
              return Number(accumulator) + Number(currentValue);
            }, 0) * parseFloat(value.cal) || 0;

            // if (i == item.length - 1) {
            //   cal_[key] = parseFloat(
            //     num_[key].reduce((accumulator, currentValue) => {
            //       return Number(accumulator) + Number(currentValue);
            //     }, 0)
            //   ).toFixed(2);
            // }
            break;
          case "word":
            let d = JSON.parse(value.register);
            // let e = [invt[item.sn]?.[d[0]] || 0, invt[item.sn]?.[d[1]] || 0];
            let e = [invt[item.sn]?.[d[0]], invt[item.sn]?.[d[1]]];

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
            cal_[key] = convertToDoublewordAndFloat(e, "int") * parseFloat(value.cal) || 0;

            // if (i == item.length - 1) {
            //   cal_[key] = parseFloat(num_[key].reduce((accumulator, currentValue) => {
            //     return Number(accumulator) + Number(currentValue);
            //   }, 0)).toFixed(2);
            // }
            break;
          case "real":
            // num_[key][i] = parseFloat(invt[item.sn]?.[value.register] || 0) * parseFloat(value.cal);

            cal_[key] = parseFloat(invt[item.sn]?.[value.register]) * parseFloat(value.cal) || 0;
            // if (i == item.length - 1) {
            //   cal_[key] = parseFloat(num_[key].reduce((accumulator, currentValue) => {
            //     return accumulator + currentValue;
            //   })).toFixed(2);
            //   console.log(key, cal_[key])
            // }
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
            cal_[key] = Number(binary[15 - Number(value.cal)]) || 0;
            // console.log(key, num_[key])
            // if (i == item.length - 1) {
            //   cal_[key] = num_[key].some(element => element === 1) ? 1 : 0;
            //   // console.log(key,cal_[key])
            // }
            break;
          default:
            break;
        }
      });
    });

    // console.log(cal_);
    rootDispatch(toolslice.actions.setcal(cal_));

  }, [invt, SLloggerSn.value])

  useEffect(() => {
    if (slloggerDB.value.length > 0) {
      slloggerDB.value.map((item) => {
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
  }, [slloggerDB.value]);

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
    <div>
      <div className="DAT_ProjectData"
        style={{ marginBottom: isBrowser || isLandscape ? "30px" : "100px" }}
      >
        {isBrowser ? (
          <>
            <div className="DAT_ProjectData_Header">
              <div className="DAT_ProjectData_Header_Left">
                <img src={slProjectData.value.img
                  ? slProjectData.value.img
                  : "/dat_picture/solar_panel.png"} alt="" />
                {slProjectData.value.plantname}
                {slProjectData.value.state === 1 ? (
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
                  slProjectData.value.shared === 1 ? (
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

                <div className="DAT_ProjectData_Header_Right_Close"
                  onClick={() => {
                    slPlantState.value = "default";
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
                {slProjectData.value.plantname}
                {slProjectData.value.state === 1 ? (
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

                <div className="DAT_ProjectData_Header_Right_Close"
                  onClick={() => {
                    slPlantState.value = "default";
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
                              <SolarLight />
                            </div>
                            <div className="DAT_ProjectData_NewDashboard_Top_Right">
                              <div className="DAT_ProjectData_NewDashboard_Top_Right_Information">
                                <SLProjectInfo />
                              </div>
                              <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg">
                                <SLWeather />
                              </div>
                            </div>
                          </div>
                          <div className="DAT_ProjectData_NewDashboard_Bottom">
                            <SLHistory />
                          </div>
                        </div>
                        :
                        <div id="dashboard">
                          <div className="DAT_ProjectData_Dashboard_Top">
                            <div className="DAT_ProjectData_Dashboard_Top_Left">
                              <div className="DAT_ProjectData_Dashboard_Top_Left_Graph">
                                <SolarLight />
                              </div>
                              <div className="DAT_ProjectData_Dashboard_Top_Left_Impact">
                                <SLBenefit />
                              </div>
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Right">
                              <div className="DAT_ProjectData_Dashboard_Top_Right_Information">
                                <SLProjectInfo />
                              </div>
                              <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg">
                                <SLWeather />
                              </div>
                            </div>
                          </div>
                          <div className="DAT_ProjectData_Dashboard_Bottom">
                            <SLHistory />
                          </div>
                        </div>
                    ) : (
                      <div id="dashboard">
                        <div className="DAT_ProjectData_Dashboard_Top">
                          <div className="DAT_ProjectData_Dashboard_Top_Left">
                            {/* <div className="DAT_ProjectData_Dashboard_Top_Left_Graph"> */}
                            <SolarLight />
                            {/* </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Left_Impact">
                              <SLBenefit />
                            </div> */}
                          </div>
                          <div className="DAT_ProjectData_Dashboard_Top_Right">
                            <div className="DAT_ProjectData_Dashboard_Top_Right_Information">
                              <SLProjectInfo />
                            </div>
                            <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg">
                              <SLWeather />
                            </div>
                          </div>
                        </div>
                        <div className="DAT_ProjectData_Dashboard_Bottom">
                          <SLHistory />
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
                            return sltab_.value === item.id ? (
                              <div className="DAT_Toollist_Tab_main"
                                key={"tab_" + i}
                              >
                                <p className="DAT_Toollist_Tab_main_left"></p>
                                <span className="DAT_Toollist_Tab_main_content1"
                                  id={item.id}
                                  style={{
                                    backgroundColor: "White",
                                    color: "black",
                                    borderRadius: "10px 10px 0 0",
                                  }}
                                  onClick={(e) => (sltab_.value = item.id)}
                                >
                                  {item.name}
                                </span>
                                <p className="DAT_Toollist_Tab_main_right"></p>
                              </div>
                            ) : (
                              <span className="DAT_Toollist_Tab_main_content2"
                                key={"tab_" + i}
                                id={item.id}
                                style={{ backgroundColor: "#dadada" }}
                                onClick={(e) => (sltab_.value = item.id)}
                              >
                                {item.name}
                              </span>
                            );
                          })}
                        </div>

                        <div className="DAT_ProjectData_Device_Table_Content">
                          {(() => {
                            switch (sltab_.value) {
                              case "inverter":
                                return (
                                  <DataTable
                                    className="DAT_Table_Device"
                                    columns={columnInverter}
                                    data={slinverterDB.value}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                    // fixedHeader={true}
                                    noDataComponent={<Empty />}
                                  />
                                );
                              case "logger":
                                return (
                                  <DataTable
                                    className="DAT_Table_Device"
                                    columns={columnLogger}
                                    data={slloggerDB.value}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
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
                          <button className="DAT_Toollist_Tab_Mobile_content"
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
                            slProjectData.value.shared === 1 ? (
                              <></>
                            ) : (
                              <div className="DAT_ProjectData_Device_Add"
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
                          <div className="DAT_Toollist_Tab_Mobile_list"
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
                                <div className="DAT_Toollist_Tab_Mobile_list_item"
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
                          switch (sltab_.value) {
                            case "logger":
                              return (
                                <>
                                  {slloggerDB.value?.map((item, i) => {
                                    return (
                                      <div className="DAT_ProjectData_Device_TableMobile_Content"
                                        key={i}
                                      >
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Type">
                                            {item.type}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                            <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
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
                                              <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
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
                                              <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
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
                                  {slinverterDB.value?.map((item, i) => {
                                    return (
                                      <div className="DAT_ProjectData_Device_TableMobile_Content"
                                        key={i}
                                      >
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Type"
                                            style={{
                                              backgroundColor:
                                                COLOR.value.DarkGreenColor,
                                            }}
                                          >
                                            {item.data.mode}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                            <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
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
                                              <div className="DAT_ProjectData_Device_TableMobile_Content_Bottom_Right_Item"
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
                  <div className="DAT_ProjectData_Share_Header"
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
                          <div className="DAT_ProjectData_Share_ContentMobile_Item"
                            key={i}
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
            <SLAddGateway
              data={slloggerDB.value}
              handleInvt={handleInvt}
              handleClose={handleClosePopupAddGateway}
            />
          </div>
          :
          isLandscape
            ?
            <div className="DAT_ViewPopupMobile">
              <SLAddGateway
                data={slloggerDB.value}
                handleInvt={handleInvt}
                handleClose={handleClosePopupAddGateway}
              />
            </div>
            :
            <div className="DAT_PopupBGMobile">
              <SLAddGateway
                data={slloggerDB.value}
                handleInvt={handleInvt}
                handleClose={handleClosePopupAddGateway}
              />
            </div>
      ) : <></>}

      {slPopupState.value ? (
        <div className="DAT_PopupBG">
          <SLPopup
            plantid={slProjectData.value.plantid_}
            type="logger"
            sn={snlogger}
            data={slloggerDB.value}
            func={type}
            name={devname}
            devtype={devtype}
          />
        </div>
      ) : <> </>}

      {isBrowser ? (
        <>
          {dropState ? (
            <div className="DAT_ProjectDataDrop"
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
                        <div className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
                        <div className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
                        <div className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
          ) : (<></>)}
        </>
      ) : (
        <>
          {dropState ? (
            <div className="DAT_ProjectDataDrop">
              {(() => {
                switch (view) {
                  case "device":
                    return (
                      <>
                        <div className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
                        <div className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "monitor" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
                        <div className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>

                        <div className="DAT_ProjectDataDrop_Item"
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
          ) : (<></>)}
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
