import { Box, Button, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useCreateFolderMutation,
  useDeleteFileMutation,
  useDownloadFileMutation,
  useGetAllFilesOfSingleFolderMutation,
  useGetAllFolderQuery,
  useUploadFileMutation,
} from "../../../features/api/driveApiSlice";
import DriveDial from "./driveDial";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FolderDeleteDial from "./FolderDeleteDial";

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
    deleteFile,
    { isLoading: deleteFileLoading, refetch: deleteFileRefetch },
  ] = useDeleteFileMutation();

  // functions for hanlding things

  const handleClickFolder = (data) => {
    setFolderId(data.id);
    setFolderName(data.name);
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
      const info = { folderName: createFolderName };
      const createFolder = await creatingFolder(info).unwrap();
      toast.success("Folder created successfully");
      setCreateFolder("");
      refetchAllFolder();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFile = async () => {
    if (!folderId || !selectedFile)
      return toast.error("File and folder required");
    try {
      const formData = new FormData();
      formData.append("id", folderId), formData.append("file", selectedFile);
      const uploadfile = await uploadFile(formData).unwrap();
      toast.success("File uploaded successfully");
      setTrigger("upload");
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSingleFile = async (id) => {
    if (!id) return toast.error("please select a file to delete");
    try {
      const deleted = await deleteFile(id).unwrap();
      setTrigger("delete");
      toast.success("File deleted successfully");
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
      fetchAllFiles();
    }
  }, [folderId, setFolderId, trigger, setTrigger]);

  return (
    <Box
      sx={{
        height: "87vh",
        width: "100%",
        border: "1px solid grey",
        marginTop: "10px",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <div
        style={{
          height: "8%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "25px",
          // border:"0.5px solid grey",
          padding: "10px",
        }}
      >
        <div>
          <Button onClick={() => handleOpenDial("addFolder")}>
            Add Folder
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            width: "90%",
            overflowX: "auto",
          }}
        >
          {getAllFolder?.data?.map((folder) => (
            <div
              style={{
                cursor: "pointer",
                borderRadius: "6px",
                background: `${folder.id === folderId ? "green" : ""}`,
              }}
              key={folder.id}
              onClick={() =>
                handleClickFolder({ id: folder.id, name: folder.name })
              }
            >
              <Button variant="outlined"> {folder.name}</Button>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          height: "92%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontFamily: "cursive",
            fontWeight: "bold",
            borderTop: "1px solid gray",
            color: "green",
          }}
        >
          {folderName
            ? `You are viewing image of ${folderName} Folder`
            : "Plz Select any folder to upload file or view it"}
        </span>
        {folderId && (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              onClick={() => handleOpenDial("fileUpload")}
              variant="outlined"
            >
              Upload File
            </Button>
            <Button
              onClick={() => setFolderDeleteOpen(true)}
              variant="outlined"
              // disabled={deleteFolderLoading}
            >
              Delete Selected Folder
            </Button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {allFiles && allFiles.length > 0 ? (
            <>
              {getAllFilesLoading ? (
                <CircularProgress />
              ) : (
                allFiles.map((file) => (
                  <div
                    key={file?.id}
                    style={{
                      height: "150px",
                      width: "150px",
                      objectFit: "cover",
                      marginTop: "20px",
                      border: "0.5px solid gray",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onMouseEnter={() => setHovered(file.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <img
                      src={`https://drive.google.com/thumbnail?id=${file.id}`}
                      alt="Image from Google Drive"
                      style={{ height: "100%", width: "100%" }}
                    ></img>
                    {hovered === file.id && (
                      <div
                        style={{
                          position: "absolute",
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            marginRight: "25px",
                            color: `${deleteFileLoading ? "grey" : "red"}`,
                            cursor: "pointer",
                          }}
                          disabled={deleteFileLoading}
                          onClick={() => handleDeleteSingleFile(file.id)}
                        />
                        <DownloadIcon
                          sx={{ color: "green", cursor: "pointer" }}
                          disabled={downloadFileLoading}
                          onClick={() =>
                            handleDownloadFile({ id: file.id, name: file.name })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          ) : (
            <div style={{ display: "flex" }}>
              <span>No Image Found</span>
            </div>
          )}
        </div>
        ;
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
          folderId={folderId}
          refetchAllFolder={refetchAllFolder}
        />
      )}
    </Box>
  );
};

export default DriveFolder;
