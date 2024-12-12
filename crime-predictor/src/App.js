import React, { useState } from "react";
import FormSection from "./components/FormSection";
import ResultsSection from "./components/ResultsSection";
import InputForm from "./components/InputForm";
import Map3D from "./components/Map3D";
import TrendForm from "./components/TrendForm";
import TrendChart from "./components/TrendChart";
import "./App.css";

const App = () => {
    const [formData, setFormData] = useState({
        ward: 1,
        community_area: 1,
        season: "Summer",
    });

    const [predictions, setPredictions] = useState(null);
    const [crimeMapData, setCrimeMapData] = useState([]);
    const [trendData, setTrendData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePredict = async () => {
        try {
            const modelInput = {
                ...formData,
                latitude: 41.75, 
                longitude: -87.65, 
                vacant_building_status: { "Building Open": 1, "Building Vacant": 1 }
            };
            
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(modelInput),
            });
            const data = await response.json();
            setPredictions(data);
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };

    const fetchCrimeMapData = async (year) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/predict-crime-map", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year: parseInt(year, 10) }),
            });

            const result = await response.json();
            setCrimeMapData(result);
        } catch (error) {
            console.error("Error fetching crime map data:", error);
        }
    };

    const fetchCrimeTrendData = async (trendFormData) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/predict-crime-trend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trendFormData),
            });

            const result = await response.json();
            setTrendData(result);
        } catch (error) {
            console.error("Error fetching crime trend data:", error);
        }
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Crime Predictor</h1>
            </header>

            <main className="main-content">
                <div className="main-panels">
                    <div className="left-panel">
                        <h2>Crime Type Prediction</h2>
                        <FormSection
                            formData={formData}
                            handleChange={handleChange}
                            handlePredict={handlePredict}
                        />
                        <ResultsSection predictions={predictions} />
                    </div>

                    <div className="right-panel">
                    <h2>Crime Count Prediction</h2>
                    <InputForm onSubmit={fetchCrimeMapData} />
                    <div className="map-container">
                        <Map3D data={crimeMapData} />
                    </div>
                    </div>
                </div>

                <div className="bottom-panel">
                        <h2>Seasonal Crime Trend</h2>
                        <TrendForm onSubmit={fetchCrimeTrendData} />
                        <TrendChart data={trendData} />
                </div>
            </main>

            <footer className="footer">
                <p>Crime Predictor © 2024</p>
            </footer>
        </div>
    );
};

export default App;
