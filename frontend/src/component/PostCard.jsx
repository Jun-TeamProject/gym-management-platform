import { useState } from "react";
import CommentList from "./CommentList";

export default function PostCard({
  post,
  me,
  isAdmin,
  onEdit,
  onDelete,
  onToggleLike,
}) {
  const meId = me?.id ?? me?.userId ?? null;
  const ownerId = post?.user?.id ?? post?.user?.userId ?? null;
  const isOwner =
    meId != null && ownerId != null && Number(meId) === Number(ownerId);

  const [optimistic, setOptimistic] = useState({
    isLiked: post.isLiked,
    likeCount: post.likeCount ?? 0,
  });
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      setOptimistic((p) => ({
        isLiked: !p.isLiked,
        likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
      }));
      await onToggleLike(post.id);
    } catch {
      setOptimistic({ isLiked: post.isLiked, likeCount: post.likeCount ?? 0 });
    }
  };

  const initials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-lg">
            {initials(post.user?.name ?? post.user?.email)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {post.title ? (
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                    {post.title}
                  </h3>
                ) : (
                  <div className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                    제목 없음
                  </div>
                )}

                {post.type && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {post.type}
                  </span>
                )}
              </div>

              <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed break-words max-h-28 overflow-hidden">
                {post.content}
              </p>

              {post.fileUrl && (
                <div className="mt-3">
                  <a
                    href={post.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    📎 첨부파일 보기
                  </a>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col items-end gap-2">
              {(isOwner || isAdmin) && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="text-xs px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="text-xs px-3 py-1 rounded-lg border text-red-600 bg-white hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500 gap-3">
            <span className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">
                {post.user?.name ?? post.user?.email ?? "익명"}
              </span>
            </span>
            <span>·</span>
            <time className="text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </time>
            {typeof post.commentCount === "number" && (
              <>
                <span>·</span>
                <span>댓글 {post.commentCount}</span>
              </>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border ${
                  optimistic.isLiked
                    ? "bg-pink-50 border-pink-300 text-pink-600"
                    : "bg-gray-50 border-gray-100 text-gray-700"
                }`}
                title="좋아요"
              >
                <span className="text-base">❤️</span>
                <span>{optimistic.likeCount}</span>
              </button>

              <button
                onClick={() => setShowComments((s) => !s)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border bg-gray-50 border-gray-100 text-gray-700"
              >
                <span className="text-base">💬</span>
                <span>{post.commentCount ?? 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 md:p-6">
          <CommentList postId={post.id} me={me} isAdmin={isAdmin} />
        </div>
      )}
    </article>
  );
}
