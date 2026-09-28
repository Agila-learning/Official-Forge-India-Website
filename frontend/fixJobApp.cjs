const fs = require('fs');
let c = fs.readFileSync('src/components/ui/JobApplicationForm.jsx', 'utf8');

c = c.replace(
  "const { data: uploadPath } = await api.post('/upload', uploadData, {\n headers: { 'Content-Type': 'multipart/form-data' }\n });\n finalResumeUrl = uploadPath;",
  "const { data } = await api.post('/upload', uploadData, {\n headers: { 'Content-Type': 'multipart/form-data' }\n });\n finalResumeUrl = data.url || data;"
);

// Make resumeUrl mandatory if not provided
c = c.replace(
  "const response = await api.post('/applications/apply', {",
  `if (!finalResumeUrl) {
    toast.error('Resume is mandatory. Please upload a resume.');
    setIsSubmitting(false);
    return;
  }

  const response = await api.post('/applications/apply', {`
);

fs.writeFileSync('src/components/ui/JobApplicationForm.jsx', c);
