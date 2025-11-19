import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Container,
  Alert,
  Chip,
  Fade,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save,
  Cancel,
  CheckCircle,
} from "@mui/icons-material";

import ApiBasedAutoComplete from "../../components/core-components/apiBasedAutoComplete";
import {
  useSaveMarksheet,
  type SubjectData,
  type MarksheetFormData,
} from "../../hooks/useSaveMarksheet";
import { useCourses } from "../../hooks/useCourses";
import { useCourseSubjects } from "../../hooks/useCourseSubjects";
import { useGetMarksheetBySemester } from "../../hooks/useGetMarksheetBySemester";

import {
  calculateTotal,
  validateSubject,
  validateMaxSubjects,
  validateFormForSave,
  type ValidationErrors,
} from "../../utils/marksheetValidation";

/* ------------------------------------------------------------------
                            COMPONENT START
------------------------------------------------------------------ */

const AddMarksheetPageAdmin = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [existingMarksheetId, setExistingMarksheetId] = useState<string | null>(null);

  const [currentSubject, setCurrentSubject] = useState({
    subjectName: "",
    marks: "",
    internal: "",
    total: "",
    minMarks: "",
    maxMarks: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [, setTableErrors] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses from API
  const { courses, isLoading: isLoadingCourses } = useCourses();

  // Normalize selectedCourse to always be a string (extract _id if it's an object)
  const normalizedCourseId = selectedCourse 
    ? (typeof selectedCourse === 'string' 
        ? selectedCourse 
        : (selectedCourse as any)?._id || String(selectedCourse))
    : "";

  // Fetch subjects based on selected course and semester
  const { subjects: courseSubjects, isLoading: isLoadingSubjects } = useCourseSubjects(
    normalizedCourseId,
    semester
  );

  // Fetch existing marksheet for selected student and semester
  const studentId = selectedStudent?.studentId || selectedStudent?.id || "";
  const { data: existingMarksheet, isLoading: isLoadingMarksheet } = useGetMarksheetBySemester(
    studentId,
    semester,
    !!studentId && !!semester
  );

  /* ---------------------------------------------------------------
                     COURSE CHANGE → LOAD SUBJECTS
  --------------------------------------------------------------- */
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    // Reset subject when course changes
    setCurrentSubject((prev) => ({ ...prev, subjectName: "" }));
  };

  /* ---------------------------------------------------------------
                     SEMESTER CHANGE → RELOAD SUBJECTS
  --------------------------------------------------------------- */
  const handleSemesterChange = (newSemester: string) => {
    // Clear course and subjects when semester changes
    if (subjects.length === 0) {
      setSelectedCourse("");
      setCurrentSubject({
        subjectName: "",
        marks: "",
        internal: "",
        total: "",
        minMarks: "",
        maxMarks: "",
      });
    }
    setSemester(newSemester);
    setExistingMarksheetId(null);
    setSubjects([]);
    
    // Reset subject selection when semester changes
    setCurrentSubject((prev) => ({ ...prev, subjectName: "" }));
    
    if (errors.semester) {
      const newErrors = { ...errors };
      delete newErrors.semester;
      setErrors(newErrors);
    }
  };

  // Load existing marksheet data when it's fetched
  useEffect(() => {
    // Only process if we have a valid marksheet response and not loading
    if (!isLoadingMarksheet && existingMarksheet && existingMarksheet._id) {
      setExistingMarksheetId(existingMarksheet._id);
      
      // Pre-select course if it exists in marksheet
      if (existingMarksheet.courseId) {
        // Extract courseId if it's an object (handle populated courseId)
        const courseIdValue = typeof existingMarksheet.courseId === 'string' 
          ? existingMarksheet.courseId 
          : (existingMarksheet.courseId as any)?._id || existingMarksheet.courseId;
        setSelectedCourse(courseIdValue);
      }
      
      // Convert existing subjects to the format expected by the form
      if (existingMarksheet.subjects && existingMarksheet.subjects.length > 0) {
        const formattedSubjects: SubjectData[] = existingMarksheet.subjects.map((sub: any, index: number) => ({
          id: sub.id || `existing-${Date.now()}-${index}`,
          subjectName: sub.subjectName,
          marks: sub.marks,
          internal: sub.internal,
          total: sub.total,
          minMarks: sub.minMarks,
          maxMarks: sub.maxMarks,
        }));
        setSubjects(formattedSubjects);
      } else {
        // Marksheet exists but has no subjects yet
        setSubjects([]);
      }
    } else if (!isLoadingMarksheet && (!existingMarksheet || existingMarksheet === null) && studentId && semester) {
      // No existing marksheet found, ensure we're in create mode
      // Only reset if we don't have any subjects added yet (to avoid clearing user input)
      if (subjects.length === 0) {
        setExistingMarksheetId(null);
        setSelectedCourse(""); // Reset course when no marksheet found
      }
    }
  }, [existingMarksheet, isLoadingMarksheet, studentId, semester]);

  /* ---------------------------------------------------------------
                         HANDLE SUBJECT INPUT
  --------------------------------------------------------------- */
  const handleInputChange = (field: string, value: string) => {
    setErrors({});

    let updated = { ...currentSubject, [field]: value };

    if (field === "marks" || field === "internal") {
      updated.total = calculateTotal(
        field === "marks" ? value : updated.marks,
        field === "internal" ? value : updated.internal
      );
    }

    setCurrentSubject(updated);
  };

  /* ---------------------------------------------------------------
                         ADD SUBJECT
  --------------------------------------------------------------- */
  const handleAddSubject = () => {
    const validationErrors = validateSubject(currentSubject, subjects, "admin");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const maxErrors = validateMaxSubjects(subjects.length);
    if (Object.keys(maxErrors).length > 0) {
      setErrors(maxErrors);
      return;
    }

    const newSubject: SubjectData = {
      id: Date.now().toString(),
      subjectName: currentSubject.subjectName,
      marks: Number(currentSubject.marks),
      internal: Number(currentSubject.internal),
      total: Number(currentSubject.total),
      minMarks: Number(currentSubject.minMarks),
      maxMarks: Number(currentSubject.maxMarks),
    };

    setSubjects([...subjects, newSubject]);

    setCurrentSubject({
      subjectName: "",
      marks: "",
      internal: "",
      total: "",
      minMarks: "",
      maxMarks: "",
    });
    setErrors({});
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setTableErrors({});
  };

  const saveMarksheetMutation = useSaveMarksheet();

  /* ---------------------------------------------------------------
                         SAVE MARKSHEET
  --------------------------------------------------------------- */
  const handleSave = () => {
    // Validate semester is selected
    if (!semester) {
      setErrors({ ...errors, semester: "Please select a semester" });
      return;
    }

    const validationErrors = validateFormForSave(selectedStudent, subjects);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Validate course is selected
    if (!normalizedCourseId) {
      setErrors({ ...errors, course: "Please select a course" });
      return;
    }

    const data: MarksheetFormData = {
      studentId: selectedStudent.studentId || selectedStudent.id,
      subjects,
      semester: semester.toString(),
      courseId: normalizedCourseId, // Include courseId in marksheet (always a string)
      role: "admin",
      marksheetId: existingMarksheetId || undefined, // Include marksheetId if updating
    } as any;

    saveMarksheetMutation.mutate(data, {
      onSuccess: () => {
        const message = existingMarksheetId 
          ? "Marksheet updated successfully!" 
          : "Marksheet saved successfully!";
        alert(message);
        
        // Don't reset form if updating - allow adding more subjects
        if (!existingMarksheetId) {
          setSelectedStudent(null);
          setSubjects([]);
          setSelectedCourse("");
          setSemester("");
          setExistingMarksheetId(null);

          setCurrentSubject({
            subjectName: "",
            marks: "",
            internal: "",
            total: "",
            minMarks: "",
            maxMarks: "",
          });
        }

        setErrors({});
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        alert(error.response?.data?.message || "Failed to save marksheet");
        setIsSubmitting(false);
      },
    });
  };

  /* ---------------------------------------------------------------
                    CANCEL MARKSHEET ENTRY
  --------------------------------------------------------------- */
  const handleCancel = () => {
    setSelectedStudent(null);
    setSubjects([]);
    setSelectedCourse("");
    setSemester("");
    setExistingMarksheetId(null);
    setErrors({});
    setTableErrors({});
  };

  const totalMarks = subjects.reduce((sum, s) => sum + s.total, 0);
  const averageMarks = subjects.length ? totalMarks / subjects.length : 0;

  /* ------------------------------------------------------------------
                           JSX RETURN
  ------------------------------------------------------------------ */

  return (
    <Container maxWidth="lg" sx={{ py: 3, backgroundColor: "#f8fafc" }}>
      {/* ===================== HEADER ===================== */}
      <Fade in timeout={600}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Add Marksheet
            </Typography>
            <Typography>Admin Panel — Manage Student Marksheets</Typography>
          </CardContent>
        </Card>
      </Fade>

      {/* ===================== STUDENT SELECTION ===================== */}
      <Slide direction="up" in timeout={800}>
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Student Selection
            </Typography>

            <ApiBasedAutoComplete
              label="Select Student *"
              apiPath="/api/student/getStudentAutoCompleteList"
              searchKey="query"
              keyToPick="studentName"
              idKey="studentId"
              onSelect={(opt) => {
                setSelectedStudent(opt);
                setSubjects([]);
                setSemester("");
                setExistingMarksheetId(null);
                setErrors({});
              }}
              selectedOptions={selectedStudent}
              error={!!errors.studentId}
              helperText={errors.studentId}
              required
              customActionMethod="POST"
            />
          </CardContent>
        </Card>
      </Slide>

      {/* ===================== SEMESTER SELECTION ===================== */}
      {selectedStudent && (
        <Slide direction="up" in timeout={900}>
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Semester Selection
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Semester *</InputLabel>
                    <Select
                      value={semester}
                      label="Semester *"
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      error={!!errors.semester}
                      disabled={subjects.length > 0}
                    >
                      {[1, 2].map((s) => (
                        <MenuItem key={s} value={s}>
                          Semester {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.semester && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.semester}
                    </Typography>
                  )}
                  {subjects.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.75 }}>
                      Semester cannot be changed once subjects are added
                    </Typography>
                  )}
                </Grid>
              </Grid>
              
              {/* Show existing marksheet info */}
              {isLoadingMarksheet && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Checking for existing marksheet...
                  </Typography>
                </Box>
              )}
              {!isLoadingMarksheet && existingMarksheet && existingMarksheet._id && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Existing marksheet found for Semester {semester}
                  </Typography>
                  <Typography variant="caption">
                    Found {existingMarksheet.subjects?.length || 0} subject(s). You can add more subjects or modify existing ones. Clicking "Save Marksheet" will update the existing marksheet.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* ===================== ADD SUBJECT FORM ===================== */}
      {/* ===================== ADD SUBJECT (MATCH PAGE STYLES) ===================== */}
      {selectedStudent && semester && (
        <Slide direction="up" in timeout={900}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {/* header - matches other cards */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", display: "flex", gap: 1, alignItems: "center" }}
                >
                  <AddIcon sx={{ color: "#10b981" }} /> Add Subject
                </Typography>

                <Chip
                  label={`${subjects.length}/7`}
                  size="small"
                  color={subjects.length >= 7 ? "error" : "primary"}
                  sx={{ ml: "auto" }}
                />
              </Box>

              {/* content area: labels above fields like Semester card */}
              <Grid container spacing={3} alignItems="flex-start">
                {/* Course */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5, color: "#1e293b" }}>
                      Course *
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Select the course for this subject
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!errors.course}>
                    <Select
                      displayEmpty
                      value={selectedCourse}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      disabled={isLoadingCourses}
                      sx={{
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        '& .MuiSelect-select': { 
                          padding: "12px 14px",
                          fontSize: "0.95rem",
                        },
                        '&:hover': {
                          backgroundColor: "#ffffff",
                        },
                        '&.Mui-focused': {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {isLoadingCourses ? "Loading courses..." : "Select Course"}
                      </MenuItem>
                      {courses.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.course && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.course}
                    </Typography>
                  )}
                </Grid>

                {/* Subject */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5, color: "#1e293b" }}>
                      Subject *
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Choose the subject from the selected course
                    </Typography>
                  </Box>
                  <FormControl fullWidth disabled={!selectedCourse || !semester || isLoadingSubjects}>
                    <Select
                      displayEmpty
                      value={currentSubject.subjectName}
                      onChange={(e) => handleInputChange("subjectName", e.target.value)}
                      sx={{
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        '& .MuiSelect-select': { 
                          padding: "12px 14px",
                          fontSize: "0.95rem",
                        },
                        '&:hover': {
                          backgroundColor: "#ffffff",
                        },
                        '&.Mui-focused': {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {isLoadingSubjects 
                          ? "Loading subjects..." 
                          : !selectedCourse || !semester
                          ? "Select Course and Semester first"
                          : "Select Subject"}
                      </MenuItem>
                      {courseSubjects.map((sub, idx) => {
                        const isAlreadyAdded = subjects.some(s => s.subjectName === sub);
                        return (
                          <MenuItem 
                            key={idx} 
                            value={sub}
                            disabled={isAlreadyAdded}
                            sx={{
                              ...(isAlreadyAdded && {
                                opacity: 0.5,
                                color: 'text.disabled',
                                cursor: 'not-allowed',
                              }),
                            }}
                          >
                            {sub} {isAlreadyAdded && '(Already Added)'}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors.subjectName && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.subjectName}
                    </Typography>
                  )}
                </Grid>

                {/* Marks Section */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: "#1e293b" }}>
                      Marks Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: "#334155" }}>
                          Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="0-100"
                          value={currentSubject.marks}
                          onChange={(e) => handleInputChange("marks", e.target.value)}
                          error={!!errors.marks}
                          helperText={errors.marks}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: "#fafafa",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: "#334155" }}>
                          Internal *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="0-100"
                          value={currentSubject.internal}
                          onChange={(e) => handleInputChange("internal", e.target.value)}
                          error={!!errors.internal}
                          helperText={errors.internal}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: "#fafafa",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: "#334155" }}>
                          Total (Auto-calculated)
                        </Typography>
                        <TextField
                          fullWidth
                          disabled
                          value={currentSubject.total || "0"}
                          error={!!errors.total}
                          helperText={errors.total}
                          sx={{
                            backgroundColor: "#f1f5f9",
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              fontWeight: 600,
                              color: "#059669",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Min/Max Marks Section */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: "#1e293b" }}>
                      Passing Criteria
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: "#334155" }}>
                          Min Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="Minimum passing marks"
                          value={currentSubject.minMarks}
                          onChange={(e) => handleInputChange("minMarks", e.target.value)}
                          error={!!errors.minMarks}
                          helperText={errors.minMarks}
                          inputProps={{ min: 0 }}
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: "#fafafa",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: "#334155" }}>
                          Max Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="Maximum possible marks"
                          value={currentSubject.maxMarks}
                          onChange={(e) => handleInputChange("maxMarks", e.target.value)}
                          error={!!errors.maxMarks}
                          helperText={errors.maxMarks}
                          inputProps={{ min: 0 }}
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: "#fafafa",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Add Button */}
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddSubject}
                    disabled={subjects.length >= 7}
                    sx={{
                      height: 50,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        boxShadow: "0 6px 16px rgba(59, 130, 246, 0.5)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: "#cbd5e1",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {subjects.length >= 7 ? "Maximum Subjects Reached" : "Add Subject to Marksheet"}
                  </Button>
                </Grid>
              </Grid>

              {/* small helper / warning area - matches other cards visually */}
              <Box sx={{ mt: 2 }}>
                {subjects.length >= 7 ? (
                  <Alert severity="warning">Maximum 7 subjects allowed</Alert>
                ) : (
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Select course & subject, fill marks and click Add Subject
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Slide>
      )}






      {/* ===================== SUBJECT TABLE ===================== */}
      {subjects.length > 0 && (
        <Slide direction="up" in timeout={1200}>
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Added Subjects ({subjects.length}/7)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip label={`Semester ${semester}`} color="info" sx={{ fontWeight: 600 }} />
                  <Chip 
                    label={`Total: ${totalMarks.toFixed(1)}`} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={`Average: ${averageMarks.toFixed(1)}`} 
                    color="success" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  maxHeight: { xs: 400, sm: 500 },
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f5f9',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cbd5e1',
                    borderRadius: '3px',
                    '&:hover': {
                      background: '#94a3b8',
                    },
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Subject Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Internal</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Min Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Max Marks</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {subjects.map((s) => (
                      <TableRow 
                        key={s.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: '#fafafa',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{s.subjectName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500, color: '#3b82f6' }}>{s.marks}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500, color: '#8b5cf6' }}>{s.internal}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#059669' }}>{s.total}</TableCell>
                        <TableCell align="right" sx={{ color: '#64748b' }}>{s.minMarks}</TableCell>
                        <TableCell align="right" sx={{ color: '#64748b' }}>{s.maxMarks}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSubject(s.id)}
                            size="small"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#fef2f2',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* ===================== SAVE / CANCEL ===================== */}
      {selectedStudent && (
        <Slide direction="up" in timeout={1400}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  startIcon={<Cancel />}
                  sx={{
                    minWidth: { xs: '100%', sm: '120px' },
                    height: '48px',
                    borderRadius: 2,
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f9fafb',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSubmitting || subjects.length === 0}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  sx={{
                    minWidth: { xs: '100%', sm: '120px' },
                    height: '48px',
                    borderRadius: 2,
                    backgroundColor: '#3b82f6',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    },
                    '&:disabled': {
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                  }}
                >
                  {isSubmitting 
                    ? 'Saving...' 
                    : existingMarksheetId 
                    ? 'Update Marksheet' 
                    : 'Save Marksheet'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      )}
    </Container>
  );
};

export default AddMarksheetPageAdmin;
