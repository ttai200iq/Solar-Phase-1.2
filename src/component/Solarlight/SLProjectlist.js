import React, { useEffect, useState } from 'react';

import { convertUnit, ruleInfor, showUnitk, userInfor } from '../../App';
import { Empty } from '../Project/Project';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import { alertDispatch } from '../Alert/Alert';
import { lowercasedata } from '../ErrorSetting/ErrorSetting';
import { sidenar } from '../Sidenar/Sidenar';
import ShareBox from './SLShareBox';
import SLEditProject from './SLEditProject';
import SLPopup from './SLPopup';
import SLAddProject from './SLAddProject';
import SLProjectData from './SLProjectData';

import { isBrowser, useMobileOrientation } from 'react-device-detect';
import { signal } from "@preact/signals-react";
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import PopupState, { bindToggle, bindMenu } from "material-ui-popup-state";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { GoProject } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';
import { MdAddchart, MdOutlineError } from 'react-icons/md';
import { FiEdit, FiFilter } from 'react-icons/fi';
import { IoIosArrowDown, IoIosArrowForward, IoMdMore } from 'react-icons/io';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { RiShareForwardLine } from 'react-icons/ri';

export const solarlighttab = signal("total");
export const slprojectlist = signal([]);
// export const slloggerlist = signal([]);
export const slProjectData = signal({});
export const slPlantState = signal("default");
export const slShareState = signal(false);
export const slPopupState = signal(false);

const online = signal([]);
const offline = signal([]);
const warn = signal([]);
const demo = signal([]);
const care = signal([]);
const sltabLable = signal("");
const sltabLableMobile = signal("");

export default function SLProjectlist(props) {
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.usr);
    const { isLandscape } = useMobileOrientation();
    const [datafilter, setDatafilter] = useState([]);

    const listTab = [
        { id: "total", name: dataLang.formatMessage({ id: "total" }) },
        { id: "online", name: dataLang.formatMessage({ id: "online" }) },
        { id: "offline", name: dataLang.formatMessage({ id: "offline" }) },
        { id: "warn", name: dataLang.formatMessage({ id: "warn" }) },
        { id: "care", name: dataLang.formatMessage({ id: "care" }) },
        { id: "demo", name: dataLang.formatMessage({ id: "demo" }) },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: dataLang.formatMessage({ id: "row" }),
        rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
        selectAllRowsItem: true,
        selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
    };

    const columnproject = [
        {
            name: dataLang.formatMessage({ id: "name" }),
            selector: (row) => (
                <div className="DAT_Table"
                    id={row.plantid_}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handlePlant(e)}
                >
                    <img src={row.img ? row.img : "/dat_picture/solar_panel.png"} alt="" />

                    <div className="DAT_Table_Infor">
                        <div className="DAT_Table_Infor_Name">{row.plantname}</div>
                        <div className="DAT_Table_Infor_Addr">{row.addr}</div>
                    </div>
                </div>
            ),
            sortable: true,
            width: "400px",
            style: {
                justifyContent: "left !important",
            },
        },
        {
            name: dataLang.formatMessage({ id: "connect" }),
            selector: (row) => (
                <div
                    style={{ cursor: "pointer" }}
                    id={row.plantname}
                //   onClick={(e) => {
                //     connectval.value = e.currentTarget.id;
                //     sidebartab.value = "Monitor";
                //     sidebartabli.value = "/Device";
                //     navigate("/Device");
                //   }}
                >
                    {row.state === 1 ? (
                        <FaCheckCircle size={20} color="green" />
                    ) : (
                        <MdOutlineError size={22} color="red" />
                    )}
                </div>
            ),
            width: "100px",
        },
        {
            name: dataLang.formatMessage({ id: "warn" }),
            selector: (row) => (
                <div
                    style={{ cursor: "pointer" }}
                    id={row.plantid_}
                //   onClick={(e) => {
                //     projectwarnfilter.value = e.currentTarget.id;
                //     warnfilter.value = {};
                //     sidebartab.value = "Monitor";
                //     sidebartabli.value = "/Warn";
                //     navigate("/Warn");
                //   }}
                >
                    {row.warn === 1 ? (
                        <FaCheckCircle size={20} color="green" />
                    ) : (
                        <MdOutlineError size={22} color="red" />
                    )}
                </div>
            ),
            width: "100px",
        },
        {
            name: dataLang.formatMessage({ id: "electricType", defaultMessage: "Plant Mode", }),
            selector: (row) => dataLang.formatMessage({ id: `${row.plantmode}Type` }),
            width: "250px",
            style: {
                justifyContent: "center !important",
            },
        },
        {
            name: dataLang.formatMessage({ id: "inCapacity" }),
            selector: (row) => (
                <>
                    {Number(parseFloat(convertUnit(row.capacity)).toFixed(2)).toLocaleString("en-US")}
                    &nbsp;
                    {showUnitk(row.capacity)}Wp
                </>
            ),
            sortable: true,
            width: "160px",
        },
        {
            name: dataLang.formatMessage({ id: "lastupdate" }),
            selector: (row) => row.lastupdate,
            sortable: true,
            width: "180px",
        },
        {
            name: dataLang.formatMessage({ id: "createdate" }),
            selector: (row) => row.createdate,
            sortable: true,
            width: "180px",
        },
        {
            name: dataLang.formatMessage({ id: "edits" }),
            selector: (row) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {ruleInfor.value.setting.project.modify === true ||
                        ruleInfor.value.setting.project.remove === true ? (
                        row.shared === 1 ? (
                            <></>
                        ) : (
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {(popupState) => (
                                    <div className="DAT_TableEdit">
                                        <IoMdMore size={20} {...bindToggle(popupState)} />
                                        <Menu {...bindMenu(popupState)}>
                                            {ruleInfor.value.setting.project.modify === true ? (
                                                <MenuItem
                                                    id={row.plantid_}
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
                                                    id={row.plantid_}
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

                                            <MenuItem
                                                id={row.plantid_}
                                                onClick={(e) => {
                                                    handleShare(e);
                                                    popupState.close();
                                                }}
                                            >
                                                <RiShareForwardLine size={16} />
                                                &nbsp;
                                                {dataLang.formatMessage({ id: "share" })}
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                )}
                            </PopupState>
                        )
                    ) : (
                        <div></div>
                    )}

                    <div className="DAT_TableMark">
                        <FaStar
                            id={row.plantid_}
                            style={{
                                color: row.mark ? "rgb(255, 233, 39)" : "rgb(190, 190, 190)",
                                cursor: "pointer",
                            }}
                            onClick={(e) => handleLike(e)}
                            size={17}
                        />
                    </div>
                </div>
            ),
            width: "110px",
            justifyContent: "center",
            alignItems: "center",
        },
    ];

    const handlePlant = (e) => {
        sidenar.value = false;
        slPlantState.value = "info";
        const newPlant = slprojectlist.value.find(
            (item) => item.plantid_ === parseInt(e.currentTarget.id)
        );
        slProjectData.value = newPlant;
    };

    const handleEdit = (e) => {
        slPlantState.value = "edit";
        const newPlant = slprojectlist.value.find(
            (item) => item.plantid_ === parseInt(e.currentTarget.id)
        );
        slProjectData.value = newPlant;
    };

    const handleDelete = (e) => {
        slPopupState.value = true;
        const newPlant = slprojectlist.value.find(
            (item) => item.plantid_ === parseInt(e.currentTarget.id)
        );
        slProjectData.value = newPlant;
    };

    const handleSearch = (e) => {
        if (e.target.value === "") {
            setDatafilter(slprojectlist.value);
        } else {
            const t = lowercasedata(e.target.value);
            const db = slprojectlist.value.filter((row) => {
                return (
                    lowercasedata(row.plantname).includes(t) ||
                    lowercasedata(row.plantname).includes(t)
                );
            });
            setDatafilter(db);
        }
    };

    const handleShare = (e) => {
        slShareState.value = true;
        const newPlant = slprojectlist.value.find(
            (item) => item.plantid_ === parseInt(e.currentTarget.id)
        );
        slProjectData.value = newPlant;
    };

    const handleLike = async (e) => {
        //0: UNMARK, 1: MARK
        const i = slprojectlist.value.findIndex(
            (item) => item.plantid_ === parseInt(e.currentTarget.id)
        );
        let newData = slprojectlist.value;

        const markplant = await callApi("post", host.DATA + "/setMark", {
            usr: user,
            plantid: e.currentTarget.id,
            action: newData[i].mark ? "unmark" : "mark",
            partnerid: userInfor.value.partnerid,
        });
        if (markplant.status === true) {
            if (newData[i].mark) {
                newData[i] = {
                    ...newData[i],
                    mark: 0,
                };
            } else {
                newData[i] = {
                    ...newData[i],
                    mark: 1,
                };
            }
            slprojectlist.value = [...newData];
        } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
    };

    const handleTabMobile = (e) => {
        const id = e.currentTarget.id;
        solarlighttab.value = id;
        const newLabel = listTab.find((item) => item.id === id);
        sltabLable.value = newLabel.name;
    };

    useEffect(() => {
        const getPlant = async () => {
            let d = await callApi("post", host.DATA + "/getSolarlight", {
                usr: user,
                partnerid: userInfor.value.partnerid,
                type: userInfor.value.type,
            });
            if (d.status === true) {
                slprojectlist.value = d.data.sort((a, b) => a.plantid_ - b.plantid_);
            }
        };
        getPlant();

        // const getLogger = async () => {
        //     let d = await callApi("post", host.DATA + "/getallLoggersl", {
        //         usr: user,
        //         partnerid: partnerInfor.value.partnerid,
        //         type: userInfor.value.type,
        //     });
        //     if (d.status) {
        //         slloggerlist.value = d.data;
        //         d.data.map(async (item) => {
        //             const res = await invtCloud(
        //                 '{"deviceCode":"' + item.psn + '"}',
        //                 Token.value.token
        //             );
        //             if (res.ret === 0) {
        //                 setInvt((pre) => ({ ...pre, [item.psn]: res.data }));
        //             } else {
        //                 setInvt((pre) => ({ ...pre, [item.psn]: {} }));
        //             }
        //         });
        //     }
        // };
        // getLogger();

        // return () => {
        //     plantState.value = "default";
        // };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        online.value = slprojectlist.value.filter((item) => item.state === 1);
        offline.value = slprojectlist.value.filter((item) => item.state === 0);
        warn.value = slprojectlist.value.filter((item) => item.warn === 0);
        care.value = slprojectlist.value.filter((item) => item.mark === 1);
        demo.value = slprojectlist.value.filter((item) => item.shared === 1);
        sltabLable.value = listTab[0].name;
        setDatafilter(slprojectlist.value);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slprojectlist.value]);

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
                            <GoProject color="gray" size={25} />
                            <span>{dataLang.formatMessage({ id: "project" })} Solar light</span>
                        </div>

                        <div className="DAT_Header_Filter">
                            <input
                                id="search"
                                type="text"
                                placeholder={
                                    dataLang.formatMessage({ id: "enter" }) +
                                    dataLang.formatMessage({ id: "project" })
                                }
                                autoComplete="off"
                                onChange={(e) => handleSearch(e)}
                            />
                            <CiSearch color="gray" size={20} />
                        </div>
                        {ruleInfor.value.setting.project.add === true ? (
                            <button
                                className="DAT_Header_New"
                                onClick={() => (slPlantState.value = "add")}
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

                    <div className="DAT_Project">
                        <div className="DAT_Toollist_Tab">
                            {listTab.map((item, i) => {
                                return solarlighttab.value === item.id ? (
                                    <div key={"tab_" + i} className="DAT_Toollist_Tab_main">
                                        <p className="DAT_Toollist_Tab_main_left"></p>
                                        <span
                                            className="DAT_Toollist_Tab_main_content1"
                                            id={item.id}
                                            style={{
                                                backgroundColor: "White",
                                                color: "black",
                                                borderRadius: "10px 10px 0 0",
                                            }}
                                            onClick={(e) => (solarlighttab.value = item.id)}
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
                                        onClick={(e) => (solarlighttab.value = item.id)}
                                    >
                                        {item.name}
                                    </span>
                                );
                            })}
                        </div>

                        <div className="DAT_Project_Content">
                            {(() => {
                                switch (solarlighttab.value) {
                                    case "total":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={datafilter}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    case "online":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={online.value}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                fixedHeader={true}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    case "offline":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={offline.value}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                fixedHeader={true}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    case "demo":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={demo.value}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                fixedHeader={true}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    case "warn":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={warn.value}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                fixedHeader={true}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    case "care":
                                        return (
                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={columnproject}
                                                data={care.value}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                fixedHeader={true}
                                                noDataComponent={<Empty />}
                                            />
                                        );
                                    default:
                                        return <></>;
                                }
                            })()}
                        </div>
                    </div>

                    {(() => {
                        switch (slPlantState.value) {
                            case "info":
                                return (
                                    <div
                                        className="DAT_ViewPopup"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLProjectData />
                                    </div>
                                );
                            case "edit":
                                return (
                                    <div
                                        className="DAT_ViewPopup"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLEditProject usr={user} />
                                    </div>
                                );
                            case "add":
                                return (
                                    <div
                                        className="DAT_ViewPopup"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLAddProject usr={user} />
                                    </div>
                                );
                            default:
                                return <></>;
                        }
                    })()}

                    {slPopupState.value ? (
                        <div className="DAT_PopupBG">
                            <SLPopup
                                plantid={slProjectData.value.plantid_}
                                func="remove"
                                type="plant"
                                usr={user}
                            />
                        </div>
                    ) : (<></>)}

                    {slShareState.value ? (
                        <div className="DAT_PopupBG">
                            <ShareBox plantid={slProjectData.value.plantid_} usr={user} />
                        </div>
                    ) : (<></>)}
                </div>
            ) : (
                <>
                    <div className="DAT_HeaderMobile">
                        <div className="DAT_HeaderMobile_Top">
                            <div className="DAT_HeaderMobile_Top_Filter">
                                <CiSearch color="gray" size={20} />
                                <input
                                    id="search"
                                    type="text"
                                    placeholder={
                                        dataLang.formatMessage({ id: "enter" }) +
                                        dataLang.formatMessage({ id: "project" })
                                    }
                                    autoComplete="off"
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                            {ruleInfor.value.setting.project.add === true ? (
                                <button
                                    className="DAT_HeaderMobile_Top_New"
                                    onClick={() => (slPlantState.value = "add")}
                                >
                                    <IoAddOutline color="white" size={20} />
                                </button>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        <div className="DAT_HeaderMobile_Title">
                            <GoProject color="gray" size={25} />
                            <span>{dataLang.formatMessage({ id: "project" })}</span>
                        </div>
                    </div>

                    <div className="DAT_ProjectMobile"
                        style={{ marginBottom: isLandscape ? "30px" : "100px" }}
                    >
                        <div className="DAT_Toollist_Tab_Mobile">
                            <button
                                className="DAT_Toollist_Tab_Mobile_content"
                                onClick={() => (sltabLableMobile.value = !sltabLableMobile.value)}
                            >
                                <span>{sltabLable.value}</span>
                                <div className="DAT_Toollist_Tab_Mobile_content_Icon">
                                    <FiFilter />
                                    {sltabLableMobile.value ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                </div>
                            </button>
                            <div
                                className="DAT_Toollist_Tab_Mobile_list"
                                style={{
                                    top: "50px",
                                    height: sltabLableMobile.value ? "210px" : "0",
                                    transition: "0.5s",
                                    boxShadow: sltabLableMobile.value
                                        ? "0 0 4px 4px rgba(193, 193, 193, 0.5)"
                                        : "none",
                                }}
                            >
                                {listTab.map((item, i) => {
                                    return (
                                        <div
                                            className="DAT_Toollist_Tab_Mobile_list_item"
                                            key={"tabmobile_" + i}
                                            id={item.id}
                                            onClick={(e) => {
                                                handleTabMobile(e);
                                                sltabLableMobile.value = false;
                                            }}
                                        >
                                            {i + 1}: {item.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {(() => {
                            switch (solarlighttab.value) {
                                case "total":
                                    return (
                                        <>
                                            {datafilter?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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
                                case "online":
                                    return (
                                        <>
                                            {online.value?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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
                                case "offline":
                                    return (
                                        <>
                                            {offline.value?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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
                                case "demo":
                                    return (
                                        <>
                                            {demo.value?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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
                                case "warn":
                                    return (
                                        <>
                                            {warn.value?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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
                                case "care":
                                    return (
                                        <>
                                            {care.value?.map((item, i) => {
                                                return (
                                                    <div key={i} className="DAT_ProjectMobile_Content">
                                                        <div className="DAT_ProjectMobile_Content_Top">
                                                            <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                                                <img
                                                                    src={
                                                                        item.img
                                                                            ? item.img
                                                                            : "/dat_picture/solar_panel.png"
                                                                    }
                                                                    alt=""
                                                                    id={item.plantid_}
                                                                    onClick={(e) => handlePlant(e)}
                                                                />
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Top_Info">
                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handlePlant(e)}
                                                                    >
                                                                        {item.plantname}
                                                                    </div>

                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                                                        <FaStar
                                                                            size={14}
                                                                            id={item.plantid_}
                                                                            style={{
                                                                                color: item.mark
                                                                                    ? "rgb(255, 233, 39)"
                                                                                    : "rgb(190, 190, 190)",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={(e) => handleLike(e)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.state ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
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
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "offline",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                                                        {item.warn ? (
                                                                            <>
                                                                                <FaCheckCircle
                                                                                    size={14}
                                                                                    color="green"
                                                                                />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "noAlert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MdOutlineError size={16} color="red" />
                                                                                <span>
                                                                                    {dataLang.formatMessage({
                                                                                        id: "alert",
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                                                        <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                                                            {dataLang.formatMessage({
                                                                                id: "inCapacity",
                                                                            })}
                                                                        </div>
                                                                        <div>
                                                                            {Number(
                                                                                parseFloat(
                                                                                    convertUnit(item.capacity)
                                                                                ).toFixed(2)
                                                                            ).toLocaleString("en-US")}
                                                                            &nbsp;
                                                                            {showUnitk(item.capacity)}Wp
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="DAT_ProjectMobile_Content_Bottom">
                                                            <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                                                <span>
                                                                    {dataLang.formatMessage({ id: "lastupdate" })}
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                <span>{item.lastupdate}</span>
                                                            </div>

                                                            <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                                                    <RiShareForwardLine
                                                                        size={16}
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleShare(e)}
                                                                    />
                                                                </div>
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleEdit(e)}
                                                                    >
                                                                        <FiEdit size={14} />
                                                                    </div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                                {ruleInfor.value.setting.project.modify ===
                                                                    true ? (
                                                                    <div
                                                                        className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                                                        id={item.plantid_}
                                                                        onClick={(e) => handleDelete(e)}
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

                    {(() => {
                        switch (slPlantState.value) {
                            case "info":
                                return (
                                    <div
                                        className="DAT_ViewPopupMobile"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLProjectData />
                                    </div>
                                );
                            case "edit":
                                return (
                                    <div
                                        className="DAT_ViewPopupMobile"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLEditProject usr={user} />
                                    </div>
                                );
                            case "add":
                                return (
                                    <div
                                        className="DAT_ViewPopupMobile"
                                        style={{
                                            height: slPlantState.value === "default" ? "0px" : "100vh",
                                            transition: "0.5s",
                                        }}
                                    >
                                        <SLAddProject usr={user} />
                                    </div>
                                );
                            default:
                                return <></>;
                        }
                    })()}

                    {slPopupState.value ? (
                        <div className="DAT_PopupBGMobile">
                            <SLPopup
                                plantid={slProjectData.value.plantid_}
                                func="remove"
                                type="plant"
                                usr={user}
                            />
                        </div>
                    ) : (<></>)}

                    {slShareState.value ? (
                        isLandscape
                            ?
                            <div className="DAT_ViewPopupMobile">
                                <ShareBox plantid={slProjectData.value.plantid_} usr={user} />
                            </div>
                            :
                            <div className="DAT_PopupBGMobile">
                                <ShareBox plantid={slProjectData.value.plantid_} usr={user} />
                            </div>
                    ) : (<></>)}
                </>
            )}
        </>
    );
}
