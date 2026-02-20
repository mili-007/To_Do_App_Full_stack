import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, createComment, deleteComment } from '../../features/comments/commentSlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { Comment, CommentSectionProps } from '../../types';
import ConfirmDialog from '../ui/ConfirmDialog';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useDeleteConfirm } from '../../hooks/useDeleteConfirm';

const CommentSection = ({ todoId }: CommentSectionProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const comments = useSelector((state: RootState) => state.comments.comments[todoId] || []);
  const { isLoading, isError: apiError, message: apiMessage } = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      dispatch(getComments(todoId));
    }
  }, [showComments, todoId, dispatch, comments.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentContent.trim();
    if (!trimmed) {
      setError('Comment is required');
      return;
    }
    setError(null);
    dispatch(createComment({ todoId, content: trimmed }));
    setCommentContent('');
  };

  const deleteConfirm = useDeleteConfirm<string>();

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const commentId = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteComment({ todoId, commentId }))
      .unwrap()
      .then(() => toast.success('Comment deleted'))
      .catch((err: string) => toast.error(err || 'Failed to delete comment'));
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete comment"
        message="Are you sure you want to delete this comment?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{showComments ? 'Hide' : 'Show'} Comments ({comments.length})</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {apiError && apiMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {apiMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="flex space-x-2">
              <div className="flex-1 min-w-0">
                <Input
                  type="text"
                  name="content"
                  value={commentContent}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setCommentContent(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Add a comment..."
                  error={error ?? undefined}
                  className="text-sm"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading}
                loading={isLoading}
                loadingLabel="Posting..."
                className="shrink-0"
              >
                Post
              </Button>
            </div>
          </form>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              comments.map((comment: Comment) => (
                <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {typeof comment.user === 'object' ? comment.user.name : 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    {typeof comment.user === 'object' && comment.user._id === user?._id && (
                      <button
                        onClick={() => deleteConfirm.requestDelete(comment._id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Delete comment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

