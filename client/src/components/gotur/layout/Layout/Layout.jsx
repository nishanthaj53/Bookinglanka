import React from "react";

// ✅ FIX: relative imports instead of @/
import CustomCursor from "../../common/CustomCursor/CustomCursor";
import ScrollTop from "../../common/ScrollTop/ScrollTop";

const Layout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <CustomCursor />
      {children}
      <ScrollTop />
    </div>
  );
};

export default Layout;
