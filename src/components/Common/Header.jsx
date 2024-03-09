import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { setInfo } from "../../features/slice/uiSlice";
import { useDispatch } from "react-redux";

const Header = ({ Name, info}) => {
const dispatch = useDispatch()

  const handleOpen = () => {
    dispatch(setInfo(true))
  };

  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      margin:"5px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: "Inter",
        fontSize: "15px",
  
        // color: "#767171",
        lineHeight: "normal",
      }}
    >
        <h2 className=" ">
          {Name}
          {"  "}
        </h2>

        <h2
          style={{
            marginLeft: "1rem",
          }}
        >
          {info ? (
            <Tooltip title="Click Me for Module Info" placement="bottom" arrow>
              <IconButton
                sx={{
                  borderRadius: "1rem",
                  color: "#c2c2c2",
                  fontWeight: "bold",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
                onClick={handleOpen}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </h2>
      </div>
      <h3></h3>
    </Box>
  );
};

export default Header;
