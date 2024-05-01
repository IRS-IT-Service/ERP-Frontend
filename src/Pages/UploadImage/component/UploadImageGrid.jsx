import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Grid,
  CardMedia,
  CardContent,
  Card,
  Box,
  Popover,
  Button,
  Typography,
  DialogContent,
  Paper,
  DialogTitle,
  Stack,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useDeleteSideImageMutation,
  useGetAllProductV2Query,
  useGetOneProductQuery,
  useUploadSideImagesMutation,
  useSetDefaultImageMutation,
} from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import CloseIcon from "@mui/icons-material/Close";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import { toast } from "react-toastify";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import OneUpdateProductDial from "../../UpdateProduct/OneUpdateProductDial";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import OneUpdateProductDivyam from "../../UpdateProduct/OneUpdateProductDivyam";

const UploadImageGrid = () => {
  /// initialization
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const debouncing = useRef();

  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// global state
  const { userInfo } = useSelector((state) => state.auth);
  const { deepSearch, checkedBrand, checkedCategory } = useSelector(
    (state) => state.product
  );

  /// local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [rows, setRows] = useState([]);
  const [imageSKU, setImageSKU] = useState("");
  const [skip, setSkip] = useState(true);
  const [preView, setPreView] = useState(false);
  const [open, setOpen] = useState(false);
  const [SKUinfo, setSKUinfo] = useState("");

  /// pagination State
  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  /// rtk query
  const { refetch: refetchOneProduct, data: oneProductData } =
    useGetOneProductQuery(imageSKU, {
      skip: skip,
    });
  const {
    data: allProductData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllProductV2Query(filterString, {
    pollingInterval: 1000 * 300,
  });

  const [uploadSideImageApi, { isLoading: uploadSideImageLoading }] =
    useUploadSideImagesMutation();
  const [deleteSideImageApi, { isLoading: deleteImageLoading }] =
    useDeleteSideImageMutation();
  const [setImageDefaultApi, { isLoading: defaultImageLoading }] =
    useSetDefaultImageMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();

  /// handlers

  const onClose = () => {
    setOpen(!open);
  };

  const handleDeleteSideImage = async (fileId) => {
    try {
      const body = {
        sku: imageSKU,
        fileId: fileId,
      };

      await deleteSideImageApi(body).unwrap();
      toast.success("Image deleted successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
      refetch();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleSetDefaultImage = async (url) => {
    try {
      const data = {
        sku: imageSKU,
        body: { defaultImage: url },
      };
      await setImageDefaultApi(data).unwrap();
      toast.success("Image set as default", {
        position: toast.POSITION.TOP_CENTER,
      });
      refetchOneProduct();
    } catch (error) {
      console.error("Error setting image as default:", error);
      toast.error("Error setting image as default", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleFileSelect = async (event) => {
    try {
      const fileSizeLimit = 500 * 1024; // 500 KB in bytes
      const files = Array.from(event.target.files);

      const formData = new FormData();

      // Check the size of each uploaded file
      files.forEach((file) => {
        if (file.size > fileSizeLimit) {
          toast.error(`Image size exceeds the limit of 500 KB: ${file.name}`, {
            position: toast.POSITION.TOP_CENTER,
          });
          throw new Error(
            `Image size exceeds the limit of 500 KB: ${file.name}`
          );
        }
        formData.append("Images", file);
      });

      const body = {
        sku: imageSKU, // Use the value from imageSKU state
        Images: formData,
      };

      await uploadSideImageApi(body).unwrap();
      const liveStatusData = {
        message: `${userInfo.name} uploaded Image to SKU ${imageSKU}`,
        time: new Date(),
      };
      socket.emit("liveStatusServer", liveStatusData);
      toast.success("Images uploaded successfully", {
        position: toast.POSITION.TOP_CENTER,
      });

      event.target.value = null;
      setTimeout(refetchOneProduct, 1000);
      refetch();
      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: "product",
        by: "user",
        reference: { product: [imageSKU] },
      };

      const historyRes = await createUserHistoryApi(addProductHistory);
    } catch (error) {
      console.error("Error uploading images:", error);

      // Handle the error, show a toast message, etc.
      toast.error("Error uploading images", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleImage = (e, SKU) => {
    setImageSKU(SKU);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
          Weight: `${item.Weight} gm`,
          Dimension: `${item.Dimensions?.length} x ${item.Dimensions?.width} x ${item.Dimensions?.height}`,
          Category: item.Category,
          imageCount: item.sideImage?.length,
          isChanged: item.isChanged,
          GST: +item?.GST.toFixed(0),
        };
      });
      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

  useEffect(() => {
    let newFilterString = "";
    checkedBrand.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `brand=${item}`;
      } else {
        newFilterString += `&brand=${item}`;
      }
    });

    checkedCategory.forEach((item, index) => {
      newFilterString += `&category=${item}`;
    });
    if (!checkedCategory.length && !checkedBrand.length) {
      setFilterString(`${newFilterString}page=1`);
      return;
    }
    setFilterString(`${newFilterString}&page=1`);
  }, [checkedBrand, checkedCategory]);

  useEffect(() => {
    apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    clearTimeout(debouncing.current);
    if (!deepSearch) {
      setFilterString(`page=1`);
      return;
    } else {
      debouncing.current = setTimeout(() => {
        setFilterString(`deepSearch=${deepSearch}&page=1`);
      }, 1000);
    }
  }, [deepSearch]);

  /// Colums
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
      minWidth: 100,
      maxWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: params.row.isChanged ? "orange" : "",
              borderRadius: "5px",
            }}
            onDoubleClick={() => {
              onClose();
              setSKUinfo(params.row.SKU);
            }}
          >
            {params.row.SKU}
          </div>
        );
      },
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Weight",
      headerName: "Weight",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      //  maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Dimension",
      headerName: "Dimension",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      value: (params) => {
        const dimensions = params.row.Dimension;

        const formattedDimension = `${dimensions.length} x ${dimensions.width} x ${dimensions.height}`;
        return formattedDimension;
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 80,
      // maxWidth: 100,
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
      // maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.2,
      minWidth: 50,
      // maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: "imageCount",
      headerName: "ImageCount",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "View",
      headerName: "Preview",
      flex: 0.3,
      minWidth: 80,
      // maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              size="small"
              onClick={(e) => {
                setImageSKU(params.row.SKU);
                setSkip(false);
                setPreView(true);
              }}
            >
              Preview
            </Button>
          </>
        );
      },
    },
    {
      field: "uploadImg",
      headerName: "Upload",
      flex: 0.2,
      minWidth: 50,
  
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box>
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
            id="file-input"
          />
          <label htmlFor="file-input">
            <AddPhotoAlternateIcon
              onClick={(event) => handleImage(event, params.row.id)}
              sx={{ color: "green", cursor: "pointer" }}
            />
          </label>
        </Box>
      ),
    },
    {
      field: "ProdutEdit",
      headerName: "Product Edit",
      flex: 0.3,
      minWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box>
          <Button
            onClick={() => {
              onClose();
              setSKUinfo(params.row.SKU);
            }}
          >
            <EditIcon />
          </Button>
        </Box>
      ),
    },
  ];

  /// Custom Button

  const addProductCustomButton = (
    <Button
      variant="outlined"
      sx={{
        color: "white",
        background: color,
        "&:hover": {
          color: "black",
        },
      }}
      onClick={() => {
        navigate("/addRoboProduct");
      }}
    >
      Add Product
    </Button>
  );

  /// Custom Footer
  function CustomFooter(props) {
    const { status } = props;
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
          <Box display={"flex"} marginTop={"15px"}>
            {" "}
            <Box
              sx={{
                width: "50px",
                height: "20px",
                backgroundColor: "orange",
                marginRight: "5px",
                borderRadius: "5px",
              }}
            ></Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Orange Color Denotes Product is edited and pending Approval , Cant
              be edited further
            </Typography>
          </Box>
          <TablePagination
            component="div"
            count={totalProductCount}
            page={page - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);

              let paramString = filterString;

              let param = new URLSearchParams(paramString);

              param.set("page", newPage + 1);

              let newFilterString = param.toString();

              setFilterString(newFilterString);

              apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
            }}
            rowsPerPage={rowPerPage}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <OneUpdateProductDivyam
        open={open}
        onClose={onClose}
        SKU={SKUinfo}
        refetchAllProduct={refetch}
      />
      <FilterBarV2 apiRef={apiRef} customButton1={addProductCustomButton} />
      <Loading
        loading={
          isLoading ||
          uploadSideImageLoading ||
          deleteImageLoading ||
          isFetching
        }
      />
      <Popover
        sx={{}}
        elevation={1}
        open={preView}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        disableRestoreFocus
      >
        <DialogTitle
          sx={{
            backgroundColor: "#eeee",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            padding: "4px",
          }}
        >
          <Box sx={{ flex: "1", justifySelf: "center" }}>
            <Typography variant="h6">
              Product Name: {oneProductData?.data?.Name}
            </Typography>
            <Typography variant="h6">Product SKU: {imageSKU}</Typography>
          </Box>

          <CloseIcon
            onClick={() => {
              setPreView(false);
            }}
            sx={{
              background: "#000",
              color: "#fff",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        </DialogTitle>

        <DialogContent
          sx={{
            minWidth: 600,
            height: 600,
            display: "flex",
            justifyContent: "space-around",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <Paper elevation={10} sx={{ width: "300px", height: "300px" }}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                  objectFit: "fill",
                }}
                image={oneProductData?.data?.mainImage?.lowUrl}
                alt="main Image"
              />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                width: "150px",
                height: "80%",
                display: "flex",
                // flexDirection: 'column',
                alignItems: "center",
                justifyContent: "space-around",
                gap: "1rem",
              }}
            >
              {oneProductData?.data?.sideImage &&
                oneProductData?.data?.sideImage.map((img, index) => (
                  <Stack
                    key={index}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <Card>
                      <CardMedia
                        component="img"
                        sx={{
                          minWidth: 100,
                          height: 80,
                          background: "green",
                          borderRadius: "5px",
                          position: "relative",
                          cursor: "pointer",
                          objectFit: "contain",
                        }}
                        image={img?.lowUrl}
                        alt="side Image"
                        onClick={(e) => handleSetDefaultImage(img)}
                      />
                      {oneProductData?.data?.mainImage?.fileId ===
                        img.fileId && (
                        <Typography
                          sx={{
                            width: "100%",
                            height: "10%",
                            fontSize: "0.8rem",
                            textAlign: "center",
                            color: "red",
                          }}
                        >
                          Default Image
                        </Typography>
                      )}
                    </Card>
                    <HighlightOffIcon
                      sx={{
                        position: "absolute",
                        top: "2px",
                        backgroundColor: "orange",
                        borderRadius: "5rem",
                      }}
                      onClick={() => handleDeleteSideImage(img.fileId)}
                    />
                  </Stack>
                ))}
            </Paper>
            <Typography fontWeight="bold">
              Click these images to set as default image
            </Typography>
          </Box>
        </DialogContent>
      </Popover>

      <Grid item xs={12} sx={{ mt: "5px" }}>
        <Box
          sx={{
            width: "100%",
            height: "78vh",
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
            apiRef={apiRef}
            rows={rows}
            rowHeight={40}
            components={{
              Footer: CustomFooter,
            }}
            slotProps={{
              footer: { status: refetch },
            }}
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default UploadImageGrid;
