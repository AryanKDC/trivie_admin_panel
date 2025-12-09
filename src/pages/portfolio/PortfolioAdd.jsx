import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  projectTitle: Yup.string().required().min(3),
  category: Yup.string().required(),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
  gallery: Yup.array().min(1, "At least 1 gallery image is required"),
  challenge: Yup.string().required().min(10),
  solution: Yup.string().required().min(10),
  result: Yup.string().required().min(10),
});

const PortfolioAdd = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const initialValues = {
    projectTitle: "",
    category: "",
    thumbnail: null,
    gallery: [],
    challenge: "",
    solution: "",
    result: "",
  };

  const handleThumbnailChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    setFieldValue("thumbnail", file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e, setFieldValue, gallery) => {
    const files = Array.from(e.target.files);
    setFieldValue("gallery", [...gallery, ...files]);

    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeGalleryImage = (index, setFieldValue, gallery) => {
    setFieldValue(
      "gallery",
      gallery.filter((_, i) => i !== index)
    );
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 4 }}>
      <Card sx={{ maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Add New Portfolio Project
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm();
              setThumbnailPreview(null);
              setGalleryPreviews([]);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Title"
                      name="projectTitle"
                      value={values.projectTitle}
                      onChange={handleChange}
                      error={touched.projectTitle && !!errors.projectTitle}
                      helperText={touched.projectTitle && errors.projectTitle}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      error={touched.category && !!errors.category}
                      helperText={touched.category && errors.category}
                    >
                      <MenuItem value="">Select category</MenuItem>
                      <MenuItem value="web-design">Web Design</MenuItem>
                      <MenuItem value="mobile-app">Mobile App</MenuItem>
                      <MenuItem value="branding">Branding</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Thumbnail Upload */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Thumbnail
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleThumbnailChange(e, setFieldValue)
                        }
                      />
                    </Button>
                    {thumbnailPreview && (
                      <Box mt={2}>
                        <img src={thumbnailPreview} alt="thumb" height={120} />
                      </Box>
                    )}
                    <Typography color="error" variant="caption">
                      {touched.thumbnail && errors.thumbnail}
                    </Typography>
                  </Grid>

                  {/* Gallery Upload */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Gallery Images
                      <input
                        hidden
                        multiple
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleGalleryChange(e, setFieldValue, values.gallery)
                        }
                      />
                    </Button>

                    <Grid container spacing={1} mt={2}>
                      {galleryPreviews.map((img, index) => (
                        <Grid item key={index}>
                          <Box sx={{ position: "relative" }}>
                            <img src={img} alt="" width={100} height={100} />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                bgcolor: "white",
                              }}
                              onClick={() =>
                                removeGalleryImage(
                                  index,
                                  setFieldValue,
                                  values.gallery
                                )
                              }
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography color="error" variant="caption">
                      {touched.gallery && errors.gallery}
                    </Typography>
                  </Grid>

                  {["challenge", "solution", "result"].map((field) => (
                    <Grid item xs={12} key={field}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={values[field]}
                        onChange={handleChange}
                        error={touched[field] && !!errors[field]}
                        helperText={touched[field] && errors[field]}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="error"
                      size="large"
                    >
                      Add Portfolio
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PortfolioAdd;
