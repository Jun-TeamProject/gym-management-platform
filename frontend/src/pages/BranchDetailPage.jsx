import { BranchApi } from "../services/BranchApi";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const TrainerCard = ({ trainer }) => {
  const imageUrl = trainer.profileImageUrl
    ? `http://localhost:8080${trainer.profileImageUrl}`
    : "/images/trainer1.webp";
  // console.log(imageUrl);
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white">
      <img
        src={imageUrl}
        alt={trainer.username}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900">{trainer.username}</h4>
        <p className="text-sm text-gray-600">{trainer.email}</p>
        <p className="text-sm text-gray-500 mt-2"> {trainer.bio || "미입력"}</p>
      </div>
    </div>
  );
};

const FacilityImageGrid = ({ images, isAdmin, onDelete }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {images && images.length > 0 ? (
      images.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={`http://localhost:8080${url}`}
            alt={`시설 이미지 ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg border"
          />
          {isAdmin && (
            <button
              onClick={() => onDelete(url)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="이미지 삭제"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 000 16zm8.7 8l-1.4 1.4L10 11.4l-1.13 1.3L10 14L1.4-1.4L12.7 11.3 14 10l-1.3-1.3L11.4 10 10 8.7z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500 col-span-full">
        등록된 시설 이미지가 없습니다.
      </p>
    )}
  </div>
);

const BranchDetailPage = () => {
  const { id: branchId } = useParams();
  const [branchDetails, setBranchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await BranchApi.getBranchDetails(branchId);
      setBranchDetails(response.data);
    } catch (error) {
      console.error("지점 상세정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [branchId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await BranchApi.addFacilityImage(branchId, file);
      alert("시설 이미지가 업로드되었습니다.");
      fetchDetails();
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  };

  const handleImageDelete = async (imageUrl) => {
    if (!window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) return;
    try {
      await BranchApi.deleteFacilityImage(branchId, imageUrl);
      alert("이미지가 삭제되었습니다.");
      fetchDetails();
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
    }
  };

  if (loading)
    return <div className="text-center p-10">지점 정보 불러오는 중...</div>;

  if (!branchDetails)
    return (
      <div className="text-center p-10">지점 정보를 불러올 수 없습니다.</div>
    );

  const { branchName, location, phone, trainers, facilityImageUrls } =
    branchDetails;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {branchName}
            </h1>
            <p className="text-lg to-gray-600 mt-2">📍 {location}</p>
            <p className="text-lg to-gray-600 mt-1">📞 {phone}</p>
          </div>
          {isAdmin === "ADMIN" && (
            <Link
              to="/admin/branches"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition text-white bg-blue-600 hover:bg-blue-700"
            >
              ← 지점 관리로 돌아가기
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          💪 트레이너 소개
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers && trainers.length > 0 ? (
            trainers.map((t) => <TrainerCard key={t.id} trainer={t} />)
          ) : (
            <p className="text-gray-500 col-span-full">
              등록된 트레이너가 없습니다.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🏋️ 시설 이미지</h2>
          {isAdmin && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        </div>
        <FacilityImageGrid
          images={facilityImageUrls}
          isAdmin={isAdmin}
          onDelete={handleImageDelete}
        />
      </div>
    </div>
  );
};

export default BranchDetailPage;
