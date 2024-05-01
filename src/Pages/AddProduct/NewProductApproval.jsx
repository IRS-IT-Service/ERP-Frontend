import React from "react";
import { Box, styled, Button } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Header from "../../components/Common/Header";
import {
  useGetPendingProductQuery,
  usePendingProductApprovalMutation,
  useGetUnApprovedCountQuery,
} from "../../features/api/productApiSlice";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../components/Common/Loading";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { toast } from "react-toastify";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useSendMessageMutation } from "../../features/api/whatsAppApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const NewProductApproval = () => {
  const description = `This is an Approval Module for New Product Approval. In this module, you grant permission by selecting the products. Subsequently, ACCEPT ALL and REJECT ALL buttons appear, allowing you to approve or reject all selected products. You can navigate to the accept and reject columns, where icons enable you to perform the desired actions.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`New Product Approval`));
  }, []);

  const { userInfo } = useSelector((state) => state.auth);
  /// local state
  const [rows, setRows] = useState([]);
  const [skip, setSkip] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [sendWhatsAppmessage] = useSendMessageMutation();
  /// rtk query
  const { data, isLoading, refetch, isFetching } =
    useGetPendingProductQuery("NewProduct");

  const [approvalApi, { isLoading: approvalLoading }] =
    usePendingProductApprovalMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });

  /// useEffect

  useEffect(() => {
    if (data?.success) {
      const newRows = data.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          ...item,
          Dimensions: `${item.Dimensions.length} x ${item.Dimensions.width} x ${item.Dimensions.height}`,
        };
      });

      setRows(newRows);
    }
  }, [data]);

  /// handlers

  const handleSubmit = async (SKU, status, name) => {
    setSkip(false);
    try {
      const params = {
        SKU: [SKU],
        status,
        type: "newProduct",
      };
      const liveStatusData = {
        message: `${userInfo.name}  ${
          status ? "Approved" : "Rejected"
        } ${name} `,
        time: new Date(),
      };

      const datas = {
        message: liveStatusData.message,
        approvalName: "New Product Approval",
      };
      const res = await approvalApi(params).unwrap();
      toast.success(`Product ${status ? "Accepted" : "Rejected"} successfully`);
      await sendWhatsAppmessage(datas).unwrap();
      refetch();
      refetchUnApprovedCount();
    } catch (e) {
      console.log(e);
      console.log("Error at New Product Appproval");
    }
    setSkip(true);
  };

  const handleSubmitBulk = async (status) => {
    try {
      setSkip(false);
      if (!selectedItems.length) {
        toast.error("Please Select a Product First");
        return;
      }
      const liveStatusData = {
        message: `${userInfo.name}  ${
          status ? "Approved" : "Rejected"
        } ${selectedItemsData} `,
        time: new Date()
      };

      const datas = {
        message: liveStatusData.message,
        approvalName: "New Product Approval",
      };

      const params = {
        SKU: selectedItems,
        status: status,
        type: "newProduct",
      };

      const res = await approvalApi(params).unwrap();

      toast.success(`Product ${status ? "Accepted" : "Rejected"} successfully`);
      await sendWhatsAppmessage(datas).unwrap();
      refetch();
      refetchUnApprovedCount();
    } catch (e) {
      console.log(e);
      console.log("Error at New Product Appproval");
    }
    setSkip(true);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);

    const newSelectedRowsData = rows
      .filter((item) => selectionModel.includes(item.id))
      .map((item) => item.Name);

    setSelectedItemsData(newSelectedRowsData);
  };

  // Column
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 130,
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
      minWidth: 400,
      maxWidth: 800,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST ",
      flex: 0.3,
      minWidth: 60,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "Weight",
      headerName: "Weight",
      flex: 0.3,
      minWidth: 100,
      //  maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Dimensions",
      headerName: "Dimension (L x W x H)",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      value: (params) => {
        console.log(params.row);
        const dimensions = params.row.Dimensions;

        const formattedDimension = `${dimensions.length} x ${dimensions.width} x ${dimensions.height}`;
        return formattedDimension;
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "accept",
      headerName: "Accept",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "green",
              fontSize: "32px", // Adjust the size as needed
              cursor: "pointer", // Show pointer cursor on hover
            }}
          >
            {" "}
            <ThumbUpIcon
              onClick={() => {
                handleSubmit(params.row.SKU, true, params.row.Name);
              }}
            />
          </div>
        );
      },
    },
    {
      field: "Reject",
      headerName: "Reject",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "red",
              fontSize: "32px", // Adjust the size as needed
              cursor: "pointer", // Show pointer cursor on hover
            }}
          >
            <ThumbDownIcon
              onClick={() => {
                handleSubmit(params.row.SKU, false, params.row.Name);
              }}
            />
          </div>
        );
      },
    },
  ];

  /// Custom Footer
  function CustomFooter(props) {
    return (
      <GridToolbarContainer>
        <Button
          sx={{
            marginBottom: "5px",
            backgroundColor: "#166534",
          }}
          variant="contained"
          size="small"
          onClick={() => {
            handleSubmitBulk(true);
          }}
        >
          Accept All
        </Button>
        <Button
          sx={{
            marginBottom: "5px",
            backgroundColor: "#dc2626",
          }}
          variant="contained"
          size="small"
          onClick={() => {
            handleSubmitBulk(false);
          }}
        >
          Reject All
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Loading loading={isLoading || isFetching || approvalLoading} />

      {/* <Header
        Name={"New Product Approval"}
        info={true}
        customOnClick={handleOpen}
      /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        // infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <Box
        sx={{
          height: "86vh",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          components={{
            Footer: CustomFooter,
          }}
        />
      </Box>
    </Box>
  );
};

export default NewProductApproval;
