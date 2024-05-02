import React, { useEffect } from "react";
import {
  styled,
  Box,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Tooltip,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  useGetPendingProductQuery,
  usePendingProductApprovalMutation,
  useGetUnApprovedCountQuery,
} from "../../features/api/productApiSlice";
import { useState } from "react";
import Loading from "../../components/Common/Loading";
import Header from "../../components/Common/Header";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ChangeProductApproval = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);

  /// local state
  const [skip, setSkip] = useState(true);

  /// rtk query
  const { data, isLoading, refetch, isFetching } =
    useGetPendingProductQuery("update");

  const [approvalApi, { isLoading: approvalLoading }] =
    usePendingProductApprovalMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });
  /// handlers

  const handleSubmit = async (SKU, status) => {
    setSkip(false);
    try {
      const params = {
        SKU: [SKU],
        status,
        type: "changes",
      };

      const res = await approvalApi(params).unwrap();
      toast.success(`Product ${status ? "Accepted" : "Rejected"} successfully`);
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
      const processedSKU = data?.data?.map((item) => item.SKU);

      const params = {
        SKU: processedSKU,
        status,
        type: "changes",
      };

      const res = await approvalApi(params).unwrap();
      toast.success(`Product ${status ? "Accepted" : "Rejected"} successfully`);
      refetch();
      refetchUnApprovedCount();
    } catch (e) {
      console.log(e);
      console.log("Error at New Product Appproval");
    }
  };

  /// functions

  const checkChange = (str, str2) => {
    if (str === str2) {
      return false;
    } else {
      return true;
    }
  };

  const dimensionToString = (dimension) => {
    return `${dimension?.length || 0} X ${dimension?.width || 0} X ${
      dimension?.height || 0
    }`;
  };

  function compareArrays(array1, array2) {
    // Default to empty arrays if undefined
    array1 = array1 || [];
    array2 = array2 || [];

    // Check if both arrays have the same length
    if (array1.length !== array2.length) {
      return false;
    }

    // Sort both arrays
    const sortedArray1 = array1.slice().sort();
    const sortedArray2 = array2.slice().sort();

    // Compare the sorted arrays
    return JSON.stringify(sortedArray1) === JSON.stringify(sortedArray2);
  }

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Product Change Approval`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Loading loading={isLoading || isFetching || approvalLoading} />
      {/* <Header Name={"Product Change Approval"} /> */}

      <Box
        sx={{
          height: "86vh",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "97%",
            height: "95%",

            maxWidth: "99%",
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: themeColor.sideBarColor1,
                fontSize: "1px",
                position: "sticky",
                top: 0,
                zIndex: "100",
                maxHeight: "30px",
                overflowY: "auto",
              }}
            >
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>AltName</TableCell>
                <TableCell>Weight (gm)</TableCell>
                <TableCell>Dimension (L x W x H) (cm) </TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Subitems</TableCell>
                <TableCell>Box Dimension</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{item?.SKU}</TableCell>
                      <TableCell>{item?.Name}</TableCell>
                      <TableCell>{item?.AlternativeName}</TableCell>
                      <TableCell>{item?.Weight}</TableCell>
                      <TableCell>
                        {dimensionToString(item?.Dimensions)}
                      </TableCell>
                      <TableCell>{item?.Brand}</TableCell>
                      <TableCell>{item?.Category}</TableCell>
                      <TableCell>{item?.SubCategory}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={item?.subItems?.join("<>") || "None"}
                          placement="top-start"
                        >
                          <Button>View</Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Button>View</Button>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#00563B" }}
                          onClick={() => {
                            handleSubmit(item?.SKU, true);
                          }}
                        >
                          Accept
                        </Button>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#AA0000" }}
                          onClick={() => {
                            handleSubmit(item?.SKU, false);
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(item?.Name, item?.changedValues?.Name)
                          ? item?.changedValues?.Name
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(item?.AlternativeName, item?.changedValues?.AlternativeName)
                          ? item?.changedValues?.AlternativeName
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(item?.Weight, item?.changedValues?.Weight)
                          ? item?.changedValues?.Weight
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(
                          dimensionToString(item?.Dimensions),
                          dimensionToString(item?.changedValues?.Dimensions)
                        )
                          ? dimensionToString(item?.changedValues?.Dimensions)
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(item?.Brand, item?.changedValues?.Brand)
                          ? item?.changedValues?.Brand
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(
                          item?.Category,
                          item?.changedValues?.Category
                        )
                          ? item?.changedValues?.Category
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {checkChange(
                          item?.SubCategory,
                          item?.changedValues?.SubCategory
                        )
                          ? item?.changedValues?.SubCategory
                          : ""}
                      </TableCell>
                      <TableCell sx={{ color: "#AA0000" }}>
                        {" "}
                        {!compareArrays(
                          item?.subItems,
                          item?.changedValues?.subItems
                        ) ? (
                          <Tooltip
                            title={item?.changedValues?.subItems?.join("<>")}
                            placement="top-start"
                          >
                            <Button sx={{ color: "#AA0000" }}>View</Button>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            paddingTop: "5px",
            display: "flex",
            gap: "5px",
            marginBottom: "5px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginBottom: "5px",
              backgroundColor: "#166534",
            }}
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
            onClick={() => {
              handleSubmitBulk(false);
            }}
          >
            Reject All
          </Button>
        </Box>
      </Box>
      <Dialog open={false} maxWidth="xl">
        <DialogTitle
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Box Dimensions
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            width: "800px",
          }}
        >
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Current Box Dimensions
            </Typography>
            <Box sx={{ display: "flex", width: "100%" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead
                    sx={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "space-between",
                      backgroundColor: themeColor.sideBarColor1,
                      padding: "3px",
                    }}
                  >
                    <TableRow>Box No</TableRow>
                    <TableRow>Weight</TableRow>
                    <TableRow>Length</TableRow>
                    <TableRow>Width</TableRow>
                    <TableRow>Height</TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              New Box Dimensions
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{
              backgroundColor: themeColor.sideBarColor1,
              color: "white",
            }}
          >
            Accept
          </Button>
          <Button
            sx={{
              backgroundColor: themeColor.sideBarColor1,
              color: "white",
            }}
          >
            Reject
          </Button>
          <Button
            sx={{
              backgroundColor: themeColor.sideBarColor1,
              color: "white",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangeProductApproval;
