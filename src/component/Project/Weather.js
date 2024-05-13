import React, { useEffect, useRef, useState } from "react";
import "./Project.scss";

import axios from "axios";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { PacmanLoader } from "react-spinners";
import { projectData } from "./Project";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { IoLocation } from "react-icons/io5";
import { host } from "../Lang/Contant";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { tab } from "../Device/Device";
import { COLOR } from "../../App";
import { isBrowser } from "react-device-detect";

export default function Weather() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dataLang = useIntl();
  const boxRef = useRef(null);
  let [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const v = dataLang.formatMessage({ id: "temperature" });

  const lang = useSelector((state) => state.admin.lang);
  const lat = projectData.value.lat;
  const lon = projectData.value.long;
  const url = `${host.WEATHER}/forecast.json?key=${process.env.REACT_APP_WEATHERKEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no&lang=${lang}`;

  //DRAGGING MOUSE
  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.clientX - boxRef.current.offsetLeft);
  };

  const dragging = (e) => {
    if (!isDragging) return;
    const x = e.clientX - boxRef.current.offsetLeft;
    const scrollLeft = x - startX;
    boxRef.current.scrollLeft -= scrollLeft;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const today = new Date().toDateString();

  //CALL DATA BY AXIOS
  const [forecastdata, setForecastdata] = useState([]);
  useEffect(() => {
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
      setForecastdata([]);
      response.data.forecast.forecastday.map((item) => {
        let dateObj = new Date(item.date);
        let weekday = [];
        if (lang === "en") {
          weekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
        } else if (lang === "vi") {
          weekday = [
            "Chủ nhật",
            "Thứ hai",
            "Thứ ba",
            "Thứ tư",
            "Thứ năm",
            "Thứ sáu",
            "Thứ bảy",
          ];
        }
        let day = weekday[dateObj.getUTCDay()];
        const db = {
          name: day,
          [v]: item.day.maxtemp_c,
        };
        setForecastdata((old) => [...old, db]);
      });
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PacmanLoader color="#0082CA" size={20} />
    </div>
  ) : (
    // <div className="DAT_ProjectData_Dashboard_Data_Right">
    //   <div className="DAT_ProjectData_Dashboard_Data_Right_Weather">
    // <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside">
    //   <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current">
    //     <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current_Left">
    //       <img
    //         src={"/dat_picture/station.jpg"}
    //         style={{ width: "140px", height: "80px" }}
    //         alt=""
    //       />
    //     </div>
    //     <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current_Right">
    //       <img
    //         src={"https:" + data.current.condition.icon}
    //         style={{ width: "70px", height: "70px" }}
    //         alt=""
    //       />
    //       <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current_Right_Tit">
    //         <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current_Right_Tit_Temp">
    //           {data.current.temp_c}°C
    //         </div>
    //         {/* {data.current.condition.text} */}
    //         <PopupState variant="popper" popupId="demo-popup-popper">
    //           {(popupState) => (
    //             <div style={{ cursor: "pointer" }}>
    //               <div
    //                 {...bindHover(popupState)}
    //                 className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Current_Right_Tit_Des"
    //               >
    //                 {" "}
    //                 {data.current.condition.text}
    //               </div>
    //               <Popper {...bindPopper(popupState)} transition>
    //                 {({ TransitionProps }) => (
    //                   <Fade {...TransitionProps} timeout={350}>
    //                     <Paper
    //                       sx={{
    //                         width: "200px",
    //                         height: "30px",
    //                         marginLeft: "200px",
    //                         p: 2,
    //                       }}
    //                     >
    //                       <Typography
    //                         sx={{
    //                           fontSize: "12px",
    //                           textAlign: "justify",
    //                           marginBottom: 1.7,
    //                         }}
    //                       >
    //                         {data.current.condition.text}
    //                       </Typography>
    //                     </Paper>
    //                   </Fade>
    //                 )}
    //               </Popper>
    //             </div>
    //           )}
    //         </PopupState>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Describe">
    //     <IoLocation color="rgba(97,88,194,0.8)" size={15} />
    //     {data.location.name},{data.location.country}, {data.location.localtime}
    //   </div>
    //   <div className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Forecast">
    //     <ResponsiveContainer width={"100%"} height={150}>
    //       <AreaChart
    //         data={forecastdata}
    //         margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
    //       >
    //         <defs>
    //           <linearGradient
    //             id="colorforecastdata"
    //             x1="0"
    //             y1="0"
    //             x2="0"
    //             y2="1"
    //           >
    //             <stop
    //               offset="5%"
    //               stopColor="rgba(97,88,194,0.8)"
    //               stopOpacity={0.8}
    //             />
    //             <stop
    //               offset="95%"
    //               stopColor="rgba(97,88,194,0.8)"
    //               stopOpacity={0}
    //             />
    //           </linearGradient>
    //         </defs>
    //         <XAxis dataKey="name" hide={true} />
    //         <Tooltip animationEasing="ease-in-out" />
    //         <Area
    //           type="monotone"
    //           dataKey={v}
    //           stroke="rgba(97,88,194,0.8)"
    //           fillOpacity={20}
    //           fill="url(#colorforecastdata)"
    //         />
    //       </AreaChart>
    //     </ResponsiveContainer>
    //   </div>
    //   <div
    //     onMouseDown={startDragging}
    //     onMouseUp={stopDragging}
    //     onMouseLeave={stopDragging}
    //     onMouseMove={dragging}
    //     ref={boxRef}
    //     className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Bottom"
    //   >
    //     {data.forecast.forecastday.map((item, index) => {
    //       let weekdays = [];
    //       if (lang === "en") {
    //         weekdays = [
    //           "Sunday",
    //           "Monday",
    //           "Tuesday",
    //           "Wednesday",
    //           "Thursday",
    //           "Friday",
    //           "Saturday",
    //         ];
    //       } else if (lang === "vi") {
    //         weekdays = [
    //           "Chủ nhật",
    //           "Thứ hai",
    //           "Thứ ba",
    //           "Thứ tư",
    //           "Thứ năm",
    //           "Thứ sáu",
    //           "Thứ bảy",
    //         ];
    //       }
    //       const dateObj = new Date(item.date);
    //       const weekday = weekdays[dateObj.getUTCDay()];
    //       const isToday = new Date(item.date).toDateString() === today;
    //       return (
    //         <div
    //           key={index}
    //           className="DAT_ProjectData_Dashboard_Data_Right_Weather_Inside_Bottom_Box"
    //         >
    //           <div
    //             style={{
    //               fontFamily: isToday
    //                 ? "Montserrat-Bold"
    //                 : "Montserrat-Regular",
    //               color: "rgba(11, 25, 103)",
    //             }}
    //           >
    //             {weekday}
    //           </div>
    //           <div>
    //             <img
    //               draggable="true" // Enable drag for images
    //               onDragStart={(e) => e.preventDefault()}
    //               src={"https:" + item.day.condition.icon}
    //               style={{ width: "40px", height: "40px" }}
    //               alt=""
    //             />
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
    <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather">
      {isBrowser ?
        <>
          <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg">
            <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box">
              <img
                src={"/dat_picture/station.jpg"}
                style={{ width: "180px", height: "100px", marginRight: "20px" }}
                alt=""
              />
              <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Icon">
                <img
                  src={"https:" + data.current.condition.icon}
                  style={{
                    marginBottom: "-10px",
                  }}
                  alt=""
                />
              </div>
              <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Text">
                <span>{data.current.temp_c}°C</span>
                {data.current.condition.text}
              </div>
            </div>
          </div>
          <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_Forecast">
            {data.forecast.forecastday.map((item, index) => {
              let weekdays = [];
              if (lang === "en") {
                weekdays = [
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ];
              } else if (lang === "vi") {
                weekdays = [
                  "Chủ nhật",
                  "Thứ hai",
                  "Thứ ba",
                  "Thứ tư",
                  "Thứ năm",
                  "Thứ sáu",
                  "Thứ bảy",
                ];
              }
              const dateObj = new Date(item.date);
              const weekday = weekdays[dateObj.getUTCDay()];
              const isToday = new Date(item.date).toDateString() === today;
              return (
                <div
                  key={index}
                  className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_Forecast_Box"
                >
                  <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Icon">
                    <img
                      draggable="true" // Enable drag for images
                      onDragStart={(e) => e.preventDefault()}
                      src={"https:" + item.day.condition.icon}
                      alt=""
                    />
                  </div>
                  <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text">
                    {item.day.avgtemp_c}°C
                    <div
                      className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text_Weekday"
                      style={{
                        fontFamily: isToday
                          ? "segoeuib"
                          : "segoeui",
                        color: "rgba(11, 25, 103)",
                      }}
                    >
                      {weekday}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
        :
        <>
          Weather
        </>
      }

    </div>
  );
}
