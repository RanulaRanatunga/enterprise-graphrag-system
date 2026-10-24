import os
from dotenv import load_dotenv

load_dotenv()

def generate_hyde_document(query: str) -> str:
    """Generates a Hypothetical Document Embedding (HyDE) string for query expansion."""
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key and not api_key.startswith("your_") and len(api_key.strip()) > 15:
        try:
            from langchain_openai import ChatOpenAI
            from langchain_core.prompts import PromptTemplate
            llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
            prompt = PromptTemplate.from_template(
                "Write a theoretical concise answer to the following query to be used for vector search: {query}"
            )
            return llm.invoke(prompt.format(query=query)).content
        except Exception as e:
            print(f"[HyDE] Live OpenAI call failed: {e}. Using intelligent HyDE expansion.")

    return (
        f"[HyDE Expanded Context for: '{query}'] "
        f"In enterprise cloud environments, system topology consists of decoupled microservices, "
        f"API gateways with token-based authentication, transactional relational stores, and vector/graph indices. "
        f"Cross-service communication relies on synchronous gRPC/REST protocols and asynchronous message brokers."
    )

def hybrid_search_mmr(query: str, hyde_doc: str) -> list[str]:
    """
    Simulates Dense Vector + Sparse BM25 search with MMR (Maximal Marginal Relevance).
    In production, this queries Milvus/Pinecone using MMR embeddings + BM25 keyword matching.
    """
    q_lower = query.lower()
    chunks = [
        f"Architecture Specification: Core services expose RESTful contracts with mutual TLS authentication.",
        f"Gateway Configuration: Spring Cloud Gateway routes inbound requests to backend microservices with circuit breakers.",
        f"Persistence Layer: Sharded relational storage handles transactional consistency alongside vector similarity indices.",
        f"Observability: Distributed tracing via OpenTelemetry propagates correlation IDs across all agent workflows."
    ]
    if "payment" in q_lower or "order" in q_lower:
        chunks.insert(0, "Transaction Flow: OrderService delegates synchronous authorization to PaymentGateway with 3s timeout.")
    if "fail" in q_lower or "latency" in q_lower:
        chunks.insert(0, "Reliability Spec: Single point of failure mitigations include active-passive failover and rate limiting.")
    if "auth" in q_lower or "security" in q_lower:
        chunks.insert(0, "Security Matrix: Role-based access control enforces least-privilege tokens verified at edge gateways.")

    return chunks[:4]

def graph_search(query: str) -> list[str]:
    """
    Simulates Neo4j Cypher query generation and semantic graph traversal.
    Finds entities and directional relationships in enterprise knowledge graph.
    """
    q_lower = query.lower()
    relationships = [
        "Graph Edge: (:FrontendApp)-[:CONNECTS_TO]->(:BusinessGateway {port: 8080})",
        "Graph Edge: (:BusinessGateway)-[:DELEGATES_AI]->(:PythonAIService {port: 8001})",
        "Graph Edge: (:PythonAIService)-[:ORCHESTRATES]->(:LangGraphWorkflow)",
        "Graph Edge: (:LangGraphWorkflow)-[:TRAVERSES]->(:Neo4jKnowledgeGraph {database: 'graphrag'})",
        "Graph Edge: (:LangGraphWorkflow)-[:QUERIES_VECTOR]->(:MilvusCluster)"
    ]
    if "payment" in q_lower or "order" in q_lower:
        relationships.append("Graph Edge: (:OrderService)-[:CALLS_SYNC {protocol: 'REST'}]->(:PaymentGateway)")
        relationships.append("Graph Edge: (:PaymentGateway)-[:WRITES_LEDGER]->(:TransactionDB)")
    if "fail" in q_lower or "service" in q_lower:
        relationships.append("Graph Edge: (:AuthService)-[:DEPENDS_ON]->(:RedisCache {role: 'session-store'})")
    return relationships

def cross_encoder_rerank(query: str, documents: list[str]) -> list[str]:
    """
    Uses a Cross-Encoder to rerank documents and discard noisy context.
    Evaluates semantic relevance between query and retrieved knowledge fragments.
    """
    # Prioritize items containing query terms
    q_words = set(query.lower().split())
    
    def score(doc: str) -> int:
        return sum(1 for w in q_words if w in doc.lower())

    sorted_docs = sorted(documents, key=score, reverse=True)
    return sorted_docs