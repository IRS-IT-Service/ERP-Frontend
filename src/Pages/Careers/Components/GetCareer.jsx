import {
  Box,
  Button,
  CircularProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import folderIcon from "../../../assets/DrivePNG/folder.png";
import excel from "../../../assets/DrivePNG/excel.png";
import image from "../../../assets/DrivePNG/image.png";
import pdf from "../../../assets/DrivePNG/pdf.png";
import unknown from "../../../assets/DrivePNG/unknown.png";
import word from "../../../assets/DrivePNG/word.png";
import txt from "../../../assets/DrivePNG/txt.jpg";
import noData from "../../../assets/no-data-found.jpg";
import { useGetCareersQuery } from "../../../features/api/otherSlice";
const CreateCareer = () => {
  // local state
  const [createFolderName, setCreateFolder] = useState("");
  const [careerId, setCareerId] = useState("");
  const [careerName, setCareerName] = useState("");
  const [allCareers, setAllCareers] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openFor, setOpenFor] = useState("");
  const [folderDeleteOpen, setFolderDeleteOpen] = useState(false);
  const [trigger, setTrigger] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [FileName, setFileName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenuFile, setShowMenuFile] = useState(false);
  const [menuPositionFile, setMenuPositionFile] = useState({ x: 0, y: 0 });
  const [gridView, setGridView] = useState("icon");
  const [deleteConf, setDeleteConf] = useState(false);

  // rtk query api calling

  const {
    data: getCareers,
    loading: getAllCareersLoading,
    refetch: getNewCareersRefetch,
  } = useGetCareersQuery();

  const handleClickFolder = (data) => {
    setCareerId(data.id);
    setCareerName(data.name); // Optionally set the career name as well

    // Filter resumes based on the clicked career ID
    const career = getCareers.data.find((career) => career._id === data.id);
    if (career) {
      setResumes(career.resume || []); // Assuming resume data is stored in the 'resume' field
    } else {
      setResumes([]); // No resumes found for the clicked career
    }
  };

  ///Handle Context Menu

  const handleContextMenu = (e, career) => {
    e.preventDefault();
    if (career === careerId) {
      setShowMenu(true);
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContextMenuFile = (e, folder) => {
    e.preventDefault();
    setFileName(careerId);
    setShowMenuFile(true);
    setMenuPositionFile({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClick = () => {
    setShowMenu(false);
    setFolderDeleteOpen(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setShowMenuFile(false);
  };
  const handleCloseMenuFile = () => {
    setShowMenuFile(false);
    setShowMenu(false);
  };

  const handleGrid = (e, newAlignment) => {
    setGridView(newAlignment);
  };

  const handleCloseDial = async () => {
    setOpen(false);
    setCreateFolder("");
    setSelectedFile(null);
  };



  const handleDownloadFile = async(data) =>{
    try {
      const url = data.name
      const urlArray = url.split('/');
      const fileName = urlArray.pop();
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName); 
  
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
  
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error("Error downloading file");
    }
  }

  // fetching all files from api
  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const result = await getCareers;
        console.log(result?.data);
        setAllCareers(result?.data?.data);
        console.log(allCareers);
      } catch (error) {
        console.log(error);
      }
    };
    if (careerId) {
      fetchAllFiles();
    }
  }, [careerId, setCareerId, trigger, setTrigger]);

  function getFileExtension(filename) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        return image;
      case "pdf":
        return pdf;
      case "csv":
      case "xlsx":
        return excel;
      case "docx":
        return word;
      case "txt":
        return txt;

      default:
        return unknown;
    }
  }

  function getFileExtensionUrl(filename, url) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
    switch (extension) {
      case "docx":
        return word;
      case "pdf":
        return url;
      default:
        return unknown;
    }
  }

  return (
    <Box
      sx={{
        height: "87vh",
        width: "100%",
        marginTop: "10px",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <div
        style={{
          height: "30%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
            height: "100%",
            overflowY: "auto",
            flexWrap: "wrap",
            padding: "5px",
          }}
          onClick={handleCloseMenu}
        >
          {showMenu && (
            <div
              style={{
                position: "fixed",
                top: menuPosition.y,
                left: menuPosition.x,
                background: "#fff",
                border: "1px solid #ccc",
                padding: "5px",
                zIndex: 1000,
              }}
            >
              <ul
                style={{
                  listStyleType: "none",
                }}
              >
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleMenuClick}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5px",
                      padding: "2px",
                      "&:hover": {
                        backgroundColor: "rgb(1, 62, 173,0.5)",
                        color: "#fff",
                      },
                    }}
                  >
                    <DeleteIcon
                      sx={{
                        fontSize: "15px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      Delete File
                    </Typography>
                  </Box>
                </li>
              </ul>
            </div>
          )}

          {getCareers?.data?.map((career) => (
            <Box
              sx={{
                cursor: "pointer",
                borderRadius: "6px",
                background: `${
                  career.id === careerId ? "rgba(88, 160, 243,0.5)" : ""
                }`,
                border: `${career.id === careerId ? "1px solid #276AB7" : ""}`,
                width: "120px",
                height: "85px",
                padding: "2px",
                "&:hover": {
                  border: "1px solid #276AB7",
                  background: "rgba(88, 160, 243,0.5)",
                },
              }}
              key={career.id}
              onContextMenu={(e) => handleContextMenu(e, career._id)}
              onClick={() =>
                handleClickFolder({ id: career._id, name: career.Title })
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "2px",
                  padding: "10px",
                }}
              >
                <img
                  src={folderIcon}
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {career.Title}
                  </Typography>
                </div>
              </div>
            </Box>
          ))}
        </div>
      </div>
      <div
        style={{
          height: "70%",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid gray",
        }}
        onClick={handleCloseMenuFile}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <ToggleButtonGroup
            value={gridView}
            exclusive
            onChange={handleGrid}
            aria-label="text alignment"
          >
            <ToggleButton value="icon" aria-label="left aligned">
              <i class="fa-solid fa-grip"></i>
            </ToggleButton>
            <ToggleButton value="preview" aria-label="centered">
              <i class="fa-solid fa-table-cells-large"></i>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            padding: "0px 5px",
          }}
        >
          {resumes && resumes.length > 0 ? (
            <>
              {getAllCareersLoading ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "54vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                resumes?.map((file) => (
                  <>
                    {gridView === "preview" ? (
                      <Box
                        key={file?.fileId}
                        sx={{
                          display: "flex",
                          width: "150px",

                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                          overflow: "hidden",
                          textAlign: "center",
                          flexWrap: "wrap",
                          cursor: "pointer",
                          padding: "5px",
                          "&:hover": {
                            border: "1px solid #276AB7",
                            background: "rgba(88, 160, 243,0.5)",
                            borderRadius: "5px",
                          },
                        }}
                        onDoubleClick={() => handleDownloadFile(file)}
                        onContextMenu={(e) => handleContextMenuFile(e, file)}
                      >
                        <Box
                          sx={{
                            height: "120px",
                            width: "120px",

                            marginTop: "20px",
                            border: "0.5px solid gray",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={getFileExtension(file.url)}
                            alt="Image from Google Drive"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "fill",
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            textOverflow: "ellipsis",
                            whiteSpace: "wrap",
                          }}
                        >
                          {file.fileId}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          width: "150px",
                          height: "100px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                          overflow: "hidden",
                          textAlign: "center",
                          flexWrap: "wrap",
                          cursor: "pointer",

                          "&:hover": {
                            border: "1px solid #276AB7",
                            background: "rgba(88, 160, 243,0.5)",
                            borderRadius: "10px",
                          },
                        }}
                        onDoubleClick={() =>
                          handleDownloadFile({
                            id: file.fileId,
                            name: file.url,
                          })
                        }
                        onContextMenu={(e) => handleContextMenuFile(e, file)}
                      >
                        <img
                          src={getFileExtensionUrl(file.fileId)}
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            textOverflow: "ellipsis",
                            whiteSpace: "wrap",
                          }}
                        >
                          {file.fileId}
                        </Typography>
                      </Box>
                    )}
                  </>
                ))
              )}
              {showMenuFile && (
                <div
                  style={{
                    position: "fixed",
                    top: menuPositionFile.y,
                    left: menuPositionFile.x,
                    background: "#fff",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    padding: "5px",
                    zIndex: 1000,
                  }}
                >
                  <ul
                    style={{
                      listStyleType: "none",
                    }}
                  >
                    <li
                      style={{
                        cursor: "pointer",
                        padding: "5px",
                      }}
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          padding: "2px",
                          "&:hover": {
                            backgroundColor: "rgb(1, 62, 173,0.5)",
                            color: "#fff",
                          },
                        }}
                      >
                        <DownloadIcon
                          sx={{
                            fontSize: "15px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          Download File
                        </Typography>
                      </Box>
                    </li>
                    <li
                      style={{
                        cursor: "pointer",
                        borderTop: "1px solid #ccc",
                        padding: "5px",
                      }}
                      onClick={() => setDeleteConf(true)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          padding: "2px",
                          "&:hover": {
                            backgroundColor: "rgb(1, 62, 173,0.5)",
                            color: "#fff",
                          },
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            fontSize: "15px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          Delete File
                        </Typography>
                      </Box>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "54vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={noData}
                style={{
                  width: "20%",
                }}
              />
            </Box>
          )}
        </div>
      </div>
      {open && (
        <DriveDial
          open={open}
          close={handleCloseDial}
          setCreateFolderName={setCreateFolder}
          createFolderName={createFolderName}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          openFor={openFor}
        />
      )}
    </Box>
  );
};

export default CreateCareer;
