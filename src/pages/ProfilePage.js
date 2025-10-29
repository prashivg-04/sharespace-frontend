import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Heart, MessageCircle, Edit2, Calendar, User, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [user.id, user.name]);

  const loadProfile = () => {
    const storedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    if (!storedProfiles[user.id]) {
      const newProfile = {
        userId: user.id,
        name: user.name,
        bio: 'A member of the ShareSpace community 🌟',
        joinDate: new Date().toISOString(),
        profilePicture: null,
      };
      storedProfiles[user.id] = newProfile;
      localStorage.setItem('userProfiles', JSON.stringify(storedProfiles));
      setProfile(newProfile);
    } else {
      setProfile(storedProfiles[user.id]);
    }
  };

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userPosts = storedPosts.filter(post => post.user_id === user.id);
    setPosts(userPosts);

    const storedComments = JSON.parse(localStorage.getItem('comments') || '{}');
    setComments(storedComments);
  };

  const handleSendKindness = (postId) => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = storedPosts.map(p =>
      p.id === postId ? { ...p, kindness_count: p.kindness_count + 1 } : p
    );
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    
    const updatedUserPosts = posts.map(p =>
      p.id === postId ? { ...p, kindness_count: p.kindness_count + 1 } : p
    );
    setPosts(updatedUserPosts);
    toast.success('Kindness sent ❤️');
  };

  const handleOpenEditModal = () => {
    setEditForm({
      name: profile.name,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
    });
    setPreviewImage(profile.profilePicture);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profilePicture: reader.result });
        setPreviewImage(reader.result);
        setErrors({ ...errors, image: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditForm({ ...editForm, profilePicture: null });
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }

    if (editForm.bio && editForm.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    const storedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const updatedProfile = {
      ...profile,
      name: editForm.name.trim(),
      bio: editForm.bio.trim() || 'A member of the ShareSpace community 🌟',
      profilePicture: editForm.profilePicture,
    };

    storedProfiles[user.id] = updatedProfile;
    localStorage.setItem('userProfiles', JSON.stringify(storedProfiles));
    setProfile(updatedProfile);
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully! 🎉');
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8 ml-64">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Your personal space</p>
          </div>

          <Card className="p-8 bg-white/70 backdrop-blur-sm border-none shadow-xl mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-green-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User size={40} className="text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleOpenEditModal}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Bio</h3>
              <p className="text-gray-800">{profile.bio}</p>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{posts.length}</p>
                <p className="text-sm text-gray-600">Posts Shared</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">
                  {posts.reduce((sum, post) => sum + post.kindness_count, 0)}
                </p>
                <p className="text-sm text-gray-600">Kindness Received</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {Object.values(comments).flat().filter(c => 
                    posts.some(p => p.id === parseInt(Object.keys(comments).find(key => comments[key].includes(c))))
                  ).length}
                </p>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
            </div>
          </Card>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Posts</h2>
          </div>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-none shadow-lg">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-6">You haven't shared anything yet. Your thoughts and experiences matter!</p>
                  <Button
                    onClick={() => window.location.href = '/create'}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6"
                  >
                    Create Your First Post
                  </Button>
                </div>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
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
                      onClick={() => handleSendKindness(post.id)}
                      variant="ghost"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full"
                    >
                      <Heart size={20} fill={post.kindness_count > 0 ? 'currentColor' : 'none'} />
                      <span>{post.kindness_count}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                    >
                      <MessageCircle size={20} />
                      <span>{comments[post.id]?.length || 0}</span>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update your profile information. Changes will be saved to your device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-gray-700 font-semibold">
                Profile Picture
              </Label>
              <div className="flex items-center space-x-4">
                {previewImage ? (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-green-100"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User size={40} className="text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-colors shadow-md"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Image
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                  {errors.image && (
                    <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-semibold">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your name"
                className={`${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-semibold">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                className={`resize-none ${errors.bio ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <div className="flex justify-between items-center">
                <div>
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {editForm.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
