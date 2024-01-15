import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const InfoDialogBox = ({ infoDetails, description, open, close }) => {
  const [isClicked, setIsClicked] = useState(null);

  const handleClick = (index) => {
    if (index === isClicked) {
      setIsClicked(null);
    } else {
      setIsClicked(index);
    }
  };

  return (
    <div>
      {/* Dialog info Box */}
      <Dialog open={open} onClose={close}>
        <DialogTitle
          align="center"
          backgroundColor="#040678"
          color="white"
          fontFamily="1rem"
          sx={
            {
              // display: isClicked === this.index ? 'flex' : 'flex'
            }
          }
        >
          {description}{" "}
        </DialogTitle>

        {infoDetails?.length ? (
          <DialogContent>
            {/* columns info */}

            <TableContainer
              component={Paper}
              sx={{ height: 400, overflow: "auto" }}
            >
              <Table sx={{ minWidth: 350 }} size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      position: "sticky",
                      top: 0,
                      background: "white",
                      zIndex: 1,
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      ScreenShot
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Instructions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infoDetails?.map((data, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{data?.name}</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          transform:
                            isClicked === index ? "scale(3.4)" : "scale(0.3) ",

                          transitionProperty: "transform",
                        }}
                        onClick={() => handleClick(index)}
                      >
                        {data?.screenshot}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          padding: "1rem",
                        }}
                      >
                        {" "}
                        {data?.instruction}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        ) : (
          ""
        )}

        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InfoDialogBox;
