import React, { useEffect, useState } from 'react';
import './Verify.scss';

import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';

export default function Verify(props) {
    const dataLang = useIntl();
    const [searchParams, setSearchParams] = useSearchParams();
    const [notif, setNotif] = useState();

    useEffect(() => {
        var id = searchParams.get("id")
        if (id === null) {
            setNotif("Link Error!")
        } else {
            const Verify = async () => {
                let res = await callApi('get', host.AUTH + '/Verify?id=' + id)
                console.log(res)
                if (res.status) {
                    setNotif(dataLang.formatMessage({ id: 'alert_1' }))
                } else {
                    if (res.number === 1) {
                        setNotif(dataLang.formatMessage({ id: 'alert_2' }))
                    } else if (res.number === 2) {
                        setNotif(dataLang.formatMessage({ id: 'alert_3' }))
                    } else {
                        setNotif(dataLang.formatMessage({ id: 'alert_4' }))
                    }
                }
            }

            const VerifyRegister = async () => {
                let res = await callApi('get', host.AUTH + '/VerifyRegister?id=' + id)
                console.log(res)
                if (res.status) {
                    setNotif(dataLang.formatMessage({ id: 'alert_9' }))
                } else {
                    if (res.number === 1) {
                        setNotif(dataLang.formatMessage({ id: 'alert_16' }))
                    } else if (res.number === 0) {
                        setNotif(dataLang.formatMessage({ id: 'alert_10' }))
                    } else if (res.number === 3) {
                        setNotif(dataLang.formatMessage({ id: "alert_2" }))
                    } else {
                        setNotif(dataLang.formatMessage({ id: 'alert_7' }))
                    }
                }
            }

            if (props.path === '/Verify') {
                Verify();
            } else {
                VerifyRegister();
            }
        }
    }, [])

    return (
        <div className='DAT_Verify'>
            <div className="DAT_Login_Head">
                <div className="DAT_Login_Head_Logo">
                    <img src={"/dat_icon/Embody_APP_24.png"} alt="" />
                </div>

                <div className="DAT_Login_Head_Title">
                    <div className="DAT_Login_Head_Title_Main">
                        {/* <img src={"/dat_icon/Embody_APP_27.png"} width={'150px'} height={'30px'} alt='' ></img> */}
                        AIOT Energy
                    </div>
                    <div className="DAT_Login_Head_Title_Sub">
                        {dataLang.formatMessage({ id: "sologon" })}{" "}
                    </div>
                </div>

            </div>
            <div className='DAT_Verify_Form' >
                <div className="DAT_Verify_Form-note" style={{ textAlign: 'justify' }} >
                    {notif}
                </div>
                <div className="DAT_Verify_Form-footer">
                    <span></span>
                    <span onClick={() => { window.location.href = '/Login' }} >{dataLang.formatMessage({ id: 'login' })}</span>
                </div>
            </div>
            <div className="DAT_Login_Footer">
        <div className="DAT_Login_Footer_Info">
          <span className="DAT_Login_Footer_Info_Version">
            {dataLang.formatMessage({ id: "version" })}:{" "}
            {process.env.REACT_APP_VER}
          </span>
          &nbsp;
          <span className="DAT_Login_Footer_Info_Title">Embody Platform</span>
        </div>
      </div>
        </div>
    );
}
