import { doc, setDoc, updateDoc, getDoc,query,collection,getDocs,increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase'; 

// Function to save user data to the 'users' collection
export const saveUserData = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      onboardingCompleted:true,
      updatedAt: new Date()
    }, { merge: true }); 

  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Function to get user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

//Function to update UserData in Firestore
export const updateUserDetails = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    const swipeRef = doc(db, "user-swipedata", uid);
    await updateDoc(userRef, userData, { merge: true });
    await updateDoc(swipeRef, { interests: userData.interests }, { merge: true });
    console.log(userData.bio);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// Function to get matched friends
export const getFriends = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const matchedFriendIds = Array.isArray(userData.matched) ? userData.matched : [];

    const matchedFriends = [];
    for (const friendId of matchedFriendIds) {
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      const friendProfileDoc = await getDoc(doc(db, 'user-swipedata', friendId));
      
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const friendProfileData = friendProfileDoc.exists() ? friendProfileDoc.data() : {};
        
        matchedFriends.push({
          id: friendId,
          ...friendData,
          profilePic: friendData.profilePic || friendProfileData.profilePic || "https://i.pravatar.cc/150?img=1"
        });
      }
    }

    return matchedFriends;
  } catch (error) {
    console.error('Error getting matched friends:', error);
    throw error;
  }
};

// Function to send a friend request
export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const senderRef = doc(db, 'users', senderId);
    const receiverRef = doc(db, 'users', receiverId);

    // Get current data
    const senderDoc = await getDoc(senderRef);
    const receiverDoc = await getDoc(receiverRef);

    if (!senderDoc.exists() || !receiverDoc.exists()) {
      throw new Error('User not found');
    }

    const senderData = senderDoc.data();
    const receiverData = receiverDoc.data();

    // Initialize arrays if they don't exist
    const senderSentRequests = Array.isArray(senderData.sentRequests) ? senderData.sentRequests : [];
    const senderMatched = Array.isArray(senderData.matched) ? senderData.matched : [];
    const receiverIncomingRequests = Array.isArray(receiverData.incomingRequests) ? receiverData.incomingRequests : [];

    // Check if request already exists or if they're already friends
    if (senderSentRequests.includes(receiverId) || senderMatched.includes(receiverId)) {
      throw new Error('Friend request already sent or already friends');
    }

    // Update sender's sent requests
    await updateDoc(senderRef, {
      sentRequests: [...senderSentRequests, receiverId]
    });

    // Update receiver's incoming requests
    await updateDoc(receiverRef, {
      incomingRequests: [...receiverIncomingRequests, senderId]
    });

    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Get products from firestore
export const getProducts = async () => {
  try {
    // You can order products by createdAt if needed
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(doc => ({
      id:doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

// Handle swipe right (increment likes in Firestore)
export const handleSwipe = async (product) => {
  try {
    if (!product?.id) {
      console.error("Product ID missing");
      return;
    }

    // Firestore document reference
    const productRef = doc(db, "products", product.id);

    // Increment likes count by 1
    await updateDoc(productRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error("❌ Error updating likes:", error);
  }
};

export const handleSave = async (userId, product) => {
  if (!userId) {
    console.error("❌ No user ID provided");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);

    // Save productId in savedProducts array
    await updateDoc(userRef, {
      savedProducts: arrayUnion(product.id) // store only the product ID for efficiency
    });

  } catch (error) {
    console.error("❌ Error saving product:", error);
  }
};

export const handleUnsave = async (userId, product) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      savedProducts: arrayRemove(product.id)
    });

  } catch (error) {
    console.error("❌ Error removing saved product:", error);
  }
};

//Get Product Details
export const getProductData = async (productId) => {
  try {
    if (!productId) throw new Error("❌ productId is required");

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.warn(`⚠️ Product not found: ${productId}`);
      return null;
    }

    return { id: productSnap.id, ...productSnap.data() };
  } catch (error) {
    console.error("❌ Error fetching product data:", error);
    return null;
  }
};

// Remove product from profile grid
export const handleUnsaveProduct = async (userId, productId) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      savedProducts: arrayRemove(productId)
    });

  } catch (error) {
    console.error("❌ Error removing saved product:", error);
  }
};

//Save a product to closet
export const handleSaveProduct = async (userId, productId) => {
  if (!userId) {
    console.error("❌ No user ID provided");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);

    // Save productId in savedProducts array
    await updateDoc(userRef, {
      savedProducts: arrayUnion(productId) // store only the product ID for efficiency
    });

  } catch (error) {
    console.error("❌ Error saving product:", error);
  }
};
