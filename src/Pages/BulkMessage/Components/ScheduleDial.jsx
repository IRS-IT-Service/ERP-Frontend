import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  TableContainer,
  Paper 
} from "@mui/material";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import Iphone from "../../../../public/iphone.png";
import chatBg from "../../../../public/ChatBackground.jpeg";
import NoImage from "../../../assets/Noimage.jpeg";
import { formatTime } from "../../../commonFunctions/commonFunctions";

import { toast } from "react-toastify";
import { TypeSpecimenSharp } from "@mui/icons-material";


const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      minWidth: "1000px",
      
    },
  }));

  const MiniCard = styled(Paper)(({ theme }) => ({
    backgroundColor: '#25D366',
    color: 'white',
    border: 'black', // WhatsApp green
    padding: '10px 16px',
    textAlign: 'center',
    overflow:"hidden",
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize:"10px",
    width:"100%",
  }));
  

const ScheduleDial = ({ open,
    handleClose,  data,messageData}) => {
        const contentRef = useRef(null);
        const [isExpanded, setIsExpanded] = useState(false);
        const [showReadMore, setShowReadMore] = useState(false);

        const toggleReadMore = () => {
            setIsExpanded(!isExpanded);
          };

          useEffect(() => {
            if (contentRef.current) {
              if (contentRef.current.scrollHeight > 308) {
                // Change this value to the specific height
                setShowReadMore(true);
              } else {
                setShowReadMore(false);
              }
            }
          }, [data]);

          function whatsappToHTML(text) {
            // Replace WhatsApp bold format with HTML bold tags
            text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
        
            // Replace WhatsApp italic format with HTML italic tags
            text = text.replace(/_(.*?)_/g, "<em>$1</em>");
        
            // Replace WhatsApp strikethrough format with HTML strikethrough tags
            text = text.replace(/~(.*?)~/g, "<del>$1</del>");
        
            // Replace WhatsApp monospace format with HTML code tags
            text = text.replace(/```(.*?)```/g, "<code>$1</code>");
        
            // Handle bulleted lists
            text = text.replace(/^•\s*(.*)$/gm, "<li>$1</li>");
            text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
            text = text.replace(/<\/li>\n<li>/g, "</li><li>");
        
            // Handle numbered lists
            text = text.replace(/^\d+\.\s*(.*)$/gm, "<li>$1</li>");
            text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ol>$&</ol>");
            text = text.replace(/<\/li>\n<li>/g, "</li><li>");
        
            // Handle line breaks
            text = text.replace(/\n/g, "<br>");
        
            return text.trim();
          }




console.log(messageData)
  return (
    <StyledDialog
    open={open}
    onClose={handleClose}
    sx={{ backdropFilter: "blur(5px)" }}
    maxWidth="xl"
  >
           <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding:"10px"
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textDecoration: "underline"
              }}
            >
              {`Preview of ${messageData.title}`}
            </Typography>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                background: "#32a852",
                color: "#fff",
                borderRadius: "5rem",
                padding: ".1rem",
                marginLeft: "auto",
              }}
            />
          </Box>
    <DialogContent sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
       }} maxWidth="xl">

 

          <Box
            sx={{
              width: "20vw",
              borderRadius: "50px",
             
            }}
          >
            {/* inner layer of iphone */}

            <Box
              sx={{
                position: "relative",
               
              }}
            >
           
  
              <img
                src={Iphone}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "center",
                
            
                  

                }}
              />
           
                   <Box
                sx={{
                  position: "absolute",
                  backgroundImage: `url(${chatBg})`,
                  width: "90%",
                  height: "96%",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: "auto",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "25px",
                  backgroundColor:"black",
                  zIndex: -1,
                }}
              ></Box>
           
              <Box
                sx={{
                  position: "absolute",
                  top: 30,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: "auto",
                  height: "84%",
                  width: "87%",
                  borderRadius: "10px",
                  overflow: "auto",
                  padding: 2,
                  
                  
                  zIndex: 100,
                }}
              >
                <Box
                  sx={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid #eee",
                    justifyContent: "center",
                    backgroundColor: "whitesmoke",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width:"100",
                      maxHeight: isExpanded ? "auto" : "32%",

                      overflow: "hidden",
                    }}
                  >
                    {messageData.Type === "Media" && (
                      <div style={{ width: "100%", marginBottom: "5px" }}>
                        <img
                          src={messageData.image.url ||
                            NoImage}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "10px",
                            background: "#fff",
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "12px",
                        padding: "10px 5px 10px 2px",
                        textAlign: "start",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        listStyleType: "disc",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html:whatsappToHTML(messageData.message),
                        }}
                        ref={contentRef}
                      />
                    </div>
                  </Box>

                  <Box>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        position: "absolute",
                        bottom: 1,
                        right: 8,
                        color: "grey",
                      }}
                    >
                      {formatTime(new Date())}
                    </p>
                  </Box>
                  {showReadMore && (
                    <div onClick={toggleReadMore}>
                      <span
                        style={{
                          color: "#05175e",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {isExpanded ? "Read Less" : "... Read More"}
                      </span>
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
            
      
       




        </Box>
        <Box
      id="Numbers"
      sx={{
        width: '50%',
        height: '70vh',
        margin: 'auto',
        padding: '20px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto', // Added to handle overflow
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          backgroundColor: 'black',
          color: '#fff',
          marginBottom: '10px',
          padding: '10px', // Added padding for better visual
        }}
        variant="h6"
      >
        Recipient
      </Typography>
      <Grid container spacing={2}>
        {messageData.contacts.map((item, index) => (
          <Grid item sx={{
           
          }} xs={10} sm={2} md={5} lg={4} key={index}>
            <MiniCard>
              <Typography  >{item}</Typography>
            </MiniCard>
          </Grid>
        ))}
      </Grid>
    </Box>
    </DialogContent>
    </StyledDialog>
  )
}

export default ScheduleDial