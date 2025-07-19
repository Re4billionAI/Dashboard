import React, { useState } from 'react';
import axios from 'axios';

const InstallationForm = () => {
  const [formData, setFormData] = useState({
    siteId: '',
    title: '',
    description: '',
    location: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('siteId', formData.siteId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('image', image);

    try {
      const res = await axios.post('http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend/admin/installationForms', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Form submitted successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to submit form.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="siteId" placeholder="Site ID" onChange={handleChange} required />
      <input name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default InstallationForm;
