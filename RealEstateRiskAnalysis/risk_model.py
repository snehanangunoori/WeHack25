from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)


# Load the model once at startup
model = joblib.load('risk_model.pkl')
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    features = [
        data['return_rate'],
        data['years_held'],
        data['has_history'],
        data['location_score'],
        data['vacancy_rate'],
        data['maintenance_cost_pct']
    ]

    prediction = model.predict([features])[0]
    return jsonify({'prediction': int(prediction)})


if __name__ == '__main__':
    app.run(debug=True)
