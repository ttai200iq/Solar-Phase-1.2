import React from 'react';
import "./Project.scss";

import { useIntl } from 'react-intl';
import { projectData } from './Project';

export default function ProjectInfo(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_ProjectData_Dashboard_More_Left">
            <div className="DAT_ProjectData_Dashboard_More_Left_Tit">
                <span>Thông tin dự án</span>
            </div>

            <div className="DAT_ProjectData_Dashboard_More_Left_Content">
                <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left">
                    <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item_Title">
                            {dataLang.formatMessage({ id: "projType" })}:
                        </div>
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item_Content">
                            {projectData.value.planttype === "industrial" ? (
                                <>{dataLang.formatMessage({ id: "factory" })}</>
                            ) : (
                                <>
                                    {dataLang.formatMessage({ id: "household" })}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item_Title">
                            {dataLang.formatMessage({ id: "companyName" })}:
                        </div>
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Left_Item_Content">
                            {projectData.value.business}
                        </div>
                    </div>
                </div>

                <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right">
                    <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item_Title">
                            {dataLang.formatMessage({ id: "contactName" })}:
                        </div>
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item_Content">
                            {projectData.value.contact}
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item">
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item_Title">
                            {dataLang.formatMessage({ id: "phone" })}:
                        </div>
                        <div className="DAT_ProjectData_Dashboard_More_Left_Content_Right_Item_Content">
                            {projectData.value.phone}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

