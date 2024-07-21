import React, { useState } from 'react';
import axios from 'axios';

const EmailSend = () => {
  const [formData, setFormData] = useState({
    name: '',
    recipientEmail: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/send-email', formData)
      .then(response => {
        alert('Email sent successfully!');
      })
      .catch(error => {
        console.error('There was an error sending the email!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Recipient Email:</label>
        <input
          type="email"
          name="recipientEmail"
          value={formData.recipientEmail}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailSend;
