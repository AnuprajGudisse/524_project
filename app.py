from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

# Initialize the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})  

# Load models, encoders, and data
rf_model = joblib.load('crime_model.pkl')
label_encoder_crime = joblib.load('crime_label_encoder.pkl')
label_encoder_season = joblib.load('season_label_encoder.pkl')
scaler = joblib.load("scaler111.pkl")
linear_regression_model = joblib.load("linear_regression_crime_model_scaled111.pkl")
community_gdf = pd.read_csv("community_map_data.csv")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        vacant_building_status = data['vacant_building_status']
        season = data['season']

        season_encoded = label_encoder_season.transform([season])[0]

        sample_data = pd.DataFrame({
            'Month': [6],  
            'Day': [15],   
            'Ward_x': [data['ward']],
            'Community Area_x': [data['community_area']],
            'Latitude': [data['latitude']],
            'Longitude': [data['longitude']],
            'Season Encoded': [season_encoded],
            'Building Open Encoded': [vacant_building_status['Building Open']],
            'Building Vacant Encoded': [vacant_building_status['Building Vacant']]
        })

        probabilities = rf_model.predict_proba(sample_data)[0]
        crime_probabilities = {
            label_encoder_crime.inverse_transform([i])[0]: round(prob, 2)
            for i, prob in enumerate(probabilities)
        }

        return jsonify(crime_probabilities)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict-crime-map', methods=['POST'])
def predict_crime_map():
    try:
        data = request.json
        year = data.get('year', None) 

        if year is None:
            raise ValueError("Year is missing from the request payload")

        community_gdf['Year'] = int(year)  # Update Year
        prediction_data = community_gdf[["Vacant Count Log", "Year"]].copy()

        X_scaled_pred = scaler.transform(prediction_data)

        community_gdf["Predicted Crime Count"] = linear_regression_model.predict(X_scaled_pred)
        community_gdf["Scaled Predicted Crime Count"] = community_gdf["Predicted Crime Count"] * 0.5

        # Print the predictions for debugging
        print(community_gdf[["Year", "Predicted Crime Count", "Scaled Predicted Crime Count"]])

        response = community_gdf[["AREA_NUMBE", "latitude", "longitude", "Scaled Predicted Crime Count"]].to_json(orient="records")
        return response

    except Exception as e:
        print(f"Error in /predict-crime-map: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Load trained model for seasonal crime trends
crime_trend_model = joblib.load('crime_trend_model.pkl')
@app.route('/predict-crime-trend', methods=['POST'])
def predict_crime_trend():
    try:
        data = request.json
        start_year = int(data.get('startYear', 2018))
        end_year = int(data.get('endYear', 2025))
        community_area = int(data.get('communityArea', 15))
        
        vacant_buildings_trend = {year: 100 - (year - 2018) * 2 for year in range(start_year, end_year + 1)}
        
        predictions = predict_seasonal_trends(start_year, end_year, vacant_buildings_trend, community_area)
        
        return predictions.to_json(orient='records')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def predict_seasonal_trends(start_year, end_year, vacant_buildings_trend, community_area):
    predictions = []
    for year in range(start_year, end_year + 1):
        vacant_buildings = vacant_buildings_trend[year]
        for season in ['Winter', 'Spring', 'Summer', 'Fall']:
            data = {
                'Year': year,
                'Vacant Building Count': vacant_buildings,
                'Community Area': community_area,
                'Season_Fall': 1 if season == 'Fall' else 0,
                'Season_Spring': 1 if season == 'Spring' else 0,
                'Season_Summer': 1 if season == 'Summer' else 0
            }
            prediction = crime_trend_model.predict(pd.DataFrame([data]))[0]
            predictions.append({'Year': year, 'Season': season, 'Predicted Crime Count': max(0, prediction)})
    return pd.DataFrame(predictions)

if __name__ == '__main__':
    app.run(debug=True)
