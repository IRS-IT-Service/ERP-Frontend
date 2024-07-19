// import { React, useEffect, useState } from "react";
// import { Box, styled, Button } from "@mui/material";
// import Header from "../../components/Common/Header";
// import InfoDialogBox from "../../components/Common/InfoDialogBox";
// import BulkMessageTable from "./Components/BulkMessageTable";
// import { useDispatch, useSelector } from "react-redux";
// import { setHeader, setInfo } from "../../features/slice/uiSlice";
// const DrawerHeader = styled("div")(({ theme }) => ({
//   ...theme.mixins.toolbar,
// }));

// // infoDialog box data
// const infoDetail = [
//   {
//     name: "Add Customer",
//     screenshot: (
//       <img
//         src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(3).png?updatedAt=1717227366237"
//         height={"60%"}
//         width={"90%"}
//       />
//     ),
//     instruction:
//       "If you click 'ADD CUSTOMER' then You Can Upload Bulk Customer Details with Excel File and Download Sample File",
//   },
//   {
//     name: "Send Text Message with Media",
//     screenshot: (
//       <img
//         src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(1).png?updatedAt=1717238709704"
//         height={"60%"}
//         width={"90%"}
//       />
//     ),
//     instruction:
//       "Here You can send Text Message with Media to Customer",
//   },
//   {
//     name: "Cusormer Details",
//     screenshot: (
//       <img
//         src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717227468953"
//         height={"60%"}
//         width={"90%"}
//       />
//     ),
//     instruction:
//       "Here You can See Customer Details with Customer Name, Company Name, Mobile No., Address",
//   },
// ];
// const BulkMessage = () => {
//   // infodialog state
//   const description =
//     "This is the Customer Details & Bulk Message Section ";

//     const dispatch = useDispatch();

//     const { isInfoOpen } = useSelector((state) => state.ui);
//     const handleClose = () => {
//       dispatch(setInfo(false));
//     };

//     useEffect(() => {
//       dispatch(setHeader(`Bulk Message`));
//     }, []);

//   return (
//     <Box
//       component="main"
//       sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
//     >
//       <DrawerHeader />
//       {/* <Header Name={"Bulk Message"} info={true} customOnClick={handleOpen} /> */}

//       {/* infoDialog table */}
//       <InfoDialogBox
//         infoDetails={infoDetail}
//         description={description}
//         open={isInfoOpen}
//         close={handleClose}
//       />
//       <BulkMessageTable />
//     </Box>
//   );
// };

// export default BulkMessage;

import { Box, Grid } from '@mui/material';
import React from 'react';
import chatBg from '../../../public/ChatBackground.jpeg';
import dscImage from '../../../public/dscImage.jpg';

const BulkMessage = () => {
  const items = Array.from({ length: 5 }).map((_, index) => (
    <Grid item md={3} lg={1.5} key={index}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid grey',
          gap: '10px',
          padding: '5px',
          borderRadius: '10px',
        }}
      >
        <img
          style={{ borderRadius: '50%' }}
          src='https://placeholder.com/50'
          alt='image'
        />
        <Box>
          <h5>Group Image</h5>
          <p>Time</p>
        </Box>
      </Box>
    </Grid>
  ));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingInline: '10px',
          marginTop: '80px',
          marginRight: '20px',
          marginLeft: '10px',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '50px',
          boxShadow: '2px 2px 5px 5px #eee',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <Box sx={{ border: '2px solid #eee', width: '20vw' }}>Send Box</Box>
          <Box
            sx={{
              backgroundImage: `url(${chatBg})`,
              height: '60vh',
              width: '50vw',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid #eee',
              borderRadius: '10px',
            }}
          >
            <Box
              sx={{
                border: '2px solid #eee',
                padding: '14px',
                width: '350px',
                height: '400px',
                borderRadius: '5px',
                backgroundColor: 'whitesmoke',
                position: 'relative',
              }}
            >
              <img
                style={{ borderRadius: '5px', border: '1px solid #eee' }}
                src={dscImage}
                alt='image'
                width='100%'
              />
              <p style={{ paddingBlock: '10px' }}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
                necessitatibus ut blanditiis cupiditate doloremque accusamus
                culpa repellendus tempora laudantium atque. lorem20
              </p>

              <Box>
                <p
                  style={{
                    fontSize: '0.8rem',
                    position: 'absolute',
                    bottom: 10,
                    right: 8,
                    color: 'grey',
                  }}
                >
                  14:14
                </p>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            marginTop: '50px',
            // border: '2px solid grey',
            boxShadow: '2px 1px 4px 2px grey',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            width: '100%',
          }}
        >
          <Grid container spacing={2}>
            {items}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default BulkMessage;