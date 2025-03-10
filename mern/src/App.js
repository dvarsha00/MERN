// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import Modal from './components/Modal';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      // Limit to first 10 posts for better performance
      setPosts(data.slice(0, 10));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setCurrentPost(null);
    setModalAction('add');
    setIsModalOpen(true);
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setModalAction('edit');
    setIsModalOpen(true);
  };

  const handleViewPost = (post) => {
    setCurrentPost(post);
    setModalAction('view');
    setIsModalOpen(true);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      // JSONPlaceholder doesn't actually delete resources on the server,
      // but it will respond as if it did. We'll update our UI accordingly.
      setPosts(posts.filter(post => post.id !== id));
      alert('Post deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let url = 'https://jsonplaceholder.typicode.com/posts';
      let method = 'POST';
      
      // If editing, change URL and method
      if (modalAction === 'edit' && currentPost) {
        url = `${url}/${currentPost.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          ...formData,
          userId: 1, // hardcoded for demo
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) throw new Error(`Failed to ${modalAction === 'add' ? 'create' : 'update'} post`);
      
      const data = await response.json();
      
      if (modalAction === 'add') {
        // JSONPlaceholder doesn't actually save new posts, but returns what would be saved
        // We'll add the new post to our local state with a unique ID
        const newPost = {
          ...data,
          id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1
        };
        setPosts([newPost, ...posts]);
        alert('Post created successfully!');
      } else {
        // Update existing post in state
        setPosts(posts.map(post => post.id === currentPost.id ? { ...post, ...formData } : post));
        alert('Post updated successfully!');
      }
      
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>JSONPlaceholder CRUD App</h1>
        <button className="add-button" onClick={handleAddPost}>
          Add New Post
        </button>
      </header>

      {error && <div className="error">Error: {error}</div>}
      
      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <PostList 
          posts={posts}
          onView={handleViewPost}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>{modalAction === 'add' ? 'Add New Post' : modalAction === 'edit' ? 'Edit Post' : 'View Post'}</h2>
          <PostForm 
            post={currentPost}
            onSubmit={handleSubmit}
            readOnly={modalAction === 'view'}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;

