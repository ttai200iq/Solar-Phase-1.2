import React, { useEffect, useState } from "react";
import "./Project.scss";

import { dataproject, plantState, projectData } from "./Project";
import GoogleMap from "google-maps-react-markers";
import { isMobile } from "../Navigation/Navigation";
import moment from "moment-timezone";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { userInfor } from "../../App";
import { setKey, geocode, RequestType } from "react-geocode";
import { useIntl } from "react-intl";
import Resizer from "react-image-file-resizer";

import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { Loader } from "@googlemaps/js-api-loader";
import { FaMapMarkerAlt } from "react-icons/fa";
import { isBrowser, useMobileOrientation } from "react-device-detect";

const BasicInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleBasic = (e) => {
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const initMap = async (name, lat, long) => {

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
        projectData.value = {
          ...projectData.value,
          lat: mapsMouseEvent.latLng.toJSON().lat,
          long: mapsMouseEvent.latLng.toJSON().lng
        };

        const index = dataproject.value.findIndex(
          (item) => item.plantid_ == projectData.value.plantid_
        )
        dataproject.value[index] = {
          ...dataproject.value[index],
          lat: mapsMouseEvent.latLng.toJSON().lat,
          long: mapsMouseEvent.latLng.toJSON().lng
        }

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

    // const defaultProps = {
    //   center: {
    //     lat: lat,
    //     lng: long,
    //   },
    //   zoom: 15.0,
    //   mapId: "DEMO_MAP_ID",
    // };

    // const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    // const { Map } = await loader.importLibrary("maps");

    // let map = new Map(document.getElementById("map"), defaultProps);

    // const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
    // const markerElement = new AdvancedMarkerElement({
    //   position: marker,
    //   map: map,
    //   title: name,
    // });
    // markerElement.addListener("click", () => {
    //   // plantState.value = "info";
    //   // projectData.value = item;
    //   // sidebartab.value = "Monitor";
    //   // sidebartabli.value = "/Project";
    // });
    // return markerElement;
  };

  useEffect(() => {
    initMap(
      projectData.value.plantname,
      parseFloat(projectData.value.lat),
      parseFloat(projectData.value.long)
    );
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
        projectData.value = {
          ...projectData.value,
          lat: response.results[0].geometry.location.lat,
          long: response.results[0].geometry.location.lng,
        };
        initMap(
          projectData.value.plantname,
          response.results[0].geometry.location.lat,
          response.results[0].geometry.location.lng
        );
      })
      .catch((error) => {
        alertDispatch(dataLang.formatMessage({ id: "alert_19" }));
      });
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
    <div className="DAT_EditProject_BasicInfo">
      <div className="DAT_EditProject_BasicInfo_Tit">
        <div className="DAT_EditProject_BasicInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_BasicInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_BasicInfo_Body">
            <div className="DAT_EditProject_BasicInfo_Body_Left">
              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projname" })}
                  </span>
                </div>
                <input
                  id="plantname"
                  type="text"
                  defaultValue={projectData.value.plantname}
                  onChange={(e) => handleBasic(e)}
                />
              </div>

              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "address" })}:
                  </span>
                </div>
                {/* <input
                  id="addr"
                  type="text"
                  defaultValue={projectData.value.addr}
                  onChange={(e) => handleBasic(e)}
                /> */}

                <label htmlFor="copy-button" style={{ display: "flex", position: 'relative', alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input name="copy-button" aria-label="copy-button" id="addr" type="text" defaultValue={projectData.value.addr} style={{ padding: '5px' }} onChange={(e) => handleBasic(e)} />
                  <FaMapMarkerAlt color="red" size={20} onClick={(e) => handleMap(e)} style={{ position: 'absolute', right: '10px', cursor: "pointer" }} />
                </label>
              </div>

              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "coord" })}
                  </span>
                </div>
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi">
                  <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "longitude" })}
                    </div>
                    <input
                      id="long"
                      type="text"
                      defaultValue={projectData.value.long}
                      disabled
                    // onChange={(e) => handleBasic(e)}
                    // onClick={(e) => handleMap(e)}
                    />
                  </div>
                  <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "latitude" })}
                    </div>
                    <input
                      id="lat"
                      type="text"
                      defaultValue={projectData.value.lat}
                      disabled
                    // onChange={(e) => handleBasic(e)}
                    // onClick={(e) => handleMap(e)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_EditProject_BasicInfo_Body_Right">
              <div className="DAT_EditProject_BasicInfo_Body_Right_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "location" })}
                  </span>
                </div>
                <div className="DAT_EditProject_BasicInfo_Body_Right_Item_Content">
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
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  const handleDate = (e) => {
    projectData.value[e.currentTarget.id] = moment(
      e.currentTarget.value
    ).format("MM/DD/YYYY");
  };

  useEffect(() => {
    projectData.value["griddate"] = moment(new Date()).format("MM/DD/YYYY");
  }, []);

  return (
    <div className="DAT_EditProject_SystemInfo">
      <div className="DAT_EditProject_SystemInfo_Tit">
        <div className="DAT_EditProject_SystemInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_SystemInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_SystemInfo_Body">
            <div className="DAT_EditProject_SystemInfo_Body_Left">
              <div className="DAT_EditProject_SystemInfo_Body_Left_Item">
                <div className="DAT_EditProject_SystemInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projType" })}
                  </span>
                </div>
                <select
                  id="planttype"
                  defaultValue={projectData.value.planttype}
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

              <div className="DAT_EditProject_SystemInfo_Body_Left_Item">
                <div className="DAT_EditProject_SystemInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "electricType" })}
                  </span>
                </div>
                <select
                  id="plantmode"
                  defaultValue={projectData.value.plantmode}
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

            <div className="DAT_EditProject_SystemInfo_Body_Center">
              <div className="DAT_EditProject_SystemInfo_Body_Center_Item">
                <div className="DAT_EditProject_SystemInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "capacity" })} (kWp):
                  </span>
                </div>
                <input
                  id="capacity"
                  type="number"
                  defaultValue={projectData.value.capacity}
                  onChange={(e) => handleSystem(e)}
                />
              </div>

              <div className="DAT_EditProject_SystemInfo_Body_Center_Item">
                <div className="DAT_EditProject_SystemInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "gridData" })}:
                  </span>
                </div>
                <input
                  id="griddate"
                  type="date"
                  defaultValue={moment(projectData.value.griddate).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => handleDate(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_SystemInfo_Body_Right">
              <div className="DAT_EditProject_SystemInfo_Body_Right_Item">
                <div className="DAT_EditProject_SystemInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "tiltAngle" })}:
                  </span>
                </div>
                <input
                  id="angle"
                  type="number"
                  defaultValue={projectData.value.angle}
                  onChange={(e) => handleSystem(e)}
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

const YieldInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleYield = (e) => {
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_EditProject_YieldInfo">
      <div className="DAT_EditProject_YieldInfo_Tit">
        <div className="DAT_EditProject_YieldInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_YieldInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_YieldInfo_Body">
            <div className="DAT_EditProject_YieldInfo_Body_Left">
              <div className="DAT_EditProject_YieldInfo_Body_Left_Item">
                <div className="DAT_EditProject_YieldInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "currency" })}:
                  </span>
                </div>
                <select
                  id="currency"
                  defaultValue={projectData.value.currency}
                  onChange={(e) => handleYield(e)}
                >
                  <option value="vnd">VND</option>
                  <option value="usd">USD</option>
                </select>
              </div>
            </div>

            <div className="DAT_EditProject_YieldInfo_Body_Center">
              <div className="DAT_EditProject_YieldInfo_Body_Center_Item">
                <div className="DAT_EditProject_YieldInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "unitPrice" })} (VND/kWh):
                  </span>
                </div>
                <input
                  id="price"
                  type="number"
                  defaultValue={projectData.value.price}
                  onChange={(e) => handleYield(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_YieldInfo_Body_Right"></div>
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
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_EditProject_OwnerInfo">
      <div className="DAT_EditProject_OwnerInfo_Tit">
        <div className="DAT_EditProject_OwnerInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_OwnerInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_OwnerInfo_Body">
            <div className="DAT_EditProject_OwnerInfo_Body_Left">
              <div className="DAT_EditProject_OwnerInfo_Body_Left_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "contactName" })}:
                  </span>
                </div>
                <input
                  id="contact"
                  type="text"
                  defaultValue={projectData.value.contact}
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_OwnerInfo_Body_Center">
              <div className="DAT_EditProject_OwnerInfo_Body_Center_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "phone" })}:
                  </span>
                </div>
                <input
                  id="phone"
                  type="text"
                  defaultValue={projectData.value.phone}
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_OwnerInfo_Body_Right">
              <div className="DAT_EditProject_OwnerInfo_Body_Right_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "companyName" })}:
                  </span>
                </div>
                <input
                  id="business"
                  type="text"
                  defaultValue={projectData.value.business}
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

const ImgInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);
  const [ava, setAva] = useState(
    projectData.value.img
      ? projectData.value.img
      : "/dat_picture/solar_panel.png"
  );
  const resizeFilAvatar = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        180,
        180,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handleChooseAvatar = async (e) => {
    // setAva(URL.createObjectURL(e.target.files[0]));
    // projectData.value[e.currentTarget.id] = e.current
    var reader = new FileReader();
    if (e.target.files[0].size > 50000) {
      const image = await resizeFilAvatar(e.target.files[0]);
      reader.readAsDataURL(image);
      reader.onload = () => {
        setAva(reader.result);
        projectData.value.img = reader.result;
      };
    } else {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setAva(reader.result);
        projectData.value.img = reader.result;
      };
    }
  };

  return (
    <div className="DAT_EditProject_ImgInfo">
      <div className="DAT_EditProject_ImgInfo_Tit">
        <div className="DAT_EditProject_ImgInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_ImgInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_ImgInfo_Body">
            <div className="DAT_EditProject_ImgInfo_Body_Ava">
              <div className="DAT_EditProject_ImgInfo_Body_Ava_Img">
                <img src={ava} alt="" />
              </div>
              <input
                type="file"
                id="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handleChooseAvatar(e)}
              />
              <label htmlFor="file" style={{ cursor: "pointer" }}>
                {dataLang.formatMessage({ id: "chooseImg" })}
              </label>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default function EditProject(props) {
  const dataLang = useIntl();
  const { isLandscape } = useMobileOrientation();

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

  const handleSave = () => {
    var check = 0;
    Object.entries(projectData.value).map(([key, value]) => {
      if (projectData.value[key] === "") {
        check += 1;
      }
    });

    if (check !== 0) {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
    } else {
      const editProject = async () => {
        let d = await callApi("post", host.DATA + "/editPlant", {
          plantid: projectData.value.plantid_,
          usr: props.usr,
          name: projectData.value.plantname,
          company: projectData.value.company,
          addr: projectData.value.addr,
          long: projectData.value.long,
          lat: projectData.value.lat,
          contact: projectData.value.contact,
          phone: projectData.value.phone,
          business: projectData.value.business,
          type: projectData.value.planttype,
          mode: projectData.value.plantmode,
          griddate: projectData.value.griddate,
          capacity: projectData.value.capacity,
          angle: projectData.value.angle,
          currency: projectData.value.currency,
          price: projectData.value.price,
          production: "0",
          power: "0",
          partnerid: userInfor.value.partnerid,
          usrtype: userInfor.value.type,
          img: projectData.value.img
            ? projectData.value.img
            : "/dat_picture/solar_panel.png",
        });
        if (d.status === true) {
          alertDispatch(dataLang.formatMessage({ id: "alert_30" }));
          plantState.value = "default";
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_36" }));
        }
      };
      editProject();
    }
  };

  return (
    <div className="DAT_EditProject"
      style={{ marginBottom: isBrowser || isLandscape ? "30px" : "100px" }}
    >
      <div className="DAT_EditProject_Header">
        <div className="DAT_EditProject_Header_Left">
          {" "}
          {dataLang.formatMessage({ id: "edits" })}{" "}
        </div>

        <div className="DAT_EditProject_Header_Right">
          <div className="DAT_EditProject_Header_Right_Save"
            onClick={() => handleSave()}
          >
            <IoSaveOutline size={20} color="white" />
            <span> {dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div className="DAT_EditProject_Header_Right_Close">
            <IoClose
              size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
              onClick={() => (plantState.value = "default")}
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

      <ImgInfo
        tit={dataLang.formatMessage({ id: "imgInfo" })}
        height={isMobile.value ? "260px" : "260px"}
      />
    </div>
  );
}
