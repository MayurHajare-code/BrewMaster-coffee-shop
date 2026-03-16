// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000/api",
//     withCredentials: true, // <-- sends cookies
// });

// export default api;


// https://brewmaster-coffee-shop.onrender.com

import axios from "axios";

const VITE_API_URL = "https://brewmaster-coffee-shop.onrender.com";

const api = axios.create({
    baseURL: `${VITE_API_URL}/api`,
    withCredentials: true,
});

export default api;


