import React from "react";

// ✅ FIX: relative imports instead of @/
import CustomCursor from "../../common/CustomCursor/CustomCursor";
import ScrollTop from "../../common/ScrollTop/ScrollTop";
import MobileNavDrawer from "../MobileNavDrawer/MobileNavDrawer";

const Layout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <CustomCursor />
      {children}
      <MobileNavDrawer />
      <ScrollTop />
    </div>
  );
};

export default Layout;
