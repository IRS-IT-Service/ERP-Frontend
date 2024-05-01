import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  styled,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  tableCellClasses,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import { useLocation } from "react-router-dom";
import {
  useUpdateBoxOpenApprovalMutation,
  useGetBoxOpenApprovalQuery,
} from "../../features/api/barcodeApiSlice";
import { useGetUnApprovedCountQuery } from "../../features/api/productApiSlice";
import { useEffect } from "react";
import { formatDate } from "../../commonFunctions/commonFunctions";
import Loading from "../../components/Common/Loading";
import { toast } from "react-toastify";
import Header from "../../components/Common/Header";
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

/// styles
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const infoDetail = [
  {
    name: 'Approval Status Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/approvalStatus.png?updatedAt=1703075709896'
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
    instruction: `All three are status buttons through which you can check the status of the product component.`,
  },
  {
    name: 'Approval Status View',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/approvalStatus.png?updatedAt=1703075709896'
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
    instruction: `After clicking on View button a dialog box of approval status pop-up `,
  },
];  
    


const OpenBoxApprovalStatus = () => {

const description = `In the "Open Box Approval Status," you can check the approval status, whether it is pending, approved, or rejected. All three statuses have similar columns, such as "status" and "view," with a view button available to inspect the form.`;

const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Open Box Approval Status`));
  }, []);


  /// initialize
  const classes = useStyles();
  const { search } = useLocation();

  /// local state
  const [queryParams, setQueryParams] = useState("open");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState(true);

  /// rtk query
  const { data, isLoading, refetch, isFetching } = useGetBoxOpenApprovalQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [updateApprovalApi, { isLoading: updateLoading }] =
    useUpdateBoxOpenApprovalMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });

  /// handlers

  const handleChange = (event, newQuery) => {
    setQueryParams(newQuery);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected({});
  };

  const handleSubmitQuery = async (status) => {
    setSkip(false);
    try {
      const params = {
        id: selected["_id"],
        status: status,
      };

      const res = await updateApprovalApi(params);
      toast.success(`Successfully ${status ? "Accepted" : "Rejected"}`);
      setOpen(false);
      if (status) {
        setQueryParams("accepted");
      } else {
        setQueryParams("rejected");
      }

      refetchUnApprovedCount();
    } catch (e) {
      console.log("Error at Open Box Approval Status");
      console.log(e);
    }
    setSkip(true);
    setSelected({});
  };

  /// useEffects
  useEffect(() => {
    if (data?.success) {
      const newRows = data.data.map((item, index) => {
        return { ...item, id: index + 1, date: formatDate(item.createdAt) };
      });

      setRows(newRows);
    }
  }, [data, isFetching]);

  /// columns

  const columns = [
    {
      field: "id",
      flex: 0.3,
      headerName: "Sno",
      width: 80,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "reason",
      flex: 0.3,
      headerName: "Description",
      minWidth: 230,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      flex: 0.3,
      headerName: "Date",
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      flex: 0.3,
      headerName: "Status",
      minWidth: 130,

      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const text =
          params.row.status === "open" ? "pending" : params.row.status;
        const color =
          params.row.status === "open"
            ? "blue"
            : params.row.status === "rejected"
            ? "red"
            : "green";
        return (
          <div
            style={{
              color: color,
            }}
          >
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      field: "action",
      flex: 0.3,
      headerName: "View",
      minWidth: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpen(true);
              rows.forEach((item) => {
                if (item.id === params.row.id) {
                  setSelected(item);
                }
              });
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  /// Custom toolbar
  const CustomToolbar = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        <ToggleButtonGroup
          color="primary"
          value={queryParams}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton classes={{ selected: classes.selected }} value="open">
            Pending Query
          </ToggleButton>
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="accepted"
          >
            Approved Query
          </ToggleButton>
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="rejected"
          >
            Rejected Query
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={'Open Box Approval Status'}
        info={true}
        customOnClick={handleOpen1}
      /> */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose1}
      />

      <Loading loading={isLoading || isFetching} />

      <Box
        sx={{
          width: '100%',
          height: '82vh',
          '& .super-app-theme--header': {
            background: '#eee',
            color: 'black',
            textAlign: 'center',
          },
          '& .vertical-lines .MuiDataGrid-cell': {
            borderRight: '1px solid #e0e0e0',
          },
          '& .supercursor-app-theme--cell:hover': {
            background:
              'linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)',
            color: 'white',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            background: '#eee',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>

      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{ width: '100%', backdropFilter: 'blur(5px)' }}
          maxWidth='xl'
        >
          <DialogTitle
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>Date: {formatDate(selected.createdAt)}</div>
            <div>Description: {selected.reason}</div>
            <div>Status: {selected.status}</div>
          </DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ width: '100%' }}>
                <TableHead
                  sx={{
                    position: 'sticky',
                    top: '0',
                  }}
                >
                  <TableRow>
                    <StyledTableCell>Sno</StyledTableCell>
                    <StyledTableCell>SKU</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Current Quantity</StyledTableCell>
                    <StyledTableCell>Required Box Open Qty</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected?.products?.map((row, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.SKU}</StyledTableCell>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>{row.Quantity}</StyledTableCell>
                      <StyledTableCell>{row.openQty}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>

          {selected.status === 'open' && search === '?true' ? (
            <Box display='flex' justifyContent='space-between'>
              <Button onClick={handleClose}>Close</Button>
              <Button
                onClick={() => {
                  handleSubmitQuery(true);
                }}
              >
                {updateLoading ? <CircularProgress /> : 'Accept'}
              </Button>
              <Button
                onClick={() => {
                  handleSubmitQuery(false);
                }}
              >
                {updateLoading ? <CircularProgress /> : 'Reject'}
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default OpenBoxApprovalStatus;
