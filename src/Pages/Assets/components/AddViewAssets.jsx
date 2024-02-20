import { Box, Button, Dialog, DialogContent } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddAssetsDialog from "./AddAssetsDialog";
import {
  useDeleteSingleAssetsMutation,
  useGetAllAssetsQuery,
} from "../../../features/api/assetsSlice";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { TrySharp, Visibility } from "@mui/icons-material";
import Loading from "../../../components/Common/Loading";
import BASEURL from "../../../constants/BaseApi";
import { Assets_URL } from "../../../constants/ApiEndpoints";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { GridToolbarContainer } from "@mui/x-data-grid";
import SyncIcon from "@mui/icons-material/Sync";

const AddViewAssets = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  // local states
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // rtk query call
  const {
    data: allAssets,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllAssetsQuery(page);
  const [deleteAssets, { isLoading: loadingAssets }] =
    useDeleteSingleAssetsMutation();
  // this dialog function for add all input field dialog
  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // this dialog function for opne recipt image
  const handleOpenDialog = (receipt) => {
    setOpen(true);
    setSelectedImage(receipt);
  };

  const handleCloseDial = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  // calling rtk query to show all the data
  useEffect(() => {
    if (allAssets?.status === true) {
      const data = allAssets?.data.map((item, index) => {
        return {
          id: item._id,
          Sno: index + 1 + (page - 1) * allAssets?.itemsPerPage,
          AssetsCode: item.AssetsCode,
          AssetsName: item.AssetsName,
          AssetsType: item.AssetsType,
          SerialNo: item.SerialNo,
          PurchaseDate: formatDate(item.PurchasedOn),
          Expiry: item.Expiry,
          Receipt: item.receipt,
          Product: item.product,
        };
      });

      setRows(data);
      setTotalCount(allAssets?.totalItems);
      setPage(allAssets?.currentPage);
      setItemCount(allAssets?.itemsPerPage);
    }
  }, [allAssets]);

  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}${Assets_URL}/downloadAssetBarcode`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Assets.xlsx");
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
  };

  const handleDelete = async (code) => {
    try {
      const result = await deleteAssets(code);
      toast.success("Assets Deleted Succefully");
      refetch();
    } catch (error) {
      toast.error(
        "Some error Occured while Deletin Assets Plz try after some times"
      );
    }
  };

  const fileViewSelector = (inputLink) => {
    const lowerCaseinputLink = inputLink.toLowerCase();
    const hasPDF = lowerCaseinputLink.includes("pdf");
    console.log(hasPDF);
    if (hasPDF) {
      return (
        <iframe
          style={{
            width: "100%",
            height: 555,
          }}
          src={inputLink}
          allowFullScreen

          //   frameBorder="0"
        ></iframe>
      );
    } else {
      return (
        <img
          src={inputLink}
          style={{
            width: "100%",
            objectFit: "auto",
          }}
        ></img>
      );
    }
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 20,
      maxWidth: 50,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "AssetsType",
      headerName: "Assets Type",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "AssetsName",
      headerName: "Assets Name",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SerialNo",
      headerName: "Serial No",
      flex: 0.2,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "PurchaseDate",
      headerName: "Purchase Date",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Expiry",
      headerName: "Waranty Duration",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "receipt",
      headerName: "Receipt",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              sx={{
                cursor: "pointer",
                "& :hover": {
                  color: color,
                },
              }}
              onClick={() => {
                handleOpenDialog(params.row.Receipt);
              }}
            >
              <Visibility />
            </Button>
          </div>
        );
      },
    },
    {
      field: "product",
      headerName: "Product-Image",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              sx={{
                cursor: "pointer",
                "& :hover": {
                  color: color,
                },
              }}
              onClick={() => {
                handleOpenDialog(params.row.Product);
              }}
            >
              <Visibility />
            </Button>
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete-Assets",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              sx={{
                cursor: "pointer",
                "& :hover": {
                  color: color,
                },
              }}
              onClick={() => {
                handleDelete(params.row.AssetsCode);
              }}
            >
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  /// Custom Footer
  function CustomFooter(props) {
    const { status } = props;
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small">
            <SyncIcon />
          </Button>
          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);
            }}
            rowsPerPage={itemCount}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      {/* buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "10px",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            color: "white",
            background: color,
            "&:hover": {
              color: "black",
            },
          }}
        >
          {" "}
          Add Assets
        </Button>
        <Button
          variant="outlined"
          onClick={handleDownloadClick}
          sx={{
            color: "white",
            background: color,
            "&:hover": {
              color: "black",
            },
          }}
        >
          {" "}
          Download Code In Excel
        </Button>
      </div>

      <div style={{ height: "80vh" }}>
        <Loading loading={isLoading || isFetching} />
        <DataGrid
          rows={rows}
          rowHeight={40}
          columns={columns}
          components={{
            Footer: CustomFooter,
          }}
          slotProps={{
            footer: { status: refetch },
          }}
        />
      </div>
      <Dialog open={open} onClose={handleCloseDial}>
        <DialogContent sx={{ width: "500px", height: "600px" }}>
          {console.log(selectedImage?.url)}
          {selectedImage?.url
            ? fileViewSelector(selectedImage?.url)
            : // <iframe
              //   src={selectedImage?.url}
              //   title='PDF Document'
              //   width='900px'
              //   height='600px'
              //   frameBorder='0'
              //   style={{
              //     boxSizing: 'border-box',
              //     overflow: 'hidden',
              //   }}
              //   scrolling='no'
              // />
              "No Receipt Found"}
        </DialogContent>
      </Dialog>
      {openDialog && (
        <AddAssetsDialog
          open={openDialog}
          close={handleClose}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default AddViewAssets;
