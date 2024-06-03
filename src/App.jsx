import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowLessons from './components/ScheduleShow.jsx';
import ChangesControl from './components/ChangesControl';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShowLessons />} />
        <Route path="/changes" element={<ChangesControl />}/>
      </Routes>
    </Router>
  );
}

export default App;