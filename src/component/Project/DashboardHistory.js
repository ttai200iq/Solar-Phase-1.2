import React, { useEffect, useState } from "react";
import "./Project.scss";

import Day from "./Day";
import Month from "./Month";
import Year from "./Year";
import Total from "./Total";
import ExportData from "./ExportData";
import { COLOR } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { projectData } from "./Project";
import { useIntl } from "react-intl";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import { signal } from "@preact/signals-react";
import { useDispatch, useSelector } from "react-redux";
import toolslice from "../Redux/toolslice";

import { IoCalendarOutline } from "react-icons/io5";

export default function DashboardHistory(props) {
  const dataLang = useIntl();
  const lang = useSelector((state) => state.admin.lang);
  const [dateType, setDateType] = useState("date");
  const [dropConfig, setDropConfig] = useState(false);
  const filterchart = useSelector((state) => state.tool.filterchart);
  const filterchartTemp = signal(filterchart);
  const rootDispatch = useDispatch();
  const [configname, setConfigname] = useState(dataLang.formatMessage({ id: "choosePara" }));
  const [exportReport, setExportReport] = useState(false);
  const [datetime_, setDatatime_] = useState(moment(new Date()).format("MM/DD/YYYY"));
  const [d, setD] = useState({
    date: moment(new Date()).format("MM/DD/YYYY"),
    month: moment(new Date()).format("MM/YYYY"),
    year: moment(new Date()).format("YYYY"),
    total: "Tổng",
  });

  const [dataDay, setDataDay] = useState([]);
  const [vDay, setVDay] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vDay2, setVDay2] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vDay3, setVDay3] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vDay4, setVDay4] = useState(dataLang.formatMessage({ id: "unknown" }));

  const [dataMonth, setDataMonth] = useState([]);
  const [vMonth, setVMonth] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vMonth2, setVMonth2] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vMonth3, setVMonth3] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vMonth4, setVMonth4] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vMonth5, setVMonth5] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vMonth6, setVMonth6] = useState(dataLang.formatMessage({ id: "unknown" }));

  const [dataYear, setDataYear] = useState([]);
  const [vYear, setVYear] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vYear2, setVYear2] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vYear3, setVYear3] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vYear4, setVYear4] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vYear5, setVYear5] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vYear6, setVYear6] = useState(dataLang.formatMessage({ id: "unknown" }));

  const [dataTotal, setDataTotal] = useState([]);
  const [vTotal, setVTotal] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vTotal2, setVTotal2] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vTotal3, setVTotal3] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vTotal4, setVTotal4] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vTotal5, setVTotal5] = useState(dataLang.formatMessage({ id: "unknown" }));
  const [vTotal6, setVTotal6] = useState(dataLang.formatMessage({ id: "unknown" }));

  const [month, setMonth] = useState({
    pro_month: 0,
  });

  const color = {
    cur: COLOR.value.PrimaryColor,
    pre: COLOR.value.grayText,
  };

  const handleDate = (e) => {
    var id = e.currentTarget.id;
    setDropConfig(false);
    setDateType(id);
  };

  const handleChart = (date) => {
    if (dateType === "date") {
      setDatatime_(moment(date).format("MM/DD/YYYY"));
      setD({ ...d, date: moment(date).format("DD/MM/YYYY") });
      const getDaily = async () => {
        const d = await callApi("post", host.DATA + "/getChart", {
          plantid: projectData.value.plantid_,
          date: moment(date).format("MM/DD/YYYY"),
        });
        setDataDay([]);
        let x = [];
        if (d.status) {
          let vDay_ = dataLang.formatMessage({ id: "productionData" });
          let vDay2_ = dataLang.formatMessage({ id: "gridData" });
          let vDay3_ = dataLang.formatMessage({ id: "consumptionData" });
          let vDay4_ = dataLang.formatMessage({ id: "batteryData" });
          d.data.data.map((item) => {
            let arr = item.time.split(":");
            x = [
              ...x,
              {
                time: `${arr[0]}:${arr[1]}`,
                [vDay_]: item.value,
                [vDay2_]: item.value2,
                [vDay3_]: item.value3,
                [vDay4_]: item.value4,
              },
            ];
          });
          for (let i = x.length; i < 287; i++) {
            if (
              moment(x[x.length - 1].time, "HH:mm") < moment("23:55", "HH:mm")
            ) {
              let nextTime = moment(x[x.length - 1].time, "HH:mm")
                .add(5, "minutes")
                .format("HH:mm");
              x.push({
                time: nextTime,
                [vDay_]: 0,
                [vDay2_]: 0,
                [vDay3_]: 0,
                [vDay4_]: 0,
              });
            }
          }
          setDataDay(x);
          setVDay(dataLang.formatMessage({ id: "productionData" }));
          setVDay2(dataLang.formatMessage({ id: "consumptionData" }));
          setVDay3(dataLang.formatMessage({ id: "gridData" }));
          setVDay4(dataLang.formatMessage({ id: "batteryData" }));
        } else {
          setDataDay([]);
          setVDay(dataLang.formatMessage({ id: "unknown" }));
          setVDay2(dataLang.formatMessage({ id: "unknown" }));
          setVDay3(dataLang.formatMessage({ id: "unknown" }));
          setVDay4(dataLang.formatMessage({ id: "unknown" }));
        }
      };

      getDaily();
    } else if (dateType === "month") {
      setDatatime_(moment(date).format("MM/YYYY"));
      setD({ ...d, month: moment(date).format("MM/YYYY") });

      const getMonth = async () => {
        const d = await callApi("post", host.DATA + "/getMonthChart", {
          plantid: projectData.value.plantid_,
          month: moment(date).format("MM/YYYY"),
        });
        if (d.status) {
          let vMonth = dataLang.formatMessage({ id: "dailyproduction" });
          let vMonth2 = dataLang.formatMessage({ id: "dailyconsumption" });
          let vMonth3 = dataLang.formatMessage({ id: "dailygridin" });
          let vMonth4 = dataLang.formatMessage({ id: "dailygridout" });
          let vMonth5 = dataLang.formatMessage({ id: "dailybatteryin" });
          let vMonth6 = dataLang.formatMessage({ id: "dailybatteryout" });
          let arr = moment(date).format("MM/YYYY").split("/");
          const daysInMonth = new Date(arr[1], arr[0], 0).getDate();
          let datamonth_ = [];
          for (let i = 1; i <= daysInMonth; i++) {
            datamonth_ = [
              ...datamonth_,
              { date: i < 10 ? `0${i}` : `${i}`, [vMonth]: 0 },
            ];
          }
          let sum_month = [];
          let sum_month2 = [];
          let sum_month3 = [];
          let sum_month4 = [];
          let sum_month5 = [];
          let sum_month6 = [];
          d.data.data.map((item, i) => {
            let index = datamonth_.findIndex((d) => d.date == item.date);
            datamonth_[index][vMonth] = item.value;
            datamonth_[index][vMonth2] = item.value2;
            datamonth_[index][vMonth3] = item.value3;
            datamonth_[index][vMonth4] = item.value4;
            datamonth_[index][vMonth5] = item.value5;
            datamonth_[index][vMonth6] = item.value6;
            sum_month[i] = item.value;
            sum_month2[i] = item.value2;
            sum_month3[i] = item.value3;
            sum_month4[i] = item.value4;
            sum_month5[i] = item.value5;
            sum_month6[i] = item.value6;
            // }

            if (i == d.data.data.length - 1) {
              rootDispatch(
                toolslice.actions.setmonth({
                  pro_month: parseFloat(
                    sum_month.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  con_month: parseFloat(
                    sum_month2.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  grid_in_month: parseFloat(
                    sum_month3.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  grid_out_month: parseFloat(
                    sum_month4.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  bat_in_month: parseFloat(
                    sum_month5.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  bat_out_month: parseFloat(
                    sum_month6.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                })
              );
              // }
            }
          });
          setVMonth(vMonth);
          setVMonth2(vMonth2);
          setVMonth3(vMonth3);
          setVMonth4(vMonth4);
          setVMonth5(vMonth5);
          setVMonth6(vMonth6);
          setDataMonth(datamonth_);
        } else {
          setDataMonth([]);
          setVMonth(dataLang.formatMessage({ id: "unknown" }));
          setVMonth2(dataLang.formatMessage({ id: "unknown" }));
          setVMonth3(dataLang.formatMessage({ id: "unknown" }));
          setVMonth4(dataLang.formatMessage({ id: "unknown" }));
          setVMonth5(dataLang.formatMessage({ id: "unknown" }));
          setVMonth6(dataLang.formatMessage({ id: "unknown" }));
        }
      };
      getMonth();
    } else if (dateType === "year") {
      setDatatime_(moment(date).format("YYYY"));
      setD({ ...d, year: moment(date).format("YYYY") });

      const getYear = async () => {
        const d = await callApi("post", host.DATA + "/getYearChart", {
          plantid: projectData.value.plantid_,
          year: moment(date).format("YYYY"),
        });

        if (d.status) {
          let vYear = dataLang.formatMessage({ id: "monthlyproduction" });
          let vYear2 = dataLang.formatMessage({ id: "monthlyconsumption" });
          let vYear3 = dataLang.formatMessage({ id: "monthlygridin" });
          let vYear4 = dataLang.formatMessage({ id: "monthlygridout" });
          let vYear5 = dataLang.formatMessage({ id: "monthlybatteryin" });
          let vYear6 = dataLang.formatMessage({ id: "monthlybatteryout" });
          let sum_year = [];
          let sum_year2 = [];
          let sum_year3 = [];
          let sum_year4 = [];
          let sum_year5 = [];
          let sum_year6 = [];
          let datayear_ = [];
          for (let i = 1; i <= 12; i++) {
            datayear_ = [
              ...datayear_,
              {
                month: i < 10 ? `0${i}` : `${i}`,
                [vYear]: 0,
                [vYear2]: 0,
                [vYear3]: 0,
                [vYear4]: 0,
                [vYear5]: 0,
                [vYear6]: 0,
              },
            ];
          }
          d.data.data.map((item, i) => {
            let index = datayear_.findIndex((d) => d.month == item.month);
            datayear_[index][vYear] = item.value;
            datayear_[index][vYear2] = item.value2;
            datayear_[index][vYear3] = item.value3;
            datayear_[index][vYear4] = item.value4;
            datayear_[index][vYear5] = item.value5;
            datayear_[index][vYear6] = item.value6;
            sum_year[i] = item.value;
            sum_year2[i] = item.value2;
            sum_year3[i] = item.value3;
            sum_year4[i] = item.value4;
            sum_year5[i] = item.value5;
            sum_year6[i] = item.value6;
            if (i == d.data.data.length - 1) {
              rootDispatch(
                toolslice.actions.setyear({
                  pro_year: parseFloat(
                    sum_year.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  con_year: parseFloat(
                    sum_year2.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  grid_in_year: parseFloat(
                    sum_year3.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  grid_out_year: parseFloat(
                    sum_year4.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  bat_in_year: parseFloat(
                    sum_year5.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                  bat_out_year: parseFloat(
                    sum_year6.reduce((a, b) => Number(a) + Number(b), 0)
                  ).toFixed(2),
                })
              );
            }
          });
          setVYear(vYear);
          setVYear2(vYear2);
          setVYear3(vYear3);
          setVYear4(vYear4);
          setVYear5(vYear5);
          setVYear6(vYear6);
          setDataYear(datayear_);
        } else {
          setDataYear([]);
          setVYear(dataLang.formatMessage({ id: "unknown" }));
          setVYear2(dataLang.formatMessage({ id: "unknown" }));
          setVYear3(dataLang.formatMessage({ id: "unknown" }));
          setVYear4(dataLang.formatMessage({ id: "unknown" }));
          setVYear5(dataLang.formatMessage({ id: "unknown" }));
          setVYear6(dataLang.formatMessage({ id: "unknown" }));
        }
      };
      getYear();
    }
  };

  const handleShowConfig = (e) => {
    if (configname === dataLang.formatMessage({ id: "choosePara" })) {
      setConfigname(dataLang.formatMessage({ id: "minimize" }));
    } else if (configname === dataLang.formatMessage({ id: "minimize" })) {
      setConfigname(dataLang.formatMessage({ id: "choosePara" }));
    }
  };

  const handleExport = () => {
    setExportReport(true);
  };

  const handleClose = () => {
    setExportReport(false);
  };

  const handlefilterchart = (e) => {
    const state = e.currentTarget.checked;
    const chartfield = e.currentTarget.id.split("_");
    // temp[chartfield[1]][dateType][chartfield[0]] = state;
    filterchartTemp.value = {
      ...filterchartTemp.value,
      [chartfield[1]]: {
        ...filterchartTemp.value[chartfield[1]],
        [dateType]: {
          ...filterchartTemp.value[chartfield[1]][dateType],
          [chartfield[0]]: state,
        },
      },
    };
  };

  const handleConfirmChart = (e) => {
    rootDispatch(toolslice.actions.setFilterchart(filterchartTemp.value));
  };

  const Checkboxfilter = (props) => {
    return (
      <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
        <tbody>
          <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
            <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
              {dataLang.formatMessage({
                id: "production",
              })}
            </th>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"productionData_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType]
                      .productionData
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label
                  htmlFor={"productionData_" + projectData.value.plantmode}
                >
                  {dataLang.formatMessage({
                    id: "production",
                  })}
                </label>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
            <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
              {dataLang.formatMessage({
                id: "consumption",
              })}
            </th>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"consumptionData_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType]
                      .consumptionData
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label
                  htmlFor={"consumptionData_" + projectData.value.plantmode}
                >
                  {dataLang.formatMessage({
                    id: "consumption",
                  })}
                </label>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
            <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
              {dataLang.formatMessage({
                id: "grid",
              })}
            </th>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"dailygridin_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType]
                      .dailygridin
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label htmlFor={"dailygridin_" + projectData.value.plantmode}>
                  {dataLang.formatMessage({
                    id: "gridfeed",
                  })}
                </label>
              </div>
            </td>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"dailygridout_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType]
                      .dailygridout
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label htmlFor={"dailygridout_" + projectData.value.plantmode}>
                  {dataLang.formatMessage({
                    id: "purchaseE",
                  })}
                </label>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
            <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
              {dataLang.formatMessage({
                id: "batteryData",
              })}
            </th>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"charge_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType].charge
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label htmlFor={"charge_" + projectData.value.plantmode}>
                  {dataLang.formatMessage({
                    id: "charge",
                  })}
                </label>
              </div>
            </td>
            <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                <input
                  id={"discharge_" + projectData.value.plantmode}
                  type="checkbox"
                  defaultChecked={
                    filterchart[projectData.value.plantmode][dateType].discharge
                  }
                  onChange={(e) => {
                    handlefilterchart(e);
                  }}
                />
                <label htmlFor={"discharge_" + projectData.value.plantmode}>
                  {dataLang.formatMessage({
                    id: "discharge",
                  })}
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    let d = document.getElementById("datepicker");
    let v = d.querySelector("span");
    setDatatime_(v.innerHTML);
  }, [dateType]);

  useEffect(() => {
    // data Day
    const getDaily = async () => {
      const d = await callApi("post", host.DATA + "/getChart", {
        plantid: projectData.value.plantid_,
        date: moment(new Date()).format("MM/DD/YYYY"),
      });
      setDataDay([]);
      let x = [];
      if (d.status) {
        let vDay_ = dataLang.formatMessage({ id: "productionData" });
        let vDay2_ = dataLang.formatMessage({ id: "gridData" });
        let vDay3_ = dataLang.formatMessage({ id: "consumptionData" });
        let vDay4_ = dataLang.formatMessage({ id: "batteryData" });
        d.data.data.map((item) => {
          let arr = item.time.split(":");
          x = [
            ...x,
            {
              time: `${arr[0]}:${arr[1]}`,
              [vDay_]: item.value,
              [vDay2_]: item.value2,
              [vDay3_]: item.value3,
              [vDay4_]: item.value4,
            },
          ];
        });

        for (let i = x.length; i < 287; i++) {
          if (
            moment(x[x.length - 1].time, "HH:mm") < moment("23:55", "HH:mm")
          ) {
            let nextTime = moment(x[x.length - 1].time, "HH:mm")
              .add(5, "minutes")
              .format("HH:mm");
            x.push({
              time: nextTime,
              [vDay_]: 0,
              [vDay2_]: 0,
              [vDay3_]: 0,
              [vDay4_]: 0,
            });
          }
        }
        setDataDay(x);
        setVDay(dataLang.formatMessage({ id: "productionData" }));
        setVDay2(dataLang.formatMessage({ id: "consumptionData" }));
        setVDay3(dataLang.formatMessage({ id: "gridData" }));
        setVDay4(dataLang.formatMessage({ id: "batteryData" }));
      } else {
        setDataDay([]);
        setVDay(dataLang.formatMessage({ id: "unknown" }));
        setVDay2(dataLang.formatMessage({ id: "unknown" }));
        setVDay3(dataLang.formatMessage({ id: "unknown" }));
        setVDay4(dataLang.formatMessage({ id: "unknown" }));
      }
    };
    getDaily();

    //data Month
    const getMonth = async () => {
      const d = await callApi("post", host.DATA + "/getMonthChart", {
        plantid: projectData.value.plantid_,
        month: moment(new Date()).format("MM/YYYY"),
      });
      if (d.status) {
        let vMonth = dataLang.formatMessage({ id: "dailyproduction" });
        let vMonth2 = dataLang.formatMessage({ id: "dailyconsumption" });
        let vMonth3 = dataLang.formatMessage({ id: "dailygridin" });
        let vMonth4 = dataLang.formatMessage({ id: "dailygridout" });
        let vMonth5 = dataLang.formatMessage({ id: "dailybatteryin" });
        let vMonth6 = dataLang.formatMessage({ id: "dailybatteryout" });
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
        const currentYear = currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        let datamonth_ = [];
        for (let i = 1; i <= daysInMonth; i++) {
          datamonth_ = [
            ...datamonth_,
            { date: i < 10 ? `0${i}` : `${i}`, [vMonth]: 0 },
          ];
        }
        let sum_month = [];
        let sum_month2 = [];
        let sum_month3 = [];
        let sum_month4 = [];
        let sum_month5 = [];
        let sum_month6 = [];
        d.data.data.map((item, i) => {
          let index = datamonth_.findIndex((d) => d.date == item.date);
          datamonth_[index][vMonth] = item.value;
          datamonth_[index][vMonth2] = item.value2;
          datamonth_[index][vMonth3] = item.value3;
          datamonth_[index][vMonth4] = item.value4;
          datamonth_[index][vMonth5] = item.value5;
          datamonth_[index][vMonth6] = item.value6;
          sum_month[i] = item?.value || 0;
          sum_month2[i] = item?.value2 || 0;
          sum_month3[i] = item?.value3 || 0;
          sum_month4[i] = item?.value4 || 0;
          sum_month5[i] = item?.value5 || 0;
          sum_month6[i] = item?.value6 || 0;

          if (i == d.data.data.length - 1) {
            rootDispatch(
              toolslice.actions.setmonth({
                pro_month: parseFloat(
                  sum_month.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                con_month: parseFloat(
                  sum_month2.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_in_month: parseFloat(
                  sum_month3.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_out_month: parseFloat(
                  sum_month4.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_in_month: parseFloat(
                  sum_month5.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_out_month: parseFloat(
                  sum_month6.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
              })
            );
          }
        });
        setVMonth(vMonth);
        setVMonth2(vMonth2);
        setVMonth3(vMonth3);
        setVMonth4(vMonth4);
        setVMonth5(vMonth5);
        setVMonth6(vMonth6);
        setDataMonth(datamonth_);
      } else {
        setDataMonth([]);
        setVMonth(dataLang.formatMessage({ id: "unknown" }));
        setVMonth2(dataLang.formatMessage({ id: "unknown" }));
        setVMonth3(dataLang.formatMessage({ id: "unknown" }));
        setVMonth4(dataLang.formatMessage({ id: "unknown" }));
        setVMonth5(dataLang.formatMessage({ id: "unknown" }));
        setVMonth6(dataLang.formatMessage({ id: "unknown" }));
      }
    };
    getMonth();

    //data Year
    const getYear = async () => {
      const d = await callApi("post", host.DATA + "/getYearChart", {
        plantid: projectData.value.plantid_,
        year: moment(new Date()).format("YYYY"),
      });
      if (d.status) {
        let vYear = dataLang.formatMessage({ id: "monthlyproduction" });
        let vYear2 = dataLang.formatMessage({ id: "monthlyconsumption" });
        let vYear3 = dataLang.formatMessage({ id: "monthlygridin" });
        let vYear4 = dataLang.formatMessage({ id: "monthlygridout" });
        let vYear5 = dataLang.formatMessage({ id: "monthlybatteryin" });
        let vYear6 = dataLang.formatMessage({ id: "monthlybatteryout" });
        let sum_year = [];
        let sum_year2 = [];
        let sum_year3 = [];
        let sum_year4 = [];
        let sum_year5 = [];
        let sum_year6 = [];
        let datayear_ = [];
        for (let i = 1; i <= 12; i++) {
          datayear_ = [
            ...datayear_,
            {
              month: i < 10 ? `0${i}` : `${i}`,
              [vYear]: 0,
              [vYear2]: 0,
              [vYear3]: 0,
              [vYear4]: 0,
              [vYear5]: 0,
              [vYear6]: 0,
            },
          ];
        }
        d.data.data.map((item, i) => {
          let index = datayear_.findIndex((d) => d.month == item.month);
          datayear_[index][vYear] = item.value;
          datayear_[index][vYear2] = item.value2;
          datayear_[index][vYear3] = item.value3;
          datayear_[index][vYear4] = item.value4;
          datayear_[index][vYear5] = item.value5;
          datayear_[index][vYear6] = item.value6;
          sum_year[i] = item?.value || 0;
          sum_year2[i] = item?.value2 || 0;
          sum_year3[i] = item?.value3 || 0;
          sum_year4[i] = item?.value4 || 0;
          sum_year5[i] = item?.value5 || 0;
          sum_year6[i] = item?.value6 || 0;
          if (i == d.data.data.length - 1) {
            rootDispatch(
              toolslice.actions.setyear({
                pro_year: parseFloat(
                  sum_year.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                con_year: parseFloat(
                  sum_year2.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_in_year: parseFloat(
                  sum_year3.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_out_year: parseFloat(
                  sum_year4.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_in_year: parseFloat(
                  sum_year5.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_out_year: parseFloat(
                  sum_year6.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
              })
            );
          }
        });
        setVYear(vYear);
        setVYear2(vYear2);
        setVYear3(vYear3);
        setVYear4(vYear4);
        setVYear5(vYear5);
        setVYear6(vYear6);
        setDataYear(datayear_);
      } else {
        setDataYear([]);
        setVYear(dataLang.formatMessage({ id: "unknown" }));
        setVYear2(dataLang.formatMessage({ id: "unknown" }));
        setVYear3(dataLang.formatMessage({ id: "unknown" }));
        setVYear4(dataLang.formatMessage({ id: "unknown" }));
        setVYear5(dataLang.formatMessage({ id: "unknown" }));
        setVYear6(dataLang.formatMessage({ id: "unknown" }));
      }
    };
    getYear();

    //data Total
    const getTotal = async () => {
      const d = await callApi("post", host.DATA + "/getTotalChart", {
        plantid: projectData.value.plantid_,
      });
      setDataTotal([]);
      if (d.status) {
        let vTotal = dataLang.formatMessage({ id: "yearproduction" });
        let vTotal2 = dataLang.formatMessage({ id: "yearconsumption" });
        let vTotal3 = dataLang.formatMessage({ id: "yeargridin" });
        let vTotal4 = dataLang.formatMessage({ id: "yeargridout" });
        let vTotal5 = dataLang.formatMessage({ id: "yearbatteryin" });
        let vTotal6 = dataLang.formatMessage({ id: "yearbatteryout" });

        let sum_total = [];
        let sum_total2 = [];
        let sum_total3 = [];
        let sum_total4 = [];
        let sum_total5 = [];
        let sum_total6 = [];
        d.data.data.map((item, i) => {
          setDataTotal((old) => [
            ...old,
            {
              year: item.year,
              [vTotal]: item.value,
              [vTotal2]: item.value2,
              [vTotal3]: item.value3,
              [vTotal4]: item.value4,
              [vTotal5]: item.value5,
              [vTotal6]: item.value6,
            },
          ]);
          sum_total[i] = item?.value || 0;
          sum_total2[i] = item?.value2 || 0;
          sum_total3[i] = item?.value3 || 0;
          sum_total4[i] = item?.value4 || 0;
          sum_total5[i] = item?.value5 || 0;
          sum_total6[i] = item?.value6 || 0;
          if (i == d.data.data.length - 1) {
            rootDispatch(
              toolslice.actions.settotal({
                pro_total: parseFloat(
                  sum_total.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                con_total: parseFloat(
                  sum_total2.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_in_total: parseFloat(
                  sum_total3.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                grid_out_total: parseFloat(
                  sum_total4.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_in_total: parseFloat(
                  sum_total5.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
                bat_out_total: parseFloat(
                  sum_total6.reduce((a, b) => Number(a) + Number(b), 0)
                ).toFixed(2),
              })
            );
          }
        });
        setVTotal(vTotal);
        setVTotal2(vTotal2);
        setVTotal3(vTotal3);
        setVTotal4(vTotal4);
        setVTotal5(vTotal5);
        setVTotal6(vTotal6);
      } else {
        setVTotal(dataLang.formatMessage({ id: "unknown" }));
        setVTotal2(dataLang.formatMessage({ id: "unknown" }));
        setVTotal3(dataLang.formatMessage({ id: "unknown" }));
        setVTotal4(dataLang.formatMessage({ id: "unknown" }));
        setVTotal5(dataLang.formatMessage({ id: "unknown" }));
        setVTotal6(dataLang.formatMessage({ id: "unknown" }));
        setDataYear([]);
      }
    };
    getTotal();

    return () => {
      rootDispatch(toolslice.actions.setmonth({ pro_month: 0, con_month: 0, grid_in_month: 0, grid_out_month: 0, bat_in_month: 0, bat_out_month: 0 }));
      rootDispatch(toolslice.actions.setyear({ pro_year: 0, con_year: 0, grid_in_year: 0, grid_out_year: 0, bat_in_year: 0, bat_out_year: 0 }));
      rootDispatch(toolslice.actions.settotal({ pro_total: 0, con_total: 0, grid_in_total: 0, grid_out_total: 0, bat_in_total: 0, bat_out_total: 0 }));
    };
    // eslint-disable-next-line
  }, [lang]);

  return (
    <>
      <div className="DAT_ProjectData_Dashboard_History">
        <div className="DAT_ProjectData_Dashboard_History_Tit">
          <div className="DAT_ProjectData_Dashboard_History_Tit_Left">
            {dataLang.formatMessage({ id: "history" })}
          </div>

          <div className="DAT_ProjectData_Dashboard_History_Tit_Right">
            <div className="DAT_ProjectData_Dashboard_History_Tit_Right_Date">
              <div
                className="DAT_ProjectData_Dashboard_History_Tit_Right_Date_Item"
                id="date"
                style={{
                  borderRight: "solid 1px rgb(199, 199, 199)",
                  color: dateType === "date" ? color.cur : color.pre,
                }}
                onClick={(e) => handleDate(e)}
              >
                {dataLang.formatMessage({ id: "day" })}
              </div>
              <div
                className="DAT_ProjectData_Dashboard_History_Tit_Right_Date_Item"
                id="month"
                style={{
                  borderRight: "solid 1px rgb(199, 199, 199)",
                  color: dateType === "month" ? color.cur : color.pre,
                }}
                onClick={(e) => handleDate(e)}
              >
                {dataLang.formatMessage({ id: "month" })}
              </div>
              <div
                className="DAT_ProjectData_Dashboard_History_Tit_Right_Date_Item"
                id="year"
                style={{
                  borderRight: "solid 1px rgb(199, 199, 199)",
                  color: dateType === "year" ? color.cur : color.pre,
                }}
                onClick={(e) => handleDate(e)}
              >
                {dataLang.formatMessage({ id: "year" })}
              </div>
              <div
                className="DAT_ProjectData_Dashboard_History_Tit_Right_Date_Item"
                id="total"
                style={{
                  color: dateType === "total" ? color.cur : color.pre,
                }}
                onClick={(e) => handleDate(e)}
              >
                {dataLang.formatMessage({ id: "total" })}
              </div>
            </div>

            <div className="DAT_ProjectData_Dashboard_History_Tit_Right_Config">
              <button
                onClick={(e) => {
                  handleShowConfig(e);
                  setDropConfig(!dropConfig);
                }}
              >
                {configname}
              </button>
            </div>

            <div className="DAT_ProjectData_Dashboard_History_Tit_Right_Export">
              <button onClick={(e) => handleExport(e)}>
                {dataLang.formatMessage({ id: "export" })}
              </button>
            </div>

            <DatePicker
              id="datepicker"
              onChange={(date) => handleChart(date)}
              showMonthYearPicker={dateType === "date" ? false : true}
              showYearPicker={
                dateType === "date" || dateType === "month" ? false : true
              }
              disabled={dateType === "total" ? true : false}
              customInput={
                <button className="DAT_CustomPicker">
                  <span>{d[dateType]}</span>
                  <IoCalendarOutline color="gray" />
                </button>
              }
            />
          </div>
        </div>

        {(() => {
          switch (dateType) {
            case "date":
              return (
                <Day
                  data={dataDay}
                  dateType={dateType}
                  v={vDay}
                  v2={vDay2}
                  v3={vDay3}
                  v4={vDay4}
                />
              );
            case "month":
              return (
                <Month
                  data={dataMonth}
                  month={month}
                  dateType={dateType}
                  v={vMonth}
                  v2={vMonth2}
                  v3={vMonth3}
                  v4={vMonth4}
                  v5={vMonth5}
                  v6={vMonth6}
                />
              );
            case "year":
              return (
                <Year
                  data={dataYear}
                  dateType={dateType}
                  v={vYear}
                  v2={vYear2}
                  v3={vYear3}
                  v4={vYear4}
                  v5={vYear5}
                  v6={vYear6}
                />
              );
            case "total":
              return (
                <Total
                  data={dataTotal}
                  dateType={dateType}
                  v={vTotal}
                  v2={vTotal2}
                  v3={vTotal3}
                  v4={vTotal4}
                  v5={vTotal5}
                  v6={vTotal6}
                />
              );
            default:
              <></>;
          }
        })()}

        <div className="DAT_ProjectData_Dashboard_History_SubConfig"
          style={{
            height: dropConfig ? "calc(100vh - 180px)" : "0px",
            transition: "0.5s",
          }}
        >
          {dropConfig ? (
            <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown"
              style={{
                height: dropConfig ? "auto" : "0px",
                transition: "0.5s",
              }}
            >
              <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item">
                {(() => {
                  switch (projectData.value.plantmode) {
                    case "consumption":
                      // return (
                      //   <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
                      //     <tbody>
                      //       <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                      //         <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                      //           {dataLang.formatMessage({
                      //             id: "production",
                      //           })}
                      //         </th>
                      //         <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                      //           <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                      //             <input
                      //               id={
                      //                 "productionData_" +
                      //                 projectData.value.plantmode
                      //               }
                      //               type="checkbox"
                      //               defaultChecked={
                      //                 filterchart[
                      //                   projectData.value.plantmode
                      //                 ][dateType].production
                      //               }
                      //               onChange={(e) => {
                      //                 handlefilterchart(e);
                      //               }}
                      //             />
                      //             <label
                      //               htmlFor={
                      //                 "productionData_" +
                      //                 projectData.value.plantmode
                      //               }
                      //             >
                      //               {dataLang.formatMessage({
                      //                 id: "production",
                      //               })}
                      //             </label>
                      //           </div>
                      //         </td>
                      //       </tr>
                      //     </tbody>

                      //     <tbody>
                      //       <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                      //         <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                      //           {dataLang.formatMessage({
                      //             id: "consumption",
                      //           })}
                      //         </th>
                      //         <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                      //           <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                      //             <input
                      //               id={
                      //                 "consumptionData_" +
                      //                 projectData.value.plantmode
                      //               }
                      //               type="checkbox"
                      //               defaultChecked={
                      //                 filterchart[
                      //                   projectData.value.plantmode
                      //                 ][dateType].consumption
                      //               }
                      //               onChange={(e) => {
                      //                 handlefilterchart(e);
                      //               }}
                      //             />
                      //             <label
                      //               htmlFor={
                      //                 "consumptionData_" +
                      //                 projectData.value.plantmode
                      //               }
                      //             >
                      //               {dataLang.formatMessage({
                      //                 id: "consumption",
                      //               })}
                      //             </label>
                      //           </div>
                      //         </td>
                      //       </tr>
                      //     </tbody>

                      //     <tbody>
                      //       <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                      //         <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                      //           {dataLang.formatMessage({
                      //             id: "grid",
                      //           })}
                      //         </th>
                      //         <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                      //           <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                      //             <input
                      //               id={
                      //                 "dailygridin_" +
                      //                 projectData.value.plantmode
                      //               }
                      //               type="checkbox"
                      //               defaultChecked={
                      //                 filterchart[
                      //                   projectData.value.plantmode
                      //                 ][dateType].gridfeed
                      //               }
                      //               onChange={(e) => {
                      //                 handlefilterchart(e);
                      //               }}
                      //             />
                      //             <label
                      //               htmlFor={
                      //                 "dailygridin_" +
                      //                 projectData.value.plantmode
                      //               }
                      //             >
                      //               {dataLang.formatMessage({
                      //                 id: "gridfeed",
                      //               })}
                      //             </label>
                      //           </div>
                      //         </td>
                      //         <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                      //           <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                      //             <input
                      //               id={
                      //                 "dailygridout_" +
                      //                 projectData.value.plantmode
                      //               }
                      //               type="checkbox"
                      //               defaultChecked={
                      //                 filterchart[
                      //                   projectData.value.plantmode
                      //                 ][dateType].purchasee
                      //               }
                      //               onChange={(e) => {
                      //                 handlefilterchart(e);
                      //               }}
                      //             />
                      //             <label
                      //               htmlFor={
                      //                 "dailygridout_" +
                      //                 projectData.value.plantmode
                      //               }
                      //             >
                      //               {dataLang.formatMessage({
                      //                 id: "purchaseE",
                      //               })}
                      //             </label>
                      //           </div>
                      //         </td>
                      //       </tr>
                      //     </tbody>
                      //   </table>
                      // );
                      switch (dateType) {
                        case "date":
                          return (
                            <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "production",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "productionData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].productionData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "productionData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "production",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "consumption",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "consumptionData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].consumptionData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "consumptionData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "consumption",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "grid",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "gridData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].gridData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "gridData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "grid",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              {/* <tbody>
                                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                                {dataLang.formatMessage({
                                                  id: "batteryData",
                                                })}
                                              </th>
                                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                                  <input
                                                    id={
                                                      "batteryData_" +
                                                      projectData.value
                                                        .plantmode
                                                    }
                                                    type="checkbox"
                                                    defaultChecked={
                                                      filterchart[
                                                        projectData.value
                                                          .plantmode
                                                      ][dateType].batteryData
                                                    }
                                                    onChange={(e) => {
                                                      handlefilterchart(e);
                                                    }}
                                                  />
                                                  <label
                                                    htmlFor={
                                                      "batteryData_" +
                                                      projectData.value
                                                        .plantmode
                                                    }
                                                  >
                                                    {dataLang.formatMessage({
                                                      id: "batteryData",
                                                    })}
                                                  </label>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody> */}
                            </table>
                          );
                        case "month":
                          return <Checkboxfilter></Checkboxfilter>;
                        case "year":
                          return <Checkboxfilter></Checkboxfilter>;
                        case "total":
                          return <Checkboxfilter></Checkboxfilter>;
                        default:
                          return <></>;
                      }
                    case "hybrid":
                      switch (dateType) {
                        case "date":
                          return (
                            <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "production",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "productionData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].productionData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "productionData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "production",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "consumption",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "consumptionData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].consumptionData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "consumptionData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "consumption",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "grid",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "gridData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].gridData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "gridData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "grid",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>

                              <tbody>
                                <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                                  <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                    {dataLang.formatMessage({
                                      id: "batteryData",
                                    })}
                                  </th>
                                  <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                    <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                      <input
                                        id={
                                          "batteryData_" +
                                          projectData.value.plantmode
                                        }
                                        type="checkbox"
                                        defaultChecked={
                                          filterchart[
                                            projectData.value.plantmode
                                          ][dateType].batteryData
                                        }
                                        onChange={(e) => {
                                          handlefilterchart(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={
                                          "batteryData_" +
                                          projectData.value.plantmode
                                        }
                                      >
                                        {dataLang.formatMessage({
                                          id: "batteryData",
                                        })}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          );
                        case "month":
                          return <Checkboxfilter></Checkboxfilter>;
                        case "year":
                          return <Checkboxfilter></Checkboxfilter>;
                        case "total":
                          return <Checkboxfilter></Checkboxfilter>;
                        default:
                          return <></>;
                      }
                    case "ESS":
                      return (
                        <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
                          <tbody>
                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                {dataLang.formatMessage({
                                  id: "production",
                                })}
                              </th>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "productionData_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].production
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "productionData_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "production",
                                    })}
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                {dataLang.formatMessage({
                                  id: "consumption",
                                })}
                              </th>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "consumptionData_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].consumption
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "consumptionData_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "consumption",
                                    })}
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                {dataLang.formatMessage({
                                  id: "grid",
                                })}
                              </th>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={"grid_" + projectData.value.plantmode}
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].grid
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "grid_" + projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "grid",
                                    })}
                                  </label>
                                </div>
                              </td>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "dailygridin_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].gridfeed
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "dailygridin_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "gridfeed",
                                    })}
                                  </label>
                                </div>
                              </td>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "dailygridout_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].purchasee
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "dailygridout_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "purchaseE",
                                    })}
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>

                          <tbody>
                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                {dataLang.formatMessage({
                                  id: "batteryData",
                                })}
                              </th>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "batteryData_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].batterydata
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "batteryData_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "batteryData",
                                    })}
                                  </label>
                                </div>
                              </td>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={"charge_" + projectData.value.plantmode}
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].charge
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "charge_" + projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "charge",
                                    })}
                                  </label>
                                </div>
                              </td>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "discharge_" + projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].discharge
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "discharge_" + projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "discharge",
                                    })}
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      );
                    default:
                      return (
                        <table className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table">
                          <tbody>
                            <tr className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr">
                              <th className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Th">
                                {dataLang.formatMessage({
                                  id: "production",
                                })}
                              </th>
                              <td className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td">
                                <div className="DAT_ProjectData_Dashboard_History_SubConfig_Dropdown_Item_Table_Tr_Td_Checkbox">
                                  <input
                                    id={
                                      "productionData_" +
                                      projectData.value.plantmode
                                    }
                                    type="checkbox"
                                    defaultChecked={
                                      filterchart[projectData.value.plantmode][
                                        dateType
                                      ].productionData
                                    }
                                    onChange={(e) => {
                                      handlefilterchart(e);
                                    }}
                                  />
                                  <label
                                    htmlFor={
                                      "productionData_" +
                                      projectData.value.plantmode
                                    }
                                  >
                                    {dataLang.formatMessage({
                                      id: "production",
                                    })}
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      );
                  }
                })()}
              </div>

              <div className="DAT_Filter_Dropdown_Bot">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  onClick={(e) => {
                    handleShowConfig(e);
                    setDropConfig(!dropConfig);
                    filterchartTemp.value = filterchart;
                  }}
                >
                  {dataLang.formatMessage({ id: "cancel" })}
                </button>
                <button
                  onClick={(e) => {
                    handleShowConfig(e);
                    setDropConfig(!dropConfig);
                    handleConfirmChart(e);
                  }}
                  style={{
                    backgroundColor: COLOR.value.PrimaryColor,
                    color: "white",
                  }}
                >
                  {dataLang.formatMessage({ id: "confirm" })}
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {exportReport ? (
        <div
          className="DAT_PopupBG"
          style={{
            height: exportReport === "default" ? "0px" : "100vh",
          }}
        >
          <ExportData
            handleClose={handleClose}
            typereport={dateType}
            plant={projectData.value}
            datetime={datetime_}
          />
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}
