import { useEffect, useRef, useState } from "react";
import LocationPicker from "../components/LocationPicker";
import "./ReportIssue.css";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "";

const categories = [
  "Garbage",
  "Road Damage",
  "Water Supply",
  "Drainage",
  "Streetlight",
  "Public Sanitation",
  "Other",
];

/*
  ALL visible text lives in this object.
  To add another language later, copy the "en" block, translate the values
  and add the new key (e.g. "mr"). Nothing is hard-coded in the JSX below.
*/
const text = {
  en: {
    skip: "Skip to main content",
    heading: "Lodge a grievance",
    intro:
      "Tell us what needs attention in your area. Add the location and evidence so the issue can be reviewed by the concerned authority.",
    requiredNote: "Fields marked with",
    mandatory: "are mandatory.",
    grievanceDetails: "Grievance details",
    describeProblem: "Describe the problem clearly.",
    grievanceTitle: "Grievance title",
    titlePlaceholder: "e.g. Garbage has not been collected",
    category: "Category",
    categoryHintLabel: "About this category:",
    description: "Description",
    descriptionPlaceholder:
      "Explain what happened, where it happened, and how it affects the area...",
    characters: "characters",
    locationHeading: "Location of the issue",
    locationDescription:
      "Select the exact spot on the map and enter its address.",
    fullAddress: "Full address",
    addressPlaceholder: "Street, landmark, area, Indore",
    evidenceHeading: "Supporting evidence",
    evidenceDescription:
      "Add photos or videos to help explain the issue (optional).",
    chooseFiles: "Choose photos or videos",
    fileTypes: "JPG, PNG, WEBP, MP4, WEBM or MOV",
    fileLimit: "Maximum 5 files, 25 MB per file",
    declaration: "Declaration:",
    declarationText:
      "I confirm that the information provided is accurate to the best of my knowledge.",
    submitting: "Submitting...",
    submit: "Submit grievance",
    categories: {
      Garbage: "Garbage",
      "Road Damage": "Road Damage",
      "Water Supply": "Water Supply",
      Drainage: "Drainage",
      Streetlight: "Streetlight",
      "Public Sanitation": "Public Sanitation",
      Other: "Other",
    },
    categoryInfo: {
      Garbage: "Uncollected waste, overflowing bins, illegal dumping.",
      "Road Damage": "Potholes, broken roads, damaged footpaths or dividers.",
      "Water Supply": "No supply, low pressure, leakage or dirty water.",
      Drainage: "Blocked or overflowing drains, waterlogging, open drains.",
      Streetlight: "Lights not working, flickering or poles in poor condition.",
      "Public Sanitation": "Dirty public toilets, unclean public spaces.",
      Other: "Any other civic issue that does not fit the categories above.",
    },
    errors: {
      maxFiles: "You can attach a maximum of 5 files.",
      invalidFiles:
        "Use JPG, PNG, WEBP, MP4, WEBM or MOV files up to 25 MB each.",
      title: "The title must contain at least 5 characters.",
      description: "Please describe the issue in at least 10 characters.",
      address: "Please enter the issue address.",
      submit: "Could not submit your complaint.",
      missingId:
        "Complaint created, but its ID was not returned. Evidence was not uploaded.",
      evidenceUpload: "Complaint submitted, but evidence upload failed.",
      evidenceRetry: "Please try uploading evidence again.",
      general: "Something went wrong. Please try again.",
    },
    success: "Grievance submitted successfully. Reference ID:",

    // Sidebar
    tipsTitle: "Before you submit",
    tipsIntro:
      "A few details can help the concerned team resolve your issue faster.",
    tips: [
      {
        title: "Be specific",
        body: "Mention the exact problem, nearby landmark and when it started.",
      },
      {
        title: "Pin the right location",
        body: "Move the map marker to the spot where the issue is visible.",
      },
      {
        title: "Add clear evidence",
        body: "Upload recent photos or a short video. Avoid unrelated images.",
      },
      {
        title: "Track your reference ID",
        body: "After submission, keep the reference ID shown on the screen.",
      },
    ],
    categoriesTitle: "What can you report?",
    categoriesIntro: "Choose the category that matches your issue best.",
    emergencyTitle: "Is it an emergency?",
    emergencyText:
      "This form is not for emergencies. If there is danger to life, fire, accident or a crime in progress, call the national emergency number 112 immediately.",
    privacyTitle: "Your information",
    privacyText:
      "Provide accurate details. Your complaint will be shared with the concerned civic authority for review.",

    // How it works
    stepsTitle: "How your grievance is handled",
    stepsIntro: "Four simple stages from submission to resolution.",
    steps: [
      {
        title: "Submit",
        body: "Fill in the details, mark the location and attach evidence.",
      },
      {
        title: "Review",
        body: "The concerned civic department checks your complaint.",
      },
      {
        title: "Action",
        body: "The issue is assigned to a team and work is taken up.",
      },
      {
        title: "Resolution",
        body: "The complaint is closed once the issue has been addressed.",
      },
    ],

    // FAQ
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Do I need to attach photos or videos?",
        a: "No, evidence is optional. However, clear photos or a short video help the authority understand and verify the problem faster.",
      },
      {
        q: "How do I mark the exact location?",
        a: "Click or tap on the map, or drag the marker, to the spot where the issue is visible. Then type the street, landmark and area in the address field.",
      },
      {
        q: "What is the reference ID?",
        a: "It is a unique number shown on screen after you submit. Keep it safely so you can refer to your complaint later.",
      },
      {
        q: "Can I report more than one issue?",
        a: "Yes. Please submit a separate grievance for each issue so that each one can be assigned to the right team.",
      },
    ],
  },

  hi: {
    skip: "मुख्य सामग्री पर जाएँ",
    heading: "शिकायत दर्ज करें",
    intro:
      "अपने क्षेत्र की समस्या के बारे में हमें बताएँ। स्थान और साक्ष्य जोड़ें ताकि संबंधित अधिकारी समस्या की समीक्षा कर सकें।",
    requiredNote: "जिन फ़ील्ड पर",
    mandatory: "लगा है, उन्हें भरना अनिवार्य है।",
    grievanceDetails: "शिकायत का विवरण",
    describeProblem: "समस्या का स्पष्ट विवरण दें।",
    grievanceTitle: "शिकायत का शीर्षक",
    titlePlaceholder: "उदाहरण: कचरा एकत्र नहीं किया गया है",
    category: "श्रेणी",
    categoryHintLabel: "इस श्रेणी के बारे में:",
    description: "विवरण",
    descriptionPlaceholder:
      "बताएँ कि क्या हुआ, कहाँ हुआ और इसका क्षेत्र पर क्या प्रभाव पड़ रहा है...",
    characters: "अक्षर",
    locationHeading: "समस्या का स्थान",
    locationDescription: "मैप पर सटीक स्थान चुनें और उसका पता दर्ज करें।",
    fullAddress: "पूरा पता",
    addressPlaceholder: "सड़क, लैंडमार्क, क्षेत्र, इंदौर",
    evidenceHeading: "सहायक साक्ष्य",
    evidenceDescription:
      "समस्या को समझाने के लिए फोटो या वीडियो जोड़ें (वैकल्पिक)।",
    chooseFiles: "फोटो या वीडियो चुनें",
    fileTypes: "JPG, PNG, WEBP, MP4, WEBM या MOV",
    fileLimit: "अधिकतम 5 फ़ाइलें, प्रत्येक 25 MB तक",
    declaration: "घोषणा:",
    declarationText:
      "मैं पुष्टि करता/करती हूँ कि दी गई जानकारी मेरी सर्वोत्तम जानकारी के अनुसार सही है।",
    submitting: "जमा किया जा रहा है...",
    submit: "शिकायत जमा करें",
    categories: {
      Garbage: "कचरा",
      "Road Damage": "सड़क की क्षति",
      "Water Supply": "जल आपूर्ति",
      Drainage: "जल निकासी",
      Streetlight: "स्ट्रीट लाइट",
      "Public Sanitation": "सार्वजनिक स्वच्छता",
      Other: "अन्य",
    },
    categoryInfo: {
      Garbage: "एकत्र न किया गया कचरा, भरे हुए कूड़ेदान, अवैध रूप से कचरा फेंकना।",
      "Road Damage": "गड्ढे, टूटी सड़कें, क्षतिग्रस्त फुटपाथ या डिवाइडर।",
      "Water Supply": "पानी न आना, कम दबाव, रिसाव या गंदा पानी।",
      Drainage: "जाम या उफनती नालियाँ, जलभराव, खुली नालियाँ।",
      Streetlight: "बंद या टिमटिमाती लाइटें, खराब हालत में खंभे।",
      "Public Sanitation": "गंदे सार्वजनिक शौचालय, सार्वजनिक स्थानों पर गंदगी।",
      Other: "कोई अन्य नागरिक समस्या जो ऊपर की श्रेणियों में न आती हो।",
    },
    errors: {
      maxFiles: "आप अधिकतम 5 फ़ाइलें ही संलग्न कर सकते हैं।",
      invalidFiles:
        "JPG, PNG, WEBP, MP4, WEBM या MOV फ़ाइलें चुनें। प्रत्येक फ़ाइल 25 MB तक होनी चाहिए।",
      title: "शीर्षक में कम से कम 5 अक्षर होने चाहिए।",
      description: "कृपया समस्या का विवरण कम से कम 10 अक्षरों में दें।",
      address: "कृपया समस्या का पता दर्ज करें।",
      submit: "आपकी शिकायत जमा नहीं की जा सकी।",
      missingId:
        "शिकायत बन गई, लेकिन उसका ID प्राप्त नहीं हुआ। साक्ष्य अपलोड नहीं किए गए।",
      evidenceUpload: "शिकायत जमा हो गई, लेकिन साक्ष्य अपलोड नहीं हो सके।",
      evidenceRetry: "कृपया साक्ष्य दोबारा अपलोड करने का प्रयास करें।",
      general: "कुछ गलत हो गया। कृपया दोबारा प्रयास करें।",
    },
    success: "शिकायत सफलतापूर्वक जमा हुई। संदर्भ ID:",

    tipsTitle: "जमा करने से पहले",
    tipsIntro:
      "कुछ अतिरिक्त जानकारियाँ संबंधित टीम को समस्या जल्दी हल करने में मदद कर सकती हैं।",
    tips: [
      {
        title: "स्पष्ट जानकारी दें",
        body: "समस्या, पास के लैंडमार्क और इसकी शुरुआत कब हुई, यह बताएँ।",
      },
      {
        title: "सही स्थान चुनें",
        body: "मैप मार्कर को उस जगह पर रखें जहाँ समस्या दिखाई दे रही है।",
      },
      {
        title: "स्पष्ट साक्ष्य जोड़ें",
        body: "हाल की फोटो या छोटा वीडियो अपलोड करें। असंबंधित तस्वीरें न जोड़ें।",
      },
      {
        title: "संदर्भ ID सुरक्षित रखें",
        body: "जमा करने के बाद स्क्रीन पर दिखाई गई संदर्भ ID संभालकर रखें।",
      },
    ],
    categoriesTitle: "आप क्या रिपोर्ट कर सकते हैं?",
    categoriesIntro: "अपनी समस्या से सबसे अधिक मेल खाने वाली श्रेणी चुनें।",
    emergencyTitle: "क्या यह आपातकाल है?",
    emergencyText:
      "यह फ़ॉर्म आपात स्थिति के लिए नहीं है। जान का खतरा, आग, दुर्घटना या अपराध होने की स्थिति में तुरंत राष्ट्रीय आपातकालीन नंबर 112 पर कॉल करें।",
    privacyTitle: "आपकी जानकारी",
    privacyText:
      "सही जानकारी दें। आपकी शिकायत समीक्षा के लिए संबंधित नागरिक प्राधिकरण के साथ साझा की जाएगी।",

    stepsTitle: "आपकी शिकायत का निपटारा कैसे होता है",
    stepsIntro: "शिकायत जमा करने से समाधान तक चार सरल चरण।",
    steps: [
      {
        title: "जमा करें",
        body: "विवरण भरें, स्थान चिह्नित करें और साक्ष्य संलग्न करें।",
      },
      {
        title: "समीक्षा",
        body: "संबंधित नागरिक विभाग आपकी शिकायत की जाँच करता है।",
      },
      {
        title: "कार्रवाई",
        body: "समस्या किसी टीम को सौंपी जाती है और कार्य शुरू होता है।",
      },
      {
        title: "समाधान",
        body: "समस्या का निवारण होने पर शिकायत बंद कर दी जाती है।",
      },
    ],

    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      {
        q: "क्या फोटो या वीडियो संलग्न करना ज़रूरी है?",
        a: "नहीं, साक्ष्य वैकल्पिक है। फिर भी स्पष्ट फोटो या छोटा वीडियो अधिकारियों को समस्या समझने और जाँचने में जल्दी मदद करता है।",
      },
      {
        q: "सटीक स्थान कैसे चिह्नित करूँ?",
        a: "मैप पर क्लिक या टैप करें, या मार्कर को उस जगह तक खींचें जहाँ समस्या दिखती है। फिर पता वाले फ़ील्ड में सड़क, लैंडमार्क और क्षेत्र लिखें।",
      },
      {
        q: "संदर्भ ID क्या है?",
        a: "यह एक विशिष्ट संख्या है जो शिकायत जमा करने के बाद स्क्रीन पर दिखाई जाती है। इसे सुरक्षित रखें ताकि आप बाद में अपनी शिकायत का हवाला दे सकें।",
      },
      {
        q: "क्या मैं एक से अधिक समस्याएँ रिपोर्ट कर सकता/सकती हूँ?",
        a: "हाँ। हर समस्या के लिए अलग शिकायत दर्ज करें ताकि प्रत्येक को सही टीम को सौंपा जा सके।",
      },
    ],
  },
};

const initialForm = {
  title: "",
  description: "",
  category: "Garbage",
  address: "",
};

const defaultCoordinates = [22.7196, 75.8577];

export default function ReportIssue({ lang = "en" }) {
  const currentLang = text[lang] ? lang : "en";
  const t = text[currentLang];

  const [form, setForm] = useState(initialForm);
  const [coordinates, setCoordinates] = useState(defaultCoordinates);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const messageRef = useRef(null);

  // Bring the success / error message into view so it is never missed.
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function updateFiles(event) {
    const selected = Array.from(event.target.files || []);

    if (selected.length > 5) {
      setMessage(t.errors.maxFiles);
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
      setMessage(t.errors.invalidFiles);
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
            coordinates: [coordinates[1], coordinates[0]], // [lng, lat]
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "SUBMIT_ERROR");
      }

      const complaintId = data.complaint?._id;

      if (files.length > 0) {
        if (!complaintId) {
          throw new Error("MISSING_ID");
        }

        const evidenceForm = new FormData();
        files.forEach((file) => evidenceForm.append("evidence", file));

        const evidenceResponse = await fetch(
          `${API_URL}/api/complaints/${complaintId}/evidence`,
          { method: "POST", credentials: "include", body: evidenceForm }
        );

        const evidenceData = await evidenceResponse.json();

        if (!evidenceResponse.ok) {
          throw new Error(`EVIDENCE_ERROR:${evidenceData.message || ""}`);
        }
      }

      setMessage(`${t.success} ${complaintId}`);
      setMessageType("success");
      setForm(initialForm);
      setCoordinates(defaultCoordinates);
      setFiles([]);

      const fileInput = document.getElementById("evidence-files");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      let errorMessage = error.message || "GENERAL_ERROR";

      if (errorMessage === "SUBMIT_ERROR") {
        errorMessage = t.errors.submit;
      } else if (errorMessage === "MISSING_ID") {
        errorMessage = t.errors.missingId;
      } else if (errorMessage.startsWith("EVIDENCE_ERROR:")) {
        const backendMessage = errorMessage.replace("EVIDENCE_ERROR:", "");
        errorMessage = backendMessage
          ? `${t.errors.evidenceUpload} ${backendMessage}`
          : `${t.errors.evidenceUpload} ${t.errors.evidenceRetry}`;
      } else if (errorMessage === "GENERAL_ERROR") {
        errorMessage = t.errors.general;
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`report-page ${
        currentLang === "hi" ? "report-hindi-page" : ""
      }`}
      lang={currentLang}
    >
      <a href="#main-content" className="gov-skip">
        {t.skip}
      </a>

      <main id="main-content" className="report-container">
        <header className="report-header">
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
        </header>

        {/* How it works */}
        <section className="process-strip" aria-labelledby="process-title">
          <div className="process-head">
            <h2 id="process-title">{t.stepsTitle}</h2>
            <p>{t.stepsIntro}</p>
          </div>

          <ol className="process-list">
            {t.steps.map((step, index) => (
              <li key={step.title}>
                <span className="process-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="report-content-grid">
          <div className="report-main-column">
            <p className="report-required-note">
              {t.requiredNote} <b>*</b> {t.mandatory}
            </p>

            {message && (
              <div
                ref={messageRef}
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
                    <h2>{t.grievanceDetails}</h2>
                    <p>{t.describeProblem}</p>
                  </div>
                </div>

                <div className="section-body">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="title">
                        {t.grievanceTitle} <span className="req">*</span>
                      </label>
                      <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={updateField}
                        placeholder={t.titlePlaceholder}
                        minLength={5}
                        maxLength={120}
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="category">
                        {t.category} <span className="req">*</span>
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
                            {t.categories[category]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="category-hint" aria-live="polite">
                    <strong>{t.categoryHintLabel}</strong>{" "}
                    {t.categoryInfo[form.category]}
                  </p>

                  <div className="form-field">
                    <label htmlFor="description">
                      {t.description} <span className="req">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={updateField}
                      placeholder={t.descriptionPlaceholder}
                      rows={5}
                      minLength={10}
                      maxLength={2000}
                      required
                      aria-required="true"
                    />
                    <span className="field-note">
                      {form.description.length}/2000 {t.characters}
                    </span>
                  </div>
                </div>
              </section>

              <section className="report-section">
                <div className="section-heading">
                  <span className="section-number">2</span>
                  <div>
                    <h2>{t.locationHeading}</h2>
                    <p>{t.locationDescription}</p>
                  </div>
                </div>

                <div className="section-body">
                  <div className="form-field">
                    <label htmlFor="address">
                      {t.fullAddress} <span className="req">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={updateField}
                      placeholder={t.addressPlaceholder}
                      minLength={3}
                      maxLength={300}
                      required
                      aria-required="true"
                    />
                  </div>

                  <LocationPicker
                    position={coordinates}
                    onChange={setCoordinates}
                    lang={currentLang}
                  />
                </div>
              </section>

              <section className="report-section">
                <div className="section-heading">
                  <span className="section-number">3</span>
                  <div>
                    <h2>{t.evidenceHeading}</h2>
                    <p>{t.evidenceDescription}</p>
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
                    <span className="evidence-icon" aria-hidden="true">
                      ＋
                    </span>
                    <strong>{t.chooseFiles}</strong>
                    <span>{t.fileTypes}</span>
                    <span>{t.fileLimit}</span>
                  </label>

                  {files.length > 0 && (
                    <div className="selected-files">
                      {files.map((file, index) => (
                        <div
                          className="selected-file"
                          key={`${file.name}-${index}`}
                        >
                          <span>
                            {file.type.startsWith("video/") ? "VIDEO" : "IMAGE"}
                          </span>
                          <p>{file.name}</p>
                          <small>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <div className="report-form-footer">
                <p>
                  <strong>{t.declaration}</strong> {t.declarationText}
                </p>
                <button
                  type="submit"
                  className="submit-complaint-btn"
                  disabled={loading}
                >
                  {loading ? t.submitting : t.submit}
                </button>
              </div>
            </form>
          </div>

          <aside className="report-guidance" aria-label={t.tipsTitle}>
            <div className="guidance-card">
              <div className="guidance-card-heading">
                <span className="guidance-check" aria-hidden="true">
                  ✓
                </span>
                <h2>{t.tipsTitle}</h2>
              </div>
              <p className="guidance-intro">{t.tipsIntro}</p>

              <ul className="guidance-list">
                {t.tips.map((tip, index) => (
                  <li key={tip.title}>
                    <span className="guidance-step" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{tip.title}</strong>
                      <p>{tip.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="guidance-card">
              <div className="guidance-card-heading">
                <h2>{t.categoriesTitle}</h2>
              </div>
              <p className="guidance-intro">{t.categoriesIntro}</p>

              <dl className="category-list">
                {categories.map((category) => (
                  <div key={category}>
                    <dt>{t.categories[category]}</dt>
                    <dd>{t.categoryInfo[category]}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="guidance-emergency" role="note">
              <strong>{t.emergencyTitle}</strong>
              <p>{t.emergencyText}</p>
            </div>

            <div className="guidance-privacy">
              <span className="privacy-icon" aria-hidden="true">
                i
              </span>
              <div>
                <strong>{t.privacyTitle}</strong>
                <p>{t.privacyText}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section className="faq-section" aria-labelledby="faq-title">
          <h2 id="faq-title">{t.faqTitle}</h2>
          <div className="faq-grid">
            {t.faqs.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}