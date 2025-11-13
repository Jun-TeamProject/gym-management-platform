import { useEffect, useMemo, useState } from "react";
import { createPost, deletePost, getPosts, toggleLike, updatePost } from "../services/postService";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostForm";

/** JWT에서 me(id, role 등) 꺼내는 간단 헬퍼 */
function getMeFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // 백엔드 토큰 페이로드 키에 맞춰서 골라주세요 (id/role/email 등)
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
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, size: 10, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  // ✅ 현재 사용자/권한 계산
  const me = getMeFromToken();                 // { id, role, ... } 또는 null
  const isAdmin = me?.role === "ADMIN";        // 대문자 기준

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

  useEffect(() => { load(0); }, []);
  useEffect(() => { load(page); }, [page]);

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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">게시글</h1>
        <button onClick={() => setEditing({})} className="px-4 py-2 rounded-lg border bg-black text-white">
          새 글
        </button>
      </header>

      {editing && (
        <div className="mb-4">
          <PostForm
            initial={editing && editing.id ? editing : null}
            onSubmit={editing?.id ? handleUpdate : handleCreate}
            onCancel={() => setEditing(null)}
            busy={busy}
          />
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">불러오는 중…</div>
      ) : (
        <>
          {data.content?.length ? (
            data.content.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                me={me}              
                isAdmin={isAdmin}    
                onEdit={() => setEditing(p)}
                onDelete={handleDelete}
                onToggleLike={handleToggleLike}
              />
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
                  className={`px-3 py-1 rounded border ${idx === page ? "bg-black text-white" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
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
