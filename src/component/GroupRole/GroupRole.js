import React, { useEffect, useState } from "react";
import "./GroupRole.scss";

import { signal } from "@preact/signals-react";
import CreateGroupRole from "./CreateGroupRole";
import Popup from "./Popup";
import AddUsers from "./AddUsers";
import ConfirmDeleteGroup from "./ConfirmDeleteGroup";
import EditGroup from "./EditGroup";
import DataTable from "react-data-table-component";
import { Empty } from "../Project/Project";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";
import EditRole from "../Role/EditRole";
import { Usr_, roleData } from "../Role/Role";
import PopupState, {
  bindHover,
  bindMenu,
  bindPopper,
  bindToggle,
} from "material-ui-popup-state";
import { Fade, Menu, MenuItem, Paper, Popper, Typography } from "@mui/material";
import { IoCaretBackOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { IoMdMore } from "react-icons/io";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import { PiUsersFour } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import { LuRouter } from "react-icons/lu";
import { BiMessageAltError } from "react-icons/bi";
import { datarule } from "../Rule/Rule";
import { ruleInfor } from "../../App";

//DATA TEMP
export const group = signal([]);
export const groupUser = signal([]);

//CONST SIGNALS
export const groupID = signal(0);
export const groupDelID = signal();
export const userDel = signal();
export const groupEdit = signal();

const datafilter = signal();

export default function GroupRole(props) {
  const dataLang = useIntl();
  const { isLandscape } = useMobileOrientation();
  // const [filter, setFilter] = useState(false);
  const [createState, setCreateState] = useState(false);
  const [addState, setAddState] = useState(false);
  const [popupState, setPopupState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [groupDelState, setGroupDelState] = useState(false);
  const [editrole, setEditrole] = useState(false);
  const [userList, setUserlist] = useState(false);
  const [filterType, setFilterType] = useState(true);
  const [dataPartner, setDataPartner] = useState();

  const GroupUsers = (props) => {
    const dataLang = useIntl();
    const paginationComponentOptions = {
      rowsPerPageText: dataLang.formatMessage({ id: "row" }),
      rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
      selectAllRowsItem: true,
      selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
    };

    // const handleModify = (e, type) => {
    //   const id = e.currentTarget.id;
    //   var arr = id.split("_");

    //   const mod = document.getElementById(arr[0] + "_Modify");
    //   mod.style.display = type;
    // };

    const columnGroupRole = [
      {
        name: dataLang.formatMessage({ id: "ordinalNumber" }),
        selector: (row, index) => index + 1,
        sortable: true,
        width: "80px",
      },
      {
        name: dataLang.formatMessage({ id: "account" }),
        selector: (user) => user.usr_,
        sortable: true,
        minWidth: "200px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: dataLang.formatMessage({ id: "name" }),
        selector: (user) => user.name_,
        sortable: true,
        maxWidth: "200px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: "Email",
        selector: (user) => user.mail_,
        sortable: true,
        width: "250px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: dataLang.formatMessage({ id: "phone" }),
        selector: (user) => user.phone_,
        sortable: true,
        minwidth: "200px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: dataLang.formatMessage({ id: "account" }),
        selector: (user) => dataLang.formatMessage({ id: user.type_ }),
        sortable: true,
        // width: "150px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: dataLang.formatMessage({ id: "role" }),
        selector: (user) => (
          <div
            style={{ cursor: "pointer" }}
            id={user.id_}
            onClick={(e) => handleEdit(e)}
          >
            {user.rulename_}
          </div>
        ),
        sortable: true,
        // width: "150px",
        style: {
          justifyContent: "left !important",
        },
      },
      {
        name: dataLang.formatMessage({ id: "setting" }),
        selector: (user) => (
          <>
            {user.type_ === "master" ? (
              <></>
            ) : (
              // <div className="DAT_TableEdit">
              //   <span
              //     id={user.id_ + "_MORE"}
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
                      <MenuItem
                        id={user.id_}
                        onClick={(e) => {
                          handleEdit(e);
                          popupState.close();
                        }}
                      >
                        <FiEdit size={14} />
                        &nbsp;
                        {dataLang.formatMessage({ id: "change" })}
                      </MenuItem>

                      <MenuItem
                        id={user.id_}
                        onClick={(e) => {
                          handleDeleteUser(e);
                          popupState.close();
                        }}
                      >
                        <IoTrashOutline size={16} />
                        &nbsp;
                        {dataLang.formatMessage({ id: "delete" })}
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </PopupState>
            )}
            {/* <div
              className="DAT_ModifyBox"
              id={user.id_ + "_Modify"}
              style={{ display: "none", marginRight: "4px", marginTop: "2px" }}
              onMouseLeave={(e) => handleModify(e, "none")}
            >
              <div
                className="DAT_ModifyBox_Fix"
                id={user.id_}
                onClick={(e) => handleEdit(e)}
              >
                <FiEdit size={14} />
                &nbsp;
                {dataLang.formatMessage({ id: "change" })}
              </div>
              <div
                className="DAT_ModifyBox_Remove"
                id={user.id_}
                onClick={(e) => handleDeleteUser(e)}
              >
                <IoTrashOutline size={16} />
                &nbsp;
                {dataLang.formatMessage({ id: "remove" })}
              </div>
            </div> */}
          </>
        ),
        width: "110px",
      },
    ];

    const handleEdit = (e) => {
      const id = parseInt(e.currentTarget.id);
      roleData.value = Usr_.value.find((item) => item.id_ == id);
      setEditrole(true);
      console.log(roleData.value);
      console.log(datarule.value);
    };

    useEffect(() => {
      const fetchUsr = async () => {
        const d = await callApi("post", host.DATA + "/getallUser", {
          partnerid: groupID.value,
        });
        if (d.status === true) {
          console.log(d.data);
          Usr_.value = d.data;
          Usr_.value = Usr_.value.sort((a, b) => a.ruleid_ - b.ruleid_);
        }
      };
      fetchUsr();
    }, []);

    const handleChangeGroup = (e) => {
      groupID.value = Number(e.currentTarget.id);
      const checkApi = async () => {
        const getUser = await callApi("post", host.DATA + "/getallUser", {
          partnerid: groupID.value,
        });
        if (getUser.status) {
          Usr_.value = getUser.data.sort((a, b) => a.id_ - b.id_);
          groupUser.value = getUser.data.sort((a, b) => a.id_ - b.id_);
          console.log(getUser.data);
        }
      };
      checkApi();
    };

    useEffect(() => {
      datafilter.value = groupUser.value.sort((a, b) => a.id_ - b.id_);
    }, [groupUser.value]);

    const handleDeleteUser = (e) => {
      props.delState();
      userDel.value = e.currentTarget.id;
    };

    const handleEditGroup = (e) => {
      props.editState();
      groupEdit.value = group.value.find(
        (item) => item.id_ === Number(e.currentTarget.id)
      );
    };

    const handleShowFunction = (e) => {
      const id = e.currentTarget.id;
      const idArr = id.split("_");
      const mod = document.getElementById(idArr[0] + "_function");
      const t = document.getElementById(idArr[0] + "_dot");
      if (t.style.display === "none") {
        t.style.display = "flex";
        mod.style.display = "none";
      } else {
        t.style.display = "none";
        mod.style.display = "flex";
      }
    };
    // const [userList, setUserlist] = useState(false);

    const colorbackground = {
      master: "rgba(255, 0, 0)",
      user: "rgba(247, 148, 29)",
      mainadmin: "#0082CA",
      admin: "rgba(11, 25, 103)",
    };

    return (
      <div
      // className="DAT_GR_Content_DevideTable"
      // style={{ height: "100% !important", width: "100% !important" }}
      >
        {isBrowser ? (
          <>
            <div className="DAT_GR_Content_DevideTable">
              <div
                className="DAT_GR_Content_DevideTable_Left"
                style={{ width: "300px" }}
              >
                <div className="DAT_GR_Content_DevideTable_Left_Head">
                  {dataLang.formatMessage({ id: "grouprole" })}
                </div>

                <div className="DAT_GR_Content_DevideTable_Left_ItemList">
                  {group.value.map((item, index) => (
                    <div
                      className="DAT_GR_Content_DevideTable_Left_ItemList_Item"
                      key={index}
                      id={item.id_}
                      style={{
                        backgroundColor:
                          groupID.value === item.id_
                            ? "rgb(207, 207, 207, 0.4)"
                            : "",
                      }}
                      onClick={(e) => {
                        handleChangeGroup(e);
                      }}
                    >
                      <div>
                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Name"
                          style={{ fontSize: "15px" }}
                        >
                          {item.name_}
                        </div>

                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Info"
                          style={{
                            fontSize: "13px",
                            color: "grey",
                            maxWidth: "100px",
                          }}
                        >
                          {item.code_}
                        </div>
                      </div>
                      <div
                        className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Shortcut"
                        id={item.id_ + "_dot"}
                        onClick={(e) => handleShowFunction(e)}
                      >
                        <IoMdMore size={20} color="grey" />
                      </div>

                      <div
                        className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More"
                        id={item.id_ + "_function"}
                        style={{ display: "none" }}
                        onMouseLeave={(e) => handleShowFunction(e)}
                      >
                        {item.id_ === 1 ? (
                          <></>
                        ) : (
                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Delete"
                            id={item.id_}
                            onClick={() => props.groupDelState()}
                          >
                            <IoTrashOutline size={18} />
                          </div>
                        )}
                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Edit"
                          style={{ right: "40px" }}
                          id={item.id_}
                          onClick={(e) => handleEditGroup(e)}
                        >
                          <FiEdit size={18} />
                        </div>

                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Add"
                          onClick={() => props.addState()}
                        >
                          <AiOutlineUserAdd size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="DAT_GR_Content_DevideTable_Right">
                <div className="DAT_GR_Content_DevideTable_Right_ItemList">
                  {groupID.value === 0 ? (
                    <Empty />
                  ) : (
                    <DataTable
                      className="DAT_Table_GroupRole"
                      columns={columnGroupRole}
                      data={datafilter.value}
                      pagination
                      paginationComponentOptions={paginationComponentOptions}
                      // fixedHeader={true}
                      noDataComponent={<Empty />}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {userList ? (
              <div className="DAT_GRMobile_Content_DevideTable_Right">
                {/* <div className="DAT_GRMobile_Content_DevideTable_Right_Head">
                  <IoCaretBackOutline
                    style={{ cursor: "pointer" }}
                    size={20}
                    color="white"
                    onClick={() => {
                      setUserlist(false);
                      groupID.value = 0;
                    }}
                  />
                  <div>{dataLang.formatMessage({ id: "roleList" })}</div>
                </div> */}
                <div className="DAT_GRMobile_Content_DevideTable_Right_ItemList">
                  {groupID.value === 0 ? (
                    <Empty />
                  ) : (
                    <div className="DAT_GRMobile">
                      {datafilter.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div
                                className="DAT_ProjectMobile_Content_Top_Avatar"
                                style={{
                                  minWidth: "40px",
                                  minHeight: "40px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "12px",
                                  backgroundColor: colorbackground[item.type_],
                                  color: "white",
                                  padding: "5px",
                                }}
                              >
                                <span>
                                  {dataLang.formatMessage({ id: item.type_ })}
                                </span>
                              </div>
                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.id_}
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "17px",
                                    }}
                                  >
                                    {item.name_}
                                  </div>
                                </div>

                                <div
                                  className="DAT_ProjectMobile_Content_Top_Info_Data"
                                  style={{
                                    color: "rgba(95, 95, 98)",
                                    fontSize: "12px",
                                  }}
                                >
                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name"></div>
                                    <div>
                                      {dataLang.formatMessage({
                                        id: "phone",
                                      })}
                                      : {item.phone_}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="DAT_ProjectMobile_Content_Top_Info_Data"
                                  style={{
                                    color: "rgba(95, 95, 98)",
                                    fontSize: "12px",
                                  }}
                                >
                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name"></div>
                                    <div>
                                      {dataLang.formatMessage({
                                        id: "email",
                                      })}
                                      : {item.mail_}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "rule" })}:
                                </span>
                                &nbsp;
                                <span>{item.rulename_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                {item.type_ !== "master" ? (
                                  ruleInfor.value.setting.rule.modify ? (
                                    <div
                                      className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                      id={item.id_}
                                      onClick={(e) => handleEdit(e)}
                                    >
                                      <FiEdit size={14} />
                                    </div>
                                  ) : (
                                    <></>
                                  )
                                ) : (
                                  <></>
                                )}
                                {item.type_ !== "master" ? (
                                  ruleInfor.value.setting.rule.modify ? (
                                    <div
                                      className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                      id={item.id_}
                                      onClick={(e) => handleDeleteUser(e)}
                                    >
                                      <IoTrashOutline size={16} />
                                    </div>
                                  ) : (
                                    <></>
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="DAT_GRMobile_Content_DevideTable_Left"
                style={{ width: "100% !important", height: "100%" }}
              >
                {/* <div className="DAT_GRMobile_Content_DevideTable_Left_Head">
                  {dataLang.formatMessage({ id: "grouprole" })}
                </div> */}

                <div className="DAT_GRMobile_Content_DevideTable_Left_ItemList">
                  {group.value.map((item, index) => (
                    <div
                      className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item"
                      key={index}
                      style={{
                        backgroundColor:
                          groupID.value === item.id_
                            ? "rgb(207, 207, 207, 0.4)"
                            : "",
                      }}
                      onClick={() => setFilterType(false)}
                    >
                      <div style={{ display: "flex" }}>
                        <div
                          className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_ID"
                          style={{ fontSize: "16px" }}
                        >
                          {index + 1}
                        </div>
                        <div className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Container">
                          <div
                            className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Container_Name"
                            style={{ fontSize: "16px" }}
                            id={item.id_}
                            onClick={(e) => {
                              handleChangeGroup(e);
                              setUserlist(true);
                            }}
                          >
                            {item.name_}
                          </div>

                          <div
                            className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Container_Info"
                            style={{
                              fontSize: "14px",
                              color: "grey",
                              maxWidth: "100px",
                            }}
                          >
                            {item.code_}
                          </div>
                        </div>
                      </div>

                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Shortcut"
                        id={item.id_ + "_dot"}
                        onClick={(e) => {
                          handleShowFunction(e);
                          groupID.value = item.id_;
                        }}
                      >
                        <IoMdMore size={20} color="grey" />
                      </div>

                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More"
                        id={item.id_ + "_function"}
                        style={{ display: "none" }}
                        onMouseLeave={(e) => handleShowFunction(e)}
                      >
                        {item.id_ === 1 ? (
                          <></>
                        ) : (
                          <div
                            className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Delete"
                            id={item.id_}
                            onClick={() => props.groupDelState()}
                          >
                            <IoTrashOutline size={18} />
                          </div>
                        )}
                        <div
                          className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Edit"
                          style={{ right: "40px" }}
                          id={item.id_}
                          onClick={(e) => handleEditGroup(e)}
                        >
                          <FiEdit size={18} />
                        </div>

                        {/* <div
                          className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Add"
                          onClick={() => props.addState()}
                        >
                          <AiOutlineUserAdd size={18} />
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const handleFilter = (e) => {
    const t = lowercasedata(e.currentTarget.value);
    if (groupID.value !== 0) {
      datafilter.value = groupUser.value.filter((item) => {
        return (
          lowercasedata(item.mail_).includes(t) ||
          lowercasedata(item.name_).includes(t) ||
          lowercasedata(item.phone_).includes(t) ||
          lowercasedata(item.usr_).includes(t)
        );
      });
      console.log(datafilter.value);
    }
  };

  const handleFilterPartner = (e) => {
    const input = lowercasedata(e.currentTarget.value);
    const data = dataPartner;
    if (input === "") {
      group.value = data;
    } else {
      group.value = data.filter((item) => {
        return (
          lowercasedata(item.name_).includes(input) ||
          lowercasedata(item.code_).includes(input)
        );
      });
    }
  };

  const handleCloseCreate = () => {
    setCreateState(false);
  };

  const handleAddState = () => {
    setAddState(true);
  };

  const handleCloseAdd = () => {
    setAddState(false);
  };

  const handleDelState = () => {
    setPopupState(true);
  };

  const handleCloseDel = () => {
    setPopupState(false);
  };

  const handleEditState = () => {
    setEditState(true);
  };

  const handleCloseEdit = () => {
    setEditState(false);
  };

  const handleGroupDelState = () => {
    setGroupDelState(true);
  };

  const handleCloseGroupDel = () => {
    setGroupDelState(false);
  };

  useEffect(() => {
    const checkApi = async () => {
      const allPartner = await callApi("get", host.DATA + "/getallPartner", "");
      if (allPartner.status) {
        group.value = allPartner.data.sort((a, b) => a.id_ - b.id_);
        setDataPartner(allPartner.data.sort((a, b) => a.id_ - b.id_));
      }
    };
    checkApi();
  }, []);

  useEffect(() => {
    if (groupID.value !== 0) {
      datafilter.value = groupUser.value;
    }
  }, [groupID.value]);

  const handleCloseEditRole = () => {
    setEditrole(false);
  };

  return (
    <>
      {isBrowser ? (
        <div
          style={{
            position: "relative",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="DAT_Header">
            <div className="DAT_Header_Title">
              <PiUsersFour color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "roleList" })}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div style={{ cursor: "pointer" }}>
                    <div
                      className="DAT_Header_Select"
                      onClick={() => setFilterType(!filterType)}
                      {...bindHover(popupState)}
                    >
                      {filterType ? (
                        <LuRouter size={17} color="#0b1967" />
                      ) : (
                        <BiMessageAltError size={17} color="#0b1967" />
                      )}
                    </div>
                    <Popper {...bindPopper(popupState)} transition>
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper
                            sx={{
                              width: "fit-content",
                              marginLeft: "0px",
                              marginTop: "5px",
                              height: "20px",
                              p: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                textAlign: "justify",
                                justifyItems: "center",
                                // marginBottom: 1.7,
                              }}
                            >
                              {dataLang.formatMessage({
                                id: filterType ? "grouproleList" : "roleList",
                              })}
                            </Typography>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                )}
              </PopupState>

              <div
                className="DAT_Header_Filter2"
                style={{ backgroundColor: "white" }}
              >
                <input
                  type="text"
                  autoComplete="off"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  style={{
                    display: filterType ? "block" : "none",
                  }}
                  onChange={(e) => handleFilterPartner(e)}
                />
                <input
                  type="text"
                  autoComplete="on"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  onChange={(e) => handleFilter(e)}
                  style={{ display: filterType ? "none" : "block" }}
                />
                <CiSearch color="gray" size={20} />
              </div>
            </div>

            <button
              className="DAT_Header_New"
              onClick={() => setCreateState(true)}
            >
              <span>
                <AiOutlineUsergroupAdd color="white" size={20} />
                &nbsp;
                {dataLang.formatMessage({ id: "createNewGroup" })}
              </span>
            </button>
          </div>

          <div className="DAT_GR">
            <div className="DAT_GR_Header">
              {dataLang.formatMessage({ id: "grouproleList" })}
            </div>
            <div className="DAT_GR_Content">
              <GroupUsers
                addState={handleAddState}
                delState={handleDelState}
                editState={handleEditState}
                groupDelState={handleGroupDelState}
              />
            </div>
          </div>

          {createState ? (
            <div className="DAT_PopupBG">
              <CreateGroupRole handleClose={handleCloseCreate} />
            </div>
          ) : (
            <></>
          )}

          {popupState ? (
            <div className="DAT_PopupBG">
              <Popup handleClose={handleCloseDel} />
            </div>
          ) : (
            <></>
          )}

          {addState ? (
            <div className="DAT_PopupBG">
              <AddUsers handleClose={handleCloseAdd} />
            </div>
          ) : (
            <></>
          )}

          {groupDelState ? (
            <div className="DAT_PopupBG">
              <ConfirmDeleteGroup handleClose={handleCloseGroupDel} />
            </div>
          ) : (
            <></>
          )}

          {editState ? (
            <div className="DAT_PopupBG">
              <EditGroup handleClose={handleCloseEdit} />
            </div>
          ) : (
            <></>
          )}

          {editrole ? (
            <div className="DAT_PopupBG">
              <EditRole handleClose={handleCloseEditRole} />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <>
          <div className="DAT_ProjectHeaderMobile">
            <div className="DAT_ProjectHeaderMobile_Top">
              {userList ? (
                <IoCaretBackOutline
                  size={30}
                  color="#0B1967"
                  onClick={() => {
                    setUserlist(false);
                    setFilterType(true);
                  }}
                />
              ) : (
                <></>
              )}
              <div className="DAT_ProjectHeaderMobile_Top_Filter">
                <CiSearch color="gray" size={20} />
                {filterType ? (
                  <input
                    // disabled={groupID.value === 0 ? true : false}
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                    onChange={(e) => handleFilterPartner(e)}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                    onChange={(e) => handleFilter(e)}
                  />
                )}
              </div>
              {userList ? (
                <button
                  className="DAT_ProjectHeaderMobile_Top_New"
                  onClick={() => handleAddState()}
                >
                  <IoAddOutline color="white" size={20} />
                </button>
              ) : (
                <button
                  className="DAT_ProjectHeaderMobile_Top_New"
                  onClick={() => setCreateState(true)}
                >
                  <IoAddOutline color="white" size={20} />
                </button>
              )}
            </div>

            <div
              className="DAT_ProjectHeaderMobile_Title"
              style={{ marginBottom: "10px" }}
            >
              <PiUsersFour color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "roleList" })}</span>
            </div>
          </div>

          <div
            className="DAT_GRMobile"
            style={{ marginBottom: isLandscape ? "30px" : "100px" }}
          >
            <div className="DAT_GRMobile_Content">
              <GroupUsers
                addState={handleAddState}
                delState={handleDelState}
                editState={handleEditState}
                groupDelState={handleGroupDelState}
              />
            </div>
          </div>

          {createState ? (
            <div className="DAT_PopupBGMobile">
              <CreateGroupRole handleClose={handleCloseCreate} />
            </div>
          ) : (
            <></>
          )}

          {popupState ? (
            <div className="DAT_PopupBGMobile">
              <Popup handleClose={handleCloseDel} />
            </div>
          ) : (
            <></>
          )}

          {addState ? (
            <div className="DAT_PopupBGMobile">
              <AddUsers handleClose={handleCloseAdd} />
            </div>
          ) : (
            <></>
          )}

          {groupDelState ? (
            <div className="DAT_PopupBGMobile">
              <ConfirmDeleteGroup handleClose={handleCloseGroupDel} />
            </div>
          ) : (
            <></>
          )}

          {editState ? (
            <div className="DAT_PopupBGMobile">
              <EditGroup handleClose={handleCloseEdit} />
            </div>
          ) : (
            <></>
          )}

          {editrole ? (
            <div className="DAT_PopupBGMobile">
              <EditRole handleClose={handleCloseEditRole} />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
