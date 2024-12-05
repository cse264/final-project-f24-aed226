// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ userRole }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/comments');
                console.log('Fetched comments:', response.data);
                setComments(response.data);
            }   catch (err) {
                console.error('Error fetching comments:', err);
                setError('Error fetching comments');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

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