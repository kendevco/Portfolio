"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import SessionManager from '@/lib/session-manager';

interface DiscordantChatWidgetProps {
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  channelId?: string;
  title?: string;
  className?: string;
}

export default function DiscordantChatWidget({
  theme = 'light',
  position = 'bottom-right',
  channelId,
  title = 'Chat with Ken',
  className = ''
}: DiscordantChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatUrl, setChatUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize session tracking
    SessionManager.initialize();

    // Generate chat URL
    const visitorData = SessionManager.getVisitorDataForDiscordant();
    const baseUrl = process.env.NEXT_PUBLIC_DISCORDANT_URL;
    const defaultChannelId = process.env.NEXT_PUBLIC_DISCORDANT_PORTFOLIO_CHANNEL_ID;
    
    if (!baseUrl) {
      console.warn('Discordant URL not configured');
      return;
    }

    const params = new URLSearchParams({
      channelId: channelId || defaultChannelId || '',
      theme,
      visitorData: JSON.stringify(visitorData),
      embed: 'true',
      source: 'portfolio-widget'
    });

    setChatUrl(`${baseUrl}/embed/chat?${params}`);
  }, [channelId, theme]);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    
    if (!isOpen) {
      SessionManager.trackPageVisit(window.location.pathname, {
        chatOpened: true,
        chatOpenedAt: new Date().toISOString()
      });
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!chatUrl) {
    return null;
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={handleToggle}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className={`
          w-80 h-96 shadow-2xl border-0 overflow-hidden transition-all duration-300
          ${isMinimized ? 'h-12' : 'h-96'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
            <h3 className="font-semibold text-sm">{title}</h3>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMinimize}
                className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
                className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                aria-label="Close chat"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="h-full flex flex-col">
              {chatUrl ? (
                <iframe
                  src={chatUrl}
                  className="flex-1 border-0 w-full"
                  allow="microphone camera"
                  onLoad={() => setIsLoaded(true)}
                  title="Discordant Chat"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chat temporarily unavailable</p>
                    <p className="text-xs mt-1">Please try again later</p>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {!isLoaded && chatUrl && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Connecting to chat...</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="p-2 border-t bg-gray-50 text-center">
                <p className="text-xs text-gray-500">
                  Powered by Discordant • Real-time AI assistance
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Notification Badge (optional) */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          <span className="sr-only">New message</span>
          •
        </div>
      )}
    </div>
  );
}

// Utility component for specific use cases
export function ContactPageChatWidget() {
  return (
    <DiscordantChatWidget
      title="Get in Touch"
      position="bottom-right"
      theme="light"
    />
  );
}

export function ProjectsChatWidget() {
  return (
    <DiscordantChatWidget
      title="Ask about Projects"
      position="bottom-left"
      theme="light"
    />
  );
} 