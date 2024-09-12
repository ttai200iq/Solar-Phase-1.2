import React from "react";

import { useIntl } from "react-intl";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { isBrowser } from "react-device-detect";
import { COLOR, convertUnit, showUnit } from "../../App";
import { isDesktop } from "../Home/Home";
import { slcoalsave, slprojectdatasize } from "./SLProjectData";
import { slProjectData } from "./SLProjectlist";

export default function SLBenefit(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_ProjectData_Dashboard_More_Right">
            {isBrowser ?
                isDesktop.value
                    ?
                    <>
                        <div className="DAT_ProjectData_NewDashboard_More_Right_Tit">
                            {dataLang.formatMessage({ id: "environment" })}
                            &nbsp;
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {(popupState) => (
                                    <div style={{ cursor: "pointer" }}>
                                        <HelpOutlineIcon {...bindHover(popupState)} color="action" fontSize="9px" />
                                        <Popper {...bindPopper(popupState)} transition>
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <Paper sx={{ width: "400px", p: 2, }}>
                                                        <Typography sx={{ fontSize: "12px", textAlign: "justify", marginBottom: 1.7, }}>
                                                            1.{" "}
                                                            {dataLang.formatMessage({
                                                                id: "environment1",
                                                            })}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "12px", textAlign: "justify", marginBottom: 1.7, }}>
                                                            2.{" "}
                                                            {dataLang.formatMessage({
                                                                id: "environment2",
                                                            })}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "12px", textAlign: "justify", marginBottom: 1.7, }}>
                                                            3.{" "}
                                                            {dataLang.formatMessage({
                                                                id: "environment3",
                                                            })}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "12px", textAlign: "justify", }}>
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

                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content">
                            <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col">
                                <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/Coal Cart.png" alt="coal" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" style={{ width: slprojectdatasize.value.icon.fontSize, height: slprojectdatasize.value.icon.fontSize }} />
                                    </div>
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Tit"
                                            style={{ fontSize: slprojectdatasize.value.label.fontSize, color: COLOR.value.grayText }}
                                        >
                                            {dataLang.formatMessage({ id: "coalSave" })}
                                        </div>
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Number" >
                                            {/* {Number(
                                            parseFloat(
                                                coalsave.value.value * coalsave.value.ef || 0
                                            ).toFixed(2)
                                        ).toLocaleString("en-US")}
                                        &nbsp;
                                        <span>t</span> */}
                                            <span style={{ fontSize: slprojectdatasize.value.value.fontSize }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.ef || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: slprojectdatasize.value.unit.fontSize }}
                                            >
                                                t
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/CO2.png" alt="power" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" style={{ width: slprojectdatasize.value.icon.fontSize, height: slprojectdatasize.value.icon.fontSize }} />
                                    </div>
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Tit"
                                            style={{ fontSize: slprojectdatasize.value.label.fontSize, color: COLOR.value.grayText }}
                                        >
                                            {dataLang.formatMessage({ id: "C02" })}
                                        </div>
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Number" >
                                            {/* {Number(
                                            parseFloat(
                                                coalsave.value.value * coalsave.value.avr || 0
                                            ).toFixed(2)
                                        ).toLocaleString("en-US")}
                                        &nbsp;
                                        <span>t</span> */}
                                            <span style={{ fontSize: slprojectdatasize.value.value.fontSize }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.avr || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: slprojectdatasize.value.unit.fontSize }}
                                            >
                                                t
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/BlueTree.png" alt="tree" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" style={{ width: slprojectdatasize.value.icon.fontSize, height: slprojectdatasize.value.icon.fontSize }} />
                                    </div>
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Tit"
                                            style={{ fontSize: slprojectdatasize.value.label.fontSize, color: COLOR.value.grayText }}
                                        >
                                            {dataLang.formatMessage({ id: "cropYield" })}
                                        </div>
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Number" >
                                            {/* {Number(
                                            parseFloat(
                                                coalsave.value.value * coalsave.value.tree || 0
                                            ).toFixed(2)
                                        ).toLocaleString("en-US")}
                                        &nbsp;
                                        <span>
                                            {dataLang.formatMessage({ id: "tree" })}
                                        </span> */}
                                            <span style={{ fontSize: slprojectdatasize.value.value.fontSize }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.tree || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: slprojectdatasize.value.unit.fontSize }}
                                            >
                                                {dataLang.formatMessage({ id: "tree" })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/Money.png" alt="money" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" style={{ width: slprojectdatasize.value.icon.fontSize, height: slprojectdatasize.value.icon.fontSize }} />
                                    </div>
                                    <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Tit"
                                            style={{ fontSize: slprojectdatasize.value.label.fontSize, color: COLOR.value.grayText }}
                                        >
                                            {dataLang.formatMessage({ id: "totalRevenue" })}
                                        </div>
                                        <div className="DAT_ProjectData_NewDashboard_More_Right_Content_Col_Item_Container_Number" >
                                            {/* {Number(
                                            parseFloat(
                                                (coalsave.value.value * projectData.value.price) / 1000 || 0
                                            ).toFixed(2)
                                        ).toLocaleString("en-US")}
                                        &nbsp;
                                        <span style={{ textTransform: "uppercase" }}>
                                            M{projectData.value.currency}
                                        </span> */}
                                            <span style={{ fontSize: slprojectdatasize.value.value.fontSize }}>
                                                {Number(parseFloat(convertUnit(slcoalsave.value.value * slProjectData.value.price / 1000 || 0)).toFixed(1)).toLocaleString(
                                                    "en-US"
                                                )}
                                            </span>
                                            <span
                                                style={{ fontSize: "18px" }}
                                            >
                                                {showUnit(slcoalsave.value.value * slProjectData.value.price)}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: slprojectdatasize.value.unit.fontSize }}
                                            >
                                                VND
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="DAT_ProjectData_NewDashboard_More_Right_Tit">
                            {dataLang.formatMessage({ id: "environment" })}
                            &nbsp;
                            <PopupState variant="popper" popupId="demo-popup-popper">
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
                                                            width: "300px",
                                                            marginTop: "5px",
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
                                        {/* <img src="/dat_icon/Coal Cart.png" alt="coal" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" />
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                            {dataLang.formatMessage({ id: "coalSave" })}
                                        </div>
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                            <span style={{ fontSize: "26px" }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.ef || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                            >
                                                t
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/CO2.png" alt="power" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" />
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                            {dataLang.formatMessage({ id: "C02" })}
                                        </div>
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                            <span style={{ fontSize: "26px" }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.avr || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                            >
                                                t
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/BlueTree.png" alt="tree" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" />
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                            {dataLang.formatMessage({ id: "cropYield" })}
                                        </div>
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                            <span style={{ fontSize: "26px" }}>
                                                {Number(
                                                    parseFloat(
                                                        slcoalsave.value.value * slcoalsave.value.tree || 0
                                                    ).toFixed(1)
                                                ).toLocaleString("en-US")}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                            >
                                                {dataLang.formatMessage({ id: "tree" })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                        {/* <img src="/dat_icon/Money.png" alt="money" /> */}
                                        <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" />
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                            {dataLang.formatMessage({ id: "totalRevenue" })}
                                        </div>
                                        <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                            <span style={{ fontSize: "26px" }}>
                                                {Number(parseFloat(convertUnit(slcoalsave.value.value * slProjectData.value.price / 1000 || 0)).toFixed(1)).toLocaleString(
                                                    "en-US"
                                                )}
                                            </span>
                                            <span
                                                style={{ fontSize: "18px" }}
                                            >
                                                {showUnit(slcoalsave.value.value * slProjectData.value.price)}
                                            </span>
                                            &nbsp;
                                            <span
                                                style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                            >
                                                VND
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                :
                <>
                    <div className="DAT_ProjectData_NewDashboard_More_Right_Tit">
                        {dataLang.formatMessage({ id: "environment" })}
                        &nbsp;
                        <PopupState variant="popper" popupId="demo-popup-popper">
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
                                                        width: "300px",
                                                        marginTop: "5px",
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
                                    {/* <img src="/dat_icon/Coal Cart.png" alt="coal" /> */}
                                    <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" />
                                </div>
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                        {dataLang.formatMessage({ id: "coalSave" })}
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                        <span style={{ fontSize: "26px" }}>
                                            {Number(
                                                parseFloat(
                                                    slcoalsave.value.value * slcoalsave.value.ef || 0
                                                ).toFixed(1)
                                            ).toLocaleString("en-US")}
                                        </span>
                                        &nbsp;
                                        <span
                                            style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                        >
                                            t
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                    {/* <img src="/dat_icon/CO2.png" alt="power" /> */}
                                    <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" />
                                </div>
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                        {dataLang.formatMessage({ id: "C02" })}
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                        <span style={{ fontSize: "26px" }}>
                                            {Number(
                                                parseFloat(
                                                    slcoalsave.value.value * slcoalsave.value.avr || 0
                                                ).toFixed(1)
                                            ).toLocaleString("en-US")}
                                        </span>
                                        &nbsp;
                                        <span
                                            style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                        >
                                            t
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                    {/* <img src="/dat_icon/BlueTree.png" alt="tree" /> */}
                                    <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" />
                                </div>
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                        {dataLang.formatMessage({ id: "cropYield" })}
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                        <span style={{ fontSize: "26px" }}>
                                            {Number(
                                                parseFloat(
                                                    slcoalsave.value.value * slcoalsave.value.tree || 0
                                                ).toFixed(1)
                                            ).toLocaleString("en-US")}
                                        </span>
                                        &nbsp;
                                        <span
                                            style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                        >
                                            {dataLang.formatMessage({ id: "tree" })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item">
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Icon">
                                    {/* <img src="/dat_icon/Money.png" alt="money" /> */}
                                    <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" />
                                </div>
                                <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container">
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Tit">
                                        {dataLang.formatMessage({ id: "totalRevenue" })}
                                    </div>
                                    <div className="DAT_ProjectData_Dashboard_More_Right_Content_Col_Item_Container_Number" >
                                        <span style={{ fontSize: "26px" }}>
                                            {Number(parseFloat(convertUnit(slcoalsave.value.value * slProjectData.value.price / 1000 || 0)).toFixed(1)).toLocaleString(
                                                "en-US"
                                            )}
                                        </span>
                                        <span
                                            style={{ fontSize: "18px" }}
                                        >
                                            {showUnit(slcoalsave.value.value * slProjectData.value.price)}
                                        </span>
                                        &nbsp;
                                        <span
                                            style={{ color: COLOR.value.grayText, fontSize: "18px" }}
                                        >
                                            VND
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
