import React, { useEffect, useRef } from "react";
import "./ErrorSetting.scss";

import { COLOR } from "../../App";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";

export default function EditErr(props) {
  const dataLang = useIntl();
  const editVi = useRef(props.editVi);
  const editEn = useRef(props.editEn);

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

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        props.handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="DAT_EditErr">
      <div className="DAT_EditErr_Head">
        <div className="DAT_EditErr_Head_Left">
          {dataLang.formatMessage({ id: "edit" })}
        </div>
        <div className="DAT_EditErr_Head_Right">
          <div
            className="DAT_EditErr_Head_Right_Icon"
            id="Popup"
            onClick={() => props.handleClose()}
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_EditErr_Body">
        {props.type === "EDITCAUSE"
          ? <div className="DAT_EditErr_Body_Head">{dataLang.formatMessage({ id: "cause" })}</div>
          : <div className="DAT_EditErr_Body_Head">{dataLang.formatMessage({ id: "solution" })}</div>
        }
        <div className="DAT_EditErr_Body_Content">
          <div className="DAT_EditErr_Body_Content_Item"
            style={{ marginBottom: "16px" }}
          >
            <span>Vi</span>
            <textarea defaultValue={props.editVi} ref={editVi} />
          </div>

          <div className="DAT_EditErr_Body_Content_Item">
            <span>En</span>
            <textarea defaultValue={props.editEn} ref={editEn} />
          </div>
        </div>
      </div>

      <div className="DAT_EditErr_Foot">
        <button
          style={{ backgroundColor: COLOR.value.PrimaryColor, color: "white" }}
          onClick={(e) =>
            props.confirmEdit(e, editVi.current.value, editEn.current.value)
          }
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
  );
}
