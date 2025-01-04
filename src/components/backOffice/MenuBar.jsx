import "./styles.scss";
import React from "react";
import { Button } from "flowbite-react";
export default function MenuBar({ editor }) {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 bg-gradient-to-br relative group/btn from-black to-white  dark:bg-zinc-800 font-bold text-white dark:text-slate-900 rounded-xl shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]  justify-center items-center p-4">
      {/* <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        Bold
      </button> */}
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded-xl ${editor.isActive("bold") ? "is-active" : ""}`}
      >
        Bold
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded-xl ${editor.isActive("italic") ? "is-active" : ""}`}
      >
        Italic
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`rounded-xl ${editor.isActive("strike") ? "is-active" : ""}`}
      >
        Strike
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`rounded-xl ${editor.isActive("code") ? "is-active" : ""}`}
      >
        Code
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={`rounded-xl`}
      >
        Clear marks
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`rounded-xl ${
          editor.isActive("paragraph") ? "is-active" : ""
        }`}
      >
        Paragraph
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 1 }) ? "is-active" : ""
        }`}
      >
        H1
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 2 }) ? "is-active" : ""
        }`}
      >
        H2
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 3 }) ? "is-active" : ""
        }`}
      >
        H3
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 4 }) ? "is-active" : ""
        }`}
      >
        H4
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 5 }) ? "is-active" : ""
        }`}
      >
        H5
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`rounded-xl ${
          editor.isActive("heading", { level: 6 }) ? "is-active" : ""
        }`}
      >
        H6
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded-xl ${
          editor.isActive("bulletList") ? "is-active" : ""
        }`}
      >
        Bullet list
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded-xl ${
          editor.isActive("orderedList") ? "is-active" : ""
        }`}
      >
        Ordered list
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`rounded-xl ${
          editor.isActive("codeBlock") ? "is-active" : ""
        }`}
      >
        Code block
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`rounded-xl ${
          editor.isActive("blockquote") ? "is-active" : ""
        }`}
      >
        Blockquote
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`rounded-xl`}
      >
        Horizontal rule
      </Button>
      <Button
        gradientDuoTone="redToYellow"
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className={`rounded-xl`}
      >
        Hard break
      </Button>

      {/* <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        Code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        Clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        Blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        Hard break
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button> */}
    </div>
  );
}
