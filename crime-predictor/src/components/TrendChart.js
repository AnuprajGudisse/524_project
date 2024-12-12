import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const TrendChart = ({ data }) => {
    // Define the colors for each season
    const seasonColors = {
        Winter: '#1E90FF',  // Blue
        Spring: '#32CD32',  // Green
        Summer: '#FF6347',  // Red
        Fall: '#FFA500'     // Orange
    };

    return (
        <div className="trend-chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                    data={data} 
                    margin={{ top: 30, right: 30, bottom: 10, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#f4f4f9', borderRadius: '8px', padding: '10px' }} 
                        itemStyle={{ color: '#333' }} 
                    />
                    <Legend verticalAlign="top" height={36} />
                    {Object.entries(seasonColors).map(([season, color]) => (
                        <Line 
                            key={season} 
                            type="monotone" 
                            dataKey={entry => entry.Season === season ? entry['Predicted Crime Count'] : null}
                            name={season}
                            stroke={color} 
                            strokeWidth={2} 
                            dot={{ r: 3 }} 
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationDuration={2000} // Duration for each line animation
                            animationBegin={0} // All animations start at the same time
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
