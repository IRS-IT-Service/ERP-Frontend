import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  useAddBrandLogoMutation,
  useDeleteDyanmicValueMutation,
} from "../../../features/api/productApiSlice";
import { CatchingPokemonSharp } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  DialogTitle,
  Typography,
  TextField,
} from "@mui/material";
import generateUniqueId from "generate-unique-id";

export default function RoboDialogbox({
  open,
  handleClose,
  selectedItem,
  selectedtable,
  fetch,
  Logos,
}) {
  const [upload, setUpload] = useState(null);
  const [deleteValue] = useDeleteDyanmicValueMutation();
  const [addBrandLogo, { isLoading }] = useAddBrandLogoMutation();
  const [captcha, setCaptcha] = useState(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [openCaptcha, setOpenCaptcha] = useState(false);
  const [timerError, setTimerError] = useState(false);

  const handleDeleteValue = async () => {
    try {
      if (captchaInput === captcha) {
        const info = { query: selectedtable, values: selectedItem };

        const result = await deleteValue(info).unwrap();
        if (result.status === true) {
          toast.success("Deleted Successfully");
          setOpenCaptcha(false);
          setCaptchaInput("");
          handleClose();
          fetch();
        } else {
          toast.error("Some Error Occured Plz Try Again!");
          setOpenCaptcha(false);
          setCaptchaInput("");
          fetch();
        }
      } else {
        captchaRegen();
        toast.error("Invalid Captcha");
        setTimerError(true);
        setTimeout(() => {
          setTimerError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpload(file);
    }
  };
  const handleUpload = async () => {
    if (!upload || !selectedItem) return toast.error("Plese Upload Logo First");
    const formData = new FormData();
    formData.append("Image", upload);
    formData.append("name", selectedItem);

    try {
      const result = await addBrandLogo(formData).unwrap();
      toast.success(
        `Logo Uploaded Successfully For Brand Name: ${selectedItem}`
      );
      fetch();
      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };
  const url = upload && URL.createObjectURL(upload);

  const upoladedFile = Logos.filter((logo) => logo.BrandName === selectedItem);

  const CaptchaElementGenerator = () => {
    if (!captcha) {
      return (
        <Box
          sx={{
            paddingTop: "7px",
            paddingBottom: "9px",
            // margin: "5px",
            letterSpacing: "6px",
            width: "200px",
            height: "40px",
            backgroundColor: "grey",
            borderRadius: "5px",
            textAlign: "center",
            marginBottom: "10px",
            display: "inline-block",
          }}
        ></Box>
      );
    }

    return (
      <Box
        sx={{
          paddingTop: "7px",
          paddingBottom: "9px",
          // margin: "5px",
          letterSpacing: "6px",
          width: "200px",
          height: "40px",
          backgroundColor: "grey",
          borderRadius: "5px",
          textAlign: "center",
          marginBottom: "10px",
          display: "inline-block",
        }}
      >
        {captcha.split("").map((item, index) => {
          const min = 1;
          const max = 25;

          const randomNumber =
            Math.floor(Math.random() * (max - min + 1)) + min;
          let transformValue = `rotate(${randomNumber}deg)`;

          return (
            <Typography
              key={index}
              sx={{
                display: "inline-block",
                margin: "5px",
                transform: transformValue,
              }}
            >
              {item}
              {console.log(item)}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const captchaRegen = () => {
    setCaptcha(
      generateUniqueId({
        length: 6,
        useLetters: true,
      })
    );
  };
  useEffect(() => {
    captchaRegen();
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        {selectedtable === "BrandWithLogo" ? (
          <>
            <DialogTitle sx={{ background: "blue", color: "white" }}>
              Upload Logo For Brand: {selectedItem}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  marginTop: "10px",
                  gap: "200px",
                  width: "500px",
                  height: "250px",
                }}
              >
                <Box>
                  <label
                    htmlFor="file-input"
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      background: "green",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  >
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileSelect(e)}
                      id="file-input"
                    />{" "}
                    Add Logo
                  </label>

                  {upload && (
                    <Box
                      sx={{
                        marginTop: "15px",
                        display: "flex",
                        border: "1px solid gray",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: "15px" }}>Preview</Typography>
                      <img
                        src={url}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "15px" }}>
                    Uploaded Logo
                  </Typography>
                  {upoladedFile[0]?.BrandImage && (
                    <Box
                      sx={{
                        marginTop: "15px",
                        display: "flex",
                        border: "1px solid gray",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={upoladedFile[0]?.BrandImage?.url}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </>
        ) : (
          <DialogContent>
            <DialogContentText>
              Are you sure want to Delete {selectedtable} Named: {selectedItem}?
            </DialogContentText>
            <DialogContent
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                // textAlign: "center", // Add this line to center the content
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#80bfff",
                  padding: "5px",
                  fontWeight: "bold",
                }}
              ></Box>
              <Box
                sx={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  paddingLeft: "20px",
                }}
              >
                {CaptchaElementGenerator()}

                <Button
                  sx={{
                    marginBottom: "10px",
                  }}
                  onClick={captchaRegen}
                >
                  <ReplayIcon />
                </Button>

                <TextField
                  placeholder="Enter captcha"
                  sx={{ display: "block" }}
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                  }}
                />
              </Box>
            </DialogContent>
          </DialogContent>
        )}
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleClose}>Cancel</Button>
          {selectedtable !== "BrandWithLogo" ? (
            <Button
              onClick={() => {
                handleDeleteValue();
              }}
            >
              Ok
            </Button>
          ) : (
            <Button disabled={isLoading} onClick={() => handleUpload()}>
              {isLoading ? <CircularProgress /> : "Upload"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
