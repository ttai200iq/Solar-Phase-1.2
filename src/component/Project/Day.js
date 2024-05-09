import React from "react";
import "./Project.scss";

import { projectData } from "./Project";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { showUnitk } from "../../App";
import { Line } from "react-chartjs-2";

export default function Day(props) {
  const filterchart = useSelector((state) => state.tool.filterchart);

  const renderTooltipContent = (o) => {
    const { payload = [], label } = o;
    return (
      <div
        className="customized-tooltip-content"
        style={{
          backgroundColor: "white",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <span className="total">{`${label}`}</span>
        <div className="list">
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              style={{ color: entry.color, marginTop: "8px" }}
            >
              {`${entry.name}: ${entry.value}(${showUnitk(entry.name)}${"W"})`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="DAT_ProjectData_Dashboard_History_Day">
      <div className="DAT_ProjectData_Dashboard_History_Year_Chart">
        {(() => {
          switch (projectData.value.plantmode) {
            case "grid":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <AreaChart width={100} height={500} data={props.data}>
                    <defs>
                      <linearGradient id="colorday" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="rgba(11,25,103)"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="90%"
                          stopColor="rgba(11,25,103)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        props.data.reduce((min, item) => {
                          const values = Object.values({
                            x: item[props.v],
                          });
                          const currentMin = Math.min(...values.map(Number));
                          return currentMin < min ? currentMin : min;
                        }, Infinity),
                        props.data.reduce((max, item) => {
                          const values = Object.values({
                            x: item[props.v],
                          });
                          const currentMax = Math.max(...values.map(Number));
                          return currentMax > max ? currentMax : max;
                        }, -Infinity),
                      ]}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Legend iconType="plainline" />

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .productionData ? (
                      <Area
                        type="monotone"
                        dataKey={props.v}
                        stroke="rgba(11,25,103,0.7)"
                        fillOpacity={1}
                        fill="rgba(11,25,103, 0.2)"
                      />
                    ) : (
                      <></>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              );
            case "consumption":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <AreaChart width={100} height={500} data={props.data}>
                    <defs>
                      {/* <linearGradient id="colorday" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="rgba(11,25,103)"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="90%"
                              stopColor="rgba(11,25,103)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorday2"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="5%" stopColor="rgba(247, 148, 29)" stopOpacity={0.1} />
                            <stop offset="90%" stopColor="rgba(247, 148, 29)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient
                            id="colorday3"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="5%" stopColor="rgba(0, 163, 0)" stopOpacity={0.1} />
                            <stop offset="90%" stopColor="rgba(0, 163, 0)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient
                            id="colorday4"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="purple"
                              stopOpacity={0.1}
                            />
                            <stop offset="90%" stopColor="purple" stopOpacity={0.1} />
                          </linearGradient> */}
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        props.data.reduce((min, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                          });
                          const currentMin = Math.min(...values.map(Number));
                          return currentMin < min ? currentMin : min;
                        }, Infinity),
                        props.data.reduce((max, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                          });
                          const currentMax = Math.max(...values.map(Number));
                          return currentMax > max ? currentMax : max;
                        }, -Infinity),
                      ]}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Legend iconType="plainline" />

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .productionData ? (
                      <Area
                        type="monotone"
                        dataKey={props.v}
                        stroke="rgba(11,25,103,0.7)"
                        fillOpacity={1}
                        fill="rgba(11,25,103, 0.2)"
                      />
                    ) : (
                      <></>
                    )}

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .consumptionData ? (
                      <Area
                        type="monotone"
                        dataKey={props.v2}
                        stroke="rgba(247, 148, 29,0.7)"
                        fillOpacity={1}
                        fill="rgba(247, 148, 29, 0.2)"
                      />
                    ) : (
                      <></>
                    )}

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .gridData ? (
                      <Area
                        type="monotone"
                        dataKey={props.v3}
                        stroke="rgba(0, 163, 0,0.7)"
                        fillOpacity={1}
                        fill="rgba(0, 163, 0, 0.2)"
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .batteryData ? (
                      <Area
                        type="monotone"
                        dataKey={props.v4}
                        stroke="rgba(120, 90, 0,0.7)"
                        fillOpacity={1}
                        fill="rgba(196, 147, 2, 0.1)"
                      />
                    ) : (
                      <></>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              );
            case "hybrid":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <AreaChart width={100} height={500} data={props.data}>
                    <defs>
                      {/* <linearGradient id="colorday" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="rgba(11,25,103)"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="90%"
                              stopColor="rgba(11,25,103)"
                              stopOpacity={0.1}
                            />
                          </linearGradient> */}
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        props.data.reduce((min, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                          });
                          const currentMin = Math.min(...values.map(Number));
                          return currentMin < min ? currentMin : min;
                        }, Infinity),
                        props.data.reduce((max, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                          });
                          const currentMax = Math.max(...values.map(Number));
                          return currentMax > max ? currentMax : max;
                        }, -Infinity),
                      ]}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Legend iconType="plainline" />

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .productionData ? (
                      <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={props.v4}
                        // stroke="rgba(11,25,103,0.7)"
                        stroke="#FF5151"
                        fillOpacity={1}
                        // fill="rgba(11,25,103,0.2)"
                        fill="rgb(255, 81, 81, 0.2)"
                      />
                    ) : (
                      <></>
                    )}

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .consumptionData ? (
                      <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={props.v2}
                        // stroke="rgba(247, 148, 29,0.7)"
                        stroke="#FFD316"
                        fillOpacity={1}
                        // fill="rgba(247, 148, 29,0.2)"
                        fill="rgb(255, 211, 22, 0.2)"
                      />
                    ) : (
                      <></>
                    )}

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .gridData ? (
                      <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={props.v3}
                        // stroke="rgba(0, 163, 0,0.7)"
                        stroke="#455CFF"
                        fillOpacity={1}
                        // fill="rgba(0, 163, 0, 0.2)"
                        fill="rgb(69, 92, 255,0.2)"
                      />
                    ) : (
                      <></>
                    )}

                    {filterchart[projectData.value.plantmode][props.dateType]
                      .batteryData ? (
                      <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={props.v}
                        stroke="#62CE14"
                        fillOpacity={1}
                        // fill="rgba(196, 147, 2, 0.1)"
                        fill="rgba(98, 206, 20, 0.2)"
                      />
                    ) : (
                      <></>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              );
            default:
              return <></>;
          }
        })()}
      </div>
    </div>
  );
}
