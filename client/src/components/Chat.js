import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Chat.css';

const Chat = ({ courses, userId, userType, teams, selectedCourse: propSelectedCourse, onCourseSelect }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [selectedChat, setSelectedChat] = useState('public');
    const [selectedCourse, setSelectedCourse] = useState(propSelectedCourse || '');
    const messagesEndRef = useRef(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [courseTeams, setCourseTeams] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchRecipients = useCallback(async () => {
        if (!selectedCourse) return;
        try {
            const response = await fetch(`http://localhost:3001/api/chat/recipients/${selectedCourse}`);
            if (response.ok) {
                const data = await response.json();
                setRecipients(data.recipients);
            }
        } catch (error) {
            console.error('Error fetching recipients:', error);
        }
    }, [selectedCourse]);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/chat/messages/${selectedCourse}`);
            if (response.ok) {
                const data = await response.json();
                
                const filteredMessages = data.messages.filter(msg => {
                    if (selectedChat === 'public') {
                        return !msg.recipientId && !msg.teamId && msg.courseId === selectedCourse;
                    } else if (selectedChat.startsWith('team_')) {
                        const teamId = selectedChat.replace('team_', '');
                        return msg.teamId === teamId && msg.courseId === selectedCourse;
                    } else {
                        return (
                            (msg.senderId === userId && msg.recipientId === selectedChat) ||
                            (msg.senderId === selectedChat && msg.recipientId === userId)
                        );
                    }
                });
                
                setMessages(filteredMessages);
                if (!initialLoadComplete) {
                    setInitialLoadComplete(true);
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [selectedCourse, userId, selectedChat, initialLoadComplete]);

    useEffect(() => {
        fetchMessages();
        fetchRecipients();
    }, [fetchMessages, fetchRecipients]);

    useEffect(() => {
        if (initialLoadComplete && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length, initialLoadComplete]);

    useEffect(() => {
        if (courses.length > 0 && !selectedCourse) {
            setSelectedCourse(courses[0]._id);
        }
    }, [courses, selectedCourse]);

    useEffect(() => {
        if (selectedCourse && teams && teams.length > 0) {
            const teamsInCourse = teams.filter(team => {
                const teamCourseId = team.course._id.toString();
                const selectedCourseId = selectedCourse.toString();
                
                if (userType === 'instructor') {
                    return teamCourseId === selectedCourseId;
                } else {
                    const isInCourse = teamCourseId === selectedCourseId;
                    const isMember = team.members.some(
                        member => member._id.toString() === userId.toString()
                    );
                    return isInCourse && isMember;
                }
            });
            
            setCourseTeams(teamsInCourse);
        } else {
            setCourseTeams([]);
        }
    }, [selectedCourse, teams, userType, userId]);

    useEffect(() => {
        console.log('All teams:', teams);
        console.log('Course teams:', courseTeams);
    }, [teams, courseTeams]);

    useEffect(() => {
        if (!teams || teams.length === 0) {
            console.log('No teams available');
        } else {
            console.log('Available teams:', teams);
        }
    }, [teams]);

    useEffect(() => {
        console.log({
            selectedCourse,
            teams,
            userId,
            courseTeams
        });
    }, [selectedCourse, teams, userId, courseTeams]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                courseId: selectedCourse,
                senderId: userId,
                message: newMessage,
                senderType: userType,
                recipientId: null,
                teamId: null
            };

            if (selectedChat === 'public') {
                // Leave both recipientId and teamId as null
            } else if (selectedChat.startsWith('team_')) {
                messageData.teamId = selectedChat.replace('team_', '');
            } else {
                messageData.recipientId = selectedChat;
            }

            const response = await fetch('http://localhost:3001/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                setNewMessage('');
                await fetchMessages();
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getChatName = () => {
        if (selectedChat === 'public') return 'Course Public Chat';
        if (selectedChat.startsWith('team_')) {
            const teamId = selectedChat.replace('team_', '');
            const team = courseTeams.find(t => t._id === teamId);
            return `Team ${team?.teamName || ''}`;
        }
        const recipient = recipients.find(r => r._id === selectedChat);
        return recipient ? `${recipient.firstname} ${recipient.lastname}` : '';
    };

    // Get team members for the current chat
    const getCurrentTeamMembers = () => {
        if (selectedChat.startsWith('team_')) {
            const teamId = selectedChat.replace('team_', '');
            const team = courseTeams.find(t => t._id === teamId);
            return team?.members || [];
        }
        return [];
    };

    // Handle course selection
    const handleCourseChange = (e) => {
        const newCourseId = e.target.value;
        setSelectedCourse(newCourseId);
        if (onCourseSelect) {
            onCourseSelect(newCourseId);
        }
    };

    return (
        <div className="modern-chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <select 
                        value={selectedCourse} 
                        onChange={handleCourseChange}
                        className="course-selector"
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.courseCode} - {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="chat-list">
                    {selectedCourse && (
                        <>
                            <div className="chat-category">Course Chat</div>
                            <div 
                                className={`chat-item ${selectedChat === 'public' ? 'active' : ''}`}
                                onClick={() => setSelectedChat('public')}
                            >
                                <div className="chat-item-icon">📢</div>
                                <div className="chat-item-info">
                                    <div className="chat-item-name">Public Chat</div>
                                </div>
                            </div>

                            {courseTeams && courseTeams.length > 0 && (
                                <>
                                    <div className="chat-category">
                                        {userType === 'instructor' ? 'Course Teams' : 'My Teams'}
                                    </div>
                                    {courseTeams.map(team => (
                                        <div 
                                            key={`team_${team._id}`}
                                            className={`chat-item ${selectedChat === `team_${team._id}` ? 'active' : ''}`}
                                            onClick={() => setSelectedChat(`team_${team._id}`)}
                                        >
                                            <div className="chat-item-icon">👥</div>
                                            <div className="chat-item-info">
                                                <div className="chat-item-name">{team.teamName}</div>
                                                <div className="chat-item-subtitle">
                                                    {team.members?.length || 0} members
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {selectedChat.startsWith('team_') && (
                                <>
                                    <div className="chat-category">Team Members</div>
                                    {getCurrentTeamMembers()
                                        .filter(member => member._id !== userId)
                                        .map(member => (
                                            <div 
                                                key={member._id}
                                                className={`chat-item ${selectedChat === member._id ? 'active' : ''}`}
                                                onClick={() => setSelectedChat(member._id)}
                                            >
                                                <div className="chat-item-icon">👤</div>
                                                <div className="chat-item-info">
                                                    <div className="chat-item-name">
                                                        {member.firstname} {member.lastname}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </>
                            )}

                            <div className="chat-category">Course Members</div>
                            {recipients
                                .filter(r => r._id !== userId)
                                .map(recipient => (
                                    <div 
                                        key={recipient._id}
                                        className={`chat-item ${selectedChat === recipient._id ? 'active' : ''}`}
                                        onClick={() => setSelectedChat(recipient._id)}
                                    >
                                        <div className="chat-item-icon">
                                            {recipient.usertype === 'instructor' ? '👨‍🏫' : '👤'}
                                        </div>
                                        <div className="chat-item-info">
                                            <div className="chat-item-name">
                                                {recipient.firstname} {recipient.lastname}
                                            </div>
                                            <div className="chat-item-subtitle">
                                                {recipient.usertype}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
            </div>

            <div className="chat-main">
                {selectedCourse ? (
                    <>
                        <div className="chat-header">
                            <h3>{getChatName()}</h3>
                        </div>

                        <div className="messages-container">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
                                >
                                    <div className="message-header">
                                        <span className="sender-name">
                                            {msg.senderName} ({msg.senderType})
                                        </span>
                                        <span className="timestamp">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="message-content">{msg.message}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="chat-empty-state">
                        <div className="chat-empty-state-icon">💬</div>
                        <div className="chat-empty-state-text">
                            Select a course to start chatting
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;