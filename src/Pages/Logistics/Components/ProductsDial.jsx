import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import CloseIcon from "@mui/icons-material/Close";
import { useGetShipmentBarcodeMutation } from "../../../features/api/barcodeApiSlice";
import Loading from "../../../components/Common/Loading";

const ProductsDial = ({ open, close, data }) => {
  const [barcodeData, setBarcodeData] = useState([]);
  const [getShipmentBarcode, { isLoading }] = useGetShipmentBarcodeMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = { barcodes: data };
        const result = await getShipmentBarcode(info);

        setBarcodeData(result?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data, getShipmentBarcode]);

  return (
    <div>
      {" "}
      <Dialog open={open} maxWidth={"xl"}>
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DialogTitle>Product-Details</DialogTitle>
          <Button
            sx={{
              position: "absolute",
              right: 0,
              color: "white",
              ":hover": {
                backgroundColor: "black", // Changes the text color to black on hover
              },
            }}
            onClick={close}
          >
            <CloseIcon />
          </Button>
        </Box>

        <DialogContent>
          <DialogContentText>
            <Box>
              {isLoading ? (
                <Loading />
              ) : (
                <Box>
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead sx={{ backgroundColor: "#327da8" }}>
                        <TableRow>
                          <TableCell align="center">S.no</TableCell>
                          <TableCell align="center">SkU</TableCell>
                          <TableCell align="center">ProductName</TableCell>
                          <TableCell align="center">Brand</TableCell>
                          <TableCell align="center">Barcode</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {barcodeData?.map((row, index) => (
                          <TableRow key={row.barcode}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{row.SKU}</TableCell>
                            <TableCell align="center">{row.Name}</TableCell>
                            <TableCell align="center">{row.Brand}</TableCell>
                            <TableCell align="center">{row.barcode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsDial;
