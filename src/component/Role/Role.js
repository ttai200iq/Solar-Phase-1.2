import React, { useEffect, useState } from "react";
import "./Role.scss";

import DataTable from "react-data-table-component";
import { Empty } from "../Project/Project";
import { signal } from "@preact/signals-react";
import CreateRole from "./CreateRole";
import RolePopup from "./RolePopup";
import { host } from "../Lang/Contant";
import { callApi } from "../Api/Api";
import { partnerInfor, ruleInfor, userInfor } from "../../App";
import { useIntl } from "react-intl";
import { isMobile } from "../Navigation/Navigation";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";

import { CiSearch } from "react-icons/ci";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { LuUserSquare } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { MdAddchart } from "react-icons/md";
import { GoProject } from "react-icons/go";

export const roleData = signal({});
export const Usr_ = signal([]);

export const access = {
  mastereditfor: {
    master: true,
    mainadmin: true,
    admin: true,
    user: true,
  },
  mainadmineditfor: {
    master: false,
    mainadmin: false,
    admin: true,
    user: true,
  },
  admineditfor: {
    master: false,
    mainadmin: false,
    admin: false,
    user: true,
  },
  usereditfor: {
    master: false,
    mainadmin: false,
    admin: false,
    user: false,
  },
};

export default function Role(props) {
  const dataLang = useIntl();
  const [temp, setTemp] = useState();
  // const [filter, setFilter] = useState(false);
  const [datafilter, setdatafilter] = useState([]);
  const [roleState, setRoleState] = useState("default");
  const [popupState, setPopupState] = useState(false);
  const [type, setType] = useState("default");

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const img = {
    master: "/dat_picture/manager.png",
    user: "/dat_picture/programmer.png",
    admin: "/dat_picture/bussiness-man.png",
    mainadmin: "/dat_picture/admin.jpg",
  };

  // const type = userInfor.value.type;

  const columnrole = [
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
      minWidth: "200px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "phone" }),
      selector: (row) => row.phone_,
      minWidth: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: "E-mail",
      selector: (row) => row.mail_,
      width: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "rule" }),
      selector: (row) => row.rulename_,
      sortable: true,
      width: "160px",
      style: {
        justifyContent: "left",
      },
    },
    {
      name: dataLang.formatMessage({ id: "account" }),
      selector: (row) => {
        switch (row.type_) {
          case "master":
            return dataLang.formatMessage({ id: "master" });
          case "admin":
            return dataLang.formatMessage({ id: "admin" });
          case "mainadmin":
            return dataLang.formatMessage({ id: "mainadmin" });
          default:
            return dataLang.formatMessage({ id: "user" });
        }
      },
      sortable: true,
      width: "180px",
      style: {
        justifyContent: "left",
      },
    },
    {
      name: dataLang.formatMessage({ id: "setting" }),
      selector: (row) => (
        <>
          {(() => {
            switch (userInfor.value.type) {
              case "master":
                return (
                  <>
                    {row.type_ === "master" ? (
                      <></>
                    ) : (
                      <PopupState variant="popper" popupId="demo-popup-popper">
                        {(popupState) => (<div className="DAT_TableEdit">
                          <IoMdMore size={20}   {...bindToggle(popupState)} />
                          <Menu {...bindMenu(popupState)}>

                            <MenuItem id={row.id_} onClick={(e) => { handleEdit(e); popupState.close() }}>
                              <FiEdit size={14} />&nbsp;
                              {dataLang.formatMessage({ id: "change" })}
                            </MenuItem>


                            <MenuItem id={row.usr_} onClick={(e) => { handleDelete_(e); popupState.close() }}>
                              <IoTrashOutline size={16} />
                              &nbsp;
                              {dataLang.formatMessage({ id: "delete" })}
                            </MenuItem>
                          </Menu>
                        </div>)}
                      </PopupState>
                    )}
                  </>
                )
              case "mainadmin":
                return (
                  <>
                    {row.type_ === "master" || row.type_ === "mainadmin" ? (
                      <></>
                    ) : (
                      ruleInfor.value.setting.user.modify || ruleInfor.value.setting.user.remove ? (
                        <PopupState variant="popper" popupId="demo-popup-popper">
                          {(popupState) => (<div className="DAT_TableEdit">
                            <IoMdMore size={20}   {...bindToggle(popupState)} />
                            <Menu {...bindMenu(popupState)}>
                              {ruleInfor.value.setting.user.modify ? (
                                <MenuItem id={row.id_} onClick={(e) => { handleEdit(e); popupState.close() }}>
                                  <FiEdit size={14} />&nbsp;
                                  {dataLang.formatMessage({ id: "change" })}
                                </MenuItem>
                              ) : (<></>)}

                              {ruleInfor.value.setting.user.remove ? (
                                <MenuItem id={row.usr_} onClick={(e) => { handleDelete_(e); popupState.close() }}>
                                  <IoTrashOutline size={16} />
                                  &nbsp;
                                  {dataLang.formatMessage({ id: "delete" })}
                                </MenuItem>
                              ) : (<></>)}

                            </Menu>
                          </div>)}
                        </PopupState>
                      ) : (
                        <></>
                      )
                    )}
                  </>
                )
              case "admin":
                return (
                  <>
                    {row.type_ === "master" || row.type_ === "mainadmin" || row.type_ === "admin" ? (
                      <></>
                    ) : (
                      ruleInfor.value.setting.user.modify || ruleInfor.value.setting.user.remove ? (
                        <PopupState variant="popper" popupId="demo-popup-popper">
                          {(popupState) => (<div className="DAT_TableEdit">
                            <IoMdMore size={20}   {...bindToggle(popupState)} />
                            <Menu {...bindMenu(popupState)}>
                              {ruleInfor.value.setting.user.modify ? (
                                <MenuItem id={row.id_} onClick={(e) => { handleEdit(e); popupState.close() }}>
                                  <FiEdit size={14} />&nbsp;
                                  {dataLang.formatMessage({ id: "change" })}
                                </MenuItem>
                              ) : (<></>)}

                              {ruleInfor.value.setting.user.remove ? (
                                <MenuItem id={row.usr_} onClick={(e) => { handleDelete_(e); popupState.close() }}>
                                  <IoTrashOutline size={16} />
                                  &nbsp;
                                  {dataLang.formatMessage({ id: "delete" })}
                                </MenuItem>
                              ) : (<></>)}

                            </Menu>
                          </div>)}
                        </PopupState>
                      ) : (
                        <></>
                      )
                    )}
                  </>
                )
              default:
                return (<></>)
            }
          })()}




        </>
      ),
      width: "110px",
    },
  ];

  const handleCloseCreate = () => {
    setRoleState("default");
  };

  const handleDelete_ = (e) => {
    setPopupState(true);
    setType("delete");
    setTemp(e.currentTarget.id);
  };

  const handleEdit = (e) => {
    setPopupState(true);
    setType("edit");
    const id = e.currentTarget.id;
    roleData.value = Usr_.value.find((item) => item.id_ == id);
  };

  const handleClosePopup = () => {
    setPopupState(false);
    setType("default");
  };

  // const handleModify = (e, type) => {
  //   const id = e.currentTarget.id;
  //   var arr = id.split("_");

  //   const mod = document.getElementById(arr[0] + "_Modify");
  //   mod.style.display = type;
  // };

  const handleFilter = (e) => {
    const searchterm = lowercasedata(e.currentTarget.value);
    if (searchterm == "") {
      setdatafilter(Usr_.value);
    } else {
      let df = Usr_.value.filter((item) => {
        const roleName = lowercasedata(item.name_);
        const rolePhone = lowercasedata(item.phone_);
        const roleMail = lowercasedata(item.mail_);
        return (
          roleName.includes(searchterm) ||
          rolePhone.includes(searchterm) ||
          roleMail.includes(searchterm)
        );
      });
      setdatafilter(df);
    }
  };

  useEffect(() => {
    const fetchUsr = async () => {
      const d = await callApi("post", host.DATA + "/getallUser", {
        partnerid: partnerInfor.value.partnerid,
      });
      if (d.status === true) {
        Usr_.value = d.data;
        setdatafilter(d.data);
        Usr_.value = Usr_.value.sort((a, b) => a.ruleid_ - b.ruleid_);
      }
    };
    fetchUsr();
  }, []);

  // useEffect(() => {
  //   const getRule = async (partnerid) => {
  //     const rule = await callApi("post", host.DATA + "/getRule", {
  //       partnerid: partnerInfor.value.partnerid,
  //     });
  //     if (rule.status) {
  //       datarule.value = rule.data;
  //       datarule.value = datarule.value.sort((a, b) => a.ruleid_ - b.ruleid_);
  //     }
  //   };
  //   getRule();
  // }, [partnerInfor.value.partnerid]);

  useEffect(() => {
    setdatafilter(Usr_.value);
  }, [Usr_.value]);

  return (
    <>
      {isMobile.value ? (
        <div className="DAT_ProjectHeaderMobile">
          <div className="DAT_ProjectHeaderMobile_Top">
            <div className="DAT_ProjectHeaderMobile_Top_Filter">
              <CiSearch color="gray" size={20} />
              <input
                id="search"
                type="text"
                placeholder={
                  dataLang.formatMessage({ id: "enter" }) +
                  dataLang.formatMessage({ id: "role" })
                }
                autoComplete="off"
                onChange={(e) => handleFilter(e)}
              />
            </div>
            {ruleInfor.value.setting.user.add ? (
              <button
                className="DAT_ProjectHeaderMobile_Top_New"
                onClick={() => setRoleState("create")}
              >
                <IoAddOutline color="white" size={20} />
              </button>
            ) : (<></>)}

          </div>

          <div
            className="DAT_ProjectHeaderMobile_Title"
            style={{ marginBottom: "10px" }}
          >
            <GoProject color="gray" size={25} />
            <span>{dataLang.formatMessage({ id: "role" })}</span>
          </div>
        </div>
      ) : (
        <div className="DAT_ProjectHeader">
          <div className="DAT_ProjectHeader_Title">
            <LuUserSquare color="gray" size={25} />
            <span>{dataLang.formatMessage({ id: "role" })}</span>
          </div>

          <div className="DAT_ProjectHeader_Filter">
            <input
              id="search"
              type="text"
              placeholder={
                dataLang.formatMessage({ id: "enter" }) +
                dataLang.formatMessage({ id: "role" })
              }
              autoComplete="off"
              onChange={(e) => handleFilter(e)}
            />
            <CiSearch color="gray" size={20} />
          </div>
          {ruleInfor.value.setting.user.add === true ? (
            <button
              className="DAT_ProjectHeader_New"
              onClick={() => setRoleState("create")}
            >
              <span value={"createdate"}>
                <MdAddchart color="white" size={20} />
                &nbsp;
                {dataLang.formatMessage({ id: "createNew" })}
              </span>
            </button>
          ) : (
            <div></div>
          )}
        </div>
      )}

      {isMobile.value ? (
        <>
          {/* <div className="DAT_RoleMobile">
            <div className="DAT_RoleMobile_Header" style={{ padding: "15px" }}>
              {dataLang.formatMessage({ id: "roleList" })}
            </div>

            {Usr_.value.map((item, i) => {
              return (
                <div key={i} className="DAT_RoleMobile_Content">
                  <div className="DAT_RoleMobile_Content_Item">
                    <div className="DAT_RoleMobile_Content_Item_Row">
                      <div className="DAT_RoleMobile_Content_Item_Row_Name">
                        {dataLang.formatMessage({ id: "name" })}: {item.name_}
                      </div>

                      <div className="DAT_RoleMobile_Content_Item_Row_Right">
                        <div
                          className="DAT_RoleMobile_Content_Item_Row_Right_Item"
                          id={item.id_}
                          onClick={(e) => handleEdit(e)}
                        >
                          <MdEdit size={20} color="#216990" />
                        </div>
                        <div
                          className="DAT_RoleMobile_Content_Item_Row_Right_Item"
                          onClick={() => setPopupState("delete")}
                        >
                          <MdDelete size={20} color="red" />
                        </div>
                      </div>
                    </div>

                    <div className="DAT_RoleMobile_Content_Item_Row">
                      <div className="DAT_RoleMobile_Content_Item_Row_Rule">
                        {dataLang.formatMessage({ id: "rule" })}:{" "}
                        {item.rulename_}
                      </div>

                      <div className="DAT_RoleMobile_Content_Item_Row_Acc">
                        {dataLang.formatMessage({ id: "account" })}:{" "}
                        {item.type_}
                      </div>
                    </div>

                    <div className="DAT_RoleMobile_Content_Item_Row">
                      <div className="DAT_RoleMobile_Content_Item_Row_Phone">
                        {dataLang.formatMessage({ id: "phone" })}: {item.phone_}
                      </div>

                      <div className="DAT_RoleMobile_Content_Item_Row_Email">
                        Mail: {item.mail_}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div> */}
          <div className="DAT_ProjectMobile">
            {datafilter?.map((item, i) => {
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
                        color: "white",
                        padding: "5px",
                      }}
                    >
                      <img
                        src={img[item.type_]}
                        alt=""
                        onError={(e) =>
                          (e.target.src = "./dat_picture/profile.png")
                        }
                      />
                    </div>
                    <div className="DAT_ProjectMobile_Content_Top_Info">
                      <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                        <div
                          className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                          id={item.id_}
                          style={{ cursor: "pointer", fontSize: "17px" }}
                        >
                          {item.name_}
                        </div>
                      </div>

                      <div
                        className="DAT_ProjectMobile_Content_Top_Info_Data"
                        style={{ color: "rgba(95, 95, 98)", fontSize: "12px" }}
                      >
                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                          <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name"></div>
                          <div>
                            {dataLang.formatMessage({ id: "phone" })}:{" "}
                            {item.phone_}
                          </div>
                        </div>
                      </div>

                      <div
                        className="DAT_ProjectMobile_Content_Top_Info_Data"
                        style={{ color: "rgba(95, 95, 98)", fontSize: "12px" }}
                      >
                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                          <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name"></div>
                          <div>
                            {dataLang.formatMessage({ id: "email" })}:{" "}
                            {item.mail_}
                          </div>
                        </div>
                      </div>

                      <div
                        className="DAT_ProjectMobile_Content_Top_Info_Data"
                        style={{ color: "rgba(95, 95, 98)", fontSize: "12px" }}
                      >
                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                          <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name"></div>
                          <div>
                            {dataLang.formatMessage({ id: "account" })}:{" "}
                            <span style={{ fontFamily: "Montserrat-Bold" }}>
                              {dataLang.formatMessage({ id: item.type_ })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_ProjectMobile_Content_Bottom">
                    <div className="DAT_ProjectMobile_Content_Bottom_Left">
                      <span>{dataLang.formatMessage({ id: "rule" })}:</span>
                      &nbsp;
                      <span>{item.rulename_}</span>
                    </div>

                    <div className="DAT_ProjectMobile_Content_Bottom_Right">
                      {ruleInfor.value.setting.user.modify === true ? (
                        <div
                          className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                          id={item.id_}
                          onClick={(e) => handleEdit(e)}
                        >
                          <FiEdit size={14} />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {ruleInfor.value.setting.user.remove === true ? (
                        <div
                          className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                          id={item.id_}
                          onClick={(e) => handleDelete_(e)}
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
          </div>
        </>
      ) : (
        <>
          <div className="DAT_Role">
            <div
              className="DAT_Role_Header"
              style={{
                padding: "15px",
                backgroundColor: "rgba(233, 233, 233, 0.5)",
              }}
            >
              {dataLang.formatMessage({ id: "roleList" })}
            </div>

            <div className="DAT_Role_Content">
              <DataTable
                className="DAT_Table_Container"
                columns={columnrole}
                data={datafilter}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                // fixedHeader={true}
                noDataComponent={<Empty />}
              />
            </div>
          </div>
        </>
      )}

      <div className="DAT_ViewPopup"
        style={{
          height: roleState === "default" ? "0px" : "100vh",
          transition: "0.5s",
        }}
      >
        {(() => {
          switch (roleState) {
            case "create":
              return <CreateRole handleClose={handleCloseCreate} />;
            default:
              return <></>;
          }
        })()}
      </div>

      {popupState ?
        <div className="DAT_PopupBG">
          <RolePopup user={temp} type={type} handleClose={handleClosePopup} />
        </div>
        : <></>}
    </>
  );
}
