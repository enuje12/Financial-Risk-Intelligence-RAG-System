import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({
        error: "Failed to connect to backend",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Financial Risk Intelligence RAG System
          </h1>
          <p className="text-gray-400 mt-3 max-w-3xl">
            Confidence-aware AI platform for comparative financial risk analysis
            using Retrieval-Augmented Generation (RAG), semantic retrieval, and
            explainable evidence tracing.
          </p>
        </div>

        {/* Search Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Analyze financial risks between Microsoft 2022 and 2023 filings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-white text-white"
            />

            <button
              onClick={handleAnalyze}
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-all duration-200"
            >
              {loading ? "Analyzing..." : "Analyze Risk"}
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm mb-2">Overall Confidence</p>
            <h2 className="text-4xl font-bold">0.822</h2>
            <p className="text-green-400 mt-2 text-sm">
              High confidence analysis
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm mb-2">Retrieval Confidence</p>
            <h2 className="text-4xl font-bold">0.836</h2>
            <p className="text-blue-400 mt-2 text-sm">
              Strong semantic retrieval
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm mb-2">Model Confidence</p>
            <h2 className="text-4xl font-bold">0.800</h2>
            <p className="text-purple-400 mt-2 text-sm">
              Reliable reasoning output
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Executive Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Executive Summary</h2>
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                Elevated Risk
              </span>
            </div>

            <p className="text-gray-300 leading-7">
              Comparative analysis of Microsoft 2022 vs 2023 10-K filings
              indicates increased exposure to settlement obligations, regulatory
              uncertainty, and operational funding risk. The model detected
              worsening risk indicators associated with long-term liabilities and
              legal obligations.
            </p>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-5">Detected Risks</h2>

            <div className="space-y-4">
              <div className="bg-zinc-950 border border-red-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Settlement Risk</h3>
                  <span className="text-red-400 text-sm">High</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-orange-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Cash Flow Risk</h3>
                  <span className="text-orange-400 text-sm">Moderate</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-yellow-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Regulatory Risk</h3>
                  <span className="text-yellow-400 text-sm">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">Retrieved Evidence</h2>
            <span className="text-sm text-gray-400">
              Explainable Evidence Traceability
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
              <p className="text-gray-300 leading-7">
                “The company remains subject to ongoing settlement obligations
                and regulatory review processes which may materially impact
                operational expenditures and future liabilities.”
              </p>
            </div>

            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
              <p className="text-gray-300 leading-7">
                “Increased uncertainty associated with operational cost
                structures and long-term commitments may adversely affect future
                financial performance.”
              </p>
            </div>
          </div>
        </div>

        {/* Backend Result */}
        {result && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-5">AI Analysis Output</h2>

            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <div className="space-y-4">
                <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
                  <p className="text-gray-300 leading-7 whitespace-pre-line">
                    {result.result || JSON.stringify(result, null, 2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

     
