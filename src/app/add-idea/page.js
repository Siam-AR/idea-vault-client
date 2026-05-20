export const metadata = {
  title: "Add Idea - IdeaVault",
  description: "Share your startup idea with the community",
};

export default function AddIdeaPage() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Share Your Idea</h1>
        <p className="text-lg text-gray-600">
          Submit your innovative startup idea to our community
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <form className="space-y-6">
          {/* Form fields will be implemented here */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title
            </label>
            <input
              type="text"
              placeholder="Enter your idea title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              placeholder="Brief description of your idea"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" disabled>
              <option>Select a category</option>
              <option>Tech</option>
              <option>Health</option>
              <option>AI</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            disabled
          >
            Submit Idea
          </button>
        </form>
      </div>
    </div>
  );
}
