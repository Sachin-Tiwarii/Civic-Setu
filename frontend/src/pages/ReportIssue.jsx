
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const defaultCoordinates = [22.7196, 75.8577];

const initialForm = {
  title: "",
  description: "",
  category: "Other",
  address: "",
};

const translations = {
  en: {
    title: "Report an Issue",
    subtitle: "Help improve your community by reporting civic issues.",
    issueTitle: "Issue Title",
    description: "Description",
    category: "Category",
    address: "Location / Address",
    evidence: "Upload Evidence",
    submit: "Submit Complaint",
    submitting: "Submitting...",
    success: "Complaint submitted successfully! ID:",
    errors: {
      title: "Title must contain at least 5 characters.",
      description: "Description must contain at least 10 characters.",
      address: "Please enter a valid address.",
      submit: "Unable to submit complaint.",
      missingId: "Complaint created, but its ID was not returned.",
      evidenceUpload: "Complaint created, but evidence upload failed:",
      general: "Something went wrong. Please try again.",
    },
  },

  hi: {
    title: "समस्या की रिपोर्ट करें",
    subtitle: "नागरिक समस्याओं की रिपोर्ट करके अपने समुदाय को बेहतर बनाएं।",
    issueTitle: "समस्या का शीर्षक",
    description: "विवरण",
    category: "श्रेणी",
    address: "स्थान / पता",
    evidence: "सबूत अपलोड करें",
    submit: "शिकायत जमा करें",
    submitting: "जमा हो रही है...",
    success: "शिकायत सफलतापूर्वक जमा हुई! ID:",
    errors: {
      title: "शीर्षक कम से कम 5 अक्षरों का होना चाहिए।",
      description: "विवरण कम से कम 10 अक्षरों का होना चाहिए।",
      address: "कृपया सही पता दर्ज करें।",
      submit: "शिकायत जमा नहीं हो सकी।",
      missingId: "शिकायत बनी, लेकिन ID प्राप्त नहीं हुई।",
      evidenceUpload: "शिकायत बन गई, लेकिन सबूत अपलोड नहीं हुआ:",
      general: "कुछ गलत हुआ। कृपया दोबारा प्रयास करें।",
    },
  },
};

export default function ReportIssue({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  const [form, setForm] = useState(initialForm);
  const [coordinates, setCoordinates] = useState(defaultCoordinates);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFiles = (event) => {
    setFiles(Array.from(event.target.files || []));
  };

  async function submitComplaint(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setMessageType("");

    if (form.title.trim().length < 5) {
      setMessage(t.errors.title);
      setMessageType("error");
      return;
    }

    if (form.description.trim().length < 10) {
      setMessage(t.errors.description);
      setMessageType("error");
      return;
    }

    if (form.address.trim().length < 3) {
      setMessage(t.errors.address);
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Create complaint
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
              coordinates[1],
              coordinates[0],
            ],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "SUBMIT_ERROR");
      }

      const complaintId = data.complaint?._id;

      if (!complaintId) {
        throw new Error("MISSING_ID");
      }

      // STEP 2: Upload evidence
      if (files.length > 0) {
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

        if (
          !evidenceResponse.ok ||
          evidenceData.success !== true
        ) {
          throw new Error(
            `EVIDENCE_ERROR:${evidenceData.message || "Upload failed"}`
          );
        }
      }

      // STEP 3: Reset after success
      setForm(initialForm);
      setCoordinates(defaultCoordinates);
      setFiles([]);

      const fileInput = document.getElementById("evidence-files");

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage(`${t.success} ${complaintId}`);
      setMessageType("success");

    } catch (error) {
      console.error("Complaint submission error:", error);

      let errorMessage = error.message || "GENERAL_ERROR";

      if (errorMessage === "MISSING_ID") {
        errorMessage = t.errors.missingId;
      } else if (errorMessage.startsWith("EVIDENCE_ERROR:")) {
        errorMessage = `${t.errors.evidenceUpload} ${errorMessage.replace(
          "EVIDENCE_ERROR:",
          ""
        )}`;
      } else if (
        errorMessage === "Failed to fetch" ||
        errorMessage === "GENERAL_ERROR"
      ) {
        errorMessage = t.errors.general;
      } else if (errorMessage === "SUBMIT_ERROR") {
        errorMessage = t.errors.submit;
      }

      setMessage(errorMessage);
      setMessageType("error");

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={submitComplaint}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          {/* Title */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.issueTitle}
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter issue title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.description}
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.category}
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Garbage">Garbage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.address}
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter location or address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.evidence}
            </label>

            <input
              id="evidence-files"
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFiles}
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              role="alert"
              className={`rounded-lg p-3 text-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#233B5A] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t.submitting : t.submit}
          </button>

        </form>
      </div>
    </main>
  );
}
