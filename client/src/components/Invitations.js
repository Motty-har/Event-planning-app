import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useGlobalState } from "./Context";
import LoadingPage from './LoadingPage';

function Invitations(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, selectedUsers, setSelectedUsers } = useGlobalState();
  const { event_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = () => {
      fetch('/users')
        .then(response => response.json())
        .then(data => {
          setUsers(data.filter(u => u.id !== user.id));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          setLoading(false); 
        });
      };

      const fetchInvitations = () => {
        fetch(`/event_invitations/${event_id}`)
          .then(r => r.json())
          .then(r => setSelectedUsers(r));
      };

      fetchUsers();
      fetchInvitations();
  }, [user.id, event_id, setSelectedUsers]);

  if (loading) {
    return <LoadingPage />;
  }

  console.log(selectedUsers);

  const handleUserToggle = (selectedUser) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.find(user => user.id === selectedUser.id)) {
        return prevSelectedUsers.filter(user => user.id !== selectedUser.id);
      } else {
        return [...prevSelectedUsers, selectedUser];
      }
    });
  };

  const handleSubmit = () => {
    const selectedUsersIds = selectedUsers.map(user => user.id);
    const data = {
      user_id: user.id,
      selected_users: selectedUsersIds,
      event_id: parseInt(event_id, 10)
    };

    fetch('/create_invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        console.log('Invitations sent successfully:', result);
        history.push(`/create-tasks/${event_id}`);
      })
      .catch(error => {
        console.error('Error sending invitations:', error);
      });
  };

  return (
    <div className="invitations-container">
      <h2 className='invitations-header'>Please select the users you'd like to invite:</h2>
      <div className="user-cards-container">
        {users.map(user => (
          <div
            key={user.id}
            className={`user-card ${selectedUsers.find(selectedUser => selectedUser.id === user.id) ? 'selected' : ''}`}
            onClick={() => handleUserToggle(user)}
          >
            <label className="user-label" htmlFor={`user-${user.id}`}>
              {user.first_name} {user.last_name}
            </label>
          </div>
        ))}
      </div>
      {selectedUsers.length === 0 && (
        <p className="warning-message">Must select a user before continuing.</p>
      )}
      <div className="submit-container">
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-button"
          disabled={selectedUsers.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Invitations;
