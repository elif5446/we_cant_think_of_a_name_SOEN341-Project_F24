import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/AssessmentChat.css';

const AssessmentChat = () => {;
    const location = useLocation()
    const { assessmentId, evaluatorId } = location.state;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [assessment, setAssessment] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchAssessmentDetails();
        fetchMessages();
    }, [assessmentId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchAssessmentDetails = async () => {
        try {
            // Fetch assessment details including original feedback
            const response = await fetch(`http://localhost:3001/api/assessments/${assessmentId}`);
            if (response.ok) {
                const data = await response.json();
                setAssessment(data);
            }
        } catch (error) {
            console.error('Error fetching assessment:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            // Fetch chat messages related to this assessment
            const response = await fetch(`http://localhost:3001/api/assessment-comments/${assessmentId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/api/assessment-comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assessmentId,
                    message: newMessage,
                    timestamp: new Date(),
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(); // Refresh messages
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
                             className={`message ${msg.senderId === evaluatorId ? 'sent' : 'received'}`}>
                            <div className="message-header">
                                <span>{msg.senderName}</span>
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="message-content">{msg.message}</div>
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