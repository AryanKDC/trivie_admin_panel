import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Typography, FormHelperText } from '@mui/material';

const QuillEditor = ({
    label,
    value,
    onChange,
    error,
    touched,
    placeholder = "Enter text...",
    required = false
}) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            // Initialize Quill
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link'],
                        ['clean']
                    ],
                    keyboard: {
                        bindings: {
                            linebreak: {
                                key: 13,
                                shiftKey: true,
                                handler: function (range) {
                                    // Insert a line break (<br>) instead of a new paragraph
                                    this.quill.insertText(range.index, '\n', 'user');
                                    this.quill.setSelection(range.index + 1, 'silent');
                                    return false;
                                }
                            }
                        }
                    }
                }
            });

            // Set initial value
            if (value) {
                quillRef.current.root.innerHTML = value;
            }

            // Handle text changes
            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML;
                console.log('Quill HTML Output:', html); // Debug log to see actual HTML
                onChange(html);
            });
        }
    }, []);

    // Update content when value changes from outside
    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            const currentSelection = quillRef.current.getSelection();
            quillRef.current.root.innerHTML = value || '';
            if (currentSelection) {
                quillRef.current.setSelection(currentSelection);
            }
        }
    }, [value]);

    return (
        <Box>
            <Typography
                variant="body2"
                fontWeight={500}
                mb={1}
                color={error && touched ? "error" : "text.primary"}
            >
                {label} {required && <span style={{ color: "#DC0000" }}>*</span>}
            </Typography>
            <Box
                sx={{
                    '& .ql-container': {
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        border: error && touched ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                        borderTop: 'none',
                        minHeight: '120px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                    },
                    '& .ql-toolbar': {
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        border: error && touched ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                        backgroundColor: '#fafafa',
                    },
                    '& .ql-editor': {
                        minHeight: '120px',
                    },
                    '& .ql-editor.ql-blank::before': {
                        color: '#9ca3af',
                        fontStyle: 'normal',
                    }
                }}
            >
                <div ref={editorRef} />
            </Box>
            {touched && error && (
                <FormHelperText error>{error}</FormHelperText>
            )}
        </Box>
    );
};

export default QuillEditor;
