import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  collection,
  getDocs,
  increment,
  arrayUnion,
  arrayRemove,
  where,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

// Function to save user data to the 'users' collection
export const saveUserData = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        ...userData,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

// Function to get user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

//Function to update UserData in Firestore
export const updateUserDetails = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    const swipeRef = doc(db, "user-swipedata", uid);
    await updateDoc(userRef, userData, { merge: true });
    await updateDoc(
      swipeRef,
      { interests: userData.interests },
      { merge: true }
    );
    console.log(userData.bio);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// Function to get matched friends
export const getFriends = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const matchedFriendIds = Array.isArray(userData.matched)
      ? userData.matched
      : [];

    const matchedFriends = [];
    for (const friendId of matchedFriendIds) {
      const friendDoc = await getDoc(doc(db, "users", friendId));
      const friendProfileDoc = await getDoc(
        doc(db, "user-swipedata", friendId)
      );

      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const friendProfileData = friendProfileDoc.exists()
          ? friendProfileDoc.data()
          : {};

        matchedFriends.push({
          id: friendId,
          ...friendData,
          profilePic:
            friendData.profilePic ||
            friendProfileData.profilePic ||
            "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        });
      }
    }

    return matchedFriends;
  } catch (error) {
    console.error("Error getting matched friends:", error);
    throw error;
  }
};

// Function to send a friend request
export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const senderRef = doc(db, "users", senderId);
    const receiverRef = doc(db, "users", receiverId);

    // Get current data
    const senderDoc = await getDoc(senderRef);
    const receiverDoc = await getDoc(receiverRef);

    if (!senderDoc.exists() || !receiverDoc.exists()) {
      throw new Error("User not found");
    }

    const senderData = senderDoc.data();
    const receiverData = receiverDoc.data();

    // Initialize arrays if they don't exist
    const senderSentRequests = Array.isArray(senderData.sentRequests)
      ? senderData.sentRequests
      : [];
    const senderMatched = Array.isArray(senderData.matched)
      ? senderData.matched
      : [];
    const receiverIncomingRequests = Array.isArray(
      receiverData.incomingRequests
    )
      ? receiverData.incomingRequests
      : [];

    // Check if request already exists or if they're already friends
    if (
      senderSentRequests.includes(receiverId) ||
      senderMatched.includes(receiverId)
    ) {
      throw new Error("Friend request already sent or already friends");
    }

    // Update sender's sent requests
    await updateDoc(senderRef, {
      sentRequests: [...senderSentRequests, receiverId],
    });

    // Update receiver's incoming requests
    await updateDoc(receiverRef, {
      incomingRequests: [...receiverIncomingRequests, senderId],
    });

    return true;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

// Function to cancel a sent friend request
export const cancelFriendRequest = async (senderId, receiverId) => {
  try {
    const senderRef = doc(db, "users", senderId);
    const receiverRef = doc(db, "users", receiverId);

    // Get current user documents
    const senderDoc = await getDoc(senderRef);
    const receiverDoc = await getDoc(receiverRef);

    if (!senderDoc.exists() || !receiverDoc.exists()) {
      throw new Error("User not found");
    }

    const senderData = senderDoc.data();
    const receiverData = receiverDoc.data();

    const senderSentRequests = senderData.sentRequests || [];
    const receiverIncomingRequests = receiverData.incomingRequests || [];

    // Check if the request exists before removing
    if (!senderSentRequests.includes(receiverId)) {
      throw new Error("No friend request found to cancel");
    }

    // Remove receiverId from sender's sentRequests
    await updateDoc(senderRef, {
      sentRequests: arrayRemove(receiverId),
    });

    // Remove senderId from receiver's incomingRequests
    await updateDoc(receiverRef, {
      incomingRequests: arrayRemove(senderId),
    });

    console.log("Friend request cancelled");
    return true;
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    throw error;
  }
};

// Function to remove a friend
export const removeFriend = async (userId1, userId2) => {
  try {
    const userRef1 = doc(db, "users", userId1);
    const userRef2 = doc(db, "users", userId2);

    // Fetch documents
    const userDoc1 = await getDoc(userRef1);
    const userDoc2 = await getDoc(userRef2);

    if (!userDoc1.exists() || !userDoc2.exists()) {
      throw new Error("User not found");
    }

    const userData1 = userDoc1.data();
    const userData2 = userDoc2.data();

    const matched1 = Array.isArray(userData1.matched) ? userData1.matched : [];
    const matched2 = Array.isArray(userData2.matched) ? userData2.matched : [];

    // Check if they are actually friends
    if (!matched1.includes(userId2) || !matched2.includes(userId1)) {
      throw new Error("Users are not friends");
    }

    // Remove each other from 'matched'
    await updateDoc(userRef1, {
      matched: matched1.filter((id) => id !== userId2),
    });

    await updateDoc(userRef2, {
      matched: matched2.filter((id) => id !== userId1),
    });

    return true;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

// Get products from firestore
export const getProducts = async () => {
  try {
    // You can order products by createdAt if needed
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
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
      likes: increment(1),
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
      savedProducts: arrayUnion(product.id), // store only the product ID for efficiency
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
      savedProducts: arrayRemove(product.id),
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
      savedProducts: arrayRemove(productId),
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
      savedProducts: arrayUnion(productId), // store only the product ID for efficiency
    });
  } catch (error) {
    console.error("❌ Error saving product:", error);
  }
};

//Get all Events
export const getEvents = async () => {
  try {
    // You can order products by createdAt if needed
    const q = query(collection(db, "events"));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

//Get User Joined Events
export const getJoinedEvents = async (userId) => {
  try {
    if (!userId) throw new Error("No authenticated user");

    // Query events where participants array contains userId
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("participants", "array-contains", userId));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return events;
  } catch (error) {
    console.error("Error fetching joined events:", error);
    return [];
  }
};

//Join new Event
export const joinEvent = async (eventId, userId) => {
  try {
    if (!userId) throw new Error("No authenticated user");

    const userRef = doc(db, "users", userId);
    const eventRef = doc(db, "events", eventId);

    // Update both user and event
    await Promise.all([
      updateDoc(userRef, {
        joinedEvents: arrayUnion(eventId), // add event to user's joined list
      }),
      updateDoc(eventRef, {
        participants: arrayUnion(userId), // add user to event's participants
        applicants: increment(1),
      }),
    ]);
    console.log("event joined");
    return true;
  } catch (error) {
    console.error("❌ Error joining event:", error);
    return false;
  }
};

//Get Event By Id
export const getEventById = async (eventId) => {
  const docRef = doc(db, "events", eventId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

//Create A New Event
export const createNewEvent = async (eventData) => {
  try {
    if (!eventData.title || !eventData.deadline) {
      throw new Error("Missing required fields: title, deadline");
    }

    const newEvent = {
      title: eventData.title,
      description: eventData.description || "",
      eventImage: eventData.eventImage || "", // Base64 string
      brandName: eventData.brandName || "",
      type: eventData.type || "Contest",
      reward: eventData.reward || "",
      location: eventData.location || "",
      applicants: eventData.applicants || 0,
      guidelines: eventData.guidelines || [],
      requirements: eventData.requirements || [],
      deadline: eventData.deadline,
      participants: [],
      createdAt: serverTimestamp(),
      hosted_by: eventData.hosted_by,
      brandLogo:eventData.brandLogo
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    return { id: docRef.id, ...newEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

//Delete an Event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);

    // Step 1: Delete all docs in "messages" subcollection
    const messagesRef = collection(eventRef, "messages");
    const messagesSnapshot = await getDocs(messagesRef);

    const messageDeletions = messagesSnapshot.docs.map((messageDoc) =>
      deleteDoc(messageDoc.ref)
    );
    await Promise.all(messageDeletions);

    // Step 2: Delete the main event document
    await deleteDoc(eventRef);

    console.log(`Event ${eventId} and its messages deleted`);
  } catch (error) {
    console.error("Error deleting event with messages:", error);
  }
};
