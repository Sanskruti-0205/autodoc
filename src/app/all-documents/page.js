import { Suspense } from "react";
import AllDocumentsClient from "./client";

export default function AllDocumentsPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading documents...</p>}>
      <AllDocumentsClient />
    </Suspense>
  );
}
