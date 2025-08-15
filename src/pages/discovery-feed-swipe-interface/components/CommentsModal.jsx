import React, { useState, useRef } from "react";
import Icon from "../../../components/AppIcon";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useAuth } from "context/AuthContext";
import axios from "axios";

const CommentsModal = ({ productId, comments, onClose, currentUser }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const uploadFileAndGetUrl = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "https://kapdaswag-upload.onrender.com/upload-comments",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.url;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() && !mediaFile) return;
    if (!currentUser?.username) {
      alert("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const productRef = doc(db, "products", productId);
      let mediaUrl = null;

      if (mediaFile) {
        mediaUrl = await uploadFileAndGetUrl(mediaFile);
        const isVideo = mediaFile.type.startsWith("video");

        if (isVideo) {
          await updateDoc(productRef, {
            "comments.video": arrayUnion({
              username: currentUser.username,
              videoUrl: mediaUrl,
              textcomment: newComment.trim() || "",
              rating,
              userId: user.uid,
            }),
          });
          comments.video = [
            ...(comments.video || []),
            {
              username: currentUser.username,
              videoUrl: mediaUrl,
              textcomment: newComment.trim() || "",
              rating,
              userId: user.uid,
            },
          ];
        } else {
          await updateDoc(productRef, {
            "comments.text": arrayUnion({
              username: currentUser.username,
              comment: newComment.trim(),
              imageUrl: mediaUrl,
              rating: rating,
              userId: user.uid,
            }),
          });
          comments.text = [
            ...(comments.text || []),
            {
              username: currentUser.username,
              comment: newComment.trim(),
              imageUrl: mediaUrl,
              rating: rating,
              userId: user.uid,
            },
          ];
        }
      } else {
        await updateDoc(productRef, {
          "comments.text": arrayUnion({
            username: currentUser.username,
            comment: newComment.trim(),
            rating: rating,
            userId: user.uid,
          }),
        });
        comments.text = [
          ...(comments.text || []),
          {
            username: currentUser.username,
            comment: newComment.trim(),
            rating: rating,
            userId: user.uid,
          },
        ];
      }

      setNewComment("");
      setMediaFile(null);
      setRating(0);
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
    setIsSubmitting(false);
  };

  // Render ★ emojis
  const renderStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-lg max-h-[85%] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-lg z-10">
          <h3 className="text-xl font-bold text-white tracking-wide">
            💬 Comments
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <Icon name="X" size={20} className="text-white" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Text Comments */}
          {comments?.text?.map((commentObj, index) => (
            <div
              key={`txt-${index}`}
              className="bg-white/10 p-3 rounded-2xl shadow-sm border border-white/10"
            >
              <p className="text-xs text-white/60 mb-1">
                @{commentObj.username}
              </p>

              {/* ⭐ Rating */}
              {commentObj.rating && (
                <div className="mb-1 text-yellow-400">
                  {renderStars(commentObj.rating)}
                </div>
              )}

              <p className="text-white text-sm">{commentObj.comment}</p>

              {commentObj.imageUrl && (
                <img
                  src={commentObj.imageUrl}
                  alt="comment media"
                  className="mt-2 rounded-lg max-h-52 object-cover shadow"
                />
              )}
            </div>
          ))}

          {/* Video Comments */}
          {comments?.video?.map((videoObj, index) => (
            <div
              key={`vid-${index}`}
              className="bg-white/10 p-3 rounded-2xl shadow-sm border border-white/10"
            >
              <p className="text-xs text-white/60 mb-1">@{videoObj.username}</p>

              {/* ⭐ Rating */}
              {videoObj.rating && (
                <div className="mb-1 text-yellow-400">
                  {renderStars(videoObj.rating)}
                </div>
              )}

              {videoObj.textcomment && (
                <p className="text-white text-sm mb-2">
                  {videoObj.textcomment}
                </p>
              )}
              <video
                src={videoObj.videoUrl}
                className="w-full rounded-lg shadow-lg"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}

          {!comments?.text?.length && !comments?.video?.length && (
            <p className="text-center text-white/50">No comments yet.</p>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/20 bg-white/10 backdrop-blur-lg flex flex-col gap-2">
          {/* Rating Selector */}
          <div className="flex gap-1 text-lg">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className="focus:outline-none text-yellow-500"
              >
                {i < rating ? "★" : "☆"}
              </button>
            ))}
          </div>

          {/* File + Comment Input */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <Icon name="Paperclip" size={18} className="text-white" />
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <textarea
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 resize-none px-3 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 text-sm focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
