"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/* ---------- HELPERS ---------- */

function isExpiringSoon(expiryDate) {
  if (!expiryDate) return false;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffDays =
    (expiry - today) / (1000 * 60 * 60 * 24);

  return diffDays <= 7 && diffDays >= 0;
}

function categoryColor(category) {
  switch (category) {
    case "ID":
      return "bg-green-100 text-green-700";
    case "Education":
      return "bg-blue-100 text-blue-700";
    case "Finance":
      return "bg-orange-100 text-orange-700";
    case "Medical":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* ---------- PAGE ---------- */

export default function AllDocumentsPage() {
    const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const router = useRouter();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("grid"); // grid | list
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
  const handleClickOutside = () => {
    setOpenMenuId(null);
  };

 document.addEventListener("mousedown", handleClickOutside);


  return () => {
    document.removeEventListener("mousedown", handleClickOutside);

  };
}, []);

    // ===== STEP 1: ACTION HANDLERS =====

  const viewDoc = async (doc) => {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_url, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const deleteDoc = async (doc) => {
    if (!confirm("Delete this document?")) return;

    await supabase.storage
      .from("documents")
      .remove([doc.file_url]);

    await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);

    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
  };

  useEffect(() => {
  if (categoryFromUrl) {
    setCategory(categoryFromUrl);
  }
}, [categoryFromUrl]);

  useEffect(() => {
    const loadDocs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setDocs(data);
      setLoading(false);
    };

    loadDocs();
  }, [router]);

  /* ---------- FILTER + SORT ---------- */

  const filteredDocs = docs.filter((doc) => {
  const matchesSearch = doc.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategoryFromSidebar =
    !categoryFromUrl || doc.category === categoryFromUrl;

  const matchesCategoryFromDropdown =
    category === "all" || doc.category === category;

  return (
    matchesSearch &&
    matchesCategoryFromSidebar &&
    matchesCategoryFromDropdown
  );
});



  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

{/* BREADCRUMB */}
<div className="text-sm text-gray-500 mb-3">
  <span
    onClick={() => router.push("/dashboard")}
    className="cursor-pointer hover:underline"
  >
    Dashboard
  </span>

  {categoryFromUrl && (
    <>
      <span className="mx-2">›</span>
      <span className="font-medium text-gray-700">
        {categoryFromUrl}
      </span>
    </>
  )}
</div>


        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-1">
  {categoryFromUrl ? `${categoryFromUrl} Documents` : "All Documents"}
</h1>

        <p className="text-gray-500 mb-6">
  {filteredDocs.length} documents found
</p>


        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">

          {/* Search */}
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-72"
          />

          <div className="flex gap-3 items-center">

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="ID">ID</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Medical">Medical</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="recent">Most Recent</option>
              <option value="old">Oldest</option>
            </select>

            {/* View toggle */}
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded ${
                view === "grid"
                  ? "bg-emerald-600 text-white"
                  : "border"
              }`}
            >
              ⬛
            </button>

            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded ${
                view === "list"
                  ? "bg-emerald-600 text-white"
                  : "border"
              }`}
            >
              ☰
            </button>

          </div>
        </div>

        {/* DOCUMENTS */}
        {sortedDocs.length === 0 ? (
          <p className="text-gray-500">
            No documents found.
          </p>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedDocs.map((doc) => (
              <div
  key={doc.id}
 className="bg-white border rounded-2xl p-5 shadow-sm 
           hover:shadow-md hover:border-emerald-300 
           transition cursor-pointer"

>
  {/* Top */}
  <div className="flex justify-between items-start">
    <span
      className={`text-xs px-3 py-1 rounded-full ${categoryColor(
        doc.category
      )}`}
    >
      {doc.category}
    </span>
  </div>

  {/* Icon */}
  <div className="flex justify-center py-6 text-4xl text-gray-400">
    📄
  </div>

  {/* Name */}
  <h3 className="font-semibold text-lg mb-1">
    {doc.name}
  </h3>

  {/* Date */}
  <p className="text-sm text-gray-500 mb-4">
    📅 Uploaded{" "}
    {new Date(doc.created_at).toLocaleDateString()}
  </p>

  {/* ACTION MENU */}
<div className="relative flex justify-end pt-3 border-t">
  <button
  onClick={(e) => {
    e.stopPropagation(); // 🔑 THIS LINE FIXES IT
    setOpenMenuId(openMenuId === doc.id ? null : doc.id);
  }}
  className="text-gray-500 hover:text-gray-700 text-xl"
>
  ⋮
</button>


  {openMenuId === doc.id && (
  <div
    onClick={(e) => e.stopPropagation()}
    className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10"
  >
<button
  onMouseDown={(e) => {
    e.stopPropagation();
    viewDoc(doc);
    setOpenMenuId(null);
  }}
  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
  View
</button>

<button
  onMouseDown={(e) => {
    e.stopPropagation();
    deleteDoc(doc);
    setOpenMenuId(null);
  }}
  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
  Delete
</button>

    </div>
  )}
</div>
</div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
