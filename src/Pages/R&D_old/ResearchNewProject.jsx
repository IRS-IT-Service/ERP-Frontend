import React, { useEffect } from 'react';
import {
  Box,
  styled,
  Button,
  Typography,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
  Stack,
  Autocomplete,
  Checkbox,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Popover,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// import {
//   useAddProjectNameMutation,
//   useAddProjectItemMutation,
//   useGetAllProjectDataQuery,
//   useGetAllRDInventoryQuery,
//   useUpdateAssignedStatusMutation,
//   useUpdateDamagedStatusMutation,
// } from '../../features/api/barcodeApiSlice';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const infoDetail = [
  {
    name: 'Submit Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/dscSubmit.png?updatedAt=1703231258665'
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
    instruction: `When you click on Submit Button, it will show you the Final Repair Form Details GUI`,
  },

  {
    name: 'Final Repair Form Details',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/final%20repair.png?updatedAt=1703231658883'
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
    instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
  },

  {
    name: 'Shipment Detail Tracking',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590'
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
    instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  },
];

const ResearchNewProject = () => {
  const description = `The Entry Form for Repairs Module is for the drone service center. Here, we enter customer details for drone services. After clicking the submit button, the data will be submitted.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`All R&D Projects`));
  }, []);
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const [infoOpen, setInfoOpen] = useState(false);

  // all states used in functions
  const [addPartsData, setAddPartsData] = useState([]);
  const [allProjectData, setAllProjectData] = useState([]);
  const [projectDetail, setProjectDetail] = useState({ status: '' });
  const [newProjectDialogClose, setNewProjectDialogClose] = useState(false);
  const [openCloseAddPart, setOpenCloseAddPart] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [openClosePD, setOpenClosePD] = useState(false);
  const [projectDetailData, setProjectDetailData] = useState([]);
  const [openCloseEP, setOpenCloseEP] = useState(false);
  const [displayBarcode, setDisplayBarcode] = useState(false);
  const [barcodeData, setBarcodeData] = useState([]);
  const [selectedBarcodeData, setSelectedBarcodeData] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [createProjectForm, setCreateProjectForm] = useState({
    projectName: '',
    description: '',
  });


  // createNewProjectHandler to createNewProject
  const createNewProjectHandler = (e) => {
    const { name, value } = e.target;
    setCreateProjectForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // rtk for getting inventory data
  const { data: isInventory, refetch: getAllInventoryDataRefetch } =
    useGetAllRDInventoryQuery();
  useEffect(() => {
    if (isInventory?.status === true) {
      const displayAllInventoryData = isInventory?.data?.map((data) => ({
        sku: data?.SKU,
        productName: data?.Name,
        barcode: data?.Barcode?.map((barcodeData) => ({
          Barcode: barcodeData,
        })),
      }));
      setAddPartsData(displayAllInventoryData);
    }
  }, [isInventory]);

  // rtk for add ProjectName Description post data
  const [addNewProjectData, { isLoading: loadingAddNewProjectData }] =
    useAddProjectNameMutation();

  // rtk for adding the product Parts
  const [addProductParts] = useAddProjectItemMutation();

  // rtk for assigning the barcode status
  const [assignBarcodeStatus] = useUpdateAssignedStatusMutation();

  // rtk for deleting the barcode status
  // const [deleteBarcodeStatus] = useUpdateDamagedStatusMutation();

  // submit for New Project handler
  const submitCreateProjectHandler = async () => {
    console.log(createProjectForm);

    if (!createProjectForm.projectName || !createProjectForm.description) {
      toast.error(`Please enter ProjectName and Description First`);
      return;
    }
    const requestData = {
      projectName: createProjectForm.projectName,
      description: createProjectForm.description,
    };
    try {
      const res = await addNewProjectData(requestData);
      toast.success(`Project Added successfully`);
    } catch (error) {
      toast.error(error);
    }
    setButtonDisabled(!isButtonDisabled);
    setTimeout(openCloseNewProjectBox(), 1000);

    getNewProjectDataRefech();
  };

  // rtk get projectData
  const {
    data: getNewProjectData,
    isLoading: getNewProjectDataLoading,
    refetch: getNewProjectDataRefech,
  } = useGetAllProjectDataQuery();

  useEffect(() => {
    if (getNewProjectData?.status === true) {
      const projectDataRows = getNewProjectData?.data?.map((data) => ({
        projectId: data?.projectId,
        projectName: data?.Name,
        startDate: data?.startDate
          ? new Date(data.startDate).toLocaleDateString('en-GB')
          : '',
        description: data?.Description,
        projectItems: data?.projectItem?.map((item) => ({
          productName: item.ProductName,
          barcode: item.Barcode,
          assigned: projectDetail?.status,
        })),
      }));
      console.log(projectDataRows);
      setAllProjectData(projectDataRows);
    }
  }, [getNewProjectData]);

  const columns = [
    { id: 1, label: 'SNo', minWidth: 120 },
    { id: 2, label: 'ProjectID', minWidth: 120 },
    { id: 3, label: 'Project Name', minWidth: 120 },
    {
      id: 5,
      label: 'Start Date ',
      minWidth: 120,
    },
    {
      id: 6,
      label: 'End Date ',
      minWidth: 120,
    },
    {
      id: 7,
      label: 'Add Parts ',
      minWidth: 120,
    },
    {
      id: 8,
      label: 'Edit & Update Project ',
      minWidth: 120,
    },
    {
      id: 9,
      label: 'Project Detail ',
      minWidth: 120,
    },
  ];

  // console.log(getNewProjectData);

  // change the project working status like weather its complete or not
  const handleProjectWorkingStatus = (e) => {
    const { name, value } = e.target;
    setProjectDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // onclick function which update the working of complete or not a project
  const updateProjectStatus = () => {
    console.log('Updating status:', projectDetail?.status);
    projectDetail.status
      ? toast.success(`Project ${projectDetail.status}`)
      : toast.error(`Choose one`);
    setTimeout(() => {
      setOpenCloseEP(false);
    }, 1000);
  };
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  // new project openClose
  const openCloseNewProjectBox = () => {
    setNewProjectDialogClose(!newProjectDialogClose);
    setButtonDisabled(false);
    setCreateProjectForm(
      createProjectForm.projectName === '' &&
        createProjectForm.description === ''
    );
  };

  // add part open close
  const handleOpenCloseAddPart = (allPartsData, projectId) => {
    if (allPartsData && projectId) {
      const newState = { partsData: allPartsData, projectId: projectId };
     
      setSelectedRow(newState);
    }
    setOpenCloseAddPart(!openCloseAddPart);
    // setBarcodeData(barcodeData);
    setSelectedBarcodeData([]);
    setDisplayBarcode(false);
  };
  // project detail open close
  const handleOpenClosePD = (row) => {
    setOpenClosePD(!openClosePD);
    setProjectDetailData(row);
  };

  // states to handle the edit project
  const [editProject, setEditProject] = useState([]);
  // openClose edit project detail
  const handleOpenCloseEP = (row) => {
    setOpenCloseEP(!openCloseEP);
    setEditProject(row);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseChangeStatus = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showBarcodeHandler = (partsBarcodeData, projectId) => {
    setBarcodeData([partsBarcodeData, projectId]);
    setDisplayBarcode(true);
  };
  // useEffect(() => {
  //   console.log(barcodeData);
  // }, [barcodeData]);
  const toggleBarcode = () => {
    setDisplayBarcode(false);
  };

  const selectBarcodeHandler = (event, selectedBarcodeName, data) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedBarcodeData((prevState) => [
        ...prevState,
        {
          productName: selectedBarcodeName[0]?.productName,
          Barcode: data?.Barcode?.Barcode,
          projectId: selectedBarcodeName[1],
        },
      ]);
    } else {
      setSelectedBarcodeData((prevState) =>
        prevState.filter(
          (barcode) =>
            barcode.productName !== selectedBarcodeName.productName ||
            barcode.Barcode !== data?.Barcode?.Barcode
        )
      );
    }
  };

  // function to check if a barcode is selected
  const isSelected = (data) => {
    return selectedBarcodeData.some(
      (barcode) => barcode.Barcode === data?.Barcode?.Barcode
    );
  };

  // submitted the selected barcode
  const barcodeDataSubmitted = async () => {
    if (selectedBarcodeData.length === 0) {
      toast.error('Data not Selected');
      setOpenCloseAddPart(true);
    }
    const requestPartData = {
      projectId: selectedBarcodeData[0]?.projectId, // sending only one projectId from the starting array
      projectItem: selectedBarcodeData.map((barcodeData) => ({
        ProductName: barcodeData.productName,
        Barcode: barcodeData.Barcode,
        assigned: projectDetail?.status,
      })),
    };

    // sending assign barcode status
    const assignBarcodeStatusData = {
      barcode: selectedBarcodeData?.map((assignBarcode) => assignBarcode?.Barcode),
    };

    // // sending delete barcode status
    // const deleteBarcodeStatusData = {
    //   barcode: selectedBarcodeData?.map((deleteBarcode) => deleteBarcode?.Barcode),
    // };
    

    console.log(requestPartData);
    try {
      const res = await addProductParts(requestPartData);
      toast.success(`Project Parts Added Successfully`);
      const assignRes = await assignBarcodeStatus(assignBarcodeStatusData).unWrap();
      // const deleteRes = await deleteBarcodeStatus(deleteBarcodeStatusData).unWrap();
    } catch (error) {
      toast.error(error);
    }
    setTimeout(() => {
      setOpenCloseAddPart(!openCloseAddPart);
    }, [1000]);
    getNewProjectDataRefech();
    getAllInventoryDataRefetch();
  };
  console.log(selectedBarcodeData);

  // close & clear the state which is in the addParts & Barcode
  const clearAndCloseHandler = () => {
    // setSelectedBarcodeData([]);
    setOpenCloseAddPart(!openCloseAddPart);
    setSelectedRow([]);
  };

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={`All R&D Projects`}
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

      <Box>
        <Box
          sx={{
            minWidth: '200px',
            height: '7vh',
            boxShadow: 4,
            marginY: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ minWidth: '12vw' }}>
            <Button
              variant='contained'
              sx={{ backgroundColor: color }}
              onClick={openCloseNewProjectBox}
            >
              Add New Project
            </Button>{' '}
          </Box>
          {/* <Box spacing={1} sx={{ width: 600 }}>
            <Autocomplete
              id='free-solo-demo'
              freeSolo
              options={top100Films.map((option) => option.title)}
              sx={{ width: 500, paddingY: 0 }}
              renderInput={(params) => (
                <TextField {...params} label='Search New Project' sx={{}} />
              )}
            />
          </Box> */}
          <Box
            sx={{
              // border: '2px solid red',
              minWidth: '39vw',
              height: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant='outlined'>Total Projects</Button>
            <Button variant='outlined'>Completed Projects</Button>
            <Button variant='outlined'>InComplete Projects</Button>
          </Box>

          {/* add new project DialogBox */}
          <Dialog
            maxWidth='xl'
            open={newProjectDialogClose}
            onClose={openCloseNewProjectBox}
          >
            <DialogTitle
              sx={{
                minWidth: '50vw',
                minHeight: '5vh',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'skyblue',
              }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                Add New Project
              </Typography>
            </DialogTitle>

            <DialogContent
              sx={{
                width: 'auto',
                minHeight: ' 10vh',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Box>
                <InputLabel htmlFor='projectName'>Project Name</InputLabel>
                <InputBase
                  id='projectName'
                  sx={{
                    width: '250px',
                    height: '40px',
                    border: '2px solid grey',
                    borderRadius: '5px',
                    paddingX: '5px',
                  }}
                  name='projectName'
                  value={createProjectForm.projectName}
                  onChange={createNewProjectHandler}
                />
              </Box>
              <Box>
                <InputLabel htmlFor='projectDescription'>
                  Project Description
                </InputLabel>
                <InputBase
                  id='projectDescription'
                  sx={{
                    width: '600px',
                    height: '40px',
                    border: '2px solid grey',
                    borderRadius: '5px',
                    paddingX: '5px',
                  }}
                  name='description'
                  value={createProjectForm.description}
                  onChange={createNewProjectHandler}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submitCreateProjectHandler}
                disabled={isButtonDisabled}
              >
                Submit
              </Button>
              <Button onClick={openCloseNewProjectBox}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 590 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allProjectData?.map((row, index) => (
                  <TableRow key={row.projectId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.projectId}</TableCell>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.startDate}</TableCell>
                    <TableCell>{row.endDate}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        sx={{ backgroundColor: color }}
                        onClick={() =>
                          handleOpenCloseAddPart(addPartsData, row?.projectId)
                        }
                      >
                        <AddIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        sx={{ backgroundColor: color }}
                        onClick={() => handleOpenCloseEP(row)}
                      >
                        Edit & Update Project
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => handleOpenClosePD(row)}
                        sx={{ backgroundColor: color }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={10}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Add parts */}
        <Dialog
          open={openCloseAddPart}
          onClose={!openCloseAddPart}
          maxWidth='xl'
        >
          <DialogTitle
            sx={{
              minWidth: '50vw',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: 'skyblue',
            }}
          >
            <Typography sx={{ fontWeight: '600' }}>
              All Inventory Parts
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
            }}
          >
            {/* parts name */}
            <TableContainer
              sx={{
                maxHeight: 490,
                maxWidth: `${displayBarcode ? '810px' : '100%'}`,
                overflow: 'auto',
              }}
            >
              <Table
                stickyHeader
                aria-label='sticky table'
                sx={{ border: '1px solid grey' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'grey' }}>SNo</TableCell>
                    <TableCell sx={{ backgroundColor: 'grey' }}>SKU</TableCell>
                    <TableCell sx={{ backgroundColor: 'grey' }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ backgroundColor: 'grey' }}>Qty</TableCell>
                    <TableCell sx={{ backgroundColor: 'grey' }}>
                      Select Part
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedRow?.partsData?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.sku}</TableCell>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.barcode.length}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            showBarcodeHandler(data, selectedRow?.projectId)
                          }
                          sx={{
                            backgroundColor:
                              barcodeData[0] === data ? 'skyblue' : 'inherit',
                            '&:hover': {
                              backgroundColor:
                                barcodeData[0] === data ? 'skyblue' : 'inherit',
                            },
                          }}
                        >
                          Select Barcode
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* parts barcode table */}
            <TableContainer
              sx={{
                maxHeight: 490,
                maxWidth: 595,
                overflow: 'auto',
                display: `${displayBarcode ? '' : 'none'}`,
              }}
            >
              <Table
                stickyHeader
                aria-label='sticky table'
                sx={{ border: '1px solid grey' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: 'grey',
                        alignContent: 'center',
                        paddingLeft: '2%',
                      }}
                    >
                      Sno
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'grey',
                        alignContent: 'center',
                        paddingLeft: '2%',
                      }}
                    >
                      Select
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'grey',
                        alignContent: 'center',
                        paddingLeft: '2%',
                      }}
                    >
                      Barcode Number
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'grey',
                        alignContent: 'center',
                        paddingLeft: '2%',
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#fda0a0',
                        alignContent: 'center',
                        paddingLeft: '5%',
                      }}
                    >
                      <Button
                        variant='text'
                        color='error'
                        onClick={toggleBarcode}
                      >
                        <ClearIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayBarcode &&
                    barcodeData[0]?.barcode?.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {data?.Barcode?.isAssigned === true ? (
                            <Checkbox disabled />
                          ) : (
                            <Checkbox
                              checked={isSelected(data)}
                              onChange={(event) =>
                                selectBarcodeHandler(event, barcodeData, data)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>{data?.Barcode?.Barcode}</TableCell>
                        <TableCell colSpan={2}>{`${
                          data?.Barcode?.isAssigned === true
                            ? 'In USE'
                            : 'IN INVENTORY'
                        }`}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={barcodeDataSubmitted}>Submit</Button>
            <Button onClick={clearAndCloseHandler}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Product Details */}
        <Dialog open={openClosePD} onClose={handleOpenClosePD} maxWidth='xl'>
          <DialogTitle
            sx={{
              minWidth: '70vw',
              minHeight: '19vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'skyblue',
              // border: '2px solid black'
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                // border: '2px solid black',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // border: '2px solid black',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: '600' }}>
                    ProjectId: {` `}
                  </Typography>
                  <Typography>
                    {' '}
                    <InputBase
                      value={projectDetailData?.projectId}
                      sx={{
                        // borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '60px',
                        paddingX: '1.5%',
                      }}
                    />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  <Typography sx={{ fontWeight: '600' }}>
                    ProjectName:
                  </Typography>
                  <Typography>
                    <InputBase
                      value={projectDetailData?.projectName}
                      sx={{
                        // borderBottom: '2px solid grey',
                        textAlign: 'center',
                        maxHeight: '20px',
                        minWidth: '230px',
                        paddingX: '2.5%',
                      }}
                    />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: '600' }}>StartDate:</Typography>
                  <Typography>
                    <InputBase
                      value={projectDetailData?.startDate}
                      sx={{
                        // borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '92px',
                        paddingX: '2.5%',
                      }}
                    />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  <Typography sx={{ fontWeight: '600' }}>EndDate: </Typography>
                  <Typography>
                    <InputBase
                      value={'Present'}
                      sx={{
                        // borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '92px',
                        paddingX: '1.5%',
                      }}
                    />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  <Typography sx={{ fontWeight: '600' }}>
                    Project Status:
                  </Typography>
                  <Typography>
                    <InputBase
                      value={projectDetailData?.projectItems?.assigned}
                      sx={{
                        // borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '100px',
                        paddingX: '1.5%',
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontWeight: '600' }}>Description:</Typography>
              <InputBase
                multiline
                value={projectDetailData?.description}
                sx={{
                  border: '2px solid grey',
                  borderRadius: '8px',
                  height: '7.6vh',
                  overflowY: 'auto',
                  whiteSpace: 'pre-line',
                  width: '93%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  paddingX: '0.5%',
                }}
              />
            </Box>
          </DialogTitle>

          <DialogContent>
            <TableContainer sx={{}}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Sno</TableCell>
                    <TableCell>Part Name</TableCell>
                    <TableCell>Part Barcode</TableCell>
                    <TableCell>Status of Part's Barcode</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {projectDetailData?.projectItems?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.barcode}</TableCell>
                      <TableCell>{`in use`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpenClosePD}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* edit product */}
        <Dialog open={openCloseEP} onClose={handleOpenCloseEP} maxWidth='xl'>
          <DialogTitle
            sx={{
              minWidth: '60vw',
              minHeight: '12vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'skyblue',
              // border: '2px solid black'
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                }}
              >
                Edit & Update Project
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: '600' }}>
                    ProjectId: {` `}
                  </Typography>
                  <Typography>
                    {' '}
                    <InputBase
                      value={editProject?.projectId}
                      sx={{
                        // borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '120px',
                        paddingX: '1.5%',
                      }}
                    />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  <Typography sx={{ fontWeight: '600' }}>
                    ProjectName:
                  </Typography>
                  <Typography>
                    <InputBase
                      value={editProject?.projectName}
                      sx={{
                        textAlign: 'center',
                        maxHeight: '20px',
                        maxWidth: '180px',
                        paddingX: '2.5%',
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            <TableContainer sx={{}}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Sno</TableCell>
                    <TableCell>Parts Name</TableCell>
                    <TableCell>Barcode</TableCell>
                    <TableCell>Change Barcode Status</TableCell>
                    <TableCell>Part Damage</TableCell>
                    <TableCell>Return Parts to Inventory</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editProject?.projectItems?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.barcode}</TableCell>
                      <TableCell>
                        <Button
                          aria-describedby={id}
                          variant='outlined'
                          onClick={handleClick}
                          sx={{ background: color }}
                        >
                          Change Status
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Checkbox {...label} />
                      </TableCell>
                      <TableCell>
                        <Button variant='text'>return</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <RadioGroup
              aria-label='status'
              name='status'
              value={projectDetail.status}
              onChange={handleProjectWorkingStatus}
              row
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label='Complete'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='Incomplete'
              />
            </RadioGroup>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button variant='text' onClick={updateProjectStatus}>
                Update
              </Button>
              <Button variant='text' onClick={handleOpenCloseEP}>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* edit product change status popup */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseChangeStatus}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Typography sx={{ p: 2, background: 'skyblue' }}>
            <RadioGroup
              aria-label='status'
              name='status'
              value={''}
              onChange={''}
              sx={{ display: 'flex' }}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label='Inventory'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='InUse'
              />

              <Button variant='outlined' size='small'>
                {' '}
                Update{' '}
              </Button>
            </RadioGroup>
          </Typography>
        </Popover>
      </Box>
    </Box>
  );
};

export default ResearchNewProject;
