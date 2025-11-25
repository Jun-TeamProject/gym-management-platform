import React from "react";
import { Link, useLocation } from "react-router-dom";

const Item = ({ to, icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition 
        ${
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ open }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm transition-transform ${
        open ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="px-5 py-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M3 9h2v6H3V9zm16 0h2v6h-2V9zM7 7h2v10H7V7zm8 0h2v10h-2V7zM11 10h2v4h-2v-4z" />
            </svg>
          </div>
          <span className="font-extrabold text-gray-900">GYM PLATFORM</span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        <Item
          to="/"
          label="홈"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          }
        />
        <Item
          to="/myprofile"
          label="개인정보"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
            </svg>
          }
        />
        <Item
          to="/chat"
          label="실시간 상담"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 3h20v14H6l-4 4V3z" />
            </svg>
          }
        />
        <Item
          to="/reservations"
          label="PT 예약"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" />
            </svg>
          }
        />
        <Item
          to="/attendances"
          label="출석 관리"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4l-2-2-8 8-3-3-2 2zM2 20h20v2H2z" />
            </svg>
          }
        />
        <Item
          to="/community"
          label="커뮤니티"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16v12H5.17L4 17.17V4zM2 2v20l4-4h16V2H2z" />
            </svg>
          }
        />
        <Item
          to="/payments"
          label="결제 내역"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2zM2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10H2v8zm4-3h6v2H6v-2z" />
            </svg>
          }
        />
        <Item
          to="/branches"
          label="지점 소개"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          }
        />
        <Item
          to="/map"
          label="지도"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
          }
        />
      </nav>
    </aside>
  );
}
