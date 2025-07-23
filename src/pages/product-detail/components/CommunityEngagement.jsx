import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunityEngagement = ({ productId }) => {
  const [activeTab, setActiveTab] = useState('questions');
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Kim',
        username: '@alexstyle',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      question: 'How does this fit compared to other brands? I usually wear M in Zara.',
      timestamp: '2 hours ago',
      answers: [
        {
          id: 1,
          user: {
            name: 'Sarah Chen',
            username: '@sarahstyle',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          answer: 'I also wear M in Zara and this M fits perfectly! Maybe even slightly more relaxed.',
          timestamp: '1 hour ago',
          helpful: 12,
          verified: true
        }
      ],
      likes: 8
    },
    {
      id: 2,
      user: {
        name: 'Jordan Martinez',
        username: '@jordanfits',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      question: 'Is this suitable for machine washing or dry clean only?',
      timestamp: '1 day ago',
      answers: [],
      likes: 3
    }
  ]);

  const stylingPosts = [
    {
      id: 1,
      user: {
        name: 'Emma Wilson',
        username: '@emmawears',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      caption: 'Styled this with vintage denim and chunky sneakers for a casual weekend look! 💫',
      tags: ['#casualstyle', '#weekendvibes', '#vintage'],
      likes: 234,
      comments: 18,
      timestamp: '3 days ago'
    },
    {
      id: 2,
      user: {
        name: 'Zoe Parker',
        username: '@zoestyle',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
      caption: 'Perfect for date night! Paired with heels and statement jewelry ✨',
      tags: ['#datenight', '#dressy', '#elegant'],
      likes: 189,
      comments: 24,
      timestamp: '5 days ago'
    }
  ];

  const tabs = [
    { id: 'questions', label: 'Q&A', icon: 'MessageCircle', count: questions.length },
    { id: 'styling', label: 'Styling', icon: 'Camera', count: stylingPosts.length }
  ];

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      const newQ = {
        id: questions.length + 1,
        user: {
          name: 'You',
          username: '@you',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        question: newQuestion,
        timestamp: 'Just now',
        answers: [],
        likes: 0
      };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
    }
  };

  const handleLikeQuestion = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, likes: q.likes + 1 } : q
    ));
  };

  const handleLikePost = (postId) => {
    console.log('Liked styling post:', postId);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/20 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span className="font-medium">{tab.label}</span>
            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Ask Question Form */}
          <div className="bg-card/50 rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-foreground mb-3">Ask a Question</h4>
            <form onSubmit={handleSubmitQuestion} className="space-y-3">
              <Input
                type="text"
                placeholder="What would you like to know about this product?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full"
              />
              <Button 
                type="submit" 
                disabled={!newQuestion.trim()}
                className="w-full"
              >
                Ask Question
              </Button>
            </form>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="bg-card/30 rounded-lg p-4 border border-border">
                <div className="flex items-start space-x-3 mb-3">
                  <Image
                    src={question.user.avatar}
                    alt={question.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground">{question.user.name}</span>
                      <span className="text-sm text-muted-foreground">{question.user.username}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{question.timestamp}</span>
                    </div>
                    <p className="text-foreground">{question.question}</p>
                  </div>
                </div>

                {/* Question Actions */}
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handleLikeQuestion(question.id)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-error transition-colors"
                  >
                    <Icon name="Heart" size={16} />
                    <span className="text-sm font-mono">{question.likes}</span>
                  </button>
                  <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Answer
                  </button>
                </div>

                {/* Answers */}
                {question.answers.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="flex items-start space-x-3">
                        <Image
                          src={answer.user.avatar}
                          alt={answer.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-foreground text-sm">{answer.user.name}</span>
                            {answer.verified && (
                              <Icon name="BadgeCheck" size={14} className="text-primary" />
                            )}
                            <span className="text-xs text-muted-foreground">{answer.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{answer.answer}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors">
                              <Icon name="ThumbsUp" size={12} />
                              <span className="text-xs font-mono">{answer.helpful}</span>
                            </button>
                            <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">How Others Styled It</h4>
            <p className="text-sm text-muted-foreground">Get inspiration from the community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stylingPosts.map((post) => (
              <div key={post.id} className="bg-card/30 rounded-lg overflow-hidden border border-border">
                <div className="aspect-square relative">
                  <Image
                    src={post.image}
                    alt={`Styling by ${post.user.name}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-black/20 backdrop-blur-xs rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                  >
                    <Icon name="Heart" size={16} />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Image
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <span className="font-medium text-foreground text-sm">{post.user.name}</span>
                      <p className="text-xs text-muted-foreground">{post.user.username}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">{post.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3">{post.caption}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={14} />
                      <span className="text-xs font-mono">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={14} />
                      <span className="text-xs font-mono">{post.comments}</span>
                    </div>
                    <button className="text-xs hover:text-foreground transition-colors">
                      View Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Share Your Style
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityEngagement;