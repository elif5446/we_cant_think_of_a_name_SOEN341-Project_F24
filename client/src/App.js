// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import StudentLogin from './components/StudentLogin';
import InstructorLogin from './components/InstructorLogin';
import InstructorPage from './components/InstructorPage';
import StudentMenu from './components/studentMenu';
import StudentCourses from './components/StudentCourses';
import StudentProfile from './components/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Main />} />
        <Route path = "/student-login" element = {<StudentLogin />} />
        <Route path = "/instructor-login" element = {<InstructorLogin />} />
        <Route path = "/student-menu" element = {<StudentMenu />} />
        <Route path = "/instructor-page" element = {<InstructorPage />} />
        <Route path = "/student-courses" element = {<StudentCourses/>} />
        <Route path = "/student-profile" element = {<StudentProfile/>} />




      </Routes>
    </Router>
  );
}



export default App;
