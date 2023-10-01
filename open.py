from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai

app = FastAPI()

openai.api_key = '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'

class Message(BaseModel):
    message: str

@app.get("/")
def greet() :
    return "I am open ai"

@app.post("/chat")
async def chat(request: Request, message: Message):
    user_message = message.message

    response = openai.Completion.create(
        engine="davinci",
        prompt=f"User: {user_message}\nAI:",
        max_tokens=3 
    )

    ai_reply = response.choices[0].text.strip()

    return {"message": ai_reply}

