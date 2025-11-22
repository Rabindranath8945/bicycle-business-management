import axios from "axios";

export default axios.create({
  baseURL: "https://mandal-cycle-pos-api.onrender.com",
  withCredentials: true,
});
