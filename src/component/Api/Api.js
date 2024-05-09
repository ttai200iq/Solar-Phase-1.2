import axios from "axios"

export const callApi = (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (method === 'get') {
        await axios.get(url, {
          headers: {
            token: JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token'))
          },
          withCredentials: true
        }).then(
          function (res) {
            resolve(res.data)
          }
        )
      } else {
        return await axios.post(url, data, {
          headers: {
            token: JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token'))
          },
          withCredentials: true
        }).then(
          function (res) {
            resolve(res.data)
          }
        )
      }
    } catch (e) {
      reject(e);
    }
  });
}

export const Download = (url, data) => {
  return new Promise(async (resolve, reject) => {
    try {

      await axios.post(url, data,
        { responseType: 'blob' },
        {
          headers: {
            token: JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token'))
          },

          withCredentials: true
        }).then(
          function (res) {
            resolve(res.data)
          }
        )

    } catch (e) {
      reject(e);
    }
  });
}