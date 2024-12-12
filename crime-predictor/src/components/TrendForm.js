import React, { useState } from 'react';

const TrendForm = ({ onSubmit }) => {
    var endYear =2019;
    var startYear = endYear - 1; 
    const [formData, setFormData] = useState({ startYear , endYear, communityArea: 15 });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Start Year: <input name="startYear" type="number" value={formData.startYear} onChange={handleChange} /></label>
            <label>End Year: <input name="endYear" type="number" value={formData.endYear} onChange={handleChange} /></label>
            <label>Community Area: <input name="communityArea" type="number" value={formData.communityArea} onChange={handleChange} /></label>
            <button type="submit">Predict</button>
        </form>
    );
};

export default TrendForm;
