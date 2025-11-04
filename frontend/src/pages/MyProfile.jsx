import React from "react";
import ProfileForm from "../components/profile/ProfileForm";

function MyProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          내 프로필
        </h1>
        <ProfileForm />
      </div>
    </div>
  );
}

export default MyProfile;
