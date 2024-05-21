import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import folderIcon from "../../../assets/DrivePNG/folder.png";

import {
  useGetApplicantsMutation,
  useGetCareersQuery,
} from "../../../features/api/otherSlice";
import { DataGrid } from "@mui/x-data-grid";


const CreateCareer = () => {
  // local state
  const [careerId, setCareerId] = useState();
  const [rows, setRows] = useState([]);

  // rtk query api calling
  const { data: getCareers, loading: getAllCareersLoading } =
    useGetCareersQuery();

  const [getAllApplicants] = useGetApplicantsMutation();

  const handleClickFolder = async (data) => {
    setCareerId(data.id);
  };

  useEffect(() => {
    if (careerId) {
      const fetchApi = async () => {
        try {
          let result = await getAllApplicants(careerId).unwrap();
          const data = result?.data.map((item, index) => {
            return {
              id: index + 1,
              JobId: item.JobId,
              Name: item.Name,
              Email: item.Email,
              Phone: item.Phone,
              Experience: item.Experience,
              Skill: item.Skill,
              Location: item.Location,
              resume: item.resume.url,
            };
          });
          console.log("Hello", data);

          setRows(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchApi();
    }
  }, [careerId]);

  const handleDownloadFile = async (data) => {
    try {
      const url = data.value;
      const urlArray = url.split("/");
      const fileName = urlArray.pop();
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 20,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.2,
      width: 180,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "Email",
      flex: 0.2,
      width: 180,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Phone",
      headerName: "Phone",
      flex: 0.2,
      width: 180,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Experience",
      headerName: "Experience",
      flex: 0.2,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "Skill",
      headerName: "Skill",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Location",
      headerName: "Location",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "resume",
      headerName: "Resume",
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (resume) => (
        <Button
          onClick={() => {
            handleDownloadFile(resume);
          }}
        >
          View
        </Button>
      ),
    },
  ];


  return (
    <Box
      sx={{
        height: "60vh",
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
        >
          {getCareers?.data?.map((career) => (
            <Box
              sx={{
                cursor: "pointer",
                borderRadius: "6px",
                background: `${
                  career.JobId === careerId ? "rgba(88, 160, 243,0.5)" : "#eff6ff"
                }`,
                border: `${career.JobId === careerId ? "1px solid #276AB7" : ""}`,
                width: "135px",
                height: "100px",
                padding: "2px",
                "&:hover": {
                  border: "1px solid #276AB7",
                  background: "rgba(88, 160, 243,0.5)",
                },
              }}
              key={career.JobId}
              onClick={() =>
                handleClickFolder({ id: career.JobId, name: career.Title })
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
                      textWrap: "wrap",
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
          
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            padding: "0px 5px",
          }}
        >
          <DataGrid
            columns={columns}
            rows={rows}
            rowHeight={40}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </Box>
  );
};

export default CreateCareer;
