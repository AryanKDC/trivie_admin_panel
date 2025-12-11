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
import { FastField, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPortfolio, getPortfolioById, updatePortfolio, resetState, fetchCategories } from "../../store/slices/portfolioSlice";
import { useEffect } from "react";

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

const PortfolioEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPortfolio } = useSelector((state) => state.portfolio);
  const isEditMode = Boolean(id);

  // Get categories from Redux store
  const categories = useSelector((state) => state.portfolio.tags || []);

  const navigate = useNavigate();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getPortfolioById(id));
    } else {
      dispatch(resetState());
    }
  }, [id, isEditMode, dispatch]);


  // Populate form when data fetches
  const [initialValues, setInitialValues] = useState({
    projectTitle: "",
    category: "",
    thumbnail_image: null,
    images_gallery: [],
    challenge: "",
    solution: "",
    result: "",
  });

  useEffect(() => {
    if (isEditMode && currentPortfolio) {
      console.log('🔍 Loading portfolio data:', currentPortfolio);

      const newInitialValues = {
        projectTitle: currentPortfolio.title || "",
        category: Array.isArray(currentPortfolio.category)
          ? currentPortfolio.category[0] || ""
          : currentPortfolio.category || "",
        thumbnail_image: currentPortfolio.thumbnail_image || null,
        images_gallery: currentPortfolio.image_gallery || [],
        challenge: currentPortfolio.the_challenge || "",
        solution: currentPortfolio.our_solution || "",
        result: currentPortfolio.the_result || "",
      };

      console.log('📝 Setting initial values:', newInitialValues);
      setInitialValues(newInitialValues);

      // Set Previews
      const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || import.meta.env.REACT_APP_BACKEND_BASE_URL || '';
      if (currentPortfolio.thumbnail_image) {
        const thumbnailURL = currentPortfolio.thumbnail_image.startsWith('http')
          ? currentPortfolio.thumbnail_image
          : `${baseURL}${currentPortfolio.thumbnail_image}`;
        console.log('🖼️ Thumbnail URL:', thumbnailURL);
        setThumbnailPreview(thumbnailURL);
      }
      if (currentPortfolio.image_gallery && currentPortfolio.image_gallery.length > 0) {
        const galleryURLs = currentPortfolio.image_gallery.map(img =>
          img.startsWith('http') ? img : `${baseURL}${img}`
        );
        console.log('🖼️ Gallery URLs:', galleryURLs);
        setGalleryPreviews(galleryURLs);
      }
    }
  }, [currentPortfolio, isEditMode]);

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
    dashedColor = "#ccc",
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
            {isEditMode ? "Edit Portfolio" : "Add Portfolio"}
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
          onClick={() => navigate("/")}
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
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="body1" fontWeight={500} color="text.secondary" mb={3}>
            {isEditMode ? "Edit Existing Portfolio" : "Add New Portfolio Project"}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={true}
            enableReinitialize={true}
            onSubmit={async (values) => {

              const formData = new FormData();
              formData.append("title", values.projectTitle);
              formData.append("category", values.category);
              formData.append("the_challenge", values.challenge);
              formData.append("our_solution", values.solution);
              formData.append("the_result", values.result);

              if (values.thumbnail_image && values.thumbnail_image instanceof File) {
                formData.append("thumbnail_image", values.thumbnail_image);
              }

              const existingImages = [];
              const newImages = [];

              values.images_gallery.forEach(item => {
                if (item instanceof File) {
                  newImages.push(item);
                } else if (typeof item === 'string') {
                  existingImages.push(item);
                }
              });

              newImages.forEach(file => {
                formData.append("images_gallery", file);
              });
              if (existingImages.length > 0) {
                formData.append("existing_images", JSON.stringify(existingImages));
              } else {
                formData.append("existing_images", JSON.stringify([]));
              }

              let res;
              if (isEditMode) {
                res = await dispatch(updatePortfolio({ id, formData }));
              } else {
                res = await dispatch(addPortfolio(formData));
              }

              if (res?.payload?.status === true) {
                navigate("/");
              } else {
                console.log("Error saving portfolio:", res);
              }
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
                  <FastField name="projectTitle">
                    {({ field, meta }) => (
                      <Box>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          Project Title <span style={{ color: "#DC0000" }}>*</span>
                        </Typography>

                        <TextField
                          fullWidth
                          placeholder="Enter project title"
                          {...field}
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                          }}
                        />
                      </Box>
                    )}
                  </FastField>

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
                      subLabel="Click to upload thumbnail"
                      icon={<CloudUploadIcon sx={{ fontSize: 32, mb: 1, color: "#9ca3af" }} />}
                      error={errors.thumbnail_image}
                      touched={touched.thumbnail_image}
                      onChange={(e) => handleThumbnailChange(e, setFieldValue)}
                      dashedColor="#90caf9"
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
                        border: `1.5px dashed ${touched.images_gallery && errors.images_gallery ? "#d32f2f" : "#90caf9"}`, // Red dashed border
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                        color: "#6b7280",
                        "&:hover": { bgcolor: "#f5f5f5" },
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
                      <Typography variant="body2" color="textSecondary">Click to upload images</Typography>
                      <Typography variant="caption" color="textSecondary">You can select multiple images at once</Typography>
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

                  {/* Challenge */}
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      The Challenge <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Describe the challenge faced in this project..."
                      name="challenge"
                      value={values.challenge}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.challenge && Boolean(errors.challenge)}
                      helperText={touched.challenge && errors.challenge}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      }}
                    />
                  </Box>

                  {/* Solution */}
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      Our Solution <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Describe your solution to the challenge..."
                      name="solution"
                      value={values.solution}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.solution && Boolean(errors.solution)}
                      helperText={touched.solution && errors.solution}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      }}
                    />
                  </Box>

                  {/* Result */}
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      The Result <span style={{ color: "#DC0000" }}>*</span>
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Describe the outcome and results achieved..."
                      name="result"
                      value={values.result}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.result && Boolean(errors.result)}
                      helperText={touched.result && errors.result}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      }}
                    />
                  </Box>

                  {/* Actions */}
                  <Box mt={2}>
                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        onClick={() => console.log("Data added:", values)}
                        sx={{
                          flex: 1,
                          bgcolor: "#DC0000",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#b30000", boxShadow: "none" },
                        }}
                      >
                        {isEditMode ? "Update Portfolio" : "Add Portfolio"}
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

export default PortfolioEdit;
