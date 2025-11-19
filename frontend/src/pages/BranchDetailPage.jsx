import { BranchApi } from "../services/BranchApi";
import React, { useEffect, useRef, useState } from "react";
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
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const branchMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const centerUserRef = useRef(false);

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

  // init kakao map for branch when branchDetails available
  useEffect(() => {
    if (!branchDetails) return;
    const KAKAO_KEY =
      (typeof import.meta !== "undefined" &&
        import.meta.env?.VITE_KAKAO_MAP_KEY) ||
      process.env.REACT_APP_KAKAO_API_KEY;
    if (!KAKAO_KEY) {
      console.warn("Kakao API key not set");
      return;
    }

    const src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
    const existing = document.querySelector("script[data-kakao-sdk]");
    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.setAttribute("data-kakao-sdk", "true");
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });

    (async () => {
      try {
        if (!existing) await loadScript();
        window.kakao.maps.load(async () => {
          geocoderRef.current = new window.kakao.maps.services.Geocoder();
          const container = document.getElementById("branch-map");
          if (!container) return;
          mapRef.current = new window.kakao.maps.Map(container, {
            center: new window.kakao.maps.LatLng(37.566535, 126.9779692),
            level: 4,
          });
          // geocode branch address and place marker
          geocoderRef.current.addressSearch(
            branchDetails.location || "",
            (result, status) => {
              if (
                status === window.kakao.maps.services.Status.OK &&
                result &&
                result[0]
              ) {
                const { y, x } = result[0];
                const pos = new window.kakao.maps.LatLng(Number(y), Number(x));
                mapRef.current.setCenter(pos);
                if (branchMarkerRef.current)
                  branchMarkerRef.current.setMap(null);
                branchMarkerRef.current = new window.kakao.maps.Marker({
                  map: mapRef.current,
                  position: pos,
                });
                // removed optional center-on-user logic
              } else {
                console.warn("branch geocode failed", status);
              }
            }
          );
          // try to show user location marker (initial, non-blocking)
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (p) => {
                const userPos = new window.kakao.maps.LatLng(
                  p.coords.latitude,
                  p.coords.longitude
                );
                userMarkerRef.current = new window.kakao.maps.Marker({
                  map: mapRef.current,
                  position: userPos,
                  image: new window.kakao.maps.MarkerImage(
                    `data:image/svg+xml;utf8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><circle cx="11" cy="11" r="9" fill="#2563eb" stroke="#fff" stroke-width="2"/></svg>`
                    )}`
                  ),
                });
              },
              (err) => {
                // ignore
              },
              { enableHighAccuracy: true, timeout: 5000 }
            );
          }
        });
      } catch (e) {
        console.error("Failed to init Kakao map in BranchDetailPage", e);
      }
    })();

    return () => {
      if (branchMarkerRef.current) branchMarkerRef.current.setMap(null);
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  }, [branchDetails]);

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

      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📍 위치 및 길찾기
        </h2>
        <div
          id="branch-map"
          style={{ width: "100%", height: 600 }}
          className="rounded-lg overflow-hidden border"
        />
        <div className="mt-3 flex gap-2">
          {/* 내 위치 버튼 제거 */}

          <button
            onClick={() => {
              if (!branchMarkerRef.current) {
                alert("지점 좌표를 찾는 중입니다.");
                centerUserRef.current = true;
                return;
              }

              const endPos = branchMarkerRef.current.getPosition();
              const eLat = Number(endPos.getLat());
              const eLng = Number(endPos.getLng());
              const name = branchName || branchDetails.location || "목적지";

              if (Number.isFinite(eLat) && Number.isFinite(eLng)) {
                // open Kakao map 'to' page for the destination (Kakao will show and allow route)
                const toUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
                  name
                )},${eLat},${eLng}`;
                window.open(toUrl, "_blank");
                return;
              }

              // fallback: search by address or name
              const q = encodeURIComponent(
                branchDetails.location || branchName || ""
              );
              const searchUrl = `https://map.kakao.com/search/${q}`;
              window.open(searchUrl, "_blank");
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            길찾기 (카카오맵)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailPage;
