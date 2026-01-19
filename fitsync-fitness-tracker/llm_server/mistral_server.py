from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from fastapi import FastAPI, Request
from pydantic import BaseModel;
import torch
import uvicorn

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 256

# Path to model
MODEL_PATH = "mistralai/Mistral-7B-Instruct-v0.2"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else None
)

# Create text-generation pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if torch.cuda.is_available() else -1)

# FastAPI app
app = FastAPI()

@app.post("/generate")
async def generate(req: GenerateRequest):
    outputs = generator(
        req.prompt,
        max_new_tokens=req.max_tokens
    )
    return {"output": outputs[0]["generated_text"]}

# Run server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)