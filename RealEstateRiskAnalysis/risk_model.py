from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('risk_model.pkl')
#type_encoder = joblib.load('type_encoder.pkl')

joblib.dump(model, 'risk_model.pkl')
#joblib.dump(type_encoder, 'type_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    investment_type = type_encoder.transform([data['investment_type']])[0]
    return_rate = float(data['return_rate'])
    years = int(data['years'])
    has_history = 1 if data['has_history'] == 'yes' else 0

    features = np.array([[investment_type, return_rate, years, has_history]])
    pred = model.predict(features)[0]
    label = 'risky' if pred == 1 else 'safe'
    return jsonify({'prediction': label})

if __name__ == '__main__':
    app.run(debug=True)
