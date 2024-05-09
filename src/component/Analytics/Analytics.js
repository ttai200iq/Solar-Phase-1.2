import React from "react";
import "./Analytics.scss";

import DataTable from "react-data-table-component";
import { Empty } from "../Project/Project";
import { signal } from "@preact/signals-react";
import AnaCreate from "./AnaCreate";
import { useIntl } from "react-intl";

import { TiFlowSwitch } from "react-icons/ti";
import { isMobile } from "../Navigation/Navigation";

export const anaState = signal("default");

export default function Analytics(props) {
  const dataLang = useIntl();

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: 'row' }),
    rangeSeparatorText: dataLang.formatMessage({ id: 'to' }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: 'showAll' }),
  };

  const dataAna = [];

  const columnAna = [
    {
      name: dataLang.formatMessage({ id: 'name' }),
      selector: (row) => row.name,
      sortable: true,
      minWidth: "350px",
    },
    {
      name: dataLang.formatMessage({ id: 'setting' }),
      selector: (row) => (
        <>
          <div className="DAT_TableEdit">
            <span
              id={row.id + "_MORE"}
              onMouseEnter={(e) => handleModify(e, "block")}
            >
              ...
            </span>
          </div>

          <div className="DAT_ModifyBox"
            id={row.id + "_Modify"}
            style={{ display: "none" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div className="DAT_ModifyBox_Fix">
              {dataLang.formatMessage({ id: 'edits' })}
            </div>
            <div className="DAT_ModifyBox_Remove">
              {dataLang.formatMessage({ id: 'remove' })}
            </div>
          </div>
        </>
      ),
      width: "100px",
    },
  ];

  const handleModify = (e, type) => {
    const id = e.currentTarget.id;
    var arr = id.split("_");
    const mod = document.getElementById(arr[0] + "_Modify");
    mod.style.display = type;
  };

  return (
    <>
      {isMobile.value
        ? <>
          <div className="DAT_AnaHeaderMobile">
            <div className="DAT_AnaHeaderMobile_Top">
              {/* <div className="DAT_LogHeaderMobile_Top_Filter">
                                <input type="text" placeholder={dataLang.formatMessage({ id: 'enterDev' })} />
                                <CiSearch color="gray" size={20} />
                            </div> */}
            </div>

            <div className="DAT_AnaHeaderMobile_Title">
              <TiFlowSwitch color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "analytic" })}</span>
            </div>
          </div>

          <div></div>
        </>
        : <>
          <div className="DAT_AnaHeader">
            <div className="DAT_AnaHeader_Title">
              <TiFlowSwitch color="gray" size={25} />
              <span>
                {dataLang.formatMessage({ id: 'analytic' })}
              </span>
            </div>

            {/* <button className="DAT_AnaHeader_New"
            onClick={() => (anaState.value = "create")}
          >
            <span>
              <TbReport color="white" size={20} />
              &nbsp;
              {dataLang.formatMessage({ id: 'createAnal' })}
            </span>
          </button> */}
          </div>

          <div className="DAT_Ana">
            <div className='DAT_Ana_Header' style={{ padding: "15px", backgroundColor: "rgba(233, 233, 233, 0.5)" }}>
              {dataLang.formatMessage({ id: 'analyticsList' })}
            </div>
            <div className="DAT_Ana_Content">
              <DataTable
                className="DAT_Table_Container"
                columns={columnAna}
                data={dataAna}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                fixedHeader={true}
                noDataComponent={<Empty />}
              />
            </div>
          </div>
        </>
      }

      <div className="DAT_AnaInfor"
        style={{
          height: anaState.value === "default" ? "0px" : "100vh",
          transition: "0.5s",
        }}
      >
        {(() => {
          switch (anaState.value) {
            case "create":
              return <AnaCreate />;
            default:
              return <></>;
          }
        })()}
      </div>
    </>
  );
}
