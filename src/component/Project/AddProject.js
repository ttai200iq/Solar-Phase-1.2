import React, { useEffect, useState } from "react";
import "./Project.scss";

import { dataproject, plantState } from "./Project";
import { isMobile } from "../Navigation/Navigation";
import { signal } from "@preact/signals-react";
// import GoogleMap from "google-maps-react-markers";
import moment from "moment-timezone";
import { setKey, geocode, RequestType } from "react-geocode";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { userInfor } from "../../App";
import { useIntl } from "react-intl";

import { IoIosArrowUp } from "react-icons/io";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { Loader } from "@googlemaps/js-api-loader";
import { FaMapMarkerAlt } from "react-icons/fa";

export const plantData = signal({
  addr: "",
  angle: "",
  business: "",
  capacity: "",
  company: "DAT Group",
  contact: "",
  createdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
  currency: "vnd",
  griddate: "",
  lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
  lat: "",
  long: "",
  phone: "",
  plantmode: "grid",
  plantname: "",
  planttype: "residential",
  power: "0",
  price: "",
  production: "0",
  state: 0,
  warn: 0,
});

const BasicInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const initMap = async (name, lat, long, state) => {

    loader.load().then(async (google) => {
      const defaultProps = {
        center: {
          lat: lat,
          lng: long,
        },
        zoom: 15.0,
        mapId: "DEMO_MAP_ID",
      };

      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      let map = new Map(document.getElementById("map"), defaultProps);

      const myLatlng = { lat: lat, lng: long };

      let infoWindow = new google.maps.InfoWindow({
        content: 'Your position',
        position: myLatlng,
      });

      // Configure the click listener.
      map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
          JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
        );
        infoWindow.open(map);
        var long_ = document.getElementById("long");
        var lat_ = document.getElementById("lat");
        lat_.value = mapsMouseEvent.latLng.toJSON().lat;
        long_.value = mapsMouseEvent.latLng.toJSON().lng;
        plantData.value = {
          ...plantData.value,
          lat: mapsMouseEvent.latLng.toJSON().lat,
          long: mapsMouseEvent.latLng.toJSON().lng,
        };

      });

      if (state) {
        const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
        const markerElement = new AdvancedMarkerElement({
          position: marker,
          map: map,
          title: name,
        });
        return markerElement;
      }
    })

    // const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    // const { Map } = await loader.importLibrary("maps");
    // const { InfoWindow } = await loader.importLibrary("infowindow");

    // let map = new Map(document.getElementById("map"), defaultProps);
    // if (state) {
    //   const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
    //   const markerElement = new AdvancedMarkerElement({
    //     position: marker,
    //     map: map,
    //     title: name,
    //   });
    // markerElement.addListener("click", () => {
    //   // plantState.value = "info";
    //   // projectData.value = item;
    //   // sidebartab.value = "Monitor";
    //   // sidebartabli.value = "/Project";
    // });
    // return markerElement;
    // }
  };

  useEffect(() => {
    initMap("", 16.123456789, 108.123456789, false);
  }, []);

  const handleMap = (e) => {
    const addr = document.getElementById("addr");
    setKey(process.env.REACT_APP_GGKEY);
    geocode(RequestType.ADDRESS, addr.value)
      .then((response) => {
        var long_ = document.getElementById("long");
        var lat_ = document.getElementById("lat");
        lat_.value = response.results[0].geometry.location.lat;
        long_.value = response.results[0].geometry.location.lng;
        plantData.value = {
          ...plantData.value,
          lat: response.results[0].geometry.location.lat,
          long: response.results[0].geometry.location.lng,
        };
        initMap(
          plantData.value.plantname,
          response.results[0].geometry.location.lat,
          response.results[0].geometry.location.lng,
          true
        );
      })
      .catch((error) => {
        alertDispatch(dataLang.formatMessage({ id: "alert_19" }));
      });
  };

  const handleBasic = (e) => {
    plantData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_AddProject_BasicInfo">
      <div className="DAT_AddProject_BasicInfo_Tit">
        <div className="DAT_AddProject_BasicInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_BasicInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <div className="DAT_AddProject_BasicInfo_Body">
            <div className="DAT_AddProject_BasicInfo_Body_Left">
              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projname" })}
                  </span>
                </div>
                <input
                  id="plantname"
                  type="text"
                  onChange={(e) => handleBasic(e)}
                />
              </div>

              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "address" })}:
                  </span>
                </div>
                {/* <input id="addr" type="text" onChange={(e) => handleBasic(e)} /> */}

                <label htmlFor="copy-button" style={{ display: "flex", position: 'relative', alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input name="copy-button" aria-label="copy-button" id="addr" type="text" style={{ padding: '5px' }} onChange={(e) => handleBasic(e)} />
                  <FaMapMarkerAlt color="red" size={20} onClick={(e) => handleMap(e)} style={{ position: 'absolute', right: '10px', cursor: "pointer" }} />
                </label>


              </div>

              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "coord" })}
                  </span>
                </div>
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi">
                  <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "longitude" })}
                    </div>
                    <input
                      id="long"
                      type="text"
                      // onChange={(e) => handleBasic(e)}
                      // onClick={(e) => handleMap(e)}
                      disabled
                      required
                    />
                  </div>
                  <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "latitude" })}
                    </div>
                    <input
                      id="lat"
                      type="text"
                      // onChange={(e) => handleBasic(e)}
                      // onClick={(e) => handleMap(e)}
                      disabled
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_AddProject_BasicInfo_Body_Right">
              <div className="DAT_AddProject_BasicInfo_Body_Right_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "location" })}
                  </span>
                </div>
                <div className="DAT_AddProject_BasicInfo_Body_Right_Item_Content">
                  <div id="map" style={{ width: "100%", height: "100%" }}></div>
                  {/* <GoogleMap
                    apiKey={process.env.REACT_APP_GGKEY}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                  //onGoogleApiLoaded={onGoogleApiLoaded}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const SystemInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleSystem = (e) => {
    plantData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  const handleDate = (e) => {
    plantData.value[e.currentTarget.id] = moment(e.currentTarget.value).format(
      "MM/DD/YYYY"
    );
  };

  useEffect(() => {
    plantData.value["griddate"] = moment(new Date()).format("MM/DD/YYYY");
  }, []);

  return (
    <div className="DAT_AddProject_SystemInfo">
      <div className="DAT_AddProject_SystemInfo_Tit">
        <div className="DAT_AddProject_SystemInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_SystemInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <form className="DAT_AddProject_SystemInfo_Body">
            <div className="DAT_AddProject_SystemInfo_Body_Left">
              <div className="DAT_AddProject_SystemInfo_Body_Left_Item">
                <div className="DAT_AddProject_SystemInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projType" })}
                  </span>
                </div>
                <select
                  id="planttype"
                  defaultValue={plantData.value["planttype"]}
                  onChange={(e) => handleSystem(e)}
                >
                  <option value="residential">
                    {dataLang.formatMessage({ id: "household" })}
                  </option>
                  <option value="industrial">
                    {dataLang.formatMessage({ id: "factory" })}
                  </option>
                </select>
              </div>

              <div className="DAT_AddProject_SystemInfo_Body_Left_Item">
                <div className="DAT_AddProject_SystemInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "electricType" })}
                  </span>
                </div>
                <select
                  id="plantmode"
                  defaultValue={plantData.value["plantmode"]}
                  onChange={(e) => handleSystem(e)}
                >
                  <option value="grid">
                    {dataLang.formatMessage({ id: "gridType" })}
                  </option>
                  <option value="consumption">
                    {dataLang.formatMessage({ id: "consumptionType" })}
                  </option>
                  <option value="hybrid">
                    {dataLang.formatMessage({ id: "hybridType" })}
                  </option>
                  {/* <option value="ESS">{dataLang.formatMessage({ id: 'ESS' })}</option> */}
                  {/* <option value="pump">Hệ thống solar pump</option> */}
                </select>
              </div>
            </div>

            <div className="DAT_AddProject_SystemInfo_Body_Center">
              <div className="DAT_AddProject_SystemInfo_Body_Center_Item">
                <div className="DAT_AddProject_SystemInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "capacity" })} (kWp):
                  </span>
                </div>
                <input
                  id="capacity"
                  type="number"
                  onChange={(e) => handleSystem(e)}
                  required
                />
              </div>

              <div className="DAT_AddProject_SystemInfo_Body_Center_Item">
                <div className="DAT_AddProject_SystemInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "gridData" })}:
                  </span>
                </div>
                <input
                  id="griddate"
                  type="date"
                  defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={(e) => handleDate(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_SystemInfo_Body_Right">
              <div className="DAT_AddProject_SystemInfo_Body_Right_Item">
                <div className="DAT_AddProject_SystemInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "tiltAngle" })}:
                  </span>
                </div>
                <input
                  id="angle"
                  type="number"
                  placeholder="0~90"
                  onChange={(e) => handleSystem(e)}
                />
              </div>
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const YieldInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleYield = (e) => {
    plantData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_AddProject_YieldInfo">
      <div className="DAT_AddProject_YieldInfo_Tit">
        <div className="DAT_AddProject_YieldInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_YieldInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <div className="DAT_AddProject_YieldInfo_Body">
            <div className="DAT_AddProject_YieldInfo_Body_Left">
              <div className="DAT_AddProject_YieldInfo_Body_Left_Item">
                <div className="DAT_AddProject_YieldInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "currency" })}:
                  </span>
                </div>
                <select
                  id="currency"
                  defaultValue={plantData.value["currency"]}
                  onChange={(e) => handleYield(e)}
                >
                  <option value="vnd">VND</option>
                  <option value="usd">USD</option>
                </select>
              </div>
            </div>

            <div className="DAT_AddProject_YieldInfo_Body_Center">
              <div className="DAT_AddProject_YieldInfo_Body_Center_Item">
                <div className="DAT_AddProject_YieldInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "unitPrice" })} (VND/kWh):
                  </span>
                </div>
                <input
                  id="price"
                  type="number"
                  onChange={(e) => handleYield(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_YieldInfo_Body_Right"></div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const OwnerInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleOwner = (e) => {
    plantData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_AddProject_OwnerInfo">
      <div className="DAT_AddProject_OwnerInfo_Tit">
        <div className="DAT_AddProject_OwnerInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_OwnerInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <div className="DAT_AddProject_OwnerInfo_Body">
            <div className="DAT_AddProject_OwnerInfo_Body_Left">
              <div className="DAT_AddProject_OwnerInfo_Body_Left_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "contactName" })}:
                  </span>
                </div>
                <input
                  id="contact"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_OwnerInfo_Body_Center">
              <div className="DAT_AddProject_OwnerInfo_Body_Center_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "phone" })}:
                  </span>
                </div>
                <input
                  id="phone"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_OwnerInfo_Body_Right">
              <div className="DAT_AddProject_OwnerInfo_Body_Right_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "companyName" })}:
                  </span>
                </div>
                <input
                  id="business"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

// const ImgInfo = (props) => {
//   const dataLang = useIntl()
//   const [state, setState] = useState(true);
//   const [ava, setAva] = useState();

//   const handleChooseAvatar = (e) => {
//     setAva(URL.createObjectURL(e.target.files[0]));
//   };

//   return (
//     <div className="DAT_AddProject_ImgInfo">
//       <div className="DAT_AddProject_ImgInfo_Tit">
//         <div className="DAT_AddProject_ImgInfo_Tit_Left">{props.tit}</div>

//         <div className="DAT_AddProject_ImgInfo_Tit_Right"
//           onClick={() => setState(!state)}
//         >
//           <IoIosArrowUp
//             size={20}
//             style={{
//               transform: state ? "rotate(0deg)" : "rotate(180deg)",
//               transition: "0.5s",
//             }}
//           />
//         </div>
//       </div>

//       <div
//         style={{
//           height: state ? props.height : "0px",
//           transition: "0.5s",
//           overflow: "hidden",
//         }}
//       >
//         {state ? (
//           <div className="DAT_AddProject_ImgInfo_Body">
//             <div className="DAT_AddProject_ImgInfo_Body_Ava">
//               <div className="DAT_AddProject_ImgInfo_Body_Ava_Img">
//                 <img src={ava} alt="" />
//               </div>
//               <input
//                 type="file"
//                 id="file"
//                 accept="image/png, image/gif, image/jpeg"
//                 onChange={(e) => handleChooseAvatar(e)}
//               />
//               <label htmlFor="file" style={{ cursor: "pointer" }}>
//                 {dataLang.formatMessage({ id: 'chooseImg' })}
//               </label>
//             </div>
//           </div>
//         ) : (
//           <></>
//         )}
//       </div>
//     </div>
//   );
// }

export default function AddProject(props) {
  const dataLang = useIntl();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleSaveBasic = () => {
    var check = 0;
    Object.entries(plantData.value).map(([key, value]) => {
      if (plantData.value[key] === "") {
        check += 1;
      }
    });

    if (check !== 0) {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
    } else {
      const addProject = async () => {
        let d = await callApi("post", host.DATA + "/addPlant", {
          usr: props.usr,
          name: plantData.value.plantname,
          company: plantData.value.company,
          addr: plantData.value.addr,
          long: plantData.value.long,
          lat: plantData.value.lat,
          contact: plantData.value.contact,
          phone: plantData.value.phone,
          business: plantData.value.business,
          type: plantData.value.planttype,
          mode: plantData.value.plantmode,
          griddate: plantData.value.griddate,
          capacity: plantData.value.capacity,
          angle: plantData.value.angle,
          currency: plantData.value.currency,
          price: plantData.value.price,
          production: plantData.value.production,
          power: plantData.value.power,
          partnerid: userInfor.value.partnerid,
        });
        if (d.status === true) {
          alertDispatch(dataLang.formatMessage({ id: "alert_29" }));
          dataproject.value = [...dataproject.value, d.data];
          plantState.value = "default";
          plantData.value = {
            addr: "",
            angle: "",
            business: "",
            capacity: "",
            company: "DAT Group",
            contact: "",
            createdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
            currency: "vnd",
            griddate: "",
            lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
            lat: "",
            long: "",
            phone: "",
            plantmode: "grid",
            plantname: "",
            planttype: "residential",
            power: "0",
            price: "",
            production: "0",
            state: 0,
            warn: 0,
          };
        }
      };

      addProject();
    }
  };

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        plantState.value = "default";
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantState.value]);

  return (
    <div className="DAT_AddProject">
      <div className="DAT_AddProject_Header">
        <div className="DAT_AddProject_Header_Left">
          {dataLang.formatMessage({ id: "addProj" })}
        </div>

        <div className="DAT_AddProject_Header_Right">
          <div className="DAT_AddProject_Header_Right_Save"
            onClick={() => handleSaveBasic()}
          >
            <IoSaveOutline size={20} color="white" />
            <span>{dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div className="DAT_AddProject_Header_Right_Close"
            onClick={() => (plantState.value = "default")}
          >
            <IoClose
              size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            />
          </div>
        </div>
      </div>

      <BasicInfo
        tit={dataLang.formatMessage({ id: "basicInfo" })}
        height={isMobile.value ? "580px" : "300px"}
      />

      <SystemInfo
        tit={dataLang.formatMessage({ id: "systemInfo" })}
        height={isMobile.value ? "440px" : "190px"}
      />

      <YieldInfo
        tit={dataLang.formatMessage({ id: "yieldInfo" })}
        height={isMobile.value ? "180px" : "100px"}
      />

      <OwnerInfo
        tit={dataLang.formatMessage({ id: "ownerInfo" })}
        height={isMobile.value ? "270px" : "100px"}
      />

      {/* <ImgInfo
        tit={dataLang.formatMessage({ id: 'imgInfo' })}
        height={isMobile.value ? "320px" : "260px"}
      /> */}
    </div>
  );
}
