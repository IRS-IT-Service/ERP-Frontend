import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Button,
  Box,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CartGrid from "../../../components/Common/CardGrid";
import { useNavigate } from "react-router-dom";
import {
  useDeleteSellerMutation,
  useGetAllSellerQuery,
} from "../../../features/api/sellerApiSlice";
import Loading from "../../../components/Common/Loading";
import { toast } from "react-toastify";
import { formatDate } from "../../../commonFunctions/commonFunctions";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const SellerVerificationList = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState("");

  /// global state

  /// local state
  const [row, setRow] = useState([]);

  /// rtk query

  const {
    refetch: refetchSeller,
    data: allSellerData,
    isLoading: SellerList,
  } = useGetAllSellerQuery("both");
  const [deleteSeller, { isLoading }] = useDeleteSellerMutation();

  /// useEffect

  useEffect(() => {
    if (allSellerData?.status === "success") {
      const data = allSellerData.sellers.map((item, index) => {
        return {
          ...item,
          id: index,
          sellerId: item.sellerId,
          Date: formatDate(item.createdAt),
          UserName: item.name,
          status:
            item.personalQuery === "not_submit"
              ? "Pending"
              : item.personalQuery,
          Sno: index + 1,
          gstActive: item.document?.gstActive,
        };
      });
      setRow(data);
    }
  }, [allSellerData]);

  const handleOpenDial = (id) => {
    setDeleteData(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteData) return toast.error("SellerId is Required");
    try {
      const result = await deleteSeller(deleteData).unwrap();
      toast.success("Seller deleted successfully");
      refetchSeller();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    // {
    //   field: "sellerId",
    //   headerName: "Seller Id",
    //   flex: 0.3,
    //   minWidth: 100,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    // },
    {
      field: "UserName",
      headerName: "UserName",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "email",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Email",
      align: "center",
      headerAlign: "center",
      minWidth: 260,
    },
    {
      field: "Date",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Created Date",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "gstActive",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Gst-Status",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      cellClassName: (params) => {
        return params.value === "Active"
          ? "green"
          : "super-app-theme--cell-red";
      },
    },
    {
      field: "status",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      minWidth: 170,
    },

    {
      field: "View",
      headerName: "Action",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button
          disabled={params.row.document === null ? true : false}
          onClick={() => {
            navigate(
              `/myAccount/${params.row.sellerId}?${params.row.personalQuery}`
            );
          }}
        >
          View
        </Button>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Button onClick={() => handleOpenDial(params.row.sellerId)}>
          delete
        </Button>
      ),
    },
  ];
  return (
    <StyledBox>
      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Loading loading={SellerList} />
        <CartGrid columns={columns} rows={row} rowHeight={40} Height={"80vh"} />
      </Grid>
      {open && (
        <Dialog open={open}>
          <DialogTitle></DialogTitle>
          <DialogContent>
            You will loose this document from the database
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(!open)}>Close</Button>
            <Button onClick={() => handleDelete()}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </StyledBox>
  );
};

export default SellerVerificationList;
