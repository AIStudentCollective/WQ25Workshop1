// BASIC UI LAYOUT

export default function Home() {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            AI Image Classifier
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500"
            />
          </div>
        </div>
      </div>
    );
  }