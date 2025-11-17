import { useEffect, useState } from "react";

const TYPES = ["NOTICE", "QNA", "FREE"];

export default function PostForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  modal = true,
}) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "",
    fileUrl: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? "",
        content: initial.content ?? "",
        type: initial.type ?? "",
        fileUrl: initial.fileUrl ?? "",
      });
    } else {
      setForm({
        title: "",
        content: "",
        type: "",
        fileUrl: "",
      });
    }
  }, [initial]);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.content?.trim()) return alert("내용은 필수입니다.");
    if (form.content.length > 2000)
      return alert("내용은 2000자 이하여야 합니다.");
    onSubmit({
      title: form.title || null,
      content: form.content,
      type: form.type || null,
      fileUrl: form.fileUrl || null,
    });
  };

  const formUi = (
    <form
      onSubmit={submit}
      className="border rounded-xl p-4 bg-white shadow-sm max-w-2xl w-full"
    >
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">제목</label>
        <input
          name="title"
          value={form.title}
          onChange={change}
          className="w-full border rounded-lg p-2"
          placeholder="제목(선택)"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">내용 *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={change}
          rows={6}
          className="w-full border rounded-lg p-2"
          placeholder="내용을 입력하세요"
        />
        <div className="text-right text-xs text-gray-500">
          {form.content.length}/2000
        </div>
      </div>
      <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">타입(Type)</label>
          <select
            name="type"
            value={form.type}
            onChange={change}
            className="w-full border rounded-lg p-2"
          >
            <option value="">선택 안 함</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">파일 URL</label>
          <input
            name="fileUrl"
            value={form.fileUrl}
            onChange={change}
            className="w-full border rounded-lg p-2"
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          취소
        </button>
        <button
          disabled={busy}
          className="px-4 py-2 rounded-lg border bg-black text-white"
        >
          {busy ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );

  if (!modal) return formUi;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full flex justify-center mt-12 md:mt-0">
        {formUi}
      </div>
    </div>
  );
}
