import React, { useState, useEffect, useCallback } from "react";
import Vapi from '@vapi-ai/web';
import Siriwave from 'react-siriwave';
import toast from 'react-hot-toast'; // Import the toast library

export default function Microphone() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startVapi = useCallback(async () => {
    try {
      const vapiInstance = new Vapi(process.env.VAPI_AGENT_ID || 'e9675026-b11b-4615-b4f0-8fd1fe5a87a6');
      vapiInstance.on('error', (error: any) => {
        toast.error(`Error: ${(error as Error).message}`);
      });
      setIsListening(true);
      setVapi(vapiInstance);
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  }, []);

  const stopVapi = useCallback(() => {
    if (vapi) {
      // Perform any necessary cleanup or confirmation here
      // For example, you can show a confirmation dialog before stopping the VAPI
      const confirmShutdown = window.confirm('Are you sure you want to stop the conversation?');
      if (confirmShutdown) {
        vapi.stop();
        setIsListening(false);
        setVapi(null);
      }
    }
  }, [vapi]);

  useEffect(() => {
    // Clean up the Vapi instance on component unmount
    return () => {
      if (vapi) {
        vapi.stop();
        setIsListening(false); // Update the isListening state
      }
    };
  }, [vapi]);

  return (
    <div className="flex flex-col items-center justify-center">
      {isListening ? (
        <div className="w-4/5">
          <Siriwave theme="ios9" autostart={isListening} />
        </div>
      ) : (
        <button
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          onClick={startVapi}
        >
          Start new conversation
        </button>
      )}
    </div>
  );
}