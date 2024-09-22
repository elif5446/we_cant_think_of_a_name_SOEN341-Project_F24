import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import StudentLogin from './components/StudentLogin';
import InstructorLogin from './components/InstructorLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Main />} />
        <Route path = "/student-login" element = {<StudentLogin />} />
        <Route path = "/instructor-login" element = {<InstructorLogin />} />


      </Routes>
    </Router>
  );
}

export default App;
