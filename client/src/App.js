import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import StudentLogin from './components/StudentLogin';
import InstructorLogin from './components/InstructorLogin';
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';
import CreateAccount from './components/CreateAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Main />} />
        <Route path = "/student-login" element = {<StudentLogin />} />
        <Route path = "/instructor-login" element = {<InstructorLogin />} />
        <Route path = "/student-page" element = {<StudentPage />} />
        <Route path = "/instructor-page" element = {<InstructorPage />} />
        <Route path = "/newuser-login" element = {<CreateAccount />} />





      </Routes>
    </Router>
  );
}

export default App;
