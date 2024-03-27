import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
  CircularProgress,
  TextField,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,

} from "@mui/material";
import { DataGrid ,useGridApiRef } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


import { useAddProjectNameMutation } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
const AddpartsDial = ({ open, close, refetch, data }) => {
  const [addProject, { isLoading, refetch: addRefetch }] =
    useAddProjectNameMutation();
    let rows = [
        { id: 1, Name: "Brand A", Brand: "Samsung", gst: 12, RnDStock: 150 },
        { id: 2, Name: "Brand B", Brand: "Samsung", gst: 15, RnDStock: 200 },
        { id: 3, Name: "Brand C", Brand: "Samsung", gst: 10, RnDStock: 100 },
        { id: 4, Name: "Brand D", Brand: "Samsung", gst: 18, RnDStock: 300 },
        { id: 5, Name: "Brand E", Brand: "Samsung", gst: 8, RnDStock: 250 },
        { id: 6, Name: "Brand F", Brand: "Samsung", gst: 13, RnDStock: 170 },
        { id: 7, Name: "Brand G", Brand: "Samsung", gst: 9, RnDStock: 220 },
        { id: 8, Name: "Brand H", Brand: "Samsung", gst: 11, RnDStock: 180 },
        { id: 9, Name: "Brand I", Brand: "Samsung", gst: 16, RnDStock: 280 },
        { id: 10, Name: "Brand J", Brand: "Samsung", gst: 14, RnDStock: 190 },
        { id: 11, Name: "Brand K", Brand: "Samsung", gst: 17, RnDStock: 260 },
        { id: 12, Name: "Brand L", Brand: "Samsung", gst: 7, RnDStock: 130 },
        { id: 13, Name: "Brand M", Brand: "Samsung", gst: 19, RnDStock: 320 },
        { id: 14, Name: "Brand N", Brand: "Samsung", gst: 6, RnDStock: 110 },
        { id: 15, Name: "Brand O", Brand: "Samsung", gst: 20, RnDStock: 350 },
        { id: 16, Name: "Brand P", Brand: "Samsung", gst: 5, RnDStock: 80 },
        { id: 17, Name: "Brand Q", Brand: "Samsung", gst: 21, RnDStock: 370 },
        { id: 18, Name: "Brand R", Brand: "Samsung", gst: 4, RnDStock: 60 },
        { id: 19, Name: "Brand S", Brand: "Samsung", gst: 22, RnDStock: 390 },
        { id: 20, Name: "Brand T", Brand: "Samsung", gst: 3, RnDStock: 40 }
        // Add more objects as needed
    ];

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemsData, setSelectedItemsData] = useState([]);
    const [quantity, setQuantity] = useState([{
        id: 0,
        Name: "",
        Brand: "",
        gst: 0,
        quantity: 0,
   
    }]);
    const apiRef = useGridApiRef();
    const handleSelectionChange = (selectionModel) => {

        setSelectedItems(selectionModel);
        const newSelectedRowsData = rows.filter((item) =>
          selectionModel.includes(item.id)
        );
        setSelectedItemsData(newSelectedRowsData);
      };

  const [projectValue, setProjectValue] = useState({
    projectName: "",
    description: "",
  });

  const handleDelete = (id) => {
    
    
    const newSelectedItems = selectedItems.filter((row) => row !== id);
    handleSelectionChange(newSelectedItems);


  };

  const columns = [

 
    {
      field: "Name",
      flex: 0.3,
      headerName: "Name",
      minWidth: 200,
      maxWidth: 600,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Brand",
      flex: 0.3,
      headerName: "Brand",
      minWidth: 100,
      maxWidth: 200,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "gst",

      headerName: "GST",
      minWidth: 50,
      maxWidth: 100,

      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "R&DStock",
      flex: 0.3,
      headerName: "R&D Stock",
      minWidth: 50,
      maxWidth: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
  ];
console.log(quantity)
const handleAddQty = (data ) =>{
const {id ,Name ,Brand ,gst} = data
    setQuantity((prev)=>{
        return prev.map((item)=>{
            console.log(item)
            if(item.id === id){
                return {
                   ...item,
                          
                   quantity: item.quantity + 1
    
                }
            }else{
                return item
            }
        })
    })
}
const handleDecrease = (data) =>{
    const {id ,Name ,Brand ,gst} = data
    setQuantity((prev)=>{
        return prev.map((item)=>{
            if(item.id === id){
                return {
                   ...item,
                    quantity: item.quantity - 1
                }
            }else{
                return item
            }
        })
    })
}


  const handleSubmit = async () => {
    try {
      const res = await addProject(projectValue).unwrap();
      toast.success(`Project Added successfully`);
      setProjectValue({
        projectName: "",
        description: "",
      });
      close();
      refetch();
    } catch (e) {
      toast.error(e);
    }
  };
  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  return (
    <Dialog maxWidth="xl" open={open} onClose={close}>
      <DialogTitle
        sx={{
          minWidth: "50vw",
          minHeight: "5vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "skyblue",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Project Name :{" "}
            <Typography
              variant="span"
              fontWeight={"lighter"}
              fontSize={"0.9rem"}
            >
              {data?.Name}
            </Typography>
          </Typography>
          <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Project Id :{" "}
            <Typography
              variant="span"
              fontWeight={"lighter"}
              fontSize={"0.9rem"}
            >
              {data?.projectId}
            </Typography>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          width: "auto",
          minHeight: " 10vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80vw",
          }}
        >
          <Box
            sx={{
              border: "2px solid red",
              height: "60vh",
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Select Items
            </Typography>
       <Box sx={{marginLeft :"10px" ,width:"30rem"}}>
<TextField
size="small"
placeholder="Search by Name"
fullWidth
onChange={(e) => {
    // setSkuFilter(e.target.value);
    // setCheckedBrands([]);
    // setCheckedCategory([]);
    handleFilterChange("Name", "contains", e.target.value);
  }}
/>
       </Box>
            <Box
              sx={{
                width: "100%",
                height: "52vh",
                "& .super-app-theme--header": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                },
                "& .vertical-lines .MuiDataGrid-cell": {
                  borderRight: "1px solid #e0e0e0",
                },
                "& .supercursor-app-theme--cell:hover": {
                  background:
                    "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
                  color: "white",
                  cursor: "pointer",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  background: "#eee",
                },
                position: "relative",
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                apiRef={apiRef}
                Height={"50vh"}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
              />
            </Box>
          </Box>
          <Box
            sx={{
              border: "2px solid red",
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Selected Items
            </Typography>
            <TableContainer
              sx={{
                maxHeight: 490,
                overflow: 'auto',
                marginTop:"2.5rem"
              }}
            >
              <Table
                stickyHeader
                aria-label='sticky table'
                sx={{ border: '1px solid grey' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>SNo</TableCell>
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>Name</TableCell>
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>
                      Brand
                    </TableCell>
                   
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>
                      GST
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>Requirment</TableCell>
                    <TableCell sx={{ backgroundColor: '#eee',color:"black" ,textAlign:"center"}}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedItemsData?.map((data, index) => (
                    <TableRow key={index} >
                      <TableCell sx={{textAlign:"center"}}>{index + 1}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>{data?.Name}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>{data?.Brand}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>{data?.gst}</TableCell>
                      <TableCell sx={{display:"flex" ,justifyContent:"center"}}>
                        <Box width="7rem" sx={{
                            display:"flex",
                            gap:1,
                      
                        }} >
                        <AddCircleOutlineIcon sx={{ "&:hover": { color: "green" } , cursor:"pointer" }} onClick={()=>handleAddQty(data)}/>
                <input style={{
                    width:"100%",
                    borderRadius:"0.5rem",
             textAlign:"center",
                    padding:4 ,
            //    value={quantity[id].quantity}
                 
                }}  />
                <RemoveCircleOutlineIcon sx={{ "&:hover": { color: "green" } , cursor:"pointer" }} onClick={()=>handleDecrease(data)} />
                </Box>
                      </TableCell>
                      <TableCell sx={{textAlign:'center'}}>
                      <DeleteIcon sx={{ "&:hover": { color: "red" } , cursor:"pointer" }} onClick={()=>handleDelete(data.id)} />
                </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={30} />
          ) : (
            "Submit"
          )}
        </Button>
        <Button variant="contained" onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddpartsDial;
