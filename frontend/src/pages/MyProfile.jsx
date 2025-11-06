
import React, { useState, useEffect } from "react"; 
import ProfileForm from "../components/profile/ProfileForm";
import MembershipInfo from "../components/profile/MembershipInfo";
import profileService from "../services/profileService"; 

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getMyProfile() 
      .then(setProfile)
      .catch((err) => {
        console.error("프로필 정보 조회 실패:", err);
      })
      .finally(() => setLoading(false));
  }, []); 

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          내 프로필
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">프로필 정보를 불러오는 중...</p>
        ) : profile ? (
          <div className="space-y-8">
            <div className="membership-status p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">이용권 정보</h3>
              <MembershipInfo memberships={profile.memberships} /> 
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">개인 정보 수정</h3>
              <ProfileForm profileData={profile}
              onProfileUpdate={handleProfileUpdate} /> 
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">프로필 정보를 불러오는 데 실패했습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyProfile;