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
                setComments(response.data);
            }   catch (err) {
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
        <div>
            <h2>Dashboard</h2>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>{comment.text}</li>
                ))}
            </ul>
            <div>
                <button onClick={() => navigate('/comments')}>Go to Comments</button>
                <button onClick={() => navigate('/weather')}>Go to Weather Info</button>
                {/* check for admin role before showing admin dashboard button */}
                {userRole === 'admin' ? (
                    <button onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>
                ) : (
                    <p>Admin role not detected. Curent role: {localStorage.getItem('userRole')}</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;