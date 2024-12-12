import React from "react";

const FormSection = ({ formData, handleChange, handlePredict }) => {
    return (
        <div className="form-section">
            <h3>Enter Details to Predict Crime Type</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="ward">Ward</label>
                    <input 
                        type="number" 
                        id="ward" 
                        name="ward" 
                        value={formData.ward} 
                        onChange={handleChange} 
                        placeholder="Enter ward" 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="community_area">Community Area</label>
                    <input 
                        type="number" 
                        id="community_area" 
                        name="community_area" 
                        value={formData.community_area} 
                        onChange={handleChange} 
                        placeholder="Enter community area" 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="season">Season</label>
                    <select 
                        id="season" 
                        name="season" 
                        value={formData.season} 
                        onChange={handleChange}>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                        <option value="Spring">Spring</option>
                        <option value="Fall">Fall</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handlePredict}>Predict Crime Type</button>
                </div>
            </form>
        </div>
    );
};

export default FormSection;
