"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Settings, 
  X, 
  Bot, 
  User, 
  Loader2,
  Server,
  Hash,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Server {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface Message {
  id: string;
  content: string;
  isFromAI: boolean;
  timestamp: string;
  metadata?: any;
}

interface DiscordantChatProps {
  className?: string;
}

export function DiscordantChat({ className }: DiscordantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Discordant integration state
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isServerLoading, setIsServerLoading] = useState(false);
  const [isChannelLoading, setIsChannelLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchServers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedServer) {
      fetchChannels(selectedServer);
    }
  }, [selectedServer]);

  const fetchServers = async () => {
    setIsServerLoading(true);
    try {
      const response = await fetch('/api/discordant/servers');
      if (response.ok) {
        const data = await response.json();
        setServers(data);
        
        // Auto-select KenDev Home Portal if available
        const kendevServer = data.find((s: Server) => 
          s.name.toLowerCase().includes('kendev') || s.name.toLowerCase().includes('home')
        );
        if (kendevServer) {
          setSelectedServer(kendevServer.id);
        }
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to load servers');
    } finally {
      setIsServerLoading(false);
    }
  };

  const fetchChannels = async (serverId: string) => {
    setIsChannelLoading(true);
    try {
      const response = await fetch(`/api/discordant/channels?serverId=${serverId}`);
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
        
        // Auto-select website visitors channel if available
        const websiteChannel = data.find((c: Channel) => 
          c.name.toLowerCase().includes('website') || 
          c.name.toLowerCase().includes('visitor') ||
          c.name.toLowerCase().includes('chat')
        );
        if (websiteChannel) {
          setSelectedChannel(websiteChannel.id);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast.error('Failed to load channels');
    } finally {
      setIsChannelLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedServer || !selectedChannel) {
      if (!selectedServer || !selectedChannel) {
        toast.error('Please select a server and channel first');
      }
      return;
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: message,
      isFromAI: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/discordant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          serverId: selectedServer,
          channelId: selectedChannel,
          sessionId,
          visitorInfo: {
            name: "Website Visitor",
            ipAddress: null,
            userAgent: navigator.userAgent
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add success indicators
        const successBadges = [];
        if (result.discordantMessage) successBadges.push("📡 Discordant");
        if (result.n8nTriggered) successBadges.push("🤖 n8n");
        
        if (successBadges.length > 0) {
          toast.success(`Message sent! ${successBadges.join(" • ")}`);
        }

        // Simulate AI response (this would come from n8n webhook in real implementation)
        setTimeout(() => {
          const aiResponse: Message = {
            id: `ai_${Date.now()}`,
            content: "Thank you for your message! I've received it and will get back to you shortly. Your message has been logged in our Discordant system and our team has been notified.",
            isFromAI: true,
            timestamp: new Date().toISOString(),
            metadata: {
              discordantIntegration: true,
              n8nProcessed: result.n8nTriggered
            }
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedServerName = servers.find(s => s.id === selectedServer)?.name || "Select Server";
  const selectedChannelName = channels.find(c => c.id === selectedChannel)?.name || "Select Channel";

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Discordant Chat
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsConfigOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="text-xs">
              Connected to Discordant • Messages go to {selectedServerName} #{selectedChannelName}
            </DialogDescription>
          </DialogHeader>

          {/* Server/Channel Status */}
          <div className="px-4 py-2 bg-muted/30 border-b">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Server className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{selectedServerName}</span>
                <Hash className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{selectedChannelName}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {servers.length} servers
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-3 ${msg.isFromAI ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.isFromAI ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {msg.isFromAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className={`flex-1 ${msg.isFromAI ? '' : 'text-right'}`}>
                      <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                        msg.isFromAI 
                          ? 'bg-muted text-left' 
                          : 'bg-primary text-primary-foreground text-left'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        {msg.metadata?.discordantIntegration && (
                          <div className="mt-2 flex gap-1">
                            <Badge variant="secondary" className="text-xs">📡 Discordant</Badge>
                            {msg.metadata.n8nProcessed && (
                              <Badge variant="secondary" className="text-xs">🤖 n8n</Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing message...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedServer && selectedChannel 
                    ? "Type your message..." 
                    : "Configure server/channel first..."
                }
                className="min-h-[60px] resize-none"
                disabled={!selectedServer || !selectedChannel || isLoading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!message.trim() || !selectedServer || !selectedChannel || isLoading}
                className="self-end"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discordant Configuration</DialogTitle>
            <DialogDescription>
              Select the server and channel where messages will be sent
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Server</label>
              <Select value={selectedServer} onValueChange={setSelectedServer} disabled={isServerLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={isServerLoading ? "Loading servers..." : "Select a server"} />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        {server.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <Select 
                value={selectedChannel} 
                onValueChange={setSelectedChannel} 
                disabled={!selectedServer || isChannelLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedServer 
                      ? "Select a server first" 
                      : isChannelLoading 
                        ? "Loading channels..." 
                        : "Select a channel"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {channel.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsConfigOpen(false)} disabled={!selectedServer || !selectedChannel}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 