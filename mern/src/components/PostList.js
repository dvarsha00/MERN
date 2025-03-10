import React from 'react';

function PostList({ posts, onView, onEdit, onDelete }) {
  if (posts.length === 0) {
    return <div className="no-posts">No posts found.</div>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}</p>
          <div className="post-actions">
            <button onClick={() => onView(post)} className="view-button">
              View
            </button>
            <button onClick={() => onEdit(post)} className="edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(post.id)} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
