// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FileList from "../components/FileList";
import FileUpload from "../components/FileUpload";
import { authService, uploadService } from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Simple token validation
    if (!token || token.split(".").length !== 3) {
      localStorage.clear();
      toast.error("Invalid token. Please login again.");
      navigate("/login");
      return;
    }

    fetchUserData();
    fetchFiles();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await authService.getProfile();
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await uploadService.getFiles();
      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteFile = async (id) => {
    try {
      await uploadService.deleteFile(id);
      setFiles(files.filter((file) => file._id !== id));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Error deleting file: " + (error.message || "Unknown error"));
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles(); // Refresh files list after upload
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 font-extrabold">
                Storagify
              </h1>
              <p className="text-center text-sm font-extralight">
                File uploading web app
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-gray-700 font-extralight">
                  Welcome, {user.username}!
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium font-extralight text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* File Upload Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>

        {/* File List Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Your Files{" "}
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-blue-500 p-1 text-sm font-extrabold text-white rounded-full">
                {files.length}
              </span>
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600">Loading files...</p>
              </div>
            ) : (
              <FileList files={files} onDelete={handleDeleteFile} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
