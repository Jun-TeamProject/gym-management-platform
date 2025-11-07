import React from "react";

export default function HamburgerButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="사이드바 열기/닫기"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
      </svg>
    </button>
  );
}
