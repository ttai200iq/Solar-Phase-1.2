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

export const From = (url, data, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()
      formData.append('image', data)
      formData.append('name', name)
      await axios.post(url, formData,

        {
          headers: {
            token: JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token')),
            'content-type': 'multipart/form-data'
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