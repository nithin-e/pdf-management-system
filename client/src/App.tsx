import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import HomePage from './pages/Homepage';

function App() {
  return (
    <Router>
    

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
