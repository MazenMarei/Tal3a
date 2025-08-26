import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Video, Smile, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Picker from 'emoji-picker-react';

const CreatePostCard = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Close picker after selection
  };

  const handlePost = () => {
    if (content.trim() || image) {
      console.log('Post created:', { content, image });
      setContent('');
      setImage(null);
      setShowEmojiPicker(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-teal-100 w-full max-w-2xl mx-auto">
      <CardHeader className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12 border-2 border-teal-200">
            <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Mahmoud" />
            <AvatarFallback>MM</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-teal-900">Mahmoud Mohamed</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="relative">
          <Textarea
            placeholder="What's on your mind, Mahmoud?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-4 rounded-lg resize-none"
          />
          {image && (
            <div className="mt-2">
              <img src={image} alt="Uploaded preview" className="max-w-full h-48 object-cover rounded-lg shadow-md" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImage(null)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remove Image
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-4 flex-wrap">
            <label className="flex items-center cursor-pointer text-teal-600 hover:text-teal-800">
              <ImageIcon className="w-5 h-5 mr-2" />
              <span>Image</span>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-teal-600 hover:text-teal-800 flex items-center"
              >
                <Smile className="w-5 h-5 mr-2" />
                <span>Emoji</span>
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-10">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-800">
              <Mail className="w-5 h-5 mr-2" /> Message
            </Button>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-800">
              <Video className="w-5 h-5 mr-2" /> Video
            </Button>
          </div>
          <Button
            onClick={handlePost}
            disabled={!content.trim() && !image}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 transition-all duration-200 disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;