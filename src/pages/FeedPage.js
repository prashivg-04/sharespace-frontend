import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Heart, MessageCircle, Plus, Filter } from 'lucide-react';

const categories = ['All', 'Academics', 'Relationships', 'Self-doubt', 'Motivation'];

const FeedPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      const url = selectedCategory === 'All' 
        ? `${API}/posts`
        : `${API}/posts?category=${selectedCategory}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const fetchComments = async (postId) => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setComments(prev => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSendKindness = async (postId) => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      await axios.post(`${API}/posts/${postId}/kindness`, {}, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      toast.success('Kindness sent ❤️');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to send kindness');
    }
  };

  const handlePostComment = async (postId) => {
    if (!commentText.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('session_token');
      await axios.post(`${API}/posts/${postId}/comments`, {
        content: commentText
      }, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      toast.success('Comment posted successfully');
      setCommentText('');
      fetchComments(postId);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post comment. Please ensure your comment is supportive.');
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Community Feed</h1>
              <p className="text-gray-600">Share your heart, find your tribe</p>
            </div>
            <Button
              data-testid="create-post-btn"
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Create Post
            </Button>
          </div>

          {/* Filter */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  data-testid={`filter-${category.toLowerCase()}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-none shadow-lg">
                <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
                  data-testid={`post-${post.id}`}
                  className="p-6 bg-white/70 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{post.mood_emoji}</span>
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-1">
                          {post.category}
                        </Badge>
                        <p className="text-sm text-gray-500">by {post.anonymous_id}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-800 text-lg mb-6 leading-relaxed">{post.content}</p>

                  <div className="flex items-center space-x-4">
                    <Button
                      data-testid={`kindness-btn-${post.id}`}
                      onClick={() => handleSendKindness(post.id)}
                      variant="ghost"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full"
                    >
                      <Heart size={20} fill={post.kindness_count > 0 ? 'currentColor' : 'none'} />
                      <span>{post.kindness_count}</span>
                    </Button>

                    <Button
                      data-testid={`comments-btn-${post.id}`}
                      onClick={() => toggleComments(post.id)}
                      variant="ghost"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                    >
                      <MessageCircle size={20} />
                      <span>{comments[post.id]?.length || 0}</span>
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === post.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200" data-testid={`comments-section-${post.id}`}>
                      <h4 className="font-semibold text-gray-800 mb-4">Supportive Comments</h4>
                      
                      {/* Comment Input */}
                      <div className="mb-4 space-y-2">
                        <Textarea
                          data-testid={`comment-textarea-${post.id}`}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Share something supportive and kind..."
                          className="resize-none bg-white border-gray-200"
                          rows={3}
                        />
                        <Button
                          data-testid={`post-comment-btn-${post.id}`}
                          onClick={() => handlePostComment(post.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                        >
                          {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3">
                        {comments[post.id]?.length > 0 ? (
                          comments[post.id].map((comment) => (
                            <div
                              key={comment.id}
                              data-testid={`comment-${comment.id}`}
                              className="bg-green-50 p-4 rounded-lg"
                            >
                              <p className="text-sm text-gray-500 mb-1">by {comment.anonymous_id}</p>
                              <p className="text-gray-700">{comment.content}</p>
                              <span className="text-xs text-gray-500 mt-2 block">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No comments yet. Be the first to show support!</p>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;