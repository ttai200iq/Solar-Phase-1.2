import React, { useEffect } from "react";
import "./Report.scss";

import { editState } from "./Report";
import { signal } from "@preact/signals-react";
import { isMobile } from "../Navigation/Navigation";

import { FaSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoSaveOutline } from "react-icons/io5";

export const checkbox = signal({
  tthtc: { status: false },
  tttb: { status: false },
});

const show = signal({ id: "none", status: false });

export const CheckBox = (props) => {
  const handleShow = (e) => {
    const Check = { id: props.id, status: e.target.checked };
    show.value = Check;

    //checkbox.value[props.id].status = e.target.checked;
    //console.log(checkbox.value)
  };

  return (
    <div
      className="DAT_Edit_Body_Item_Option_Check_SingleCheck"
      style={{ width: props.width }}
    >
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id={props.id}
          onChange={(e) => {
            handleShow(e);
          }}
        ></input>
        <label
          style={{ cursor: "pointer", fontSize: "15px", color: "grey" }}
          className="form-check-label"
          htmlFor={props.id}
        >
          {props.info}
        </label>
      </div>
    </div>
  );
};

const DataReport = (props) => {
  return (
    <div className="DAT_Edit_Body_Item">
      <div className="DAT_Edit_Body_Item_Data">
        <label style={{ fontWeight: "700", margin: "0" }}>
          Daily Data Report
        </label>
        <p style={{ color: "grey", margin: "0" }}>
          View the data of the selected plants in the selected daily range,
          including plant power generation, subsystem power generation, inverter
          power generation under plant, etc.
        </p>
        <div className="DAT_Edit_Body_Item_Data_Name">
          <label>Tên báo cáo: </label>
          <input placeholder="Required Field" required></input>
        </div>
      </div>
    </div>
  );
};

export default function Create() {
  const [widthCheckBox, setWidwidthCheckBox] = React.useState("");

  const handleCloseCreate = () => {
    editState.value = false;
  };

  useEffect(() => {
    if (
      show.value.id !== "none" &&
      checkbox.value[show.value.id]?.status !== undefined
    ) {
      checkbox.value[show.value.id].status = show.value.status;
      show.value = { id: "none", status: false };
      console.log(checkbox.value);
    }
  }, [show.value]);

  useEffect(() => {
    if (isMobile.value) {
      setWidwidthCheckBox("50%");
    } else {
      setWidwidthCheckBox("25%");
    }
    console.log(isMobile.value);
  }, [isMobile.value]);

  return (
    <div>
      <div className="DAT_Edit">
        <div className="DAT_Edit_Header">
          <div className="DAT_Edit_Header_Left">
            <p style={{ fontSize: "20px" }}>Chỉnh sửa</p>
          </div>
          <div className="DAT_Edit_Header_Right">
            <div className="DAT_Edit_Header_Right_Save">
              <IoSaveOutline size={20} color="white" />
              <span>Lưu</span>
            </div>
            <div className="DAT_Edit_Header_Right_Close">
              <RxCross2 size={20} color="white" onClick={handleCloseCreate} />
            </div>
          </div>
        </div>

        <div className="DAT_Edit_Body">

          {/* <div className="DAT_Edit_Body_Item">
            <div className="DAT_Edit_Body_Item_Type">
              <h4>Loại báo cáo</h4>
              <select className="form-select form-select-sm mt-3">
                <option>Báo cáo dữ liệu hàng ngày</option>
                <option>Báo cáo dữ liệu hàng tháng</option>
                <option>Báo cáo dữ liệu hàng năm</option>
                <option>Báo cáo dữ liệu tổng</option>
              </select>
            </div>
          </div> */}

          <DataReport />

          <div className="DAT_Edit_Body_Item">
            <div className="DAT_Edit_Body_Item_Option">
              <label style={{ margin: "0" }}>Tùy chọn thông tin</label>
              <div className="DAT_Edit_Body_Item_Option_Check">
                <p style={{ color: "grey" }}>Thông tin dự án</p>
                <CheckBox info="Tên dự án" id="tda" width={widthCheckBox} />
                <CheckBox
                  info="Khu vực hành chính"
                  id="kvhc"
                  width={widthCheckBox}
                />
                <CheckBox info="Azimuth" id="az" width={widthCheckBox} />
                <CheckBox info="Góc nghiêng" id="gn" width={widthCheckBox} />
                <CheckBox info="Dung lượng" id="dl" width={widthCheckBox} />
                <CheckBox
                  info="Ngày kết nối lưới"
                  id="nknl"
                  width={widthCheckBox}
                />
                <CheckBox info="Tổng chi phí" id="tcp" width={widthCheckBox} />
                <CheckBox info="Loại nhà máy" id="lnm" width={widthCheckBox} />
                <CheckBox info="Loại hệ thống" id="lht" width={widthCheckBox} />
                <CheckBox info="Ngày tạo" id="nt" width={widthCheckBox} />
                <CheckBox info="Nhãn" id="tag" width={widthCheckBox} />
                <CheckBox
                  info="Quản lý dự án"
                  id="qlda"
                  width={widthCheckBox}
                />
              </div>

              <div
                className="DAT_Edit_Body_Item_Option_Check"
                style={{
                  border: checkbox.value.tthtc.status
                    ? "1px solid grey"
                    : "0px",
                  paddingBottom: checkbox.value["tthtc"].status ? "20px" : "0",
                  transition: "0.5s",
                }}
              >
                <div className="DAT_Edit_Body_Item_Option_Check_Head">
                  <CheckBox
                    info="Thông tin hệ thống con"
                    id="tthtc"
                    width="fit-content"
                  />
                </div>
                {checkbox.value["tthtc"].status ? (
                  <>
                    <CheckBox info="Tên dự án" id="tda" width={widthCheckBox} />
                    <CheckBox
                      info="Khu vực hành chính"
                      id="kvhc"
                      width={widthCheckBox}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div
                className="DAT_Edit_Body_Item_Option_Check"
                style={{
                  border: checkbox.value["tttb"].status
                    ? "1px solid grey"
                    : "0px",
                  paddingBottom: checkbox.value["tttb"].status ? "20px" : "0",
                  transition: "0.5s",
                }}
              >
                <div className="DAT_Edit_Body_Item_Option_Check_Head">
                  <CheckBox
                    info="Thông tin thiết bị"
                    id="tttb"
                    width="fit-content"
                  />
                </div>
                {checkbox.value["tttb"].status ? (
                  <>
                    <CheckBox
                      info="Số sê-ri thiết bị"
                      id="ssrtb"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Tên thiết bị"
                      id="ttb"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Loại thiết bị"
                      id="ltb"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Công suất dây thực tế"
                      id="csdtt"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Số sê-ri logger"
                      id="ssrlg"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Vị trí đồng hồ"
                      id="vtdh"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Tỷ lệ dòng điện"
                      id="tldd"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Tỷ lệ điện áp"
                      id="tlda"
                      width={widthCheckBox}
                    />
                    <CheckBox
                      info="Phân loại dữ liệu đồng hồ"
                      id="pldldb"
                      width={widthCheckBox}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="DAT_Edit_Body_Item">
            <div className="DAT_Edit_Body_Item_Option">
              <label style={{ margin: "0" }}>Tùy chọn dữ liệu</label>
              <div className="DAT_Edit_Body_Item_Option_Check">
                <p style={{ color: "grey" }}>Dữ liệu dự án</p>
                <CheckBox info="Sản xuất" id="sx" width={widthCheckBox} />
                <CheckBox info="Tiêu thụ" id="tt" width={widthCheckBox} />
                <CheckBox info="Lưới đưa vào" id="ldv" width={widthCheckBox} />
                <CheckBox
                  info="Năng lượng mua vào"
                  id="nlmv"
                  width={widthCheckBox}
                />
                <CheckBox info="Phí" id="p" width={widthCheckBox} />
                <CheckBox info="Xả" id="x" width={widthCheckBox} />
                <CheckBox info="Bức xạ" id="bx" width={widthCheckBox} />
                <CheckBox info="kWh/kWp" id="kwhkwp" width={widthCheckBox} />
                <CheckBox
                  info="Sản xuất lý thuyết"
                  id="sylt"
                  width={widthCheckBox}
                />
                <CheckBox info="PR" id="pr" width={widthCheckBox} />
                <CheckBox
                  info="Sản xuất tự dùng"
                  id="sxtud"
                  width={widthCheckBox}
                />
                <CheckBox
                  info="Tỷ lệ tự dùng từ sản xuất"
                  id="tltdtsx"
                  width={widthCheckBox}
                />
                <CheckBox
                  info="Tỷ lệ từ sản xuất"
                  id="tltsx"
                  width={widthCheckBox}
                />
                <CheckBox
                  info="Sản xuất đưa vào lưới"
                  id="sxdvl"
                  width={widthCheckBox}
                />
                <CheckBox
                  info="Tỷ lệ cấp lưới từ năng lượng mua"
                  id="tldrvnlmv"
                  width={widthCheckBox}
                />
                <CheckBox
                  info="Tỷ lệ từ năng lượng mua vào"
                  id="tltlmv"
                  width={widthCheckBox}
                />
                <CheckBox info="Sản xuất phí" id="sxp" width={widthCheckBox} />
                <CheckBox
                  info="Sản xuất từ xả"
                  id="sxtx"
                  width={widthCheckBox}
                />
                <CheckBox info="Tỷ lệ từ xả" id="tltx" width={widthCheckBox} />
                <CheckBox
                  info="Thu nhập từ điện"
                  id="tntd"
                  width={widthCheckBox}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
