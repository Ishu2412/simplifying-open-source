from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()
sentiment_pipeline = pipeline("sentiment-analysis")

@app.get("/")
def greet() :
    return "Hello World"

@app.post("/analyze-sentiment/")
async def analyze_sentiment(text: str):
    # Perform sentiment analysis
    results = sentiment_pipeline(text)

    # Interpret results
    sentiment = results[0]['label']

    return {"text": text, "sentiment": sentiment}
