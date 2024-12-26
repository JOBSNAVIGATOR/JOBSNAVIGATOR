import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { BottomGradient } from "../ui/BottomGradient";
import SendMailButton from "../ui/SendMailButton";

const EmailEditor = ({ templates, data = {} }) => {
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null); // To track the editor DOM
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");

  // Initialize Quill.js only once
  useEffect(() => {
    if (quillRef.current) return; // Prevent multiple initializations

    quillRef.current = new Quill(editorContainerRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });
  }, []);

  // Update editor content when a new template is selected
  useEffect(() => {
    if (selectedTemplate && quillRef.current) {
      quillRef.current.root.innerHTML = selectedTemplate.content;
    }
  }, [selectedTemplate]);

  const handleTemplateChange = (e) => {
    const template = templates.find(
      (template) => template.id === e.target.value
    );
    setSelectedTemplate(template || { content: "" });
  };

  // const handleSend = () => {
  //   const emailContent = quillRef.current.root.innerHTML; // Get HTML content
  //   onSend({ subject, content: emailContent });
  // };

  return (
    <div className="">
      <div className="flex justify-between items-center gap-4 flex-grow mb-6">
        {/* select template */}
        <div>
          <label>
            Select Template:
            <select
              onChange={handleTemplateChange}
              className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-black dark:text-white  rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
              <option value="">-- Select --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          // onClick={handleSendEmails}
          className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          Save Template
          <BottomGradient />
        </button>
        <button
          type="submit"
          // onClick={handleSendEmails}
          className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          Update Template
          <BottomGradient />
        </button>
        {/* <button
          type="submit"
          // onClick={handleSendEmails}
          className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          Send Mail
          <BottomGradient />
        </button> */}
        <SendMailButton />
      </div>

      {/* Subject */}
      <div className="mb-6">
        <label className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Subject:
          <input
            className="flex h-10 w-full border-none bg-gray-100 dark:bg-zinc-600 text-black dark:text-white shadow-input rounded-xl px-3 py-2 text-sm file:border-0 file:bg-transparent 
                    file:text-sm file:font-medium dark:placeholder:text-neutral-300 dark:placeholder-text-neutral-600 
                    focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                    disabled:cursor-not-allowed disabled:opacity-50
                    dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                    group-hover/input:shadow-none transition duration-400"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
      </div>

      {/* Editor */}
      <div
        id="editor"
        ref={editorContainerRef}
        className="flex h-10 w-full border-none bg-gray-100 dark:bg-zinc-600 text-black dark:text-white shadow-input rounded-xl px-3 py-2 text-sm file:border-0 file:bg-transparent 
                    file:text-sm file:font-medium dark:placeholder:text-neutral-300 dark:placeholder-text-neutral-600 
                    focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                    disabled:cursor-not-allowed disabled:opacity-50
                    dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                    group-hover/input:shadow-none transition duration-400"
        style={{ height: "400px", marginTop: "20px" }}
      ></div>
    </div>
  );
};

export default EmailEditor;

// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EmailEditor = () => {
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [editorContent, setEditorContent] = useState("");

//   useEffect(() => {
//     // Fetch templates
//     fetch("/api/templates")
//       .then((res) => res.json())
//       .then((data) => setTemplates(data));
//   }, []);

//   const loadTemplate = (id) => {
//     fetch(`/api/templates/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setSelectedTemplate(data);
//         setEditorContent(data.content);
//       });
//   };

//   const saveTemplate = (isNew) => {
//     const endpoint = isNew
//       ? "/api/templates"
//       : `/api/templates/${selectedTemplate.id}`;
//     const method = isNew ? "POST" : "PUT";
//     fetch(endpoint, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: selectedTemplate?.name || "New Template",
//         content: editorContent,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         alert("Template saved successfully!");
//         setTemplates((prev) => [...prev, data]);
//       });
//   };

//   const sendEmail = () => {
//     // Your existing email-sending logic
//     alert("Email sent!");
//   };

//   return (
//     <div>
//       <select onChange={(e) => loadTemplate(e.target.value)}>
//         <option value="">Select a Template</option>
//         {templates.map((template) => (
//           <option key={template.id} value={template.id}>
//             {template.name}
//           </option>
//         ))}
//       </select>
//       <ReactQuill value={editorContent} onChange={setEditorContent} />
//       <button onClick={() => saveTemplate(false)}>Update Template</button>
//       <button onClick={() => saveTemplate(true)}>Save as New Template</button>
//       <button onClick={sendEmail}>Send Email</button>
//     </div>
//   );
// };

// export default EmailEditor;
