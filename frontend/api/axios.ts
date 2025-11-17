// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
//   withCredentials: true, // important to send/receive httpOnly cookie
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// API.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalConfig = err.config;
//     if (err.response && err.response.status === 401 && !originalConfig._retry) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalConfig.headers["Authorization"] = "Bearer " + token;
//             return axios(originalConfig);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalConfig._retry = true;
//       isRefreshing = true;

//       return new Promise(async (resolve, reject) => {
//         try {
//           // call refresh endpoint (sends cookie)
//           const response = await API.post("/auth/refresh");
//           const accessToken = response.data.accessToken;
//           API.defaults.headers.common["Authorization"] =
//             "Bearer " + accessToken;
//           processQueue(null, accessToken);
//           originalConfig.headers["Authorization"] = "Bearer " + accessToken;
//           resolve(axios(originalConfig));
//         } catch (e) {
//           processQueue(e, null);
//           reject(e);
//         } finally {
//           isRefreshing = false;
//         }
//       });
//     }
//     return Promise.reject(err);
//   }
// );

// export default API;
