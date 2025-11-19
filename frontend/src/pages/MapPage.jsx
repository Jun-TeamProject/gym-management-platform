import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BranchApi } from "../services/BranchApi";

/**
 * MapPage - Kakao Maps
 * - REACT_APP_KAKAO_API_KEY (JavaScript key) 필요 (환경변수 또는 .env)
 * - BranchApi.getBranches() 를 호출하여 지점 목록을 받아 위치(주소)로 geocode 후 마커 표시
 */

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const overlaysRef = useRef([]);
  const geocoderRef = useRef(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const DEFAULT_CENTER = { lat: 37.566535, lng: 126.9779692 };

  useEffect(() => {
    const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!KAKAO_KEY) {
      console.error("REACT_APP_KAKAO_API_KEY is not set");
      setLoading(false);
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
          mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
            center: new window.kakao.maps.LatLng(
              DEFAULT_CENTER.lat,
              DEFAULT_CENTER.lng
            ),
            level: 4,
          });
          await fetchAndRenderBranches();
          getUserLocation();
          setLoading(false);
        });
      } catch (err) {
        console.error("Kakao Maps load failed", err);
        setLoading(false);
      }
    })();

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      overlaysRef.current.forEach((o) => o.setMap(null));
      markersRef.current = [];
      overlaysRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch branch list and geocode addresses
  const fetchAndRenderBranches = async () => {
    try {
      const res = await BranchApi.getAllBranches(); // BranchApi.getAllBranches() 반환 { data: [ { id, branchName, location, phone, ... } ] }
      const list = res.data ?? [];
      setBranches(list);

      const geocoded = [];
      for (const b of list) {
        const pos = await geocodeAddress(b.location);
        if (pos) geocoded.push({ branch: b, pos });
      }

      clearMarkersAndOverlays();
      geocoded.forEach(({ branch, pos }) => createMarker(branch, pos));
    } catch (e) {
      console.error("Failed to load branches", e);
    }
  };

  const geocodeAddress = (address) =>
    new Promise((resolve) => {
      if (!geocoderRef.current) return resolve(null);
      geocoderRef.current.addressSearch(address || "", (result, status) => {
        if (
          status === window.kakao.maps.services.Status.OK &&
          result &&
          result[0]
        ) {
          const { y, x } = result[0];
          resolve({ lat: Number(y), lng: Number(x) });
        } else {
          resolve(null);
        }
      });
    });

  const createMarker = (branch, { lat, lng }) => {
    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;
    const position = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({ position, map: mapRef.current });

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "bg-white p-3 rounded-lg shadow-lg border text-sm";
    overlayDiv.style.minWidth = "220px";
    overlayDiv.style.fontFamily = "inherit";
    overlayDiv.innerHTML = `
      <div class="font-semibold text-gray-800">${escapeHtml(
        branch.branchName
      )}</div>
      <div class="text-xs text-gray-600 mt-1">${escapeHtml(
        branch.location || "-"
      )}</div>
      <div class="text-xs text-gray-600 mt-1">📞 ${escapeHtml(
        branch.phone || "-"
      )}</div>
      <div class="mt-3 flex gap-2 justify-end">
        <button data-action="detail" class="px-3 py-1 rounded text-sm bg-blue-600 text-white">상세보기</button>
        <button data-action="close" class="px-3 py-1 rounded text-sm border">닫기</button>
      </div>
    `;

    const overlay = new kakao.maps.CustomOverlay({
      content: overlayDiv,
      position,
      xAnchor: 0.5,
      yAnchor: 1.2,
    });

    const btnDetail = overlayDiv.querySelector('[data-action="detail"]');
    const btnClose = overlayDiv.querySelector('[data-action="close"]');

    btnDetail?.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate(`/branches/${branch.id}`);
    });
    btnClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      overlay.setMap(null);
    });

    kakao.maps.event.addListener(marker, "click", () => {
      closeAllOverlays();
      overlay.setMap(mapRef.current);
      mapRef.current.setCenter(position);
    });

    markersRef.current.push(marker);
    overlaysRef.current.push(overlay);
  };

  const closeAllOverlays = () =>
    overlaysRef.current.forEach((o) => o.setMap(null));
  const clearMarkersAndOverlays = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    overlaysRef.current.forEach((o) => o.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];
  };

  const getUserLocation = () => {
    if (!navigator.geolocation || !window.kakao || !mapRef.current) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const kakao = window.kakao;
        const userPos = new kakao.maps.LatLng(latitude, longitude);

        new kakao.maps.Marker({
          map: mapRef.current,
          position: userPos,
          image: new kakao.maps.MarkerImage(
            `data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="12" fill="#2563eb" stroke="#fff" stroke-width="2"/></svg>`
            )}`
          ),
        });

        mapRef.current.setCenter(userPos);
        setLocating(false);
      },
      (err) => {
        console.warn("geolocation failed", err);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = (search || "").trim().toLowerCase();
    if (!q) {
      markersRef.current.forEach((m) => m.setMap(mapRef.current));
      return;
    }
    const matches = branches.filter((b) => {
      return (
        (b.branchName || "").toLowerCase().includes(q) ||
        (b.location || "").toLowerCase().includes(q)
      );
    });
    if (!matches.length) {
      alert("검색 결과가 없습니다.");
      return;
    }
    (async () => {
      const first = matches[0];
      const pos = await geocodeAddress(first.location);
      if (pos) {
        const kakao = window.kakao;
        const target = new kakao.maps.LatLng(pos.lat, pos.lng);
        mapRef.current.setCenter(target);
        closeAllOverlays();
        const found = markersRef.current.find((m) => {
          const p = m.getPosition();
          return (
            Math.abs(p.getLat() - pos.lat) < 1e-6 &&
            Math.abs(p.getLng() - pos.lng) < 1e-6
          );
        });
        if (found) {
          const idx = markersRef.current.indexOf(found);
          overlaysRef.current[idx]?.setMap(mapRef.current);
        }
      } else {
        alert("검색한 주소의 좌표를 찾지 못했습니다.");
      }
    })();
  };

  const escapeHtml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">지도 (지점 검색)</h1>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-2 w-64"
              placeholder="지점명 또는 주소(시/구/동)으로 검색"
            />
            <button className="px-4 py-2 bg-black text-white rounded">
              검색
            </button>
          </form>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white rounded-2xl shadow border p-4 max-h-[70vh] overflow-auto">
          <h2 className="font-semibold mb-3">지점 목록</h2>
          {loading ? (
            <div className="text-sm text-gray-500">지점 불러오는 중…</div>
          ) : branches.length ? (
            branches.map((b) => (
              <div
                key={b.id}
                className="p-3 border rounded mb-2 hover:bg-gray-50 cursor-pointer"
                onClick={async () => {
                  const pos = await geocodeAddress(b.location);
                  if (pos && mapRef.current) {
                    const kakao = window.kakao;
                    const target = new kakao.maps.LatLng(pos.lat, pos.lng);
                    mapRef.current.setCenter(target);
                    const found = markersRef.current.find((m) => {
                      const p = m.getPosition();
                      return (
                        Math.abs(p.getLat() - pos.lat) < 1e-6 &&
                        Math.abs(p.getLng() - pos.lng) < 1e-6
                      );
                    });
                    if (found) {
                      const idx = markersRef.current.indexOf(found);
                      closeAllOverlays();
                      overlaysRef.current[idx]?.setMap(mapRef.current);
                    }
                  } else {
                    alert("해당 지점의 좌표를 찾을 수 없습니다.");
                  }
                }}
              >
                <div className="font-medium">{b.branchName}</div>
                <div className="text-xs text-gray-600">{b.location}</div>
                <div className="text-xs text-gray-600">📞 {b.phone}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">등록된 지점이 없습니다.</div>
          )}
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <div
              ref={mapContainerRef}
              id="map"
              style={{ width: "100%", height: "70vh", borderRadius: 12 }}
            />
            <div className="absolute top-3 left-3 bg-white/80 rounded px-3 py-2 text-xs">
              {locating ? "내 위치를 찾는 중…" : "내 위치 표시됨"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
