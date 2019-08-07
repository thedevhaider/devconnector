const axios = require("axios");

const setAuthToken = token => {
  //Check if token exists
  if (token) {
    //Token Exists. Attach it to the Auth header
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Token not exists. Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
