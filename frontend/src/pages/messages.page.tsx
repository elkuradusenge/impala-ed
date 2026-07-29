import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth.hook';
import { useConversations, useMessages, useSendMessage } from '../hooks/use-messages.hook';
import { useUsers } from '../hooks/use-users.hook';
import LoadingSpinner from '../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faPlus, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { data: conversations, isLoading: convLoading } = useConversations();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const { data: messages, isLoading: msgLoading } = useMessages(selectedPartner || '');
  const sendMutation = useSendMessage();
  const { data: users } = useUsers();
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatPartner, setNewChatPartner] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;
    try {
      await sendMutation.mutateAsync({ receiver: selectedPartner, content: newMessage });
      setNewMessage('');
      toast.success('Message sent');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !newChatPartner) return;
    try {
      await sendMutation.mutateAsync({ receiver: newChatPartner, content: newMessage });
      setNewMessage('');
      setNewChatPartner('');
      setShowNewChat(false);
      setSelectedPartner(newChatPartner);
      toast.success('Message sent');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (convLoading) return <LoadingSpinner />;

  const otherUsers = (users || []).filter((u: any) => (u.id) !== (user?.id));

  return (
    <div className="flex gap-6 h-[75vh]">
      {/* Conversations */}
      <div className="w-80 shrink-0 card-white overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold font-display text-impala-charcoal">
            <FontAwesomeIcon icon={faCommentDots} className="mr-2 text-impala-brown" />
            Messages
          </h2>
          <button onClick={() => setShowNewChat(!showNewChat)} className="text-sm text-impala-brown hover:text-impala-brown-dark">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {showNewChat && (
          <form onSubmit={handleStartChat} className="mb-4 p-3 bg-impala-sand rounded-lg space-y-2">
            <select value={newChatPartner} onChange={(e) => setNewChatPartner(e.target.value)} className="input-field text-sm" required>
              <option value="">Select user...</option>
              {otherUsers.map((u: any) => (
                <option key={u.id || u._id} value={u.id || u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="input-field text-sm" required />
            <button type="submit" className="btn-primary w-full text-sm">Send</button>
          </form>
        )}

        {(!conversations || conversations.length === 0) ? (
          <p className="text-impala-charcoal-muted text-sm text-center py-8">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv: any, idx: number) => {
              const partnerId = conv.partner?.id || conv.partner?._id;
              return (
                <button key={idx} onClick={() => setSelectedPartner(partnerId)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPartner === partnerId ? 'bg-impala-brown/10 text-impala-brown' : 'hover:bg-impala-sand'
                  }`}>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm flex items-center space-x-2">
                      <FontAwesomeIcon icon={faUser} className="text-xs text-impala-charcoal-muted" />
                      <span>{conv.partner?.name}</span>
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-impala-brown text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-impala-charcoal-muted mt-1 truncate">{conv.lastMessage?.content?.slice(0, 50)}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Messages View */}
      <div className="flex-1 card-white flex flex-col">
        {selectedPartner ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {msgLoading ? (
                <LoadingSpinner size="sm" />
              ) : (!messages || messages.length === 0) ? (
                <p className="text-center text-impala-charcoal-muted py-12">No messages yet. Start a conversation!</p>
              ) : (
                messages.map((msg: any) => {
                  const isMine = (msg.sender?.id) === (user?.id);
                  return (
                    <div key={msg.id || msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        isMine ? 'bg-impala-brown text-white' : 'bg-impala-sand text-impala-charcoal'
                      }`}>
                        {msg.subject && <p className="text-xs font-medium mb-1 opacity-80">{msg.subject}</p>}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input type="text" placeholder="Type your message..." value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)} className="input-field flex-1" required />
              <button type="submit" className="btn-primary">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-impala-charcoal-muted">
            <div className="text-center">
              <FontAwesomeIcon icon={faCommentDots} className="text-4xl mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
