import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../services/PostService";
import PostForm from "../component/PostForm";
import CommentList from "../component/CommentList";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // simple token parser (same as PostsPage.getMeFromToken)
  const getMeFromToken = () => {
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
  };

  const me = getMeFromToken();
  const isAdmin = me?.role === "ADMIN";

  // optimistic like state for immediate UI feedback
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPost(postId);
      setPost(res.data);
      // set optimistic state from fetched post
      setLiked(Boolean(res.data?.isLiked));
      setLikeCount(res.data?.likeCount ?? 0);
    } catch (e) {
      console.error(e);
      alert("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [postId]);

  const handleUpdate = async (payload) => {
    if (!post?.id) return;
    setBusy(true);
    try {
      await updatePost(post.id, payload);
      setEditing(null);
      await load();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "수정에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (idToDelete) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await deletePost(idToDelete);
      navigate("/posts");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message ?? "삭제에 실패했습니다.");
    }
  };

  const handleToggleLike = async (postId) => {
    // optimistic update with rollback and authoritative response handling
    const prevLiked = liked;
    const prevCount = likeCount;
    // immediate UI feedback
    setLiked(!prevLiked);
    setLikeCount(prevCount + (prevLiked ? -1 : 1));

    try {
      const res = await toggleLike(postId);
      // if backend returns the new state, use it; otherwise keep optimistic value
      if (res?.data) {
        if (res.data.isLiked !== undefined) setLiked(Boolean(res.data.isLiked));
        if (res.data.likeCount !== undefined)
          setLikeCount(Number(res.data.likeCount));
      }
    } catch (e) {
      // rollback on failure
      setLiked(prevLiked);
      setLikeCount(prevCount);
      console.error(e);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto p-4 text-gray-500">불러오는 중…</div>
    );
  if (!post)
    return (
      <div className="max-w-3xl mx-auto p-4 text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded border"
        >
          뒤로
        </button>
      </div>

      {/* 상세 페이지 전용 레이아웃 */}
      <article className="overflow-hidden mb-6 mt-8">
        <div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xl">
                {(post.user?.name ?? post.user?.email ?? "U")
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {post.title ?? "제목 없음"}
                  </h2>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      {post.user?.name ?? post.user?.email ?? "익명"}
                    </span>
                    <span> · </span>
                    <time>{new Date(post.createdAt).toLocaleString()}</time>
                    {post.type && (
                      <span>
                        {" "}
                        ·{" "}
                        <span className="inline-block px-2 py-0.5 ml-2 text-xs bg-blue-50 text-blue-700 rounded">
                          {post.type}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 수정/삭제는 로그인 사용자 기준으로 노출 */}
                {me && (
                  <div className="hidden md:flex flex-col items-end gap-2">
                    {Number(me.id) ===
                      Number(post.user?.id ?? post.user?.userId) && (
                        <button
                          onClick={() => setEditing(post)}
                          className="px-3 py-1 rounded border text-sm"
                        >
                          수정
                        </button>
                      )}
                    {(Number(me.id) ===
                      Number(post.user?.id ?? post.user?.userId) ||
                      isAdmin) && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-3 py-1 rounded border text-sm text-red-600"
                        >
                          삭제
                        </button>
                      )}
                  </div>
                )}
              </div>

              <div
                className="mt-6 text-gray-800 leading-relaxed min-h-[100px] [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2 [&>img]:max-w-full"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.fileUrl && (
                <div className="mt-4">
                  <a
                    href={post.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-2"
                  >
                    📎 첨부파일 보기
                  </a>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium border ${liked
                      ? "bg-pink-50 border-pink-300 text-pink-600"
                      : "bg-white border-gray-200 text-gray-800"
                    }`}
                >
                  <span className="text-lg">❤️</span>
                  <span className="font-medium">{likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <div className="mb-6">
        <CommentList postId={post.id} me={me} isAdmin={isAdmin} />
      </div>

      {/* 편집 모달 */}
      {editing && (
        <PostForm
          initial={editing && editing.id ? editing : post}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          busy={busy}
          modal={true}
        />
      )}
    </div>
  );
}
