import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useGetDynamicValueQuery } from "../../../features/api/productApiSlice";
import { useUpdateShipmentMutation } from "../../../features/api/clientAndShipmentApiSlice";
import { toast } from "react-toastify";

const PackingAndCourierDial = ({ open, setOpen, details, refetch }) => {
  const [courierDetails, setCourierDetails] = useState({
    courierName: "",
    Link: "",
    trackingId: "",
  });
  const [packingDetails, setPackingDetails] = useState({
    weight: "",
    dimension: "",
  });

  const {
    data: getDyanmicValue,
    isLoading: getDyanmaicValueLoading,
    refetch: refetchDynamic,
  } = useGetDynamicValueQuery();
  const [updateShipment, { isLoading: updateShipmentLoading }] =
    useUpdateShipmentMutation();

  const packageDisable = details?.Weight || details.Dimension ? true : false;
  const courierDisable = details?.CourierName ? true : false

  // HANDLE FOR COURIER REALATED FIELDS ONLY
  const handleCourierNameChange = (event) => {
    const { name, value } = event.target;
    let courierLinkFound;
    if (name === "courierName") {
      courierLinkFound = getDyanmicValue?.data[0].courierPartner.find(
        (item) => item.courierName === value
      );
      setCourierDetails((prev) => ({
        ...prev,
        ["Link"]: courierLinkFound.Link,
      }));
    }
    setCourierDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE FOR PACKING RELATED FIELDS ONLY
  const handlePackingChange = (e) => {
    const { name, value } = e.target;
    setPackingDetails((prev) => ({ ...prev, [name]: value }));
  };

  // HANDLE PACKING SUBMIT FUNCTION
  const handlePackaging = async () => {
    if (!packingDetails.weight || !packingDetails.dimension)
      return toast.error("Plz Enter Weight or Dimension");
    try {
      const info = {
        id: "packaging",
        orderShipmentId: details.OrderId,
        weight: +packingDetails.weight,
        dimension: packingDetails.dimension,
      };
      const result = await updateShipment(info).unwrap();
      toast.success("Packing Details Updated Successfully");
      refetch();
      setPackingDetails({
        weight: "",
        dimension: "",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE COURIER SUBMIT FUNCTION
  const handleCurrier = async () => {
    if (!courierDetails.courierName)
      return toast.error("Plz Select Courier Name");
    try {
      const info = {
        id: "courier",
        orderShipmentId: details.OrderId,
        trackingId: courierDetails.trackingId,
        courierName: courierDetails.courierName,
        courierLink: courierDetails.Link,
      };
      const result = await updateShipment(info).unwrap();
      toast.success("Courier Details Updated Successfully");
      refetch();
      setCourierDetails({
        courierName: "",
        Link: "",
        trackingId: "",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Dialog open={open} maxWidth={"xl"}>
        <DialogTitle
          sx={{ textAlign: "center", color: "white", background: "blue" }}
        >
          Plz Enter Details of {details.OpenFor}{" "}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: "10px", height: "300px", width: "500px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:"gray",
                alignItems: "center", 
                marginBottom: "10px",
                borderBottom: "1px solid #ccc", 
                padding: "10px",
                borderRadius:"4px"
              }}
            >
              <span style={{  fontWeight: "bold" }}>
                Shipping ID: {details.OrderId}
              </span>
              <span style={{ fontWeight: "bold" }}>
                Customer Name: {details.CustomerName}
              </span>
            </Box>

            {details.OpenFor === "Packing" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <TextField
                  name="weight"
                  value={packingDetails.weight || details?.Weight}
                  onChange={(e) => handlePackingChange(e)}
                  label="Package Weight In gm"
                  fullWidth
                  type="number"
                  disabled={details.Weight ? true : false}
                />
                <TextField
                  name="dimension"
                  value={packingDetails.dimension || details?.Dimension}
                  onChange={(e) => handlePackingChange(e)}
                  label="Package Dimension"
                  fullWidth
                  disabled={details.Dimension ? true : false}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <TextField
                  id="outlined-select-currency"
                  select
                  required
                  label="Select"
                  name="courierName"
                  value={courierDetails.courierName || details?.CourierName}
                  helperText="Please select courier name"
                  onChange={(e) => handleCourierNameChange(e)}
                  disabled={details?.CourierName ? true : false}
                >
                  {getDyanmicValue?.data[0]?.courierPartner?.map(
                    (option, index) => (
                      <MenuItem key={index} value={option.courierName}>
                        {option.courierName}
                      </MenuItem>
                    )
                  )}
                </TextField>
                <TextField
                  fullWidth
                  name="Link"
                  value={courierDetails.Link || details?.Link}
                  onChange={(e) => handleCourierNameChange(e)}
                  label="Courier Link"
                  disabled = {details?.Link ? true : false}
                  InputLabelProps={{
                    shrink: courierDetails.Link || details?.Link ? true : false,
                  }}
                ></TextField>{" "}
                <TextField
                  fullWidth
                  label="Enter Tracking Id"
                  name="trackingId"
                  value={courierDetails.trackingId || details?.TrackingId}
                  onChange={(e) => handleCourierNameChange(e)}
                  disabled = {details?.TrackingId ? true :false}
                ></TextField>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            disabled={updateShipmentLoading || packageDisable || courierDisable}
            onClick={() =>
              details.OpenFor === "Packing"
                ? handlePackaging()
                : handleCurrier()
            }
          >
            {updateShipmentLoading ? <CircularProgress /> : "Submit Details"}
          </Button>

          <Button variant="outlined" onClick={() => setOpen()}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackingAndCourierDial;
