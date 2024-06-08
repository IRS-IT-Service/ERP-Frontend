import { React, useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
  InputAdornment,
  CircularProgress,
  InputBase,
  IconButton,
  Box,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoDialogBox from "../../../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../../../features/slice/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetSingleOrderQuery } from "../../../../features/api/RestockOrderApiSlice";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../../commonFunctions/commonFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddshipmentDial from "../../../PackagingAndClient/createOrderShipment/AddshimentpartsDial";
import { toast } from "react-toastify";

import AccordionComp from "./AccordionComp";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
}));

const StyledCellHeader = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  background: "#5E95FE",
  color: "black",
  padding: 1.5,
  fontWeight: "thin",
  fontSize: ".8rem",
}));

const StyledBox = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: ".4rem",
  padding: ".2rem",
  border: "2px solid #3385ff",
  justifyContent: "space-between",
  borderRadius: ".4rem",
  boxShadow: "-3px 3px 4px 0px #404040",
  height: "2rem",
  backgroundColor: "#00508D",
  color: "#fff",
}));

const infoDetail = [
  {
    name: "Save",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/save_costCalculator.png?updatedAt=1703223683718"
        height={"50%"}
        width={"50%"}
      />
    ),
    instruction:
      "If you click 'View,' you can save the price for that particular price list",
  },
];

const SubPIList1 = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data: getSingleData, isLoading ,refetch} = useGetSingleOrderQuery(id);

  const { isInfoOpen } = useSelector((state) => state.ui);
  useEffect(() => {
    dispatch(setHeader(`Sub List`));
  }, []);
  const description1 =
    "This is a Price Calculator where you can calculate the price ";
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0, width: "100%" }}>
      <DrawerHeader />

      <Box
        sx={{
          marginTop: "10px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            gap: "10px",
            width: "100%",
            height: "8vh",
            paddingX: "10px",
          }}
        >
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Date :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {formatDate(getSingleData?.data?.paymentDate)}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Assigned to :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data.vendorCompany}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Concern Person :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data?.vendorConcernPerson}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              PI NO :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data.piNo}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Paid Amount :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              $ {getSingleData?.data.paymentAmountUSD}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              ShortFall :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              $ {getSingleData?.data.restUSDAmount}
            </Typography>
          </StyledBox>
        </Box>
        <Box sx={{
          display:"flex",
          flexDirection: "column",
          gap:"5px",

          height: "100%",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "10px",
      
        }}>
        <AccordionComp getSingleData={getSingleData} refetch ={refetch} />
        <Box
          sx={{
            marginTop: "10px",
            maxHeight: "40vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px",
           
          
          }}
        >
         {getSingleData?.data?.subOrders && <Typography fontSize="12px" fontWeight="bold">
            Sub List
          </Typography> }
          {getSingleData?.data?.subOrders?.map((item, index) => {
            return (
           
              <AccordionComp
                key={index}
                getSingleData={getSingleData}
                item={item}
                AccordFor={"SubPI"}
                refetch={refetch}
              />
              
            );
          })}
        </Box>
        </Box>
      </Box>

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description1}
        open={isInfoOpen}
        close={handleClose1}
      />
    </Box>
  );
};

export default SubPIList1;
