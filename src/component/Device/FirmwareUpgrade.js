import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { isMobile } from '../Navigation/Navigation';
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { FaCheckCircle } from 'react-icons/fa';

export default function FirmwareUpgrade(props) {
    const dataLang = useIntl();

    return (
        <>
            <div className="DAT_Info_Databox" id="FirmwareUpgrade">
                <div className="DAT_Info_Databox_Title">
                    <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'CurrentVersion' })}</div>
                </div>

                <div className="DAT_Info_Databox_FirmwareUpgrade">
                    <div className="DAT_Info_Databox_FirmwareUpgrade_Current">
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Left">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Left_Item"
                                style={{
                                    display: isMobile.value ? "block" : "flex",
                                    marginBottom: isMobile.value ? "16px" : "0px"
                                }}
                            >
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Left_Item_Tit"
                                    style={{ marginBottom: isMobile.value ? "8px" : "0px" }}
                                >
                                    {dataLang.formatMessage({ id: 'CertificationVersion' })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Left_Item_Content">
                                    GAA
                                </div>
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Center">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Center_Item"
                                style={{
                                    display: isMobile.value ? "block" : "flex",
                                    marginBottom: isMobile.value ? "16px" : "0px"
                                }}

                            >
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Center_Item_Tit"
                                    style={{ marginBottom: isMobile.value ? "8px" : "0px" }}
                                >
                                    {dataLang.formatMessage({ id: 'InternalSoftwareVersion' })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Center_Item_Content">
                                    1110-0-0-203
                                </div>
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Right">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Right_Item"
                                style={{ display: isMobile.value ? "block" : "flex" }}

                            >
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Right_Item_Tit"
                                    style={{ marginBottom: isMobile.value ? "8px" : "0px" }}
                                >
                                    {dataLang.formatMessage({ id: 'UpgradeFlagBit' })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Current_Right_Item_Content">
                                    2
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="DAT_Info_Databox" id="FirmwareUpgrade">
                <div className="DAT_Info_Databox_Title">
                    <div className="DAT_Info_Databox_Title_Left">
                        {dataLang.formatMessage({ id: 'LastUpgradeRecord' })}:
                    </div>
                </div>

                <div className="DAT_Info_Databox_FirmwareUpgrade">
                    <div className="DAT_Info_Databox_FirmwareUpgrade_Last">
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item" style={{ marginBottom: isMobile.value ? "16px" : "24px" }}>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item_Tit">
                                    {dataLang.formatMessage({ id: "TargetVersion" })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item_Content">
                                    XG5-10KTL_arm_203_Vietnam
                                </div>
                            </div>
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item" style={{ marginBottom: isMobile.value ? "16px" : "0px" }}>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item_Tit">
                                    {dataLang.formatMessage({ id: 'UpgradePhase' })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Left_Item_Content">
                                    <FaCheckCircle size={16} color="green" />
                                    <span style={{ color: "green" }}>
                                        {dataLang.formatMessage({ id: "success" })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item" style={{ marginBottom: isMobile.value ? "16px" : "24px" }}>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item_Tit">
                                    {dataLang.formatMessage({ id: "RelatedVersion" })}::
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item_Content">
                                    {dataLang.formatMessage({ id: "InternalSoftwareVersion" })}
                                </div>
                            </div>
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item" style={{ marginBottom: isMobile.value ? "16px" : "0px" }}>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item_Tit">
                                    {dataLang.formatMessage({ id: "FeedbackTime" })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Center_Item_Content">
                                    2024/03/11 08:50:17 UTC+07:00
                                </div>
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Right">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Right_Item">
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Right_Item_Tit">
                                    {dataLang.formatMessage({ id: "UpgradedTime" })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Last_Right_Item_Content">
                                    2024/03/11 08:48:18 UTC+07:00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="DAT_Info_Databox" id="FirmwareUpgrade">
                <div className="DAT_Info_Databox_Title">
                    <div className="DAT_Info_Databox_Title_Left">
                        {dataLang.formatMessage({ id: "UpgradeOperation" })}:
                    </div>
                    <div className="DAT_Info_Databox_Title_Right">
                        <span>
                            {dataLang.formatMessage({ id: "LoggerDownloadMethods" })}:
                        </span>
                        <select>
                            <option>{dataLang.formatMessage({ id: "IPDownload" })}</option>
                        </select>
                    </div>
                </div>

                <div className="DAT_Info_Databox_FirmwareUpgrade">
                    <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade">
                        <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left">
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item" style={{ marginBottom: isMobile.value ? "8px" : "24px" }}>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item_Tit">
                                    {dataLang.formatMessage({ id: "SelFirmwarePackage" })}:
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item_Content">
                                    <button>
                                        {dataLang.formatMessage({ id: "ClickSelectFirmwarePackage" })}
                                    </button>
                                </div>
                            </div>
                            <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item">
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item_Tit">
                                    {dataLang.formatMessage({ id: "Timeout" })}:

                                    <div className="DAT_Home_Overview-Main-Percent-Icon" style={{ cursor: 'pointer' }}>
                                        <PopupState variant="popper" popupId="demo-popup-popper">
                                            {(popupState) => (
                                                <div style={{ cursor: 'pointer' }}>
                                                    <HelpOutlineIcon
                                                        {...bindHover(popupState)}
                                                        color="action"
                                                        fontSize="9px" />
                                                    <Popper {...bindPopper(popupState)} transition >
                                                        {({ TransitionProps }) => (
                                                            <Fade {...TransitionProps} timeout={350}>
                                                                <Paper sx={{ width: '400px', marginLeft: '200px', p: 2 }}>
                                                                    <Typography sx={{ fontSize: '12px', textAlign: 'justify', marginBottom: 1.7 }}>
                                                                        {dataLang.formatMessage({ id: 'timeoutInfo' })}
                                                                    </Typography>
                                                                </Paper>
                                                            </Fade>
                                                        )}
                                                    </Popper>
                                                </div>
                                            )}
                                        </PopupState>
                                    </div>
                                </div>
                                <div className="DAT_Info_Databox_FirmwareUpgrade_Upgrade_Left_Item_Content">
                                    <input />
                                    <span>
                                        {dataLang.formatMessage({ id: "Minute" })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Info_Databox_FirmwareUpgrade_Foot">
                        <button>
                            {dataLang.formatMessage({ id: "StartUpgrading" })}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
