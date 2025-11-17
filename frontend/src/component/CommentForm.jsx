import { useEffect, useState } from "react";

export default function CommentForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  inline = false,
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    // 초기값이 주어질 때만 로드(생성 폼은 initial이 null이므로 영향 없음)
    if (initial?.content) {
      setContent(initial.content);
    } else {
      setContent("");
    }
  }, [initial]);

  const submit = (e) => {
    e?.preventDefault();
    if (!content?.trim()) return alert("댓글 내용을 입력하세요.");
    if (content.length > 1000) return alert("댓글은 1000자 이하여야 합니다.");
    onSubmit({ content });
    // 인라인 편집의 경우 폼이 닫히면 부모가 editing을 null로 설정
    if (!initial) setContent("");
  };

  return (
    <form onSubmit={submit} className={inline ? "mt-2" : "mt-4"}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={inline ? 3 : 4}
        className="w-full border rounded-lg p-2 resize-none"
        placeholder={inline ? "댓글을 수정하세요" : "댓글을 입력하세요"}
      />
      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded border bg-white"
        >
          취소
        </button>
        <button
          disabled={busy}
          className="px-3 py-1 rounded border bg-black text-white"
        >
          {busy ? "처리중..." : initial ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
