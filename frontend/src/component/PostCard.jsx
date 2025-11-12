import { useState } from "react";

export default function PostCard({ post, me, isAdmin, onEdit, onDelete, onToggleLike }) {
  const meId = me?.id ?? me?.userId ?? null;
  const ownerId = post?.user?.id ?? post?.user?.userId ?? null;
  const isOwner = meId != null && ownerId != null && Number(meId) === Number(ownerId);

  const [optimistic, setOptimistic] = useState({
    isLiked: post.isLiked,
    likeCount: post.likeCount ?? 0,
  });

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

  return (
    <div className="border rounded-xl p-4 shadow-sm mb-3 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          {post.title && <h3 className="font-semibold text-lg">{post.title}</h3>}
          <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
          {post.fileUrl && (
            <a className="text-blue-600 underline" href={post.fileUrl} target="_blank" rel="noreferrer">
              첨부파일
            </a>
          )}
          <div className="mt-2 text-sm text-gray-500">
            <span>작성자: {post.user?.name ?? post.user?.email ?? "익명"}</span>
            {" · "}
            <span>{new Date(post.createdAt).toLocaleString()}</span>
            {post.type && <> · <span>type: {post.type}</span></>}
            {typeof post.commentCount === "number" && <> · 댓글 {post.commentCount}</>}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleLike}
            className={`px-3 py-1 rounded-lg border ${optimistic.isLiked ? "bg-pink-50 border-pink-300" : "bg-gray-50"}`}
            title="좋아요"
          >
            ❤️ {optimistic.likeCount}
          </button>

          {(isOwner || isAdmin) && (
            <>
              <button onClick={() => onEdit(post)} className="px-3 py-1 rounded-lg border">수정</button>
              <button onClick={() => onDelete(post.id)} className="px-3 py-1 rounded-lg border text-red-600">삭제</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
