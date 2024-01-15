import {
  Box,
  Typography,
  styled,
  Button,
  TextField,
  InputBase,
  IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import Header from '../../components/Common/Header';
import { formatDate } from '../../commonFunctions/commonFunctions';
import './ProformaDetails.css';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import { useSelector } from 'react-redux';

// import { FaPlus } from 'react-icons/fa';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));



const StyledP = styled('div')(() => ({
  color: 'blue',
}));

const handleFileChange = (event) => {
  // Handle file change here
  const selectedFile = event.target.files[0];
  console.log('Selected File:', selectedFile);
};

const ProformaDetails = () => {

  /// global State
  const { themeColor } = useSelector((state) => state.ui);

  const [showForm, setShowForm] = useState(false);
  const showDialogHandler = () => {
    setShowForm(!showForm);
  };
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,

        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        // border: '2px solid, black'
      }}
    >
      <DrawerHeader />
      <Header Name={'Performa Details'} />

      <Box
        className=''
        sx={{
          width: '75vw',
          height: '80vh',
          boxShadow: '-4px 4px 18px 1px rgba(0, 0, 0, 0.2)',
          padding: '2% 1%',
          paddingLeft: '3%',
          margin: '1.2% 5.5%',
          border: 'solid 1px #fff',
          borderRadius: '8px',
          backgroundColor: themeColor.sideBarColor1,
          backdropFilter: '20%',
          // opacity: '20%'
        }}
      >
        {/* header2 */}
        <Box
          sx={{
            width: '68.5vw',
            height: '6vh',
            border: '2px solid black',
            borderRadius: '10px',
            WebkitBackdropFilter: 'blur(60px)',
            backdropFilter: 'blur(60px)',
            boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderImageSource: themeColor.sideBarColor1,
            borderImageSlice: '1',
            backgroundImage: 'themeColor.sideBarColor1',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            backgroundColor: 'themeColor.sideBarColor1',
            border: 'solid 1px #fff',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backdropFilter: 'blur(60px)',
            boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
          }}
        >
          <p className='header2'>Vendor</p>
          <p className='header2'>Performa No.</p>
          <p className='header2'>View</p>
          <p className='header2'>Date</p>
        </Box>

        {/* left right parent box */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingY: '1%',
          }}
        >
          {/* left */}
          <Box
            sx={{
              width: '49%',
              height: '90%',
              // margin: '0 50px 0 0',
              // padding: '109px 41.6px 49px 42px',
              WebkitBackdropFilter: 'blur(60px)',
              backdropFilter: 'blur(60px)',
              border: 'solid 3px #fff',
              borderTopLeftRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3 className='Header2'>Bank Payment</h3>

            {/* payment date */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3%',
                // border: '2px solid red'
              }}
            >
              <Typography
                sx={{
                  width: '19vw',
                  // height: '5vh',
                  marginLeft: '-35%',
                  marginBottom: '1%',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  fontStretch: 'normal',
                  lineHeight: 'normal',
                  letterSpacing: '-0.4px',
                  // textAlign: 'left',
                  color: '#f9f8fc',
                  // border: '2px solid black',
                }}
              >
                {' '}
                Payment Date
              </Typography>
              <InputBase
                type='text'
                placeholder='Enter Date Here'
                sx={{
                  width: '31vw',
                  height: '5.5vh',
                  margin: '1% 0px',
                  border: 'solid 3px #fff',
                  borderRadius: '8px',
                  boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(60px)',
                  paddingLeft: '1%',
                  color: '#f9f8fc',
                }}
              />
            </Box>

            {/* file1 & file2 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                height: '30%',
                paddingX: '3%',
                marginTop: '-1%',
                // border: '2px solid black'
              }}
            >
              {/* file1 */}
              <Box
                sx={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: '3%',
                  // border: '2px solid black',
                }}
              >
                <Typography
                  sx={{
                    width: '100%',
                    marginBottom: '1%',
                    marginLeft: '7%',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#f9f8fc',
                  }}
                >
                  File 1
                </Typography>
                <InputBase
                  type='file'
                  sx={{
                    // width: '100%',
                    // height: '6vh',
                    // margin: '1% 0px',
                    // border: 'solid 3px #fff',
                    // borderRadius: '8px',
                    // boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                    // backgroundColor: 'rgba(255, 255, 255, 0.35)',
                    // backdropFilter: 'blur(60px)',
                    // paddingLeft: '1%',
                    display: 'none', // Hide the default file input
                    // border: '2px solid black',
                  }}
                  inputProps={{
                    onChange: handleFileChange,
                    accept: '.pdf, .doc, .docx', // Specify allowed file types
                    id: 'file-input', // Add a unique ID for the label to reference
                  }}
                />
                <label htmlFor='file-input'>
                  <IconButton
                    component='span'
                    sx={{
                      width: '15vw',
                      height: '6vh',
                      margin: '1% 0px',
                      border: 'solid 3px #fff',
                      borderRadius: '8px',
                      boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      backdropFilter: 'blur(60px)',
                      paddingLeft: '0%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography sx={{ paddingLeft: '3%', color: '#f9f8fc' }}>
                      Upload File 1
                    </Typography>
                    <AddIcon sx={{
                       color: 'white' 
                       }} />
                  </IconButton>
                </label>
              </Box>

              {/* file2 */}
              <Box
                sx={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: '3%',
                  // border: '2px solid black',
                }}
              >
                <Typography
                  sx={{
                    width: '100%',
                    marginBottom: '1%',
                    marginLeft: '7%',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#f9f8fc',
                  }}
                >
                  File 2
                </Typography>
                <InputBase
                  type='file'
                  sx={{
                    // width: '100%',
                    // height: '6vh',
                    // margin: '1% 0px',
                    // border: 'solid 3px #fff',
                    // borderRadius: '8px',
                    // boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                    // backgroundColor: 'rgba(255, 255, 255, 0.35)',
                    // backdropFilter: 'blur(60px)',
                    // paddingLeft: '1%',
                    display: 'none', // Hide the default file input
                    // border: '2px solid black',
                  }}
                  inputProps={{
                    onChange: handleFileChange,
                    accept: '.pdf, .doc, .docx', // Specify allowed file types
                    id: 'file-input', // Add a unique ID for the label to reference
                  }}
                />
                <label htmlFor='file-input'>
                  <IconButton
                    component='span'
                    sx={{
                      width: '15vw',
                      height: '6vh',
                      margin: '1% 0px',
                      border: 'solid 3px #fff',
                      borderRadius: '8px',
                      boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      backdropFilter: 'blur(60px)',
                      paddingLeft: '0%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography sx={{ paddingLeft: '3%', color: '#f9f8fc' }}>
                      Upload File 2
                    </Typography>
                    <AddIcon sx={{ color: '#f9f8fc' }} />
                  </IconButton>
                </label>
              </Box>
            </Box>

            {/* Bank Name */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3%',
                // border: '2px solid red'
              }}
            >
              <Typography
                sx={{
                  width: '19vw',
                  // height: '5vh',
                  marginLeft: '-35%',
                  marginBottom: '1%',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  fontStretch: 'normal',
                  lineHeight: 'normal',
                  letterSpacing: '-0.4px',
                  // textAlign: 'left',
                  color: '#f9f8fc',
                  // border: '2px solid black',
                }}
              >
                {' '}
                Bank Name
              </Typography>
              <InputBase
                type='text'
                placeholder='Enter Your Bank Name'
                sx={{
                  width: '31vw',
                  height: '5.5vh',
                  margin: '1% 0px',
                  border: 'solid 3px #fff',
                  borderRadius: '8px',
                  boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(60px)',
                  paddingLeft: '1%',
                  color: '#f9f8fc',
                }}
              />
            </Box>

            {/* submit Button */}
            <Box
              sx={{
                marginLeft: '72%',
                marginTop: '7.5%',
                height: '5vh',
                width: '8vw',
              }}
            >
              <Button
                sx={{
                  width: '98%',
                  height: '100%',
                  margin: '0% 0 0 0%',
                  padding: '5% 10%',
                  borderRadius: '8px',
                  boxShadow: '-4px 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  border: '1px solid #fff',
                  backgroundColor: themeColor.sideBarColor1,
                  color: 'white',
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>

          {/* right */}
          <Box
            sx={{
              width: '48%',
              height: '90%',
              margin: '0 50px 0 0',
              // padding: '109px 41.6px 49px 42px',
              WebkitBackdropFilter: 'blur(60px)',
              backdropFilter: 'blur(60px)',
              border: 'solid 3px #fff',
              borderLeft: 'none',
              borderTopRightRadius: '10px',

              display: 'flex',
              flexDirection: 'column',
              // border: '2px solid black'
            }}
          >
            <h3 className='Header2'>Commercial Input</h3>

            {/* Add Input */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3%',
                // border: '2px solid red'
              }}
            >
              <Typography
                sx={{
                  width: '19vw',
                  // height: '5vh',
                  marginLeft: '-35%',
                  marginBottom: '1%',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  fontStretch: 'normal',
                  lineHeight: 'normal',
                  letterSpacing: '-0.4px',
                  // textAlign: 'left',
                  color: '#f9f8fc',
                  // border: '2px solid black',
                }}
              >
                {' '}
                Add Input
              </Typography>

              <IconButton
                sx={{
                  width: '31vw',
                  height: '5.5vh',
                  margin: '1% 0px',
                  border: 'solid 3px #fff',
                  borderRadius: '8px',
                  boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(60px)',
                  paddingLeft: '1%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // border: '2px solid black'
                }}
                onClick={showDialogHandler}
              >
                <Typography sx={{ paddingLeft: '1.5%', color: '#f9f8fc' }}>
                  Add Input Here
                </Typography>
                <ArrowBackIosNewSharpIcon
                  sx={{
                    rotate: showForm ? '90deg' : '-90deg',
                    color: 'white',
                    transition:
                      'rotate 0.5s ease-in-out, opacity 0.5s ease-in-out',
                  }}
                />
              </IconButton>

              {/* Onclick Box Display */}
              <Box
                sx={{
                  position: 'fixed',
                  top: '30%',
                  left: showForm ? '5%' : '',
                  width: '31vw',
                  height: '40vh',
                  borderRadius: '8px',
                  WebkitBackdropFilter: 'blur(60px)',
                  backdropFilter: 'blur(60px)',
                  boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                  border: '3px solid #fff',
                  opacity: showForm ? 1 : 0,
                  transition: 'left 0.2s ease-in-out, opacity 0.5s ease-in-out',
                }}
              >
                {/* file1 & file2 */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%',
                    height: '31%',
                    paddingX: '3%',
                    marginTop: '-2%',
                    gap: '2%',
                    // border: '2px solid black'
                  }}
                >
                  {/* file1 */}
                  <Box
                    sx={{
                      width: '30vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'space-between',
                      marginTop: '4%',

                      // border: '2px solid black',
                    }}
                  >
                    <Typography
                      sx={{
                        width: '100%',
                        marginBottom: '1%',
                        // marginLeft: '7%',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#f9f8fc',
                        // border: '2px solid black',
                      }}
                    >
                      Commercial Inventory No
                    </Typography>
                    <InputBase
                      type='text'
                      sx={{
                        width: '100%',
                        height: '6vh',
                        // margin: '1% 0px',
                        border: 'solid 3px #fff',
                        borderRadius: '8px',
                        boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        backdropFilter: 'blur(60px)',
                        paddingLeft: '0%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: '2px solid black',
                        display: 'none', // Hide the default file input
                        // border: '2px solid black',
                      }}
                      inputProps={{
                        onChange: handleFileChange,
                        accept: '.pdf, .doc, .docx', // Specify allowed file types
                        id: 'file-text', // Add a unique ID for the label to reference
                      }}
                    />
                    <label htmlFor='file-text'>
                      <Typography></Typography>
                      <IconButton
                        component='span'
                        sx={{
                          width: '100%',
                          height: '6vh',
                          // margin: '1% 0px',
                          border: 'solid 3px #fff',
                          borderRadius: '8px',
                          boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          backdropFilter: 'blur(60px)',
                          paddingLeft: '0%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          // border: '2px solid black',
                        }}
                      >
                        <Typography
                          sx={{ paddingLeft: '3%', color: '#f9f8fc' }}
                        >
                          Enter No. Here
                        </Typography>
                      </IconButton>
                    </label>
                  </Box>

                  {/* file2 */}
                  <Box
                    sx={{
                      width: '30vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'space-between',
                      marginTop: '4%',
                      // border: '2px solid black',
                    }}
                  >
                    <Typography
                      sx={{
                        width: '100%',
                        marginBottom: '1%',
                        // marginLeft: '7%',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#f9f8fc',
                        // border: '2px solid black',
                      }}
                    >
                      PDF Document
                    </Typography>
                    <InputBase
                      type='file'
                      sx={{
                        // width: '100%',
                        // height: '6vh',
                        // margin: '1% 0px',
                        // border: 'solid 3px #fff',
                        // borderRadius: '8px',
                        // boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                        // backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        // backdropFilter: 'blur(60px)',
                        // paddingLeft: '1%',
                        display: 'none', // Hide the default file input
                        // border: '2px solid black',
                      }}
                      inputProps={{
                        onChange: handleFileChange,
                        accept: '.pdf, .doc, .docx', // Specify allowed file types
                        id: 'file-input', // Add a unique ID for the label to reference
                      }}
                    />
                    <label htmlFor='file-input'>
                      <IconButton
                        component='span'
                        sx={{
                          width: '100%',
                          height: '6vh',
                          // margin: '1% 0px',
                          border: 'solid 3px #fff',
                          borderRadius: '8px',
                          boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          backdropFilter: 'blur(60px)',
                          paddingLeft: '0%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          // border: '2px solid black',
                          color: 'white',
                        }}
                      >
                        <Typography
                          sx={{ paddingLeft: '3%', color: '#f9f8fc' }}
                        >
                          Upload File 2
                        </Typography>
                        <AddIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Box>

                {/* file1 & file2 */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%',
                    height: '31%',
                    paddingX: '3%',
                    marginTop: '-2%',
                    gap: '2%',
                    // border: '2px solid black'
                  }}
                >
                  {/* file1 */}
                  <Box
                    sx={{
                      width: '30vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'space-between',
                      marginTop: '4%',

                      // border: '2px solid black',
                    }}
                  >
                    <Typography
                      sx={{
                        width: '100%',
                        marginBottom: '1%',
                        // marginLeft: '7%',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#f9f8fc',
                        // border: '2px solid black',
                      }}
                    >
                      BOE No.
                    </Typography>
                    <InputBase
                      type='text'
                      sx={{
                        width: '100%',
                        height: '6vh',
                        // margin: '1% 0px',
                        border: 'solid 3px #fff',
                        borderRadius: '8px',
                        boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        backdropFilter: 'blur(60px)',
                        paddingLeft: '0%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: '2px solid black',
                        display: 'none', // Hide the default file input
                        // border: '2px solid black',
                      }}
                      inputProps={{
                        onChange: handleFileChange,
                        accept: '.pdf, .doc, .docx', // Specify allowed file types
                        id: 'file-text', // Add a unique ID for the label to reference
                      }}
                    />
                    <label htmlFor='file-text'>
                      <Typography></Typography>
                      <IconButton
                        component='span'
                        sx={{
                          width: '100%',
                          height: '6vh',
                          // margin: '1% 0px',
                          border: 'solid 3px #fff',
                          borderRadius: '8px',
                          boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          backdropFilter: 'blur(60px)',
                          paddingLeft: '0%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          // border: '2px solid black',
                        }}
                      >
                        <Typography
                          sx={{ paddingLeft: '3%', color: '#f9f8fc' }}
                        >
                          Enter No Here
                        </Typography>
                      </IconButton>
                    </label>
                  </Box>

                  {/* file2 */}
                  <Box
                    sx={{
                      width: '30vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'space-between',
                      marginTop: '4%',
                      // border: '2px solid black',
                    }}
                  >
                    <Typography
                      sx={{
                        width: '100%',
                        marginBottom: '1%',
                        // marginLeft: '7%',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: '#f9f8fc',
                        // border: '2px solid black',
                      }}
                    >
                      File Document
                    </Typography>
                    <InputBase
                      type='file'
                      sx={{
                        // width: '100%',
                        // height: '6vh',
                        // margin: '1% 0px',
                        // border: 'solid 3px #fff',
                        // borderRadius: '8px',
                        // boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                        // backgroundColor: 'rgba(255, 255, 255, 0.35)',
                        // backdropFilter: 'blur(60px)',
                        // paddingLeft: '1%',
                        display: 'none', // Hide the default file input
                        // border: '2px solid black',
                      }}
                      inputProps={{
                        onChange: handleFileChange,
                        accept: '.pdf, .doc, .docx', // Specify allowed file types
                        id: 'file-input', // Add a unique ID for the label to reference
                      }}
                    />
                    <label htmlFor='file-input'>
                      <IconButton
                        component='span'
                        sx={{
                          width: '100%',
                          height: '6vh',
                          // margin: '1% 0px',
                          border: 'solid 3px #fff',
                          borderRadius: '8px',
                          boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          backdropFilter: 'blur(60px)',
                          paddingLeft: '0%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          // border: '2px solid black',
                          color: 'white',
                        }}
                      >
                        <Typography
                          sx={{ paddingLeft: '3%', color: '#f9f8fc' }}
                        >
                          Upload Doc.
                        </Typography>
                        <AddIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Box>

                {/* payment date */}
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1%',
                    // border: '2px solid red'
                  }}
                >
                  <Typography
                    sx={{
                      width: '29vw',
                      // height: '5vh',
                      // marginLeft: '-35%',
                      marginBottom: '0%',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      fontStretch: 'normal',
                      lineHeight: 'normal',
                      letterSpacing: '-0.4px',
                      // textAlign: 'left',
                      color: '#f9f8fc',
                      // border: '2px solid black',
                    }}
                  >
                    {' '}
                    Amount Details
                  </Typography>
                  <InputBase
                    type='text'
                    placeholder='Enter Amount Here'
                    sx={{
                      width: '29vw',
                      height: '5.5vh',
                      margin: '1% 0px',
                      border: 'solid 3px #fff',
                      borderRadius: '8px',
                      boxShadow: '-4px 4px 15px 0 rgba(0, 0, 0, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      backdropFilter: 'blur(60px)',
                      paddingLeft: '1%',
                      color: '#f9f8fc',
                    }}
                  />
                </Box>

                {/* submit Button */}
                <Box
                  sx={{
                    marginLeft: '72%',
                    marginTop: '7.5%',
                    height: '5vh',
                    width: '8vw',
                  }}
                >
                  <Button
                    sx={{
                      width: '98%',
                      height: '100%',
                      margin: '-25% 0 0 0%',
                      padding: '5% 10%',
                      borderRadius: '8px',
                      boxShadow: '-4px 4px 4px 0 rgba(0, 0, 0, 0.25)',
                      border: '1px solid #fff',
                      backgroundColor: themeColor.sideBarColor1,
                      color: 'white',
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProformaDetails;
