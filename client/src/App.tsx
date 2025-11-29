import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import HomePage from './pages/Homepage';
import PDFTaskUI from './pages/TaskFileManager';

function App() {
  return (
    <Router>
    

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/afterUpload" element={<PDFTaskUI />} />
      </Routes>
    </Router>
  );
}

export default App;
