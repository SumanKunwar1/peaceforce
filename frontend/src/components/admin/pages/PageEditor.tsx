import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="p-4 min-h-[400px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default PageEditor;
