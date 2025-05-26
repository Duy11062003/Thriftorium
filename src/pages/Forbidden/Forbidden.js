// src/pages/Forbidden.js
import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <p className="text-xl mb-6">
        Forbidden: You don’t have permission to view this page.
      </p>
      <Link to="/" className="text-blue-500 underline">
        ← Go back home
      </Link>
    </div>
  );
}
