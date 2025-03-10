// src/components/PostForm.js
import React, { useState, useEffect } from 'react';

function PostForm({ post, onSubmit, readOnly = false }) {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        body: post.body || ''
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;
    
    // Validate
    if (!formData.title.trim() || !formData.body.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="body">Content</label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          disabled={readOnly}
          rows="6"
          required
        />
      </div>
      
      {!readOnly && (
        <button type="submit" className="submit-button">
          {post ? 'Update Post' : 'Create Post'}
        </button>
      )}
    </form>
  );
}

export default PostForm;
