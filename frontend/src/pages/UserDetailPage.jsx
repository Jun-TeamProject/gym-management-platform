import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { AdminApi } from "../services/AdminApi";
import MembershipInfo from "../components/profile/MembershipInfo";

const ProfileDetailView = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            이름
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.username || "미입력"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            이메일
          </label>
          <p className="text-lg text-gray-900 p-2">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            주소
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.fullName || "미입력"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            전화번호
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.phoneNumber || "미입력"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            생년월일
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.birthdate || "미입력"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            성별
          </label>
          <p className="text-lg text-gray-900 p-2">{user.gender || "미입력"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            지점
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.branchName || "미입력"}
          </p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500">
          자기소개
        </label>
        <p className="text-lg text-gray-900 p-2 whitespace-pre-line">
          {user.bio || "내용없음"}
        </p>
      </div>
    </div>
  );
};

function UserDetailPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const previousPath = location.state?.from;//이전 url
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await AdminApi.getUserById(userId);
        setProfile(response.data);
      } catch (err) {
        console.error(" ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);
  const handleGoBack = () => {
    navigate(-1);
};
  return (
    <div className="bg-white w-full max-w-4xl mx-auto rounded-2xl shadow-md p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {profile ? `${profile.username} ` : " "}
        </h1>
        {/* <Link
          to="/admin/users"
          className="px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
        >
          ←
        </Link> */}
        <button className="px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition" onClick={handleGoBack}>
        ←
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600"> ...</p>
      ) : profile ? (
        <div className="space-y-8">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3"> </h3>
            {previousPath === '/a' && (
                <MembershipInfo memberships={profile.memberships} />
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-3"> </h3>
            <ProfileDetailView user={profile} />
          </div>
        </div>
      ) : (
        <p className="text-center text-red-600"> .</p>
      )}
    </div>
  );
}

export default UserDetailPage;
