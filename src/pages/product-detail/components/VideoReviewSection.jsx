import React, { useState, useRef, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoReviewSection = ({ reviews }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const mockReviews = [
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        username: '@sarahstyle',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      rating: 5,
      title: 'Perfect fit and amazing quality!',
      content: `This dress is absolutely stunning! The fabric feels premium and the fit is perfect. I'm 5'6" and size M fits like a glove. Definitely recommend for special occasions.`,
      videoThumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      likes: 234,
      helpful: 89,
      timestamp: '2 days ago',
      verified: true,
      tags: ['#perfectfit', '#quality', '#recommended']
    },
    {
      id: 2,
      user: {
        name: 'Maya Rodriguez',
        username: '@mayafashion',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      rating: 4,
      title: 'Great style, runs a bit small',
      content: `Love the design and color! However, it runs smaller than expected. I usually wear M but had to exchange for L. The material is soft and comfortable once you get the right size.`,
      videoThumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      likes: 156,
      helpful: 67,
      timestamp: '1 week ago',
      verified: false,
      tags: ['#sizingissue', '#comfortable', '#stylish']
    },
    {
      id: 3,
      user: {
        name: 'Emma Thompson',
        username: '@emmastyle',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      rating: 5,
      title: 'Obsessed with this piece!',
      content: `This is my third purchase from this brand and they never disappoint! The attention to detail is incredible. Perfect for both casual and dressy occasions.`,
      videoThumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4',
      likes: 312,
      helpful: 124,
      timestamp: '3 days ago',
      verified: true,
      tags: ['#obsessed', '#versatile', '#quality']
    }
  ];

  const reviewData = reviews || mockReviews;
  const currentReview = reviewData[currentVideoIndex];

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = (reviewId) => {
    console.log('Liked review:', reviewId);
  };

  const handleHelpful = (reviewId) => {
    console.log('Marked helpful:', reviewId);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Video Reviews</h3>
        <span className="text-sm text-muted-foreground">{reviewData.length} reviews</span>
      </div>

      {/* Main Video Player */}
      <div className="relative aspect-[9/16] bg-muted/20 rounded-xl overflow-hidden max-w-sm mx-auto">
        <div className="relative w-full h-full">
          <Image
            src={currentReview.videoThumbnail}
            alt={`${currentReview.user.name} review`}
            className="w-full h-full object-cover"
          />
          
          {/* Play Button Overlay */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-xs text-white hover:bg-black/40 rounded-none"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center">
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
            </div>
          </Button>

          {/* Video Progress */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center space-x-2 text-white text-sm">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* User Info Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="flex items-center space-x-3">
              <Image
                src={currentReview.user.avatar}
                alt={currentReview.user.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{currentReview.user.name}</span>
                  {currentReview.verified && (
                    <Icon name="BadgeCheck" size={16} className="text-primary" />
                  )}
                </div>
                <span className="text-white/80 text-sm">{currentReview.user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star} 
                name="Star" 
                size={16} 
                className={star <= currentReview.rating ? 'text-warning' : 'text-muted-foreground'} 
                fill={star <= currentReview.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{currentReview.timestamp}</span>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">{currentReview.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{currentReview.content}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {currentReview.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleLike(currentReview.id)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-error transition-colors"
          >
            <Icon name="Heart" size={16} />
            <span className="text-sm font-mono">{currentReview.likes}</span>
          </button>
          <button
            onClick={() => handleHelpful(currentReview.id)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <Icon name="ThumbsUp" size={16} />
            <span className="text-sm">Helpful ({currentReview.helpful})</span>
          </button>
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
            <Icon name="Share" size={16} />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Review Thumbnails */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">All Reviews</h4>
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {reviewData.map((review, index) => (
            <button
              key={review.id}
              onClick={() => handleVideoClick(index)}
              className={`relative flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentVideoIndex 
                  ? 'border-primary scale-105' :'border-transparent hover:border-muted-foreground'
              }`}
            >
              <Image
                src={review.videoThumbnail}
                alt={`${review.user.name} review thumbnail`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Icon name="Play" size={16} className="text-white" />
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon 
                      key={star} 
                      name="Star" 
                      size={8} 
                      className={star <= review.rating ? 'text-warning' : 'text-white/50'} 
                      fill={star <= review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoReviewSection;