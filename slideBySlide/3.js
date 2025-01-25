// MODEL LOADING

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    tf.loadGraphModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    )
      .then(model => {
        setModel(model);
        setLoading(false);
      })
      .catch(error => {
        console.error('Model load failed:', error);
        setLoading(false);
      });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Image Classifier</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading && <div className="text-center mb-4">Loading AI model...</div>}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 mb-4
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {image && (
            <img 
              src={image} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}