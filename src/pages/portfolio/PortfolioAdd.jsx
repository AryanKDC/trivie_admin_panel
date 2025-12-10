import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
  FormHelperText,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addPortfolio } from "../../store/slices/portfolioSlice";

// Validation Schema
const validationSchema = Yup.object({
  projectTitle: Yup.string().required("Project Title is required"),
  category: Yup.string().required("Category is required"),
  thumbnail_image: Yup.mixed().required("Thumbnail is required"),
  images_gallery: Yup.array().min(1, "At least 1 gallery image is required"),
  challenge: Yup.string().required("Challenge description is required"),
  solution: Yup.string().required("Solution description is required"),
  result: Yup.string().required("Result description is required"),
});

const categories = [
  "Residential",
  "Hospitality",
  "Office",
  "Restaurant",
  "Retail",
];

const PortfolioAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const initialValues = {
    projectTitle: "",
    category: "",
    thumbnail_image: null,
    images_gallery: [],
    challenge: "",
    solution: "",
    result: "",
  };

  const handleThumbnailChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("thumbnail_image", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e, setFieldValue, currentGallery) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFieldValue("images_gallery", [...currentGallery, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index, setFieldValue, currentGallery) => {
    const newGallery = currentGallery.filter((_, i) => i !== index);
    setFieldValue("images_gallery", newGallery);
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Custom Upload Box Component
  const UploadBox = ({
    label,
    subLabel,
    icon,
    error,
    touched,
    onChange,
    multiple = false,
    dashedColor = "#ccc", // default gray dashed
  }) => (
    <Box>
      <Typography
        variant="body2"
        color={error && touched ? "error" : "text.secondary"}
        fontWeight={500}
        mb={1}
      >
        {label} <span style={{ color: "#DC0000" }}>*</span>
      </Typography>
      {subLabel && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {subLabel}
        </Typography>
      )}

      <Button
        component="label"
        fullWidth
        sx={{
          height: 120,
          border: `1.5px dashed ${error && touched ? "#d32f2f" : dashedColor}`,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "none",
          color: "#6b7280",
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f9fafb",
            borderColor: error && touched ? "#d32f2f" : "#9ca3af",
          },
        }}
      >
        <input
          type="file"
          hidden
          accept="image/*"
          multiple={multiple}
          onChange={onChange}
        />
        {icon || <CloudUploadIcon sx={{ fontSize: 32, mb: 1, color: "#9ca3af" }} />}
        <Typography variant="body2">{subLabel || "Click to upload"}</Typography>
        {multiple && <Typography variant="caption" sx={{ mt: 0.5 }}>You can select multiple images_gallery at once</Typography>}
      </Button>
      {touched && error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#111827" }}>
            Portfolio Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            6 projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="error"
          sx={{
            textTransform: "none",
            bgcolor: "#DC0000",
            py: 1.5,
            minWidth: 150,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#b30000", boxShadow: "none" },
          }}
          onClick={() => navigate("/")} // Assuming cancel goes back
        >
          Cancel
        </Button>
      </Stack>

      {/* Main Form Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          border: "1px solid #E5E7EB",
          overflow: "visible", // for close icons hanging out if needed
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="body1" fontWeight={500} color="text.secondary" mb={3}>
            Add New Portfolio Project
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              const formData = new FormData();
              formData.append("projectTitle", values.projectTitle);
              formData.append("category", values.category);
              formData.append("challenge", values.challenge);
              formData.append("solution", values.solution);
              formData.append("result", values.result);

              if (values.thumbnail_image) {
                formData.append("thumbnail_image", values.thumbnail_image);
              }

              values.images_gallery.forEach(file => formData.append("images_gallery", file));

              await dispatch(addPortfolio(formData));
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
              handleBlur
            }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {/* Project Title */}
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      Project Title <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter project title"
                      name="projectTitle"
                      value={values.projectTitle}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.projectTitle && Boolean(errors.projectTitle)}
                      helperText={touched.projectTitle && errors.projectTitle}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      }}
                    />
                  </Box>

                  {/* Category */}
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      Category <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.category && Boolean(errors.category)}
                      helperText={touched.category && errors.category}
                      displayEmpty
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a category
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Thumbnail Image */}
                  <Box>
                    <UploadBox
                      label="Thumbnail Image"
                      subLabel="Click to upload thumbnail_image"
                      icon={<CloudUploadIcon sx={{ fontSize: 32, mb: 1, color: "#9ca3af" }} />}
                      error={errors.thumbnail_image}
                      touched={touched.thumbnail_image}
                      onChange={(e) => handleThumbnailChange(e, setFieldValue)}
                      dashedColor="#90caf9" // slight blue tint as per some designs, or stick to gray
                    />
                    {thumbnailPreview && (
                      <Box mt={2} position="relative" width="fit-content">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          style={{
                            height: 120,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #eee",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFieldValue("thumbnail_image", null);
                            setThumbnailPreview(null);
                          }}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: "white",
                            border: "1px solid #eee",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {/* Gallery Images */}
                  <Box>
                    {/* Red dashed color for images_gallery as seen in some designs for 'required' or just style */}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      mb={1}
                    >
                      Upload Gallery <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Upload multiple images for the project images (minimum 1 required)
                    </Typography>
                    <Button
                      component="label"
                      fullWidth
                      sx={{
                        height: 120,
                        border: `1.5px dashed ${touched.images_gallery && errors.images_gallery ? "#d32f2f" : "#ff4d4d"}`, // Red dashed border
                        bgcolor: '#fff5f5', // light red background tint?
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                        color: "#6b7280",
                        "&:hover": {
                          backgroundColor: "#ffecec",
                        },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryChange(e, setFieldValue, values.images_gallery)}
                      />
                      <CloudUploadIcon sx={{ fontSize: 32, mb: 1, color: "#9ca3af" }} />
                      <Typography variant="body2" color="textSecondary">Click to upload images_gallery images_gallery</Typography>
                      <Typography variant="caption" color="textSecondary">You can select multiple images_gallery at once</Typography>
                    </Button>
                    {touched.images_gallery && errors.images_gallery && (
                      <FormHelperText error>{errors.images_gallery}</FormHelperText>
                    )}

                    {/* Gallery Previews */}
                    {galleryPreviews.length > 0 && (
                      <Grid container spacing={2} mt={2}>
                        {galleryPreviews.map((src, index) => (
                          <Grid item key={index}>
                            <Box position="relative">
                              <img
                                src={src}
                                alt={`Gallery ${index}`}
                                style={{
                                  width: 100,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  border: "1px solid #eee",
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeGalleryImage(index, setFieldValue, values.images_gallery)
                                }
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  bgcolor: "white",
                                  border: "1px solid #eee",
                                  "&:hover": { bgcolor: "#f5f5f5" },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>

                  {/* Text Areas: Challenge, Solution, Result */}
                  {["challenge", "solution", "result"].map((field) => (
                    <Box key={field}>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        {field === "challenge" ? "The Challenge" : field === "solution" ? "Our Solution" : "The Result"} <span style={{ color: "#DC0000" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={
                          field === "challenge" ? "Describe the challenge faced in this project..."
                            : field === "solution" ? "Describe your solution to the challenge..."
                              : "Describe the outcome and results achieved..."
                        }
                        name={field}
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched[field] && Boolean(errors[field])}
                        helperText={touched[field] && errors[field]}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                        }}
                      />
                    </Box>
                  ))}

                  {/* Actions */}
                  <Box mt={2}>
                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        onClick={() => console.log("Data added:", values)}
                        sx={{
                          flex: 1, // "Add Portfolio" takes more space? Or standard width. Image shows full red bar
                          bgcolor: "#DC0000",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#b30000", boxShadow: "none" },
                        }}
                      >
                        Add Portfolio
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: "#E5E7EB",
                          color: "#374151",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          minWidth: 100,
                          "&:hover": { borderColor: "#D1D5DB", bgcolor: "#f9fafb" },
                        }}
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PortfolioAdd;
