import { React, useEffect, useState } from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Nodata from '../../assets/empty-cart.png';
import FilterBar from '../../components/Common/FilterBar';
import { Grid, Box, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts } from '../../features/slice/productSlice';
import { useGetAllProductQuery } from '../../features/api/productApiSlice';
import Loading from '../../components/Common/Loading';
import { useNavigate } from 'react-router-dom';
import CreateBoxApprovalDialog from './Components/CreateBoxApprovalDialog';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Sort By Brand',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: 'Sort By Category',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: 'Clear All Filter',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/ClearAllFilter.png?updatedAt=1717242379859'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "The 'Clear all filters' button removes all applied filters, resetting the view to display all available data without any filtering criteria applied",
  },
  {
    name: 'CheckBox',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkBox.png?updatedAt=1717248300834'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },

  {
    name: 'Create',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/btnCreate.png?updatedAt=1717396267381'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },

  {
    name: 'Search by SKU',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/SearchBySKU.png?updatedAt=1717396104896'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      'If you click the search box, you can search for any product by SKU',
  },
  {
    name: 'Search by Brand Name',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/searchByProductName.png?updatedAt=1717396139090'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      'If you click the search box, you can search for any product byproduct name',
  },
];

const CreateBoxOpenApproval = () => {
  const description = `Create Box Open Approval`;

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Create Box Open Approval`));
  }, []);

  /// initialize
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();

  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// local state

  const [showNoData, setShowNoData] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductQuery(
    { searchTerm: searchTerm || undefined },
    {
      pollingInterval: 1000 * 300,
    }
  );

  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  const removeSelectedItems = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    const newSelectedRowsData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    setSelectedItemsData(newSelectedRowsData);
    setSelectedItems(newSelectedItems);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  /// useEffect
  useEffect(() => {
    if (allProductData?.status === 'success') {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          SalesPrice: item.SalesPrice,
          Brand: item.Brand,
          Category: item.Category,
          allowedBoxOpen: item.allowedBoxOpen,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  //Columns*******************
  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.1,
      minWidth: 80,
      maxWidth: 130,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Name',
      headerName: 'Product ',
      flex: 0.3,
      minWidth: 300,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Brand',
      headerName: 'Brand',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Category',
      headerName: 'Category',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 110,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'GST',
      headerName: 'GST',
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => ` ${(+params.value).toFixed(0)} %`,
    },
    {
      field: 'allowedBoxOpen',
      headerName: 'Box Open Qty',
      type: 'number',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Quantity',
      headerName: 'QTY',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    // {
    //   field: "MRP",
    //   headerName: "MRP",
    //   flex: 0.3,
    //   minWidth: 100,
    //   maxWidth: 100,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    // },
    // {
    //   field: "SalesPrice",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   headerName: "Sales",
    //   align: "center",
    //   headerAlign: "center",
    //   minWidth: 70,
    //   maxWidth: 80,
    //   valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    // },
  ];

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={'Create Box Open Approval'}
        info={true}
        customOnClick={handleOpen}
      /> */}
      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <FilterBar
        apiRef={apiRef}
        customButton={selectedItems.length ? 'Create' : ''}
        customOnClick={handleOpenDialog}
        count={selectedItems}
      />
      <CreateBoxApprovalDialog
        open={open}
        setOpen={setOpen}
        data={selectedItemsData}
        removeHandler={removeSelectedItems}
      />

      <Grid container>
        {productLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: '5px' }}>
            <Box
              sx={{
                width: '100%',
                height: '83vh',
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
                columns={columns}
                rows={rows}
                rowHeight={40}
                apiRef={apiRef}
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'allowedBoxOpen', sort: 'desc' }],
                  },
                }}
                columnVisibilityModel={{
                  Category: false,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                // isRowSelectable={(params) => params.row.SalesPrice > 0}
                rowSelectionModel={selectedItems}
                components={{
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      {showNoData && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <img
                            style={{
                              width: '20%',
                            }}
                            src={Nodata}
                          />

                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                          >
                            No data found !
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CreateBoxOpenApproval;
