import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/AssessmentChat.css';

const AssessmentChat = () => {;
    const location = useLocation()
    const instructorId = localStorage.getItem('instructorId');
    const { assessment, assessmentId } = location.state;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [assessmentId]);

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/comments?instructor_id=${instructorId}&assessment_id=${assessmentId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.comments);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assessment_id: assessmentId,
                    body: newMessage,
                    instructor_id: instructorId
                }),
            });

            if (response.ok) {
                setNewMessage('');
                const data = await response.json();
                setMessages(data.comments);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="assessment-chat-container">
            <div className="assessment-details">
                <h3>Original Assessment Feedback</h3>
                {assessment && (
                    <div className="feedback-summary">
                        <div className="feedback-category">
                            <strong>Cooperation:</strong> {assessment.cooperation.comments}
                        </div>
                        <div className="feedback-category">
                            <strong>Conceptual:</strong> {assessment.conceptual.comments}
                        </div>
                        <div className="feedback-category">
                            <strong>Practical:</strong> {assessment.practical.comments}
                        </div>
                        <div className="feedback-category">
                            <strong>Work Ethic:</strong> {assessment.workEthic.comments}
                        </div>
                    </div>
                )}
            </div>

            <div className="chat-section">
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} 
                             className={`message ${msg.senderId === instructorId ? 'sent' : 'received'}`}>
                            <div className="message-header">
                                <span>{msg.teacher.firstname} {msg.teacher.lastname}</span>
                                <span className="timestamp">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="message-content">{msg.body}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default AssessmentChat; 