import axios from "axios";

const API_BASE_URL = "https://mandal-cycle-pos-api.onrender.com";
// or http://192.168.x.x:5000 when testing on local network

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
