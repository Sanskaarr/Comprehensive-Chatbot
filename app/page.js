"use client";
import React from 'react';
import ComprehensiveChatbotTicketingSystem from './components/ComprehensiveChatbotTicketingSystem';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Our Ticketing System</h1>
        <p>Plan your next trip with ease using our chatbot!</p>
      </header>
      <main>
        <ComprehensiveChatbotTicketingSystem />
      </main>
    </div>
  );
}

export default App;