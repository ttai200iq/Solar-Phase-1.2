import React from "react";
import "./Warn.scss";

import { FaSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { warnState } from "./Warn";
import { useIntl } from "react-intl";
import { IoSaveOutline } from "react-icons/io5";

export default function SettingWarn(props) {
  const dataLang = useIntl();

  return (
    <div className="DAT_SettingWarn">
      <div className="DAT_SettingWarn_Header">
        <div className="DAT_SettingWarn_Header_Left">{dataLang.formatMessage({ id: 'configwarn' })}</div>

        <div className="DAT_SettingWarn_Header_Right">
          <div className="DAT_SettingWarn_Header_Right_Save">
            <IoSaveOutline size={20} color="white" />
            <span>{dataLang.formatMessage({ id: 'save' })}</span>
          </div>
          <div className="DAT_SettingWarn_Header_Right_Close" onClick={() => (warnState.value = "default")}>
            <RxCross2
              size={20}
              color="white"
            />
          </div>
        </div>
      </div>

      <div className="DAT_SettingWarn_Body">
        <div className="DAT_SettingWarn_Body_Row1">
          <div className="DAT_SettingWarn_Body_Row1_Item">
            <input type="radio" name="radAnswer" />
            {dataLang.formatMessage({ id: 'allowNoti' })}
          </div>
          <div className="DAT_SettingWarn_Body_Row1_Item">
            <input type="radio" name="radAnswer" />
            {dataLang.formatMessage({ id: 'offNoti' })}
          </div>
        </div>

        <div className="DAT_SettingWarn_Body_Line" />
        <div className="DAT_SettingWarn_Body_Row2">
          <div className="DAT_SettingWarn_Body_Row2_Left">
            <div className="DAT_SettingWarn_Body_Row2_Left_Tit">
              {dataLang.formatMessage({ id: 'warnLevel' })}
            </div>

            <div className="DAT_SettingWarn_Body_Row2_Left_Content">
              <div>
                <input type="checkbox" />
                {dataLang.formatMessage({ id: 'notice' })}
              </div>
              <div>
                <input type="checkbox" />
                {dataLang.formatMessage({ id: 'warn' })}
              </div>
              <div>
                <input type="checkbox" />
                {dataLang.formatMessage({ id: 'fail' })}
              </div>
            </div>
          </div>

          <div className="DAT_SettingWarn_Body_Row2_Right">
            <div className="DAT_SettingWarn_Body_Row2_Right_Tit">{
              dataLang.formatMessage({ id: 'frequency' })}
            </div>
            <div className="DAT_SettingWarn_Body_Row2_Right_Content">
              <button className="DAT_SettingWarn_Body_Row2_Right_Content_Item">
                <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Tit">
                  {dataLang.formatMessage({ id: 'low' })}
                </div>
                <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Content">
                  {dataLang.formatMessage({ id: 'lowMess' })}
                </div>
              </button>
              <button className="DAT_SettingWarn_Body_Row2_Right_Content_Item">
                <div>
                  <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Tit">
                    {dataLang.formatMessage({ id: 'medium' })}
                  </div>
                  <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Content">
                    {dataLang.formatMessage({ id: 'medMess' })}
                  </div>
                </div>
              </button>
              <button className="DAT_SettingWarn_Body_Row2_Right_Content_Item">
                <div>
                  <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Tit">
                    {dataLang.formatMessage({ id: 'high' })}
                  </div>
                  <div className="DAT_SettingWarn_Body_Row2_Right_Content_Item_Content">
                    {dataLang.formatMessage({ id: 'highMess' })}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>


        <div className="DAT_SettingWarn_Body_Line" />

        <div className="DAT_SettingWarn_Body_Row4">
          <div className="DAT_SettingWarn_Body_Row4_Left">
            <div className="DAT_SettingWarn_Body_Row4_Left_Tit">
              {dataLang.formatMessage({ id: 'method' })}
            </div>
            <div className="DAT_SettingWarn_Body_Row4_Left_Content">
              <div>
                <input type="checkbox" value='web' />
                Website
              </div>
              <div>
                <input type="checkbox" />
                Email
              </div>
              <div>
                <input type="checkbox" />
                App
              </div>
            </div>
          </div>

          <div className="DAT_SettingWarn_Body_Row4_Right">
            <div className="DAT_SettingWarn_Body_Row4_Right_Tit">
              {dataLang.formatMessage({ id: 'limitdate' })}
            </div>
            <div className="DAT_SettingWarn_Body_Row4_Right_Content">
              <button className="DAT_SettingWarn_Body_Row4_Right_Content_Item">
                2
              </button>
              <button className="DAT_SettingWarn_Body_Row4_Right_Content_Item">
                10
              </button>
              <button className="DAT_SettingWarn_Body_Row4_Right_Content_Item">
                20
              </button>
              <button className="DAT_SettingWarn_Body_Row4_Right_Content_Item">
                50
              </button>
            </div>
          </div>
        </div>

        <div className="DAT_SettingWarn_Body_Line" />

        <div className="DAT_SettingWarn_Body_Row6">
          <div className="DAT_SettingWarn_Body_Row6_Tit">
            {dataLang.formatMessage({ id: 'receiveBy' })}
          </div>
          <div className="DAT_SettingWarn_Body_Row6_Content">
            <div className="DAT_SettingWarn_Body_Row6_Content_Tag">
              <div className="DAT_SettingWarn_Body_Row6_Content_Tag_Left">
                ntphu
              </div>
              <div className="DAT_SettingWarn_Body_Row6_Content_Tag_Right">
                <RxCross2 />
              </div>
            </div>

            <div className="DAT_SettingWarn_Body_Row6_Content_Tag">
              <div className="DAT_SettingWarn_Body_Row6_Content_Tag_Left">
                ntphu
              </div>
              <div className="DAT_SettingWarn_Body_Row6_Content_Tag_Right">
                <RxCross2 />
              </div>
            </div>

            <div className="DAT_SettingWarn_Body_Row6_Content_Add">
              {dataLang.formatMessage({ id: 'add' })}</div>
            <div className="DAT_SettingWarn_Body_Row6_Content_Delete">
              <div className="DAT_SettingWarn_Body_Row6_Content_Delete_Close">
                <RxCross2 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
