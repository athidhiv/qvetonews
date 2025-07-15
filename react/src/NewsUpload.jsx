import React, { useState } from 'react';
import axios from 'axios';

function NewsUpload() {
  const [count, setCount] = useState(0);
   console.log(count);
   const [formData, setFormData] = useState({
     headline: '',
    description: '',
    category: '',
     image: null,
   });
  


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0], // ✅ File object
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object for file uploads
    const data = new FormData();
    data.append('headline', formData.headline);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      // ✅ Adjust the URL and headers as per your backend
       await axios.post('http://localhost:3000/news', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
       });
      console.log('News uploaded successfully', formData);
    } catch (error) {
      console.error('Error uploading news:', error);
    }
  };

  return (
    <div>
      <h1>News Upload</h1>
      <form onSubmit={handleSubmit}>
        <label>Headline:</label>
        <input
          type="text"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          required
        />
        <br />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />

        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <br />

        <label>Image File:</label>
        <input
          type="file"
          name="image"
          onChange={handleFileChange} // ✅ no value here
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewsUpload;
