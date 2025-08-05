import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { db } from "../../../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "context/AuthContext";

const UserContentGrid = ({ onContentClick }) => {
  const { user } = useAuth();
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserComments = async () => {
      try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

        const commentsList = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const productId = docSnap.id;

          const userTextComments = (data.comments?.text || []).filter(
            (c) => c.userId === user.uid && c.imageBase64
          );

          const userVideoComments = (data.comments?.video || []).filter(
            (c) => c.userId === user.uid && c.videoUrl
          );

          userTextComments.forEach((comment) => {
            commentsList.push({
              id: `${productId}-text-${Math.random()}`,
              productId,
              type: "image",
              media: comment.imageBase64,
              title: comment.comment || "",
              productTitle: data.name || "Untitled",
              originalComment: comment, // needed for deletion
              commentType: "text",
            });
          });

          userVideoComments.forEach((comment) => {
            commentsList.push({
              id: `${productId}-video-${Math.random()}`,
              productId,
              type: "video",
              media: comment.videoUrl,
              title: comment.textcomment || "",
              productTitle: data.name || "Untitled",
              originalComment: comment,
              commentType: "video",
            });
          });
        });

        setUserComments(commentsList);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [user]);

  const handleDelete = async (comment) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const productRef = doc(db, "products", comment.productId);

      await updateDoc(productRef, {
        [`comments.${comment.commentType}`]: arrayRemove(
          comment.originalComment
        ),
      });

      setUserComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (userComments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Camera" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Media Comments Yet
        </h3>
        <p className="text-muted-foreground text-center mb-6">
          You haven't posted any image or video comments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {userComments.map((item) => (
          <div
            key={item.id}
            className="relative bg-card rounded-xl overflow-hidden border border-border group"
          >
            <div
              onClick={() => onContentClick(item)}
              className="aspect-square relative overflow-hidden bg-muted/20"
            >
              {item.type === "image" ? (
                <Image
                  src={item.media}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.media}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}

              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                {item.type === "image" ? "Image Comment" : "Video Comment"}
              </div>
            </div>

            {/* Info + Delete */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground truncate">
                  {item.productTitle}
                </p>
                {item.title && (
                  <p className="text-sm text-foreground truncate">
                    {item.title}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 flex-shrink-0"
                title="Delete comment"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserContentGrid;
