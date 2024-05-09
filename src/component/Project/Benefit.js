import React from 'react';
import "./Project.scss";

import { useIntl } from 'react-intl';
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { GiCoalWagon } from 'react-icons/gi';
import { FaMoneyBill, FaTree } from 'react-icons/fa';
import { IoIosCloud } from 'react-icons/io';
import { projectData } from './Project';
import { coalsave } from './ProjectData';

export default function Benefit(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_ProjectData_Dashboard_More_Right">
            <div className="DAT_ProjectData_Dashboard_More_Right_Tit">
                {dataLang.formatMessage({ id: "environment" })}
                &nbsp;
                <PopupState
                    variant="popper"
                    popupId="demo-popup-popper"
                >
                    {(popupState) => (
                        <div style={{ cursor: "pointer" }}>
                            <HelpOutlineIcon
                                {...bindHover(popupState)}
                                color="action"
                                fontSize="9px"
                            />
                            <Popper {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                        <Paper
                                            sx={{
                                                width: "400px",
                                                marginTop: "10px",
                                                marginLeft: "335px",
                                                p: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    textAlign: "justify",
                                                    marginBottom: 1.7,
                                                }}
                                            >
                                                1.{" "}
                                                {dataLang.formatMessage({
                                                    id: "environment1",
                                                })}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    textAlign: "justify",
                                                    marginBottom: 1.7,
                                                }}
                                            >
                                                2.{" "}
                                                {dataLang.formatMessage({
                                                    id: "environment2",
                                                })}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    textAlign: "justify",
                                                    marginBottom: 1.7,
                                                }}
                                            >
                                                3.{" "}
                                                {dataLang.formatMessage({
                                                    id: "environment3",
                                                })}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    textAlign: "justify",
                                                }}
                                            >
                                                4.{" "}
                                                {dataLang.formatMessage({
                                                    id: "environment4",
                                                })}
                                            </Typography>
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        </div>
                    )}
                </PopupState>
            </div>

            <div className="DAT_ProjectData_Dashboard_More_Right_Content">
                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col">
                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                            <GiCoalWagon size={24} color="#6495ed" />
                        </div>
                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Tit">
                            <div style={{ fontSize: "14px", color: "grey" }}>
                                {dataLang.formatMessage({ id: "coalSave" })}
                            </div>
                            <div>
                                {Number(
                                    parseFloat(
                                        coalsave.value.value * coalsave.value.ef || 0
                                    ).toFixed(2)
                                ).toLocaleString("en-US")}
                                &nbsp;
                                <span
                                    style={{ color: "grey", fontSize: "12px" }}
                                >
                                    t
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                            <FaTree size={24} color="#6495ed" />
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "grey" }}>
                                {dataLang.formatMessage({ id: "cropYield" })}
                            </div>
                            <div>
                                {Number(
                                    parseFloat(
                                        coalsave.value.value * coalsave.value.tree || 0
                                    ).toFixed(2)
                                ).toLocaleString("en-US")}
                                &nbsp;
                                <span
                                    style={{ color: "grey", fontSize: "12px" }}
                                >
                                    {dataLang.formatMessage({ id: "tree" })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col">
                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                            <IoIosCloud size={24} color="#6495ed" />
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "grey" }}>
                                {dataLang.formatMessage({ id: "C02" })}
                            </div>
                            <div>
                                {Number(
                                    parseFloat(
                                        coalsave.value.value * coalsave.value.avr || 0
                                    ).toFixed(2)
                                ).toLocaleString("en-US")}
                                &nbsp;
                                <span
                                    style={{ color: "grey", fontSize: "12px" }}
                                >
                                    t
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                            <FaMoneyBill size={24} color="#6495ed" />
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "grey" }}>
                                {dataLang.formatMessage({ id: "totalRevenue" })}
                            </div>
                            <div>
                                {Number(
                                    parseFloat(
                                        (coalsave.value.value *
                                            projectData.value.price) /
                                        1000 || 0
                                    ).toFixed(2)
                                ).toLocaleString("en-US")}
                                &nbsp;
                                <span
                                    style={{ color: "grey", fontSize: "12px" }}
                                >
                                    k{projectData.value.currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

