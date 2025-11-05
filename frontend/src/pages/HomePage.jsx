import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

function DumbbellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 9h2v6H3V9zm16 0h2v6h-2V9zM7 7h2v10H7V7zm8 0h2v10h-2V7zM11 10h2v4h-2v-4z" />
    </svg>
  );
}

/* 사이드바 버튼 */
function HamburgerButton({ onClick }) {
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

function Sidebar({ open }) {
  const Item = ({ to, icon, label }) => {
    const { pathname } = useLocation();
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition 
          ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm transition-transform ${
        open ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="px-5 py-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center">
            <DumbbellIcon className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-gray-900">Gym Projector</span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        <Item
          to="/"
          label="홈"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>}
        />
        <Item
          to="/myprofile"
          label="개인정보"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" /></svg>}
        />
        <Item
          to="/chat"
          label="실시간 상담"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 3h20v14H6l-4 4V3z" /></svg>}
        />
        <Item
          to="/reservations"
          label="PT 예약"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" /></svg>}
        />
        <Item
          to="/attendances"
          label="출석 관리"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4l-2-2-8 8-3-3-2 2zM2 20h20v2H2z" /></svg>}
        />
        <Item
          to="/posts"
          label="커뮤니티"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4zM2 2v20l4-4h16V2H2z" /></svg>}
        />
        <Item
          to="/payments"
          label="결제 내역"
          icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2zM2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10H2v8zm4-3h6v2H6v-2z" /></svg>}
        />
      </nav>
    </aside>
  );
}


export default function HomePage() {
  const [open, setOpen] = useState(true); 
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Sidebar open={open} />

      <header className={`sticky top-0 z-20 bg-white/70 backdrop-blur border-b ${open ? "ml-64" : "ml-0"}`}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HamburgerButton onClick={() => setOpen((prev) => !prev)} />
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center">
                <DumbbellIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-gray-900">Gym Projector</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-gray-600 hover:text-gray-900">기능</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">이용권</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">문의</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100">
              어드민페이지
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100">
              로그인
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
              회원가입
            </Link>
            <button onClick={handleLogout}>
            로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 홈페이지 기본 내용 (좌측 여백: 사이드바 열림 상태에 따라) */}
      <main className={`${open ? "ml-64" : "ml-0"} transition-all`}>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="max-w-2xl">
              <p className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                회원·트레이너·관리자를 모두 연결하는 올인원 플랫폼
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                운영은 <span className="text-blue-600">간편하게</span> <br />
                회원관리는 <span className="text-blue-600">완벽하게</span>.
                <br /> 스마트한 센터 운영
              </h1>
              <p className="mt-5 text-gray-600">
                실시간 출석 체크, 이용권·결제, 트레이너 스케줄, 커뮤니티까지 한 곳에서.
                운영 효율과 회원 만족도를 동시에 올려보세요.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold">
                  지금 시작하기
                </Link>
                <a href="#features" className="px-5 py-3 rounded-xl font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100">
                  기능 살펴보기
                </a>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 text-center sm:max-w-md">
                <div className="rounded-xl bg-white/70 p-4 shadow-sm">
                  <dt className="text-xs text-gray-500">일일 체크인</dt>
                  <dd className="text-xl font-bold text-gray-900">+12,340</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-4 shadow-sm">
                  <dt className="text-xs text-gray-500">월 매출 집계</dt>
                  <dd className="text-xl font-bold text-gray-900">자동화</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-4 shadow-sm">
                  <dt className="text-xs text-gray-500">평균 예약 확정</dt>
                  <dd className="text-xl font-bold text-gray-900">&lt; 2분</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">핵심 기능</h2>
          <p className="mt-2 text-gray-600">운영 효율을 올리는 실전 기능들을 제공합니다.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "출석 체크", desc: "QR/원클릭 출석, 월간 기록 열람.", emoji: "✅" },
              { title: "PT 예약", desc: "트레이너 선택, 일정 조율, 알림까지.", emoji: "📅" },
              { title: "이용권/결제", desc: "헬스권·PT권 관리, PG 연동 승인.", emoji: "💳" },
              { title: "프로필/커뮤니티", desc: "회원 프로필 수정, 게시글·댓글.", emoji: "👥" },
              { title: "지점 관리", desc: "지점별 트레이너/시설/매출 통계.", emoji: "📈" },
              { title: "알림", desc: "만료/예약/상담 실시간 알림.", emoji: "🔔" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-2xl">{f.emoji}</div>
                <h3 className="mt-3 font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-3xl bg-blue-600 text-white p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold">GYM Management Platform</h3>
              <p className="mt-2 text-blue-100">지점별 관리와 데이터 기반 운영.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="px-5 py-3 rounded-xl font-semibold bg-white text-blue-700 hover:bg-blue-50">
                무료로 시작
              </Link>
              <Link to="/login" className="px-5 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-700">
                데모 로그인
              </Link>
            </div>
          </div>
        </section>

        <footer id="contact" className="border-t">
          <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Gym Projector</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-800">이용약관</a>
              <a href="#" className="hover:text-gray-800">개인정보처리방침</a>
              <a href="mailto:support@gym.com" className="hover:text-gray-800">support@gym.com</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}