import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WhiteboardPage from './pages/WhiteboardPage';
import './index.css';

/**
 * App - Root component with routing
 * / -> HomePage (username, create/join room)
 * /whiteboard -> WhiteboardPage (canvas + real-time collaboration)
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/whiteboard" element={<WhiteboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
