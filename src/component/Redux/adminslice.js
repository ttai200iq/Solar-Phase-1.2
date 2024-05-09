import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "admin",
  initialState: {
    usr: "",
    mail: "",
    lang: "vi",
    status: false,
  },
  reducers: {
    setusr: (state, action) => {
      state.usr = action.payload;
    }, // type: 'admin/setuser'
    setmail: (state, action) => {
      state.mail = action.payload;
    },
    setlang: (state, action) => {
      state.lang = action.payload;
    }, // type: 'admin/setuser'
    setstatus: (state, action) => {
      state.status = action.payload;
    },
  },
});
