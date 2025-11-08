import React from "react";

export default function VerifyBadge({ verified }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full
        ${verified
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
        }`}
    >
      {verified ? (
        <>
          <svg
            className="w-4 h-4 mr-1 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Verified
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-1 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Not Verified
        </>
      )}
    </span>
  );
}
