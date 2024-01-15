import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Header = ({ Name, info, customOnClick }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        padding: "0.3rem",
        border: "solid 1px #fff",
        boxShadow: "4px 4px 8px 0 rgba(111, 107, 107, 0.25);",
         marginBottom: "0.1rem",
      }}
    >
      <div
        style={{
          width: "80vw",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: "50%",
          fontFamily: "Inter",
          letterSpacing: "-0.48px",
          color: "#767171",
          lineHeight: "normal",
          letterSpacing: "-0.48px",
          marginLeft: "4.5rem",
          marginBottom: "0.4rem",
        }}
      >
        <h2 className=" ">
          {Name}
          {"  "}
        </h2>

        <h2
          style={{
            marginLeft: "2rem",
          }}
        >
          {info ? (
            <Tooltip title="Click Me for Module Info" placement="bottom" arrow>
              <IconButton
                sx={{
                  borderRadius: "1rem",
                  color: "black",
                  fontWeight: "bold",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
                onClick={customOnClick}
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
