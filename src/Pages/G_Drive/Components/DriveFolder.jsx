import {
  Box,
  Button,
  CircularProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useCreateFolderMutation,
  useDeleteFileMutation,
  useDownloadFileMutation,
  useGetAllFilesOfSingleFolderMutation,
  useGetAllFolderQuery,
  useGetAllUsersInDriveQuery,
  useGetFolderBySpecificUserMutation,
  useUploadFileMutation,
} from "../../../features/api/driveApiSlice";
import DriveDial from "./DriveDial";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import folderIcon from "../../../assets/DrivePNG/folder.png";
import FolderDeleteDial from "./FolderDeleteDial";
import excel from "../../../assets/DrivePNG/excel.png";
import image from "../../../assets/DrivePNG/image.png";
import pdf from "../../../assets/DrivePNG/pdf.png";
import unknown from "../../../assets/DrivePNG/unknown.png";
import word from "../../../assets/DrivePNG/word.png";
import txt from "../../../assets/DrivePNG/txt.jpg";
import noData from "../../../assets/no-data-found.jpg";
import FileDelete from "./FileDelete";
import FolderVerificationDial from "./FolderVerificationDial";
import { useSelector, useDispatch } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";

const DriveFolder = () => {
  // local state
  const [createFolderName, setCreateFolder] = useState("");
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [allFiles, setAllFiles] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openFor, setOpenFor] = useState("");
  const [hovered, setHovered] = useState(null);
  const [folderDeleteOpen, setFolderDeleteOpen] = useState(false);
  const [trigger, setTrigger] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [FileName, setFileName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenuFile, setShowMenuFile] = useState(false);
  const [menuPositionFile, setMenuPositionFile] = useState({ x: 0, y: 0 });
  const [gridView, setGridView] = useState("icon");
  const [deleteConf, setDeleteConf] = useState(false);
  const [folderVerify, setFolderVerifyOtp] = useState(false);
  const [alignment, setAlignment] = useState("Your");
  const [mainAllFolders, setMainAllFolders] = useState([]);
  const [specificFolders, setSpecificFolders] = useState([]);
  const [userFolders, setUserFolders] = useState([]);
  const [singleFolderId, setSingleFolderId] = useState("");
  // getting data from redux
  const { adminId, name, isAdmin } = useSelector(
    (state) => state.auth.userInfo
  );

  // rtk query api calling
  const [
    creatingFolder,
    { isLoading: createFolderLoading, refetch: createFolderRefetch },
  ] = useCreateFolderMutation();
  const { data: getAllFolder, refetch: refetchAllFolder } =
    useGetAllFolderQuery();
  const [
    getAllfiles,
    { isLoading: getAllFilesLoading, refetch: getAllFilesRefetch },
  ] = useGetAllFilesOfSingleFolderMutation();
  const [
    uploadFile,
    { isLoading: uploadFileLoading, refetch: uploadFileRefetch },
  ] = useUploadFileMutation();

  const [
    downloadFile,
    { isLoading: downloadFileLoading, refetch: downloadFileRefetch },
  ] = useDownloadFileMutation();

  const [
    getUsersAllFolder,
    { isLoading: getAllUserFolderLoading, refetch: getAllUsersFolderRefetch },
  ] = useGetFolderBySpecificUserMutation();

  const {
    data: getAllUserInDrive,
    isLoading: getAllUserInDriveLoading,
    refetch: getAllUserInDriveRefetch,
  } = useGetAllUsersInDriveQuery();

  // using dispatch

  const dispatch = useDispatch();

  const { DriveVerifyOtp } = useSelector((state) => state.auth);

  // functions for hanlding things
  const handleClickFolder = (data) => {
    // if (!DriveVerifyOtp) {
    //   setFolderVerifyOtp(true);
    //   setFolderId(data.id);
    //   setFolderName(data.name);
    // } else {
    // setFolderVerifyOtp(true);

    setFolderId(data.id);
    setFolderName(data.name);
    setAllFiles([]);
    // }
  };

  const handleClickFolderNested = async (data) => {
    const folderId = data?.id;
    setSingleFolderId(folderId);
    try {
      const result = await getAllfiles(folderId);
      setAllFiles(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  ///Handle Context Menu
  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    if (folder === folderId && alignment === "Your") {
      setShowMenu(true);
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };
  const handleContextMenuNested = (e, folder) => {
    e.preventDefault();
    if (
      alignment === "Your" ? folder === folderId : folder === singleFolderId
    ) {
      setShowMenu(true);
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContextMenuFile = (e, folder) => {
    e.preventDefault();
    setFileName(folder);
    setShowMenuFile(true);
    setMenuPositionFile({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClick = () => {
    setShowMenu(false);
    setFolderDeleteOpen(true);
  };
  const handleMenuClickFile = () => {
    setShowMenu(false);
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

  const handleOpenDial = (data) => {
    setOpen(true);
    setOpenFor(data);
  };

  const handleCloseDial = async () => {
    setOpen(false);
    setCreateFolder("");
    setSelectedFile(null);
  };

  const handleCreateFolder = async () => {
    if (!createFolderName) return toast.error("plz enter folder name");
    try {
      const info = {
        folderName: createFolderName,
        userName: name,
        userId: adminId,
      };
      const createFolder = await creatingFolder(info).unwrap();
      toast.success("Folder created successfully");
      setCreateFolder("");
      refetchAllFolder();
      setTrigger("createFolder");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFile = async () => {
    if (
      alignment === "Your"
        ? !folderId || !selectedFile
        : !singleFolderId || !selectedFile
    )
      return toast.error("File and folder required");
    try {
      const folderIds = alignment === "Your" ? folderId : singleFolderId;
      const formData = new FormData();
      formData.append("id", folderIds),
        formData.append("file", selectedFile.files[0]);
      const uploadfile = await uploadFile(formData).unwrap();
      toast.success("File uploaded successfully");
      setTrigger("upload");
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadFile = async (data) => {
    if (!data) return toast.error("Plase select file to download");
    try {
      const id = data?.id;
      const name = data?.name;
      const downloadUrl = await downloadFile(id).unwrap();
      const url = downloadUrl.download;
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // fetching all files from api
  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const result = await getAllfiles(folderId);
        setAllFiles(result?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (folderId) {
      if (alignment === "Your") {
        fetchAllFiles();
      } else {
        const findbyId = mainAllFolders.find((f) => f.id === folderId);
        const folders = findbyId?.DriveFolders;
        setUserFolders(folders);
      }
    }
  }, [folderId, setFolderId, trigger, setTrigger]);

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
      case "csv":
      case "xlsx":
        return excel;
      case "docx":
        return word;
      case "pdf":
      case "png":
      case "jpg":
      case "jpeg":
      case "txt":
        return url;
      default:
        return unknown;
    }
  }

  const infoDetail = [
    {
      name: "Add Folder",
      screenshot: (
        <img
          src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addFolder.png?updatedAt=1717241870063"
          height={"60%"}
          width={"90%"}
        />
      ),
      instruction:
        "Add Folder for your files linked with Google Drive and Manage it",
    },

    {
      name: "Files",
      screenshot: (
        <img
          src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/files.png?updatedAt=1717241931656"
          height={"40%"}
          width={"40%"}
        />
      ),
      instruction:
        "All Your Folders Details can be seen here and you can manage it",
    },
    {
      name: "Upload Files",
      screenshot: (
        <img
          src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/uploadFiles.png?updatedAt=1717241910103"
          height={"40%"}
          width={"40%"}
        />
      ),
      instruction: "Upload files to your Google Drive in specific folder",
    },
  ];

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Google Drive`));
  }, []);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);

    if (newAlignment === "Your") {
      setMainAllFolders(specificFolders);
      setUserFolders([]);
    } else {
      // const filteredData = getAllFolder?.data.filter((item) => {
      //   return !specificFolders.some((folder) => folder.id === item.id);
      // });
      setAllFiles([]);
      const transformedData = getAllUserInDrive?.data?.map((item) => {
        return {
          DriveFolders: item.DriveFolders.map((folder) => {
            return {
              id: folder.folderId,
              name: folder.folderName,
            };
          }),
          id: item._id,
          name: item.UserName,
          UserId: item.UserId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          __v: item.__v,
        };
      });
      setMainAllFolders(transformedData);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const data = await getUsersAllFolder(adminId);
        setSpecificFolders(data?.data);
        setMainAllFolders(data?.data);
      } catch (error) {
        console.error("Error fetching user folders:", error);
      }
    };
    fetchAllData();
  }, [adminId, trigger, setTrigger]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginTop: "10px",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexBasis: "30%",
            flexDirection: "column",
            gap: "5px",
            padding: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              gap: "20px",
              width: "100%",
            }}
          >
            {isAdmin && (
              <ToggleButtonGroup
                color="warning"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{
                  width: "300px",
                  height: "30px",
                  border: "none",
                  borderRadius: "0.2rem",
                  padding: "0.2rem",
                  color: "#fff",

                  "& .Mui-selected": {
                    color: "#fff !important",
                    background: "black !important",
                  },
                }}
              >
                <ToggleButton value="Your" sx={{}}>
                  Your Folder
                </ToggleButton>
                <ToggleButton value="Users">Users Folder</ToggleButton>
              </ToggleButtonGroup>
            )}

            {alignment === "Your" && (
              <Box
                sx={{
                  fontSize: "12px",
                  width: "150px",
                  padding: "2px",
                  textAlign: "center",
                  borderRadius: "5px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "#fff",
                  },
                  border: "1px solid grey",
                }}
                onClick={() => handleOpenDial("addFolder")}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    padding: "5px",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  {" "}
                  <i className="fa-solid fa-plus"></i> <span>Add Folder</span>{" "}
                </Box>
              </Box>
            )}
          </Box>

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

            {mainAllFolders?.map((folder) => (
              <Box
                sx={{
                  cursor: "pointer",
                  borderRadius: "6px",
                  background: `${
                    folder.id === folderId ? "rgba(88, 160, 243,0.5)" : ""
                  }`,
                  border: `${
                    folder.id === folderId ? "1px solid #276AB7" : ""
                  }`,
                  width: "110px",
                  height: "85px",
                  padding: "2px",
                  "&:hover": {
                    border: "1px solid #276AB7",
                    background: "rgba(88, 160, 243,0.5)",
                  },
                }}
                key={folder.id}
                onContextMenu={(e) => handleContextMenu(e, folder.id)}
                onClick={() =>
                  handleClickFolder({ id: folder.id, name: folder.name })
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
                      {folder.name}
                    </Typography>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
        <Box
          sx={{
            display: userFolders?.length > 0 ? "flex" : "none",
            justifyContent: "center",
            alignContent: "center",
            padding: "0.5px",
          }}
        >
          {" "}
          <Typography
            sx={{ fontSize: "12px", color: "#d56391", fontWeight: "Bold" }}
          >
            Click on below folder to view files
          </Typography>{" "}
        </Box>
        {/* Users folders view */}
        <div
          style={{
            display: userFolders?.length > 0 ? "flex" : "none",
            height: "10vh",
            overflowX: "auto",
            paddingBottom: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          {userFolders?.map((folder, i) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  borderRadius: "6px",

                  background: `${folder.id === singleFolderId ? "#cccc" : ""}`,
                  border: `${
                    folder.id === folderId ? "1px solid #276AB7" : ""
                  }`,
                  width: "110px",
                  height: "85px",
                  padding: "2px",
                  "&:hover": {
                    border: "1px solid voilet",
                    background: "rgba(88, 100, 345,0.5)",
                  },
                }}
                key={folder.id}
                onContextMenu={(e) => handleContextMenuNested(e, folder.id)}
                onClick={() =>
                  handleClickFolderNested({ id: folder.id, name: folder.name })
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
                      {folder.name}
                    </Typography>
                  </div>
                </div>
              </Box>
            </Box>
          ))}
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
            {folderId && (
              <Box
                sx={{
                  fontSize: "12px",
                  width: "100px",
                  padding: "5px",
                  textAlign: "center",
                  borderRadius: "5px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "#fff",
                  },
                  border: "1px solid grey",
                }}
                onClick={() => handleOpenDial("fileUpload")}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    padding: "5px",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  {" "}
                  <i className="fa-solid fa-plus"></i> <span>Upload file</span>{" "}
                </Box>
              </Box>
            )}
            <span
              style={{
                fontFamily: "cursive",
                fontWeight: "bold",
                color: "green",
                marginLeft: `${!folderName ? "35rem" : ""}`,
              }}
            >
              {folderName
                ? `You are viewing files of ${folderName} Folder`
                : "Plz Select any folder to upload file or view it"}
            </span>
            <ToggleButtonGroup
              value={gridView}
              exclusive
              onChange={handleGrid}
              aria-label="text alignment"
            >
              <ToggleButton value="icon" aria-label="left aligned">
                <i className="fa-solid fa-grip"></i>
              </ToggleButton>
              <ToggleButton value="preview" aria-label="centered">
                <i className="fa-solid fa-table-cells-large"></i>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              maxHeight: "55vh",
              flexWrap: "wrap",
              padding: "0px 5px",
              overflowY: "auto",
            }}
          >
            {allFiles && allFiles.length > 0 ? (
              <>
                {getAllFilesLoading ? (
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
                  allFiles.map((file, index) => (
                    <>
                      {gridView === "preview" ? (
                        <Box
                          key={index}
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
                          onDoubleClick={() =>
                            handleDownloadFile({ id: file.id, name: file.name })
                          }
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
                              src={getFileExtensionUrl(
                                file.name,
                                `https://drive.google.com/thumbnail?id=${file.id}`
                              )}
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
                            {file.name}
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
                            handleDownloadFile({ id: file.id, name: file.name })
                          }
                          onContextMenu={(e) => handleContextMenuFile(e, file)}
                        >
                          <img
                            src={getFileExtension(file.name)}
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
                            {file.name}
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
                        onClick={() =>
                          handleDownloadFile({
                            id: FileName.id,
                            name: FileName.name,
                          })
                        }
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
            handleCreateFolder={handleCreateFolder}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            handleUploadFile={handleUploadFile}
            openFor={openFor}
            folderLoading={createFolderLoading}
            uploadLoading={uploadFileLoading}
          />
        )}
        {folderDeleteOpen && (
          <FolderDeleteDial
            open={folderDeleteOpen}
            setOpen={setFolderDeleteOpen}
            folderId={alignment === "Your" ? folderId : singleFolderId}
            folderName={folderName}
            refetchAllFolder={refetchAllFolder}
            setTriggeer={setTrigger}
          />
        )}
        {folderVerify && (
          <FolderVerificationDial
            open={folderVerify}
            setOpen={setFolderVerifyOtp}
            folderId={folderId}
            folderName={folderName}
            refetchAllFolder={refetchAllFolder}
            dispatch={dispatch}
            setTrigger={setTrigger}
          />
        )}

        {deleteConf && (
          <FileDelete
            open={deleteConf}
            setDeleteConf={setDeleteConf}
            file={FileName}
            setTrigger={setTrigger}
          />
        )}
      </Box>

      <InfoDialogBox
        infoDetails={infoDetail}
        // description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </>
  );
};

export default DriveFolder;
