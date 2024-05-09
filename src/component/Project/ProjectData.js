import React, { useEffect, useState, useRef } from "react";
import "./Project.scss";

import AddGateway from "./AddGateway";
import Weather from "./Weather";
import Popup from "./Popup";
import Info from "../Device/Info";
import DashboardHistory from "./DashboardHistory";
import ProjectInfo from "./ProjectInfo";
import Benefit from "./Benefit";
import GraphComponent from "./GraphComponent";
import Data from "./Data";
import { Empty, plantState, projectData, popupState } from "./Project";
import { isMobile } from "../Navigation/Navigation";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR, Token, ruleInfor, socket } from "../../App";
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

export const temp = signal([]);
export const inverterDB = signal([]);
export const coalsave = signal({
  value: 1,
  ef: 0.7221,
  avr: 0.517,
  tree: 0.054,
});

const tabMobile = signal(false);
const tabLable = signal("");
const tab_ = signal("logger");
// const tabMobileAlert = signal(false);
// const tabLableAlert = signal("");
// const tabAlert = signal("all");
// const open = signal([]);
// const close = signal([]);
const viewNav = signal(false);
const viewStateNav = signal([false, false]);
// const dataMeter = [];
// const dataAlert = [];

export default function ProjectData(props) {
  const dataLang = useIntl();
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
  // const filterchart = useSelector((state) => state.tool.filterchart);
  const rootDispatch = useDispatch();

  // const tit = {
  //   dashboard: projectData.value.plantname,
  //   device: dataLang.formatMessage({ id: "device" }),
  //   alert: "Cảnh báo",
  // };

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
      selector: (row) => (
        <>
          {invt[row.logger_]?.[row.data.status] == 2 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </>
      ),
      width: "110px",
    },
    {
      name: dataLang.formatMessage({ id: "production" }),
      selector: (row) => {
        let power = 0;
        let d = JSON.parse(row.data.total?.register || "[]");

        if (row.data.mode === "HYBRID") {
          let num = [];
          d.map((item, i) => {
            num[i] = invt[row.logger_]?.[item];
          });
          power = parseFloat(
            num.reduce((a, b) => Number(a) + Number(b), 0) * row.data.total?.cal
          ).toFixed(2);
        }
        if (row.data.mode === "GRID") {
          power =
            convertToDoublewordAndFloat(
              [invt[row.logger_]?.[d[0]], invt[row.logger_]?.[d[1]]],
              "int"
            ) * row.data.total?.cal;
        }

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
            ? parseFloat(
              invt[row.logger_]?.[row.data.daily.register] *
              row.data.daily?.cal
            ).toFixed(2)
            : 0}{" "}
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
                {(popupState) => (<div className="DAT_TableEdit">
                  <IoMdMore size={20}   {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    {ruleInfor.value.setting.project.modify === true ?
                      <MenuItem id={`${row.sn}_${row.name}_edit`} onClick={(e) => { handleEdit(e); popupState.close() }}>
                        <FiEdit size={14} />&nbsp;
                        {dataLang.formatMessage({ id: "change" })}
                      </MenuItem>
                      : <></>
                    }

                  </Menu>
                </div>)}
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

  // const columnMeter = [
  //   {
  //     name: "Tên",
  //     selector: (row) => (
  //       <div>
  //         <div>{row.name}</div>
  //         <div>{row.SN}</div>
  //       </div>
  //     ),
  //     sortable: true,
  //     // minWidth: "350px",
  //     style: {
  //       justifyContent: "left",
  //     },
  //   },
  //   {
  //     name: "Trạng thái",
  //     selector: (row) => (
  //       <>
  //         {row.status ? (
  //           <FaCheckCircle size={20} color="green" />
  //         ) : (
  //           <MdOutlineError size={22} color="red" />
  //         )}
  //       </>
  //     ),
  //     // width: "110px",
  //   },
  //   {
  //     name: "Sản lượng(kW)",
  //     selector: (row) => row.production,
  //     sortable: true,
  //     // width: "140px",
  //   },
  //   {
  //     name: "SL tức thời(kWh)",
  //     selector: (row) => row.dailyproduction,
  //     sortable: true,
  //     // width: "150px",
  //   },
  //   {
  //     name: "Hiệu suất",
  //     selector: (row) => "--",
  //     sortable: true,
  //   },
  //   {
  //     name: "Lần cập nhật cuối",
  //     selector: (row) => row.updated,
  //     sortable: true,
  //     // width: "180px",
  //   },
  // ];

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
                {(popupState) => (<div className="DAT_TableEdit">
                  <IoMdMore size={20}   {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    {ruleInfor.value.setting.project.modify === true ?
                      <MenuItem id={`${row.sn}_${row.name}_edit`} onClick={(e) => { handleEdit(e); popupState.close() }}>
                        <FiEdit size={14} />&nbsp;
                        {dataLang.formatMessage({ id: "change" })}
                      </MenuItem>
                      : <></>
                    }
                    {ruleInfor.value.setting.project.remove === true ?
                      <MenuItem id={row.sn + "_remove"} onClick={(e) => { handleDelete(e); popupState.close() }}>
                        <IoTrashOutline size={16} />
                        &nbsp;
                        {dataLang.formatMessage({ id: "delete" })}
                      </MenuItem>
                      : <></>}


                  </Menu>
                </div>)}
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

  // const listAlertTab = [
  //   { id: "all", name: "Tất cả" },
  //   { id: "open", name: "Mở" },
  //   { id: "closed", name: "Đóng" },
  // ];

  // const columnAlert = [
  //   {
  //     name: "Tên",
  //     selector: (row) => (
  //       <div>
  //         <div>{row.name}</div>
  //       </div>
  //     ),
  //     sortable: true,
  //     // minWidth: "350px",
  //     style: {
  //       justifyContent: "left",
  //     },
  //   },
  //   {
  //     name: "Trạng thái",
  //     selector: (row) => (
  //       <>
  //         {row.status ? (
  //           <FaCheckCircle size={20} color="green" />
  //         ) : (
  //           <MdOutlineError size={22} color="red" />
  //         )}
  //       </>
  //     ),
  //     // width: "110px",
  //   },
  //   {
  //     name: "Mức quan trọng",
  //     selector: (row) => row.importance,
  //     sortable: true,
  //     // width: "140px",
  //   },
  //   {
  //     name: "Thiết bị",
  //     selector: (row) => (
  //       <div>
  //         <div>{row.device}</div>
  //         <div>{row.SN}</div>
  //       </div>
  //     ),
  //     sortable: true,
  //     // width: "150px",
  //   },
  //   {
  //     name: "Giờ mở",
  //     selector: (row) => row.openedtime,
  //     sortable: true,
  //   },
  //   {
  //     name: "Giờ đóng",
  //     selector: (row) => row.closedtime,
  //     sortable: true,
  //     // width: "180px",
  //   },
  // ];

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

  // const handleTabMobileAlert = (e) => {
  //   const id = e.currentTarget.id;
  //   tabAlert.value = id;
  //   const newLabel = listAlertTab.find((item) => item.id == id);
  //   tabLableAlert.value = newLabel.name;
  // };

  const handleModify = (e, type) => {
    const id = e.currentTarget.id;
    var arr = id.split("_");
    const mod = document.getElementById(arr[0] + "_Modify");
    mod.style.display = type;
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
    const res = await invtCloud('{"deviceCode":"' + sn + '"}', Token.value.token);
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

  useEffect(() => {
    // filter data AlertTable
    // open.value = dataAlert.filter((item) => item.status == true);
    // close.value = dataAlert.filter((item) => item.status == false);
    // tabLableAlert.value = listAlertTab[0].name;
    tabLable.value = listDeviceTab[0].name;

    const getShared = async () => {
      let req = await callApi("post", host.DATA + "/getmailPlantmem", { plantid: projectData.value.plantid_, usr: user });
      if (req.status) {
        setgetShared(req.data)
      }
    }
    getShared();

    //data Logger
    const getLogger = async () => {
      let d = await callApi("post", host.DATA + "/getLogger", {
        plantid: projectData.value.plantid_,
      });
      temp.value = d;
      d.map(async (item) => {
        const res = await invtCloud(
          '{"deviceCode":"' + item.sn + '"}',
          Token.value.token
        );
        if (res.ret === 0) {
          let res_ = await callApi("post", host.DATA + "/updateLogger", {
            sn: item.sn,
            type: "state",
            data: res.data.enabled,
          });
          setInvt((pre) => ({ ...pre, [item.sn]: res.data }));
          const decimalArray = JSON.parse(item.setting.sn);
          const hexString = decimalArray
            .map((num) => parseInt(res.data[num]).toString(16))
            .join("");
          const asciiString = hexString
            .match(/.{2}/g)
            .map((byte) => String.fromCharCode(parseInt(byte, 16)))
            .join("");
        } else {
          setInvt((pre) => ({ ...pre, [item.sn]: {} }));
        }

        let inverter = await callApi("post", host.DATA + "/getInverter", {
          loggerid: item.sn,
        });
        if (inverter.length > 0) {
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
      rootDispatch(toolslice.actions.setcal({
        pro_1: 0,
        pro_2: 0,
        pro_3: 0,
        bat_1: 0,
        bat_2: 0,
        bat_in_1: 0,
        bat_out_1: 0,
        con_1: 0,
        con_2: 0,
        grid_1: 0,
        grid_in_1: 0,
        grid_in_2: 0,
        grid_out_1: 0,
        grid_out_2: 0,
      }));
    }
    // eslint-disable-next-line
  }, [lang]);

  useEffect(() => {
    var num_ = {
      bat_1: [],
      bat_2: [],
      bat_in_1: [],
      bat_out_1: [],
      con_1: [],
      con_2: [],
      grid_1: [],
      grid_in_1: [],
      grid_in_2: [],
      grid_out_1: [],
      grid_out_2: [],
      pro_1: [],
      pro_2: [],
      pro_3: [],
    };
    var cal_ = {};
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
            }, 0);

            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0) * parseFloat(value.cal)
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
            num_[key][i] = convertToDoublewordAndFloat(e, "int");

            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0) * parseFloat(value.cal)
              ).toFixed(2);
            }
            break;
          default:
            num_[key][i] =
              parseFloat(invt[item.sn]?.[value.register] || 0) *
              parseFloat(value.cal);
            if (i == temp.value.length - 1) {
              cal_[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                })
              ).toFixed(2);
            }
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

            setInvt(pre => ({
              ...pre,
              [item.sn]: {
                ...pre[item.sn],
                [keyName]: data.data[keyName]
              }
            }))
          })
        })
      })
    }

    // eslint-disable-next-line
  }, [temp.value])

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        // plantState.value = "default";
        setDropState(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={box} style={{ width: "98%", margin: "auto" }}>
      <div className="DAT_ProjectData">
        {isMobile.value
          ? <div className="DAT_ProjectData_Header">
            <div className="DAT_ProjectData_Header_Left">
              <div className="DAT_ProjectData_Header_Left_Top"
                style={{ fontSize: 22 }}
              >
                <img src={projectData.value.img ? projectData.value.img : "/dat_picture/solar_panel.png"} alt="" />
                <div className="DAT_ProjectData_Header_Left_Top_Content">
                  <div className="DAT_ProjectData_Header_Left_Top_Content_Name">
                    {projectData.value.plantname}
                    {projectData.value.state === 1 ? <FaCheckCircle size={20} color="green" /> : <MdOutlineError size={20} color="red" />}
                  </div>
                  <div className="DAT_ProjectData_Header_Left_Top_Content_Addr">
                    {projectData.value.addr}
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Header_Right">
              <div className="DAT_ProjectData_Header_Right_More">
                <BsThreeDotsVertical
                  size={20}
                  color="#9e9e9e"
                  onClick={() => {
                    setDropState(!dropState);
                  }}
                />
              </div>

              <div className="DAT_ProjectData_Header_Right_Close"
                onClick={() => {
                  plantState.value = "default";
                  setDropState(false);
                }}
              >
                <IoClose size={25} color="rgba(11, 25, 103)" />
              </div>
            </div>
          </div>

          : <div className="DAT_ProjectData_Header">
            <div className="DAT_ProjectData_Header_Left">
              <div className="DAT_ProjectData_Header_Left_Top"
                style={{ fontSize: 22 }}
              >
                <img src={projectData.value.img ? projectData.value.img : "/dat_picture/solar_panel.png"} alt="" />
                <div className="DAT_ProjectData_Header_Left_Top_Content">
                  <div className="DAT_ProjectData_Header_Left_Top_Content_Name">
                    {projectData.value.plantname}
                    {projectData.value.state === 1 ? <FaCheckCircle size={20} color="green" /> : <MdOutlineError size={20} color="red" />}
                  </div>
                  <div className="DAT_ProjectData_Header_Left_Top_Content_Addr">
                    {projectData.value.addr}
                  </div>
                </div>
              </div>
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

              {ruleInfor.value.setting.device.add
                ? projectData.value.shared === 1
                  ? <></>
                  : <div className="DAT_ProjectData_Header_Right_Add"
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
                : <></>
              }

              <div className="DAT_ProjectData_Header_Right_Close"
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
        }

        {(() => {
          switch (view) {
            case "dashboard":
              return (
                <div className="DAT_ProjectData_Dashboard">
                  <div className="DAT_ProjectData_Dashboard_Data">
                    <Data />
                    <GraphComponent />
                    <div className="DAT_ProjectData_Dashboard_Data_Right">
                      <div className="DAT_ProjectData_Dashboard_Data_Right_Weather">
                        <Weather />
                      </div>
                    </div>
                  </div>

                  <DashboardHistory />

                  <div className="DAT_ProjectData_Dashboard_More">
                    <ProjectInfo />
                    <Benefit />
                  </div>
                </div>
              );
            case "device":
              return (
                <div className="DAT_ProjectData_Device">
                  {isMobile.value ? (
                    <div className="DAT_ProjectData_Device_TableMobile">
                      <div className="DAT_Toollist_Tab_Mobile">
                        <button
                          className="DAT_Toollist_Tab_Mobile_content"
                          onClick={() => (tabMobile.value = !tabMobile.value)}
                        >
                          <span> {tabLable.value}</span>
                          <FiFilter />
                          {tabMobile.value ? (<IoIosArrowDown />) : (<IoIosArrowForward />)}
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
                        <div className="DAT_Toollist_Tab_Mobile_list"
                          style={{
                            top: "50px",
                            height: tabMobile.value ? "66px" : "0px",
                            transition: "0.5s",
                            boxShadow: tabMobile.value ? "0 0 4px 4px rgba(193, 193, 193, 0.5)" : "none"
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
                                    <div className="DAT_ProjectData_Device_TableMobile_Content" key={i}>
                                      <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Type">
                                          {item.type}
                                        </div>
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
                                            onClick={(e) => handleInfoLogger(e)}
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
                                              <FaCheckCircle size={16} color="green" />
                                              <span>
                                                {dataLang.formatMessage({ id: "online", })}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <MdOutlineError size={18} color="red" />
                                              <span>
                                                {dataLang.formatMessage({ id: "offline", })}
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
                                    <div key={i} className="DAT_ProjectData_Device_TableMobile_Content">
                                      <div className="DAT_ProjectData_Device_TableMobile_Content_Top">
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Type"
                                          style={{ backgroundColor: COLOR.value.DarkGreenColor }}
                                        >
                                          {item.data.mode}
                                        </div>
                                        <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info">
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Name"
                                            onClick={(e) => handleInfoInverter(e)}
                                          >
                                            {item.name}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_Sn">
                                            SN: {item.sn}
                                          </div>
                                          <div className="DAT_ProjectData_Device_TableMobile_Content_Top_Info_OgLog">
                                            {dataLang.formatMessage({ id: "ogLog", })}: {item.logger_}
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
                  ) : (
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
                            // case "meter":
                            //   return (
                            //     <DataTable
                            //       className="DAT_Table_Device"
                            //       columns={columnMeter}
                            //       data={dataMeter}
                            //       pagination
                            //       paginationComponentOptions={
                            //         paginationComponentOptions
                            //       }
                            //       fixedHeader={true}
                            //       noDataComponent={<Empty />}
                            //     />
                            //   );
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
                  )}
                </div>
              );
            // case "alert":
            //   return (
            //     <div className="DAT_ProjectData_Alert">
            //       <div className="DAT_ProjectData_Alert_Data">
            //         {isMobile.value ? (
            //           <div className="DAT_Toollist_Tab_Mobile">
            //             <button
            //               className="DAT_Toollist_Tab_Mobile_content"
            //               onClick={() =>
            //                 (tabMobileAlert.value = !tabMobileAlert.value)
            //               }
            //             >
            //               <span> {tabLableAlert.value}</span>
            //               {tabMobileAlert.value ? (
            //                 <IoIosArrowDown />
            //               ) : (
            //                 <IoIosArrowForward />
            //               )}
            //             </button>
            //             <div className="DAT_Toollist_Tab_Mobile_list">
            //               {listAlertTab.map((item, i) => {
            //                 return (
            //                   <div
            //                     className="DAT_Toollist_Tab_Mobile_list_item"
            //                     style={{
            //                       display: tabMobileAlert.value
            //                         ? "block"
            //                         : "none",
            //                     }}
            //                     key={"tabmobile_" + i}
            //                     id={item.id}
            //                     onClick={(e) => handleTabMobileAlert(e)}
            //                   >
            //                     {i + 1}: {item.name}
            //                   </div>
            //                 );
            //               })}
            //             </div>
            //           </div>
            //         ) : (
            //           <div className="DAT_Toollist_Tab">
            //             {listAlertTab.map((item, i) => {
            //               return tabAlert.value === item.id ? (
            //                 <div
            //                   className="DAT_Toollist_Tab_main"
            //                   key={"tab_" + i}
            //                 >
            //                   <p className="DAT_Toollist_Tab_main_left"></p>
            //                   <span
            //                     className="DAT_Toollist_Tab_main_content1"
            //                     id={item.id}
            //                     style={{
            //                       backgroundColor: "White",
            //                       color: "black",
            //                       borderRadius: "10px 10px 0 0",
            //                     }}
            //                     onClick={(e) => (tabAlert.value = item.id)}
            //                   >
            //                     {item.name}
            //                   </span>
            //                   <p className="DAT_Toollist_Tab_main_right"></p>
            //                 </div>
            //               ) : (
            //                 <span
            //                   className="DAT_Toollist_Tab_main_content2"
            //                   key={"tab_" + i}
            //                   id={item.id}
            //                   style={{ backgroundColor: "#dadada" }}
            //                   onClick={(e) => (tabAlert.value = item.id)}
            //                 >
            //                   {item.name}
            //                 </span>
            //               );
            //             })}
            //           </div>
            //         )}

            //         <div className="DAT_ProjectData_Alert_Data_Table">
            //           {(() => {
            //             switch (tabAlert.value) {
            //               case "all":
            //                 return (
            //                   <DataTable
            //                     className="DAT_Table_Alert"
            //                     columns={columnAlert}
            //                     data={dataAlert}
            //                     pagination
            //                     paginationComponentOptions={
            //                       paginationComponentOptions
            //                     }
            //                     fixedHeader={true}
            //                     noDataComponent={<Empty />}
            //                   />
            //                 );
            //               case "open":
            //                 return (
            //                   <DataTable
            //                     className="DAT_Table_Alert"
            //                     columns={columnAlert}
            //                     data={open.value}
            //                     pagination
            //                     paginationComponentOptions={
            //                       paginationComponentOptions
            //                     }
            //                     fixedHeader={true}
            //                     noDataComponent={<Empty />}
            //                   />
            //                 );
            //               case "closed":
            //                 return (
            //                   <DataTable
            //                     className="DAT_Table_Alert"
            //                     columns={columnAlert}
            //                     data={close.value}
            //                     pagination
            //                     paginationComponentOptions={
            //                       paginationComponentOptions
            //                     }
            //                     fixedHeader={true}
            //                     noDataComponent={<Empty />}
            //                   />
            //                 );
            //               default:
            //                 return <></>;
            //             }
            //           })()}
            //         </div>
            //       </div>
            //     </div>
            //   );
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
                </div>
              );
            default:
              <></>;
          }
        })()}
      </div>

      {popupAddGateway
        ? <div className="DAT_AddGatewayPopup">
          <AddGateway
            data={temp.value}
            handleInvt={handleInvt}
            handleClose={handleClosePopupAddGateway}
          />
        </div>
        : <></>
      }

      {popupState.value
        ? <div className="DAT_DevicePopup">
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
        : <> </>
      }

      {isMobile.value
        ? <>
          {dropState
            ? <div className="DAT_ProjectDataDrop">
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
            : <></>
          }
        </>
        : <>
          {dropState
            ? <div className="DAT_ProjectDataDrop"
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
            : <></>
          }
        </>
      }

      <div className="DAT_DeviceInfor"
        style={{ height: infoState ? "100%" : "0px", transition: "0.5s" }}
      >
        {infoState ? <Info handleClose={handleCloseInfo} /> : <></>}
      </div>
    </div>
  );
}
