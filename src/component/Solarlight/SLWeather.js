import React, { useEffect, useState } from "react";

import { host } from "../Lang/Contant";
import { isDesktop } from "../Home/Home";
import { slProjectData } from "./SLProjectlist";
import { slprojectdatasize } from "./SLProjectData";

import axios from "axios";
import { FadeLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { isBrowser } from "react-device-detect";

export default function SLWeather() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dataLang = useIntl();
  // const boxRef = useRef(null);
  // let [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);

  const v = dataLang.formatMessage({ id: "temperature" });

  const lang = useSelector((state) => state.admin.lang);
  const lat = slProjectData.value.lat;
  const lon = slProjectData.value.long;
  const url = `${host.WEATHER}/forecast.json?key=${process.env.REACT_APP_WEATHERKEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no&lang=${lang}`;

  //DRAGGING MOUSE
  // const startDragging = (e) => {
  //   setIsDragging(true);
  //   setStartX(e.clientX - boxRef.current.offsetLeft);
  // };

  // const dragging = (e) => {
  //   if (!isDragging) return;
  //   const x = e.clientX - boxRef.current.offsetLeft;
  //   const scrollLeft = x - startX;
  //   boxRef.current.scrollLeft -= scrollLeft;
  // };

  // const stopDragging = () => {
  //   setIsDragging(false);
  // };

  const today = new Date().toDateString();

  //CALL DATA BY AXIOS
  const [forecastdata, setForecastdata] = useState([]);
  useEffect(() => {
    axios.get(url).then((response) => {
      setData(response.data);
      // console.log(response.data);
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

  return (
    <>
      {isLoading
        ?
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeLoader color="#0082CA" size={20} />
        </div>
        :
        <>
          {isBrowser ?
            isDesktop.value
              ?
              <>
                <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather">
                  <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg">
                    <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box">
                      <img
                        src={"/dat_picture/station.jpg"}
                        style={{ width: "120px", height: "70px" }}
                        alt=""
                      />
                      <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Icon">
                      </div>
                      <div className="DAT_ProjectData_NewDashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Text"
                        style={{ fontSize: slprojectdatasize.value.label.fontSize }}
                      >
                        <span style={{ fontSize: slprojectdatasize.value.value.fontSize }}>
                          <img
                            src={"https:" + data.current.condition.icon}
                            style={{
                              marginBottom: "-10px",
                            }}
                            alt=""
                          />
                          {data.current.temp_c}°C
                        </span>
                        {data.current.condition.text}
                      </div>
                    </div>
                  </div>

                  {slprojectdatasize.value.label.fontSize <= 12
                    ?
                    <></>
                    :
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
                                  // fontFamily: isToday
                                  //   ? "segoeui-sb"
                                  //   : "segoeui",
                                  color: isToday ? "rgba(11, 25, 103)" : "grey",
                                }}
                              >
                                {weekday}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
              </>
              :
              <>
                <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg">
                  <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box">
                    <img
                      src={"/dat_picture/station.jpg"}
                      style={{ width: "120px", height: "70px" }}
                      alt=""
                    />
                    <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Icon">
                    </div>
                    <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Text">
                      <span>
                        <img
                          src={"https:" + data.current.condition.icon}
                          style={{
                            marginBottom: "-10px",
                          }}
                          alt=""
                        />
                        {data.current.temp_c}°C
                      </span>
                      {data.current.condition.text}
                    </div>
                  </div>
                </div>
                <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast">
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
                        className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box"
                      >
                        <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Icon">
                          <img
                            draggable="true" // Enable drag for images
                            onDragStart={(e) => e.preventDefault()}
                            src={"https:" + item.day.condition.icon}
                            alt=""
                          />
                        </div>
                        <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text">
                          {item.day.avgtemp_c}°C
                          <div
                            className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text_Weekday"
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
              <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg">
                <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box">
                  <img
                    src={"/dat_picture/station.jpg"}
                    style={{ width: "120px", height: "70px" }}
                    alt=""
                  />
                  <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Icon">
                  </div>
                  <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_CurDeg_Box_Text">
                    <span>
                      <img
                        src={"https:" + data.current.condition.icon}
                        style={{
                          marginBottom: "-10px",
                        }}
                        alt=""
                      />
                      {data.current.temp_c}°C
                    </span>
                    {data.current.condition.text}
                  </div>
                </div>
              </div>
              <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast">
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
                      className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box"
                    >
                      <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Icon">
                        <img
                          draggable="true" // Enable drag for images
                          onDragStart={(e) => e.preventDefault()}
                          src={"https:" + item.day.condition.icon}
                          alt=""
                        />
                      </div>
                      <div className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text">
                        {item.day.avgtemp_c}°C
                        <div
                          className="DAT_ProjectData_Dashboard_Top_Right_PredictDeg_Weather_Forecast_Box_Text_Weekday"
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
          }
        </>
      }
    </>
  );
}
