// import React from "react";

// const Modal = ({ isOpen, onClose, pdfUrl }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="flex justify-between p-4">
//           <h2 className="text-lg font-bold">Resume Preview</h2>
//           <button onClick={onClose} className="text-gray-600">
//             &times;
//           </button>
//         </div>
//         <div className="p-4">
//           <iframe
//             src={pdfUrl}
//             width="100%"
//             height="600px"
//             title="Resume Preview"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

// import React from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Configure worker for pdf.js
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const Modal = ({ isOpen, onClose, pdfUrl }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
//         <div className="flex justify-between p-4">
//           <h2 className="text-lg font-bold">Resume Preview</h2>
//           <button onClick={onClose} className="text-gray-600">
//             &times;
//           </button>
//         </div>
//         <div className="p-4">
//           <Document file={pdfUrl}>
//             <Page pageNumber={1} width={600} />
//           </Document>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from "react";
import { PDFViewer, Document, Page } from "@react-pdf/renderer";

const Modal = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="flex justify-between p-4">
          <h2 className="text-lg font-bold">Resume Preview</h2>
          <button onClick={onClose} className="text-gray-600">
            &times;
          </button>
        </div>
        <div className="p-4">
          <PDFViewer style={{ width: "100%", height: "600px" }}>
            <Document file={pdfUrl}>
              <Page pageNumber={1} />
            </Document>
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default Modal;
