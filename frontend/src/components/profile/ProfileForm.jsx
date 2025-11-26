import React, { useEffect, useRef, useState } from "react";
import profileService from "../../services/profileService";
import { BranchApi } from "../../services/BranchApi";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
const disabledInputClass = `${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`;
const primaryButtonClass =
  "px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:opacity-50";
const secondaryButtonClass =
  "px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition";

const formatGender = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  if (gender === "NONE") return "기타";
  return "미입력";
};

const ProfileForm = ({ profileData, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthdate: "",
    bio: "",
    branchId: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        username: profileData.username || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        fullName: profileData.fullName || "",
        gender: profileData.gender || "NONE",
        birthdate: profileData.birthdate || "",
        bio: profileData.bio || "",
        branchId: profileData.branchId || "",
      });
      if (profileData.profileImageUrl) {
        setImagePreview(`http://localhost:8080${profileData.profileImageUrl}`);
      }
    }
  }, [profileData]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await BranchApi.getAllBranches();
        setBranches(response.data);
      } catch (err) {
        console.error("지점 목록 조회 실패: ", err);
      }
    };
    if (isEditing) {
      fetchBranches();
    }
  }, [isEditing]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const updatedUser = await profileService.uploadAvatar(file);

      setImagePreview(`http://localhost:8080${updatedUser.profileImageUrl}`);
      onProfileUpdate(updatedUser);
      alert("프로필 이미지가 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      branchId: formData.branchId ? Number(formData.branchId) : null,
    };
    try {
      const updatedProfile = await profileService.updateMyProfile(dataToSend);
      onProfileUpdate(updatedProfile);
      alert("프로필이 저장되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert(
        "프로필 저장에 실패했습니다, 전화번호 형식에 맞게 작성해주세요: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={
                  imagePreview || "https://i.ibb.co/2YFvCqP/default-profile.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로필 이미지
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className={disabledInputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 (수정 불가)
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled //
              className={disabledInputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 (수정 불가)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled //
              className={disabledInputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소 {/*(DB에 'fullName'으로 저장됨)*/}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="서울특별시..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              등급
            </label>
            <select
              id="role-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="MEMBER">회원</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              생년월일
            </label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성별
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
              <option value="NONE">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지점
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              className={inputClass}
              // required
            >
              <option value="">-- 지점을 선택하세요 --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            자기소개
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="자기소개를 입력하세요..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className={secondaryButtonClass}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className={primaryButtonClass}
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
            <img
              src={
                imagePreview || "https://i.ibb.co/2YFvCqP/default-profile.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              이름
            </label>
            <p className="text-lg text-gray-900 p-2">{formData.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              이메일
            </label>
            <p className="text-lg text-gray-900 p-2">{formData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              전화번호
            </label>
            <p className="text-lg text-gray-900 p-2">
              {formData.phoneNumber || "미입력"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              주소
            </label>
            <p className="text-lg text-gray-900 p-2">
              {formData.fullName || "미입력"}
            </p>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-500">
              회원등급
            </label>
            <p className="text-lg text-gray-900 p-2">
              {formData.role || "미입력"}
            </p>
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              생년월일
            </label>
            <p className="text-lg text-gray-900 p-2">
              {formData.birthdate || "미입력"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              성별
            </label>
            <p className="text-lg text-gray-900 p-2">
              {formatGender(formData.gender) || "미입력"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              지점
            </label>
            <p className="text-lg text-gray-900 p-2">
              {profileData.branchName || "미입력"}
            </p>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500">
          자기소개
        </label>
        <p className="text-lg text-gray-900 p-2 whitespace-pre-line">
          {formData.bio || "미입력"}
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setIsEditing(true)}
          className={primaryButtonClass}
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
