import React, { useState,useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import { useAddCompetitorMutation } from "../../../features/api/productApiSlice";
import { useGetAllCompetitorQuery } from "../../../features/api/productApiSlice";
import { toast } from "react-toastify";


const columnsData = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "QTY", headerName: "QTY" },
];

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "primary" : "#eee",
  color: theme.palette.mode === "dark" ? "white" : "black",
}));

// Dilog box table
function createData(Sno, CompetitorName, url) {
  return { Sno, CompetitorName, url };
}
const rows = [
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
];



const CompetitorTable = () => {
  // rtk Querry
  const [addCompetitor, { isLoading: addCompetitorLoading }] =
    useAddCompetitorMutation();
  const {
    data: allCompetitor,
    isLoading: getallCompetitorLoading,
    refetch,
  } = useGetAllCompetitorQuery();

  // console.log(addCompetitor);
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({ Name: "", URL: "" ,Date:""});
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInput({});
  };

  const handleInputChange = (event, rowIndex, columnName) => {
    const { value } = event.target;
    const newData = [...data];
    newData[rowIndex][columnName] = value;
    setData(newData);
    console.log(newData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  const handleSave = () => {
    data.forEach((row, index) => {
      const gstValue = row.GST;
      console.log("Saving GST value for row:", index, "Value:", gstValue);
    });
  };


//   useEffect(() => {
//     if (allCompetitor?.status === "success") {
//       setRows(allCompetitor.data.products);
//       const ColumnsName = []
//       allCompetitor.data?.forEach((row) =>{
// row?.forEach((column) => {
// ColumnsName.push(column.name);
// })

//       })

//       setColumns([...columnsData,...allCompetitor.data]);

   
//     }
//   }, [allCompetitor]);

  // post competitor name or url
  const handleOnChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,Date: new Date()
    });
  };

  const handleAdd = async () => {
    try {
      if (!input) return toast.error("Please fill the data");
const data = {
  Competitors: [input]
}
      const result = await addCompetitor(data);
  
      if(!result.data.success){
        return
      }
     toast.success("Competitor added successfully");
      setInput({});
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          sx={{ margin: "10px" }}
          onClick={handleClickOpen}
        >
          Add Competitor
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleSubmit,
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Add Competitor</Typography>
            <Button onClick={handleClose} sx={{ fontWeight: "bold" }}>
              {" "}
              Cancel
            </Button>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Competitor Name"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  name="Name"
                  value={input.Name}
                  onChange={handleOnChange}
                />
                <TextField
                  id="outlined-basic1"
                  label="URL"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  name="URL"
                  onChange={handleOnChange}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  onClick={handleAdd}
                  disabled={addCompetitorLoading}
                >
                  {addCompetitorLoading ? <CircularProgress /> : "Add"}
                </Button>
              </Box>
              <Box sx={{ marginTop: "12px" }}>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table
                    sx={{ minWidth: 500 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead
                      sx={{ position: "sticky", top: 0, background: "white" }}
                    >
                      <TableRow>
                        <TableCell>Sno</TableCell>
                        <TableCell>Competitor Name</TableCell>
                        <TableCell>Url</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allCompetitor?.data[0].Competitors.map((row, index) => {
                    
                       return( <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell>{row.Name}</TableCell>
                          <TableCell>{row.URL}</TableCell>
                        </TableRow>
                       )
})}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
        <Button variant="outlined" sx={{ margin: "10px" }} onClick={handleSave}>
          Save
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: "92vh", minHeight: "92vh" }}>
      <Table stickyHeader aria-label="sticky table">
          <TableHead>
          <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell2
                  key={column.field}
                  sx={{
                    fontSize: ".8rem",
                    minWidth: "50px",
                    position: "sticky",
                    left: `${
                      column.headerName === "S.No"
                        ? 0
                        : column.headerName === "SKU"
                        ? 3.78
                        : column.headerName === "Name"
                        ? 11.58
                        : column.headerName === "QTY"
                        ? 33.45
                        : 37
                    }rem`, // Adjust the values as needed
                    zIndex: 200,

                    textAlign: "center",
                  }}
                >
                  {column.headerName}
                </StyledTableCell2>
              ))}
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {allCompetitor?.data.map((row, rowIndex) => (
              <TableRow key={row.rowIndex}>
                <TableCell>{row.Sno}</TableCell>
                <TableCell>{row.SKU}</TableCell>
                <TableCell>{row.ProductName}</TableCell>
                <TableCell>
                  <p>{row.GST}</p>
                </TableCell>
                {[1, 2].map((compNum) => (
                  <TableCell key={`Comp${compNum}`}>
                    <input
                      type="text"
                      value={row[`Comp${compNum}`]}
                      onChange={(event) =>
                        handleInputChange(event, rowIndex, `Comp${compNum}`)
                      }
                      style={{
                        width: "5vw",
                        height: "4vh",
                        border: "1px solid black",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompetitorTable;
