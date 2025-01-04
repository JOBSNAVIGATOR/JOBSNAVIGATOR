"use client";
import React, { useState, useEffect } from "react";
import { BottomGradient } from "../ui/BottomGradient";
import SendMailButton from "../ui/SendMailButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "./MenuBar";

const EmailEditor = ({ templates, data = {} }) => {
  // const quillRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [updateTemplateName, setUpdateTemplateName] = useState("");
  const [updateTemplateId, setUpdateTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const router = useRouter();

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, Link, Image.configure({ inline: true })],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-[400px]",
      },
    },
    content: "",
  });

  useEffect(() => {
    if (selectedTemplate && editor) {
      editor.commands.setContent(selectedTemplate.content || "");
    }
  }, [selectedTemplate, editor]);

  const handleTemplateChange = (e) => {
    const template = templates.find(
      (template) => template.id === e.target.value
    );
    // setSelectedTemplate(template || { content: "" });
    if (template) {
      setSelectedTemplate(template);
      setSubject(template.subject); // Auto-fill the subject field
      setUpdateTemplateName(template.name);
      setUpdateTemplateId(template.id);
    } else {
      setSelectedTemplate({ content: "" });
      setSubject(""); // Clear the subject field if no template is selected
    }
  };

  async function handleSaveTemplate() {
    // const content = quillRef.current.root.innerHTML; // Get editor content

    if (!subject || !editor?.getHTML() || !templateName) {
      alert("Please provide subject ,Content, template Name.");
      return;
    }

    const data = {
      name: templateName, // Assuming `name` is the template name
      subject,
      content: editor.getHTML(),
    };
    makePostRequest(setLoading, "api/templates", data, "Email Template");
    setOpen(false);
  }

  async function handleUpdateTemplate() {
    // const content = quillRef.current.root.innerHTML; // Get editor content

    if (!subject || !editor?.getHTML()) {
      alert("Please provide subject Content template Name.");
      return;
    }

    const data = {
      id: updateTemplateId,
      name: updateTemplateName, // Assuming `name` is the template name
      subject,
      content: editor.getHTML(),
    };
    console.log(data);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to Update the Template : ${updateTemplateName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        makePutRequest(setLoading, "api/templates", data, "Email Template");
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleTemplateDelete() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    setDeleteLoading(true);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to Delete the Template : ${updateTemplateName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await fetch(
          `${baseUrl}/api/templates/?id=${updateTemplateId}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          toast.success("Template Deleted Successfully");
          router.refresh();
        } else {
          const errorMessage = await res.text();
          toast.error(`Failed to delete template: ${errorMessage}`);
        }
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  }
  // console.log("test1", editor?.getHTML());

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
              {templates.length ? (
                templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))
              ) : (
                <option value="">No templates available</option>
              )}
            </select>
          </label>
        </div>
        {/* save delete update send buttons */}
        <div className="grid grid-cols-2 gap-4">
          {/* Save Template */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                Save Template
                <BottomGradient />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
              <DialogHeader className="flex flex-col items-center justify-between gap-2">
                <DialogTitle className="">Save the Email Template</DialogTitle>
                <br />
              </DialogHeader>
              <DialogDescription>
                <div className="flex flex-col gap-8">
                  <label
                    className="text-lg font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    name="templateName"
                    htmlFor="templateName"
                  >
                    Template Name
                  </label>
                  <input
                    id="templateName"
                    name="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)} // Updates the state
                    className="flex h-10 w-full border-none bg-gray-100 dark:bg-zinc-600 text-black dark:text-white shadow-input rounded-xl px-3 py-2 text-sm file:border-0 file:bg-transparent 
                  file:text-sm file:font-medium dark:placeholder:text-neutral-300 dark:placeholder-text-neutral-600 
                  focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                  group-hover/input:shadow-none transition duration-400 mt-4"
                    type="text"
                  />
                  {loading ? (
                    <button
                      disabled
                      type="button"
                      className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Saving The Email Template
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleSaveTemplate}
                      className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    >
                      Save Template
                      <BottomGradient />
                    </button>
                  )}
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          {/* Delete Template */}
          <div className="">
            {deleteLoading ? (
              <button
                disabled
                type="button"
                className="bg-gradient-to-br relative group/btn from-red-600 dark:from-red-200 dark:to-red-500 to-red-500  dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex justify-center gap-2 items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Deleting Please wait...
              </button>
            ) : (
              <button
                onClick={handleTemplateDelete}
                className="bg-gradient-to-br relative group/btn from-red-600 dark:from-red-200 dark:to-red-500 to-red-500  dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex justify-center gap-2 items-center"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Template</span>
                <BottomGradient />
              </button>
            )}
          </div>
          {/* Update Template */}
          <button
            type="submit"
            onClick={handleUpdateTemplate}
            className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Update Template
            <BottomGradient />
          </button>
          {/* Send Mail */}
          <SendMailButton
            data={data}
            templateName={updateTemplateName}
            subject={subject}
            content={editor?.getHTML() || ""}
          />
        </div>
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
      {/* Menubar */}
      <MenuBar editor={editor} />
      {/* Editor */}
      <EditorContent
        editor={editor}
        className="flex p-16 mt-8 w-full h-full border-none bg-gray-100 dark:bg-zinc-600 text-black dark:text-white shadow-input rounded-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent overflow-y-auto"
      />
    </div>
  );
};

export default EmailEditor;
