import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/createPage.css';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        usertype: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const createUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/create-account', { // Change this URL if backend is running elsewhere
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Success message
                // Handle success (e.g., redirect or show success message)
            } else {
                const error = await response.json();
                console.error(error.message); // Handle error
            }
        } catch (err) {
            console.error("An error occurred:", err);
        }
    };

    return (
        <div className="create-login-page">
            <div className="create-login-container">
                <img src="/images/loginimg.svg" alt="Sign Up Icon" className="newuser-icon" />
                <div id="login-section">
                    <h3 className="main_title">CREATE ACCOUNT</h3>

                    <form id="form-group" onSubmit={createUser}>
                        {['email', 'password', 'firstname', 'lastname', 'usertype'].map((field) => (
                            <div className="formgroup" key={field}>
                                <label htmlFor={field}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                                </label>
                                <input
                                    type={field === 'password' ? 'password' : 'text'}
                                    id={field}
                                    name={field}
                                    required
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <div className="formgroup">
                            <button type="submit" className="signin">Create Account</button>
                            <Link to="/">
                                <button type="button" className="returnHome">
                                    <img src="/images/home.svg" alt="Home Icon" className="homeavatar" />
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
