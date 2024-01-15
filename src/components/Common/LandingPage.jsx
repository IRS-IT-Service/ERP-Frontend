import React from "react";
import { Box, Typography } from "@mui/material";
// import { AiOutlineArrowDown } from 'react-icons/ai';
import bookApp from "../../assets/LandingPage/Book-app.svg";
import arrow from "../../assets/LandingPage/arrow.svg";
import og_1 from "../../assets/LandingPage/og-1.svg";
import ps from "../../assets/LandingPage/ps.svg";
import be from "../../assets/LandingPage/be.svg";
import cd from "../../assets/LandingPage/cd.svg";
import dis from "../../assets/LandingPage/dis.svg";
import hp from "../../assets/LandingPage/hp.svg";
import og_2 from "../../assets/LandingPage/og-2.svg";
import ld from "../../assets/LandingPage/truck.svg";
import irs from "../../assets/irs.png";
import dispatch from "../../assets/LandingPage/dispatch.svg";
import ecp from "../../assets/LandingPage/ecp.svg";
import courier from "../../assets/LandingPage/courier.svg";

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "85vh",
        marginTop: "0.5rem",
      }}
    >
      {/* left */}
      <Box
        sx={{
          width: "24rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* order generator */}
        {renderItem(
          og_1,
          "Order Generate Overseas",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
        {/* Product Shipment */}
        {renderItem(
          ps,
          "Product Shipment",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
        {/* E - Commerce Portal */}
        {renderItem(
          ecp,
          "E - Commerce Portal",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "13px",
          "2px"
        )}
        {/* Barcode Entry */}
        {renderItem(
          be,
          "Barcode Entry",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}

        {/* Customer Dealings */}
        {renderItem(
          cd,
          "Customer Dealings",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
      </Box>

      {/* middle */}
      <Box
        sx={{
          width: "40%",
          height: "100%",
          marginTop: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#dee8f5",
            width: "30rem",
            gap: "10px",
            height: "4rem",
            borderRadius: "0.8rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* <Box sx={{ width: '2.5rem', height: '1rem', display: 'flex', flexDirection: 'column',justifyContent:"space-evenly" }}>  <img
            src={irs}
            alt="Arrow"
            style={{ objectFit: 'contain', objectPosition: 'center', width: '100%'}}
       
          /> 
          </Box> */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "0.2rem",
              color: "#4459ff",
              textTransform: "uppercase",
              textShadow:
                "1px 1px 2px #607aff, 0 0 1em blue, 0 0 0.2em #4459ff",
            }}
          >
            Welcome To{" "}
            <span
              style={{
                color: "#fff",
                fontSize: "25px",
                background: "#4459ff",
                borderRadius: "50%",
                padding: "8px",
                textShadow: "none",
                fontFamily: "serif",
              }}
            >
              IRS
            </span>{" "}
            Admin Portal
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "6rem",
          }}
        >
          <img
            src={bookApp}
            alt="Book App"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              width: "100%",
              marginTop: "4rem",
            }}
          />

          <img
            src={arrow}
            alt="Arrow"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              width: "100%",
            }}
          />
        </Box>
      </Box>

      {/* right */}
      <Box
        sx={{
          width: "24rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Order Generate */}
        {renderItem(
          og_2,
          "Order Generate",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
        {/* Logistics Department */}
        {renderItem(
          ld,
          "Logistics Department",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "13px",
          "2px"
        )}
        {/* Courier */}
        {renderItem(
          courier,
          "Courier",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
        {/* Dispatch */}
        {renderItem(
          dispatch,
          "Dispatch",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
        {/* Happy Customer */}

        {renderItem(
          hp,
          "Happy Customer",
          "linear-gradient(0deg, #6883ff, #607aff,#4459ff)",
          "15px",
          "2px"
        )}
      </Box>
    </Box>
  );
};

const renderItem = (imgSrc, title, bgColor, fontSize, letterSpacing) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2",
      width: "80%",
      height: "22%",
    }}
  >
    <img src={imgSrc} alt={title} style={{ width: "60px", height: "60px" }} />

    <Box
      sx={{
        width: "100%",
        height: "45px",
        marginRight: "20px",
        marginBottom: "0.1rem",
        marginLeft: "20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundImage: bgColor,
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: "#fff", fontSize, fontWeight: "bold", letterSpacing }}
      >
        {title}
      </Typography>
    </Box>
    {title !== "Happy Customer" && title !== "Customer Dealings" && (
      <i className="fa-solid fa-arrow-down" style={{ fontSize: "1.5rem" }}></i>
    )}
  </Box>
);

export default LandingPage;
