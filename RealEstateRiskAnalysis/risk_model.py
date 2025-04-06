# Option A
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)


# Load the model once at startup
with open('risk_model.pkl', 'rb') as f:
    model = pickle.load(f)

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
    return jsonify({'prediction': prediction})


if __name__ == '__main__':
    app.run(debug=True)
