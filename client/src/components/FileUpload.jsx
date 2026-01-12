import React, { useState } from "react";
import toast from "react-hot-toast";
import { uploadService } from "../services/api";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [uploadType, setUploadType] = useState("file");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append(uploadType, file);
    if (tags) {
      formData.append("tags", tags);
    }

    try {
      let response;
      switch (uploadType) {
        case "image":
          response = await uploadService.uploadImage(formData);
          break;
        case "video":
          response = await uploadService.uploadVideo(formData);
          break;
        default:
          response = await uploadService.uploadFile(formData);
      }

      if (response.data.success) {
        toast.success("File uploaded successfully! Email sent.");
        setFile(null);
        setTags("");
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Type
        </label>
        <div className="flex space-x-4">
          {["file", "image", "video"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUploadType(type)}
              className={`px-4 py-2 rounded-md capitalize ${
                uploadType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., work, personal, project"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      <p className="text-xs text-gray-500">
        Supported: All files (max 50MB), Images, Videos
      </p>
    </form>
  );
};

export default FileUpload;
