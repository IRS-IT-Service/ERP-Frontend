import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import CreateBoxOpen from "./Components/CreateBoxOpen";
import Header from "../../components/Common/Header";
import InfoDialogBox from '../../components/Common/InfoDialogBox';

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Scan Barcode Input',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/scanBarcodeComponent.png?updatedAt=1703074163650'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Enter the barcode here to input all the data.`,
  },
];

const OpenBox = () => {

  const description = `In the Box Open section, you are required to scan the barcode of the product component. Afterward, you need to fill in data such as status and action.`;

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      <Header
        Name={'Box open section'}
        info={true}
        customOnClick={handleOpen}
      />

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />

      <CreateBoxOpen />
    </Box>
  );
};

export default OpenBox;
