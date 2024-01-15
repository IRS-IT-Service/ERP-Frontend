import {
  Box,
  InputBase,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Button,
  Tooltip,
} from '@mui/material';
import React from 'react';
import Accordion from '@mui/material/Accordion';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Autocomplete from '@mui/material/Autocomplete';

const StyledTableCell = styled(TableCell)({
  // Your styling goes here
  textAlign: 'center',
  padding:0,
  maxHeight: '20px'
  // border:"2px solid red"

  // Add more styles as needed
});

const StyledTableCellFixed = styled(TableCell)({
  fontWeight: 'bold',
  textAlign: 'center',
  padding:0,
  // border: '2px solid black'
});

const CustomTextField = styled(TextField)({
  maxWidth: '140px',
  maxHeight: '50px',
  padding: 0,
  // border: '2px solid red'
});

const CustomTableRow = styled(TableRow)({
  maxWidth: '140px',
  maxHeight: '10px',
  // padding: 0,
  border: '2px solid red'
});

const counting = [ 14];
const counting2 = [1, 2, 3, 4, , 5, 6];

import InfoDialogBox from '../../components/Common/InfoDialogBox';
import Header from '../../components/Common/Header';

const infoDetail = [
  {
    name: 'Save',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/save_costCalculator.png?updatedAt=1703223683718'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction:
      "If you click 'View,' you can save the price for that particular price list",
  },
  {
    name: 'View Sub-total',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/View-sub-total_costCalculator.png?updatedAt=1703223683795'
        height={'100%'}
        width={'100%'}
      />
    ),
    instruction:
      "If you click 'View Sub-total,' you can see the particular price list total here",
  },
];

const TopHeaderData = [
  ' IRS274828394',
  ' Carbon Fibre Propeller 2479 (1 CW + 1CCW) With Adapter',
  'Current Landing Cost: ₹0.00',
  ' Delete',
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='QTY'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='USD $'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='RMB ₹'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='Basic Duty%'
    sx={{
      width: '5vw',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='GST%'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
];

const thirdHeaderInput = ['QTY', 'Basic Duty %', 'RMB', 'USD', 'GST', ];

const TopSideData = [
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='USD $'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='USD $'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='USD $'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
  <InputBase
    id='standard-basic'
    label='QTY'
    variant='filled'
    placeholder='USD $'
    sx={{
      width: '50px',
      height: '30px',
      boxShadow: 3,
      fontSize: '0.8rem',
      fontWeight: '600',
      marginRight: '0.3%',
      borderRadius: '5px',
      paddingY: '0.5%',
      paddingX: '3%',
      textAlign: 'center',
      // width: 'auto',
      // height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  />,
];

const labelData1 = [

  { label: 'Total USD: ', width: '50px', height: '20px' },
  { label: 'Price Ratio: ', width: '50px', height: '20px' },
  { label: 'Boe Price: ', width: '50px', height: '20px' },
  { label: 'Payment Price: ', width: '50px', height: '20px' },
  { label: 'Freight: ', width: '50px', height: '20px' },
  { label: 'Insurance: ', width: '50px', height: '20px' },
  { label: 'Landing for Other Value: ', width: '50px', height: '20px' },
  { label: 'Assessable Value: ', width: '50px', height: '20px' },
  { label: 'Basic Duty Value: ', width: '50px', height: '20px' },
  { label: 'SW Charge: ', width: '50px', height: '20px' },
  { label: 'GST Value: ', width: '50px', height: '20px' },
  { label: 'Late Fee: ', width: '50px', height: '20px' },
  { label: 'CD Total: ', width: '50px', height: '20px' },
];

const labelData2 = [
  { label: 'Shipping Value ', width: '50px', height: '20px' },
  { label: 'Shipping GST Value ', width: '50px', height: '15px' },
  { label: 'Total Shipping', width: '50px', height: '20px' },
];

const labelData3 = [
  { label: 'Regular Bill Entry', width: '50px', height: '20px' },
  { label: 'WareHouse Charge', width: '50px', height: '20px' },
  { label: 'Other Charge', width: '50px', height: '20px' },
  { label: 'Bank Charge', width: '50px', height: '20px' },
  { label: 'Total Other Charge', width: '50px', height: '20px' },
];

const labelData4 = [
  {
    label: 'Final Total (Total CD + Total Shipping + Total Other Charge )',
    width: '50px',
    height: '20px',
  },
  { label: 'GST Recover', width: '50px', height: '20px' },
  { label: 'Final Total Excel GST', width: '50px', height: '20px' },
  { label: 'Final Landing Cost Excel GST', width: '50px', height: '20px' },
  { label: 'Landing Cost (1 unit) Excel GST', width: '50px', height: '20px' },
  { label: 'Landing Cost (1 unit with GST)', width: '50px', height: '20px' },
];

const dimensionData = [
  { label: 'Length<sup>(cm)</sup> ', width: '50px', height: '20px' },
  { label: 'Width<sup>(cm)</sup> ', width: '50px', height: '20px' },
  { label: 'Height<sup>(cm)</sup> ', width: '50px', height: '20px' },
  { label: 'Volumne Weight<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Actual Weight<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Weight Compare<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Total Weight<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Weight Ratio<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Extra Weight<sup>(gm)</sup> ', width: '50px', height: '20px' },
  { label: 'Final Weight<sup>(gm)</sup> ', width: '50px', height: '20px' },
];

const sideLabelDataDrop1 = [
  { name: 'Unit', unit1: 'CM', unit2: 'MM' },
  { name: 'Payment Terms', unit1: 'FOB', unit2: 'CIF' },
  { name: 'Mode', unit1: 'Cargo', unit2: 'Courier' },
  { name: 'Weight Unit', unit1: 'KG', unit2: 'GM' },
];

const sideLabelDataDrop2 = [
  { name: 'Extra Weight ', width: '50px', height: '20px' },
  { name: 'WareHouse Charge', width: '50px', height: '20px' },
  { name: 'Frieght%', width: '50px', height: '20px' },
  { name: 'Frieght Value', width: '50px', height: '20px' },
  { name: 'Shipping Free', width: '50px', height: '20px' },
  { name: 'Insurance %', width: '50px', height: '20px' },
  { name: 'LOV %', width: '50px', height: '20px' },
  { name: 'GST OS%', width: '50px', height: '20px' },
  { name: 'Late Fee', width: '50px', height: '20px' },

  { name: 'RBOEC', width: '50px', height: '20px' },

  { name: 'Bank Charge', width: '50px', height: '20px' },
  { name: 'OCA', width: '50px', height: '20px' },
];

const sideLabelDataDrop3 = [
  { name: 'Total USD ', width: '50px', height: '20px' },
  { name: 'Total Boe', width: '50px', height: '20px' },
  { name: 'Total Payment', width: '50px', height: '20px' },
  { name: 'Total Frieght', width: '50px', height: '20px' },
  { name: 'Total Assesable', width: '50px', height: '20px' },
  { name: 'Total Insurance', width: '50px', height: '20px' },
  { name: 'Total BasicDuty', width: '50px', height: '20px' },
  { name: 'Total GST Value', width: '50px', height: '20px' },
  { name: 'Total CD Value', width: '50px', height: '20px' },
];

const sideLabelDataDrop4 = [
  { name: 'Volume Weight ', width: '50px', height: '20px' },
  { name: 'Acutal Weight', width: '50px', height: '20px' },
  { name: 'Final Weight', width: '50px', height: '20px' },
  { name: 'Shipping', width: '50px', height: '20px' },
  { name: 'Total OtherCharges', width: '50px', height: '20px' },
];

const sideLabelDataDrop5 = [
  { name: 'Final LandingCost Ex GST ', width: '50px', height: '20px' },
  { name: 'GST Recover', width: '50px', height: '20px' },
  { name: 'LandingCost Ex GST', width: '50px', height: '20px' },
  { name: 'LandingCost w GST', width: '50px', height: '20px' },
];

const headerFixData = [
  `SKU`,
  'Product Name',
  `Current Landing Cost`,
  `New Landing Cost`,
  <DeleteIcon />,
  <InputBase
    sx={{
      width: `30px`,
      height: `20px`,
      border: '1px solid black',
      borderRadius: '2px',
      padding: '5px',
      // marginLeft: '0.4%',
    }}
  />,
];

const NewCalcDivyam = () => {

  function createData(name, calories, fat, carbs, protein, price) {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
      price,
      history: [
        {
          date: '2020-01-05',
          customerId: '11091700',
          amount: 3,
        },
        {
          date: '2020-01-02',
          customerId: 'Anonymous',
          amount: 1,
        },
      ],
    };
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        {counting.map(() => (
          <CustomTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <StyledTableCell>
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {row.name}
            </StyledTableCell>
            <StyledTableCell align='right'>{row.calories}</StyledTableCell>

            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <InputBase
                // key={index}
                sx={{
                  width: `50px`,
                  height: `20px`,
                  border: '1px solid black',
                  borderRadius: '2px',
                  // padding: '5px',
                  // marginLeft: '0.4%',
                }}
              />
            </StyledTableCell>
            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <InputBase
                // key={index}
                sx={{
                  width: `50px`,
                  height: `20px`,
                  border: '1px solid black',
                  borderRadius: '2px',
                  // padding: '5px',
                  // marginLeft: '0.4%',
                }}
              />
            </StyledTableCell>
            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <InputBase
                // key={index}
                sx={{
                  width: `50px`,
                  height: `20px`,
                  border: '1px solid black',
                  borderRadius: '2px',
                  // padding: '5px',
                  // marginLeft: '0.4%',
                }}
              />
            </StyledTableCell>
            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <InputBase
                // key={index}
                sx={{
                  width: `50px`,
                  height: `20px`,
                  border: '1px solid black',
                  borderRadius: '2px',
                  // padding: '5px',
                  // marginLeft: '0.4%',
                }}
              />
            </StyledTableCell>
            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <InputBase
                // key={index}
                sx={{
                  width: `50px`,
                  height: `20px`,
                  border: '1px solid black',
                  borderRadius: '2px',
                  // padding: '5px',
                  // marginLeft: '0.4%',
                }}
              />
            </StyledTableCell>
            <StyledTableCell align='center'>{row.fat}</StyledTableCell>
            <StyledTableCell align='center'>{row.carbs}</StyledTableCell>
            <StyledTableCell align='right' sx={{ cursor: 'pointer' }}>
              <DeleteIcon />
            </StyledTableCell>
          </CustomTableRow>
        ))}

        <TableRow>
          <StyledTableCellFixed
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={12}
          >
            <Collapse in={open} timeout='auto' unmountOnExit>
              <AccordionDetails
                sx={{
                  height: 'auto',
                  // width: '60vw',
                  overflowY: 'auto',

                  // border: '2px solid black',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 'auto',
                    // width: "",
                    border: '1px solid grey',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bolder',
                      // border: '2px solid black',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#2151df',
                    }}
                  >
                    Product Pricing
                  </Typography>
                  <Box
                    sx={{
                      flexBasis: '70%',
                      // border: '1px solid grey',
                      minHeight: '23px',
                      display: 'flex',
                      // flexDirection: 'column',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      alignItems: 'center',
                      gap: '2%',
                      paddingX: '0.8%',
                      paddingY: '0.8%',
                      // boxShadow: 5,
                      marginBottom: '0.2%',
                      borderRadius: '5px',
                    }}
                  >
                    {labelData1.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {data.label}
                        </Typography>
                        <InputBase
                          key={index}
                          // placeholder={data.label}
                          sx={{
                            width: `${data.width}`,
                            height: `${data.height}`,
                            border: '1px solid black',
                            borderRadius: '2px',
                            padding: '5px',
                          }}
                        />
                      </div>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '40px',
                    border: '1px solid grey',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      // border: '2px solid black',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#2151df',
                    }}
                  >
                    Shipping
                  </Typography>
                  <Box
                    sx={{
                      flexBasis: '70%',
                      // border: '1px solid grey',
                      minHeight: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '3%',
                      paddingX: '0.8%',
                      paddingY: '0.5%',
                      // boxShadow: 5,
                      marginBottom: '0.2%',
                      borderRadius: '5px',
                    }}
                  >
                    {labelData2.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {data.label}
                        </Typography>
                        <InputBase
                          key={index}
                          // placeholder={data.label}
                          sx={{
                            width: `${data.width}`,
                            height: `${data.height}`,
                            border: '1px solid black',
                            borderRadius: '2px',
                            padding: '5px',
                          }}
                        />
                      </div>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '63px',
                    border: '1px solid grey',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      // border: '1px solid grey',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#2151df',
                    }}
                  >
                    Charging Price
                  </Typography>
                  <Box
                    sx={{
                      flexBasis: '70%',
                      // border: '1px solid grey',
                      minHeight: '15px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      alignItems: 'center',
                      gap: '3%',
                      paddingX: '0.8%',
                      paddingY: '0.8%',
                      marginBottom: '0.2%',
                      borderRadius: '5px',
                    }}
                  >
                    {labelData3.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {data.label}
                        </Typography>
                        <InputBase
                          key={index}
                          // placeholder={data.label}
                          sx={{
                            width: `${data.width}`,
                            height: `${data.height}`,
                            border: '1px solid black',
                            borderRadius: '2px',
                            padding: '5px',
                          }}
                        />
                      </div>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '80px',
                    border: '1px solid grey',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      // border: '2px solid black',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#2151df',
                    }}
                  >
                    Total Price
                  </Typography>
                  <Box
                    sx={{
                      flexBasis: '70%',
                      // border: '2px solid red',
                      minHeight: '15px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      alignItems: 'center',
                      gap: '3%',
                      padding: '0.8% 0.8%',
                      // boxShadow: 5,
                      marginBottom: '0.2%',
                      borderRadius: '5px',
                    }}
                  >
                    {labelData4.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {data.label}
                        </Typography>
                        <InputBase
                          key={index}
                          // placeholder={data.label}
                          sx={{
                            width: `${data.width}`,
                            height: `${data.height}`,
                            border: '1px solid black',
                            borderRadius: '2px',
                            padding: '5px',
                          }}
                        />
                      </div>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '80px',
                    border: '1px solid grey',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#2151df',
                    }}
                  >
                    Dimension
                  </Typography>
                  <Box
                    sx={{
                      flexBasis: '70%',
                      minHeight: '15px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      alignItems: 'center',
                      gap: '3%',
                      // boxShadow: 5,
                      padding: '0.8% 0.8%',
                      marginBottom: '0.2%',
                      borderRadius: '5px',
                    }}
                  >
                    {dimensionData.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                          }}
                          dangerouslySetInnerHTML={{ __html: data.label }}
                        />{' '}
                        <InputBase
                          key={index}
                          sx={{
                            width: `${data.width}`,
                            height: `${data.height}`,
                            border: '1px solid black',
                            borderRadius: '2px',
                            padding: '5px',
                            // marginLeft: '0.4%',
                          }}
                        />
                      </div>
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Collapse>
          </StyledTableCellFixed>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };

  const rows = [
    createData(
      'IRS274828394',
      ' Carbon Fibre Propeller 2479 (1 CW + 1CCW) With Adapter',
      '₹3.99',
      '₹0.54',
      'Delete'
    ),
    // createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    // createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    // createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    // createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
  ];
  const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];
  return (
    <Box sx={{ marginTop: '4.7%', width: '90vw', height: '82vh' }}>
      {/* <DrawerHeader /> */}

      {/* infoDialog table */}
      <Header
        Name={'Price Calculator'}
        // info={true}
        // customOnClick={handleOpen1}
      />
      {/* <InfoDialogBox
        infoDetails={infoDetail}
        // description={description1}
        // open={infoOpen}
        // close={handleClose1}
      /> */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignContent: 'center',
          // height: '8vh',
          width: '60vw',
          // border: '2px solid black',
        }}
      >
        <Autocomplete
          id='combo-box-demo'
          options={top100Films}
          freeSolo
          sx={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label=''
              InputProps={{ ...params.InputProps, type: 'search' }}
            />
          )}
        />
        <Button
          variant='contained'
          sx={{ border: '2px solid black', height: '4vh' }}
        >
          Contained
        </Button>
      </Box>

      <Box
        sx={{
          width: '85vw',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          gap: '0.5%',
          // border: '2px solid black',
        }}
      >
        {/* left accordian Table */}
        <TableContainer
          component={Paper}
          sx={{
            overflowY: 'auto',
            // border: '2px solid black',
            width: '79vw',
          }}
        >
          <Table
            stickyHeader
            aria-label='sticky table'
            sx={{ overflowY: 'auto' }}
          >
            <TableHead stickyHeader aria-label='sticky table'>
              <TableRow>
                <StyledTableCell />
                <StyledTableCellFixed>SKU</StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  Product Name
                </StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  QTY
                </StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  USD $
                </StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  RMD ₹
                </StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  Basic Duty%
                </StyledTableCellFixed>
                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  GST
                </StyledTableCellFixed>

                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  <Tooltip title='Current Landing Cost' placement='top'>
                    {/* Current Landing Cost */}CLC
                  </Tooltip>
                </StyledTableCellFixed>

                <StyledTableCellFixed
                  align='right'
                  sx={{ textAlign: 'center' }}
                >
                  <Tooltip title='New Landing Cost' placement='top'>
                    {/* New Landing Cost */}NLC
                  </Tooltip>
                </StyledTableCellFixed>

                <StyledTableCellFixed align='right'>
                  Delete
                </StyledTableCellFixed>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                overflowY: 'auto',
                // border: '2px solid black',
                height: '10vh',
              }}
            >
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Right Accordion */}
        <Box
          sx={{
            // border: '1px solid grey',
            // boxShadow: 5,
            borderRadius: '5px',
            flexBasis: '40%',
            height: '67.5vh',
            boxShadow: 5,
          }}
        >
          <Typography
            sx={{ textAlign: 'center', color: 'blue', fontWeight: 'bold' }}
          >
            Calculator
          </Typography>
          {/* box1 */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: '150px',
              minWidth: '150px',
              justifyContent: 'space-between',
              padding: '3% 1%',
              alignItems: 'center',
              gap: '0.5%',
              // boxShadow: 5,
              marginBottom: '1.5%',
              borderRadius: '5px',
              border: '1px solid grey',
            }}
          >
            {sideLabelDataDrop1.map((data, index) => (
              <select key={index} name='' id=''>
                <option
                  value={''}
                  Style={{ minHeight: '60px', border: '2px solid black' }}
                >
                  {data.name}
                </option>
                <option value=''>{data.unit1}</option>
                <option value=''>{data.unit2}</option>
              </select>
            ))}

            {sideLabelDataDrop2.map((data, index) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flex: 'wrap',
                }}
                key={index}
              >
                {' '}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {data.name}
                </Typography>
                <InputBase
                  key={index}
                  // placeholder={data.label}
                  sx={{
                    width: `${data.width}`,
                    height: `${data.height}`,
                    border: '1px solid black',
                    borderRadius: '2px',
                    padding: '5px',
                    // marginRight: '0.1%'
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* 2rd */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: '130px',
              minWidth: '150px',
              justifyContent: 'space-between',
              padding: '3% 1%',
              alignItems: 'center',
              gap: '0.5%',
              // boxShadow: 5,
              marginBottom: '1.5%',
              borderRadius: '5px',
              border: '1px solid grey',
            }}
          >
            {sideLabelDataDrop3.map((data, index) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flex: 'wrap',
                }}
                key={index}
              >
                {' '}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {data.name}
                </Typography>
                <InputBase
                  key={index}
                  // placeholder={data.label}
                  sx={{
                    width: `${data.width}`,
                    height: `${data.height}`,
                    border: '1px solid black',
                    borderRadius: '2px',
                    padding: '5px',
                    // marginRight: '0.1%'
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* 3th */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: '70px',
              minWidth: '150px',
              justifyContent: 'space-between',
              padding: '3% 1%',
              alignItems: 'center',
              gap: '0.5%',
              // boxShadow: 5,
              marginBottom: '1.5%',
              borderRadius: '5px',
              border: '1px solid grey',
            }}
          >
            {sideLabelDataDrop4.map((data, index) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flex: 'wrap',
                }}
                key={index}
              >
                {' '}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {data.name}
                </Typography>
                <InputBase
                  key={index}
                  // placeholder={data.label}
                  sx={{
                    width: `${data.width}`,
                    height: `${data.height}`,
                    border: '1px solid black',
                    borderRadius: '2px',
                    padding: '5px',
                    // marginRight: '0.1%'
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* 4th */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: '100px',
              minWidth: '150px',
              justifyContent: 'space-between',
              padding: '3% 1%',
              alignItems: 'center',
              gap: '0.5%',
              // boxShadow: 5,
              marginBottom: '1.5%',
              borderRadius: '5px',
              border: '1px solid grey',
            }}
          >
            {sideLabelDataDrop5.map((data, index) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flex: 'wrap',
                }}
                key={index}
              >
                {' '}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {data.name}
                </Typography>
                <InputBase
                  key={index}
                  // placeholder={data.label}
                  sx={{
                    width: `${data.width}`,
                    height: `${data.height}`,
                    border: '1px solid black',
                    borderRadius: '2px',
                    padding: '5px',
                    // marginRight: '0.1%'
                  }}
                />
              </Box>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default NewCalcDivyam;
