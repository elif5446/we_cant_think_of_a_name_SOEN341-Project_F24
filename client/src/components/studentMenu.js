import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentMenu.css';

const StudentMenu = () => (
    <section className='main-container'>
        <nav>
            <ul>
                <div><img src="/images/stingers.png" alt="StingersIcon" className="stingers" /></div>
                <li><Link to='/student-menu'>Menu</Link></li>
                <li><Link to='/student-courses'>My Courses</Link></li>
                <div id='profile'><li><Link to='/student-profile'>My Profile</Link></li></div> 
            </ul>
        </nav>
        <div>
            <h3 className='title'>PEER ASSESSMENT PROGRAM</h3>
        </div>
    </section>
);

export default StudentMenu;