import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setHiddemColumns } from "../../../features/slice/authSlice";
const HideColumnsDialog = ({ columns }) => {
  /// intialize
  const dispatch = useDispatch();

  /// Global state

  const hiddenColumns = useSelector((state) => state.auth.hiddenColumns);

  /// Local state
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  /// Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    event.preventDefault();
    const { name, checked } = event.target;

    if (checked) {
      const newHiddenColumns = [...hiddenColumns];
      newHiddenColumns.push(name);
      dispatch(setHiddemColumns(newHiddenColumns));
    } else {
      const newHiddenColumns = hiddenColumns.filter(
        (column) => column !== name
      );
      dispatch(setHiddemColumns(newHiddenColumns));
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Hidden Columns
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            background: "#80bfff",
          }}
        >
          <span style={{ marginLeft: "30%" }}>Hidden Columns </span>
          <div>
            <i
              className="fa-solid fa-circle-xmark"
              style={{
                marginLeft: "20%",
                cursor: "pointer",
                color: "black", // Initial color
              }}
              onClick={handleClose}
            ></i>
          </div>
        </DialogTitle>

        <DialogContent>
          <div
            style={{ display: "flex", width: "100%", justifyItems: "center" }}
          >
            <table>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex}>
                        {columns[rowIndex * 4 + colIndex] && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={columns[rowIndex * 4 + colIndex].field}
                                checked={hiddenColumns.includes(
                                  columns[rowIndex * 4 + colIndex].field
                                )}
                                onChange={handleCheckboxChange}
                              />
                            }
                            label={columns[rowIndex * 4 + colIndex].headerName}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HideColumnsDialog;
