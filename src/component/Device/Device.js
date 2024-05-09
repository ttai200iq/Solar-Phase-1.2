import React, { useEffect, useState } from "react";
import "./Device.scss";

import Info from "./Info";
import Popup from "./Popup";
import DataTable from "react-data-table-component";
import { signal } from "@preact/signals-react";
import { Empty, connectval } from "../Project/Project";
import { isMobile } from "../Navigation/Navigation";
import { useSelector } from "react-redux";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { COLOR, Token, convertUnit, ruleInfor, userInfor } from "../../App";
import { useIntl } from "react-intl";
import Filter from "../Project/Filter";
import axios from "axios";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";

import { MdDevices, MdOutlineError } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp, IoMdMore } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FiEdit, FiFilter } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";

export const tab = signal("logger");
export const info = signal({});
export const projectList = signal([]);
export const loggerList = signal([]);
export const inverterList = signal([]);

const tabMobile = signal(false);
const tabLable = signal("");

export default function Device(props) {
  const dataLang = useIntl();
  const user = useSelector((state) => state.admin.usr);
  // const [filter, setFilter] = useState(false);
  const [type, setType] = useState("");
  const [plantid, setPlantid] = useState("");
  const [snlogger, setSnlogger] = useState("");
  const [datafilter, setDatafilter] = useState([]);
  const [datafilerInvert, setDatafilterInvert] = useState([]);
  const [display, setDisplay] = useState(false);
  const [invt, setInvt] = useState({});
  const [popupState, setPopupState] = useState(false);
  const [infoState, setInfoState] = useState(false);
  const [devname, setDevname] = useState("");
  const [devtype, setDevtype] = useState("");

  const listTab = [
    { id: "logger", name: "Logger" },
    { id: "inverter", name: "Inverter" },
    // { id: "meter", name: "Meter" },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const dataMeter = [
    {
      id: 1,
      SN: "M0000223",
      name: "Meter 01",
      plant: "Năng lượng DAT 02",
      status: true,
      production: "66",
      dailyproduction: "895.4",
      updated: "12/30/2023 12:07:12",
    },
    {
      id: 2,
      SN: "M0000009",
      name: "Meter 02",
      plant: "Năng lượng DAT 02",
      status: true,
      production: "18",
      dailyproduction: "1238.4",
      updated: "12/30/2023 12:07:12",
    },
    {
      id: 3,
      SN: "M0000327",
      name: "Meter 03",
      plant: "Năng lượng DAT 02",
      status: true,
      production: "45",
      dailyproduction: "1024.4",
      updated: "12/30/2023 12:07:12",
    },
  ];

  const columnDevice = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, i) => i + 1,
      sortable: true,
      width: "80px",
      style: {
        justifyContent: "center",
      },
    },
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => (
        <div className="DAT_Table">
          <div
            className="DAT_Table_Infor"
            style={{ cursor: "pointer" }}
            id={`${row.psn}_${tab.value}_${row.plogger}`}
            onClick={(e) => handleShowInfo(e)}
          >
            <div className="DAT_Table_Infor_Name">{row.pname}</div>
            <div className="DAT_Table_Infor_Addr">{row.psn}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "180px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "project" }),
      selector: (row) => row.pplantname,
      sortable: true,
      minWidth: "300px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "status" }),
      selector: (row) => (
        <>
          {invt[row.plogger]?.[row.pdata.status] == 2 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </>
      ),
      width: "100px",
    },
    {
      name: dataLang.formatMessage({ id: "production" }),
      selector: (row) => {
        let power = 0;
        let d = JSON.parse(row.pdata.total?.register || "[]");
        if (row.pdata.mode === "HYBRID") {
          let num = [];
          d.map((item, i) => {
            num[i] = invt[row.plogger]?.[item];
          });
          power = parseFloat(
            num.reduce((a, b) => Number(a) + Number(b), 0) *
            row.pdata.total?.cal
          ).toFixed(2);
        }
        if (row.pdata.mode === "GRID") {
          power =
            convertToDoublewordAndFloat(
              [invt[row.plogger]?.[d[0]], invt[row.plogger]?.[d[1]]],
              "int"
            ) * row.pdata.total?.cal;
        }
        return <div>{parseFloat(power / 1000).toFixed(2)} kW</div>;
      },
      sortable: true,
      width: "150px",
    },
    {
      name: dataLang.formatMessage({ id: "daily" }),
      selector: (row) => (
        <>
          {row.pdata.daily?.register
            ? Number(
              parseFloat(
                convertUnit(
                  invt[row.plogger]?.[row.pdata.daily.register] *
                  row.pdata.daily?.cal
                )
              ).toFixed(2)
            ).toLocaleString("en-US")
            : 0}
          kWh
        </>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: dataLang.formatMessage({ id: "ogLog" }),
      selector: (row) => row.plogger,
      sortable: true,
      width: "180px",
    },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <>
          {ruleInfor.value.setting.device.modify === true ||
            ruleInfor.value.setting.device.delete === true ? (
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.psn + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (<div className="DAT_TableEdit">
                <IoMdMore size={20}   {...bindToggle(popupState)} />
                <Menu {...bindMenu(popupState)}>

                  <MenuItem id={`${row.psn}-${row.pname}-edit`} onClick={(e) => { handleEdit(e); popupState.close() }}>
                    <FiEdit size={14} />&nbsp;
                    {dataLang.formatMessage({ id: "change" })}
                  </MenuItem>

                </Menu>
              </div>)}
            </PopupState>
          ) : (
            <div></div>
          )}
          {/* <div
            className="DAT_ModifyBox"
            id={row.psn + "_Modify"}
            style={{ display: "none" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div
              className="DAT_ModifyBox_Fix"
              id={`${row.psn}-${row.pname}-edit`}
              onClick={(e) => handleEdit(e)}
            >
              <FiEdit size={14} />
              &nbsp;
              {dataLang.formatMessage({ id: "change" })}
            </div>
          </div> */}
        </>
      ),
      width: "110px",
    },
  ];

  const columnRemote = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, i) => i + 1,
      sortable: true,
      width: "80px",
      style: {
        justifyContent: "center",
      },
    },
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => (
        <div className="DAT_Table">
          <div
            className="DAT_Table_Infor"
            id={row.pid + "_" + tab.value}
            style={{ cursor: "pointer" }}
            onClick={(e) => handleShowInfo(e)}
          >
            <div className="DAT_Table_Infor_Name">{row.pname}</div>
            <div className="DAT_Table_Infor_Addr">{row.psn}</div>
          </div>
        </div>
      ),
      sortable: true,
      minWidth: "350px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "project" }),
      selector: (row) => row.pplantname,
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
          {row.pstate === 1 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </>
      ),
      width: "110px",
    },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <>
          {ruleInfor.value.setting.device.modify === true ||
            ruleInfor.value.setting.device.delete === true ? (
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.psn + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (<div className="DAT_TableEdit">
                <IoMdMore size={20}   {...bindToggle(popupState)} />
                <Menu {...bindMenu(popupState)}>
                  {ruleInfor.value.setting.device.modify === true ?
                    <MenuItem id={`${row.psn}-${row.pname}-edit`} onClick={(e) => { handleEdit(e); popupState.close() }}>
                      <FiEdit size={14} />&nbsp;
                      {dataLang.formatMessage({ id: "change" })}
                    </MenuItem>
                    : <></>
                  }
                  {ruleInfor.value.setting.device.remove === true ?
                    <MenuItem id={row.psn + "_" + row.pplantid + "_remove"} onClick={(e) => { handleRemove(e); popupState.close() }}>
                      <IoTrashOutline size={16} />
                      &nbsp;
                      {dataLang.formatMessage({ id: "delete" })}
                    </MenuItem>
                    : <></>}


                </Menu>
              </div>)}
            </PopupState>
          ) : (
            <div></div>
          )}
          {/* <div
            className="DAT_ModifyBox"
            id={row.psn + "_Modify"}
            style={{ display: "none", marginTop: "2px" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div
              className="DAT_ModifyBox_Fix"
              id={`${row.psn}-${row.pname}-edit`}
              onClick={(e) => handleEdit(e)}
            >
              <FiEdit size={14} />
              &nbsp;
              {dataLang.formatMessage({ id: "change" })}
            </div>
            <div
              className="DAT_ModifyBox_Remove"
              id={row.psn + "_" + row.pplantid + "_remove"}
              onClick={(e) => handleRemove(e)}
            >
              <IoTrashOutline size={16} />
              &nbsp;
              {dataLang.formatMessage({ id: "delete" })}
            </div>
          </div> */}
        </>
      ),
      width: "103px",
    },
  ];

  const handleShowInfo = (e) => {
    setInfoState(true);
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    switch (idArr[1]) {
      case "inverter":
        info.value = inverterList.value.find((item) => item.psn == idArr[0]);
        info.value.invt = invt[idArr[2]];
        break;
      case "logger":
        info.value = loggerList.value.find((item) => item.pid == idArr[0]);
        break;
      case "meter":
        info.value = dataMeter.find((item) => item.id == idArr[0]);
        break;
      default:
        break;
    }
  };

  const handleCloseInfo = () => {
    setInfoState(false);
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

  const handleEdit = (e) => {
    setPopupState(true);
    const id = e.currentTarget.id;
    const idArr = id.split("-");
    setSnlogger(idArr[0]);
    setDevname(idArr[1]);
    setType(idArr[2]);
    setDevtype(tab.value);
  };

  const handleRemove = (e) => {
    setPopupState(true);
    const id = e.currentTarget.id;
    const idArr = id.split("_");
    setPlantid(idArr[1]);
    setSnlogger(idArr[0]);
    setType(idArr[2]);

    // switch (idArr[1]) {
    //   case "inverter":
    //     info.value = dataInverter.find((item) => item.id == idArr[0]);
    //     break;
    //   case "logger":
    //     info.value = dataLogger.find((item) => item.id == idArr[0]);
    //     break;
    //   case "meter":
    //     info.value = dataMeter.find((item) => item.id == idArr[0]);
    //     break;
    // }
  };

  const closeFilter = () => {
    setDisplay(false);
  };

  const handleClosePopup = () => {
    setPopupState(false);
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

  // const handleModify = (e, type) => {
  //   const id = e.currentTarget.id;
  //   var arr = id.split("_");
  //   const mod = document.getElementById(arr[0] + "_Modify");
  //   mod.style.display = type;
  // };

  const handleTabMobile = (e) => {
    const id = e.currentTarget.id;
    tab.value = id;
    const newLabel = listTab.find((item) => item.id == id);
    tabLable.value = newLabel.name;
  };

  const handleSearch = (e) => {
    const searchTerm = lowercasedata(e.currentTarget.value);
    switch (tab.value) {
      case "logger":
        if (searchTerm == "") {
          setDatafilter(loggerList.value);
        } else {
          const db = loggerList.value.filter((item) => {
            return (
              lowercasedata(item.pname).includes(searchTerm) ||
              lowercasedata(item.psn).includes(searchTerm) ||
              lowercasedata(item.pplantname).includes(searchTerm)
            );
          });
          setDatafilter([...db]);
        }
        break;
      case "inverter":
        if (searchTerm == "") {
          setDatafilterInvert(inverterList.value);
        } else {
          const dbInvert = inverterList.value.filter((item) => {
            return (
              lowercasedata(item.pname).includes(searchTerm) ||
              lowercasedata(item.psn).includes(searchTerm) ||
              lowercasedata(item.pplantname).includes(searchTerm) ||
              lowercasedata(item.plogger).includes(searchTerm)
            );
          });
          setDatafilterInvert([...dbInvert]);
        }
        break;
      default:
        break;
    }
  };

  const handleFilterDevice = (deviceF) => {
    setDisplay(false);

    switch (tab.value) {
      case "logger":
        let tL = 2;
        if (deviceF === "online") {
          tL = 1;
        } else if (deviceF === "offline") {
          tL = 0;
        } else {
          tL = 2;
        }
        if (tL == 2) {
          setDatafilter(loggerList.value);
        } else {
          const temp = loggerList.value.filter((item) => item.pstate === tL);
          setDatafilter(temp);
        }
        break;
      case "inverter":
        if (deviceF === "online") {
          const db = inverterList.value.filter(
            (item) => parseInt(invt[item.plogger][item.pdata.status]) === 2
          );
          setDatafilterInvert(db);
        } else if (deviceF === "offline") {
          const db = inverterList.value.filter(
            (item) => parseInt(invt[item.plogger][item.pdata.status]) !== 2
          );
          setDatafilterInvert(db);
        } else if (deviceF === "all") {
          setDatafilterInvert(inverterList.value);
        }
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setDisplay(false);
    setDatafilter(loggerList.value);
  };

  const handleCloseFilter = () => {
    setDisplay(false);
  };

  useEffect(() => {
    if (connectval.value) {
      let filter = loggerList.value.filter(
        (item) =>
          item.pplantname.includes(connectval.value) ||
          item.pplantname.toLowerCase().includes(connectval.value)
      );
      setDatafilter([...filter]);
      let d = document.getElementById("search");
      d.value = connectval.value;
    } else {
      setDatafilter(loggerList.value);
    }

    setDatafilterInvert(inverterList.value);
  }, [loggerList.value, connectval.value]);

  useEffect(() => {
    tabLable.value = listTab[0].name;
    // get logger
    const getAllLogger = async () => {
      let d = await callApi("post", host.DATA + "/getallLogger", {
        usr: user,
        partnerid: userInfor.value.partnerid,
        type: userInfor.value.type,
      });
      if (d.status === true) {
        loggerList.value = d.data;

        d.data.map(async (item) => {
          const res = await invtCloud(
            '{"deviceCode":"' + item.psn + '"}',
            Token.value.token
          );
          if (res.ret === 0) {
            setInvt((pre) => ({ ...pre, [item.psn]: res.data }));
          } else {
            setInvt((pre) => ({ ...pre, [item.psn]: {} }));
          }
        });
      }
    };
    getAllLogger();

    return () => {
      tab.value = "logger";
    };
  }, []);

  //API INVERTER
  useEffect(() => {
    const getAllInverter = async () => {
      let d = await callApi("post", host.DATA + "/getallInverter", {
        usr: user,
        partnerid: userInfor.value.partnerid,
        type: userInfor.value.type,
      });
      if (d.status === true) {
        inverterList.value = d.data;
        setDatafilterInvert(d.data);
      }
    };
    if (tab.value == "inverter") {
      getAllInverter();
    }
  }, [tab.value]);

  return (
    <>
      {isMobile.value ? (
        <div className="DAT_DeviceHeaderMobile">
          <div className="DAT_DeviceHeaderMobile_Top">
            <div className="DAT_DeviceHeaderMobile_Top_Filter">
              <input
                type="text"
                id="search"
                placeholder={
                  tab.value == "logger"
                    ? dataLang.formatMessage({ id: "enterLogger" })
                    : dataLang.formatMessage({ id: "enterInverter" })
                }
                autoComplete="off"
                onChange={(e) => handleSearch(e)}
              />
              <CiSearch color="gray" size={20} />
            </div>
          </div>

          <div className="DAT_DeviceHeaderMobile_Title">
            <MdDevices color="gray" size={25} />
            <span>{dataLang.formatMessage({ id: "device" })}</span>
          </div>
        </div>
      ) : (
        <div className="DAT_DeviceHeader">
          <div className="DAT_DeviceHeader_Title">
            <MdDevices color="gray" size={25} />
            <span>{dataLang.formatMessage({ id: "device" })}</span>
          </div>
          <div className="DAT_DeviceHeader_Filter">
            <input
              type="text"
              id="search"
              placeholder={
                tab.value == "logger"
                  ? dataLang.formatMessage({ id: "enterLogger" })
                  : dataLang.formatMessage({ id: "enterInverter" })
              }
              autoComplete="off"
              onChange={(e) => handleSearch(e)}
            />
            <CiSearch color="gray" size={20} />
          </div>
          <div></div>
        </div>

      )}

      {isMobile.value ? (
        <div className="DAT_DeviceMobile">
          <div className="DAT_Toollist_Tab_Mobile">
            <button className="DAT_Toollist_Tab_Mobile_content"
              onClick={() => (tabMobile.value = !tabMobile.value)}
            >
              <span> {tabLable.value}</span>
              <div className="DAT_Toollist_Tab_Mobile_content_Icon">
                <FiFilter />
                {tabMobile.value ? <IoIosArrowDown /> : <IoIosArrowForward />}
              </div>
            </button>

            <div className="DAT_Toollist_Tab_Mobile_list"
              style={{
                top: "50px",
                height: tabMobile.value ? "66px" : "0",
                transition: "0.5s",
                boxShadow: tabMobile.value ? "0 0 4px 4px rgba(193, 193, 193, 0.5)" : "none"
              }}
            >
              {listTab.map((item, i) => {
                return (
                  <div
                    className="DAT_Toollist_Tab_Mobile_list_item"
                    key={i}
                    id={item.id}
                    onClick={(e) => {
                      handleTabMobile(e);
                      tabMobile.value = false
                    }}
                  >
                    {i + 1}: {item.name}
                  </div>
                );
              })}
            </div>
          </div>

          {(() => {
            switch (tab.value) {
              case "inverter":
                return (
                  <>
                    {datafilerInvert.map((item, i) => {
                      return (
                        <div key={i} className="DAT_DeviceMobile_Content">
                          <div className="DAT_DeviceMobile_Content_Top">
                            <div className="DAT_DeviceMobile_Content_Top_Type"
                              style={{ backgroundColor: COLOR.value.DarkGreenColor }}
                              id={`${item.psn}_${tab.value}_${item.plogger}`}
                              onClick={(e) => handleShowInfo(e)}
                            >
                              {item.pdata.mode}
                            </div>
                            <div className="DAT_DeviceMobile_Content_Top_Info">
                              <div className="DAT_DeviceMobile_Content_Top_Info_Name"
                                id={`${item.psn}_${tab.value}_${item.plogger}`}
                                onClick={(e) => handleShowInfo(e)}
                              >
                                {item.pname}
                              </div>
                              <div className="DAT_DeviceMobile_Content_Top_Info_Sn">
                                SN: {item.psn}
                              </div>
                              <div className="DAT_DeviceMobile_Content_Top_Info_OgLog">
                                {dataLang.formatMessage({ id: "ogLog" })}: {item.plogger}
                              </div>
                            </div>
                          </div>

                          <div className="DAT_DeviceMobile_Content_Bottom">
                            <div className="DAT_DeviceMobile_Content_Bottom_State">
                              {invt[item.plogger]?.[item.pdata.status] == 2 ? (
                                <>
                                  <FaCheckCircle size={16} color="green" />
                                  <span>
                                    {dataLang.formatMessage({ id: "online" })}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <MdOutlineError size={16} color="red" />
                                  <span>
                                    {dataLang.formatMessage({ id: "offline" })}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="DAT_DeviceMobile_Content_Bottom_Right">
                              {ruleInfor.value.setting.device.modify ===
                                true ? (
                                <div className="DAT_DeviceMobile_Content_Bottom_Right_Item">
                                  <FiEdit
                                    size={14}
                                    id={`${item.psn}-${item.pname}-edit`}
                                    onClick={(e) => handleEdit(e)}
                                  />
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
                return (<></>);
              case "logger":
                return (
                  <>
                    {datafilter.map((item, i) => {
                      return (
                        <div key={i} className="DAT_DeviceMobile_Content">
                          <div className="DAT_DeviceMobile_Content_Top">
                            <div className="DAT_DeviceMobile_Content_Top_Type"
                              id={`${item.pid}_${tab.value}`}
                              onClick={(e) => handleShowInfo(e)}
                            >
                              {item.ptype}
                            </div>
                            <div className="DAT_DeviceMobile_Content_Top_Info">
                              <div className="DAT_DeviceMobile_Content_Top_Info_Name"
                                id={`${item.pid}_${tab.value}`}
                                onClick={(e) => handleShowInfo(e)}
                              >
                                {item.pname}
                              </div>
                              <div className="DAT_DeviceMobile_Content_Top_Info_Sn">
                                SN: {item.psn}
                              </div>
                              <div className="DAT_DeviceMobile_Content_Top_Info_Plant">
                                {dataLang.formatMessage({ id: "project" })}: {item.pplantname}
                              </div>
                            </div>
                          </div>

                          <div className="DAT_DeviceMobile_Content_Bottom">
                            <div className="DAT_DeviceMobile_Content_Bottom_State">
                              {item.pstate === 1 ? (
                                <>
                                  <FaCheckCircle size={16} color="green" />
                                  <span>
                                    {dataLang.formatMessage({ id: "online" })}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <MdOutlineError size={16} color="red" />
                                  <span>
                                    {dataLang.formatMessage({ id: "offline" })}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="DAT_DeviceMobile_Content_Bottom_Right">
                              {ruleInfor.value.setting.device.modify ===
                                true ? (
                                <div className="DAT_DeviceMobile_Content_Bottom_Right_Item">
                                  <FiEdit
                                    size={14}
                                    id={`${item.psn}-${item.pname}-edit`}
                                    onClick={(e) => handleEdit(e)}
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}
                              {ruleInfor.value.setting.device.remove ===
                                true ? (
                                <div
                                  className="DAT_DeviceMobile_Content_Bottom_Right_Item"
                                  id={`${item.psn}_${item.pplantid}_remove`}
                                  onClick={(e) => handleRemove(e)}
                                >
                                  <IoTrashOutline size={16} />
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
      ) : (
        <div className="DAT_Device">
          <div className="DAT_Toollist_Tab">
            {listTab.map((item, i) => {
              return tab.value === item.id ? (
                <div key={i} className="DAT_Toollist_Tab_main">
                  <p className="DAT_Toollist_Tab_main_left"></p>
                  <span
                    className="DAT_Toollist_Tab_main_content1"
                    id={item.id}
                    style={{
                      backgroundColor: "White",
                      color: "black",
                      borderRadius: "10px 10px 0 0",
                    }}
                    onClick={(e) => (tab.value = item.id)}
                  >
                    {item.name}
                  </span>
                  <p className="DAT_Toollist_Tab_main_right"></p>
                </div>
              ) : (
                <span
                  className="DAT_Toollist_Tab_main_content2"
                  key={i}
                  id={item.id}
                  style={{ backgroundColor: "#dadada" }}
                  onClick={(e) => (tab.value = item.id)}
                >
                  {item.name}
                </span>
              );
            })}

            <div
              className="DAT_Device_Filter"
              onClick={(e) => setDisplay(!display)}
            >
              <FiFilter />
              <IoIosArrowUp
                style={{
                  transform: display ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.5s",
                }}
                onClick={() => handleFilterDevice()}
              />
            </div>
          </div>

          <div className="DAT_Device_Content">
            {(() => {
              switch (tab.value) {
                case "inverter":
                  return (
                    <DataTable
                      className="DAT_Table_Container"
                      columns={columnDevice}
                      data={datafilerInvert}
                      pagination
                      paginationComponentOptions={paginationComponentOptions}
                      // fixedHeader={true}
                      noDataComponent={<Empty />}
                    />
                  );
                case "meter":
                  return (
                    <DataTable
                      className="DAT_Table_Container"
                      columns={columnDevice}
                      data={dataMeter}
                      pagination
                      paginationComponentOptions={paginationComponentOptions}
                      // fixedHeader={true}
                      noDataComponent={<Empty />}
                    />
                  );
                case "logger":
                  return (
                    <DataTable
                      className="DAT_Table_Container"
                      columns={columnRemote}
                      data={datafilter}
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

            <Filter
              type="device"
              display={display}
              handlefilterdevice={handleFilterDevice}
              handleReset={handleReset}
              handleClose={handleCloseFilter}
              handleCancel={closeFilter}
            />
          </div>
        </div>
      )}

      <div className="DAT_DeviceInfor"
        style={{ height: infoState ? "100%" : "0px", transition: "0.5s" }}
      >
        {infoState ? <Info handleClose={handleCloseInfo} /> : <></>}
      </div>

      {popupState ? (
        <div className="DAT_DevicePopup">
          <Popup
            plantid={plantid}
            sn={snlogger}
            name={devname}
            type={type}
            devtype={devtype}
            handleClose={handleClosePopup}
            handleCancel={closeFilter}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
