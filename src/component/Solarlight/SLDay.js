import React from "react";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, } from "recharts";
import { useSelector } from "react-redux";
import { showUnitk } from "../../App";
import { slProjectData } from "./SLProjectlist";

export default function SLDay(props) {
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
    <div className="DAT_ProjectData_NewDashboard_History_Day">
      <div className="DAT_ProjectData_NewDashboard_History_Year_Chart">
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

            {filterchart[slProjectData.value.plantmode][props.dateType]
              .batteryVoltage ? (
              <Area
                type="monotone"
                strokeWidth={2}
                dataKey={props.v}
                stroke="#455CFF"
                fill="rgb(69, 92, 255,0.2)"
                fillOpacity={1}
              />
            ) : (
              <></>
            )}

            {filterchart[slProjectData.value.plantmode][props.dateType]
              .ledLighting ? (
              <Area
                type="monotone"
                strokeWidth={2}
                dataKey={props.v2}
                stroke="#62CE14"
                fill="rgba(98, 206, 20, 0.2)"
                fillOpacity={1}
              />
            ) : (
              <></>
            )}

            {filterchart[slProjectData.value.plantmode][props.dateType]
              .pvVoltage ? (
              <Area
                type="monotone"
                strokeWidth={2}
                dataKey={props.v3}
                stroke="#FF5151"
                fill="rgb(255, 81, 81, 0.2)"
                fillOpacity={1}
              />
            ) : (
              <></>
            )}

            {filterchart[slProjectData.value.plantmode][props.dateType]
              .ledPower ? (
              <Area
                type="monotone"
                strokeWidth={2}
                dataKey={props.v4}
                stroke="#FFD316"
                fill="rgb(255, 211, 22, 0.2)"
                fillOpacity={1}
              />
            ) : (
              <></>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
