import React, { useState } from "react";

const InputForm = ({ onSubmit }) => {
    const [year, setYear] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(year);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter Year"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default InputForm;
