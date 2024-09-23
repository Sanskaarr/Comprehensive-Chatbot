const responses = {
    greeting: {
      english: "Welcome to our ticketing system! How can I assist you today?",
      hindi: "हमारी टिकटिंग प्रणाली में आपका स्वागत है! मैं आज आपकी कैसे सहायता कर सकता हूं?",
    },
    ticketInfo: {
      english: "Sure, I can help you with ticket information. What specific details do you need?",
      hindi: "निश्चित रूप से, मैं आपको टिकट जानकारी के साथ मदद कर सकता हूं। आपको किन विशिष्ट विवरणों की आवश्यकता है?",
    },
    locationInfo: {
      english: "I'd be happy to provide information about locations. Here are some popular destinations:",
      hindi: "मैं स्थानों के बारे में जानकारी प्रदान करने में खुशी होगी। यहां कुछ लोकप्रिय गंतव्य हैं:",
    },
    default: {
      english: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
      hindi: "मुझे माफ करें, मैं वह नहीं समझा। क्या आप कृपया अपना प्रश्न दोबारा कह सकते हैं?",
    },
  };
  
  export function getResponse(type, language = 'english') {
    return responses[type][language] || responses[type]['english'];
  }
  