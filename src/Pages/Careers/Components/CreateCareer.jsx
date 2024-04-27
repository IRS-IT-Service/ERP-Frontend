import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAddCareerMutation } from "../../../features/api/otherSlice";
import { toast } from "react-toastify";

const CreateCareer = () => {
  const [addData, { isLoading }] = useAddCareerMutation();
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
    } catch (error) {
      console.log(error.message);
    }
  };

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

    groupBox: {
      display: "flex",
      flexDirection: "column",
      width: "50%",
      gap: "4px",
    },
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div style={{ margin: "5px", width: "50%" }}>
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
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}
        >
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
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}
        >
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
          <div
            style={styles.groupBox}
          >
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
    </div>
  );
};

export default CreateCareer;
