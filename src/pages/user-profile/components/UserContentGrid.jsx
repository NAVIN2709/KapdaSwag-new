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
  query,
  where,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { deleteCloudinaryByUrl } from "functions/Userfunctions";

const UserContentGrid = ({ onContentClick }) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBrand, setIsBrand] = useState(false);

  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        setIsBrand(!!userData.isBrand);

        // Fetch both regardless of isBrand
        const [products, comments] = await Promise.all([
          fetchBrandProducts(authUser.uid),
          fetchUserComments(authUser.uid),
        ]);

        // Merge into single list
        setItems([...products, ...comments]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser]);

  const fetchBrandProducts = async (uid) => {
    const q = query(collection(db, "products"), where("createdBy", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      type: "product",
    }));
  };

  const fetchUserComments = async (uid) => {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const commentsList = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const productId = docSnap.id;

      const userTextComments = (data.comments?.text || []).filter(
        (c) => c.userId === uid && c.imageBase64
      );
      const userVideoComments = (data.comments?.video || []).filter(
        (c) => c.userId === uid && c.videoUrl
      );

      userTextComments.forEach((comment) => {
        commentsList.push({
          id: `${productId}-text-${Math.random()}`,
          productId,
          type: "image",
          media: comment.imageBase64,
          title: comment.comment || "",
          productTitle: data.name || "Untitled",
          originalComment: comment,
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

    return commentsList;
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      let mediaUrl = null;

      if (isBrand && item.type === "product" && item.image) {
        mediaUrl = item.image;
      } else if (
        !isBrand &&
        (item.type === "image" || item.type === "video") &&
        item.media
      ) {
        mediaUrl = item.media;
      }

      // If there's a Cloudinary URL, delete from Cloudinary
      if (mediaUrl) {
        await deleteCloudinaryByUrl(mediaUrl);
      }

      // Delete from Firestore
      if (isBrand && item.type === "product") {
        await deleteDoc(doc(db, "products", item.id));
        setItems((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        const productRef = doc(db, "products", item.productId);
        await updateDoc(productRef, {
          [`comments.${item.commentType}`]: arrayRemove(item.originalComment),
        });
        setItems((prev) => prev.filter((c) => c.id !== item.id));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Camera" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Posts</h3>
        <p className="text-muted-foreground text-center mb-6">
          {isBrand
            ? "You haven't posted any products yet."
            : "You haven't posted anything yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative bg-card rounded-xl overflow-hidden border border-border group"
          >
            <div
              onClick={() =>
                isBrand && item.type === "product"
                  ? navigate(`/product-detail/${item.id}`, { state: { product: item } })
                  : onContentClick(item)
              }
              className="aspect-square relative overflow-hidden bg-muted/20 cursor-pointer"
            >
              {item.type === "video" ? (
                <video
                  src={item.media}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={item.type === "product" ? item.image : item.media}
                  alt={item.name || item.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                {isBrand && item.type === "product"
                  ? "Product"
                  : item.type === "image"
                  ? "Image Comment"
                  : "Video Comment"}
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground truncate">
                  {item.productTitle || item.name}
                </p>
                {item.title && (
                  <p className="text-sm text-foreground truncate">
                    {item.title}
                  </p>
                )}
                {item.price && (
                  <p className="text-sm text-foreground truncate flex items-center">
                    <Icon name="IndianRupee" className="mr-1" size={15} />
                    {item.price}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 flex-shrink-0"
                title="Delete"
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
