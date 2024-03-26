import React, { useState, useEffect } from 'react';

const Answer = ({ output }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    if (result) {
      // Assuming the output is a string; modify this part based on the actual structure of your output
      setResult(result);
    }
  }, [output]);

  return (
    <div>
      <h2>ANSWER OF THE QUERY:</h2>
      <p>{result}</p>
    </div>
  );
};

export default Answer;