// CLASSIFICATION LOGIC

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
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

  const classifyImage = async () => {
    if (!model || !image) return;

    try {
      setLoading(true);
      const img = new Image();
      img.src = image;
      await img.decode();

      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();

      const predictions = model.predict(tensor);
      const values = await predictions.data();
      const softmax = tf.softmax(values);
      const probabilities = await softmax.data();
      
      const results = Array.from(probabilities)
        .map((prob, index) => ({
          label: `Class ${index}`,
          probability: prob * 100,
          classIndex: index
        }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);

      setPredictions(results);
      softmax.dispose();
      tensor.dispose();
    } catch (error) {
      console.error('Classification error:', error);
    } finally {
      setLoading(false);
    }
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
            <div className="mb-4">
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              <button
                onClick={classifyImage}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded 
                  hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Classifying...' : 'Classify Image'}
              </button>
            </div>
          )}
          
          {predictions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Predictions:</h2>
              <ul className="space-y-2">
                {predictions.map(({ label, probability, classIndex }) => (
                  <li 
                    key={classIndex}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-blue-600">{probability.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

