from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

from .agent import run_graphrag_agent

app = FastAPI(
    title="Enterprise GraphRAG AI Microservice",
    version="1.0.0",
    description="Multi-agent GraphRAG service using LangGraph, Neo4j knowledge graphs, and hybrid vector retrieval"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "python-ai-microservice",
        "engine": "LangGraph Multi-Agent Orchestrator",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY") and len(os.getenv("OPENAI_API_KEY", "").strip()) > 15)
    }

@app.post("/api/v1/ask")
async def ask_graphrag(request: QueryRequest):
    """Triggers the LangGraph multi-agent workflow: Planner -> Vector + Graph Retriever -> Synthesizer"""
    result = run_graphrag_agent(request.query)
    return {"answer": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)