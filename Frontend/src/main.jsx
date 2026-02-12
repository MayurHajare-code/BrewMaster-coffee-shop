import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import { AdminProvider } from "./Context/AdminContext.jsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartProvider } from "./Context/CartContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AdminProvider> */}
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    {/* </AdminProvider> */}
  </StrictMode>,
);
