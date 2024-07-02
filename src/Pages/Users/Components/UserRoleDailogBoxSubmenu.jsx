import Checkbox from "@mui/material/Checkbox";
import { Box, Collapse, Typography,Button } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
const UserRoleDailogBoxSubmenu = ({
  title,
  icon,
  childrens,
  userRights,
  setUserRights,
  refetchOneUser,
  userRoleUpdateApi,
  adminId,
  loading,
  color,
  setChecked,
  setNewExisting,
  newExisting,
  checked
}) => {


  /// initialize
  
  const handleExist = async (e, child) => {
    const newExist = {
      id: child.id,
      name: child.name,
      icon: child.icon,
      path: child.path,
    };
  
    if (e.target.checked) {
       const newUserRights = [...userRights, newExist];
      setUserRights(newUserRights);
      setNewExisting((prev)=>{
        if(prev.length > 0){
          return [...prev, newExist]

        }else{
          return [newExist]
        }
      })
    } else {

      const updatedUserRights = userRights.filter((item) => item.id !== child.id);
      const newExistingRight = newExisting.filter((item) => item.id !== child.id)
      setNewExisting(newExistingRight);
      setUserRights(updatedUserRights);
    }
  };

  

  return (
    <Box
      sx={{
        // border: '2px solid blue',
        width: "80%",
        margin: "auto",
        overflowY: "auto",
      }}
    >
      <Box
        // onClick={() => openSubmenus(!submenus)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          cursor: "pointer",
          background: color,
          color: "#fff",
          padding: ".5rem",
        }}
      >
        <i style={{ fontSize: "1rem" }} className={icon}></i>
        <Typography variant="body2">{title}</Typography>
        <ExpandMoreIcon
          sx={{
            marginLeft: "auto",
          }}
        />
      </Box>
      {/* submenus */}

      <Box>
        {childrens.map((child, index) => {
          const { id, name, path, icon } = child;
          const exist = userRights.find((item) => item.id === id);

          return (
            <Box
              key={id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: ".2rem",
              }}
            >
              <i className={icon}></i>
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                {name}
              </Typography>
              <Checkbox
                disabled={loading}
                checked={exist ? true : false}
                onChange={(e) => handleExist(e, child)}
                style={{color:color}}
              />
            </Box>
          );
        })}
      
      </Box>
     
    </Box>
  );
};

export default UserRoleDailogBoxSubmenu;
