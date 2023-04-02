import React, { lazy, useEffect, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import SidebarMenu from "../../components/admin/SidebarMenu";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    (async function () {
      let myUser = await fetch("http://localhost:5000/auth", {
        method: "get",
        credentials: "include",
      });
      let myRes = await myUser.json();

      if (myRes.ECode === 0) {
        if (myRes.role !== 0) {
          navigate("/notfound");
        }
      } else {
        navigate("/login");
      }
      setIsLoad(false);
    })();
    navigate("/admin/dashboard");

    // const auth = JSON.parse(localStorage.getItem('user'));
    // if(!auth) navigate("/login");
    // else if(auth.role !== 0) {
    //   navigate("/notfound")
    // }
  }, []);

  return (
    <div>
      {isLoad ? (
        ""
      ) : (
        <ProSidebarProvider>
          <SidebarMenu />
        </ProSidebarProvider>
      )}
    </div>
  );
}

export default Admin;
