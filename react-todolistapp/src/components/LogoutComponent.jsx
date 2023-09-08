import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function LogoutComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login",{replace:true});
  };

  const buttonContainerStyle = {
    float: "right",
    margin: "10px",
  };

  return (
    <Box style={buttonContainerStyle}>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </Box>
  );
}

export default LogoutComponent;
