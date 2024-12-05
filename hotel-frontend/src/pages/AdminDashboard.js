import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [guests, setGuests] = useState([]);
    const [error, setError] = useState(null);
    const [newGuest, setNewGuest] = useState({ user_id: '', check_in_date: '', check_out_date: '', room_type: ''});
    const [editingGuest, setEditingGuest] = useState(null);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/guests');
                setGuests(response.data);
            }   catch (err) {
                setError('Error fetching guest data');
            }
        };

        fetchGuests();
    }, []);

    const handleAddGuest = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/guests', newGuest);
            alert('Guest added successfully!');
            setNewGuest({ user_id: '', check_in_date: '', check_out_date: '', room_type: '' });
        }   catch (err) {
                if (err.response && err.response.status === 409) {
                    alert('This guest already exists in the system');
                }   else {
                        alert('Error adding guest');
                }
        }
    };

    const handleEditGuest = async (guestId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/guests/${guestId}`, editingGuest);
            setGuests(
                guests.map((guest) => (guest.id === guestId ? response.data : guest))
            );
            setEditingGuest(null);
        }   catch (err) {
            setError('Error editing guest');
        }
    };

    return (
        <div className='admin-dashboard'>
            <h2 className='admin-dashboard-title'>Guest Information</h2>
            {error && <p className='error-message'>{error}</p>}

            {/* form to add guest */}
            <div>
                <h3>Add Guest</h3>
                <input
                    type='text'
                    placeholder='User ID'
                    value={newGuest.user_id}
                    onChange={(e) => setNewGuest({ ...newGuest, user_id: e.target.value })}
                    className='form-input'
                />
                <input
                    type='date'
                    placeholder='Check In Date'
                    value={newGuest.check_in_date}
                    onChange={(e) => setNewGuest({ ...newGuest, check_in_date: e.target.value })}
                    className='form-input'
                />
                <input
                    type="date"
                    placeholder='Check Out Date'
                    value={newGuest.check_out_date}
                    onChange={(e) => setNewGuest({ ...newGuest, check_out_date: e.target.value })}
                    className='form-input'
                />
                <input
                    type="text"
                    placeholder="Room Type"
                    value={newGuest.room_type}
                    onChange={(e) => setNewGuest({ ...newGuest, room_type: e.target.value })}
                    className='form-input'
                />
                <button onClick={handleAddGuest}>Add Guest</button>
            </div>

                <table className='guest-table'>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Check In Date</th>
                            <th>Check Out Date</th>
                            <th>Room Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id}>
                                {editingGuest?.id === guest.id? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingGuest.user_id}
                                                onChange={(e) =>
                                                    setEditingGuest({ ...editingGuest, user_id: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editingGuest.check_in_date}
                                                onChange={(e) =>
                                                    setEditingGuest({ ...editingGuest, check_in_date: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editingGuest.check_out_date}
                                                onChange={(e) =>
                                                    setEditingGuest({ ...editingGuest, check_out_date: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingGuest.room_type}
                                                onChange={(e) =>
                                                    setEditingGuest({ ...editingGuest, room_type: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditGuest(guest.id)}>Save</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td data-label="User ID">{guest.user_id}</td>
                                        <td data-label="Check In Date">
                                            {new Date(guest.check_in_date).toLocaleDateString('en-US')}
                                        </td>
                                        <td data-label="Check Out Date">
                                            {new Date(guest.check_out_date).toLocaleDateString('en-US')}
                                        </td>
                                        <td data-label="Room Type">{guest.room_type}</td>
                                        <td>
                                            <button onClick={() => setEditingGuest(guest)}>Edit</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default AdminDashboard;