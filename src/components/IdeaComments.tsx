"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalCloseTrigger,
  ModalHeading,
  TextArea,
} from "@heroui/react";
import { FaRegCommentDots, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { commentsAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import type { Comment, User } from "@/types";
import React from "react";

interface IdeaCommentsProps {
  ideaId: string;
  initialCount?: number;
}

const formatCommentDate = (value?: string) => {
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

const isOwnComment = (comment: Comment, user?: User | null) => {
  if (!comment || !user) return false;

  const commentUserId = String(comment.userId || "");
  const currentUserId = String(user._id || user.id || "");

  return (
    commentUserId &&
    (commentUserId === currentUserId || String(comment.userEmail || "") === String(user.email || ""))
  );
};

export default function IdeaComments({ ideaId, initialCount = 0 }: IdeaCommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getByIdeaId(ideaId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast((err as Error)?.message || "Unable to load comments.", "error");
    } finally {
      setLoading(false);
    }
  }, [ideaId, showToast]);

  useEffect(() => {
    let active = true;

    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await commentsAPI.getByIdeaId(ideaId);

        if (!active) return;

        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;

        showToast((err as Error)?.message || "Unable to load comments.", "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      active = false;
    };
  }, [ideaId, showToast]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      showToast("You must be logged in to comment.", "error");
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await commentsAPI.create({ ideaId, text: trimmed });
      await fetchComments();
      setText("");
      showToast("Comment added.", "success");
    } catch (err) {
      showToast((err as Error)?.message || "Unable to add comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (id: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await commentsAPI.update(id, { text: trimmed });
      await fetchComments();
      showToast("Comment updated.", "success");
      cancelEdit();
    } catch (err) {
      showToast((err as Error)?.message || "Unable to update comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (comment: Comment) => {
    setDeleteTarget(comment);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const deleteComment = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      await commentsAPI.delete(deleteTarget._id);
      await fetchComments();
      showToast("Comment deleted.", "success");
      closeDeleteModal();
    } catch (err) {
      showToast((err as Error)?.message || "Unable to delete comment.", "error");
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
              <Button variant="primary" onPress={handleAdd} isDisabled={submitting || !isAuthenticated}>
                Post
              </Button>
            </div>

            <div className="mt-2 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-500">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet — be the first to share feedback.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {comment.userName || comment.user?.name || comment.userEmail || "Anonymous"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{formatCommentDate(comment.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwnComment(comment, user) && (
                          <>
                            <Button variant="outline" size="sm" onPress={() => startEdit(comment)}>
                              <FaEdit />
                            </Button>
                            <Button variant="outline" color="danger" size="sm" onPress={() => openDeleteModal(comment)}>
                              <FaTrash />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      {editingId === comment._id ? (
                        <div className="space-y-2">
                          <TextArea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full" />
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onPress={cancelEdit}>
                              Cancel
                            </Button>
                            <Button variant="primary" onPress={() => saveEdit(comment._id)} isDisabled={submitting}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={deleteOpen} onOpenChange={(open) => (open ? setDeleteOpen(true) : closeDeleteModal())}>
        <ModalBackdrop>
          <ModalContainer placement="center" size="md">
            <ModalDialog className="overflow-hidden border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
              <ModalCloseTrigger className="right-4 top-4 text-slate-500 transition hover:text-slate-900" />
              <ModalHeader className="border-b border-slate-100 bg-linear-to-br from-rose-50 to-white px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <ModalHeading className="text-2xl font-black tracking-tight text-slate-900">Delete Comment</ModalHeading>
                    <p className="mt-1 text-sm leading-6 text-slate-600">This action cannot be undone.</p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="px-6 py-5">
                <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-slate-700">
                  {deleteTarget?.text || ""}
                </p>
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                <Button variant="outline" onPress={closeDeleteModal} isDisabled={submitting} className="border-slate-300 text-slate-700">
                  Cancel
                </Button>
                <Button variant="danger" onPress={deleteComment} isDisabled={submitting} className="bg-rose-600 text-white shadow-lg shadow-rose-500/20">
                  Delete
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </section>
  );
}
