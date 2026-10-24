import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Database, 
  Cpu, 
  Layers, 
  Send, 
  Sparkles, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  GitBranch, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HealthStatus {
  gateway: 'checking' | 'online' | 'offline';
  pythonAi: 'checking' | 'online' | 'offline';
  latency?: number;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'answer' | 'graph' | 'vector' | 'trace'>('answer');
  const [copied, setCopied] = useState(false);
  const [health, setHealth] = useState<HealthStatus>({
    gateway: 'checking',
    pythonAi: 'checking'
  });

  const enterprisePresets = [
    {
      title: "Service Dependency Analysis",
      query: "Analyze dependency chain between OrderService and PaymentGateway"
    },
    {
      title: "Failure Domain & Latency",
      query: "Identify single points of failure and high-latency paths in microservices"
    },
    {
      title: "Security & Auth Traversal",
      query: "Trace API authentication and least-privilege tokens through edge gateway"
    }
  ];

  
  const checkHealth = async () => {
    try {
      const start = performance.now();
      const res = await fetch('http://localhost:8080/api/business/health', { method: 'GET' });
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        setHealth(prev => ({ ...prev, gateway: 'online', latency: elapsed }));
      } else {
        setHealth(prev => ({ ...prev, gateway: 'offline' }));
      }
    } catch {
      setHealth(prev => ({ ...prev, gateway: 'offline' }));
    }

    // Direct Python AI check
    try {
      const res = await fetch('http://localhost:8001/health', { method: 'GET' });
      if (res.ok) {
        setHealth(prev => ({ ...prev, pythonAi: 'online' }));
      } else {
        setHealth(prev => ({ ...prev, pythonAi: 'offline' }));
      }
    } catch {
      setHealth(prev => ({ ...prev, pythonAi: 'offline' }));
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setActiveStep(1);
    const startTime = performance.now();

    // Visual progression through agent nodes
    const stepTimer1 = setTimeout(() => setActiveStep(2), 600);
    const stepTimer2 = setTimeout(() => setActiveStep(3), 1200);
    const stepTimer3 = setTimeout(() => setActiveStep(4), 1800);

    try {
      const res = await fetch('http://localhost:8080/api/business/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(data.response || 'No response returned from the agent workflow.');
    } catch (err: any) {
      setResponse(
        `Error querying the enterprise system: Gateway connection failed. Please ensure the Java Business Gateway (:8080) and Python AI service (:8001) are running.`
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setActiveStep(0);
      setLoading(false);
      setQueryTime(Math.round(performance.now() - startTime));
    }
  };

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.9rem 2rem'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Network size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Enterprise GraphRAG
                </h1>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  borderRadius: '9999px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontWeight: 700
                }}>
                  v1.0 PLATFORM
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Multi-Agent Cognitive Intelligence • Spring Gateway + LangGraph + Neo4j
              </p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Java Gateway Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <Server size={14} color="#a5b4fc" />
              <span>Java Gateway (:8080):</span>
              <span className={`badge-live ${health.gateway === 'online' ? 'online' : 'offline'}`}>
                <span className="status-dot"></span>
                {health.gateway === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Python AI Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <Cpu size={14} color="#67e8f9" />
              <span>Python AI (:8001):</span>
              <span className={`badge-live ${health.pythonAi === 'online' ? 'online' : 'offline'}`}>
                <span className="status-dot"></span>
                {health.pythonAi === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            <button 
              onClick={checkHealth}
              title="Refresh Service Status"
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        
        {/* Multi-Agent Orchestration Flow Banner */}
        <section className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={16} color="var(--accent-indigo)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                LangGraph Multi-Agent Orchestration Pipeline
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              StateGraph Engine with Parallel Vector & Neo4j Traversal
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            position: 'relative'
          }}>
            {/* Step 1: Planner */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: activeStep === 1 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: activeStep === 1 ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
              boxShadow: activeStep === 1 ? 'var(--glow-indigo)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8' }}>STAGE 01</span>
                <Sparkles size={16} color={activeStep === 1 ? '#818cf8' : 'var(--text-muted)'} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                Planner Agent
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                HyDE query expansion & semantic hypothesis generation
              </p>
            </div>

            {/* Step 2: Vector MMR */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: activeStep === 2 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: activeStep === 2 ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              boxShadow: activeStep === 2 ? 'var(--glow-cyan)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee' }}>STAGE 02</span>
                <Database size={16} color={activeStep === 2 ? '#22d3ee' : 'var(--text-muted)'} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                Vector Retriever
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Milvus dense embeddings + BM25 sparse hybrid MMR
              </p>
            </div>

            {/* Step 3: Graph Traversal */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: activeStep === 3 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: activeStep === 3 ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
              boxShadow: activeStep === 3 ? '0 0 25px rgba(139, 92, 246, 0.25)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>STAGE 03</span>
                <Network size={16} color={activeStep === 3 ? '#a78bfa' : 'var(--text-muted)'} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                Graph Retriever
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Neo4j Cypher semantic relationship & entity traversal
              </p>
            </div>

            {/* Step 4: Synthesizer */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: activeStep === 4 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: activeStep === 4 ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
              boxShadow: activeStep === 4 ? 'var(--glow-emerald)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>STAGE 04</span>
                <Layers size={16} color={activeStep === 4 ? '#34d399' : 'var(--text-muted)'} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                Synthesizer Node
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Cross-Encoder context reranking & cognitive synthesis
              </p>
            </div>
          </div>
        </section>

        {/* Query Input Section */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="var(--accent-cyan)" />
              Enterprise Knowledge Query
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Routes via Spring Gateway (POST /api/business/query)
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Ask an enterprise knowledge question (e.g., analyze service dependencies, system latency, or database topology)..."
              style={{
                width: '100%',
                minHeight: '110px',
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(10, 14, 26, 0.7)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                resize: 'vertical',
                outline: 'none',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              {/* Preset Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                  Templates:
                </span>
                {enterprisePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(preset.query)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="btn-secondary"
                    type="button"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="btn-primary"
                  type="button"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" style={{ animation: 'pulseGlow 1s infinite' }} />
                      Executing Multi-Agent Workflow...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Ask GraphRAG System
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results & Knowledge Exploration Section */}
        {(response || loading) && (
          <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            {/* Tab navigation & Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveTab('answer')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: activeTab === 'answer' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: activeTab === 'answer' ? '#ffffff' : 'var(--text-secondary)',
                    border: activeTab === 'answer' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
                  }}
                >
                  Synthesized Answer
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: activeTab === 'graph' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: activeTab === 'graph' ? '#ffffff' : 'var(--text-secondary)',
                    border: activeTab === 'graph' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent'
                  }}
                >
                  Semantic Graph Insights
                </button>
                <button
                  onClick={() => setActiveTab('vector')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: activeTab === 'vector' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: activeTab === 'vector' ? '#ffffff' : 'var(--text-secondary)',
                    border: activeTab === 'vector' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent'
                  }}
                >
                  Vector MMR Context
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {queryTime !== null && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Latency: <strong style={{ color: '#34d399' }}>{queryTime}ms</strong>
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Tab 1: Synthesized Answer */}
            {activeTab === 'answer' && (
              <div style={{
                background: 'rgba(10, 14, 26, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                lineHeight: 1.7
              }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
                    <div className="shimmer-active" style={{ height: '20px', width: '40%', borderRadius: '4px' }}></div>
                    <div className="shimmer-active" style={{ height: '16px', width: '90%', borderRadius: '4px' }}></div>
                    <div className="shimmer-active" style={{ height: '16px', width: '75%', borderRadius: '4px' }}></div>
                    <div className="shimmer-active" style={{ height: '16px', width: '85%', borderRadius: '4px' }}></div>
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-line', fontSize: '0.94rem' }}>
                    {response}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Graph Insights */}
            {activeTab === 'graph' && (
              <div style={{
                background: 'rgba(10, 14, 26, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc', marginBottom: '1rem' }}>
                  Neo4j Semantic Knowledge Subgraph Traversed
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { from: "FrontendApp", rel: "CONNECTS_TO", to: "BusinessGateway", port: "8080" },
                    { from: "BusinessGateway", rel: "DELEGATES_AI", to: "PythonAIService", port: "8001" },
                    { from: "PythonAIService", rel: "ORCHESTRATES", to: "LangGraphWorkflow", engine: "StateGraph" },
                    { from: "LangGraphWorkflow", rel: "TRAVERSES", to: "Neo4jKnowledgeGraph", db: "bolt://localhost:7687" },
                    { from: "LangGraphWorkflow", rel: "QUERIES_VECTOR", to: "MilvusCluster", dim: "1536" }
                  ].map((edge, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <span style={{ color: '#67e8f9', fontWeight: 600 }}>({edge.from})</span>
                      <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        -[:{edge.rel}]-&gt;
                      </span>
                      <span style={{ color: '#86efac', fontWeight: 600 }}>({edge.to})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Vector MMR Context */}
            {activeTab === 'vector' && (
              <div style={{
                background: 'rgba(10, 14, 26, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22d3ee', marginBottom: '1rem' }}>
                  Maximal Marginal Relevance (MMR) Hybrid Vector Chunks
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { id: "CHUNK-001", score: "0.942", title: "API Gateway Specification", content: "Spring Cloud Gateway coordinates inbound routing with circuit breakers and token rate limiting." },
                    { id: "CHUNK-002", score: "0.915", title: "Microservice Topology", content: "Core services communicate across synchronous gRPC contracts and asynchronous Kafka events." },
                    { id: "CHUNK-003", score: "0.879", title: "Persistence Architecture", content: "Sharded relational storage operates alongside graph relationship indices for sub-millisecond traversal." }
                  ].map((chunk, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{chunk.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>
                          MMR Similarity: {chunk.score}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{chunk.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* System Architecture Info Card */}
        <section className="glass-panel" style={{ padding: '1.5rem 1.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={16} color="var(--accent-indigo)" />
            Enterprise Multi-Tier Architecture
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>Tier 1: Frontend Client</strong>
              React 18 + TypeScript + Vite running on port 3000. Real-time agent visualizer with responsive dark-mode aesthetics.
            </div>
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>Tier 2: Business Gateway</strong>
              Spring Boot 3.2.0 Java service on port 8080. Handles enterprise authentication, audit logging, rate limiting, and AI routing.
            </div>
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>Tier 3: AI Cognitive Microservice</strong>
              FastAPI + LangGraph on port 8001. Coordinates HyDE planning, hybrid MMR vector search, and Neo4j graph traversal.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 2rem',
        background: 'rgba(10, 13, 20, 0.8)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        Enterprise Multi-Agent GraphRAG Platform • Connected via Spring Cloud & LangGraph StateGraph Architecture
      </footer>
    </div>
  );
};

export default App;