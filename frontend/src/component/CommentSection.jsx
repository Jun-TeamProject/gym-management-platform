import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/commentService";

export default function CommentSection({postId, me}) {
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const [data, setData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        totalElements: 0,
    })
};
const [loading, setLoading] = useState(false);
const [input, setInput] = useState("");
const [busy, setBusy] = useState(false);
const [editingId, setEditingId] = useState(null);
const [editInput, setEditInput] = useState("");

const load = async (p = page) => {
    if (!postId) return;
    setLoading(true);
    try {
        const res = await getComments(postId, p, size);
        setData(res.data);
    } catch (e) {
        console.error(e);
        alert("댓글을 불러오지 못했습니다.");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    setPage(0);
    load(0);
}, [postId]);

useEffect(() => {
    load(page);
}, [page]);

const handleCreate = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!me) {
        alert("로그인 후 댓글을 작성할 수 있습니다.");
        return;
    }

    setBusy(true);
    try {
        await createComment(postId, input.trim());
        setInput("");
        setPage(0);
        await load(0);
    } catch (e) {
        console.error(e);
        alert(e.response?.data?.message ?? "댓글 작성에 실패했습니다.");
    } finally {
        setBusy(false);
    }
};

const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditInput(comment.content);
}

const handleCancleEdit = () => {
    setEditingId(null);
    setEditInput("");
};

const handleUpdate = async (commentId) => {
    if (!editInput.trim()) return;

    setBusy(true);
    try {
        await updateComment(commentId, editInput.trim());
        setEditingId(null);
        setEditInput("");
        await load(page);
    } catch (e) {
        console.error(e);
        alert(e.response?.data?.message ?? "댓글 수정에 실패했습니다.");
    } finally {
        setBusy(false);
    }
};

const handleDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    setBusy(true);
    try {
        await deleteComment(commentId);
        await load(page);
    } catch (e) {
        console.error(e);
        alert(e.response?.data?.message ?? "댓글 삭제에 실패했습니다.");
    } finally {
        setBusy(false);
    }
};

return (
    <div className="mt-4 border-t pt-3">
        <h3 className="font-semibold mb-2">댓글</h3>

        <form onSubmit={handleCreate} className="flex gap-2 mb-3">
            <input
                type="text"
                className="flex-1 border rounded px-2 py-1 text-sm"
                palceholder={
                    me ? "댓글을 입력하세요." : "로그인 후 댓글을 작성할 수 있습니다."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!me || busy}
                />
            <button
                type="submit"
                className="px-3 py-1 rounded bg-black text-white text-sm"
                disabled={!me || busy}
                >
                    등록
                </button>
        </form>

        {/*목록*/}
    </div>
)