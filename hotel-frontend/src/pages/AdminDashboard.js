import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [guests, setGuests] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h2>Guest Information</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <table>
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
                                <td>{guest.user_id}</td>
                                <td>{guest.check_in_date}</td>
                                <td>{guest.check_out_date}</td>
                                <td>{guest.room_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;