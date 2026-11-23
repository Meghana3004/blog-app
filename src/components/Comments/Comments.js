import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import './Comments.css';
import { TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../contexts/AuthContext';

const Comments = ({ postId }) => {

  const [comments, setComments] = useState([]); 
  const [commentText, setCommentText] = useState(''); 
  const [replyText, setReplyText] = useState(''); 
  const [activeComment, setActiveComment] = useState(null); 
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/posts/${postId}/comments`);

        if (response.status === 200) {
          const formattedComments = response.data.map((comment) => ({
            id: comment.comment_id,
            text: comment.content,
            username: comment.username,
            timestamp: format(parseISO(comment.created_at), "MMM dd, yyyy 'at' HH:mm"),
            replies: [],
            showReplies: false,
          }));

          setComments(formattedComments); 
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        setError('Error fetching comments');
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(); 
  }, [postId]); 


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (commentText.trim() !== '') {
      if (!user) {
        setError('Not logged in');
        return;
      }

      const data = {
        post_id: postId,
        content: commentText,
      };

      try {
        const response = await axios.post(
          '/posts/post-comment',
          data
        );

        if (response.status === 201) {
          const newComment = {
            id: response.data.comment_id,
            text: commentText,
            username: response.data.username,
            timestamp: format(new Date(), "MMM dd, yyyy 'at' HH:mm"),
            replies: [],
          };

          setComments([newComment, ...comments]);
          setCommentText('');
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault();

    if (replyText.trim() !== '') {
      if (!user) {
        setError('Not logged in');
        return;
      }

      const data = {
        comment_id: commentId,
        content: replyText,
      };

      try {
        const response = await axios.post(
          '/reply',
          data
        );

        if (response.status === 201) {
          const newReply = {
            id: response.data.reply_id,
            text: replyText,
            username: response.data.username,
            timestamp: format(new Date(), "MMM dd, yyyy 'at' HH:mm"),
          };

          const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [newReply, ...comment.replies],
              };
            }
            return comment;
          });

          setComments(updatedComments);
          setReplyText('');
          setActiveComment(null);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error posting reply:', error);
      }
    }
  };


  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(`/comments/${commentId}/replies`);

      if (response.status === 200) {
        const formattedReplies = response.data.map((reply) => ({
          id: reply.reply_id,
          text: reply.content,
          username: reply.username,
          timestamp: format(parseISO(reply.created_at), "MMM dd, yyyy 'at' HH:mm"),
        }));

        const updatedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: formattedReplies,
            };
          }
          return comment;
        });

        setComments(updatedComments);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const toggleReplies = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId ? { ...comment, showReplies: 
        !comment.showReplies } : comment
    ));
    const selectedComment = comments.find(comment => comment.id === commentId);
    if (!selectedComment.replies || selectedComment.replies.length === 0) {
      fetchReplies(commentId);
    }
  };
  
  return (
    <div className="comments-section">
      <div className="comment-list">
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-user-icon">{comment.username.charAt(0).toUpperCase()}</div>
              <div className="comment-details">
                <div className="comment-header">
                  <span className="username">{comment.username}</span>
                  <span className="timestamp">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>

                
                
                <Button onClick={() => setActiveComment(comment.id)}>Reply</Button>

                <Button onClick={() => toggleReplies(comment.id)}>
                  {comment.showReplies ? 'Hide Replies' : `View Replies`}
                </Button>

                {comment.showReplies && comment.replies.map((reply) => (
                  <div key={reply.id} className="comment">
                    <div className="comment-user-icon">{reply.username.charAt(0).toUpperCase()}</div>
                    <div className="comment-details">
                      <div className="comment-header">
                        <span className="username">{reply.username}</span>
                        <span className="timestamp">{reply.timestamp}</span>
                      </div>
                      <p className="comment-text">{reply.text}</p>
                    </div>
                  </div>
                ))}

                
                {activeComment === comment.id && (
                  <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="comment-form">
                    <TextField
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      label="Add a reply"
                      variant="outlined"
                      multiline
                      rows={1}
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReplySubmit(e, comment.id);
                        }
                      }}
                    />
                    
                    <IconButton type="submit" aria-label="send" color="primary">
                      <SendIcon />
                    </IconButton>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No comments yet. Be the first to comment!</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="comment-form">
        <TextField
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          label="Add a comment"
          variant="outlined"
          multiline
          rows={1}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); 
              handleSubmit(e);
            }
          }}
        />
        <IconButton type="submit" aria-label="send" color="primary">
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default Comments;



