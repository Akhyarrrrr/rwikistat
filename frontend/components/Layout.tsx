import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <Navbar />
      <div className="main-content">{children}</div>
      <Sidebar />
    </div>
  );
};

export default Layout;
