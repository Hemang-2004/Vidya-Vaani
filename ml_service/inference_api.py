from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load dummy model, or create one if it doesn't exist
try:
    model = joblib.load('models/behavior_rf_v1.pkl')
except FileNotFoundError:
    logging.warning("Model not found, initializing fallback dummy logic.")
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": model is not None}), 200

@app.route('/predict/behavior', methods=['POST'])
def predict_behavior():
    data = request.json
    if not data or 'features' not in data:
        return jsonify({"error": "Missing 'features' in request payload"}), 400
    
    features = np.array(data['features']).reshape(1, -1)
    
    if model:
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0].tolist()
    else:
        # Fallback dummy response
        prediction = 0
        probability = [0.85, 0.15]

    return jsonify({
        "anomaly_detected": bool(prediction),
        "confidence_scores": probability,
        "timestamp": pd.Timestamp.utcnow().isoformat()
    }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, threaded=True)
