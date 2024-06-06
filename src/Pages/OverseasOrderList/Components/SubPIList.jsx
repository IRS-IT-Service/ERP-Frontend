import { React, useEffect, useState, useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
  InputAdornment,
  CircularProgress,
  InputBase,
  IconButton,
  Box,
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoDialogBox from '../../../components/Common/InfoDialogBox';
import { setHeader, setInfo } from '../../../features/slice/uiSlice';
import { useDispatch, useSelector } from 'react-redux';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));



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
];

const SubPiList = () => {
  const dispatch = useDispatch();
  const { isInfoOpen } = useSelector((state) => state.ui);
  useEffect(() => {
    dispatch(setHeader(`Sub List`));
  }, []);
  const description1 =
  'This is a Price Calculator where you can calculate the price ';
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };
  return (

    <Box component='main' sx={{ flexGrow: 1, p: 0, width: '100%' }}>
      <DrawerHeader />

      <Box  sx={{
        marginTop:"10px",
        border:"2px solid red",
        height: '90vh',
        display: 'flex',
        flexDirection: "column",
      }}>
<Box sx={{
width: '100%',
height: '8vh',
border: '2px solid blue',
}}>
  </Box>
<Box>
    <Accordion

    sx={{
      border: '2px solid #3385ff',
      backgroundImage:
        'linear-gradient(to right top, #dae5ff , #e8f0ff)',
      // marginBottom: "4px",
      '& .MuiAccordionSummary-content': {
        margin: '3px 0px',
      },
    }}
    // expanded={true}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon style={{ color: 'black' }} />}
      sx={{
        padding: '0',
        margin: '0px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          // marginBottom: "4px",
          paddingLeft: '5px',
        }}
      >
      

        <Box
          sx={{
            display: 'flex',
            justifyContent: '',
            marginTop: '.4rem',
            // marginBottom: ".4rem",
            // border: '2px solid yellow',
            padding: '.2rem',
            border: '2px solid #3385ff',
            justifyContent: 'space-between',
            borderRadius: '.4rem',
            boxShadow: '-3px 3px 4px 0px #404040',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box display={'flex'}>
            <Typography
              sx={{
                fontSize: '.6rem',
                fontWeight: '600',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
              QTY
            </Typography>
         
          </Box>

          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
              USD $
            </Typography>
       
          </Box>
          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
              RMB ¥
            </Typography>
      
          </Box>

          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
              Basic Duty %
            </Typography>
   
          </Box>
          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
              GST %
            </Typography>
 
          </Box>
          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
        
         
            </Typography>
            <Typography
              sx={{
                fontSize: '.666rem',
                color: 'black',
                backgroundColor: '#fff',
                paddingX: '1rem',
                border: '1px solid black',
                borderRadius: '.2rem',
                whiteSpace: 'nowrap',
              }}
            >
           
            </Typography>
          </Box>
          <Box display={'flex'}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '.7rem',
                marginTop: '3px',
                marginRight: '3px',
              }}
            >
   
   
            </Typography>
            <Typography
              sx={{
                fontSize: '.666rem',
                color: 'black',
                backgroundColor: '#fff',
                paddingX: '1rem',
                border: '1px solid black',
                borderRadius: '.2rem',
                whiteSpace: 'nowrap',
              }}
            >
              {' '}

            </Typography>
          </Box>
        </Box>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      </AccordionDetails>
      </Accordion>
      </Box>
      
      </Box>
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description1}
        open={isInfoOpen}
        close={handleClose1}
      />
</Box>

  )
}

export default SubPiList