import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {/* 홈페이지 기본 내용 (좌측 여백: 사이드바 열림 상태에 따라) */}
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
              실시간 출석 체크, 이용권·결제, 트레이너 스케줄, 커뮤니티까지 한
              곳에서. 운영 효율과 회원 만족도를 동시에 올려보세요.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/products" : "/register"}
                className="px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                지금 시작하기
              </Link>
              <a
                href="#features"
                className="px-5 py-3 rounded-xl font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          핵심 기능
        </h2>
        <p className="mt-2 text-gray-600">
          운영 효율을 올리는 실전 기능들을 제공합니다.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "출석 체크",
              desc: "QR/원클릭 출석, 월간 기록 열람.",
              emoji: "✅",
              link: "attendances",
            },
            {
              title: "PT 예약",
              desc: "트레이너 선택, 일정 조율, 알림까지.",
              emoji: "📅",
              link: "reservations",
            },
            {
              title: "이용권/결제",
              desc: "헬스권·PT권 관리, PG 연동 승인.",
              emoji: "💳",
              link: "/products",
            },
            {
              title: "프로필/커뮤니티",
              desc: "회원 프로필 수정, 게시글·댓글.",
              emoji: "👥",
            },
            {
              title: "지점 관리",
              desc: "지점별 트레이너/시설.",
              emoji: "📈",
            },
            { title: "알림", desc: "만료/예약/상담 실시간 알림.", emoji: "🔔" },
          ].map((f) => {
            const cardContent = (
              <>
                <div className="text-2xl">{f.emoji}</div>
                <h3 className="mt-3 font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-gray-600 text-sm">{f.desc}</p>
              </>
            );
            if (f.title === "출석 체크") {
              return (
                <Link
                  key={f.title}
                  to={f.link}
                  className="block rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-blue-300"
                >
                  {cardContent}
                </Link>
              );
            }
            if (f.title === "이용권/결제") {
              return (
                <Link
                  key={f.title}
                  to={f.link}
                  className="block rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-blue-300"
                >
                  {cardContent}
                </Link>
              );
            }
            if (f.title === "PT 예약") {
              return (
                <Link
                  key={f.title}
                  to={f.link}
                  className="block rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-blue-300"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={f.title}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-blue-600 text-white p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold">GYM Management Platform</h3>
            <p className="mt-2 text-blue-100">
              지점별 관리와 데이터 기반 운영.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register"
              className="px-5 py-3 rounded-xl font-semibold bg-white text-blue-700 hover:bg-blue-50"
            >
              회원가입
            </Link>
            <Link
              to="/login"
              className="px-5 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-700"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Gym Projector</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-800">
              이용약관
            </a>
            <a href="#" className="hover:text-gray-800">
              개인정보처리방침
            </a>
            <a href="mailto:support@gym.com" className="hover:text-gray-800">
              support@gym.com
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
