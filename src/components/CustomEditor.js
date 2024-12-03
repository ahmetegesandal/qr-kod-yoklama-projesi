import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Use this if you want the classic editor

const editorConfiguration = {
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'undo',
        'redo'
    ]
};

const CustomEditor = ({ data, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={editorConfiguration}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CustomEditor;
