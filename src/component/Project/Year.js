import React from "react";
import "./Project.scss";

import { projectData } from "./Project";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { useSelector } from "react-redux";
import { showUnitk } from "../../App";

export default function Year(props) {
  const filterchart = useSelector((state) => state.tool.filterchart);

  const TriangleBar = (props) => {
    const { x, y, width, height } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={props.fill}
        rx="3"
        ry="3"
        opacity="1"
      />
    );
  };

  const renderTooltipContent = (o) => {
    const { payload = [], label } = o;
    return (
      <div className="customized-tooltip-content"
        style={{ backgroundColor: "white", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
      >
        <span className="total">{`${label}`}</span>
        <div className="list">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ color: entry.color, marginTop: "8px" }}>
              {`${entry.name}: ${entry.value}(${showUnitk(entry.name)}${"W"})`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="DAT_ProjectData_Dashboard_History_Year">
      <div className="DAT_ProjectData_Dashboard_History_Year_Chart">
        {(() => {
          switch (projectData.value.plantmode) {
            case "grid":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <BarChart width={150} height={200} data={props.data}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        0,
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
                      <Bar
                        shape={<TriangleBar fill="rgba(11,25,103)" />}
                        dataKey={props.v}
                        fill="rgba(11,25,103)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(11,25,103)" }}
                      />
                    ) : (
                      <></>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              );
            case "consumption":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <BarChart width={150} height={200} data={props.data}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        0,
                        props.data.reduce((max, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                            // o: item[props.v5],
                            // p: item[props.v6],
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
                      <Bar
                        shape={<TriangleBar fill="rgba(11,25,103)" />}
                        dataKey={props.v}
                        fill="rgba(11,25,103)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(11,25,103)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .consumptionData ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(97,88,194,0.8)" />}
                        dataKey={props.v2}
                        fill="rgba(97,88,194,0.8)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(97,88,194,0.8)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .dailygridin ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(247, 148, 29)" />}
                        dataKey={props.v3}
                        fill="rgba(247, 148, 29)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(247, 148, 29)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .dailygridout ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(0, 163, 0)" />}
                        dataKey={props.v4}
                        fill="rgba(0, 163, 0)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(0, 163, 0)" }}
                      />
                    ) : (
                      <></>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              );
            case "hybrid":
              return (
                <ResponsiveContainer
                  style={{ width: "100%", height: "100%", marginLeft: "-20px" }}
                >
                  <BarChart width={150} height={200} data={props.data}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[
                        0,
                        props.data.reduce((max, item) => {
                          const values = Object.values({
                            x: item[props.v],
                            y: item[props.v2],
                            z: item[props.v3],
                            t: item[props.v4],
                            o: item[props.v5],
                            p: item[props.v6],
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
                      <Bar
                        shape={<TriangleBar fill="rgba(11,25,103)" />}
                        dataKey={props.v}
                        fill="rgba(11,25,103)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(11,25,103)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .consumptionData ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(97,88,194,0.8)" />}
                        dataKey={props.v2}
                        fill="rgba(97,88,194,0.8)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(97,88,194,0.8)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .dailygridin ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(247, 148, 29)" />}
                        dataKey={props.v3}
                        fill="rgba(247, 148, 29)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(247, 148, 29)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .dailygridout ? (
                      <Bar
                        shape={<TriangleBar fill="rgba(0, 163, 0)" />}
                        dataKey={props.v4}
                        fill="rgba(0, 163, 0)"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "rgba(0, 163, 0)" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .charge ? (
                      <Bar
                        shape={<TriangleBar fill="purple" />}
                        dataKey={props.v5}
                        fill="purple"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "purple" }}
                      />
                    ) : (
                      <></>
                    )}
                    {filterchart[projectData.value.plantmode][props.dateType]
                      .discharge ? (
                      <Bar
                        shape={<TriangleBar fill="grey" />}
                        dataKey={props.v6}
                        fill="grey"
                        barSize={15}
                        legendType="circle"
                        style={{ fill: "grey" }}
                      />
                    ) : (
                      <></>
                    )}
                  </BarChart>
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
