import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({setEditorContent ,editorContent}) => {
  

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={TextEditor.modules}
        formats={TextEditor.formats}
        theme="snow"
      />
    </div>
  );
};

TextEditor.modules = {
  toolbar: [
    [ { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'strike'],
   
   

    ['clean']                                         
  ],
};

TextEditor.formats = [
  'header', 'font',
  'bold', 'italic', 'strike',
  'list', 'bullet',
];

export default TextEditor;
