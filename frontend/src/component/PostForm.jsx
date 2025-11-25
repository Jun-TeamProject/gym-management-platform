import { useEffect, useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    type: "FREE",
    fileUrl: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? "",
        content: initial.content ?? "",
        type: initial.type ?? "FREE",
        fileUrl: initial.fileUrl ?? "",
      });
    }
  }, [initial]);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    const textOnly = form.content.replace(/<[^>]*>?/gm, "").trim();

    if (!textOnly) return alert("내용은 필수입니다.");

    onSubmit({
      title: form.title || null,
      content: form.content,
      type: form.type || null,
      fileUrl: form.fileUrl || null,
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formUi = (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full flex flex-col max-h-[90vh]">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg">게시글 작성</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            제목
          </label>
          <input
            name="title"
            value={form.title}
            onChange={change}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="제목"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              게시판 유형
            </label>
            <select
              name="type"
              value={form.type}
              onChange={change}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              첨부파일 URL (선택)
            </label>
            <input
              name="fileUrl"
              value={form.fileUrl}
              onChange={change}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mb-12"> {/* Quill 높이 확보를 위해 여백 추가 */}
          <label className="block text-sm font-bold text-gray-700 mb-1">
            내용
          </label>
          {/* React Quill 컴포넌트 */}
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={handleContentChange}
            modules={modules}
            className="h-64" // 에디터 높이 설정
          />
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl mt-auto">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={submit}
          disabled={busy}
          className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          {busy ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );

  if (!modal) return formUi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {formUi}
    </div>
  );
}
