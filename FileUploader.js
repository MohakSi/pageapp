// src/components/FileUploader.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [query, setQuery] = useState('');

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      formData.append(`pdfFiles[${index}]`, file);
    });

    try {
      const response = await axios.post('http://localhost:5000/uploadFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/search', { query, file_paths: selectedFiles.map(file => file.name) });
      console.log(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <div>
        <h3>Upload Files</h3>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload PDFs</button>
        {selectedFiles.length > 0 && (
          <div>
            <h4>Selected Files:</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <h3>Search Query</h3>
        <input type="text" placeholder="Enter your query" onChange={handleQueryChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default FileUploader;
