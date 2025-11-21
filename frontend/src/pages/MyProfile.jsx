import React, { useState, useEffect } from "react";
import ProfileForm from "../components/profile/ProfileForm";
import MembershipInfo from "../components/profile/MembershipInfo";
import profileService from "../services/profileService";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth";
import useAuthStore from "../stores/authStore";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const navigate = useNavigate();

  const currentUser = authService.getCurrentUser();
  const isSocialUser = currentUser?.provider && currentUser.provider !== "LOCAL";
  const logout = useAuthStore((state) => state.logout);

  const handleWithdraw = async () => {
    if (!isSocialUser && !withdrawPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      await authService.withdraw(withdrawPassword);
      alert("회원 탈퇴가 완료되었습니다.");
      logout();
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "탈퇴 처리에 실패했습니다.");
    }
  };

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

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawPassword("");
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

            <div className="mt-12 border-t pt-6">
              <h3 className="text-lg font-bold text-red-600 mb-2">회원 탈퇴</h3>
              <p className="text-sm text-gray-600 mb-4">
                탈퇴 시 계정은 즉시 비활성화되며, 복구할 수 없습니다.
              </p>

              {currentUser?.role === "ADMIN" ? (
                <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded inline-block">
                  관리자 계정은 탈퇴할 수 없습니다.
                </p>
              ) : (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                >
                  회원 탈퇴
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">프로필 정보를 불러오는 데 실패했습니다.</p>
        )}
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">회원 탈퇴 확인</h3>

            {!isSocialUser && (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
            )}

            <p className="text-sm text-gray-500 mb-6">
              정말로 탈퇴하시겠습니까? <br />
              탈퇴 후에는 데이터를 복구할 수 없습니다.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeWithdrawModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;