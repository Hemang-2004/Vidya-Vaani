FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Pre-train the model during build so it's available for inference
RUN python model_training.py

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "inference_api:app"]
