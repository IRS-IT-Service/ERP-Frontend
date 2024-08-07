import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Button,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  useCreateShipmentOrderMutation,
  useGetClientByNameQuery,
} from "../../../features/api/clientAndShipmentApiSlice";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useCreateShipmentMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";

const RandDShipmentDial = ({ open, setOpen, productData, refetchProduct }) => {
  const [name, setName] = useState("IRS R&D");

  const [rows, setRows] = useState(productData);

  // rtk query api callings
  const {
    data: getClientByName,
    isLoading,
    refetch,
  } = useGetClientByNameQuery(name);

  const [
    createShipment,
    { isLoading: createShipmentLoading, refetch: createShipmentrefetch },
  ] = useCreateShipmentOrderMutation();

  // function for closing the dialog box
  const handleClose = () => {
    setOpen(false);
  };

  const StyledCell = styled(TableCell)(({ theme }) => ({
 textAlign: "center",
 padding: 1,
backgroundColor: "#50124f",
 color: "#fff",
  }));

  const StyledCellvalue = styled(TableCell)(({ theme }) => ({
    textAlign: "center",
    padding: 1,
      }));

  const handleQtyChange = (item, e) => {
    const { value } = e.target;
    const updatedData = rows.map((row) =>
      row.SKU === item.SKU ? { ...row, Count: value } : row
    );
    setRows(updatedData);
  };

  const handleSubmitShipment = async () => {
    const finalData = rows.map((item) => {
      return {
        productName: item.Name,
        SKU: item.SKU,
        Qty: Number(item.Count),
        barcodeGenerator: item.barcodeGenerator,
      };
    });
    const formData = new FormData();
    formData.append("ClientId", getClientByName?.client?.ClientId);
    formData.append(
      "BillingAddress",
      JSON.stringify(getClientByName?.client?.PermanentAddress)
    );
    formData.append("ContactPerson", getClientByName?.client?.ContactName);
    formData.append("Contact", getClientByName?.client?.ContactNumber);
    formData.append("CompanyName", getClientByName?.client?.CompanyName);
    formData.append("ContactName", getClientByName?.client?.ContactName);
    formData.append(
      "ShippingAddress",
      JSON.stringify(getClientByName?.client?.PermanentAddress)
    );

    formData.append(
      "AlternateNumber",
      getClientByName?.client?.AlternateNumber
    );
    formData.append("Items", JSON.stringify(finalData));
    try {
      const create = await createShipment(formData).unwrap();

      toast.success("Shipment created successfully");
      refetchProduct();
      setOpen(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"xl"}>
      <DialogTitle sx={{ background: "#eee" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          R and D Shipment
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* // RAND DETAILS  */}
        <Box
          sx={{
            display: "flex",
            gap: "13px",
            marginTop: "8px",
          }}
        >
          <TextField
            size="small"
            label="Individual"
            sx={{}}
            InputLabelProps={{ shrink: true }}
            value={getClientByName?.client?.ClientType}
          ></TextField>
          <TextField
            size="small"
            label="Client Name"
            sx={{}}
            value={getClientByName?.client?.ContactName}
            InputLabelProps={{ shrink: true }}
          ></TextField>
          <TextField
            size="small"
            label="Contact No"
            sx={{}}
            InputLabelProps={{ shrink: true }}
            value={getClientByName?.client?.ContactNumber}
          ></TextField>
          <TextField
            size="small"
            label="Alternate No"
            sx={{}}
            value={"N/A"}
            InputLabelProps={{ shrink: true }}
          ></TextField>
        </Box>

        {/* for address things */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
              Billing Address:{" "}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <Table
                sx={{
                  width: "30vw",
                  overflow: "auto",
                }}
              >
                <TableBody>
                  {getClientByName?.client?.PermanentAddress &&
                    Object.keys(getClientByName?.client?.PermanentAddress).map(
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
                            <TableCell sx={{ padding: 0, overflow: "auto" }}>
                              {getClientByName?.client?.PermanentAddress[key]}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
        {/* for Items Which is Get Requested  this update hapened for creating dial */}

        <Box>
          <span
            style={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px",
              fontSize: "13px",
              borderRadius: "10px",
              border: "1px solid ",
              marginBottom: "2px",
            }}
          >
            Requested Items For Project{" "}
            <ArrowDownwardIcon sx={{ color: "blue" }} />
          </span>
          <Box>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "400px", width: "60vw" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledCell
                  
                    >
                      S.No
                    </StyledCell>
                    <StyledCell
                    
                    >
                      SKU
                    </StyledCell>
                    <StyledCell
                  
                    >
                      Name
                    </StyledCell>
                    <StyledCell
                 
                    >
                      Brand
                    </StyledCell>
                    <StyledCell
                 
                    >
                      GST
                    </StyledCell>
                    <StyledCell
                 
                    >
                      Actual Qty
                    </StyledCell>
                    <StyledCell
                 
                    >
                      Requested Qty
                    </StyledCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ overflowY: "auto" }}>
                  {rows.length > 0 ? (
                    rows.map((row, index) => (
                      <TableRow key={index}>
                        <StyledCellvalue>{index + 1}</StyledCellvalue>
                        <StyledCellvalue sx={{ width: "20%", textAlign: "center" }}>
                          {row.SKU}
                        </StyledCellvalue>
                        <StyledCellvalue sx={{ width: "25%", textAlign: "center" }}>
                          {row.Name}
                        </StyledCellvalue>
                        <StyledCellvalue sx={{ textAlign: "center" }}>
                          {row.Brand}
                        </StyledCellvalue>
                        <StyledCellvalue sx={{ textAlign: "center" }}>
                          {row.GST}
                        </StyledCellvalue>
                        <StyledCellvalue sx={{ textAlign: "center" }}>
                          {row.barcodeGenerator ? row.ActualQuantity : row.Quantity}
                        </StyledCellvalue>
                        <StyledCellvalue sx={{ textAlign: "center" }}>
                          <TextField
                            sx={{ width: "90px" }}
                            type="number"
                            value={row.Count}
                            name="Count"
                            onChange={(e) => handleQtyChange(row, e)}
                            variant="outlined"
                            size="small"
                          />
                        </StyledCellvalue>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledCellvalue sx={{ width: "100%" }}>
                        <Typography sx={{ textAlign: "center" }}>
                          No Itemes Requested
                        </Typography>
                      </StyledCellvalue>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleSubmitShipment()}
          disabled={rows.length === 0}
        >
          {createShipmentLoading ? <CircularProgress /> : "Create Shipment"}
        </Button>
        <Button sx={{ color: "red" }} onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RandDShipmentDial;
