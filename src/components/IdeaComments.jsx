"use client";

import { useEffect, useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa";
import { commentsAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

const formatCommentDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const isOwnComment = (comment, user) => {
  if (!comment || !user) return false;

  const commentUserId = String(comment.userId || "");
  const currentUserId = String(user._id || user.id || "");

  return (
    commentUserId &&
    (commentUserId === currentUserId || String(comment.userEmail || "") === String(user.email || ""))
  );
};

export default function IdeaComments({ ideaId, initialCount = 0 }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getByIdeaId(ideaId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err?.message || "Unable to load comments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      showToast("You must be logged in to comment.", "error");
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const payload = { ideaId, text: trimmed };
      const created = await commentsAPI.create(payload);
      setComments((prev) => [created, ...prev]);
      setText("");
      showToast("Comment added.", "success");
    } catch (err) {
      showToast(err?.message || "Unable to add comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditingText(c.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const updated = await commentsAPI.update(id, { text: trimmed });
      setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
      showToast("Comment updated.", "success");
      cancelEdit();
    } catch (err) {
      showToast(err?.message || "Unable to update comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    setSubmitting(true);
    try {
      await commentsAPI.delete(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      showToast("Comment deleted.", "success");
    } catch (err) {
      showToast(err?.message || "Unable to delete comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaRegCommentDots className="text-cyan-600" />
            <h3 className="text-lg font-semibold text-slate-900">Discussion</h3>
            <span className="text-sm text-slate-500">{comments.length ?? initialCount} comments</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid gap-3">
            <div className="flex gap-3">
              <Input
                placeholder={isAuthenticated ? "Write a comment..." : "Log in to write a comment"}
                value={text}
                onChange={(e) => setText(e.target.value)}
                isDisabled={submitting || !isAuthenticated}
              />
              <Button color="primary" onPress={handleAdd} isDisabled={submitting || !isAuthenticated}>
                Post
              </Button>
            </div>

            <div className="mt-2 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-500">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet — be the first to share feedback.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.userName || c.user?.name || c.userEmail || "Anonymous"}</p>
                        <p className="mt-1 text-sm text-slate-600">{formatCommentDate(c.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwnComment(c, user) && (
                          <>
                            <Button variant="bordered" size="sm" onPress={() => startEdit(c)}>
                              <FaEdit />
                            </Button>
                            <Button variant="bordered" color="danger" size="sm" onPress={() => deleteComment(c._id)}>
                              <FaTrash />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      {editingId === c._id ? (
                        <div className="space-y-2">
                          <TextArea value={editingText} onChange={(e) => setEditingText(e.target.value)} minRows={3} />
                          <div className="flex gap-2 justify-end">
                            <Button variant="bordered" onPress={cancelEdit}>Cancel</Button>
                            <Button color="primary" onPress={() => saveEdit(c._id)} isDisabled={submitting}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
