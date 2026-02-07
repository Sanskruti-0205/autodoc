// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// function isExpiringSoon(expiryDate) {
//   if (!expiryDate) return false;

//   const today = new Date();
//   const expiry = new Date(expiryDate);
//   const diffTime = expiry - today;
//   const diffDays = diffTime / (1000 * 60 * 60 * 24);

//   return diffDays <= 7 && diffDays >= 0;
// }

// const categoryStats = (docs) => {
//   const total = docs.length;

//   const categories = {
//     ID: 0,
//     Education: 0,
//     Finance: 0,
//     Medical: 0,
//     Other: 0,
//   };

//   docs.forEach((doc) => {
//     if (categories[doc.category] !== undefined) {
//       categories[doc.category]++;
//     } else {
//       categories.Other++;
//     }
//   });

//   return Object.entries(categories).map(
//     ([name, count]) => ({
//       name,
//       count,
//       percentage: total
//         ? Math.round((count / total) * 100)
//         : 0,
//     })
//   );
// };


// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [docs, setDocs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
// const [categoryFilter, setCategoryFilter] = useState("all");


//   useEffect(() => {
//     const loadData = async () => {
//       const { data: userData } = await supabase.auth.getUser();

//       if (!userData?.user) {
//         router.push("/login");
//         return;
//       }

//       setUser(userData.user);

//       const { data, error } = await supabase
//         .from("documents")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (!error) {
//         setDocs(data);
//       }

//       setLoading(false);
//     };

//     loadData();
//   }, [router]);

//   const filteredDocs = docs.filter((doc) => {
//   const matchesSearch = doc.name
//     .toLowerCase()
//     .includes(search.toLowerCase());

//   const matchesCategory =
//     categoryFilter === "all" ||
//     doc.category === categoryFilter;

//   return matchesSearch && matchesCategory;
// });

// const expiringSoonDocs = filteredDocs.filter(doc =>
//   isExpiringSoon(doc.expiry_date)
// );

// const normalDocs = filteredDocs.filter(doc =>
//   !isExpiringSoon(doc.expiry_date)
// );


//   const deleteDoc = async (doc) => {
//     await supabase.storage
//       .from("documents")
//       .remove([doc.file_url]);

//     await supabase
//       .from("documents")
//       .delete()
//       .eq("id", doc.id);

//     setDocs(docs.filter((d) => d.id !== doc.id));
//   };

//   // Dashboard stats (derived values)
// const totalDocs = docs.length;

// const totalCategories = new Set(
//   docs.map((doc) => doc.category)
// ).size;

// const expiringCount = expiringSoonDocs.length;

// const lastUpdated = docs.length > 0 ? docs[0].created_at : null;


//   if (loading) return <p>Loading...</p>;

// // AI Smart Categorization stats
// const aiStats = categoryStats(docs);

//   return (
  
//   <div className="min-h-screen bg-gray-50 p-6">
//     <div className="max-w-5xl mx-auto">
      
//       <h1 className="text-3xl font-bold text-blue-600 mb-1">
//         Dashboard
//       </h1>
//       <p className="text-gray-600 mb-6">
//         Welcome, {user.email}
//       </p>

//       {/* STATS CARDS */}
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-10">

//   {/* Total Documents */}
//   <div className="bg-white p-5 rounded-xl border shadow-sm">
//     <p className="text-sm text-gray-500">Total Documents</p>
//     <h2 className="text-3xl font-bold mt-2">{totalDocs}</h2>
//   </div>

//   {/* Categories */}
//   <div className="bg-white p-5 rounded-xl border shadow-sm">
//     <p className="text-sm text-gray-500">Categories</p>
//     <h2 className="text-3xl font-bold mt-2">{totalCategories}</h2>
//   </div>

//   {/* Expiring Soon */}
//   <div className="bg-white p-5 rounded-xl border shadow-sm">
//     <p className="text-sm text-gray-500">Expiring Soon</p>
//     <h2 className="text-3xl font-bold mt-2 text-red-600">
//       {expiringCount}
//     </h2>
//   </div>

//   {/* Last Updated */}
//   <div className="bg-white p-5 rounded-xl border shadow-sm">
//     <p className="text-sm text-gray-500">Last Updated</p>
//     <h2 className="text-lg font-semibold mt-3">
//       {lastUpdated
//         ? new Date(lastUpdated).toLocaleDateString()
//         : "—"}
//     </h2>
//   </div>

// </div>

// {/* QUICK UPLOAD + AI SMART CATEGORIZATION */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

//   {/* Quick Upload */}
//   {/* Quick Upload */}
// <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">

//   <div>
//     <div className="flex items-center gap-3 mb-3">
//       <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
//         ⬆️
//       </div>
//       <h3 className="text-xl font-semibold">
//         Quick Upload
//       </h3>
//     </div>

//     <p className="text-gray-500 text-sm mb-6">
//       Upload and organize your documents in seconds
//     </p>

//     {/* Dropzone style box */}
//     <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 mb-6">
//       <p className="text-sm">
//         Drag & drop files here
//       </p>
//       <p className="text-xs mt-1">
//         or click the button below
//       </p>
//     </div>
//   </div>

//   <button
//     onClick={() => router.push("/upload")}
//     className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
//   >
//     Upload Document
//   </button>
// </div>

//   {/* RIGHT: AI SMART CATEGORIZATION */}
//   {/* AI SMART CATEGORIZATION */}
// <div className="bg-white border rounded-xl p-6 shadow-sm">
//   <h3 className="text-xl font-semibold mb-4">
//     AI Smart Categorization
//   </h3>

//   <div className="space-y-4">
//     {aiStats.map((cat) => (
//       <div key={cat.name}>
//         <div className="flex justify-between text-sm mb-1">
//           <span>{cat.name}</span>
//           <span className="font-medium text-emerald-600">
//             {cat.percentage}%
//           </span>
//         </div>

//         <div className="h-2 bg-gray-200 rounded">
//           <div
//             className="h-2 bg-emerald-500 rounded"
//             style={{ width: `${cat.percentage}%` }}
//           />
//         </div>
//       </div>
//     ))}
//   </div>

//   <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
//     💡 Categorization accuracy improves as you upload more documents.
//   </div>
// </div>
// </div>

// {/* RECENT DOCUMENTS */}
// <div className="bg-white border rounded-xl p-6 shadow-sm">
//   <h3 className="text-xl font-semibold mb-4">
//     Recent Documents
//   </h3>

//   {docs.length === 0 ? (
//     /* EMPTY STATE */
//     <div className="text-center text-gray-500 py-6">
//       <p className="font-medium">No documents yet</p>
//       <p className="text-sm mt-1">
//         Upload your first document to get started
//       </p>

//       <button
//         onClick={() => router.push("/upload")}
//         className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
//       >
//         Upload Document
//       </button>
//     </div>
//   ) : (
//     <>
//       {/* DOCUMENT LIST */}
//       <div className="space-y-3">
//         {docs.slice(0, 3).map((doc) => (
//           <div
//             key={doc.id}
//             className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50 transition"
//           >
//             <div>
//               <p className="font-medium">{doc.name}</p>
//               <p className="text-sm text-gray-500">
//                 {doc.category}
//               </p>
//             </div>

//             <span className="text-xs text-gray-400">
//               {new Date(doc.created_at).toLocaleDateString()}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* VIEW ALL BUTTON */}
//       <div className="mt-4 text-right">
//         <button
//           onClick={() => router.push("/all-documents")}
//           className="text-emerald-600 text-sm hover:underline"
//         >
//           View all documents →
//         </button>
//       </div>
//     </>
//   )}
// </div>



// {/* PRIORITY ALERTS */}
// <div className="mb-12">
//   <div className="bg-white border rounded-xl p-6 shadow-sm">
//     <h3 className="text-xl font-semibold mb-4 text-red-600">
//       ⚠ Priority Alerts
//     </h3>

//     {expiringSoonDocs.length === 0 ? (
//       <p className="text-gray-500">
//         No documents expiring soon 🎉
//       </p>
//     ) : (
//       <div className="space-y-4">
//         {expiringSoonDocs.map((doc) => (
//           <div
//             key={doc.id}
//             className="flex justify-between items-center p-4 border rounded-lg bg-red-50"
//           >
//             <div>
//               <h4 className="font-semibold">
//                 {doc.name}
//               </h4>
//               <p className="text-sm text-red-600">
//                 Expires on {doc.expiry_date}
//               </p>
//             </div>

//             <span className="text-xs px-3 py-1 rounded bg-red-100 text-red-700">
//               {doc.category}
//             </span>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </div>

//       {expiringSoonDocs.length > 0 && (
//         <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded">
//           <h2 className="font-semibold text-red-600 mb-2">
//             ⚠ Expiring Soon
//           </h2>
//           <ul className="space-y-1">
//             {expiringSoonDocs.map((doc) => (
//               <li key={doc.id}>
//                 <strong>{doc.name}</strong>{" "}
//                 <span className="text-red-600">
//                   — expires on {doc.expiry_date}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//     </div>
//   </div>
// );

// }


import { Suspense } from "react";
import DashboardClient from "./client";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading dashboard...</p>}>
      <DashboardClient />
    </Suspense>
  );
}
