import React, { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("infoUsers");
    window.location.replace("/sign-in");
  }, []);
  return <div></div>;
}
