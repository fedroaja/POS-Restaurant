import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function Cashier() {
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      let myUser = await fetch("http://localhost:5000/auth", {
        method: "get",
        credentials: "include",
      });
      let myRes = await myUser.json();

      if (myRes.ECode === 0) {
        if (myRes.role !== 1) {
          navigate("/notfound");
        }
      }
    })();

    // const auth = JSON.parse(localStorage.getItem('user'));
    // if(!auth) navigate("/login");
    // else if(auth.role !== 1) {
    //     localStorage.clear();
    //     navigate("/login")
    // }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100wh" }}>
      <Loading type={"bubbles"} size={150} />
    </div>
  );
}

export default Cashier;
