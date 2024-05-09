import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { Empty } from '../Project/Project';
import DataTable from 'react-data-table-component';

export default function ControlLog(props) {
    const dataLang = useIntl();

    const data = [
        {
            //   senttime: "2021-09-01 00:00:00",
            //   name: "Grid Start Settings",
            //   type: "Setting",
            //   input: "--",
            //   result: "264.5 V",
            //   state: "Succeeded",
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
            name: dataLang.formatMessage({ id: 'SentTime' }),
            selector: (row) => row.senttime,
            sortable: true,
            // width: "80px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'CommandName' }),
            selector: (row) => row.name,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'CommandType' }),
            selector: (row) => row.type,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'Inputs' }),
            selector: (row) => row.input,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'ReturnResult' }),
            selector: (row) => row.result,
            sortable: true,
            // width: "180px",
            style: {
                justifyContent: "left",
            },
        },
        {
            name: dataLang.formatMessage({ id: 'CommandState' }),
            selector: (row) => row.state,
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
                        <option>{dataLang.formatMessage({ id: 'CommandState' })}</option>
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
