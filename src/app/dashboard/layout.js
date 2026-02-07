"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Wallet,
  Heart,
  Settings,
} from "lucide-react";



export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

const isActive = (path) => pathname === path;

    // const searchParams = useSearchParams();
    // const activeCategory = searchParams.get("category");
  return (
    
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
<aside className="w-64 bg-slate-900 text-white flex flex-col">

  {/* TOP (fixed) */}
  <div className="p-4 shrink-0">
    <h1 className="text-2xl font-bold text-emerald-400 mb-1">
      AutoDoc
    </h1>
    <p className="text-sm text-slate-400 mb-6">
      Smart Document Manager
    </p>

    <button
  onClick={() => router.push("/dashboard")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded
    ${pathname === "/dashboard"
      ? "bg-emerald-600"
      : "hover:bg-slate-800"}`}
>
  <LayoutDashboard size={18} />
  Dashboard
</button>


  
<button
  onClick={() => router.push("/all-documents")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded
    ${isActive("/all-documents")
      ? "bg-emerald-600 text-white"
      : "hover:bg-slate-800 text-white"}
  `}
>
  <FileText size={18} />
  All Documents
</button>





  </div>

  {/* MIDDLE (scrollable ONLY) */}
  <div className="flex-1 overflow-y-auto px-2">
    <p className="mt-4 mb-2 text-xs text-slate-400 uppercase px-4">
      Categories
    </p>

   <button
  onClick={() => router.push("/all-documents?category=ID")}
  className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800"
>
  <FileText size={18} />
  ID
</button>

<button
  onClick={() => router.push("/all-documents?category=Education")}
  className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800"
>
  <GraduationCap size={18} />
  Education
</button>

<button
  onClick={() => router.push("/all-documents?category=Finance")}
  className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800"
>
  <Wallet size={18} />
  Finance
</button>

<button
  onClick={() => router.push("/all-documents?category=Medical")}
  className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800"
>
  <Heart size={18} />
  Medical
</button>

  </div>

  {/* BOTTOM (ALWAYS visible) */}
  <div className="p-4 border-t border-slate-700 shrink-0">
   <button
  onClick={async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  }}
  className="w-full flex items-center gap-3 px-4 py-2 rounded
             text-red-400 hover:bg-slate-800 hover:text-red-300"
>
  ⎋ Logout
</button>


  </div>

</aside>


      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
