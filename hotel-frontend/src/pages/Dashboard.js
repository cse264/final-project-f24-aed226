// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // hook for navigation
import axios from 'axios'; // library for making HTTP requests

// display the dashboard
function Dashboard({ userRole }) {
    const [comments, setComments] = useState([]); // holds comments fetched from API
    const [loading, setLoading] = useState(true); // tracks whether data is still loading
    const [error, setError] = useState(null); // stores error messages

    const navigate = useNavigate(); // hook to navigate different routes

    // fetch comments when component mounts
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/comments'); // fetch comments from backend
                console.log('Fetched comments:', response.data);
                setComments(response.data); // update the 'comments' state with fetched data
            }   catch (err) {
                console.error('Error fetching comments:', err);
                setError('Error fetching comments');
            } finally {
                setLoading(false);
            }
        };

        fetchComments(); // trigger fetchComments function
    }, []);

    // if data is loading, show a loading message
    if (loading) { 
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='dashboard'>
            <h2 className='dashboard-title'>Dashboard</h2>
            <ul className='comments-list'>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment.id} className='comment-item'>{comment.comment}</li>
                    ))
                ) : (
                        <p className='no-comments'>No comments found</p>
                )}
            </ul>
            <div className='buttons-container'>
                <button className='button' onClick={() => navigate('/comments')}>Go to Comments</button>
                <button className='button' onClick={() => navigate('/weather')}>Go to Weather Info</button>
                {/* check for admin role before showing admin dashboard button */}
                {userRole === 'admin' ? (
                    <button className='button' onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>
                ) : (
                    <p className='no-admin-role'>Admin role not detected. Curent role: {localStorage.getItem('userRole')}</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;