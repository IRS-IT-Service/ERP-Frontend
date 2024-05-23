import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,  styled, } from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import {useGetsingleShipmentbyorderIdQuery,
    useCreateShipmentMutation
} from "../../../features/api/barcodeApiSlice"



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
    padding:5
  }));
  

const OrderDetailsDialog = ({
  open,
  setOpen,
  details,
  handlePackaging,
  handleCurrier,
  updateShipmentLoading,
  packageDisable,
  courierDisable,
}) => {
const skip =!open

    const {data:barcodeData , isLoading:clientLoading} = useGetsingleShipmentbyorderIdQuery(details.ShipmentId ,{
        skip,
      })

      const [createShipment, { isLoading: createShipmentLoading }] =
      useCreateShipmentMutation();
    

    
const handleSubmit = async () => {
    if ((!trackingId && courierName !== "SELF PICKUP") || !courierName) {
      return toast.error("Please Provide TrackingId Or CourierName");
    }
    if (selectedItemsData.length <= 0) {
      return toast.error("Plz SelectItems to Send");
    }
    const barcodes = selectedItemsData.map((item) => item.barcode);
    try {
      const info = {
        customername: data?.result?.CustomerName,
        courierName: courierName,
        courierLink:Link,
        customerMobile:data?.result?.MobileNo,
        trackingId: trackingId,
        salesId: data?.result?.SalesId,
        barcodes: barcodes,
      };
      const result = await createShipment(info);

      toast.success("Item has shipped successfully");
  
    } catch (error) {
      console.log("Server Error", error.message);

    }
  };

  return (
    <Box>
      <Dialog open={open} maxWidth="xl">
        <DialogTitle sx={{ textAlign: "center", color: "white", background: "blue" }}>
          Details of Shipment
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: "10px" }}>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
        
              alignItems: "center",
              marginBottom: "10px",
        
              padding: "10px",
              borderRadius: "4px"
            }}>
                 <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{background:"#ccc"}}align="center"><Typography variant="span">Shipping ID</Typography></TableCell>
            <TableCell sx={{background:"#ccc"}}align="center"><Typography variant="span">Customer Name</Typography></TableCell>
            <TableCell sx={{background:"#ccc"}}align="center"><Typography variant="span">Company Name</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
     
            <TableCell align="center">{details.ShipmentId
}</TableCell>
            <TableCell align="center">{details.CustomerName}</TableCell>
            <TableCell align="center">{details.CompanyName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
             
            </Box>
<Box sx={{display:"flex" ,gap:"20px" ,}}>
            {details.IsPacked && 
              <Box sx={{ marginTop: "10px" }}>
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                  <strong>Package Weight:</strong> {details.Weight || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Package Dimension:</strong> {details.Dimension || 'N/A'}
                </Typography>
              </Box>
}
          {details.HasCourierId &&   
           <Box sx={{ marginTop: "10px" }}>
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                  <strong>Courier Name:</strong> {details.CourierName || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                  <strong>Courier Link:</strong> {details.CourierLink
 || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Tracking Id:</strong> {details.TrackingId || 'N/A'}
                </Typography>
              </Box>
            
}
<Box sx={{ marginTop: "10px"}}>
    <Typography variant="span" sx={{padding:"20px 0" ,fontSize:"15px",fontWeight:"bold"}}  >
          Shipping address :
           
                </Typography>
                <Table sx={{marginTop:"10px"}}>
                      <TableBody>
                        {details?.ShippingAddress
 &&
                          Object.keys(details?.ShippingAddress).map(
                            (key) => {
                              if (key === "SNO" || key === "ClientId") {
                                return null;
                              }
                              return (
                                <TableRow key={key} sx={{ padding: 0 }}>
                                  <TableCell
                                    sx={{ padding: 0.5, fontWeight: "bold" }}
                                  >
                                    {key?.toUpperCase()}:
                                  </TableCell>
                                  <TableCell sx={{ padding: 0 }}>
                                    {details?.ShippingAddress[key]}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
              </Box>
</Box>

<TableContainer sx={{ maxHeight: 400 ,overflow:"auto",marginTop: "20px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
          
            >
              <TableRow>
                <StyledTableCell align="center">Sno</StyledTableCell>
                <StyledTableCell align="center">Product Name</StyledTableCell>
                <StyledTableCell align="center">Barcode No</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barcodeData?.data?.barcodeDetails?.length > 0 ? (
                barcodeData?.data?.barcodeDetails.map((item, index) => (
                  <TableRow key={index}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{item.name}</StyledTableCell>
                    <StyledTableCell align="center">{item.barcode}</StyledTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={2}>
                    No Barcode Data Available!
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            disabled={updateShipmentLoading || packageDisable || courierDisable}
            onClick={handleSubmit}    
            
          >
            {createShipmentLoading ? <CircularProgress /> : "Final Submit"}
          </Button>

          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetailsDialog;
