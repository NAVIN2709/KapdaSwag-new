import React, { useState, useRef } from "react";
import Icon from "../../../components/AppIcon";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useAuth } from "context/AuthContext";

const CommentsModal = ({ productId, comments, onClose, currentUser }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAddComment = async () => {
    if (!newComment.trim() && !mediaFile) return;
    if (!currentUser?.username) {
      alert("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const productRef = doc(db, "products", productId);

      if (mediaFile) {
        const base64String = await fileToBase64(mediaFile);
        const isVideo = mediaFile.type.startsWith("video");

        if (isVideo) {
          await updateDoc(productRef, {
            "comments.video": arrayUnion({
              username: currentUser.username,
              videoUrl: base64String,
              textcomment: newComment.trim() || "",
              userId: user.uid,
            }),
          });
          comments.video = [
            ...(comments.video || []),
            {
              username: currentUser.username,
              videoUrl: base64String,
              textcomment: newComment.trim() || "",
              userId: user.uid,
            },
          ];
        } else {
          await updateDoc(productRef, {
            "comments.text": arrayUnion({
              username: currentUser.username,
              comment: newComment.trim(),
              imageBase64: base64String,
              userId: user.uid,
            }),
          });
          comments.text = [
            ...(comments.text || []),
            {
              username: currentUser.username,
              comment: newComment.trim(),
              imageBase64: base64String,
              userId: user.uid,
            },
          ];
        }
      } else {
        await updateDoc(productRef, {
          "comments.text": arrayUnion({
            username: currentUser.username,
            comment: newComment.trim(),
            userId: user.uid,
          }),
        });
        comments.text = [
          ...(comments.text || []),
          {
            username: currentUser.username,
            comment: newComment.trim(),
            userId: user.uid,
          },
        ];
      }
      setNewComment("");
      setMediaFile(null);
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
    setIsSubmitting(false);
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
          {comments?.text?.map((commentObj, index) => (
            <div
              key={`txt-${index}`}
              className="bg-white/10 p-3 rounded-2xl shadow-sm border border-white/10"
            >
              <p className="text-xs text-white/60 mb-1">
                @{commentObj.username}
              </p>
              <p className="text-white text-sm">{commentObj.comment}</p>
              {commentObj.imageBase64 && (
                <img
                  src={commentObj.imageBase64}
                  alt="comment media"
                  className="mt-2 rounded-lg max-h-52 object-cover shadow"
                />
              )}
            </div>
          ))}

          {comments?.video?.map((videoObj, index) => (
            <div
              key={`vid-${index}`}
              className="bg-white/10 p-3 rounded-2xl shadow-sm border border-white/10"
            >
              <p className="text-xs text-white/60 mb-1">@{videoObj.username}</p>
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
        <div className="p-3 border-t border-white/20 bg-white/10 backdrop-blur-lg flex items-center gap-2">
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
  );
};

export default CommentsModal;
