import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import DataTable from 'react-data-table-component';
import { Empty } from '../Project/Project';

export default function UpgradelLog(props) {
    const dataLang = useIntl();

    const data = [
        {
            //   upgradedtime: "2021-09-01 00:00:00",
            //   package: "Grid Start Settings",
            //   target: "Setting",
            //   related: "--",
            //   state: "Succeeded",
            //   result: "264.5 V",
            //   reason: "--",
            //   operator: "Datsolar",
            //   feedbacktime: "2021-09-01 00:00:00",
        },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: dataLang.formatMessage({ id: "row" }),
        rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
        selectAllRowsItem: true,
        selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
    };

    const columnLog = [
        {
            name: dataLang.formatMessage({ id: 'UpgradedTime' }),
            selector: (row) => row.upgradedtime,
            sortable: true,
            // width: "80px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'FirmwarePackage' }),
            selector: (row) => row.package,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'TargetVersion' }),
            selector: (row) => row.target,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'RelatedVersion' }),
            selector: (row) => row.related,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'UpgradeState' }),
            selector: (row) => row.state,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'ParseResult' }),
            selector: (row) => row.result,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'ReasonOfFailure' }),
            selector: (row) => row.reason,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'Operator' }),
            selector: (row) => row.operator,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'FeedbackTime' }),
            selector: (row) => row.feedbacktime,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
    ];

    return (
        <div className="DAT_Info_Databox" id="ControlLog">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">
                    <select>
                        <option>{dataLang.formatMessage({ id: 'UpgradeState' })}</option>
                    </select>
                </div>
            </div>

            <div className="DAT_Info_Databox_ControlLog">
                <DataTable
                    className="DAT_Table_Device"
                    columns={columnLog}
                    data={data}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    fixedHeader={true}
                    noDataComponent={<Empty />}
                />
            </div>
        </div>
    );
}
