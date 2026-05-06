# IMPORT
import json 
import re 
import numpy as np 
import faiss 
from bs4 import BeautifulSoup 
from sentence_transformers import SentenceTransformer 
from openai import OpenAI 

# GLOBAL MODELS 
embedding_model = SentenceTransformer("BAAI/bge-small-en") 
client = OpenAI( base_url="https://openrouter.ai/api/v1", 
api_key="api_key" ) 

# HELPER FUNCTIONS 
def clean_full_html(raw_html): 
    soup = BeautifulSoup(raw_html, "html.parser") 
    text = soup.get_text(separator=" ") 
    text = re.sub(r"\s+", " ", text) 
    return text 

def find_all_positions(text, label): 
    positions = [] 
    start = 0 
    while True: 
        idx = text.lower().find(label.lower(), start) 
        if idx == -1: break 
        positions.append(idx) 
        start = idx + 1 
    return positions 

def extract_real_section(text, start_label, end_label): 
    starts = find_all_positions(text, start_label) 
    if len(starts) < 2: return "" 
    real_start = starts[1] 
    end = text.lower().find(end_label.lower(), real_start) 
    if end != -1: return text[real_start:end] 
    return "" 

def chunk_text(text, chunk_size=800, overlap=150): 
    words = text.split() 
    chunks = [] 
    start = 0 
    while start < len(words): 
        end = start + chunk_size 
        chunk = " ".join(words[start:end]) 
        chunks.append(chunk) 
        start += chunk_size - overlap 
    return chunks 

def embed_texts(texts): return embedding_model.encode(texts, normalize_embeddings=True) 

def retrieve(query, index, chunks, top_k=2): 
    query_embedding = embed_texts([query]) 
    scores, indices = index.search(query_embedding, top_k) 
    
    results = [] 
    for i, score in zip(indices[0], scores[0]): 
        results.append({ 
            "chunk": chunks[i], 
            "score": float(score) }) 
        return results 
    
def build_context(results): 
    return "\n\n".join([r["chunk"] for r in results]) 

def query_llm(prompt, max_tokens=300): 
    completion = client.chat.completions.create( 
        model="meta-llama/llama-3-8b-instruct", 
        messages=[{"role": "user", "content": prompt}], 
        temperature=0.0, 
        max_tokens=max_tokens ) 
    return completion.choices[0].message.content 

def clean_json_output(text):
  
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)

    text = text.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)

    return "{}"

def analyze_risk(file_2022_path, file_2023_path):

    # Load 
    with open("msft_2023.html", "r", encoding="utf-8") as f:
        raw_2023 = f.read()

    with open("msft_2022.html", "r", encoding="utf-8") as f:
        raw_2022 = f.read()

    # Clean
    full_2023 = clean_full_html(raw_2023)
    full_2022 = clean_full_html(raw_2022)

    # Extract
    risk_2023 = extract_real_section(full_2023, "Item 1A.", "Item 1B.")
    risk_2022 = extract_real_section(full_2022, "Item 1A.", "Item 1B.")

    mda_2023 = extract_real_section(full_2023, "Item 7.", "Item 7A.")
    mda_2022 = extract_real_section(full_2022, "Item 7.", "Item 7A.")

    text_2023 = risk_2023 + " " + mda_2023
    text_2022 = risk_2022 + " " + mda_2022

    # Chunk
    chunks_2023 = chunk_text(text_2023)
    chunks_2022 = chunk_text(text_2022)

    # Embed
    embeddings_2023 = embed_texts(chunks_2023)
    embeddings_2022 = embed_texts(chunks_2022)

    # FAISS
    dim = embeddings_2023.shape[1]

    index_2023 = faiss.IndexFlatIP(dim)
    index_2023.add(embeddings_2023)

    index_2022 = faiss.IndexFlatIP(dim)
    index_2022.add(embeddings_2022)

    # Retrieve
    query = "Analyze key financial and liquidity risks."

    results_2023 = retrieve(query, index_2023, chunks_2023)
    results_2022 = retrieve(query, index_2022, chunks_2022)

    context_2023 = build_context(results_2023)
    context_2022 = build_context(results_2022)

    # Summarize
    summary_2023 = query_llm(
        f"Summarize financial and liquidity risks in concise bullet points:\n\n{context_2023}",
        200
    )

    summary_2022 = query_llm(
        f"Summarize financial and liquidity risks in concise bullet points:\n\n{context_2022}",
        200
    )

    # Compare
    comparison_prompt = f"""
You are a financial risk comparison engine.

Compare 2023 vs 2022 financial and liquidity risks.

2023:
{summary_2023}

2022:
{summary_2022}

Return STRICT JSON ONLY in EXACTLY this format:

{{
  "risk_level_change": "Increased | Decreased | Stable",
  "new_risks_detected": [],
  "worsening_indicators": [],
  "improving_indicators": [],
  "summary": "",
  "confidence_estimate": 0.0
}}
"""

    raw_output = query_llm(comparison_prompt, 300)
    cleaned_output = clean_json_output(raw_output)

    try:
        parsed_output = json.loads(cleaned_output)
    except:
        parsed_output = {}

    parsed_output.setdefault("risk_level_change", "Unknown")
    parsed_output.setdefault("new_risks_detected", [])
    parsed_output.setdefault("worsening_indicators", [])
    parsed_output.setdefault("improving_indicators", [])
    parsed_output.setdefault("summary", "Model output incomplete.")
    parsed_output.setdefault("confidence_estimate", 0.4)

    # Confidence fusion
    avg_score = (results_2023[0]["score"] + results_2022[0]["score"]) / 2
    retrieval_conf = round(avg_score, 3)

    model_conf = parsed_output.get("confidence_estimate", 0.5)

    overall_conf = round(
        (0.6 * retrieval_conf) + (0.4 * model_conf),
        3
    )

    # Risk delta metric
    risk_delta = len(parsed_output["new_risks_detected"]) - \
                 len(parsed_output["improving_indicators"])

    return {
        "risk_analysis": parsed_output,
        "retrieval_confidence": retrieval_conf,
        "model_confidence": model_conf,
        "overall_system_confidence": overall_conf,
        "risk_delta": risk_delta,
        "top_chunk_2023": results_2023[0]["chunk"],
        "top_chunk_2022": results_2022[0]["chunk"]
    }
