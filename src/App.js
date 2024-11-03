// src/App.js

import React from 'react';
import Game from './components/Game'; // Import your Game component

function App() {
    return (
        <div>
            <h1>Welcome to My Game</h1>
            <Game /> {/* Render the Game component here */}
        </div>
    );
}

export default App; // Export the App component as default
