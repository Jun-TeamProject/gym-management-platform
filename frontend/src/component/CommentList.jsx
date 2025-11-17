import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/CommentService";
import CommentForm from "./CommentForm";

export default function CommentList({ postId, me, isAdmin }) {
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const res = await getComments(postId, p, size);
      setData(res.data);
      setPage(res.data.number ?? p);
    } catch (e) {
      console.error(e);
      alert("댓글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
  }, [postId]);

  const handleCreate = async (payload) => {
    setBusy(true);
    try {
      await createComment(postId, payload);
      await load(0);
      setEditing(null);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "댓글 등록 실패");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (commentId, payload) => {
    setBusy(true);
    try {
      await updateComment(commentId, payload);
      // 수정 후 같은 페이지 재로드
      await load(page);
      setEditing(null);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "댓글 수정 실패");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      // 남은 페이지 처리: 현재 페이지에 항목이 없으면 이전 페이지 로드
      const newPage = data.content.length === 1 && page > 0 ? page - 1 : page;
      await load(newPage);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "댓글 삭제 실패");
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      {" "}
      {/* 간격 증가 */}
      <div className="text-sm text-gray-600 mb-4">
        댓글 {data.totalElements ?? 0}
      </div>
      {loading ? (
        <div className="text-gray-500">댓글 불러오는 중…</div>
      ) : (
        <>
          {data.content?.length ? (
            data.content.map((c) => {
              const meId = me?.id ?? me?.userId ?? null;
              const ownerId = c.user?.id ?? c.user?.userId ?? null;
              const isOwner =
                meId != null &&
                ownerId != null &&
                Number(meId) === Number(ownerId);

              return (
                <div key={c.id} className="mb-4">
                  {" "}
                  {/* 댓글간 간격 증가 */}
                  {/* 댓글 내용 — 수정 중이면 인라인 폼으로 대체 */}
                  {editing?.id === c.id ? (
                    <CommentForm
                      initial={c}
                      onSubmit={(payload) => handleUpdate(c.id, payload)}
                      onCancel={() => setEditing(null)}
                      busy={busy}
                      inline={true}
                    />
                  ) : (
                    <>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap mb-2">
                        {c.content}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{c.user?.username ?? c.user?.email ?? "익명"}</span>
                        <span>·</span>
                        <span>{new Date(c.createdAt).toLocaleString()}</span>
                        <div className="ml-auto flex gap-2">
                          {(isOwner || isAdmin) && (
                            <>
                              <button
                                onClick={() => setEditing(c)}
                                className="text-xs px-2 py-1 border rounded"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="text-xs px-2 py-1 border rounded text-red-600"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-gray-500">댓글이 없습니다.</div>
          )}

          {data.totalPages > 1 && (
            <div className="flex gap-2 items-center mt-2">
              <button
                disabled={page === 0}
                onClick={() => load(page - 1)}
                className="px-2 py-1 border rounded"
              >
                이전
              </button>
              <span className="text-sm text-gray-600">
                페이지 {page + 1} / {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages - 1}
                onClick={() => load(page + 1)}
                className="px-2 py-1 border rounded"
              >
                다음
              </button>
            </div>
          )}

          <div className="mt-6">
            {" "}
            {/* 입력창과 댓글 사이 간격 추가 */}
            {!editing && (
              <CommentForm
                initial={null}
                onSubmit={handleCreate}
                onCancel={() => {}}
                busy={busy}
                inline={false}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
