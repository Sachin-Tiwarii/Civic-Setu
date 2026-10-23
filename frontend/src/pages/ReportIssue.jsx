
import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
import "./ReportIssue.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "Garbage",
  "Road Damage",
  "Water Supply",
  "Drainage",
  "Streetlight",
  "Public Sanitation",
  "Other",
];

export default function ReportIssue() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Garbage",
    address: "",
  });

  const [coordinates, setCoordinates] = useState([
    22.7196, 75.8577,
  ]);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function updateFiles(event) {
    const selected = Array.from(event.target.files || []);

    if (selected.length > 5) {
      setMessage("You can attach a maximum of 5 files.");
      setMessageType("error");
      event.target.value = "";
      setFiles([]);
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    const invalidFile = selected.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > maxSize
    );

    if (invalidFile) {
      setMessage(
        "Use JPG, PNG, WEBP, MP4, WEBM or MOV files up to 25 MB each."
      );
      setMessageType("error");
      event.target.value = "";
      setFiles([]);
      return;
    }

    setFiles(selected);
    setMessage("");
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setMessage("");

    if (form.title.trim().length < 5) {
      setMessage("The title must contain at least 5 characters.");
      setMessageType("error");
      return;
    }

    if (form.description.trim().length < 10) {
      setMessage(
        "Please describe the issue in at least 10 characters."
      );
      setMessageType("error");
      return;
    }

    if (form.address.trim().length < 3) {
      setMessage("Please enter the issue address.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // First create the complaint.
      const response = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          location: {
            address: form.address.trim(),
            coordinates: [
              coordinates[1], // longitude first
              coordinates[0], // latitude second
            ],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not submit your complaint."
        );
      }

      const complaintId = data.complaint?._id;

      // Then upload evidence, if the user selected files.
      if (files.length > 0) {
        if (!complaintId) {
          throw new Error(
            "Complaint created, but its ID was not returned. Evidence was not uploaded."
          );
        }

        const evidenceForm = new FormData();

        files.forEach((file) => {
          evidenceForm.append("evidence", file);
        });

        const evidenceResponse = await fetch(
          `${API_URL}/api/complaints/${complaintId}/evidence`,
          {
            method: "POST",
            credentials: "include",
            body: evidenceForm,
          }
        );

        const evidenceData = await evidenceResponse.json();

        if (!evidenceResponse.ok) {
          throw new Error(
            `Complaint submitted, but evidence upload failed: ${
              evidenceData.message || "Please try uploading evidence again."
            }`
          );
        }
      }

      setMessage(
        `Complaint submitted successfully! Reference: ${complaintId}`
      );
      setMessageType("success");

      setForm({
        title: "",
        description: "",
        category: "Garbage",
        address: "",
      });

      setCoordinates([22.7196, 75.8577]);
      setFiles([]);

      const fileInput = document.getElementById("evidence-files");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="report-page">
      <div className="report-container">
        <header className="report-header">
          <span className="report-eyebrow">
            CIVICSETU / CITIZEN SERVICES
          </span>

          <h1>Report a civic issue</h1>

          <p>
            Tell us what needs attention in your area. Add the
            location and evidence so the issue can be reviewed.
          </p>
        </header>

        {message && (
          <div
            className={`report-message ${messageType}`}
            role="status"
          >
            {message}
          </div>
        )}

        <form
          className="report-form"
          onSubmit={submitComplaint}
        >
          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Issue details</h2>
                <p>Describe the problem clearly.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="title">Complaint title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="e.g. Garbage has not been collected"
                minLength={5}
                maxLength={120}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={updateField}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={updateField}
                placeholder="Explain what happened, where it happened, and how it affects the area..."
                rows={5}
                minLength={10}
                maxLength={2000}
                required
              />
              <span className="field-note">
                {form.description.length}/2000 characters
              </span>
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Issue location</h2>
                <p>
                  Select the exact spot on the map and enter its
                  address.
                </p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="address">Full address *</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={updateField}
                placeholder="Street, landmark, area, Indore"
                minLength={3}
                maxLength={300}
                required
              />
            </div>

            <LocationPicker
              position={coordinates}
              onChange={setCoordinates}
            />
          </section>

          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2>Evidence</h2>
                <p>
                  Add photos or videos to help explain the issue.
                </p>
              </div>
            </div>

            <label
              className="evidence-dropzone"
              htmlFor="evidence-files"
            >
              <span className="evidence-icon">＋</span>
              <strong>Choose photos or videos</strong>
              <span>
                JPG, PNG, WEBP, MP4, WEBM or MOV
              </span>
              <span>Maximum 5 files · 25 MB per file</span>
            </label>

            <input
              id="evidence-files"
              className="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
              multiple
              onChange={updateFiles}
            />

            {files.length > 0 && (
              <div className="selected-files">
                {files.map((file, index) => (
                  <div
                    className="selected-file"
                    key={`${file.name}-${index}`}
                  >
                    <span>
                      {file.type.startsWith("video/")
                        ? "VIDEO"
                        : "IMAGE"}
                    </span>
                    <p>{file.name}</p>
                    <small>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </small>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="report-form-footer">
            <p>
              Please provide accurate information. Your complaint
              will be submitted for review.
            </p>

            <button
              type="submit"
              className="submit-complaint-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit complaint"}
              {!loading && <span aria-hidden="true"> ↗</span>}
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
}
