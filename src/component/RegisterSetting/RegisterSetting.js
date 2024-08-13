import React, { useEffect, useState } from 'react';
import "./RegisterSetting.scss";

import { signal } from "@preact/signals-react";
import { isBrowser } from 'react-device-detect';
import { useIntl } from 'react-intl';
import { MdOutlineManageHistory } from 'react-icons/md';
import { brands, host } from '../Lang/Contant';
import { IoMdAddCircleOutline, IoMdMore } from 'react-icons/io';
import { Empty } from '../Project/Project';
import { callApi } from '../Api/Api';
import { IoTrashOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import PopupState, { bindMenu, bindToggle, } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";
import RSPopup from './RSPopup'

export const tabRS = signal("logger");
export const registerID = signal('');
export const loggerListRS = signal([]);
export const inverterListRS = signal([]);

export default function RegisterSetting(props) {
    const dataLang = useIntl();
    const [dataLogger, setDataLogger] = useState([]);
    const [dataInverter, setDataInverter] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [popupInfo, setPopupInfo] = useState({});

    const RegisterSetting = (props) => {
        const dataLang = useIntl();

        const listTab = [
            { id: "logger", name: "Logger" },
            { id: "inverter", name: "Inverter" },
        ];

        const handleChangeBrand = (e) => {
            registerID.value = e.currentTarget.id;
        };

        const handleShowFunction = (e) => {
            const id = e.currentTarget.id;
            const idArr = id.split("_");
            const t = document.getElementById(idArr[0] + "_dot");
            const mod = document.getElementById(idArr[0] + "_function");
            if (t.style.display === "none") {
                t.style.display = "flex";
                mod.style.display = "none";
            } else {
                t.style.display = "none";
                mod.style.display = "flex";
            }
        };

        return (
            <>
                {isBrowser
                    ?
                    <div className='DAT_RS_Content_Table'>
                        <div className='DAT_RS_Content_Table_Left'>
                            <div className='DAT_RS_Content_Table_Left_Head'>
                                {dataLang.formatMessage({ id: "brand" })}
                            </div>

                            <div className='DAT_RS_Content_Table_Left_ItemList'>
                                {Object.entries(brands).map(([key, value]) => (
                                    <div className='DAT_RS_Content_Table_Left_ItemList_Item'
                                        key={key}
                                        style={{ backgroundColor: registerID.value === key ? "rgb(207, 207, 207, 0.4)" : "" }}
                                        id={key}
                                        onClick={(e) => handleChangeBrand(e)}
                                    >
                                        <div className='DAT_RS_Content_Table_Left_ItemList_Item_Name'>
                                            {key}
                                        </div>

                                        <div className='DAT_RS_Content_Table_Left_ItemList_Item_Shortcut'
                                            id={key + "_dot"}
                                            onClick={(e) => handleShowFunction(e)}
                                        >
                                            <IoMdMore size={20} color="grey" />
                                        </div>

                                        <div className='DAT_RS_Content_Table_Left_ItemList_Item_More'
                                            id={key + "_function"}
                                            style={{ display: "none" }}
                                            onMouseLeave={(e) => handleShowFunction(e)}
                                        >
                                            <div className='DAT_RS_Content_Table_Left_ItemList_Item_More_Add'
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleAddType()}
                                            >
                                                <IoMdAddCircleOutline size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='DAT_RS_Content_Table_Right'>
                            {registerID.value === ''
                                ? <Empty />
                                :
                                <>
                                    <div className="DAT_Toollist_Tab">
                                        {listTab.map((item, i) => {
                                            return tabRS.value === item.id ? (
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
                                                        onClick={(e) => (tabRS.value = item.id)}
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
                                                    onClick={(e) => (tabRS.value = item.id)}
                                                >
                                                    {item.name}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {tabRS.value === "logger"
                                        ?
                                        <div className='DAT_RS_Content_Table_Right_Content'>
                                            {dataLogger.map((item, index) => {
                                                return (
                                                    <div className='DAT_RS_Content_Table_Right_Content_Row' key={index}>
                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Left'>
                                                            {item.type_}

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Left_More'>
                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                    {(popupState) => (
                                                                        <div className="DAT_TableEdit">
                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                            <Menu {...bindMenu(popupState)}>
                                                                                <MenuItem
                                                                                    id={item.type_}
                                                                                    onClick={(e) => {
                                                                                        handleChangeName(e);
                                                                                        popupState.close();
                                                                                    }}
                                                                                >
                                                                                    <FiEdit size={14} />
                                                                                    &nbsp;
                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                </MenuItem>

                                                                                <MenuItem
                                                                                    id={item.type_}
                                                                                    onClick={(e) => {
                                                                                        handleDeleteType(e);
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
                                                            </div>
                                                        </div>

                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right'>
                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item' style={{ fontFamily: "segoeuib", marginBottom: "8px", marginTop: '0px' }}>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>key</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>register</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>scale</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>type</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>note</div>
                                                                <div style={{ width: '20px' }}></div>
                                                            </div>

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit'>
                                                                Data
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit_Add'
                                                                    id={`${'data'}+${item.type_}`}
                                                                    onClick={(e) => handleAddTemplate(e)}>
                                                                    <IoMdAddCircleOutline size={20} />
                                                                </div>
                                                            </div>

                                                            {Object.entries(item.data_).map(([key, value]) => {
                                                                return (
                                                                    <div key={key}>
                                                                        {typeof (Object.values(item.data_[key])[0]) === 'object'
                                                                            ?
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'
                                                                                style={{ marginTop: "0px" }}
                                                                            >
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {key} {'('}{k}{')'}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.data_[key][k].register}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.data_[key][k].cal}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.data_[key][k].type}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                note
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px", cursor: "pointer" }}>
                                                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                    {(popupState) => (
                                                                                                        <div className="DAT_TableEdit">
                                                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                            <Menu {...bindMenu(popupState)}>
                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.data_[key][k].register}+${item.data_[key][k].cal}+${item.data_[key][k].type}+${item.type_}+${'data'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleEditTemplate(e);
                                                                                                                        popupState.close();
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <FiEdit size={14} />
                                                                                                                    &nbsp;
                                                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                                                </MenuItem>

                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.type_}+${'data'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleDeleteTemplate(e);
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
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'>
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {key}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {item.data_[key].register}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                    {item.data_[key].cal}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                    {item.data_[key].type}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    note
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                        {(popupState) => (
                                                                                            <div className="DAT_TableEdit">
                                                                                                <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                <Menu {...bindMenu(popupState)}>
                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.data_[key].register}+${item.data_[key].cal}+${item.data_[key].type}+${item.type_}+${'data'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleEditTemplate(e);
                                                                                                            popupState.close();
                                                                                                        }}
                                                                                                    >
                                                                                                        <FiEdit size={14} />
                                                                                                        &nbsp;
                                                                                                        {dataLang.formatMessage({ id: "change" })}
                                                                                                    </MenuItem>

                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.type_}+${'data'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleDeleteTemplate(e);
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
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                );
                                                            })}

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit' style={{ marginTop: "8px" }}>
                                                                Setting
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit_Add'
                                                                    id={`${'setting'}+${item.type_}`}
                                                                    onClick={(e) => handleAddTemplate(e)}
                                                                >
                                                                    <IoMdAddCircleOutline size={20} />
                                                                </div>
                                                            </div>

                                                            {Object.entries(item.setting).map(([key, value]) => {
                                                                return (
                                                                    <div key={key}>
                                                                        {typeof (value) === 'object'
                                                                            ?
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'
                                                                                style={{ marginTop: "0px" }}
                                                                            >
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {key} {'('}{k}{')'}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.setting[key][k]}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                note
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px", cursor: "pointer" }}>
                                                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                    {(popupState) => (
                                                                                                        <div className="DAT_TableEdit">
                                                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                            <Menu {...bindMenu(popupState)}>
                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.setting[key][k]}+${''}+${''}+${item.type_}+${'setting'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleEditTemplate(e);
                                                                                                                        popupState.close();
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <FiEdit size={14} />
                                                                                                                    &nbsp;
                                                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                                                </MenuItem>

                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.type_}+${'setting'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleDeleteTemplate(e);
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
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'>
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {key}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {item.setting[key]}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    note
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                        {(popupState) => (
                                                                                            <div className="DAT_TableEdit">
                                                                                                <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                <Menu {...bindMenu(popupState)}>
                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.setting[key]}+${''}+${''}+${item.type_}+${'setting'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleEditTemplate(e);
                                                                                                            popupState.close();
                                                                                                        }}
                                                                                                    >
                                                                                                        <FiEdit size={14} />
                                                                                                        &nbsp;
                                                                                                        {dataLang.formatMessage({ id: "change" })}
                                                                                                    </MenuItem>

                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.type_}+${'setting'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleDeleteTemplate(e);
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
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        :
                                        <div className='DAT_RS_Content_Table_Right_Content'>
                                            {dataInverter.map((item, index) => {
                                                return (
                                                    <div className='DAT_RS_Content_Table_Right_Content_Row' key={index}>
                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Left'>
                                                            {item.type_}

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Left_More'>
                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                    {(popupState) => (
                                                                        <div className="DAT_TableEdit">
                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                            <Menu {...bindMenu(popupState)}>
                                                                                <MenuItem
                                                                                    id={item.type_}
                                                                                    onClick={(e) => {
                                                                                        handleChangeName(e);
                                                                                        popupState.close();
                                                                                    }}
                                                                                >
                                                                                    <FiEdit size={14} />
                                                                                    &nbsp;
                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                </MenuItem>

                                                                                <MenuItem
                                                                                    id={item.type_}
                                                                                    onClick={(e) => {
                                                                                        handleDeleteType(e);
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
                                                            </div>
                                                        </div>

                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right'>
                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item' style={{ fontFamily: "segoeuib", marginBottom: "8px", marginTop: '0px' }}>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>key</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>register</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>scale</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>type</div>
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>note</div>
                                                                <div style={{ width: '20px' }}></div>
                                                            </div>

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit'>
                                                                Data
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit_Add'
                                                                    id={`${'data'}+${item.type_}`}
                                                                    onClick={(e) => handleAddTemplate(e)}>
                                                                    <IoMdAddCircleOutline size={20} />
                                                                </div>
                                                            </div>

                                                            {Object.entries(item.data_).map(([key, value]) => {
                                                                return (
                                                                    <div key={key}>
                                                                        {typeof (value) === 'object'
                                                                            ?
                                                                            <>
                                                                                {key === 'sn'
                                                                                    ? <></>
                                                                                    :
                                                                                    <>
                                                                                        {typeof (Object.values(item.data_[key])[0]) === 'object'
                                                                                            ?
                                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'
                                                                                                style={{ marginTop: "0px" }}
                                                                                            >
                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                                {key} {'('}{k}{')'}
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                                {item.data_[key][k].register}
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                                {item.data_[key][k].cal}
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                                {item.data_[key][k].type}
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                                note
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>

                                                                                                <div>
                                                                                                    {Object.entries(item.data_[key]).map(([k, v]) => {
                                                                                                        return (
                                                                                                            <div key={k} style={{ marginTop: "8px", cursor: "pointer" }}>
                                                                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                                    {(popupState) => (
                                                                                                                        <div className="DAT_TableEdit">
                                                                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                                            <Menu {...bindMenu(popupState)}>
                                                                                                                                <MenuItem
                                                                                                                                    id={`${key + "(" + k + ")"}+${item.data_[key][k].register}+${item.data_[key][k].cal}+${item.data_[key][k].type}+${item.type_}+${'data'}`}
                                                                                                                                    onClick={(e) => {
                                                                                                                                        handleEditTemplate(e);
                                                                                                                                        popupState.close();
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    <FiEdit size={14} />
                                                                                                                                    &nbsp;
                                                                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                                                                </MenuItem>

                                                                                                                                <MenuItem
                                                                                                                                    id={`${key + "(" + k + ')'}+${item.type_}+${'data'}`}
                                                                                                                                    onClick={(e) => {
                                                                                                                                        handleDeleteTemplate(e);
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
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'>
                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                                    {key}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                                    {item.data_[key].register}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                                    {item.data_[key].cal}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                                    {item.data_[key].type}
                                                                                                </div>

                                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                                    note
                                                                                                </div>

                                                                                                <div style={{ cursor: "pointer" }}>
                                                                                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                        {(popupState) => (
                                                                                                            <div className="DAT_TableEdit">
                                                                                                                <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                                <Menu {...bindMenu(popupState)}>
                                                                                                                    <MenuItem
                                                                                                                        id={`${key}+${item.data_[key].register}+${item.data_[key].cal}+${item.data_[key].type}+${item.type_}+${'data'}`}
                                                                                                                        onClick={(e) => {
                                                                                                                            handleEditTemplate(e);
                                                                                                                            popupState.close();
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <FiEdit size={14} />
                                                                                                                        &nbsp;
                                                                                                                        {dataLang.formatMessage({ id: "change" })}
                                                                                                                    </MenuItem>

                                                                                                                    <MenuItem
                                                                                                                        id={`${key}+${item.type_}+${'data'}`}
                                                                                                                        onClick={(e) => {
                                                                                                                            handleDeleteTemplate(e);
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
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </>
                                                                                }
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {key === 'mode'
                                                                                    ?
                                                                                    <></>
                                                                                    :
                                                                                    <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'>
                                                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                            {key}
                                                                                        </div>

                                                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                            {item.data_[key]}
                                                                                        </div>

                                                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                        </div>

                                                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                        </div>

                                                                                        <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                            note
                                                                                        </div>

                                                                                        <div style={{ cursor: "pointer" }}>
                                                                                            <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                {(popupState) => (
                                                                                                    <div className="DAT_TableEdit">
                                                                                                        <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                        <Menu {...bindMenu(popupState)}>
                                                                                                            <MenuItem
                                                                                                                id={`${key}+${item.data_[key]}+${''}+${''}+${item.type_}+${'data'}`}
                                                                                                                onClick={(e) => {
                                                                                                                    handleEditTemplate(e);
                                                                                                                    popupState.close();
                                                                                                                }}
                                                                                                            >
                                                                                                                <FiEdit size={14} />
                                                                                                                &nbsp;
                                                                                                                {dataLang.formatMessage({ id: "change" })}
                                                                                                            </MenuItem>

                                                                                                            <MenuItem
                                                                                                                id={`${key}+${item.type_}+${'data'}`}
                                                                                                                onClick={(e) => {
                                                                                                                    handleDeleteTemplate(e);
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
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </div>
                                                                );
                                                            })}

                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit' style={{ marginTop: "8px" }}>
                                                                Setting
                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Tit_Add'
                                                                    id={`${'setting'}+${item.type_}`}
                                                                    onClick={(e) => handleAddTemplate(e)}>
                                                                    <IoMdAddCircleOutline size={20} />
                                                                </div>
                                                            </div>

                                                            {Object.entries(item.setting).map(([key, value]) => {
                                                                return (
                                                                    <div key={key}>
                                                                        {typeof (Object.values(item.setting[key])[0]) === 'object'
                                                                            ?
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'
                                                                                style={{ marginTop: "0px" }}
                                                                            >
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {key} {'('}{k}{')'}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.setting[key][k].register}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.setting[key][k].cal}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                {item.setting[key][k].type}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px" }}>
                                                                                                note
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    {Object.entries(item.setting[key]).map(([k, v]) => {
                                                                                        return (
                                                                                            <div key={k} style={{ marginTop: "8px", cursor: "pointer" }}>
                                                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                                    {(popupState) => (
                                                                                                        <div className="DAT_TableEdit">
                                                                                                            <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                            <Menu {...bindMenu(popupState)}>
                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.setting[key][k].register}+${item.setting[key][k].cal}+${item.setting[key][k].type}+${item.type_}+${'setting'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleEditTemplate(e);
                                                                                                                        popupState.close();
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <FiEdit size={14} />
                                                                                                                    &nbsp;
                                                                                                                    {dataLang.formatMessage({ id: "change" })}
                                                                                                                </MenuItem>

                                                                                                                <MenuItem
                                                                                                                    id={`${key + '(' + k + ')'}+${item.type_}+${'setting'}`}
                                                                                                                    onClick={(e) => {
                                                                                                                        handleDeleteTemplate(e);
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
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item'>
                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Key'>
                                                                                    {key}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Register'>
                                                                                    {item.setting[key].register}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Scale'>
                                                                                    {item.setting[key].cal}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Type'>
                                                                                    {item.setting[key].type}
                                                                                </div>

                                                                                <div className='DAT_RS_Content_Table_Right_Content_Row_Right_Item_Note'>
                                                                                    note
                                                                                </div>

                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                                                                        {(popupState) => (
                                                                                            <div className="DAT_TableEdit">
                                                                                                <IoMdMore size={20} color="grey" {...bindToggle(popupState)} />
                                                                                                <Menu {...bindMenu(popupState)}>
                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.setting[key].register}+${item.setting[key].cal}+${item.setting[key].type}+${item.type_}+${'setting'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleEditTemplate(e);
                                                                                                            popupState.close();
                                                                                                        }}
                                                                                                    >
                                                                                                        <FiEdit size={14} />
                                                                                                        &nbsp;
                                                                                                        {dataLang.formatMessage({ id: "change" })}
                                                                                                    </MenuItem>

                                                                                                    <MenuItem
                                                                                                        id={`${key}+${item.type_}+${'setting'}`}
                                                                                                        onClick={(e) => {
                                                                                                            handleDeleteTemplate(e);
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
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    :
                    <></>
                }
            </>
        );
    };

    const handleClosePopup = () => {
        setPopupState(false);
    };

    const handleAddType = () => {
        setPopupState(true);
        setPopupType("addType");
    };

    const handleChangeName = (e) => {
        setPopupInfo({ ...popupInfo, type: e.currentTarget.id });
        setPopupState(true);
        setPopupType("changeName");
    };

    const handleDeleteType = (e) => {
        setPopupInfo({ ...popupInfo, type: e.currentTarget.id });
        setPopupState(true);
        setPopupType("deleteType");
    };

    const handleAddTemplate = (e) => {
        const id = e.currentTarget.id;
        const idArr = id.split("+");
        setPopupInfo({ ...popupInfo, templateType: idArr[0], type_: idArr[1] });
        setPopupState(true);
        setPopupType("addTemplate");
    };

    const handleEditTemplate = (e) => {
        const id = e.currentTarget.id;
        const idArr = id.split("+");
        setPopupInfo({ ...popupInfo, key: idArr[0], register: idArr[1], scale: idArr[2], type: idArr[3], type_: idArr[4], templateType: idArr[5] });
        setPopupState(true);
        setPopupType("editTemplate");
    };

    const handleDeleteTemplate = (e) => {
        const id = e.currentTarget.id;
        const idArr = id.split("+");
        setPopupInfo({ ...popupInfo, key: idArr[0], type_: idArr[1], templateType: idArr[2] });
        setPopupState(true);
        setPopupType("deleteTemplate");
    }

    useEffect(() => {
        const getLoggerTemplate = async () => {
            let d = await callApi("get", host.DATA + "/getLoggerTemplate");
            if (d.status === true) {
                loggerListRS.value = d.data.sort((a, b) => a.id_ - b.id_);
            }
        };
        getLoggerTemplate();
        const getInverterTemplate = async () => {
            let d = await callApi("get", host.DATA + "/getInverterTemplate");
            if (d.status === true) {
                inverterListRS.value = d.data.sort((a, b) => a.id_ - b.id_);
            }
        };
        getInverterTemplate();

        return () => {
            tabRS.value = "logger";
            registerID.value = "";
        };
    }, []);

    useEffect(() => {
        if (registerID.value !== '') {
            let data = loggerListRS.value.filter((item) => item.brand_ === registerID.value);
            console.log('logger', data);
            setDataLogger(data);
            let data_ = inverterListRS.value.filter((item) => item.brand_ === registerID.value);
            console.log('inverter', data_);
            setDataInverter(data_);
        }
        // eslint-disable-next-line
    }, [registerID.value, loggerListRS.value, inverterListRS.value]);

    return (
        <>
            {isBrowser
                ?
                <div style={{ position: "relative", top: "0", left: "0", width: "100%", height: "100vh", }}>
                    <div className="DAT_Header">
                        <div className="DAT_Header_Title">
                            <MdOutlineManageHistory color="gray" size={25} />
                            <span>{dataLang.formatMessage({ id: "registersetting" })}</span>
                        </div>

                        {/* <div className="DAT_Header_Filter">
                            <input
                                type="text"
                                placeholder={dataLang.formatMessage({ id: "enterRegister" }) + "..."}
                            // ref={filterRef}
                            // onChange={(e) => {
                            //     handleFilter(e);
                            // }}
                            />
                            <CiSearch color="gray" size={20} />
                        </div>

                        <div></div> */}
                    </div>

                    <div className='DAT_RS'>
                        <div className='DAT_RS_Content'>
                            <RegisterSetting />
                        </div>
                    </div>

                    {popupState
                        ? <div className="DAT_PopupBG">
                            <RSPopup handleClose={handleClosePopup} type={popupType} info={popupInfo} />
                        </div>
                        : <></>
                    }
                </div>
                :
                <div></div>
            }
        </>
    )
};
