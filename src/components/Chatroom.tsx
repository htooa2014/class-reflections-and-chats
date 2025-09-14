import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages, ChatMessage } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('my-MM', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
};

const Chatroom: React.FC = () => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, deleteMessage } = useChatMessages();
  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authorName.trim()) return;

    await sendMessage(newMessage, authorName);
    setNewMessage('');
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">စာများ ရယူနေပါတယ်...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">အတန်းခန်း Chatroom</h2>
            <div className="ml-auto text-sm text-muted-foreground">
              {messages.length} စာများ
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>စာတစ်စောင်မှ မရှိသေးပါ</p>
                  <p className="text-sm">ပထမဆုံးစာကို ရေးပါ!</p>
                </div>
              ) : (
                messages.map((message: ChatMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.user_id && message.user_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.user_id && message.user_id === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.author_name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.created_at)}
                          </span>
                          {message.user_id && message.user_id === user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="သင့်နာမည်ရေးပါ..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="စာတစ်စောင်ရေးပါ..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  disabled={!authorName.trim()}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || !authorName.trim()}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatroom;