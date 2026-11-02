import { useState } from "react";
import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import LocationPicker from "../components/LocationPicker";
import "./ReportIssue.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const [coordinates, setCoordinates] = useState([22.7196, 75.8577]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [fontSize, setFontSize] = useState(15);
  const [highContrast, setHighContrast] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
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
      (file) => !allowedTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFile) {
      setMessage("Use JPG, PNG, WEBP, MP4, WEBM or MOV files up to 25 MB each.");
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
      setMessage("Please describe the issue in at least 10 characters.");
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
        headers: { "Content-Type": "application/json" },
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
        throw new Error(data.message || "Could not submit your complaint.");
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
        files.forEach((file) => evidenceForm.append("evidence", file));

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

      setMessage(`Grievance submitted successfully. Reference ID: ${complaintId}`);
      setMessageType("success");

      setForm({ title: "", description: "", category: "Garbage", address: "" });
      setCoordinates([22.7196, 75.8577]);
      setFiles([]);

      const fileInput = document.getElementById("evidence-files");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`report-page${highContrast ? " high-contrast" : ""}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <a href="#main-content" className="gov-skip">
        Skip to main content
      </a>

      <div className="gov-topbar">
        <div className="gov-topbar-inner">
          <span>भारत सरकार पहल | Government of India Initiative</span>
          <div className="gov-tools" role="group" aria-label="Accessibility options">
            <button type="button" onClick={() => setFontSize((s) => Math.max(13, s - 1))} aria-label="Decrease text size">A-</button>
            <button type="button" onClick={() => setFontSize(15)} aria-label="Reset text size">A</button>
            <button type="button" onClick={() => setFontSize((s) => Math.min(19, s + 1))} aria-label="Increase text size">A+</button>
            <button type="button" onClick={() => setHighContrast((v) => !v)} aria-pressed={highContrast} aria-label="Toggle high contrast">
              Contrast
            </button>
          </div>
        </div>
      </div>

      <main id="main-content" className="report-container">
    

        <header className="report-header">
          <h1>Lodge a grievance | शिकायत दर्ज करें</h1>
          <p>
            Tell us what needs attention in your area. Add the location and
            evidence so the issue can be reviewed by the concerned authority.
          </p>
        </header>

        <p className="report-required-note">
          Fields marked with <b>*</b> are mandatory.
        </p>

        {message && (
          <div
            className={`report-message ${messageType}`}
            role={messageType === "error" ? "alert" : "status"}
          >
            {message}
          </div>
        )}

        <form className="report-form" onSubmit={submitComplaint}>
          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">1</span>
              <div>
                <h2>Grievance details</h2>
                <p>Describe the problem clearly.</p>
              </div>
            </div>

            <div className="section-body">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="title">
                    Grievance title <span className="req">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    placeholder="e.g. Garbage has not been collected"
                    minLength={5}
                    maxLength={120}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="category">
                    Category <span className="req">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    required
                    aria-required="true"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="description">
                  Description <span className="req">*</span>
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
                  aria-required="true"
                />
                <span className="field-note">
                  {form.description.length}/2000 characters
                </span>
              </div>
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">2</span>
              <div>
                <h2>Location of the issue</h2>
                <p>Select the exact spot on the map and enter its address.</p>
              </div>
            </div>

            <div className="section-body">
              <div className="form-field">
                <label htmlFor="address">
                  Full address <span className="req">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  placeholder="Street, landmark, area, Indore"
                  minLength={3}
                  maxLength={300}
                  required
                  aria-required="true"
                />
              </div>

              <LocationPicker position={coordinates} onChange={setCoordinates} />
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <span className="section-number">3</span>
              <div>
                <h2>Supporting evidence</h2>
                <p>Add photos or videos to help explain the issue (optional).</p>
              </div>
            </div>

            <div className="section-body">
              <input
                id="evidence-files"
                className="file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={updateFiles}
              />

              <label className="evidence-dropzone" htmlFor="evidence-files">
                <span className="evidence-icon" aria-hidden="true">＋</span>
                <strong>Choose photos or videos</strong>
                <span>JPG, PNG, WEBP, MP4, WEBM or MOV</span>
                <span>Maximum 5 files, 25 MB per file</span>
              </label>

              {files.length > 0 && (
                <div className="selected-files">
                  {files.map((file, index) => (
                    <div className="selected-file" key={`${file.name}-${index}`}>
                      <span>{file.type.startsWith("video/") ? "VIDEO" : "IMAGE"}</span>
                      <p>{file.name}</p>
                      <small>{(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <footer className="report-form-footer">
            <p>
              <strong>Declaration:</strong> I confirm that the information
              provided is accurate to the best of my knowledge.
            </p>

            <button
              type="submit"
              className="submit-complaint-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit grievance"}
            </button>
          </footer>
        </form>
      </main>

      <footer className="gov-footer">
        <div className="gov-footer-inner">
          <span>
            <a href="/help">Help</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/accessibility">Accessibility Statement</a>
          </span>
          <span>© CivicSetu. Content owned and maintained by CivicSetu.</span>
        </div>
      </footer>
    </div>
  );
}