import React, { useEffect } from "react";
import { UseUser } from "../context/MainContext";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const navigate = useNavigate();
  const { loading } = UseUser();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    }
  }, [token, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return null;
  }
  return <>{children}</>;
};

export default UserAuth;
