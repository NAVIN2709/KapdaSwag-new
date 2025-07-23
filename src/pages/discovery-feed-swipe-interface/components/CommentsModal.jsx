import React from 'react';
import Icon from '../../../components/AppIcon';

const CommentsModal = ({ comments, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg w-11/12 max-h-[80%] relative text-white flex flex-col">
        
        {/* Header (Sticky) */}
        <div className="flex justify-between items-center p-4 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-xl z-10">
          <h3 className="text-2xl font-semibold">Comments</h3>
          <button onClick={onClose} className="text-white hover:text-red-300">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-4 overflow-y-auto">
          {/* Text Comments */}
          {comments?.text?.map((commentObj, index) => (
            <div key={index} className="mb-4 border-b border-white/20 pb-3">
              <p className="text-sm text-white/80 font-semibold mb-1">@{commentObj.username}</p>
              <p className="text-base">{commentObj.comment}</p>
            </div>
          ))}

          {/* Video Comments */}
          {comments?.video?.map((videoObj, index) => (
            <div key={index} className="mb-5">
              <p className="text-sm text-white/80 font-semibold mb-2">@{videoObj.username}</p>
              <video
                src={videoObj.videoUrl}
                className="w-full h-[280px] object-cover rounded-xl shadow-md"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}

          {/* No Comments */}
          {(!comments?.text?.length && !comments?.video?.length) && (
            <p className="text-center text-white/70 mt-10">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
