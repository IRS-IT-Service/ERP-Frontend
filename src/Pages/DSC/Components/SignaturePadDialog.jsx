import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { formateDateAndTime } from "../../../commonFunctions/commonFunctions";
import { useUpdateCustomerAknowledgementMutation } from "../../../features/api/dscApiSlice";
import { toast } from "react-toastify";

const SignaturePad = ({ open, handleClose, data, refetch }) => {
  /// initialization
  const canvasRef = useRef(null);

  /// RTK query

  const [updateApi, { isLoading }] = useUpdateCustomerAknowledgementMutation();

  /// local state
  const [isDrawing, setIsDrawing] = useState(false);

  /// function
  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const coordinates = getCoordinates(e);
    context.beginPath();
    context.moveTo(coordinates.x, coordinates.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const coordinates = getCoordinates(e);
    context.lineTo(coordinates.x, coordinates.y);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = async () => {
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempContext.fillStyle = "#ffffff";
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempContext.drawImage(canvas, 0, 0);

      const imageData = tempCanvas.toDataURL("image/jpeg", 1.0);
      const fileBlob = await fetch(imageData).then((res) => res.blob());

      const formData = new FormData();
      formData.append("id", data.Token);
      formData.append("date", new Date(Date.now()));
      formData.append("file", fileBlob, "signature.jpg");

      const res = await updateApi(formData);
      toast.success("Customer Aknowledgement Saved Successfully");
      handleClose();
      refetch();
    } catch (e) {
      console.log(e);
      console.log("Error at Signature ");
    }
  };

  const getCoordinates = (event) => {
    let x, y;
    if (
      event.type === "mousedown" ||
      event.type === "mouseup" ||
      event.type === "mousemove"
    ) {
      x = event.nativeEvent.offsetX;
      y = event.nativeEvent.offsetY;
    } else if (
      event.type === "touchstart" ||
      event.type === "touchmove" ||
      event.type === "touchend"
    ) {
      x =
        event.touches[0].clientX -
        event.touches[0].target.getBoundingClientRect().left;
      y =
        event.touches[0].clientY -
        event.touches[0].target.getBoundingClientRect().top;
    }
    return { x, y };
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          textAlign: "center",
          backgroundColor: "#040678",
          color: "#fff",
        }}
      >
        Customer Acknowledgement Signature
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "0px",
        }}
      >
        {data?.Status === "Completed" ? (
          <Box>
            <Box>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                Token: {data?.Token}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                CustomerName: {data?.CustomerName}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                DroneModel: {data?.DroneModel}
              </Typography>
            </Box>{" "}
            <img src={data.CustomerAcknowledgment?.url}></img>
            <Box
              sx={{
                backgroundColor: "",
              }}
            >
              Date: {formateDateAndTime(data.CustomerAcknowledgment?.date)}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: "5px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                Token: {data?.Token}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                CustomerName: {data?.CustomerName}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#040678",
                  color: "#fff",
                  display: "inline-block",
                  borderRadius: "5px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  margin: "5px",
                }}
              >
                DroneModel: {data?.DroneModel}
              </Typography>
            </Box>{" "}
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              style={{
                border: "1px solid #000",
                boxSizing: "border-box",
                display: "block",
                marginLeft: "30px",
                marginRight: "30px",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseOut={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  marginTop: "10px",
                }}
                onClick={clearCanvas}
                variant="contained"
              >
                Clear
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
        {data?.Status === "Completed" ? (
          ""
        ) : (
          <Button onClick={saveSignature} variant="contained">
            {isLoading ? (
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SignaturePad;
