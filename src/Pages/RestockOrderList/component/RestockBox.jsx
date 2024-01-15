import React from "react";
import { Box, styled } from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const RestockBox = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "4px",
            background: "grey",
            color: "white",
          }}
        >
          <h3 style={{ fontWeight: "bolder" }}>Restock Status</h3>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: ".5em",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          <Box sx={{  minHeight: "85%", minWidth: "60%" }}>
            <Box sx={{display:"flex",justifyContent:"space-between",gap:"3em",height:"16em"}}>
              <div style={{border:"1px solid blue",width:"50%",borderRadius:"7px",boxShadow:"-4px 4px 4px 1px rgba(0, 0, 0, 0.48)"}}>Restock history</div>
              <div style={{border:"1px solid blue",width:"50%",borderRadius:"7px",boxShadow:"-4px 4px 4px 1px rgba(0, 0, 0, 0.48)"}}>Restock history</div>
            </Box>
            <Box sx={{display:"flex",justifyContent:"space-between",height:"15em",gap:"3em",height:"16em",marginTop:"2.2em"}}>
              <div style={{border:"1px solid blue",width:"50%",borderRadius:"7px",boxShadow:"-4px 4px 4px 1px rgba(0, 0, 0, 0.48)"}}>Restock history</div>
              <div style={{border:"1px solid blue",width:"50%",borderRadius:"7px",boxShadow:"-4px 4px 4px 1px rgba(0, 0, 0, 0.48)"}}>Restock history</div>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RestockBox;
