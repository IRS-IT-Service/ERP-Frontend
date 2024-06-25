import { React, useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Grid,
  Box,
  Button,
  styled,
  TablePagination,
  Portal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetDeletedProductQuery } from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import CachedIcon from "@mui/icons-material/Cached";
import Header from "../../components/Common/Header";
import { useSocket } from "../../CustomProvider/useWebSocket";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// for refresh data

const infoDetail = [
  {
    name: "SKU",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(1).png?updatedAt=1710225175364"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here you Can view Deleted Product SKU",
  },
  {
    name: "Product",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(2).png?updatedAt=1710225168282"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction: "Here you Can view Deleted Product Name",
  },
  {
    name: "Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(3).png?updatedAt=1710225171747"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here you Can view Deleted Product Brand",
  },
  {
    name: "Category",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(4).png?updatedAt=1710225183449"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here you Can view Deleted Product Category",
  },
  {
    name: "GST",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(5).png?updatedAt=1710225164247"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction: "Here you Can view Deleted Product GST",
  },
  {
    name: "Quantity",
    screenshot: (
      <img
        src="https://ik.imagekit.io/9ekdebyn7d/Information%20Screenshot/Removed%20Products/image(6).png?updatedAt=1710225179355"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction: "Here you Can view Deleted Product Quantity",
  },
];

const RemovedProduct = () => {
  const description =
    "This is Removed Products where you can view the Deleted Products";

  /// initialization
  const apiRef = useGridApiRef();
  const socket = useSocket();

  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [rows, setRows] = useState([]);

  // pagination state
  const [page, setPage] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  /// rtk query
  const { data, isLoading, isFetching, refetch } =
    useGetDeletedProductQuery(page);

  /// handlers

  /// useEffect
  useEffect(() => {
    if (data?.success) {
      const newRows = data?.data.map((item, index) => {
        return {
          id: index + 1,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          ThresholdQty: item.ThresholdQty,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST,
        };
      });

      setRows(newRows);
      setTotalCount(data?.totalItems);
      setPage(data?.currentPage);
      setItemCount(data?.itemCount);
    }
  }, [data]);

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Removed Product`));
  }, []);

  function MyCustomToolbar(prop) {
    return (
      <>
        <Portal container={() => document.getElementById("filter-panel")}>
          <GridToolbarQuickFilter />
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </>
    );
  }

  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 300,
      //    maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
  ];

  /// Custom Footer

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DrawerHeader />
      <Loading loading={isLoading || isFetching} />
      <Grid item>
        <Box id="filter-panel" />
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Box
            sx={{
              width: "100%",
              height: "87vh",
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
              slotProps={{
                footer: { status: refetch },
              }}
              slots={{
                toolbar: MyCustomToolbar,
              }}
              columns={columns}
              rows={rows}
              rowHeight={40}
              apiRef={apiRef}
              initialState={{
                filter: {
                  filterModel: {
                    items: ["Name"],
                    quickFilterExcludeHiddenColumns: true,
                  },
                },
              }}
            />
          </Box>
        </Grid>{" "}
        <InfoDialogBox
          infoDetails={infoDetail}
          description={description}
          open={isInfoOpen}
          close={handleClose}
        />
      </Grid>
    </Box>
  );
};

export default RemovedProduct;
