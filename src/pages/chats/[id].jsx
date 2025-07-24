import { useParams } from 'react-router-dom';
import ProfileHeader from '../chats/components/ProfileHeader';
import MessageInput from '../chats/components/MessageInput';
import clsx from 'clsx';

const ChatScreen = () => {
  const { id } = useParams();

  const user = {
    id,
    username: `User ${id}`,
    profilePicture: `https://i.pravatar.cc/150?img=${id}`,
  };

  const currentUserId = 'me';

  const messages = [
    {
      id: 1,
      senderId: 'me',
      text: 'Hey! How’s it going?',
      time: '10:35 AM',
    },
    {
      id: 2,
      senderId: id,
      text: 'All good! Check this out:',
      time: '10:36 AM',
    },
    {
      id: 3,
      senderId: id,
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d',
      time: '10:36 AM',
    },
    {
      id: 4,
      senderId: 'me',
      text: '🔥🔥🔥 Bro that’s sick!',
      time: '10:37 AM',
    },
    {
      id: 5,
      senderId: id,
      text: 'Thanks, clicked it yesterday evening.',
      time: '10:38 AM',
    },
    {
      id: 6,
      senderId: 'me',
      image: 'https://images.unsplash.com/photo-1581291519195-ef11498d1cf5',
      time: '10:39 AM',
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <ProfileHeader user={user} />
      <div className="flex-1 overflow-y-scroll p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={clsx(
                'flex flex-col',
                isMe ? 'self-end items-end' : 'self-start items-start'
              )}
            >
              <div
                className={clsx(
                  'rounded-lg px-4 py-2 text-sm',
                  isMe
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow'
                )}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Sent"
                    className="mt-2 rounded-lg max-h-64 object-cover"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {isMe ? 'You' : 'Them'} • {msg.time}
              </span>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatScreen;
