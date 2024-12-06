// Comments.js
import React, { useState } from 'react';
import axios from 'axios';

const Comments = () => {
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [guestId, setGuestId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/comments', {
                text: comment,
                guestId: guestId || null,
                });
            setMessage('Comment submitted successfully');
            setComment('');
            setGuestId('');
        }   catch (err) {
            setMessage('Error submitting comment');
        }
    };

    return (
        <div>
            <h2 className='comments-title'>Leave a Comment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    placeholder='Enter Guest ID (optional)'
                    style={{ marginBottom: '15px' }}
                />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here"
                    style={{ marginBottom: '15px' }}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p className={message.includes('Error') ? 'message-error' : 'message-success'}>{message}</p>}
        </div>
    );
};

export default Comments;