import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useDeleteDyanmicValueMutation } from "../../../features/api/productApiSlice";
import { CatchingPokemonSharp } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function RoboDialogbox({
  open,
  handleClose,
  selectedItem,
  selectedtable,
  fetch,
}) {
  const [deleteValue] = useDeleteDyanmicValueMutation();
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
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure want to Delete {selectedtable} Named: {selectedItem}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteValue();
              handleClose();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
