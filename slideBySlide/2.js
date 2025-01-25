// IMAGE PREVIEW

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);

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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 mb-4"
          />
          
          {image && (
            <img 
              src={image} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}