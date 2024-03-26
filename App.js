import React, { useState } from 'react';
import axios from 'axios';
import image from './logo.jpg'
function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

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
      formData.append('pdfFiles', file, file.name);
    });
    console.log(formData); 

    try {
      const response = await axios.post('http://localhost:5001/uploadFiles', formData, {
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
      const response = await axios.post('http://localhost:5001/search', { query, file_paths: selectedFiles.map(file => file.name) });
      console.log('Response from server:', response);
      console.log(response.data);
      const result = response.data.result || []; // Check if result is undefined and provide an empty array
      setSearchResult(result);
      console.log('Search Result Length:', result.length);
  
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="App" style={{backgroundImage: './stock-analysis--800467307.png', backgroundSize: 'cover', height: '100vh', textAlign: 'center' }}>
      <h1 style={{ textAlign: 'center' , color:'blue', fontSize: '40px'}}>PDF Search App</h1>
      <img
       src={image}
      style={{ width: '300px', height: 'auto', borderRadius: '20px', border: '10px solid #3f00ff', display: 'inline-block', margin: '0 auto'}} />
      <div>
        <h2>Upload PDF Files</h2>
        <input type="file" multiple onChange={handleFileChange} style={{ fontSize: '20px', color:'#00008B',width: '50%', padding: '10px', border: '2px solid #436eee', marginBottom: '10px', borderRadius: '4px' }} />
        <button onClick={handleFileUpload} style={{ marginTop:'20px',background: '#007bff', color: '#fff', padding: '5px', borderRadius: '2px', width: '50%', cursor: 'pointer' }}>Upload PDFs</button>
        {selectedFiles.length > 0 && (
          <div>
            <h3>Selected Files:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <h2>Search</h2>
        <input type="text" placeholder="Enter your query" onChange={handleQueryChange} style={{ fontSize: '20px', color:'#00008B',width: '50%', padding: '10px', border: '2px solid #436eee', marginBottom: '10px', borderRadius: '4px' }}/>
        <button onClick={handleSearch} style={{ marginTop:'20px',background: '#007bff', color: '#fff', padding: '5px', borderRadius: '2px', width: '50%', cursor: 'pointer' }}>Search</button>
        {searchResult.length > 0 && (
          <div>
            <h3>Search Result:</h3>
            <ul>
              {searchResult.map((result, index) => (
                <li key={index}style={ {color: 'blue',fontWeight:'bold',
                fontSize: '20px',
                lineHeight: '1.5'}}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
