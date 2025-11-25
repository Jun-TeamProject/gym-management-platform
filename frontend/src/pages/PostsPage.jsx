import { useEffect, useMemo, useState } from "react";
import {
  createPost,
  deletePost,
  getPosts,
  toggleLike,
  updatePost,
} from "../services/PostService";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostForm";
import { useNavigate } from "react-router-dom";

/** JWT에서 me(id, role 등) 꺼내는 간단 헬퍼 */
function getMeFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id ?? payload.userId ?? null,
      role: payload.role ?? null,
      email: payload.email ?? null,
      username: payload.username ?? null,
    };
  } catch {
    return null;
  }
}

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    size: 10,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filterType, setFilterType] = useState(""); // "" | "NOTICE" | "QNA" | "FREE"
  const [filterMine, setFilterMine] = useState(false); // 내 글 필터

  const navigate = useNavigate();

  const me = getMeFromToken();
  const isAdmin = me?.role === "ADMIN";

  const load = async (p = page) => {
    setLoading(true);
    try {
      const res = await getPosts(p, size);
      setData(res.data);
    } catch (e) {
      console.error(e);
      alert("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
  }, []);
  useEffect(() => {
    load(page);
  }, [page]);

  const pages = useMemo(() => {
    const arr = [];
    for (let i = 0; i < (data.totalPages ?? 0); i++) arr.push(i);
    return arr;
  }, [data.totalPages]);

  const handleCreate = async (payload) => {
    setBusy(true);
    try {
      await createPost(payload);
      setEditing(null);
      setPage(0);
      await load(0);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "등록에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing?.id) return;
    setBusy(true);
    try {
      await updatePost(editing.id, payload);
      setEditing(null);
      await load(page);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "수정에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await deletePost(id);
      await load(page);
    } catch (e) {
      console.error(e);
      alert(
        e.response?.data?.message
          ? `삭제 실패: ${e.response.data.message}`
          : "삭제에 실패했습니다."
      );
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await toggleLike(postId);
    } catch (e) {
      console.error(e);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // client-side filter for simple UX (server-side paging remains)
  const filtered = (data.content ?? []).filter((p) => {
    if (filterType && (p.type ?? "") !== filterType) return false;
    if (filterMine && me) {
      const ownerId = p.user?.id ?? p.user?.userId ?? null;
      return ownerId != null && Number(ownerId) === Number(me.id);
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">게시글</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing({})}
                className="px-4 py-2 rounded-lg border bg-black text-white"
              >
                새 글
              </button>
            </div>
          </div>

          <div className="flex mt-6 gap-2 justify-center">
            <button
              onClick={() => setFilterType("")}
              className={`px-3 py-1 rounded border ${
                filterType === "" ? "bg-black text-white" : ""
              }`}
            >
              전체
            </button>

            <button
              onClick={() => setFilterType("NOTICE")}
              className={`px-3 py-1 rounded border ${
                filterType === "NOTICE" ? "bg-black text-white" : ""
              }`}
            >
              NOTICE
            </button>
            <button
              onClick={() => setFilterType("QNA")}
              className={`px-3 py-1 rounded border ${
                filterType === "QNA" ? "bg-black text-white" : ""
              }`}
            >
              QNA
            </button>
            <button
              onClick={() => setFilterType("FREE")}
              className={`px-3 py-1 rounded border ${
                filterType === "FREE" ? "bg-black text-white" : ""
              }`}
            >
              FREE
            </button>

            {me && (
              <button
                onClick={() => setFilterMine((s) => !s)}
                className={`px-3 py-1 rounded border ${
                  filterMine ? "bg-blue-600 text-white" : ""
                }`}
              >
                내 글
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PostForm은 모달로 렌더링 */}
      {editing && (
        <PostForm
          initial={editing && editing.id ? editing : null}
          onSubmit={editing?.id ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
          busy={busy}
          modal={true}
        />
      )}

      {loading ? (
        <div className="text-gray-500">불러오는 중…</div>
      ) : (
        <>
          {filtered.length ? (
            filtered.map((p) => (
              <div key={p.id} className="mb-6">
                {" "}
                {/* 카드 간격 증가 */}
                <PostCard
                  post={p}
                  me={me}
                  isAdmin={isAdmin}
                  // 리스트에서는 상호작용 버튼 숨기고 카운트만 노출
                  showActions={false}
                  onEdit={null}
                  onDelete={null}
                  onToggleLike={null}
                  onOpen={() => navigate(`/posts/${p.id}`)}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500">게시글이 없습니다.</div>
          )}

          {data.totalPages > 1 && (
            <div className="mt-4 flex gap-2 items-center flex-wrap">
              <button
                className="px-3 py-1 rounded border"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                이전
              </button>
              {pages.map((idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`px-3 py-1 rounded border ${
                    idx === page ? "bg-black text-white" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border"
                disabled={page >= data.totalPages - 1}
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
              >
                다음
              </button>
              <span className="text-sm text-gray-500 ml-2">
                총 {data.totalElements ?? 0}개
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
