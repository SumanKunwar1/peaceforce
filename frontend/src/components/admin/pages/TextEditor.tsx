import type React from "react";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/hooks/use-toast";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 500,
}) => {
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  return (
    <Editor
      apiKey="uhfeug0xkj84104hiv9as3vx780dego6oo7ohr6l654yxih5"
      onInit={(editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "codesample",
          "emoticons",
          "template",
          "paste",
          "textpattern",
          "imagetools",
          "quickbars",
          "noneditable",
          "pagebreak",
          "print",
          "save",
          "directionality",
          "visualchars",
          "nonbreaking",
        ],
        toolbar1:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
        toolbar2:
          "forecolor backcolor removeformat | insertfile image media template link anchor codesample | pagebreak code | fullscreen preview print save",
        toolbar3:
          "emoticons charmap | searchreplace | visualblocks visualchars | help",

        content_style: `body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          margin: 1rem;
        }
        img { 
          max-width: 100%;
          height: auto;
        }`,

        fontsize_formats:
          "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt 60pt 72pt",
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
          { text: "PHP", value: "php" },
          { text: "Python", value: "python" },
          { text: "Java", value: "java" },
          { text: "C", value: "c" },
          { text: "C++", value: "cpp" },
          { text: "C#", value: "c#" },
          { text: "Ruby", value: "ruby" },
          { text: "Go", value: "go" },
          { text: "Rust", value: "rust" },
          { text: "Swift", value: "swift" },
          { text: "Kotlin", value: "kotlin" },
          { text: "TypeScript", value: "typescript" },
          { text: "SQL", value: "sql" },
          { text: "JSON", value: "json" },
          { text: "YAML", value: "yaml" },
          { text: "XML", value: "xml" },
          { text: "Markdown", value: "markdown" },
          { text: "Plain Text", value: "plain" },
        ],

        templates: [
          {
            title: "Sample Template 1",
            description: "A basic template",
            content:
              '<div class="template-1"><h2>Heading</h2><p>Content goes here...</p></div>',
          },
          {
            title: "Sample Template 2",
            description: "Another template",
            content:
              '<div class="template-2"><h3>Section Title</h3><ul><li>Item 1</li><li>Item 2</li></ul></div>',
          },
        ],

        quickbars_selection_toolbar:
          "bold italic underline | quicklink h2 h3 blockquote table image media",
        quickbars_insert_toolbar:
          "quickimage quicktable media | quicklink h1 h2 h3",
        contextmenu: "link image table configurepermanentpen permanentpen",
        paste_data_images: true,
        smart_paste: true,
        browser_spellcheck: true,
        resize: true,
        statusbar: true,
        branding: false,
        promotion: false,

        style_formats: [
          {
            title: "Headers",
            items: [
              { title: "Header 1", format: "h1" },
              { title: "Header 2", format: "h2" },
              { title: "Header 3", format: "h3" },
              { title: "Header 4", format: "h4" },
              { title: "Header 5", format: "h5" },
              { title: "Header 6", format: "h6" },
            ],
          },
          {
            title: "Inline",
            items: [
              { title: "Bold", format: "bold" },
              { title: "Italic", format: "italic" },
              { title: "Underline", format: "underline" },
              { title: "Strikethrough", format: "strikethrough" },
              { title: "Superscript", format: "superscript" },
              { title: "Subscript", format: "subscript" },
              { title: "Code", format: "code" },
            ],
          },
          {
            title: "Blocks",
            items: [
              { title: "Paragraph", format: "p" },
              { title: "Blockquote", format: "blockquote" },
              { title: "Div", format: "div" },
              { title: "Pre", format: "pre" },
            ],
          },
        ],

        setup: (editor) => {
          editor.ui.registry.addButton("customwordcount", {
            text: "Word Count",
            onAction: () => {
              const wordCount = editor.plugins.wordcount.getCount();
              toast({
                title: "Word Count",
                description: `The content has ${wordCount} words`,
              });
            },
          });

          editor.addShortcut("meta+shift+c", "Open code view", () => {
            editor.execCommand("mceCodeEditor");
          });
        },
      }}
    />
  );
};

export default TinyMCEEditor;
