import React from "react";
import "./Analytics.scss";

import { anaState } from "./Analytics";
import { useIntl } from "react-intl";

import { FaSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export default function AnaCreate(props) {
  const dataLang = useIntl();
  return (
    <div className="DAT_AnaCreate">
      <div className="DAT_AnaCreate_Header">
        <div className="DAT_AnaCreate_Header_Left">{dataLang.formatMessage({ id: 'createAnal' })}</div>

        <div className="DAT_AnaCreate_Header_Right">
          <div className="DAT_AnaCreate_Header_Right_Save">
            <FaSave size={20} color="white" />
            <span>{dataLang.formatMessage({ id: 'save' })}</span>
          </div>
          <div className="DAT_AnaCreate_Header_Right_Close" onClick={() => (anaState.value = "default")}>
            <RxCross2
              size={20}
              color="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
