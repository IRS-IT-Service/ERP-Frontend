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
import { useAddProjectNameMutation } from '../../features/api/barcodeApiSlice';
import { useGetAllRDInventoryQuery } from '../../features/api/barcodeApiSlice';
import { useGetAllProjectDataQuery } from '../../features/api/barcodeApiSlice';
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

  // create new Project row Column
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

  // rtk getting inventory data
  const { data: isInventory } = useGetAllRDInventoryQuery();
  const [addPartsData, setAddPartsData] = useState([]);

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

  // useEffect(() => {
  //   // Log each item's sku property
  //   console.log(addPartsData);
  // }, [addPartsData]);

  // rtk for post data
  const [addNewProjectData, { isLoading: loadingAddNewProjectData }] =
    useAddProjectNameMutation();

  const [isButtonDisabled, setButtonDisabled] = useState(false);

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
      }));
      console.log(projectDataRows);
      setAllProjectData(projectDataRows);
    }
  }, [getNewProjectData]);

  const [allProjectData, setAllProjectData] = useState([]);
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

  // track project status
  const [projectDetail, setProjectDetail] = useState({
    status: '',
  });

  // change the project status
  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setProjectDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // update the status
  const updateProjectStatus = () => {
    console.log('Updating status:', projectDetail);
    projectDetail.status
      ? toast.success(`Project ${projectDetail.status}`)
      : toast.error(`Choose one`);
  };

  const top100Films = [
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
      title:
        'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
  ];

  const viewBarcodeColumns = [
    {
      id: 'SNo',
      sku: 'SKU',
      productName: 'Product Name',
      button: 'Select Part',
      qty: 'Qty',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const addPartColumns = [
    {
      id: 1,
      sNo: 'Sno',
      checkbox: 'Select',
      barcodeNumber: 'Barcode Number',
      isAssigned: `Status`,
      close: 'Close',
    },
  ];

  const currentDate = new Date().toLocaleDateString();
  const projectDetailHeader = [
    {
      id: 2,
      label: 'ProjectName: ',
      input: (
        <InputBase
          sx={{
            borderBottom: '2px solid grey',
            maxHeight: '20px',
            maxWidth: '180px',
            paddingX: '1.5%',
          }}
        />
      ),
    },
    {
      id: 3,
      label: 'StartDate: ',
      input: currentDate,
    },
    {
      id: 4,
      label: 'EndDate: ',
      input: 'Present Day',
    },
  ];

  const newProjectDetailCloumns = [
    {
      id: 1,
      label1: 'Sno',
      label2: 'Part Name',
      label3: `Part Barcode`,
      label4: `Status of Part's Barcode`,
    },
  ];

  const newProjectDetailRows = [
    {
      id: 1,
      partsName: `Mavic's 12TVG`,
      partsBarcode: `IRS29475648`,
      status: 'In Use',
    },
    {
      id: 2,
      partsName: `Phantom's 12TVG`,
      partsBarcode: `IRS876534345`,
      status: 'Damage',
    },
    {
      id: 3,
      partsName: `Drone's 12TVG`,
      partsBarcode: `IRS5425665`,
      status: 'In Inventory',
    },
    {
      id: 4,
      partsName: `Tejas's 12TVG`,
      partsBarcode: `IRS5454648`,
      status: 'In Use',
    },
  ];

  // new project openClose
  const [newProjectDialogClose, setNewProjectDialogClose] = useState(false);
  const openCloseNewProjectBox = () => {
    setNewProjectDialogClose(!newProjectDialogClose);
    setButtonDisabled(false);
    setCreateProjectForm(
      createProjectForm.projectName === '' &&
        createProjectForm.description === ''
    );
  };

  // add part open close
  const [openCloseAddPart, setOpenCloseAddPart] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const handleOpenCloseAddPart = (row, projectId) => {
    if (row && projectId) {
      setSelectedRow((prevState) => [
        ...prevState,
        {
          partsData: row,
          projectId: projectId,
        },
      ]);
    }
    setOpenCloseAddPart(!openCloseAddPart);
    console.log(selectedRow);
    setSelectedBarcodeData([]);
  };
  const clearAndCloseHandler = () => {
    setSelectedBarcodeData([]);
    setOpenCloseAddPart(!openCloseAddPart);
  };

  const barcodeDataSubmitted = () => {
    if (selectedBarcodeData.length === 0) {
      toast.error('Data not Selected');
      setOpenCloseAddPart(true);
    } else {
      toast.success('Parts Added Successfully!');
      setOpenCloseAddPart(!openCloseAddPart);
    }

    console.log(selectedBarcodeData);
  };

  // project detail open close
  const [openClosePD, setOpenClosePD] = useState(false);
  const [projectDetailData, setProjectDetailData] = useState([]);
  const handleOpenClosePD = (row) => {
    setOpenClosePD(!openClosePD);
    setProjectDetailData(row);
  };

  const [openCloseEP, setOpenCloseEP] = useState(false);
  const handleOpenCloseEP = (row) => {
    setOpenCloseEP(!openCloseEP);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
  };

  const [displayBarcode, setDisplayBarcode] = useState(
    Array(addPartsData.length).fill(false)
  );
  const [barcodeData, setBarcodeData] = useState([]);
  const showBarcodeHandler = (barcode) => {
    setBarcodeData(barcode);
    setDisplayBarcode(true);
  };
  const toggleBarcode = () => {
    setDisplayBarcode(false);
  };

  useEffect(() => {
    console.log(barcodeData);
  }, [barcodeData]);

  const addBarcodeHandler = () => {
    setDisplayBarcode(!displayBarcode);
  };

  const [selectedBarcodeData, setSelectedBarcodeData] = useState([]);

  const selectBarcodeHandler = (selectedBarcodeName, data) => {
    if (selectedBarcodeName && data) {
      setSelectedBarcodeData((prevState) => [
        ...prevState,
        {
          productName: selectedBarcodeName.productName,
          Barcode: data?.Barcode?.Barcode,
        },
      ]);
    }
  };

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      <Header
        Name={`All R&D Projects`}
        info={true}
        customOnClick={handleOpen}
      />
      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
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
            <Button variant='contained' onClick={openCloseNewProjectBox}>
              Add New Project
            </Button>{' '}
          </Box>
          <Box spacing={1} sx={{ width: 600 }}>
            <Autocomplete
              id='free-solo-demo'
              freeSolo
              options={top100Films.map((option) => option.title)}
              sx={{ width: 500, paddingY: 0 }}
              renderInput={(params) => (
                <TextField {...params} label='Search New Project' sx={{}} />
              )}
            />
          </Box>
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
                        onClick={() => handleOpenCloseEP(row)}
                      >
                        Edit & Update Project
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => handleOpenClosePD(row)}
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
                {viewBarcodeColumns.map((data, index) => (
                  <TableHead key={index}>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: 'grey' }}>
                        {data.id}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'grey' }}>
                        {data.sku}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'grey' }}>
                        {data.productName}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'grey' }}>
                        {data.qty}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'grey' }}>
                        {data.button}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                ))}

                <TableBody>
                  {addPartsData?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.sku}</TableCell>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.barcode.length}</TableCell>
                      <TableCell>
                        <Button onClick={() => showBarcodeHandler(data)}>
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
                {addPartColumns.map((data, index) => (
                  <TableHead key={index}>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: 'grey',
                          alignContent: 'center',
                          paddingLeft: '2%',
                        }}
                      >
                        {data.sNo}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: 'grey',
                          alignContent: 'center',
                          paddingLeft: '2%',
                        }}
                      >
                        {data.checkbox}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: 'grey',
                          alignContent: 'center',
                          paddingLeft: '2%',
                        }}
                      >
                        {data.barcodeNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: 'grey',
                          alignContent: 'center',
                          paddingLeft: '2%',
                        }}
                      >
                        {data.isAssigned}
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
                ))}

                <TableBody>
                  {displayBarcode &&
                    barcodeData?.barcode?.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {data?.Barcode?.isAssigned === true ? (
                            <Checkbox disabled />
                          ) : (
                            <Checkbox
                              onClick={() =>
                                selectBarcodeHandler(barcodeData, data)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>{data?.Barcode?.Barcode}</TableCell>
                        <TableCell colSpan={2}>{`${
                          data?.Barcode?.isAssigned === true
                            ? 'in USE'
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
              minWidth: '60vw',
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
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
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
                      value={projectDetailData?.projectId}
                      sx={{
                        borderBottom: '2px solid grey',
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
                    ProjectName
                  </Typography>
                  <Typography>
                    <InputBase
                      value={projectDetailData?.projectName}
                      sx={{
                        borderBottom: '2px solid grey',
                        textAlign: 'center',
                        maxHeight: '20px',
                        maxWidth: '150px',
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
                        borderBottom: '2px solid grey',
                        maxHeight: '20px',
                        maxWidth: '100px',
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
                  <Typography sx={{ fontWeight: '600' }}>EndDate</Typography>
                  <Typography>
                    <InputBase
                      value={'Present'}
                      sx={{
                        borderBottom: '2px solid grey',
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
                {newProjectDetailCloumns.map((data, index) => (
                  <TableHead key={index}>
                    <TableRow>
                      <TableCell>{data.label1}</TableCell>
                      <TableCell>{data.label2}</TableCell>
                      <TableCell>{data.label3}</TableCell>
                      <TableCell>{data.label4}</TableCell>
                    </TableRow>
                  </TableHead>
                ))}

                <TableBody>
                  {selectedBarcodeData?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.Barcode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <RadioGroup
              aria-label='status'
              name='status'
              value={projectDetail.status}
              onChange={handleStatusChange}
              row
            >
              <FormControlLabel
                value='Complete'
                control={<Radio />}
                label='Complete'
              />
              <FormControlLabel
                value='Incomplete'
                control={<Radio />}
                label='Incomplete'
              />
              <FormControlLabel
                value='InProgress'
                control={<Radio />}
                label='In Progress'
              />
              <Button variant='outlined' onClick={updateProjectStatus}>
                Update
              </Button>
            </RadioGroup>

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
                      value={projectDetailData?.projectId}
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
                      value={projectDetailData?.projectName}
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
                    <TableCell>Barcode</TableCell>
                    <TableCell>Change Barcode Status</TableCell>
                    <TableCell>Part Damage</TableCell>
                    <TableCell>Return Parts to Inventory</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>12205925895045</TableCell>
                    <TableCell>
                      <Button variant='text'>status</Button>
                    </TableCell>
                    <TableCell>
                      <Checkbox {...label} />
                    </TableCell>
                    <TableCell>
                      <Button variant='text'>return</Button>
                    </TableCell>
                  </TableRow>
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
              // value={projectDetail.status}
              // onChange={handleStatusChange}
              row
            >
              <FormControlLabel
                value='Complete'
                control={<Radio />}
                label='Complete'
              />
              <FormControlLabel
                value='Incomplete'
                control={<Radio />}
                label='Incomplete'
              />
            </RadioGroup>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button
                variant='text'
                // onClick={updateProjectStatus}
              >
                Update
              </Button>
              <Button variant='text' onClick={handleOpenCloseEP}>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ResearchNewProject;
