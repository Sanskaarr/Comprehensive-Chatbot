"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Comprehensive place suggestions including Indian cities
const placeSuggestions = {
  "Paris": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"],
  "London": ["Big Ben", "Tower Bridge", "Buckingham Palace", "British Museum", "Hyde Park"],
  "New York": ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Broadway"],
  "Tokyo": ["Tokyo Tower", "Senso-ji Temple", "Shibuya Crossing", "Meiji Shrine", "Akihabara"],
  "Rome": ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon", "Roman Forum"],
  "Sydney": ["Sydney Opera House", "Bondi Beach", "Harbour Bridge", "Taronga Zoo", "Royal Botanic Garden"],
  "Delhi": ["India Gate", "Qutub Minar", "Red Fort", "Lotus Temple", "Humayun's Tomb"],
  "Mumbai": ["Gateway of India", "Marine Drive", "Chhatrapati Shivaji Maharaj Terminus", "Elephanta Caves", "Haji Ali Dargah"],
  "Bangalore": ["Bangalore Palace", "Cubbon Park", "Lalbagh Botanical Garden", "ISKCON Temple", "UB City Mall"],
  "Kolkata": ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum", "Belur Math"],
};

// Multilingual support including Hindi and other languages
const languages = {
  english: {
    greeting: "Welcome to our ticketing system! How can I assist you today?",
    askDestination: "Great! Where would you like to travel? You can choose from Paris, London, New York, Tokyo, Rome, Sydney, Delhi, Mumbai, Bangalore, or Kolkata.",
    askSpecificPlace: "Which place would you like to visit in this location?",
    askDate: "When would you like to travel? Please provide a date in DD/MM/YYYY format.",
    askGroupSize: "How many people will be traveling?",
    confirmation: (destination, place, date, groupSize) => `Your ticket is confirmed! Trip to ${place} in ${destination} on ${date} for ${groupSize} people.`,
    invalidDestination: "Please choose a valid destination from the list.",
    invalidDate: "Please enter a valid date in DD/MM/YYYY format.",
    invalidGroupSize: "Please enter a valid group size.",
    placeholder: "Type your message...",
    send: "Send",
    errorMessage: "An error occurred. Please try again.",
    loading: "Processing your request...",
  },
  hindi: {
    greeting: "हमारी टिकटिंग प्रणाली में आपका स्वागत है! मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
    askDestination: "बहुत अच्छा! आप कहाँ यात्रा करना चाहेंगे? आप पेरिस, लंदन, न्यूयॉर्क, टोक्यो, रोम, सिडनी, दिल्ली, मुंबई, बैंगलोर, या कोलकाता चुन सकते हैं।",
    askSpecificPlace: "आप इस स्थान पर कौन सी जगह देखना चाहेंगे?",
    askDate: "आप कब यात्रा करना चाहेंगे? कृपया तारीख DD/MM/YYYY प्रारूप में दें।",
    askGroupSize: "यात्रा करने वालों की संख्या कितनी होगी?",
    confirmation: (destination, place, date, groupSize) => `आपका टिकट बुक हो गया है! ${place} (${destination}) में ${date} को ${groupSize} लोगों के लिए।`,
    invalidDestination: "कृपया सूची में से सही गंतव्य चुनें।",
    invalidDate: "कृपया सही तारीख DD/MM/YYYY प्रारूप में दर्ज करें।",
    invalidGroupSize: "कृपया सही समूह आकार दर्ज करें।",
    placeholder: "अपना संदेश लिखें...",
    send: "भेजें",
    errorMessage: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    loading: "आपके अनुरोध पर कार्रवाई हो रही है...",
  },
  malayalam: {
    greeting: "എന്റെ ടിക്കറ്റ് സിസ്റ്റത്തിലേക്ക് സ്വാഗതം! ഇന്ന് എങ്ങനെ സഹായിക്കാം?",
    askDestination: "എല്ലാം ശരി! നിങ്ങൾക്ക് എവിടെ യാത്ര ചെയ്യണമെന്ന് ആഗ്രഹം? നിങ്ങൾ തിരഞ്ഞെടുക്കാവുന്നതാണ് പാരീസ്, ലണ്ടൻ, ന്യൂയോർക്ക്, ടോക്യോ, റോമ, സിഡ്നി, ഡൽഹി, മുംബൈ, ബാംഗ്ലൂർ, അല്ലെങ്കിൽ കൊൽക്കത്ത.",
    suggestPlaces: (place) => `${place} യിലെ പ്രശസ്തമായ ആകർഷണങ്ങൾ:`,
    askDate: "നിങ്ങൾക്ക് യാത്ര ചെയ്യാൻ ഏത് തീയതിയാണെന്ന് ദയവായി DD/MM/YYYY ഫോർമാറ്റിൽ നൽകുക.",
    askGroupSize: "ചെല്ലുന്നതിന് എത്ര പേർ ഉണ്ട്?",
    confirmation: (destination, date, groupSize) => `നിങ്ങളുടെ യാത്രയുടെ വിവരങ്ങൾ ലഭിച്ചു. ${destination} ലേക്ക് ${date} തീയതിയിൽ ${groupSize} ആളുകളുമായി യാത്രയ്ക്ക് ടിക്കറ്റ് നിർമ്മിക്കാം.`,
    invalidDestination: "ആ സ്ഥാനത്തെക്കുറിച്ച് എനിക്ക് വിവരങ്ങൾ ലഭ്യമല്ല. മുമ്പ് നൽകിയ പട്ടികയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.",
    invalidDate: "ക്ഷമിക്കണം, അത് സാധുവായ തീയതി അല്ല. ദയവായി DD/MM/YYYY ഫോർമാറ്റ് ഉപയോഗിക്കുക.",
    invalidGroupSize: "ദയവായി ശരിയായ ഗ്രൂപ്പ് സൈസ് നൽകുക.",
    placeholder: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...",
    send: "അയയ്ക്കുക",
    errorMessage: "പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    loading: "നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സിംഗ്...",
  },
  bengali: {
    greeting: "আমাদের টিকিটিং সিস্টেমে স্বাগতম! আমি কিভাবে আপনাকে সাহায্য করতে পারি?",
    askDestination: "দারুন! আপনি কোথায় ভ্রমণ করতে চান? আপনি প্যারিস, লন্ডন, নিউ ইয়র্ক, টোকিও, রোম, সিডনি, দিল্লি, মুম্বাই, ব্যাঙ্গালোর, অথবা কলকাতা থেকে বেছে নিতে পারেন।",
    suggestPlaces: (place) => `${place} এর কিছু জনপ্রিয় আকর্ষণ:`,
    askDate: "আপনি কখন ভ্রমণ করতে চান? দয়া করে একটি DD/MM/YYYY ফর্ম্যাটে তারিখ প্রদান করুন।",
    askGroupSize: "কতজন মানুষ ভ্রমণ করবেন?",
    confirmation: (destination, date, groupSize) => `আপনার সমস্ত তথ্যের জন্য ধন্যবাদ। আমি ${destination}-এ আপনার যাত্রার জন্য ${date} তারিখে ${groupSize} জনের জন্য একটি টিকিট তৈরি করছি।`,
    invalidDestination: "আমি সেই গন্তব্য সম্পর্কে কোনো তথ্য খুঁজে পাইনি। দয়া করে পূর্বে দেওয়া তালিকা থেকে বেছে নিন: প্যারিস, লন্ডন, নিউ ইয়র্ক, টোকিও, রোম, সিডনি, দিল্লি, মুম্বাই, ব্যাঙ্গালোর, অথবা কলকাতা।",
    invalidDate: "মাফ করবেন, এটি বৈধ তারিখ মনে হচ্ছে না। অনুগ্রহ করে DD/MM/YYYY ফর্ম্যাটটি ব্যবহার করুন।",
    invalidGroupSize: "দয়া করে একটি বৈধ সংখ্যার গ্রুপ আকার লিখুন।",
    placeholder: "আপনার বার্তা টাইপ করুন...",
    send: "পাঠান",
    errorMessage: "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।",
    loading: "আপনার অনুরোধ প্রক্রিয়া করা হচ্ছে...",
  },
  punjabi: {
    greeting: "ਸਾਡੇ ਟਿਕਟਿੰਗ ਸਿਸਟਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    askDestination: "ਬਹੁਤ ਵਧੀਆ! ਤੁਸੀਂ ਕਿੱਥੇ ਯਾਤਰਾ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਤੁਸੀਂ ਪੈਰਿਸ, ਲੰਡਨ, ਨਿਊਯਾਰਕ, ਟੋਕਿਓ, ਰੋਮ, ਸਿਡਨੀ, ਦਿੱਲੀ, ਮੁੰਬਈ, ਬੈਂਗਲੋਰ ਜਾਂ ਕੋਲਕਾਤਾ ਵਿੱਚੋਂ ਚੁਣ ਸਕਦੇ ਹੋ।",
    suggestPlaces: (place) => `${place} ਵਿੱਚ ਕੁਝ ਲੋਕਪ੍ਰਿਅ ਆਕਰਸ਼ਣ:`,
    askDate: "ਤੁਸੀਂ ਕਦੋਂ ਯਾਤਰਾ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ DD/MM/YYYY ਫਾਰਮੈਟ ਵਿੱਚ ਮਿਤੀ ਪ੍ਰਦਾਨ ਕਰੋ।",
    askGroupSize: "ਤੁਸੀਂ ਕਿੰਨੇ ਲੋਕ ਯਾਤਰਾ ਕਰਨਗੇ?",
    confirmation: (destination, date, groupSize) => `ਤੁਹਾਡੀ ਸਾਰੀ ਜਾਣਕਾਰੀ ਲਈ ਧੰਨਵਾਦ। ਮੈਂ ${destination} ਵਿੱਚ ਤੁਹਾਡੇ ਯਾਤਰਾ ਲਈ ${date} ਨੂੰ ${groupSize} ਲੋਕਾਂ ਲਈ ਟਿਕਟ ਬਣਾਉਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹਾਂ।`,
    invalidDestination: "ਮੈਨੂੰ ਉਸ ਗੰਤੀਬੰਦ ਬਾਰੇ ਕੋਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਪਿਛਲੀ ਦਿੱਤੀ ਸੂਚੀ ਵਿੱਚੋਂ ਚੁਣੋ: ਪੈਰਿਸ, ਲੰਡਨ, ਨਿਊਯਾਰਕ, ਟੋਕਿਓ, ਰੋਮ, ਸਿਡਨੀ, ਦਿੱਲੀ, ਮੁੰਬਈ, ਬੈਂਗਲੋਰ ਜਾਂ ਕੋਲਕਾਤਾ।",
    invalidDate: "ਮਾਫ ਕਰਨਾ, ਇਹ ਸਹੀ ਮਿਤੀ ਨਹੀਂ ਲੱਗਦੀ। ਕਿਰਪਾ ਕਰਕੇ DD/MM/YYYY ਫਾਰਮੈਟ ਨੂੰ ਵਰਤੋ।",
    invalidGroupSize: "ਕਿਰਪਾ ਕਰਕੇ ਗਰੁੱਪ ਦਾ ਸਹੀ ਸਾਈਜ਼ ਦਰਜ ਕਰੋ।",
    placeholder: "ਆਪਣਾ ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ...",
    send: "ਭੇਜੋ",
    errorMessage: "ਇੱਕ ਗਲਤੀ ਹੋ ਗਈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    loading: "ਤੁਹਾਡੀ ਬੇਨਤੀ ਪ੍ਰਕਿਰਿਆਵਧੀ ਕਰ ਰਹੀ ਹੈ...",
  },
};

const TicketingSystem = () => {
  const [language, setLanguage] = useState('english');
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [specificPlace, setSpecificPlace] = useState('');
  const [date, setDate] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const addMessage = (text, isUser = false) => {
    setConversation((prev) => [...prev, { text, isUser }]);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage(input, true);

    // Handle conversation steps
    switch (step) {
      case 0:
        addMessage(languages[language].askDestination);
        setStep(1);
        break;
      case 1:
        if (placeSuggestions[input]) {
          setDestination(input);
          addMessage(languages[language].askSpecificPlace);
          placeSuggestions[input].forEach((place) => {
            addMessage(`- ${place}`);
          });
          setStep(2);
        } else {
          addMessage(languages[language].invalidDestination);
        }
        break;
      case 2:
        if (placeSuggestions[destination]?.includes(input)) {
          setSpecificPlace(input);
          addMessage(languages[language].askDate);
          setStep(3);
        } else {
          addMessage(languages[language].invalidDestination);
        }
        break;
      case 3:
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
          setDate(input);
          addMessage(languages[language].askGroupSize);
          setStep(4);
        } else {
          addMessage(languages[language].invalidDate);
        }
        break;
      case 4:
        if (!isNaN(input) && parseInt(input) > 0) {
          setGroupSize(input);
          setLoading(true);
          addMessage(languages[language].loading);
          setTimeout(() => {
            addMessage(
              languages[language].confirmation(destination, specificPlace, date, groupSize)
            );
            setLoading(false);
            setStep(0);
          }, 2000);
        } else {
          addMessage(languages[language].invalidGroupSize);
        }
        break;
      default:
        break;
    }

    setInput('');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setConversation([]);
    setStep(0);
    setDestination('');
    setDate('');
    setGroupSize('');
    addMessage(languages[lang].greeting);
  };

  return (
    <div className="ticketing-system bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chatbot Ticketing System</h2>
          <Select onValueChange={handleLanguageChange} className="w-full mb-4">
            <SelectTrigger className="w-full border-gray-300 rounded-lg">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="malayalam">Malayalam</SelectItem>
              <SelectItem value="bengali">Bengali</SelectItem>
              <SelectItem value="punjabi">Punjabi</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="chat-window">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? 'user' : 'bot'}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {loading && (
            <div className="loading">
              <Loader2 className="animate-spin" />
              <span>{languages[language].loading}</span>
            </div>
          )}
          <div className="input-area">
            <Input
              placeholder={languages[language].placeholder}
              value={input}
              onChange={handleInput}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>{languages[language].send}</Button>
          </div>
          {step === 1 && (
            <Alert>
              <AlertDescription>
                {languages[language].askDestination}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketingSystem;