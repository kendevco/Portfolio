import React, { useState, useEffect, useCallback } from "react";
import Vapi from '@vapi-ai/web';
import Siriwave from 'react-siriwave';
import Image from "next/image";

export default function Microphone() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isListening, setListening] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>();
  const [userMedia, setUserMedia] = useState<MediaStream | null>();

  const toggleMicrophone = useCallback(async () => {
    if (microphone && userMedia) {
      setUserMedia(null);
      setMicrophone(null);

      microphone.stop();
      if (vapi) {
        vapi.stop();
      }
    } else {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);

      microphone.onstart = () => {
        setMicOpen(true);
        
        // if (vapi) {
        //   vapi.start({
        //     model: {
        //       provider: "openai",
              
        //       model: "gpt-3.5-turbo",
        //       messages: [
        //         {
        //           role: "system",
        //           content: "You are an assistant.",
        //         },
        //       ],
        //     },
        //     voice: {
        //       provider: "11labs",
        //       voiceId: "JBFqnCBsd6RMkjVDRZzb",
        //     },
        //     // ...
        //   });
        // }
        if (vapi) {
          vapi.start('e9675026-b11b-4615-b4f0-8fd1fe5a87a6');
        }

      };


      microphone.onstop = () => {
        setMicOpen(false);
        
        if (vapi) {
          vapi.stop();
        }
      };

      microphone.ondataavailable = (e) => {
        // You may need to adapt this part to send the audio data to Vapi
      };

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [microphone, userMedia, vapi]);

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.VAPI_PUBLIC_KEY || 'b42e5bf6-ca87-4564-9c03-7beef93c25e3');
    setVapi(vapiInstance);
  }, []);

  return (
<div className="flex flex-col items-center justify-center">      
  <button onClick={toggleMicrophone} className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10">
    Talk to my assistant
  </button>
  <Siriwave
    theme="ios9"
    autostart={micOpen}
  />
</div>

  );
}