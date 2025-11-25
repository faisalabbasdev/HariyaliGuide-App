
import React, { useRef, useEffect, useState } from 'react';
import { Send, Mic, Image as ImageIcon, Camera, Loader2, X, Volume2, VolumeX, ArrowDown } from 'lucide-react';
import { Message, Sender, Language, UserSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { Tooltip } from './Tooltip';
import { audioService } from '../services/audioService';

interface ChatInterfaceProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (text: string, image?: string) => void;
  onRecordVoice: () => void;
  onStopRecordVoice: () => void;
  isRecording: boolean;
  lang: Language;
  settings: UserSettings;
  fontSizeClass: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isProcessing,
  onSendMessage,
  onRecordVoice,
  onStopRecordVoice,
  isRecording,
  lang,
  settings,
  fontSizeClass
}) => {
  const t = TRANSLATIONS[lang];
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isNearBottomRef = useRef(true); // Track if user was at bottom before update

  // Smart Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.sender === Sender.USER;

    // If user sent message or was already near bottom, auto scroll
    if (isUserMessage || isNearBottomRef.current) {
      scrollToBottom();
    } else if (messages.length > 0) {
        // User is looking at history and new msg arrived
        setShowScrollButton(true);
    }
  }, [messages]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // If user is within 100px of bottom, they are "at bottom"
    const isAtBottom = distanceFromBottom < 100;
    isNearBottomRef.current = isAtBottom;

    if (isAtBottom) {
      setShowScrollButton(false);
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
    setShowScrollButton(false);
  };

  // TTS Logic
  const toggleSpeech = (text: string, id: string) => {
    audioService.playClick();
    audioService.triggerHaptic();

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === Language.URDU ? 'ur-PK' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    
    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(id);
  };

  const handleSendClick = () => {
    if (!inputText.trim() && !selectedImage) return;
    audioService.playClick();
    audioService.triggerHaptic();
    onSendMessage(inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Clear value to allow re-selecting same file if needed
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative">
      {/* Chat List */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-green-600 dark:text-green-400" />
                 </div>
                 <p className={`text-center px-10 font-medium dark:text-gray-300 ${fontSizeClass}`}>{t.greeting}</p>
             </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[85%] relative ${msg.sender === Sender.USER ? 'bg-green-600 text-white rounded-2xl rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700'} p-4 shadow-sm transition-all hover:shadow-md`}>
              
              {/* Message Content */}
              {msg.image && (
                <img src={msg.image} alt="Upload" className="w-full max-h-60 object-cover rounded-xl mb-3 bg-gray-100 dark:bg-gray-700" />
              )}
              
              <p className={`${fontSizeClass} whitespace-pre-wrap ${lang === Language.URDU ? 'font-urdu leading-loose text-right' : 'leading-relaxed'}`}>
                {msg.text}
              </p>

              {/* Structured Data (Analysis) */}
              {msg.isAnalysis && msg.structuredData && (
                <div className="mt-4 space-y-3 animate-in fade-in duration-500">
                   <div className={`p-3 rounded-xl border-l-4 ${msg.structuredData.severity === 'High' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-200' : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-200'}`}>
                      <h3 className={`font-bold ${fontSizeClass}`}>{msg.structuredData.diseaseName}</h3>
                      <span className="text-xs font-bold uppercase opacity-70">{msg.structuredData.severity} {t.severity}</span>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                       <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.pesticides}</p>
                       <div className="flex flex-wrap gap-2">
                           {msg.structuredData.pesticides.map((p, idx) => (
                               <span key={idx} className={`bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-200 ${fontSizeClass}`}>{p}</span>
                           ))}
                       </div>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.instructions}</p>
                        <p className={`${fontSizeClass} text-gray-700 dark:text-gray-200 leading-relaxed ${lang === Language.URDU ? 'font-urdu leading-loose' : ''}`}>{msg.structuredData.instructions}</p>
                   </div>
                </div>
              )}

              {/* Metadata / Actions */}
              <div className="flex justify-between items-center mt-2 gap-2">
                  {msg.sender === Sender.BOT && (
                     <button 
                        onClick={() => toggleSpeech(msg.text + (msg.structuredData?.instructions || ""), msg.id)}
                        className="opacity-50 hover:opacity-100 transition-opacity p-1"
                        aria-label={speakingMessageId === msg.id ? t.stop : t.listen}
                     >
                        {speakingMessageId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                     </button>
                  )}
                  
                  <div className="flex items-center gap-1 ml-auto">
                      <span className="text-[10px] opacity-60">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === Sender.USER && (
                          <span className="text-[10px] opacity-80">
                             {msg.status === 'sending' ? '🕒' : '✓'}
                          </span>
                      )}
                  </div>
              </div>

            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <Loader2 size={18} className="animate-spin text-green-600" />
              <span className={`font-medium animate-pulse text-gray-600 dark:text-gray-300 ${fontSizeClass}`}>{t.analyzeCrop}</span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Button Overlay */}
      {showScrollButton && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
              <button 
                 onClick={() => { audioService.playClick(); scrollToBottom(); }}
                 className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce hover:bg-green-700"
              >
                  {t.newMessage} <ArrowDown size={14} />
              </button>
          </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 pb-safe">
         {selectedImage && (
            <div className="mb-3 relative inline-block animate-in zoom-in duration-200">
                <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-green-100 dark:border-green-800 shadow-sm" />
                <button 
                    onClick={() => { audioService.playClick(); setSelectedImage(null); }} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600"
                >
                    <X size={14}/>
                </button>
            </div>
         )}
        <div className="flex items-end gap-3">
          {/* Hidden Inputs for Gallery and Camera */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment" // Forces Camera on Mobile
            className="hidden"
            ref={cameraInputRef}
            onChange={handleImageSelect}
          />
          
          {/* Gallery Button */}
          <Tooltip text={t.sendImage} position="top">
            <button 
                onClick={() => { audioService.playClick(); fileInputRef.current?.click(); }}
                className="p-3 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
                <ImageIcon size={24} />
            </button>
          </Tooltip>

          {/* Camera Button */}
          <Tooltip text={t.takePhoto} position="top">
            <button 
                onClick={() => { audioService.playClick(); cameraInputRef.current?.click(); }}
                className="p-3 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
                <Camera size={24} />
            </button>
          </Tooltip>

          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typeMessage}
              className={`bg-transparent w-full outline-none resize-none max-h-24 ${fontSizeClass} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${lang === Language.URDU ? 'text-right font-urdu' : ''}`}
              rows={1}
              style={{ minHeight: '24px' }}
            />
          </div>

          {inputText.trim() || selectedImage ? (
            <button 
              onClick={handleSendClick}
              disabled={isProcessing}
              className="p-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send size={24} />
            </button>
          ) : (
            <Tooltip text={isRecording ? t.stop : t.sendVoice} position="top">
                <button 
                onMouseDown={onRecordVoice}
                onMouseUp={onStopRecordVoice}
                onTouchStart={onRecordVoice}
                onTouchEnd={onStopRecordVoice}
                className={`p-3 rounded-xl shadow-lg transition-all active:scale-95 ${isRecording ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                <Mic size={24} />
                </button>
            </Tooltip>
          )}
        </div>
        {isRecording && <p className="text-center text-xs text-red-500 mt-2 font-medium animate-pulse">{t.recording}</p>}
      </div>
    </div>
  );
};
