import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  useAddCareerMutation,
  useGetCareersQuery,
} from "../../../features/api/otherSlice";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Fullscreen } from "@mui/icons-material";

const CreateCareer = () => {
  const [addData, { isLoading }] = useAddCareerMutation();
  const { data: getCareers, refetch: getNewCareersRefetch, } = useGetCareersQuery();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    responsibility: "",
    skills: "",
    education: "",
    ctc: "",
    experience: "",
    position: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.title ||
      !formData.summary ||
      !formData.responsibility ||
      !formData.skills ||
      !formData.education ||
      !formData.ctc ||
      !formData.experience ||
      !formData.position
    )
      return toast.error("Please fill out all fields");
    try {
      const result = await addData(formData).unwrap();
      setFormData({
        title: "",
        summary: "",
        responsibility: "",
        skills: "",
        education: "",
        ctc: "",
        experience: "",
        position: "",
      });
      toast.success("Form Saved Successfully");

      getNewCareersRefetch()
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div style={{ margin: "5px", display: "flex", flexDirection: "row" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={styles.formContainer}
        autoComplete="off"
      >
        <div style={styles.groupDiv}>
          <label htmlFor="title">Title</label>
          <input
            style={styles.input}
            id="title"
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.groupBoxDiv}>
          <div style={styles.groupBox}>
            <label htmlFor="skills">Skills</label>
            <input
              style={styles.input}
              id="skills"
              variant="outlined"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.groupBox}>
            <label htmlFor="ctc">CTC</label>
            <input
              style={styles.input}
              id="ctc"
              variant="outlined"
              value={formData.ctc}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={styles.groupBoxDiv}>
          <div style={styles.groupBox}>
            <label htmlFor="experience">Experience</label>
            <input
              style={styles.input}
              id="experience"
              variant="outlined"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.groupBox}>
            <label htmlFor="position">Position</label>
            <input
              style={styles.input}
              id="position"
              variant="outlined"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={styles.groupDiv}>
          <label htmlFor="education">Education</label>
          <input
            style={styles.input}
            id="education"
            variant="outlined"
            value={formData.education}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.groupDiv}>
          <label htmlFor="summary">Summary</label>
          <textarea
            style={styles.textArea}
            id="summary"
            rows={5}
            variant="outlined"
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.groupDiv}>
          <label htmlFor="responsibility">Responsibility</label>
          <textarea
            style={styles.textArea}
            id="responsibility"
            rows={5}
            variant="outlined"
            value={formData.responsibility}
            onChange={handleChange}
            required
          />
        </div>
        <Box sx={{ marginTop: "10px", alignSelf: "flex-end" }}>
          <Button disabled={isLoading} type="submit" variant="contained">
            {isLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Box>
      <Box sx={styles.formContainer}>
        <Box
          sx={{
            border: "1px solid gray",
            borderRadius: "10px",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "start",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderRadius: "9px 9px 0px 0px",
              background: "#36626A",
              width: "100%",
              textAlign: "center",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            Careers
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              width: "100%",
              margin: "1rem",
            }}
          >
            {getCareers?.data.map((item, index) => (
              <Box sx={{ display: "flex" }} key={index}>
                {/* <Typography
                  sx={{
                    fontSize: "1.2rem",
                    marginRight: "1rem",
                  }}
                >
                  {index + 1}
                </Typography> */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "1rem",
                    marginBottom: "1rem",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: "1.2rem", color: "#1b263b" }}>
                    {item.Title}
                  </Typography>

                  <Typography sx={{ fontSize: "1.4rem", marginRight: "1rem" }}>
                    <i
                      className="fa-solid fa-trash"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                      // onClick={() => handleClickOpen(item, "Delete")}
                    ></i>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreateCareer;

const styles = {
  input: {
    padding: "7px",
    borderRadius: "6px",
    fontSize: "16px",
    background: "#fbfbfb",
    border: "2px solid transparent",
    height: "36px",
    boxShadow:
      "0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)",
    "& input:focus": {
      border: "2px solid #000",
      borderRadius: "4px",
    },
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "50%",
    gap: "15px",
    margin: "10px",
    padding: "20px",
    backgroundColor: "#FFECEC",
    border: "2px solid #dddddd",
    borderRadius: "8px",
    "& input:focus": {
      border: "2px solid #000",
      borderRadius: "4px",
    },
  },
  textArea: {
    padding: "7px",
    borderRadius: "6px",
    fontSize: "16px",
    background: "#fbfbfb",
    border: "2px solid transparent",
    boxShadow:
      "0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)",
    "& input:focus": {
      border: "2px solid #000",
      borderRadius: "4px",
    },
  },
  groupDiv: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "4px",
  },

  groupBoxDiv: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: "100%",
  },

  groupBox: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    gap: "4px",
  },
};
