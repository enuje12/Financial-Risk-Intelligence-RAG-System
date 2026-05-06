# Confidence-Aware Financial Risk Intelligence RAG System
An AI-powered Financial Risk Intelligence System that uses Retrieval-Augmented Generation (RAG) to analyze and compare year-over-year financial risks from Microsoft 10-K filings with confidence-aware reasoning, evidence traceability, and interactive real-time visualization.

This project was designed to move beyond a basic “chat-with-PDF” pipeline by integrating comparative financial risk analysis, confidence fusion, explainable retrieval, and executive-level summaries into a deployable AI dashboard.

## Overview
The system analyzes Microsoft 10-K reports from different financial years (2022 vs 2023) to identify:

- Emerging financial risks
- Worsening risk indicators
- Improving indicators
- Year-over-year risk changes
- Evidence-backed financial insights

The application combines semantic retrieval using FAISS with LLM-driven comparative reasoning to generate explainable financial intelligence outputs.

## Key Features

### Confidence-Aware RAG Pipeline
- Combines retrieval confidence and model confidence into a unified system confidence score
- Provides more reliable and interpretable AI-generated analysis
- Achieved ~0.82 overall system confidence during evaluation
  
### Comparative Financial Risk Analysis
- Performs year-over-year comparison of Microsoft 10-K reports
- Detects worsening, improving, and newly emerging risks
- Tracks overall risk-level change between financial years

### Explainable Evidence Retrieval
- Displays supporting retrieved evidence from source documents
- Enables traceability between generated insights and original financial filings
- Improves transparency and interpretability of outputs

### Executive Summary Generation
- Generates concise LLM-driven financial summaries
- Highlights major organizational risk trends and strategic concerns
- Produces analyst-style insights from retrieved evidence

### Interactive Dashboard
- Built using Streamlit with a professional dark-theme UI
- Visualizes confidence metrics and financial risk analysis in real time
- Includes expandable evidence panels and interactive charts

### API + Frontend Prototype
- Integrated FastAPI backend for serving analysis pipelines
- Developed React frontend prototype for scalable deployment architecture

## System Architecture
1. Financial reports are loaded and parsed
2. Text is chunked into semantically searchable segments
3. Embeddings are generated for document chunks
4. FAISS vector retrieval identifies relevant financial evidence
5.Retrieved evidence is passed to the LLM for comparative reasoning
6. Confidence fusion combines retrieval and model confidence
7. Results are visualized through the Streamlit dashboard

## Confidence-Aware Pipeline

The project introduces a confidence-aware analysis mechanism:

- Retrieval Confidence → Measures relevance of retrieved evidence
- Model Confidence → Measures reliability of generated analysis
- Overall System Confidence → Combined confidence fusion score

## Results

- Retrieval Confidence: ~0.836
- Model Confidence: ~0.80
- Overall System Confidence: ~0.822

This approach improves explainability and helps identify uncertainty in generated outputs.

## Tech Stack

### Programming Languages
- Python
- JavaScript

### AI/ML Components
- Retrieval-Augmented Generation (RAG)
- LLM-based comparative reasoning
- Confidence fusion pipeline
- Semantic retrieval

### Libraries & Frameworks
- Streamlit
- FastAPI
- React
- FAISS
- Pandas
- NumPy

