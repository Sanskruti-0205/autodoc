"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UploadPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("ID");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !name) {
     toast.error("Please enter document name and choose a file");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Upload failed");
      setLoading(false);
      return;
    }

    await supabase.from("documents").insert({
      name,
      category,
      expiry_date: expiryDate || null,
      file_url: filePath,
      user_id: user.id,
    });

    setLoading(false);
   toast.success("Document uploaded successfully");

setTimeout(() => {
  router.push("/dashboard");
}, 1000);

  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">
          Upload Document
        </h1>
        <p className="text-gray-500 mb-6">
          Add a new document to AutoDoc
        </p>

        {/* DOCUMENT NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Document Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Passport, Insurance Policy"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ID">ID</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* EXPIRY DATE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Expiry Date (optional)
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Upload File
          </label>

          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
            <span className="text-4xl mb-2">📄</span>
            <span className="text-sm text-gray-600">
              {file ? file.name : "Click to browse files"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-emerald-600 hover:underline text-sm"

          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg 
           hover:bg-emerald-700 transition"

          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
