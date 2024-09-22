import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentMenu.css';
import { useState, useEffect } from 'react';

const StudentMenu = () => (
    // const [courses, setCourses] = useState([])

    // useEffect(() => {
    //     const courseList = [
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //         {id: 1, name: "MATH205", image: "", prof: "Hendrik Tebeng", class: "MB2.210"},
    //     ]

    //     setCourses(courseList)

    //     console.log(courses)
    //   }, [courses]);

    <>
    <section className='main-container'>
        <nav>
            <ul>
            <li><Link to='/student-menu'>Menu</Link></li>
            <li><Link to='/student-courses'>My Courses</Link></li>
            <li><Link to='/student-profile'>My Profile</Link></li>
            </ul>
        </nav>
        <div>

        </div>
    </section>
    </>

);

export default StudentMenu;