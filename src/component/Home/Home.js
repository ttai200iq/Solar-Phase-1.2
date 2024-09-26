import React, { useEffect, useState } from "react";
import "./Home.scss";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment-timezone";
import ProjectData from "../Project/ProjectData";
import { Empty, plantState, projectData, projtab } from "../Project/Project";
import { sidebartab, sidebartabli } from "../Sidenar/Sidenar";
import { useSelector } from "react-redux";
import {
  Token,
  convertUnit,
  partnerInfor,
  showUnit,
  showUnitk,
  userInfor,
  COLOR,
} from "../../App";
import { host } from "../Lang/Contant";
import { callApi } from "../Api/Api";
import { signal } from "@preact/signals-react";
import axios from "axios";
import { useIntl } from "react-intl";
import { coalsave } from "../Project/ProjectData";
import { Loader } from "@googlemaps/js-api-loader";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import PopupState, { bindPopper, bindHover } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DatePicker from "react-datepicker";

import { FaSolarPanel } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { VscDashboard } from "react-icons/vsc";
import { IoCalendarOutline } from "react-icons/io5";
import { isMobile } from "../Navigation/Navigation";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import { size } from "lodash";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const plant = signal([]);
const logger = signal([]);
const usd = signal(24700);

export const isDesktop = signal(true);

const sizedesktop = signal({
  icon: { fontSize: 35 },
  label: { fontSize: 15 },
  value: { fontSize: 26 },
  unit: { fontSize: 18 },
  valuepro: { fontSize: 28 },
  unitpro: { fontSize: 26 },
  boxpro: { fontSize: 150 },
});

export default function Home(props) {
  const usr = useSelector((state) => state.admin.usr);
  const lang = useSelector((state) => state.admin.lang);
  const { isLandscape } = useMobileOrientation();
  const [total, setTotal] = useState(0);
  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const [project, setProject] = useState({});
  const [trial, setTrial] = useState(0);
  const [warn, setWarn] = useState(0);
  const [invt, setInvt] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [production, setProduction] = useState(0);
  const [dailyproduction, setDailyProduction] = useState(0);
  const [monthlyproduction, setMonthlyProduction] = useState(0);
  const [yearlyproduction, setYearlyProduction] = useState(0);
  const [totalproduction, setTotalProduction] = useState(0);
  const dataLang = useIntl();
  const [sun, setSun] = useState([]);
  const [chart, setChart] = useState("year");
  const [datamonth, setDatamonth] = useState([]);
  const [datayear, setDatayear] = useState([]);
  const navigate = useNavigate();
  const [d, setD] = useState({
    month: moment(new Date()).format("MM/YYYY"),
    year: moment(new Date()).format("YYYY"),
  });
  const [per, setPer] = useState(0);
  const in_max = 100;
  const in_min = 0;
  const out_max = 0;
  const [out_min, setOut_min] = useState(145);
  const mapValue = (data, in_min, in_max, out_min, out_max) => {
    return (
      ((data - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };
  const [step, setStep] = useState(0);
  // const [loading, setLoading] = useState(false);

  const keyframes = `
  @keyframes home {
    0% { background-position: -1200px ${parseFloat(
    per
  )}px, -800px ${per}px, -400px ${per}px; }
    100% { background-position: 200px ${parseFloat(
    per
  )}px;, 100x ${per}px, 0px ${per}px; }
  }
`;

  const handleWindowResize = () => {
    let home = document.getElementById("Home");
    // console.log(home.offsetWidth);

    if (home?.offsetWidth >= 1300) {
      // console.log("max");
      sizedesktop.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
      setOut_min(145);
      setStep(4);
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      // console.log("middle");
      sizedesktop.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
      setOut_min(135);
      setStep(4);
    } else {
      // console.log("small");
      sizedesktop.value = {
        icon: { fontSize: 25 },
        label: { fontSize: 11 },
        value: { fontSize: 20 },
        unit: { fontSize: 10 },
        valuepro: { fontSize: 22 },
        unitpro: { fontSize: 20 },
        boxpro: { fontSize: 130 },
      };
      setOut_min(125);
      setStep(4);
    }

    if (home?.offsetWidth > 900) {
      isDesktop.value = true;
    } else {
      isDesktop.value = false;
      initMap(plant.value);
    }

    // else {
    //   console.log("min");
    //   sizedesktop.value = {
    //     icon: { fontSize: 25 },
    //     label: { fontSize: 11 },
    //     value: { fontSize: 20 },
    //     unit: { fontSize: 12 },
    //   };
    // }
  };

  useEffect(function () {
    let home = document.getElementById("Home");
    // console.log(home.offsetWidth);

    if (home?.offsetWidth >= 1300) {
      // console.log("max");
      sizedesktop.value = {
        icon: { fontSize: 35 },
        label: { fontSize: 15 },
        value: { fontSize: 26 },
        unit: { fontSize: 18 },
        valuepro: { fontSize: 28 },
        unitpro: { fontSize: 26 },
        boxpro: { fontSize: 150 },
      };
      setOut_min(145);
    } else if (home?.offsetWidth >= 1200 && home?.offsetWidth < 1300) {
      // console.log("middle");
      sizedesktop.value = {
        icon: { fontSize: 30 },
        label: { fontSize: 12 },
        value: { fontSize: 22 },
        unit: { fontSize: 14 },
        valuepro: { fontSize: 24 },
        unitpro: { fontSize: 22 },
        boxpro: { fontSize: 140 },
      };
      setOut_min(135);
    } else {
      // console.log("small");
      sizedesktop.value = {
        icon: { fontSize: 25 },
        label: { fontSize: 11 },
        value: { fontSize: 20 },
        unit: { fontSize: 10 },
        valuepro: { fontSize: 22 },
        unitpro: { fontSize: 20 },
        boxpro: { fontSize: 130 },
      };
      setOut_min(125);
    }

    if (home?.offsetWidth > 900) {
      isDesktop.value = true;
    } else {
      isDesktop.value = false;
      initMap(plant.value);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // const divStyle = {
  //   animationName: "home",
  //   animationDuration: "30s",
  //   animationTimingFunction: "linear",
  //   animationIterationCount: "infinite",
  // };

  // const paginationComponentOptions = {
  //   rowsPerPageText: dataLang.formatMessage({ id: "row" }),
  //   rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
  //   selectAllRowsItem: true,
  //   selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  // };

  // const columnHome = [
  //   {
  //     name: dataLang.formatMessage({ id: "ordinalNumber" }),
  //     selector: (row, i) => i + 1,
  //     width: "80px",
  //     sortable: true,
  //     style: {
  //       justifyContent: "center",
  //     },
  //   },
  //   {
  //     name: "Thông tin dự án",
  //     selector: (row) => (
  //       <div
  //         id={row.plantid_}
  //         style={{ cursor: "pointer" }}
  //         onClick={(e) => {
  //           handleInfo(e);
  //         }}
  //       >
  //         <div className="DAT_Table_Infor_Name">{row.plantname}</div>
  //         <div className="DAT_Table_Infor_Addr">{row.addr}</div>
  //       </div>
  //     ),
  //     sortable: true,
  //     minWidth: "180px",
  //     style: {
  //       justifyContent: "left !important",
  //     },
  //   },
  //   {
  //     name: dataLang.formatMessage({ id: "inCapacity" }),
  //     selector: (row) =>
  //       <>
  //         {Number(parseFloat(convertUnit(row.capacity)).toFixed(2)).toLocaleString("en-US")}
  //         &nbsp;
  //         {showUnitk(row.capacity)}Wp
  //       </>,
  //     sortable: true,
  //     width: "150px",
  //     style: {
  //       justifyContent: "center !important",
  //     },
  //   },

  //   {
  //     name: "kWh/kWp (h)",
  //     selector: (row) =>
  //       parseFloat(sun[row.plantid_]).toFixed(2) === "NaN"
  //         ? 0
  //         : Number(
  //           parseFloat(sun[row.plantid_] / row.capacity).toFixed(2)
  //         ).toLocaleString("en-US"),
  //     sortable: true,
  //     width: "120px",
  //   },
  // ];

  const defaultProps = {
    center: {
      lat: 16.0544068,
      lng: 108.2021667,
    },
    zoom: 5,
    mapId: "my_map",
  };

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const handleInfo = (e) => {
    const newPlant = project.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    projectData.value = newPlant;
    plantState.value = "info";
  };

  const invtCloud = async (data, token) => {
    var reqData = {
      data: data,
      token: token,
    };

    try {
      const response = await axios({
        url: host.CLOUD,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Object.keys(reqData)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
            );
          })
          .join("&"),
      });

      return response.data;
    } catch (e) {
      return { ret: 1, msg: "cloud err" };
    }
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={"#2661F8"}
        rx="3"
        ry="3"
        opacity="1"
      ></rect>
    );
  };

  const handleChart = (date) => {
    if (chart == "month") {
      setD({ ...d, month: moment(date).format("MM/YYYY") });
      let arr = moment(date).format("MM/YYYY").split("/");
      const daysInMonth = new Date(arr[1], arr[0], 0).getDate();
      let datamonth_ = [];
      for (let i = 1; i <= daysInMonth; i++) {
        datamonth_ = [
          ...datamonth_,
          {
            date: i < 10 ? `0${i}` : `${i}`,
            [dataLang.formatMessage({ id: "monthOutput" })]: 0,
          },
        ];
      }
      let sum_month = [];
      plant.value.map(async (item_plant, i) => {
        let chart = await callApi("post", host.DATA + "/getMonthChart", {
          plantid: item_plant.plantid_,
          month: moment(date).format("MM/YYYY"),
        });

        if (chart.status) {
          // if (item_plant.state === 1) {
          sum_month[i] = chart.data.data
            .map((item) => item.value)
            .reduce((a, b) => Number(a) + Number(b), 0);
          chart.data.data.map((item, j) => {
            let index = datamonth_.findIndex((d) => d.date == item.date);
            datamonth_[index][dataLang.formatMessage({ id: "monthOutput" })] =
              parseFloat(
                Number(
                  datamonth_[index][
                  dataLang.formatMessage({ id: "monthOutput" })
                  ]
                ) + Number(item.value)
              ).toFixed(2);
          });
        } else {
          sum_month[i] = 0;
        }
        // } else {
        //   sum_month[i] = 0;
        // }

        if (i == plant.value.length - 1) {
          let total_month = parseFloat(
            sum_month.reduce((a, b) => Number(a) + Number(b), 0)
          ).toFixed(2);
          setMonthlyProduction(total_month);
          setDatamonth(datamonth_);
        }
      });
    } else if (chart === "year") {
      setD({ ...d, year: moment(date).format("YYYY") });

      let datayear_ = [];
      for (let i = 1; i <= 12; i++) {
        datayear_ = [
          ...datayear_,
          {
            month: i < 10 ? `0${i}` : `${i}`,
            [dataLang.formatMessage({ id: "yearOutput" })]: 0,
          },
        ];
      }
      let sum_year = [];

      plant.value.map(async (item_plant, i) => {
        let chartY = await callApi("post", host.DATA + "/getYearChart", {
          plantid: item_plant.plantid_,
          year: moment(date).format("YYYY"),
        });

        if (chartY.status) {
          // if (item_plant.state === 1) {
          sum_year[i] = chartY.data.data
            .map((item) => item.value)
            .reduce((a, b) => Number(a) + Number(b), 0);
          chartY.data.data.map((item, j) => {
            let index = datayear_.findIndex((d) => d.month == item.month);
            datayear_[index][dataLang.formatMessage({ id: "yearOutput" })] =
              parseFloat(
                Number(
                  datayear_[index][dataLang.formatMessage({ id: "yearOutput" })]
                ) + Number(item.value)
              ).toFixed(2);
          });
        } else {
          sum_year[i] = 0;
        }
        // } else {
        //   sum_year[i] = 0;
        // }

        if (i == plant.value.length - 1) {
          let total_year = parseFloat(
            sum_year.reduce((a, b) => Number(a) + Number(b), 0)
          ).toFixed(2);
          setYearlyProduction(total_year);
          setDatayear(datayear_);
        }
      });
    }
  };

  const getPlant = async () => {
    let d = await callApi("post", host.DATA + "/getPlant", {
      usr: usr,
      partnerid: partnerInfor.value.partnerid,
      type: userInfor.value.type,
    });
    if (d.status === true) {
      // initMap(d.data);
      setProject(d.data);
      // getChart(d.data);
      setTotal(d.data.length);
      setOnline(d.data.filter((data) => data.state == 1).length);
      setOffline(d.data.filter((data) => data.state == 0).length);
      setWarn(d.data.filter((data) => data.warn == 0).length);
      setTrial(d.data.filter((data) => data.shared == 1).length);
      plant.value = d.data;
      plant.value = plant.value.sort((a, b) => a.plantid_ - b.plantid_);
      setStep(1);
    }
  };

  const getLogger = async () => {
    let d = await callApi("post", host.DATA + "/getallLogger", {
      usr: usr,
      partnerid: partnerInfor.value.partnerid,
      type: userInfor.value.type,
    });
    if (d.status) {
      logger.value = d.data;
      d.data.map(async (item, i) => {
        const res = await invtCloud(
          '{"deviceCode":"' + item.psn + '"}',
          Token.value.token
        );
        if (res.ret === 0) {
          setInvt((pre) => ({ ...pre, [item.psn]: res.data }));
        } else {
          setInvt((pre) => ({ ...pre, [item.psn]: {} }));
        }
        if (i == d.data.length - 1) {
          setStep(2);
        }
      });
      setStep(2);
    }
  };

  const getChart = async (data) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    let datamonth_ = [];
    for (let i = 1; i <= daysInMonth; i++) {
      datamonth_ = [
        ...datamonth_,
        {
          date: i < 10 ? `0${i}` : `${i}`,
          [dataLang.formatMessage({ id: "monthOutput" })]: 0,
        },
      ];
    }

    let datayear_ = [];
    for (let i = 1; i <= 12; i++) {
      datayear_ = [
        ...datayear_,
        {
          month: i < 10 ? `0${i}` : `${i}`,
          [dataLang.formatMessage({ id: "yearOutput" })]: 0,
        },
      ];
    }

    let cap = [];
    let sum_month = [];
    let sum_year = [];
    data.map(async (item_plant, i) => {
      // if (item_plant.state) {
      cap[i] = item_plant.capacity;
      // } else {
      //   cap[i] = 0;
      // }

      let chart = await callApi("post", host.DATA + "/getMonthChart", {
        plantid: item_plant.plantid_,
        month: moment(new Date()).format("MM/YYYY"),
      });
      let chartY = await callApi("post", host.DATA + "/getYearChart", {
        plantid: item_plant.plantid_,
        year: moment(new Date()).format("YYYY"),
      });

      if (chart.status) {
        // if (item_plant.state === 1) {
        sum_month[i] = chart.data.data
          .map((item) => item.value)
          .reduce((a, b) => Number(a) + Number(b), 0);
        chart.data.data.map((item, j) => {
          let index = datamonth_.findIndex((d) => d.date == item.date);
          datamonth_[index][dataLang.formatMessage({ id: "monthOutput" })] =
            parseFloat(
              Number(
                datamonth_[index][
                dataLang.formatMessage({ id: "monthOutput" })
                ]
              ) + Number(item.value)
            ).toFixed(2);
        });
        // } else {
        //   sum_month[i] = 0;
        // }
      } else {
        sum_month[i] = 0;
      }

      if (chartY.status) {
        // if (item_plant.state === 1) {
        sum_year[i] = chartY.data.data
          .map((item) => item.value)
          .reduce((a, b) => Number(a) + Number(b), 0);
        chartY.data.data.map((item, j) => {
          let index = datayear_.findIndex((d) => d.month == item.month);
          datayear_[index][dataLang.formatMessage({ id: "yearOutput" })] =
            parseFloat(
              Number(
                datayear_[index][dataLang.formatMessage({ id: "yearOutput" })]
              ) + Number(item.value)
            ).toFixed(2);
        });
        // } else {
        //   sum_year[i] = 0;
        // }
      } else {
        sum_year[i] = 0;
      }

      if (i == data.length - 1) {
        let total_month = parseFloat(
          sum_month.reduce((a, b) => Number(a) + Number(b), 0)
        ).toFixed(2);
        setMonthlyProduction(total_month);

        let total_year = parseFloat(
          sum_year.reduce((a, b) => Number(a) + Number(b), 0)
        ).toFixed(2);
        setYearlyProduction(total_year);

        let total = parseFloat(
          cap.reduce((a, b) => Number(a) + Number(b), 0)
        ).toFixed(2);
        setCapacity(total);
        setDatamonth(datamonth_);
        setDatayear(datayear_);
        setStep(3);
      }
    });
  };

  const initMap = async (data) => {
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    const { Map } = await loader.importLibrary("maps");

    const map = new Map(document.getElementById("map"), defaultProps);

    const markerList = data.map((item) => {
      // const marker = { lat: parseFloat(item.lat), lng: parseFloat(item.long) };
      // const markerElement = new AdvancedMarkerElement({
      //   position: marker,
      //   map: map,
      //   title: item.plantname,
      // });

      const priceTag = document.createElement("div");
      const src = item?.img ? item.img : `/dat_picture/solar_panel.png`
      priceTag.className = "price-tag";
      priceTag.innerHTML = `<img src='${src}'></img>`
      // priceTag.textContent = item.name_;
      const marker = { lat: parseFloat(item.lat), lng: parseFloat(item.long) };
      const markerElement = new AdvancedMarkerElement({
        position: marker,
        map: map,
        title: item.plantname,
        content: priceTag,
      });

      markerElement.addListener("click", () => {
        plantState.value = "info";
        projectData.value = item;
        sidebartab.value = "Monitor";
        sidebartabli.value = "/Project";
      });
      return markerElement;
    });

    new MarkerClusterer({ markers: markerList, map: map });
  };

  const getData = async (data) => {
    var cal = {};
    var num_ = {
      bat_1: [],
      bat_2: [],
      bat_in_1: [],
      bat_out_1: [],
      con_1: [],
      con_2: [],
      grid_1: [],
      grid_in_1: [],
      grid_in_2: [],
      grid_out_1: [],
      grid_out_2: [],
      pro_1: [],
      pro_2: [],
      pro_3: [],
    };
    let sun_ = {};

    data.map((item, i) => {
      Object.entries(item.pdata).map(([key, value]) => {
        switch (value.type) {
          case "sum":
            let inum = [];
            let register_ = JSON.parse(value.register);
            register_.map((reg, j) => {
              inum[j] = parseFloat(invt[item.psn]?.[reg] || 0);
            });

            // if (item.pstate) {
            num_[key][i] = inum.reduce((accumulator, currentValue) => {
              return Number(accumulator) + Number(currentValue);
            }, 0) * parseFloat(value.cal);
            // console.log(key,num_[key]);
            // } else {
            //   num_[key][i] = 0;
            // }

            if (i == data.length - 1) {
              cal[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0)
              ).toFixed(2);
            }
            break;
          case "word":
            let d = JSON.parse(value.register);
            let e = [invt[item.psn]?.[d[0]] || 0, invt[item.psn]?.[d[1]] || 0];

            const convertToDoublewordAndFloat = (word, type) => {
              var doubleword = (word[1] << 16) | word[0];
              var buffer = new ArrayBuffer(4);
              var intView = new Int32Array(buffer);
              var floatView = new Float32Array(buffer);
              intView[0] = doubleword;
              var float_value = floatView[0];

              return type === "int"
                ? parseFloat(doubleword).toFixed(2)
                : parseFloat(float_value).toFixed(2) || 0;
            };

            // if (item.pstate) {
            num_[key][i] = convertToDoublewordAndFloat(e, "int") * parseFloat(value.cal);

            // } else {
            //   num_[key][i] = 0;
            // }

            if (i == data.length - 1) {
              cal[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0)
              ).toFixed(2);


            }
            break;
          case "real":
            // if (item.pstate) {
            num_[key][i] =
              parseFloat(invt[item.psn]?.[value.register] || 0) * parseFloat(value.cal);
            if (key == "pro_2") {
              sun_[item.pplantid] =
                parseFloat(invt[item.psn]?.[value.register]) * parseFloat(value.cal);
            }
            // } else {
            //   num_[key][i] = 0;
            //   sun_[item.pplantid] = 0;
            // }

            if (i == data.length - 1) {
              // console.log(cal);
              cal[key] = parseFloat(
                num_[key].reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                })
              ).toFixed(2);
            }
            break;
          default:
            break;
        }
      });
    });
    setSun(sun_);
    // getPrice(plant.value, logger.value);
    setProduction(cal?.pro_1 || 0);
    setDailyProduction(cal?.pro_2 || 0);
    setTotalProduction(cal?.pro_3 || 0);
    let x = ((cal?.pro_1 / 1000) * 100) / capacity || 0;
    setPer(mapValue(x, in_min, in_max, out_min, out_max));
    setStep(4);
  };

  const getPrice = async (data, logger) => {
    var price = [];

    data.map((itemplant, index) => {
      var sum_logger = [];
      let logger_ = logger.filter(
        (data) => data.pplantid == itemplant.plantid_
      );
      logger_.map((item, i) => {
        const type = item.pdata.pro_3.type;
        const cal = JSON.parse(item.pdata.pro_3.cal);

        switch (type) {
          case "sum":
            break;
          case "word":
            let d = JSON.parse(item.pdata.pro_3.register);
            let e = [invt[item.psn]?.[d[0]] || 0, invt[item.psn]?.[d[1]]] || 0;

            const convertToDoublewordAndFloat = (word, type) => {
              var doubleword = (word[1] << 16) | word[0];
              var buffer = new ArrayBuffer(4);
              var intView = new Int32Array(buffer);
              var floatView = new Float32Array(buffer);
              intView[0] = doubleword;
              var float_value = floatView[0];

              return type === "int"
                ? parseFloat(doubleword).toFixed(2)
                : parseFloat(float_value).toFixed(2) || 0;
            };
            // if (item.pstate) {
            sum_logger[i] = convertToDoublewordAndFloat(e, "int");
            // } else {
            //   sum_logger[i] = 0;
            // }

            if (i == logger_.length - 1) {
              let total = parseFloat(
                sum_logger.reduce((accumulator, currentValue) => {
                  return Number(accumulator) + Number(currentValue);
                }, 0) * parseFloat(cal)
              ).toFixed(2);

              if (itemplant.currency == "vnd") {
                price[index] = total * itemplant.price;
              } else {
                price[index] = total * itemplant.price * usd.value;
              }
            }
            break;
          default:
            break;
        }
      });

      if (index == plant.value.length - 1) {
        let total = parseFloat(
          price.reduce((accumulator, currentValue) => {
            return Number(accumulator) + Number(currentValue);
          }, 0)
        ).toFixed(2);
        setPrice(total);
      }
    });
  };

  //step 1 get plant and logger
  useEffect(() => {
    switch (step) {
      case 0:
        getPlant();
        break;
      case 1:
        getLogger();
        break;
      case 2:
        getChart(plant.value);
        break;
      case 3:
        initMap(plant.value);
        getData(logger.value);
        break;
      case 4:
        getPrice(plant.value, logger.value);
        coalsave.value = {
          ...coalsave.value,
          value: totalproduction,
        };
        break;
      default:
        break;
    }
  }, [
    // lang,
    // usr,
    partnerInfor.value.partnerid,
    userInfor.value.type,
    // Token.value.token,
    step,
  ]);

  useEffect(() => {
    if (step === 5) {
      setStep(2);
    }
  }, [lang]);

  return (
    <>
      <div className="DAT_Header">
        <div className="DAT_Header_Title">
          <VscDashboard color="gray" size={25} />
          <span>{dataLang.formatMessage({ id: "dashboard" })}</span>
        </div>
      </div>

      {isBrowser
        ? (
          isDesktop.value
            ?
            <div className="DAT_Home" id="Home">
              <div className="DAT_Home_Row1">
                <div className="DAT_Home_Row1_Overview">
                  <div className="DAT_Home_Row1_Overview-Head">
                    <div className="DAT_Home_Row1_Overview-Head-Title">
                      {dataLang.formatMessage({ id: "overview" })}
                    </div>
                  </div>

                  <div className="DAT_Home_Row1_Overview-Main">
                    <div className="DAT_Home_Row1_Overview-Main-Percent">
                      <style>{keyframes}</style>

                      <div
                        className="DAT_Home_Row1_Overview-Main-Percent-Item"
                        style={{
                          animation: "home 30s linear infinite",
                          width: sizedesktop.value.boxpro.fontSize,
                          height: sizedesktop.value.boxpro.fontSize
                        }}
                      >
                        <div className="DAT_Home_Row1_Overview-Main-Percent-Item-value">
                          <div className="DAT_Home_Row1_Overview-Main-Percent-Item-value_num"
                            style={{ fontSize: sizedesktop.value.valuepro.fontSize }}
                          >
                            {Number(
                              parseFloat(
                                (production / 1000 / capacity) * 100
                              ).toFixed(2)
                            ).toLocaleString("en-US") === "NaN"
                              ? "--"
                              : Number(
                                parseFloat(
                                  (production / 1000 / capacity) * 100
                                ).toFixed(2)
                              ).toLocaleString("en-US")}
                          </div>
                          <div className="DAT_Home_Row1_Overview-Main-Percent-Item-value_unit"
                            style={{ fontSize: sizedesktop.value.unitpro.fontSize }}
                          >
                            %
                          </div>
                        </div>
                      </div>

                      <div className="DAT_Home_Row1_Overview-Main-Percent-Icon"
                        style={{ cursor: "pointer" }}
                      >
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
                                        width: "400px",
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
                                        {dataLang.formatMessage({
                                          id: "overview1",
                                        })}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                          marginBottom: 1.7,
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "overview2",
                                        })}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "overview3",
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
                    </div>

                    <div className="DAT_Home_Row1_Overview-Main-Value">
                      <div className="DAT_Home_Row1_Overview-Main-Value-Item"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="DAT_Home_Row1_Overview-Main-Value-Item-Title"
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText, }}
                        >
                          {dataLang.formatMessage({ id: "totalOutput" })}
                        </div>
                        <div>
                          <span
                            style={{
                              // color: COLOR.value.PrimaryColor,
                              fontSize: sizedesktop.value.value.fontSize,
                              // fontFamily: "segoeui-sb",
                            }}
                          >
                            {Number(
                              parseFloat(convertUnit(production / 1000)).toFixed(2)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnit(production / 1000)}W
                          </span>
                        </div>
                      </div>

                      <div className="DAT_Home_Row1_Overview-Main-Value-Item">
                        <div className="DAT_Home_Row1_Overview-Main-Value-Item-Title"
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText, }}
                        >
                          {dataLang.formatMessage({ id: "inCapacity" })}
                        </div>
                        <div>
                          <span
                            style={{
                              // color: COLOR.value.PrimaryColor,
                              fontSize: sizedesktop.value.value.fontSize,
                              // fontFamily: "segoeui-sb",
                            }}
                          >
                            {Number(
                              parseFloat(convertUnit(capacity)).toFixed(2)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnitk(capacity)}Wp
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_Home_Row1_Elec">
                  <div className="DAT_Home_Row1_Elec-Head">
                    <div className="DAT_Home_Row1_Elec-Head-Title">
                      {dataLang.formatMessage({ id: "HomeProduction" })}
                    </div>
                  </div>

                  <div className="DAT_Home_Row1_Elec_Content"
                    style={{ paddingBottom: "0px" }}
                  >
                    <div className="DAT_Home_Row1_Elec_Content_Item">
                      <div className="DAT_Home_Row1_Elec_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-01.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Elec_Content_Item_Detail">
                        <div
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText }}
                        >
                          {dataLang.formatMessage({ id: "today" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(convertUnit(dailyproduction || 0)).toFixed(
                                2
                              )
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnitk(dailyproduction)}Wh
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="DAT_Home_Row1_Elec_Content_Item">
                      <div className="DAT_Home_Row1_Elec_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-02.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Elec_Content_Item_Detail">
                        <div
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText }}
                        >
                          {dataLang.formatMessage({ id: "month" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(
                                convertUnit(monthlyproduction || 0)
                              ).toFixed(2)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnitk(monthlyproduction)}Wh
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_Home_Row1_Elec_Content"
                    style={{ paddingTop: "10px" }}
                  >
                    <div className="DAT_Home_Row1_Elec_Content_Item">
                      <div className="DAT_Home_Row1_Elec_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-03.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Elec_Content_Item_Detail">
                        <div
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText }}
                        >
                          {dataLang.formatMessage({ id: "year" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(
                                convertUnit(yearlyproduction || 0)
                              ).toFixed(2)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnitk(yearlyproduction)}Wh
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="DAT_Home_Row1_Elec_Content_Item">
                      <div className="DAT_Home_Row1_Elec_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-04.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Elec_Content_Item_Detail">
                        <div
                          style={{ fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText }}
                        >
                          {dataLang.formatMessage({ id: "total" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(convertUnit(totalproduction || 0)).toFixed(
                                2
                              )
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {showUnitk(totalproduction)}Wh
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_Home_Row1_Benefit">
                  <div className="DAT_Home_Row1_Benefit-Head">
                    <div className="DAT_Home_Row1_Benefit-Head-Title">
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
                                      width: "400px",
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
                  </div>

                  <div className="DAT_Home_Row1_Benefit_Content"
                    style={{ paddingBottom: "0px" }}
                  >
                    <div className="DAT_Home_Row1_Benefit_Content_Item">
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Detail">
                        <div className="DAT_Home_Row1_Benefit_Content_Item_Detail_Tit"
                          style={{
                            fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText,
                            maxWidth: sizedesktop.value.label.fontSize === 11 ? "70px" : "110px",
                          }}
                        >
                          {dataLang.formatMessage({ id: "coalSave" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(
                                coalsave.value.value * coalsave.value.ef || 0
                              ).toFixed(1)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            t
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="DAT_Home_Row1_Benefit_Content_Item">
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Detail">
                        <div className="DAT_Home_Row1_Benefit_Content_Item_Detail_Tit"
                          style={{
                            fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText,
                            maxWidth: sizedesktop.value.label.fontSize === 11 ? "70px" : "110px",
                          }}
                        >
                          {dataLang.formatMessage({ id: "cropYield" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(
                                coalsave.value.value * coalsave.value.tree || 0
                              ).toFixed(1)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            {dataLang.formatMessage({ id: "tree" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_Home_Row1_Benefit_Content"
                    style={{ paddingTop: "10px" }}
                  >
                    <div className="DAT_Home_Row1_Benefit_Content_Item">
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Detail">
                        <div className="DAT_Home_Row1_Benefit_Content_Item_Detail_Tit"
                          style={{
                            fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText,
                            maxWidth: sizedesktop.value.label.fontSize === 11 ? "70px" : "110px",
                          }}
                        >
                          {dataLang.formatMessage({ id: "C02" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(
                                coalsave.value.value * coalsave.value.avr || 0
                              ).toFixed(1)
                            ).toLocaleString("en-US")}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            t
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="DAT_Home_Row1_Benefit_Content_Item">
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Icon">
                        <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" style={{ width: sizedesktop.value.icon.fontSize, height: sizedesktop.value.icon.fontSize }} />
                      </div>
                      <div className="DAT_Home_Row1_Benefit_Content_Item_Detail">
                        <div className="DAT_Home_Row1_Benefit_Content_Item_Detail_Tit"
                          style={{
                            fontSize: sizedesktop.value.label.fontSize, color: COLOR.value.grayText,
                            maxWidth: sizedesktop.value.label.fontSize === 11 ? "70px" : "110px",
                          }}
                        >
                          {dataLang.formatMessage({ id: "totalRevenue" })}
                        </div>
                        <div>
                          <span style={{ fontSize: sizedesktop.value.value.fontSize }}>
                            {Number(
                              parseFloat(convertUnit(price / 1000 || 0)).toFixed(1)
                            ).toLocaleString("en-US")}
                          </span>
                          <span style={{ fontSize: sizedesktop.value.unit.fontSize }}>
                            {showUnit(price)}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: COLOR.value.grayText,
                              fontSize: sizedesktop.value.unit.fontSize,
                            }}
                          >
                            VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_Home_Row2">
                <div className="DAT_Home_Row2_Left">
                  <div className="DAT_Home_Row2_Left_Top">
                    <div className="DAT_Home_Row2_Left_Top_History">
                      <div className="DAT_Home_Row2_Left_Top_History-Head">
                        <div className="DAT_Home_Row2_Left_Top_History-Head-Title">
                          {dataLang.formatMessage({ id: "history" })}
                        </div>

                        <div className="DAT_Home_Row2_Left_Top_History-Head-Option">
                          <span
                            style={{
                              backgroundColor:
                                chart === "year" ? "rgb(11, 25, 103)" : "white",
                              color: chart === "year" ? "white" : "black",
                            }}
                            onClick={() => {
                              setChart("year");
                            }}
                          >
                            {dataLang.formatMessage({ id: "year" })}
                          </span>
                          <span
                            style={{
                              backgroundColor:
                                chart === "month" ? "rgb(11, 25, 103)" : "white",
                              color: chart === "month" ? "white" : "black",
                            }}
                            onClick={() => {
                              setChart("month");
                            }}
                          >
                            {dataLang.formatMessage({ id: "month" })}
                          </span>
                        </div>

                        <div className="DAT_Home_Row2_Left_Top_History-Head-Datetime">
                          <DatePicker
                            // id="datepicker"
                            onChange={(date) => handleChart(date)}
                            showMonthYearPicker={chart === "year" ? false : true}
                            showYearPicker={chart === "month" ? false : true}
                            customInput={
                              <button className="DAT_CustomPicker">
                                <span style={{ fontFamily: "segoeui" }}>
                                  {d[chart]}
                                </span>
                                <IoCalendarOutline color="gray" />
                              </button>
                            }
                          />
                        </div>
                      </div>

                      <div className="DAT_Home_Row2_Left_Top_History-Chart">
                        <div className="DAT_Home_Row2_Left_Top_History-Chart-label">
                          <div className="DAT_Home_Row2_Left_Top_History-Chart-label-Unit">
                            {chart === "year" ? (
                              <span
                                style={{
                                  color: COLOR.value.grayText,
                                  fontSize: "15px",
                                }}
                              >
                                {showUnitk(yearlyproduction)}Wh
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: COLOR.value.grayText,
                                  fontSize: "15px",
                                }}
                              >
                                {showUnitk(monthlyproduction)}Wh
                              </span>
                            )}
                          </div>
                          <div className="DAT_Home_Row2_Left_Top_History-Chart-label-Label">
                            {chart === "year"
                              ? dataLang.formatMessage({ id: "yearOutput" })
                              : dataLang.formatMessage({ id: "monthOutput" })}
                            :{" "}
                            {chart === "year"
                              ? Number(
                                parseFloat(convertUnit(yearlyproduction)).toFixed(
                                  2
                                )
                              ).toLocaleString("en-US")
                              : Number(
                                parseFloat(
                                  convertUnit(monthlyproduction)
                                ).toFixed(2)
                              ).toLocaleString("en-US")}
                            &nbsp;
                            {chart === "year" ? (
                              <span
                                style={{
                                  color: COLOR.value.grayText,
                                  fontSize: "15px",
                                }}
                              >
                                {showUnitk(yearlyproduction)}Wh
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: COLOR.value.grayText,
                                  fontSize: "15px",
                                }}
                              >
                                {showUnitk(monthlyproduction)}Wh
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="DAT_Home_Row2_Left_Top_History-Chart-Content">
                          {chart === "year" ? (
                            <ResponsiveContainer
                              style={{ width: "100%", height: "100%" }}
                            >
                              <BarChart width={150} height={300} data={datayear}>
                                <XAxis
                                  dataKey="month"
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[
                                    0,
                                    Math.max(
                                      ...datayear.map(
                                        (item) =>
                                          item[
                                          dataLang.formatMessage({
                                            id: "yearOutput",
                                          })
                                          ]
                                      )
                                    ),
                                  ]}
                                />
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                />
                                <Tooltip />
                                <Legend />
                                <Bar
                                  shape={<TriangleBar />}
                                  dataKey={dataLang.formatMessage({
                                    id: "yearOutput",
                                  })}
                                  fill={"#2661F8"}
                                  barSize={15}
                                  legendType="circle"
                                  style={{ fill: "#2661F8" }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer
                              style={{
                                width: "100%",
                                height: "100%",
                                marginLeft: "-20px",
                              }}
                            >
                              <BarChart width={150} height={300} data={datamonth}>
                                <XAxis
                                  dataKey="date"
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[
                                    0,
                                    Math.max(
                                      ...datamonth.map(
                                        (item) =>
                                          item[
                                          dataLang.formatMessage({
                                            id: "monthOutput",
                                          })
                                          ]
                                      )
                                    ),
                                  ]}
                                />
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                />
                                <Tooltip />
                                <Legend />
                                <Bar
                                  shape={<TriangleBar />}
                                  dataKey={dataLang.formatMessage({
                                    id: "monthOutput",
                                  })}
                                  fill={"#2661F8"}
                                  barSize={15}
                                  legendType="circle"
                                  style={{ fill: "#2661F8" }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_Home_Row2_Left_Bot">
                    <div className="DAT_Home_Row2_Left_Bot_Rank">
                      <div className="DAT_Home_Row2_Left_Bot_Rank-Head">
                        <div className="DAT_Home_Row2_Left_Bot_Rank-Head-Title">
                          {dataLang.formatMessage({ id: "rushhour" })}
                        </div>
                      </div>

                      <div
                        className="DAT_Home_Row2_Left_Bot_Rank-Content"
                        style={{ paddingBottom: "0px" }}
                      >
                        <div
                          className="DAT_Home_Row2_Left_Bot_Rank-Content_Item"
                          style={{ padding: "0px" }}
                        >
                          <div
                            className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_No"
                            style={{ paddingLeft: "10px" }}
                          >
                            {dataLang.formatMessage({ id: "ordinalNumber" })}
                          </div>

                          <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Info">
                            {dataLang.formatMessage({ id: "projectInfo" })}
                          </div>

                          <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Capacity"
                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {dataLang.formatMessage({ id: "inCapacity" })}
                          </div>

                          <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Data">
                            kWh/kWp
                          </div>
                        </div>
                      </div>

                      <div className="DAT_Home_Row2_Left_Bot_Rank-Content">
                        {plant.value.length === 0 ? <Empty />
                          :
                          <>
                            {plant.value.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className="DAT_Home_Row2_Left_Bot_Rank-Content_Item"
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#f5f5f5" : "white",
                                  }}
                                >
                                  <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_No">
                                    {index + 1}
                                  </div>

                                  <div
                                    className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Info"
                                    style={{ textAlign: "left", cursor: "pointer" }}
                                    id={item.plantid_}
                                    onClick={(e) => handleInfo(e)}
                                  >
                                    <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Info_Name">
                                      {item.plantname}
                                    </div>
                                    <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Info_Addr">
                                      {item.addr}
                                    </div>
                                  </div>

                                  <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Capacity">
                                    {item.capacity} (kWp)
                                  </div>

                                  <div className="DAT_Home_Row2_Left_Bot_Rank-Content_Item_Data">
                                    {parseFloat(sun[item.plantid_]).toFixed(2) ===
                                      "NaN"
                                      ? 0
                                      : Number(
                                        parseFloat(
                                          sun[item.plantid_] / item.capacity
                                        ).toFixed(2)
                                      ).toLocaleString("en-US")}{" "}
                                    (h)
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_Home_Row2_Right">
                  <div className="DAT_Home_Row2_Right_Top">
                    <div className="DAT_Home_Row2_Right_Top_State">
                      <div className="DAT_Home_Row2_Right_Top_State-Title">
                        {dataLang.formatMessage({ id: "projectStatus" })}
                      </div>

                      <div className="DAT_Home_Row2_Right_Top_State-Total">
                        <div className="DAT_Home_Row2_Right_Top_State-Total-Icon">
                          <FaSolarPanel color={COLOR.value.PrimaryColor} />
                        </div>
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "15px" }}
                        >
                          {dataLang.formatMessage({ id: "projectTotal" })}
                        </span>
                        <span
                          style={{
                            color: COLOR.value.PrimaryColor,
                            fontSize: "28px",
                            fontFamily: "segoeui",
                          }}
                        >
                          {total}
                        </span>
                      </div>

                      <div className="DAT_Home_Row2_Right_Top_State-Content">
                        <div className="DAT_Home_Row2_Right_Top_State-Content-Item"
                          onClick={() => {
                            sidebartab.value = "Monitor";
                            sidebartabli.value = "/Project";
                            projtab.value = "online";
                            navigate("/Project");
                          }}
                        >
                          <div className="DAT_Home_Row2_Right_Top_State-Content-Item-Title"
                            style={{ color: COLOR.value.DarkGreenColor }}
                          >
                            <img src="/dat_icon/online.png" alt="" />
                            <span style={{ maxWidth: sizedesktop.value.label.fontSize === 11 ? "85px" : "125px" }}>
                              {dataLang.formatMessage({ id: "online" })}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                color: COLOR.value.PrimaryColor,
                                fontSize: "28px",
                                fontFamily: "segoeui",
                              }}
                            >
                              {online}
                            </span>
                          </div>
                        </div>

                        <div className="DAT_Home_Row2_Right_Top_State-Content-Item"
                          onClick={() => {
                            sidebartab.value = "Monitor";
                            sidebartabli.value = "/Project";
                            projtab.value = "offline";
                            navigate("/Project");
                          }}
                        >
                          <div className="DAT_Home_Row2_Right_Top_State-Content-Item-Title"
                            style={{ color: COLOR.value.grayText }}
                          >
                            <img src="/dat_icon/offline.png" alt="" />
                            <span style={{ maxWidth: sizedesktop.value.label.fontSize === 11 ? "85px" : "125px" }}>
                              {dataLang.formatMessage({ id: "offline" })}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                color: COLOR.value.PrimaryColor,
                                fontSize: "28px",
                                fontFamily: "segoeui",
                              }}
                            >
                              {offline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="DAT_Home_Row2_Right_Top_State-Content">
                        <div className="DAT_Home_Row2_Right_Top_State-Content-Item"
                          onClick={() => {
                            sidebartab.value = "Monitor";
                            sidebartabli.value = "/Project";
                            projtab.value = "demo";
                            navigate("/Project");
                          }}
                        >
                          <div className="DAT_Home_Row2_Right_Top_State-Content-Item-Title"
                            style={{ color: "#2BC3FD" }}
                          >
                            <img src="/dat_icon/shared.png" alt="" />
                            <span style={{ maxWidth: sizedesktop.value.label.fontSize === 11 ? "85px" : "125px" }}>
                              {dataLang.formatMessage({ id: "demo" })}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                color: COLOR.value.PrimaryColor,
                                fontSize: "28px",
                                fontFamily: "segoeui",
                              }}
                            >
                              {trial}
                            </span>
                          </div>
                        </div>

                        <div className="DAT_Home_Row2_Right_Top_State-Content-Item"
                          onClick={() => {
                            sidebartab.value = "Monitor";
                            sidebartabli.value = "/Project";
                            projtab.value = "warn";
                            navigate("/Project");
                          }}
                        >
                          <div className="DAT_Home_Row2_Right_Top_State-Content-Item-Title"
                            style={{ color: COLOR.value.DarkOrangeColor }}
                          >
                            <img src="/dat_icon/warn.png" alt="" />
                            <span style={{ maxWidth: sizedesktop.value.label.fontSize === 11 ? "85px" : "125px" }}>
                              {dataLang.formatMessage({ id: "projectWarn" })}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                color: COLOR.value.PrimaryColor,
                                fontSize: "28px",
                                fontFamily: "segoeui",
                              }}
                            >
                              {warn}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="map" className="DAT_Home_Row2_Right_Bot"></div>
                </div>
              </div>
            </div>
            :
            <div className="DAT_HomeMobile" id="Home">
              <div className="DAT_HomeMobile_Overview">
                <div className="DAT_HomeMobile_Overview-Head">
                  <div className="DAT_HomeMobile_Overview-Head-Title">
                    {dataLang.formatMessage({ id: "overview" })}
                  </div>
                </div>

                <div className="DAT_HomeMobile_Overview-Main">
                  <div className="DAT_HomeMobile_Overview-Main-Percent">
                    <style>{keyframes}</style>

                    <div
                      className="DAT_HomeMobile_Overview-Main-Percent-Item"
                      style={{ animation: "home 30s linear infinite" }}
                    >
                      <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value">
                        <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value_num">
                          {Number(
                            parseFloat(
                              (production / 1000 / capacity) * 100
                            ).toFixed(2)
                          ).toLocaleString("en-US") === "NaN"
                            ? "--"
                            : Number(
                              parseFloat(
                                (production / 1000 / capacity) * 100
                              ).toFixed(2)
                            ).toLocaleString("en-US")}
                        </div>
                        <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value_unit">
                          %
                        </div>
                      </div>
                    </div>

                    <div
                      className="DAT_HomeMobile_Overview-Main-Percent-Icon"
                      style={{ cursor: "pointer" }}
                    >
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
                                      width: "400px",
                                      marginLeft: "435px",
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
                                      {dataLang.formatMessage({ id: "overview1" })}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        textAlign: "justify",
                                        marginBottom: 1.7,
                                      }}
                                    >
                                      {dataLang.formatMessage({ id: "overview2" })}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        textAlign: "justify",
                                      }}
                                    >
                                      {dataLang.formatMessage({ id: "overview3" })}
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

                  <div className="DAT_HomeMobile_Overview-Main-Value">
                    <div className="DAT_HomeMobile_Overview-Main-Value-Item">
                      <div className="DAT_HomeMobile_Overview-Main-Value-Item-Title">
                        {dataLang.formatMessage({ id: "totalOutput" })}
                      </div>
                      <div>
                        <span
                          style={{
                            color: "black",
                            fontSize: "24px",
                            // fontWeight: "650",
                            // fontFamily: "segoeui-sb",
                          }}
                        >
                          {Number(
                            parseFloat(convertUnit(production / 1000)).toFixed(2)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnit(production / 1000)}W
                        </span>
                      </div>
                    </div>

                    <div className="DAT_HomeMobile_Overview-Main-Value-Item">
                      <div className="DAT_HomeMobile_Overview-Main-Value-Item-Title">
                        {dataLang.formatMessage({ id: "inCapacity" })}
                      </div>
                      <div>
                        <span
                          style={{
                            color: "black",
                            fontSize: "24px",
                            // fontWeight: "650",
                            // fontFamily: "segoeui-sb",
                          }}
                        >
                          {Number(
                            parseFloat(convertUnit(capacity)).toFixed(2)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnitk(capacity)}Wp
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_Elec">
                <div className="DAT_HomeMobile_Elec-Head">
                  <div className="DAT_HomeMobile_Elec-Head-Title">
                    {dataLang.formatMessage({ id: "HomeProduction" })}
                  </div>
                </div>

                <div className="DAT_HomeMobile_Elec-Sub"
                  style={{ paddingBottom: "0px" }}
                >
                  <div className="DAT_HomeMobile_Elec-Sub-Item">
                    <div>
                      <img
                        src="/dat_icon/3_Icon_AppEmbody-01.png"
                        style={{ width: "40px", height: "40px" }}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                        {dataLang.formatMessage({ id: "today" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(convertUnit(dailyproduction || 0)).toFixed(2)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnitk(dailyproduction)}Wh
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_HomeMobile_Elec-Sub-Item">
                    <div>
                      <img
                        src="/dat_icon/3_Icon_AppEmbody-02.png"
                        style={{ width: "40px", height: "40px" }}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                        {dataLang.formatMessage({ id: "month" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(convertUnit(monthlyproduction || 0)).toFixed(
                              2
                            )
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnitk(monthlyproduction)}Wh
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Elec-Sub">
                  <div className="DAT_HomeMobile_Elec-Sub-Item">
                    <div>
                      <img
                        src="/dat_icon/3_Icon_AppEmbody-03.png"
                        style={{ width: "40px", height: "40px" }}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                        {dataLang.formatMessage({ id: "year" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(convertUnit(yearlyproduction || 0)).toFixed(
                              2
                            )
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnitk(yearlyproduction)}Wh
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_HomeMobile_Elec-Sub-Item">
                    <div>
                      <img
                        src="/dat_icon/3_Icon_AppEmbody-04.png"
                        style={{ width: "40px", height: "40px" }}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                        {dataLang.formatMessage({ id: "total" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(convertUnit(totalproduction || 0)).toFixed(2)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnitk(totalproduction)}Wh
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_Benefit">
                <div className="DAT_HomeMobile_Benefit-Head">
                  <div className="DAT_HomeMobile_Benefit-Head-Title">
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
                </div>

                <div className="DAT_HomeMobile_Benefit_Content"
                  style={{ paddingBottom: "0px" }}
                >
                  <div className="DAT_HomeMobile_Benefit_Content_Item">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                      {/* <img src="/dat_icon/coal.jpg" alt="" /> */}
                      <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" />
                    </div>
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                      <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                        style={{ fontSize: "14px", color: COLOR.value.grayText }}
                      >
                        {dataLang.formatMessage({ id: "coalSave" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(
                              coalsave.value.value * coalsave.value.ef || 0
                            ).toFixed(1)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          t
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_HomeMobile_Benefit_Content_Item">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                      {/* <img src="/dat_icon/tree.jpg" alt="" /> */}
                      <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" />
                    </div>
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                      <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                        style={{ fontSize: "14px", color: COLOR.value.grayText }}
                      >
                        {dataLang.formatMessage({ id: "cropYield" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(
                              coalsave.value.value * coalsave.value.tree || 0
                            ).toFixed(1)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {dataLang.formatMessage({ id: "tree" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Benefit_Content">
                  <div className="DAT_HomeMobile_Benefit_Content_Item">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                      {/* <img src="/dat_icon/co2.jpg" alt="" /> */}
                      <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" />
                    </div>
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                      <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                        style={{ fontSize: "14px", color: COLOR.value.grayText }}
                      >
                        {dataLang.formatMessage({ id: "C02" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(
                              coalsave.value.value * coalsave.value.avr
                            ).toFixed(1)
                          ).toLocaleString("en-US")}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          t
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="DAT_HomeMobile_Benefit_Content_Item">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                      {/* <img src="/dat_icon/money.jpg" alt="" /> */}
                      <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" />
                    </div>
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                      <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                        style={{ fontSize: "14px", color: COLOR.value.grayText }}
                      >
                        {dataLang.formatMessage({ id: "totalRevenue" })}
                      </div>
                      <div>
                        <span style={{ fontSize: "24px" }}>
                          {Number(
                            parseFloat(convertUnit(price / 1000 || 0)).toFixed(1)
                          ).toLocaleString("en-US")}
                        </span>
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          {showUnit(price)}
                        </span>
                        &nbsp;
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                        >
                          VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_State">
                <div className="DAT_HomeMobile_State-Title">
                  {dataLang.formatMessage({ id: "projectStatus" })}
                </div>

                <div className="DAT_HomeMobile_State-Total">
                  <div className="DAT_HomeMobile_State-Total-Icon">
                    <FaSolarPanel color={COLOR.value.PrimaryColor} />
                  </div>
                  <span style={{ color: COLOR.value.grayText, fontSize: "13px" }}>
                    {dataLang.formatMessage({ id: "projectTotal" })}
                  </span>
                  <span
                    style={{
                      color: "black",
                      fontSize: "24px",
                    }}
                  >
                    {total}
                  </span>
                </div>

                <div className="DAT_HomeMobile_State-Content">
                  <div
                    className="DAT_HomeMobile_State-Content-Item"
                    onClick={() => {
                      sidebartab.value = "Monitor";
                      sidebartabli.value = "/Project";
                      projtab.value = "online";
                      navigate("/Project");
                    }}
                  >
                    <div
                      className="DAT_HomeMobile_State-Content-Item-Title"
                      style={{ color: COLOR.value.DarkGreenColor }}
                    >
                      <img src="/dat_icon/online.png" alt="" />
                      {dataLang.formatMessage({ id: "online" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          fontFamily: "segoeui",
                        }}
                      >
                        {online}
                      </span>
                    </div>
                  </div>

                  <div
                    className="DAT_HomeMobile_State-Content-Item"
                    onClick={() => {
                      sidebartab.value = "Monitor";
                      sidebartabli.value = "/Project";
                      projtab.value = "offline";
                      navigate("/Project");
                    }}
                  >
                    <div
                      className="DAT_HomeMobile_State-Content-Item-Title"
                      style={{ color: COLOR.value.grayText }}
                    >
                      <img src="/dat_icon/offline.png" alt="" />
                      {dataLang.formatMessage({ id: "offline" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          fontFamily: "segoeui",
                        }}
                      >
                        {offline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_State-Content">
                  <div
                    className="DAT_HomeMobile_State-Content-Item"
                    onClick={() => {
                      sidebartab.value = "Monitor";
                      sidebartabli.value = "/Project";
                      projtab.value = "demo";
                      navigate("/Project");
                    }}
                  >
                    <div
                      className="DAT_HomeMobile_State-Content-Item-Title"
                      style={{ color: "#2BC3FD" }}
                    >
                      <img src="/dat_icon/shared.png" alt="" />
                      {dataLang.formatMessage({ id: "demo" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          fontFamily: "segoeui",
                        }}
                      >
                        {trial}
                      </span>
                    </div>
                  </div>

                  <div
                    className="DAT_HomeMobile_State-Content-Item"
                    onClick={() => {
                      sidebartab.value = "Monitor";
                      sidebartabli.value = "/Project";
                      projtab.value = "warn";
                      navigate("/Project");
                    }}
                  >
                    <div
                      className="DAT_HomeMobile_State-Content-Item-Title"
                      style={{ color: COLOR.value.DarkOrangeColor }}
                    >
                      <img src="/dat_icon/warn.png" alt="" />
                      {dataLang.formatMessage({ id: "projectWarn" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          fontFamily: "segoeui",
                        }}
                      >
                        {warn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_History">
                <div className="DAT_HomeMobile_History-Head">
                  <div className="DAT_HomeMobile_History-Head-Title">
                    {dataLang.formatMessage({ id: "history" })}
                  </div>

                  <div className="DAT_HomeMobile_History-Head-Option">
                    <span
                      style={{
                        backgroundColor:
                          chart === "year" ? "rgb(11, 25, 103)" : "white",
                        color: chart === "year" ? "white" : "black",
                      }}
                      onClick={() => {
                        setChart("year");
                      }}
                    >
                      {dataLang.formatMessage({ id: "year" })}
                    </span>
                    <span
                      style={{
                        backgroundColor:
                          chart === "month" ? "rgb(11, 25, 103)" : "white",
                        color: chart === "month" ? "white" : "black",
                      }}
                      onClick={() => {
                        setChart("month");
                      }}
                    >
                      {dataLang.formatMessage({ id: "month" })}
                    </span>
                  </div>

                  <div className="DAT_HomeMobile_History-Head-Datetime">
                    <DatePicker
                      // id="datepicker"
                      onChange={(date) => handleChart(date)}
                      showMonthYearPicker={chart === "year" ? false : true}
                      showYearPicker={chart === "month" ? false : true}
                      customInput={
                        <button className="DAT_CustomPicker">
                          <span>{d[chart]}</span>
                          <IoCalendarOutline color="gray" />
                        </button>
                      }
                    />
                  </div>
                </div>

                <div className="DAT_HomeMobile_History-Chart">
                  <div className="DAT_HomeMobile_History-Chart-label">
                    <div className="DAT_HomeMobile_History-Chart-label-Unit">
                      {chart === "year" ? (
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                        >
                          {showUnitk(yearlyproduction)}Wh
                        </span>
                      ) : (
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                        >
                          {showUnitk(monthlyproduction)}Wh
                        </span>
                      )}
                    </div>
                    <div className="DAT_HomeMobile_History-Chart-label-Label">
                      {chart === "year"
                        ? dataLang.formatMessage({ id: "yearOutput" })
                        : dataLang.formatMessage({ id: "monthOutput" })}
                      :{" "}
                      {chart === "year"
                        ? Number(
                          parseFloat(convertUnit(yearlyproduction)).toFixed(2)
                        ).toLocaleString("en-US")
                        : Number(
                          parseFloat(convertUnit(monthlyproduction)).toFixed(2)
                        ).toLocaleString("en-US")}
                      &nbsp;
                      {chart === "year" ? (
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                        >
                          {showUnitk(yearlyproduction)}Wh
                        </span>
                      ) : (
                        <span
                          style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                        >
                          {showUnitk(monthlyproduction)}Wh
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="DAT_HomeMobile_History-Chart-Content">
                    {chart === "year" ? (
                      <ResponsiveContainer
                        style={{
                          width: "100%",
                          height: "100%",
                          marginLeft: "-20px",
                        }}
                      >
                        <BarChart width={300} height={200} data={datayear}>
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[
                              0,
                              Math.max(
                                ...datayear.map(
                                  (item) =>
                                    item[
                                    dataLang.formatMessage({ id: "yearOutput" })
                                    ]
                                )
                              ),
                            ]}
                          />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            shape={<TriangleBar />}
                            dataKey={dataLang.formatMessage({ id: "yearOutput" })}
                            fill={"#2661F8"}
                            barSize={15}
                            legendType="circle"
                            style={{ fill: "#2661F8" }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer
                        style={{
                          width: "100%",
                          height: "100%",
                          marginLeft: "-20px",
                        }}
                      >
                        <BarChart width={150} height={200} data={datamonth}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[
                              0,
                              Math.max(
                                ...datamonth.map(
                                  (item) =>
                                    item[
                                    dataLang.formatMessage({ id: "monthOutput" })
                                    ]
                                )
                              ),
                            ]}
                          />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            shape={<TriangleBar />}
                            dataKey={dataLang.formatMessage({ id: "monthOutput" })}
                            fill={"#2661F8"}
                            barSize={15}
                            legendType="circle"
                            style={{ fill: "#2661F8" }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_Rank">
                <div className="DAT_HomeMobile_Rank-Head">
                  <div className="DAT_HomeMobile_Rank-Head-Title">
                    {dataLang.formatMessage({ id: "rushhour" })}
                  </div>
                </div>

                <div className="DAT_HomeMobile_Rank-Container">
                  {plant.value.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="DAT_HomeMobile_Rank-Container-ContentMobile"
                      >
                        <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top">
                          <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Ava">
                            <img
                              src={
                                item.img ? item.img : "/dat_picture/solar_panel.png"
                              }
                              alt=""
                              id={item.plantid_}
                              onClick={(e) => handleInfo(e)}
                            />
                          </div>

                          <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info">
                            <div
                              className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info_Name"
                              id={item.plantid_}
                              onClick={(e) => handleInfo(e)}
                            >
                              {item.plantname}
                            </div>
                            <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info_Sun">
                              kWh/kWp(h):{" "}
                              {parseFloat(sun[item.plantid_]).toFixed(2) === "NaN"
                                ? 0
                                : Number(
                                  parseFloat(
                                    sun[item.plantid_] / item.capacity
                                  ).toFixed(2)
                                ).toLocaleString("en-US")}
                            </div>
                          </div>
                        </div>

                        <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Bottom">
                          {item.addr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="DAT_HomeMobile_Distribution">
                <div className="DAT_HomeMobile_Distribution-Map">
                  <div id="map" style={{ width: "100%", height: "100%" }}></div>
                </div>
              </div>
            </div>
        ) : (
          <div className="DAT_HomeMobile" id="Home"
            style={{ marginBottom: isLandscape ? "30px" : "100px" }}
          >
            <div className="DAT_HomeMobile_Overview">
              <div className="DAT_HomeMobile_Overview-Head">
                <div className="DAT_HomeMobile_Overview-Head-Title">
                  {dataLang.formatMessage({ id: "overview" })}
                </div>
              </div>

              <div className="DAT_HomeMobile_Overview-Main">
                <div className="DAT_HomeMobile_Overview-Main-Percent">
                  <style>{keyframes}</style>

                  <div
                    className="DAT_HomeMobile_Overview-Main-Percent-Item"
                    style={{
                      animation: "home 30s linear infinite",
                      width: sizedesktop.value.boxpro.fontSize,
                      height: sizedesktop.value.boxpro.fontSize
                    }}
                  >
                    <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value">
                      <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value_num">
                        {Number(
                          parseFloat(
                            (production / 1000 / capacity) * 100
                          ).toFixed(2)
                        ).toLocaleString("en-US") === "NaN"
                          ? "--"
                          : Number(
                            parseFloat(
                              (production / 1000 / capacity) * 100
                            ).toFixed(2)
                          ).toLocaleString("en-US")}
                      </div>
                      <div className="DAT_HomeMobile_Overview-Main-Percent-Item-value_unit">
                        %
                      </div>
                    </div>
                  </div>

                  <div
                    className="DAT_HomeMobile_Overview-Main-Percent-Icon"
                    style={{ cursor: "pointer" }}
                  >
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
                                    width: "400px",
                                    marginLeft: "435px",
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
                                    {dataLang.formatMessage({ id: "overview1" })}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      textAlign: "justify",
                                      marginBottom: 1.7,
                                    }}
                                  >
                                    {dataLang.formatMessage({ id: "overview2" })}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      textAlign: "justify",
                                    }}
                                  >
                                    {dataLang.formatMessage({ id: "overview3" })}
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

                <div className="DAT_HomeMobile_Overview-Main-Value">
                  <div className="DAT_HomeMobile_Overview-Main-Value-Item">
                    <div className="DAT_HomeMobile_Overview-Main-Value-Item-Title">
                      {dataLang.formatMessage({ id: "totalOutput" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          // fontWeight: "650",
                          // fontFamily: "segoeui-sb",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(production / 1000)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnit(production / 1000)}W
                      </span>
                    </div>
                  </div>

                  <div className="DAT_HomeMobile_Overview-Main-Value-Item">
                    <div className="DAT_HomeMobile_Overview-Main-Value-Item-Title">
                      {dataLang.formatMessage({ id: "inCapacity" })}
                    </div>
                    <div>
                      <span
                        style={{
                          color: "black",
                          fontSize: "24px",
                          // fontWeight: "650",
                          // fontFamily: "segoeui-sb",
                        }}
                      >
                        {Number(
                          parseFloat(convertUnit(capacity)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnitk(capacity)}Wp
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_HomeMobile_Elec">
              <div className="DAT_HomeMobile_Elec-Head">
                <div className="DAT_HomeMobile_Elec-Head-Title">
                  {dataLang.formatMessage({ id: "HomeProduction" })}
                </div>
              </div>

              <div className="DAT_HomeMobile_Elec-Sub"
                style={{ paddingBottom: "0px" }}
              >
                <div className="DAT_HomeMobile_Elec-Sub-Item">
                  <div>
                    <img
                      src="/dat_icon/3_Icon_AppEmbody-01.png"
                      style={{ width: "40px", height: "40px" }}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                      {dataLang.formatMessage({ id: "today" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(convertUnit(dailyproduction || 0)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnitk(dailyproduction)}Wh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Elec-Sub-Item">
                  <div>
                    <img
                      src="/dat_icon/3_Icon_AppEmbody-02.png"
                      style={{ width: "40px", height: "40px" }}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                      {dataLang.formatMessage({ id: "month" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(convertUnit(monthlyproduction || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnitk(monthlyproduction)}Wh
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_Elec-Sub">
                <div className="DAT_HomeMobile_Elec-Sub-Item">
                  <div>
                    <img
                      src="/dat_icon/3_Icon_AppEmbody-03.png"
                      style={{ width: "40px", height: "40px" }}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                      {dataLang.formatMessage({ id: "year" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(convertUnit(yearlyproduction || 0)).toFixed(
                            2
                          )
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnitk(yearlyproduction)}Wh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Elec-Sub-Item">
                  <div>
                    <img
                      src="/dat_icon/3_Icon_AppEmbody-04.png"
                      style={{ width: "40px", height: "40px" }}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="DAT_HomeMobile_Elec-Sub-Item-Title">
                      {dataLang.formatMessage({ id: "total" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(convertUnit(totalproduction || 0)).toFixed(2)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnitk(totalproduction)}Wh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_HomeMobile_Benefit">
              <div className="DAT_HomeMobile_Benefit-Head">
                <div className="DAT_HomeMobile_Benefit-Head-Title">
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
              </div>

              <div className="DAT_HomeMobile_Benefit_Content"
                style={{ paddingBottom: "0px" }}
              >
                <div className="DAT_HomeMobile_Benefit_Content_Item">
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                    {/* <img src="/dat_icon/coal.jpg" alt="" /> */}
                    <img src="/dat_icon/3_Icon_AppEmbody-05.png" alt="" />
                  </div>
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                      style={{ fontSize: "14px", color: COLOR.value.grayText }}
                    >
                      {dataLang.formatMessage({ id: "coalSave" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(
                            coalsave.value.value * coalsave.value.ef || 0
                          ).toFixed(1)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        t
                      </span>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Benefit_Content_Item">
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                    {/* <img src="/dat_icon/tree.jpg" alt="" /> */}
                    <img src="/dat_icon/3_Icon_AppEmbody-06.png" alt="" />
                  </div>
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                      style={{ fontSize: "14px", color: COLOR.value.grayText }}
                    >
                      {dataLang.formatMessage({ id: "cropYield" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(
                            coalsave.value.value * coalsave.value.tree || 0
                          ).toFixed(1)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {dataLang.formatMessage({ id: "tree" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_Benefit_Content">
                <div className="DAT_HomeMobile_Benefit_Content_Item">
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                    {/* <img src="/dat_icon/co2.jpg" alt="" /> */}
                    <img src="/dat_icon/3_Icon_AppEmbody-08.png" alt="" />
                  </div>
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                      style={{ fontSize: "14px", color: COLOR.value.grayText }}
                    >
                      {dataLang.formatMessage({ id: "C02" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(
                            coalsave.value.value * coalsave.value.avr
                          ).toFixed(1)
                        ).toLocaleString("en-US")}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        t
                      </span>
                    </div>
                  </div>
                </div>

                <div className="DAT_HomeMobile_Benefit_Content_Item">
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Icon">
                    {/* <img src="/dat_icon/money.jpg" alt="" /> */}
                    <img src="/dat_icon/3_Icon_AppEmbody-07.png" alt="" />
                  </div>
                  <div className="DAT_HomeMobile_Benefit_Content_Item_Detail">
                    <div className="DAT_HomeMobile_Benefit_Content_Item_Detail_Tit"
                      style={{ fontSize: "14px", color: COLOR.value.grayText }}
                    >
                      {dataLang.formatMessage({ id: "totalRevenue" })}
                    </div>
                    <div>
                      <span style={{ fontSize: "24px" }}>
                        {Number(
                          parseFloat(convertUnit(price / 1000 || 0)).toFixed(1)
                        ).toLocaleString("en-US")}
                      </span>
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        {showUnit(price)}
                      </span>
                      &nbsp;
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "16px" }}
                      >
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_HomeMobile_State">
              <div className="DAT_HomeMobile_State-Title">
                {dataLang.formatMessage({ id: "projectStatus" })}
              </div>

              <div className="DAT_HomeMobile_State-Total">
                <div className="DAT_HomeMobile_State-Total-Icon">
                  <FaSolarPanel color={COLOR.value.PrimaryColor} />
                </div>
                <span style={{ color: COLOR.value.grayText, fontSize: "13px" }}>
                  {dataLang.formatMessage({ id: "projectTotal" })}
                </span>
                <span
                  style={{
                    color: "black",
                    fontSize: "24px",
                  }}
                >
                  {total}
                </span>
              </div>

              <div className="DAT_HomeMobile_State-Content">
                <div
                  className="DAT_HomeMobile_State-Content-Item"
                  onClick={() => {
                    sidebartab.value = "Monitor";
                    sidebartabli.value = "/Project";
                    projtab.value = "online";
                    navigate("/Project");
                  }}
                >
                  <div
                    className="DAT_HomeMobile_State-Content-Item-Title"
                    style={{ color: COLOR.value.DarkGreenColor }}
                  >
                    <img src="/dat_icon/online.png" alt="" />
                    {dataLang.formatMessage({ id: "online" })}
                  </div>
                  <div>
                    <span
                      style={{
                        color: "black",
                        fontSize: "24px",
                        fontFamily: "segoeui",
                      }}
                    >
                      {online}
                    </span>
                  </div>
                </div>

                <div
                  className="DAT_HomeMobile_State-Content-Item"
                  onClick={() => {
                    sidebartab.value = "Monitor";
                    sidebartabli.value = "/Project";
                    projtab.value = "offline";
                    navigate("/Project");
                  }}
                >
                  <div
                    className="DAT_HomeMobile_State-Content-Item-Title"
                    style={{ color: COLOR.value.grayText }}
                  >
                    <img src="/dat_icon/offline.png" alt="" />
                    {dataLang.formatMessage({ id: "offline" })}
                  </div>
                  <div>
                    <span
                      style={{
                        color: "black",
                        fontSize: "24px",
                        fontFamily: "segoeui",
                      }}
                    >
                      {offline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="DAT_HomeMobile_State-Content">
                <div
                  className="DAT_HomeMobile_State-Content-Item"
                  onClick={() => {
                    sidebartab.value = "Monitor";
                    sidebartabli.value = "/Project";
                    projtab.value = "demo";
                    navigate("/Project");
                  }}
                >
                  <div
                    className="DAT_HomeMobile_State-Content-Item-Title"
                    style={{ color: "#2BC3FD" }}
                  >
                    <img src="/dat_icon/shared.png" alt="" />
                    {dataLang.formatMessage({ id: "demo" })}
                  </div>
                  <div>
                    <span
                      style={{
                        color: "black",
                        fontSize: "24px",
                        fontFamily: "segoeui",
                      }}
                    >
                      {trial}
                    </span>
                  </div>
                </div>

                <div
                  className="DAT_HomeMobile_State-Content-Item"
                  onClick={() => {
                    sidebartab.value = "Monitor";
                    sidebartabli.value = "/Project";
                    projtab.value = "warn";
                    navigate("/Project");
                  }}
                >
                  <div
                    className="DAT_HomeMobile_State-Content-Item-Title"
                    style={{ color: COLOR.value.DarkOrangeColor }}
                  >
                    <img src="/dat_icon/warn.png" alt="" />
                    {dataLang.formatMessage({ id: "projectWarn" })}
                  </div>
                  <div>
                    <span
                      style={{
                        color: "black",
                        fontSize: "24px",
                        fontFamily: "segoeui",
                      }}
                    >
                      {warn}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_HomeMobile_History">
              <div className="DAT_HomeMobile_History-Head">
                <div className="DAT_HomeMobile_History-Head-Title">
                  {dataLang.formatMessage({ id: "history" })}
                </div>

                <div className="DAT_HomeMobile_History-Head-Option">
                  <span
                    style={{
                      backgroundColor:
                        chart === "year" ? "rgb(11, 25, 103)" : "white",
                      color: chart === "year" ? "white" : "black",
                    }}
                    onClick={() => {
                      setChart("year");
                    }}
                  >
                    {dataLang.formatMessage({ id: "year" })}
                  </span>
                  <span
                    style={{
                      backgroundColor:
                        chart === "month" ? "rgb(11, 25, 103)" : "white",
                      color: chart === "month" ? "white" : "black",
                    }}
                    onClick={() => {
                      setChart("month");
                    }}
                  >
                    {dataLang.formatMessage({ id: "month" })}
                  </span>
                </div>

                <div className="DAT_HomeMobile_History-Head-Datetime">
                  <DatePicker
                    // id="datepicker"
                    onChange={(date) => handleChart(date)}
                    showMonthYearPicker={chart === "year" ? false : true}
                    showYearPicker={chart === "month" ? false : true}
                    customInput={
                      <button className="DAT_CustomPicker">
                        <span>{d[chart]}</span>
                        <IoCalendarOutline color="gray" />
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="DAT_HomeMobile_History-Chart">
                <div className="DAT_HomeMobile_History-Chart-label">
                  <div className="DAT_HomeMobile_History-Chart-label-Unit">
                    {chart === "year" ? (
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                      >
                        {showUnitk(yearlyproduction)}Wh
                      </span>
                    ) : (
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                      >
                        {showUnitk(monthlyproduction)}Wh
                      </span>
                    )}
                  </div>
                  <div className="DAT_HomeMobile_History-Chart-label-Label">
                    {chart === "year"
                      ? dataLang.formatMessage({ id: "yearOutput" })
                      : dataLang.formatMessage({ id: "monthOutput" })}
                    :{" "}
                    {chart === "year"
                      ? Number(
                        parseFloat(convertUnit(yearlyproduction)).toFixed(2)
                      ).toLocaleString("en-US")
                      : Number(
                        parseFloat(convertUnit(monthlyproduction)).toFixed(2)
                      ).toLocaleString("en-US")}
                    &nbsp;
                    {chart === "year" ? (
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                      >
                        {showUnitk(yearlyproduction)}Wh
                      </span>
                    ) : (
                      <span
                        style={{ color: COLOR.value.grayText, fontSize: "13px" }}
                      >
                        {showUnitk(monthlyproduction)}Wh
                      </span>
                    )}
                  </div>
                </div>
                <div className="DAT_HomeMobile_History-Chart-Content">
                  {chart === "year" ? (
                    <ResponsiveContainer
                      style={{
                        width: "100%",
                        height: "100%",
                        marginLeft: "-20px",
                      }}
                    >
                      <BarChart width={300} height={200} data={datayear}>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          domain={[
                            0,
                            Math.max(
                              ...datayear.map(
                                (item) =>
                                  item[
                                  dataLang.formatMessage({ id: "yearOutput" })
                                  ]
                              )
                            ),
                          ]}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          shape={<TriangleBar />}
                          dataKey={dataLang.formatMessage({ id: "yearOutput" })}
                          fill={"#2661F8"}
                          barSize={15}
                          legendType="circle"
                          style={{ fill: "#2661F8" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer
                      style={{
                        width: "100%",
                        height: "100%",
                        marginLeft: "-20px",
                      }}
                    >
                      <BarChart width={150} height={200} data={datamonth}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          domain={[
                            0,
                            Math.max(
                              ...datamonth.map(
                                (item) =>
                                  item[
                                  dataLang.formatMessage({ id: "monthOutput" })
                                  ]
                              )
                            ),
                          ]}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          shape={<TriangleBar />}
                          dataKey={dataLang.formatMessage({ id: "monthOutput" })}
                          fill={"#2661F8"}
                          barSize={15}
                          legendType="circle"
                          style={{ fill: "#2661F8" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="DAT_HomeMobile_Rank">
              <div className="DAT_HomeMobile_Rank-Head">
                <div className="DAT_HomeMobile_Rank-Head-Title">
                  {dataLang.formatMessage({ id: "rushhour" })}
                </div>
              </div>

              <div className="DAT_HomeMobile_Rank-Container">
                {plant.value.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="DAT_HomeMobile_Rank-Container-ContentMobile"
                    >
                      <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top">
                        <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Ava">
                          <img
                            src={
                              item.img ? item.img : "/dat_picture/solar_panel.png"
                            }
                            alt=""
                            id={item.plantid_}
                            onClick={(e) => handleInfo(e)}
                          />
                        </div>

                        <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info">
                          <div
                            className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info_Name"
                            id={item.plantid_}
                            onClick={(e) => handleInfo(e)}
                          >
                            {item.plantname}
                          </div>
                          <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Top_Info_Sun">
                            kWh/kWp(h):{" "}
                            {parseFloat(sun[item.plantid_]).toFixed(2) === "NaN"
                              ? 0
                              : Number(
                                parseFloat(
                                  sun[item.plantid_] / item.capacity
                                ).toFixed(2)
                              ).toLocaleString("en-US")}
                          </div>
                        </div>
                      </div>

                      <div className="DAT_HomeMobile_Rank-Container-ContentMobile_Bottom">
                        {item.addr}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="DAT_HomeMobile_Distribution">
              <div className="DAT_HomeMobile_Distribution-Map">
                <div id="map" style={{ width: "100%", height: "100%" }}></div>
              </div>
            </div>
          </div>
        )}

      {(() => {
        switch (plantState.value) {
          case "info":
            return (
              <div className="DAT_PlantHome">
                <ProjectData />
              </div>
            );
          default:
            return <></>;
        }
      })()}
    </>
  );
}
