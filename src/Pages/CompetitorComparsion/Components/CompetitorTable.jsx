import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  styled,
  TablePagination,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import InfoIcon from "@mui/icons-material/Info";
import { useAddCompetitorMutation } from "../../../features/api/productApiSlice";
import { useGetAllCompetitorQuery } from "../../../features/api/productApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllProductV2Query } from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import CachedIcon from "@mui/icons-material/Cached";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import CompetitorDial from "./CompetitorDial";
const columnsData = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "QTY", headerName: "QTY" },
];

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "primary" : "#eee",
  color: theme.palette.mode === "dark" ? "white" : "black",
}));

// Dilog box table
function createData(Sno, CompetitorName, url) {
  return { Sno, CompetitorName, url };
}

const CompetitorTable = () => {
  // rtk Querry
  const [addCompetitor, { isLoading: addCompetitorLoading }] =
    useAddCompetitorMutation();

  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();
  const {
    data: allCompetitor,
    isLoading: getallCompetitorLoading,
    refetch: productrefetch,
  } = useGetAllCompetitorQuery();

  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
    useSelector((state) => state.product);

  // console.log(addCompetitor);
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({ Name: "", URL: "", Date: "" });
  const [rows, setRows] = useState([]);
  const [filterColumns, setFilterColumns] = useState([]);
  const [competitorColumns, setCompetitorColumns] = useState([]);
  const [openCompetitor, setOpenCompetitor] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (allCompetitor) {
      const updatedColumns = allCompetitor?.data?.flatMap((item) =>
        item?.Competitors?.map((competitor, index) => ({
          field: `${competitor?.Name}`,
          headerName: `${competitor?.Name}`,
          flex: 0.3,
          minWidth: 120,
          maxWidth: 200,
          align: "center",
          headerAlign: "center",
          headerClassName: "super-app-theme--header",
          renderCell: (params) => {
            const matchedCompetitor = params.row.competitor.find(
              (comp) => comp.Name === competitor.Name
            );
            const inStock = matchedCompetitor?.inStock;
            return (
              <TableCell align="center">
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {params.row[`${competitor.Name}`] && (
                    <span>{params.row[`${competitor.Name}`]?.Price} ₹ </span>
                  )}{" "}
                  {params.row[`${competitor.Name}`] && (
                    <span>
                      {" "}
                      <a
                        href={`https://${
                          params.row[`${competitor?.Name}`]?.URL
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <Tooltip
                          title={`${params.row[`${competitor?.Name}`]?.URL}`}
                          placement="top"
                          key={index}
                        >
                          <InfoIcon
                            sx={{
                              width: "15px",
                              marginTop: 0.5,
                              color: "black",
                            }}
                          />
                        </Tooltip>{" "}
                      </a>{" "}
                    </span>
                  )}{" "}
                  {params.row[`${competitor.Name}`] && (
                    <span style={{ fontSize: "15px" }}>
                      {inStock ? "✅" : "❌"}
                    </span>
                  )}
                </Box>
              </TableCell>
            );
          },
          cellClassName: "super-app-theme--cell",
        }))
      );
      setCompetitorColumns(updatedColumns);
    }
  }, [allCompetitor]);

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);

    const selectedRowsData = ids.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [filterString, setFilterString] = useState("page=1");
  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductV2Query(filterString, {
    pollingInterval: 1000 * 300,
  });

  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        let CompName = {};

        item.CompetitorPrice.forEach((compItem) => {
          CompName[compItem.Name] = {
            Price: compItem.Price,
            URL: compItem.URL,
            inStock:compItem.inStock
          };
        });

        return {
          id: index,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          Product: item.Name,
          GST: item.GST,
          Brand: item.Brand,
          Quantity: item.ActualQuantity,
          SalesPrice: item.SalesPrice,
          Category: item.Category,
          competitor: item.CompetitorPrice,
          ...CompName,
        };
      });
      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);
  /// local state

  const [hiddenColumns, setHiddenColumns] = useState({});

  /// pagination State

  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  const handleClose = () => {
    setOpen(false);
    setInput({});
  };

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

    checkedGST.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `&gst=${item}`;
      } else {
        newFilterString += `&gst=${item}`;
      }
    });
    if (!checkedCategory.length && !checkedBrand.length && !checkedGST.length) {
      setFilterString(`${newFilterString}page=1`);
      return;
    }

    setFilterString(`${newFilterString}&page=1`);
  }, [checkedBrand, checkedCategory, checkedGST]);

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

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
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
            }}
          >
            {params.row.Sno}
          </div>
        );
      },
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 200,
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
            }}
            onClick={() => {
              // navigate(`/OneProductDetails/${params.row.SKU}`);
            }}
          >
            {params.row.SKU}
          </div>
        );
      },
    },
    {
      field: "Product",
      headerName: "Product",
      flex: 0.3,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SalesPrice",
      headerName: "SalesPrice",
      flex: 0.3,
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${params.value}`,
    },

    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `${params.value} %`,
    },
  ];

  useEffect(() => {
    let filterColumns = columns
      .concat(competitorColumns)
      .map((columns) => columns.headerName);

    setFilterColumns(filterColumns);
  }, [competitorColumns]);

  const handleOpenCompetitor = () => {
    setOpenCompetitor(true);
  };
  const handleCloseCompetitor = () => {
    setOpenCompetitor(false);
  };

  function CustomFooter(props) {
    const { status } = props;

    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
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

  const addCustomer = (
    <Button variant="outlined" onClick={handleClickOpen}>
      Add Competitor
    </Button>
  );

  // post competitor name or url
  const handleOnChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
      Date: new Date(),
    });
  };
  const handleRemoveCompetitorItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);

    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelectedRow);
  };
  const handleAdd = async () => {
    try {
      if (!input) return toast.error("Please fill the data");
      const data = {
        Competitors: [input],
      };
      const result = await addCompetitor(data);

      if (!result.data.success) {
        return;
      }
      toast.success("Competitor added successfully");
      setInput({});
      refetch();
      productrefetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Add Competitor</Typography>
            <Button onClick={handleClose} sx={{ fontWeight: "bold" }}>
              {" "}
              Cancel
            </Button>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Competitor Name"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  name="Name"
                  value={input.Name}
                  onChange={handleOnChange}
                />
                <TextField
                  id="outlined-basic1"
                  label="URL"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  name="URL"
                  onChange={handleOnChange}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  onClick={handleAdd}
                  disabled={addCompetitorLoading}
                >
                  {addCompetitorLoading ? <CircularProgress /> : "Add"}
                </Button>
              </Box>
              <Box sx={{ marginTop: "12px" }}>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table
                    sx={{ minWidth: 500 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead
                      sx={{ position: "sticky", top: 0, background: "white" }}
                    >
                      <TableRow>
                        <TableCell>Sno</TableCell>
                        <TableCell>Competitor Name</TableCell>
                        <TableCell>Url</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allCompetitor?.data[0]?.Competitors?.map(
                        (row, index) => {
                          return (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell>{row.Name}</TableCell>
                              <TableCell>{row.URL}</TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Box>
      <Box sx={{ height: "100%", wdth: "100%" }}>
        <FilterBarV2
          apiRef={apiRef}
          customButton={
            selectedRows.length
              ? `set competitor price ${selectedRows.length}`
              : undefined
          }
          customOnClick={handleOpenCompetitor}
          customButton1={addCustomer}
        />

        <Grid container>
          <Loading loading={productLoading || isFetching} />

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
                "& .super-app-theme--header-Sno": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                  position: "sticky",
                  left: 0,
                  zIndex: 1000,
                },
                "& .super-app-theme--cell-Sno": {
                  background: "#fff",
                  position: "sticky",
                  left: 0,
                  zIndex: 1000,
                },
                "& .super-app-theme--header-SKU": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                  position: "sticky",
                  left: "3rem",
                  zIndex: 1000,
                },
                "& .super-app-theme--cell-SKU": {
                  background: "#fff",
                  position: "sticky",
                  left: "3rem",
                  zIndex: 1000,
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
                columns={columns.concat(competitorColumns)}
                rows={rows}
                rowHeight={40}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                keepNonExistentRowsSelected
                apiRef={apiRef}
                components={{
                  Footer: CustomFooter,
                }}
                slotProps={{
                  footer: { status: refetch },
                }}
              />
            </Box>
          </Grid>
          <CompetitorDial
            openCompetitor={openCompetitor}
            handleCloseCompetitor={handleCloseCompetitor}
            paramsData={selectedRows}
            handleOpenCompetitor={handleOpenCompetitor}
            columns={filterColumns}
            handleRemoveCompetitorItem={handleRemoveCompetitorItem}
            productrefetch={productrefetch}
            refetch={refetch}
          />
        </Grid>
      </Box>
    </div>
  );
};

export default CompetitorTable;
