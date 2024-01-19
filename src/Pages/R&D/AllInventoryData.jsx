import React from 'react'
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

const columns = [
  { id: 1, label: 'SNo', minWidth: 120 },
  { id: 2, label: 'SKU', minWidth: 120 },
  { id: 3, label: 'Product Name', minWidth: 120 },
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
const rows = [
  {
    id: 1,
    sku: 'IRS2401102013',
    productName: 'T Motor TWE801-D DP120',
    qty: '4',
    minWidth: 120,
  },
  {
    id: 2,
    sku: 'IRS32345673476',
    productName: 'T Engine MQ701-S TC120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 3,
    sku: 'IRS12325456653',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 4,
    sku: 'IRS22736482732',
    productName: 'T Engine WETod-Q KV555',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 5,
    sku: 'IRS24012433476',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 6,
    sku: 'IRS35665788765',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 7,
    sku: 'IRS24011002325',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 8,
    sku: 'IRS2450123s335',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 9,
    sku: 'IRS240110034345',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 10,
    sku: 'IRS2401100535',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 11,
    sku: 'IRS2401100535',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 12,
    sku: 'IRS2401100535',
    productName: 'T Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
  {
    id: 13,
    sku: 'IRS2401100535',
    productName: 'Tttt Motor MN801-S KV120',
    qty: '4',
    viewBarcode: 'View',
    minWidth: 120,
  },
];

const viewBarcodeColumns = [
  {
    id: 'SNo',
    barcode: 'Barcode',
    issueDate: 'Issue Date',
    status: 'Status',
    assigned: 'AssignTo',
  },
];

const viewBarcodeRows = [
  {
    id: 1,
    barcode: 'Barcode1',
    issueDate: '20/2/2024',
    assigned: 'Project1',
    status: 'In Inventory',
  },
  {
    id: 2,
    barcode: 'Barcode2',
    issueDate: '22/2/2024',
    assigned: 'Project2',
    status: 'Damage',
  },
  {
    id: 3,
    barcode: 'Barcode3',
    issueDate: '10/2/2024',
    assigned: 'Project3',
    status: 'Damage',
  },
];


 const [openDialog, setOpenDialog] = useState(false);
 const [selectedRow, setSelectedRow] = useState(null);

 const handleClickOpen1 = (row) => {
   setSelectedRow(row);
   setOpenDialog(true);
   console.log(row);
 };

 const handleClose2 = () => {
   setOpenDialog(false);
  //  setSelectedRow(null);
 };
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};
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

   const [open, setOpen] = React.useState(false);

   const handleClickOpen = () => {
     setOpen(true);
   };

   const handleClose1 = () => {
     setOpen(false);
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
        <Box
          sx={{
            minWidth: '200px',
            height: '7vh',
            boxShadow: 4,
            marginY: 1,
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            // border: '2px solid black'
          }}
        >
          <Button variant='contained' onClick={handleClickOpen}>
            Add Parts
            <AddIcon />
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            // sx={{
            //   width: '500px', // Set your desired width
            //   height: '300px', // Set your desired height
            // }}
          >
            <DialogTitle
              id='alert-dialog-title'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {'Scan Parts to Add Parts'}
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography>Scan Parts Barcode </Typography>
              <InputBase
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100px',
                  height: '40px',
                  border: '2px solid black',
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1}>Disagree</Button>
              <Button onClick={handleClose1} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ minHeight: 490, maxHeight: 490 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow>
                    <TableCell style={{ minWidth: row.minWidth }}>
                      {row.id}
                    </TableCell>
                    <TableCell style={{ minWidth: row.minWidth }}>
                      {row.sku}
                    </TableCell>
                    <TableCell style={{ minWidth: row.minWidth }}>
                      {row.productName}
                    </TableCell>
                    <TableCell style={{ minWidth: row.minWidth }}>
                      {row.qty}
                    </TableCell>
                    <TableCell style={{ minWidth: row.minWidth }}>
                      <Button
                        variant='contained'
                        onClick={() => handleClickOpen1(row)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* view barcode dialog box */}
        <Dialog open={openDialog} onClose={handleClose2} maxWidth='xl'>
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
            <Typography>{`Product Name: ${selectedRow?.productName} `}</Typography>
          </DialogTitle>

          <DialogContent>
            <TableContainer sx={{ minHeight: 490, maxHeight: 490 }}>
              <Table stickyHeader aria-label='sticky table'>
                {viewBarcodeColumns.map((data) => (
                  <TableHead>
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
                  {viewBarcodeRows.map((data) => (
                    <TableRow>
                      <TableCell>{data.id}</TableCell>
                      <TableCell>{data.barcode}</TableCell>
                      <TableCell>{data.issueDate}</TableCell>
                      <TableCell>{data.assigned}</TableCell>
                      <TableCell
                        sx={{
                          backgroundColor:
                            data?.status === 'Damage' ? 'red' : 'green',
                        }}
                      >
                        {data?.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AllInventoryData