import React, { useEffect } from 'react';
import {
  Box,
  styled,
  Button,
  Typography,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useGetAllRDInventoryQuery } from '../../features/api/barcodeApiSlice';
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Submit Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/dscSubmit.png?updatedAt=1703231258665'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `When you click on Submit Button, it will show you the Final Repair Form Details GUI`,
  },

  {
    name: 'Final Repair Form Details',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/final%20repair.png?updatedAt=1703231658883'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
  },

  {
    name: 'Shipment Detail Tracking',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  },
];

const AllInventoryData = () => {
  const description = `The Entry Form for Repairs Module is for the drone service center. Here, we enter customer details for drone services. After clicking the submit button, the data will be submitted.`;

  //alInventoryData rtk
  const { data: inventoryData } = useGetAllRDInventoryQuery();
  const columns = [
    { id: 1, label: 'SNo', minWidth: 120 },
    { id: 2, label: 'SKU', minWidth: 120 },
    { id: 3, label: 'Part Name', minWidth: 120 },
    {
      id: 4,
      label: 'Quantity',
      minWidth: 120,
    },
    {
      id: 5,
      label: 'View Barcode ',
      minWidth: 120,
    },
  ];

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (inventoryData?.status === true) {
      const updatedRows = inventoryData?.data?.map((data) => ({
        id: data._id,
        sku: data.SKU,
        name: data.Name,
        quantity: data.Quantity,
        barcode: (data?.Barcode || []).map((barcodeData) => ({
          barcodeSKU: barcodeData?.SKU,
          Barcode: barcodeData?.Barcode,
        })),
      }));
      setRows(updatedRows);
    }
  }, [inventoryData]);

  useEffect(() => {
    console.log(rows);
  }, [rows]);
 
  const viewBarcodeColumns = [
    {
      id: 'SNo',
      barcode: 'Barcode',
      issueDate: 'Issue Date',
      status: 'Status',
      assigned: 'AssignTo Project Name',
    },
  ];
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  

  const handleClickOpen1 = (data) => {
    setSelectedRow(data)
    setOpenDialog(!openDialog);
  };
  console.log(selectedRow)
  
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };

  return (
    <Box
      component='main'
      sx={{ flexGrow: 2, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      <Header
        Name={`All Inventory Data`}
        info={true}
        customOnClick={handleOpen}
      />
      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />

      <Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 690 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data?.sku}</TableCell>
                    <TableCell>{data?.name}</TableCell>
                    <TableCell>{data?.barcode.length}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => handleClickOpen1(data)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* view barcode dialog box */}
        <Dialog open={openDialog} onClose={handleClickOpen1} maxWidth='xl'>
          <DialogTitle
            sx={{
              minWidth: '60vw',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: 'grey',
            }}
          >
            <Typography>{`SKU: ${selectedRow?.sku} `}</Typography>

            <Typography>{`Part Name: ${selectedRow?.name}`}</Typography>
          </DialogTitle>

          <DialogContent>
            <TableContainer sx={{ minHeight: 490, maxHeight: 490 }}>
              <Table stickyHeader aria-label='sticky table'>
                {viewBarcodeColumns.map((data, index) => (
                  <TableHead key={index}>
                    <TableRow>
                      <TableCell>{data.id}</TableCell>
                      <TableCell>{data.barcode}</TableCell>
                      <TableCell>{data.issueDate}</TableCell>
                      <TableCell>{data.assigned}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {data.status}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                ))}

                <TableBody>
                  {selectedRow?.barcode?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.Barcode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickOpen1}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AllInventoryData;
