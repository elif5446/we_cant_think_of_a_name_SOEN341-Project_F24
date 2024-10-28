import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import StudentLogin from './components/StudentLogin';
import InstructorLogin from './components/InstructorLogin';
import InstructorPage from './components/InstructorPage';
import CreateAccount from './components/CreateAccount';
import StudentMenu from './components/studentMenu';
import StudentCourses from './components/StudentCourses';
import StudentProfile from './components/StudentProfile';
import StudentDashboard from './components/StudentDashboard';
import PeerAssessment from './components/PeerAssessment';
import IndividualAssessment from './components/IndividualAssessment';
import AssessmentConfirmation from './components/AssessmentConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Main />} />
        <Route path = "/student-login" element = {<StudentLogin />} />
        <Route path = "/instructor-login" element = {<InstructorLogin />} />
        <Route path = "/createPage-login" element = {<CreateAccount />} />
        <Route path = "/student-menu" element = {<StudentMenu />} />
        <Route path = "/instructor-page" element = {<InstructorPage />} />
        <Route path = "/newuser-login" element = {<CreateAccount />} />
        <Route path = "/student-courses" element = {<StudentCourses/>} />
        <Route path = "/student-profile" element = {<StudentProfile/>} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/peer-assessment" element={<PeerAssessment />} />
        <Route path="/peer-assessment/:teammateId" element={<IndividualAssessment />}/>
        <Route path="/individual-assessment" element={<IndividualAssessment />} />
        <Route path="/assessment-confirmation" element={<AssessmentConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;