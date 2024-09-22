import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import StudentLogin from './components/StudentLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Main />} />
        <Route path = "/student-login" element = {<StudentLogin />} />

      </Routes>
    </Router>
  );
}

export default App;
