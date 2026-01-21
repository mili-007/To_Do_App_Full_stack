import axiosInstance from '../../config/axios';
import { API_ENDPOINTS } from '../../config/api';
import type { Comment, CommentFormData } from '../../types';

// Get all comments for a todo
const getComments = async (todoId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>(`${API_ENDPOINTS.TODOS}/${todoId}/comments`);
  return response.data;
};

// Create comment
const createComment = async (todoId: string, commentData: CommentFormData): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>(`${API_ENDPOINTS.TODOS}/${todoId}/comments`, commentData);
  return response.data;
};

// Update comment
const updateComment = async (commentId: string, commentData: Partial<CommentFormData>): Promise<Comment> => {
  const response = await axiosInstance.put<Comment>(`${API_ENDPOINTS.COMMENTS}/${commentId}`, commentData);
  return response.data;
};

// Delete comment
const deleteComment = async (commentId: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.COMMENTS}/${commentId}`);
};

const commentService = {
  getComments,
  createComment,
  updateComment,
  deleteComment
};

export default commentService;

