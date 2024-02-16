import React from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from "@mui/x-data-grid";
import CachedIcon from "@mui/icons-material/Cached";
import { Box, Button, TablePagination, Typography } from "@mui/material";
import Nodata from "../../assets/error.gif";
import { useState, useEffect } from "react";


const  CartGrid = ({
  columns,
  rows,
  rowHeight,
  Height,
  cellClassName,
  autoHeight,
  apiRef,
  setHiddenColumns,
  hiddenColumns,
  refetch,
  pagination,
  filterString,
  setFilterString,
  page,
  setPage,
}) => {
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);

  const CustomFooter = () => {
    return (
      <GridToolbarContainer>
        <Box display='flex' justifyContent='space-between' width='100%'>
          <Button size='small' onClick={() => status()}>
            <CachedIcon />
          </Button>
          {/* <TablePagination
            component='div'
            count={pagination.totalPages}
            page={page - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);

              let paramString = filterString;

              let param = new URLSearchParams(paramString);

              param.set('page', newPage + 1);

              let newFilterString = param.toString();

              setFilterString(newFilterString);

              apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
            }}
            rowsPerPage={rowPerPage}
            // onRowsPerPageChange={(event) => {
            //   setRowPerPage(event.target.value);
            // }}
          /> */}
        </Box>
      </GridToolbarContainer>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: Height,
        '& .super-app-theme--header': {
          background: '#eee',
          color: 'black',
          textAlign: 'center',
        },
        '& .vertical-lines .MuiDataGrid-cell': {
          borderRight: '1px solid #e0e0e0',
        },
        '& .supercursor-app-theme--cell:hover': {
          background: 'linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)',
          color: 'white',
          cursor: 'pointer',
        },
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          background: '#eee',
        },
        position: 'relative',
      }}
    >
      <DataGrid
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        rowHeight={rowHeight}
        components={{
          Footer: CustomFooter,
          NoRowsOverlay: () => (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {showNoData && (
                <Box
                  sx={{
                    // border: '2px solid blue',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '150px',
                    height: '150px',
                  }}
                >
                  <img
                    src={Nodata}
                    alt=''
                    style={{ width: '100px', height: '100px' }}
                  />

                  <Typography
                    variant='body2'
                    sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    No data found !
                  </Typography>
                </Box>
              )}
            </Box>
          ),
        }}
        slotProps={{
          footer: { status: refetch },
        }}
        columnVisibilityModel={hiddenColumns}
        onColumnVisibilityModelChange={(newModel) => setHiddenColumns(newModel)}
        className={cellClassName}
        autoHeight={autoHeight}
        editMode='cell'
      />
    </Box>
  );
};

export default CartGrid;
