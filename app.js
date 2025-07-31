const posts = [
  {
    id: 1,
    likes: 50,
    comments: [
      { text: "Cool!", hasVideo: false },
      { text: "I tried this too", hasVideo: true },
    ]
  },
  {
    id: 2,
    likes: 30,
    comments: [
      { hasVideo: true },
      { hasVideo: true },
      { hasVideo: false }
    ]
  },
  {
    id: 3,
    likes: 80,
    comments: [
      { text: "nice dress", hasVideo: false },
      { hasVideo: true, text: "I've also bought one" },
      { hasVideo: true },
      { hasVideo: false }
    ]
  },
  {
    id: 4,
    likes: 10,
    comments: []
  },
  {
    id: 5,
    likes: 100,
    comments: [
      { hasVideo: false },
      { hasVideo: false },
      { hasVideo: false },
      { hasVideo: false }
    ]
  },
  {
    id: 6,
    likes: 20,
    comments: [
      { hasVideo: true },
      { hasVideo: true },
    ]
  },
  {
    id: 7,
    likes: 90,
    comments: [
      { hasVideo: true },
      { hasVideo: false },
      { hasVideo: false },
      { hasVideo: false }
    ]
  },
  {
    id: 8,
    likes: 45,
    comments: [
      { hasVideo: true },
      { hasVideo: true },
      { hasVideo: true },
      { hasVideo: true }
    ]
  },
  {
    id: 9,
    likes: 0,
    comments: [
      { hasVideo: false }
    ]
  },
  {
    id: 10,
    likes: 60,
    comments: [
      { hasVideo: true },
      { hasVideo: false }
    ]
  }
];

// Score calculation
function calculateScore(post) {
  const likeScore = post.likes * 2;
  const commentScore = post.comments.reduce((sum, c) => sum + (c.hasVideo ? 5 : 1), 0);
  return likeScore + commentScore;
}

// Sort posts by score
const sortedFeed = posts
  .map(post => ({ ...post, score: calculateScore(post) }))
  .sort((a, b) => b.score - a.score);

// Output
console.log("🔥 Ranked Feed:");
sortedFeed.forEach(p => {
  console.log(`Post ${p.id}: Score = ${p.score}`);
});
