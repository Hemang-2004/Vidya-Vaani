import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data(filepath):
    logger.info(f"Loading data from {filepath}")
    # Simulating data loading
    np.random.seed(42)
    X = np.random.rand(1000, 20)
    y = np.random.randint(0, 2, 1000)
    return X, y

def train_model():
    logger.info("Starting model training pipeline...")
    X, y = load_data('data/student_behavior.csv')
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    logger.info("Initializing Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)
    
    logger.info("Fitting model on training data...")
    clf.fit(X_train, y_train)
    
    logger.info("Evaluating model on test data...")
    predictions = clf.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    report = classification_report(y_test, predictions)
    
    logger.info(f"Model Accuracy: {acc:.4f}")
    logger.info(f"Classification Report:\n{report}")
    
    os.makedirs('models', exist_ok=True)
    model_path = 'models/behavior_rf_v1.pkl'
    joblib.dump(clf, model_path)
    logger.info(f"Model saved successfully to {model_path}")

if __name__ == "__main__":
    train_model()
