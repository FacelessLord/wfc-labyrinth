import React from 'react';
import './App.css';
import {MapComponent} from "./rooms/MapComponent";

function App() {
    return (
        <div className="App">
            <MapComponent width={64} height={64}/>
        </div>
    );
}

export default App;
