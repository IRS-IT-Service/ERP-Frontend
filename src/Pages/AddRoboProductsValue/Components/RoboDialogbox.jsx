import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  useAddBrandLogoMutation,
  useDeleteDyanmicValueMutation,
} from "../../../features/api/productApiSlice";
import { CatchingPokemonSharp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Box, CircularProgress, DialogTitle, Typography } from "@mui/material";

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

  const handleDeleteValue = async () => {
    try {
      const info = { query: selectedtable, values: selectedItem };
      const result = await deleteValue(info).unwrap();
      toast.success("Delected Successfully");
      fetch();
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
  console.log(upoladedFile)
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
                  gap:"200px",
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
          </DialogContent>
        )}
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleClose}>Cancel</Button>
          {selectedtable !== "BrandWithLogo" ? (
            <Button
              onClick={() => {
                handleDeleteValue();
                handleClose();
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
