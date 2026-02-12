// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../axios";

// const AdminContext = createContext(null);

// export const AdminProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get("/auth/admin/me")
//       .then((res) => setAdmin(res.data))
//       .catch(() => setAdmin(null))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <AdminContext.Provider value={{ admin,setAdmin, loading }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => useContext(AdminContext);
