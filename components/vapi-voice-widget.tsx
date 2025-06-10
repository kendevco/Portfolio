"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface VapiWidgetProps {
  assistantId?: string;
  publicKey?: string;
  className?: string;
}

export default function VapiVoiceWidget({ 
  assistantId = process.env.NEXT_PUBLIC_VAPI_AGENT_ID || 'e9675026-b11b-4615-b4f0-8fd1fe5a87a6',
  publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'b42e5bf6-ca87-4564-9c03-7beef93c25e3',
  className = ""
}: VapiWidgetProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callStatus, setCallStatus] = useState<'inactive' | 'connecting' | 'connected' | 'ended'>('inactive');
  const [conversation, setConversation] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Audio visualization
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Create dynamic wave based on volume and speaking state
    const centerY = height / 2;
    const amplitude = isSpeaking ? 30 + (volumeLevel * 50) : 10 + (volumeLevel * 20);
    const frequency = 0.02;
    const speed = Date.now() * 0.005;

    // Main wave
    ctx.beginPath();
    ctx.strokeStyle = isConnected ? 
      (isSpeaking ? '#10b981' : '#3b82f6') : 
      '#6b7280';
    ctx.lineWidth = 3;

    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin(x * frequency + speed) * amplitude * (isConnected ? 1 : 0.3);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Secondary waves for more dynamic effect
    if (isConnected) {
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.strokeStyle = isSpeaking ? 
          `rgba(16, 185, 129, ${0.3 / i})` : 
          `rgba(59, 130, 246, ${0.3 / i})`;
        ctx.lineWidth = 2 / i;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency * (1 + i * 0.5) + speed * (1 + i * 0.3)) * amplitude * 0.7;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    }

    animationRef.current = requestAnimationFrame(drawVisualization);
  }, [isConnected, isSpeaking, volumeLevel]);

  useEffect(() => {
    drawVisualization();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawVisualization]);

  const initializeVapi = useCallback(() => {
    if (!publicKey) {
      toast.error('Vapi public key is required');
      return null;
    }

    const vapiInstance = new Vapi(publicKey);

    // Enhanced event listeners with latest Vapi features
    vapiInstance.on('call-start', () => {
      console.log('📞 Call started');
      setCallStatus('connected');
      setIsConnected(true);
      toast.success('Connected! Start speaking...', { duration: 2000 });
    });

    vapiInstance.on('call-end', () => {
      console.log('📞 Call ended');
      setCallStatus('ended');
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setVolumeLevel(0);
      toast.success('Call ended');
    });

    vapiInstance.on('speech-start', () => {
      console.log('🎤 User started speaking');
      setIsListening(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('🎤 User stopped speaking');
      setIsListening(false);
    });



    vapiInstance.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapiInstance.on('message', (message: any) => {
      console.log('💬 Message:', message);
      setConversation(prev => [...prev, message]);
      
      // Handle different message types
      if (message.type === 'transcript' && message.role === 'user') {
        console.log('👤 User said:', message.transcript);
      } else if (message.type === 'transcript' && message.role === 'assistant') {
        console.log('🤖 Assistant said:', message.transcript);
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('❌ Vapi error:', error);
      
      // Handle empty error objects gracefully
      const errorMessage = error?.message || error?.error || error?.details || 'Connection issue occurred';
      
      // Don't show toast for expected call terminations
      if (!errorMessage.includes('Meeting has ended') && !errorMessage.includes('ejection')) {
        toast.error(`Error: ${errorMessage}`);
      }
      
      setCallStatus('ended');
      setIsConnected(false);
    });

    // Note: Tool calls are handled by VAPI directly via webhooks

    return vapiInstance;
  }, [publicKey]);

  const startCall = useCallback(async () => {
    try {
      setCallStatus('connecting');
      const vapiInstance = vapi || initializeVapi();
      
      if (!vapiInstance) {
        setCallStatus('inactive');
        return;
      }

      setVapi(vapiInstance);

      // Start the call with the assistant
      await vapiInstance.start(assistantId);
      
    } catch (error: any) {
      console.error('Failed to start call:', error);
      toast.error(`Failed to start call: ${error.message}`);
      setCallStatus('inactive');
    }
  }, [vapi, initializeVapi, assistantId]);

  const endCall = useCallback(() => {
    if (vapi) {
      vapi.stop();
      setVapi(null);
    }
  }, [vapi]);

  const getButtonContent = () => {
    switch (callStatus) {
      case 'connecting':
        return (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            <span>Connecting...</span>
          </>
        );
      case 'connected':
        return (
          <>
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </>
        );
      default:
        return (
          <>
            <Mic className="w-5 h-5" />
            <span>Talk to KenDev</span>
          </>
        );
    }
  };

  const getButtonStyle = () => {
    const baseStyle = "group relative overflow-hidden px-8 py-4 flex items-center gap-3 rounded-full outline-none focus:scale-105 hover:scale-105 active:scale-95 transition-all duration-200 font-medium text-lg shadow-lg";
    
    switch (callStatus) {
      case 'connecting':
        return `${baseStyle} bg-yellow-500 hover:bg-yellow-600 text-white cursor-wait`;
      case 'connected':
        return `${baseStyle} bg-red-500 hover:bg-red-600 text-white animate-pulse`;
      default:
        return `${baseStyle} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white`;
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Audio Visualization */}
      {isConnected && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={120}
            className="rounded-lg bg-gray-900/10 dark:bg-gray-100/10"
          />
          
          {/* Status indicators */}
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            {isListening && (
              <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                <Mic className="w-3 h-3" />
                <span>Listening</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span>Speaking</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Call Button */}
      <button
        onClick={isConnected ? endCall : startCall}
        disabled={callStatus === 'connecting'}
        className={getButtonStyle()}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        
        {getButtonContent()}
      </button>

      {/* Status text */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {callStatus === 'inactive' && "Click to start a voice conversation"}
        {callStatus === 'connecting' && "Initializing voice connection..."}
        {callStatus === 'connected' && "Voice conversation active"}
        {callStatus === 'ended' && "Conversation ended"}
      </div>

      {/* Quick info */}
      {callStatus === 'inactive' && (
        <div className="text-center max-w-md text-sm text-gray-500 dark:text-gray-400">
          <p>Ask about my projects, experience, or schedule a consultation</p>
        </div>
      )}
    </div>
  );
} 