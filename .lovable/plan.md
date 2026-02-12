

# Lifestyles Intra – AI Product Assistant & Description Generator

## Overview
A clean, minimal web app with two main features: an **AI chatbot** for answering customer questions about Lifestyles products, and a **product description generator** for creating optimized Facebook Marketplace listings. All AI responses will be grounded in the official Lifestyles brochure data (Intra, NutriaPlus, CardioLife, FibreLife).

---

## Pages & Features

### 1. Landing Page
- Simple hero section with a brief tagline: "Your Lifestyles Product Assistant"
- Two clear call-to-action buttons: **"Ask a Question"** (chatbot) and **"Generate a Listing"** (description generator)
- Clean, minimal design with white background

### 2. AI Chatbot Page
- Chat interface where customers (or you) can ask questions like:
  - "What's the difference between Intra juice and capsules?"
  - "How do I take FibreLife for weight loss?"
  - "What are the ingredients in NutriaPlus?"
  - "What's the recommended dosage?"
- The AI will answer **only based on official Lifestyles product information** from the brochure
- Includes the FDA disclaimer automatically when health claims are mentioned
- Conversation history within the session
- A "Copy Response" button on each answer so you can quickly paste into Facebook Messenger

### 3. Description Generator Page
- Select a product (Intra Juice, Intra Capsules, NutriaPlus, CardioLife, FibreLife)
- Optionally customize: target audience (e.g., "health-conscious Filipino buyers"), tone (professional/casual), and key selling points to emphasize
- AI generates an optimized Facebook Marketplace listing description with:
  - Attention-grabbing title
  - Key benefits & features
  - Dosage/usage info
  - Call to action
- "Copy to Clipboard" button to paste directly into Marketplace
- Option to regenerate or tweak the description

---

## Backend
- **Lovable Cloud** with an AI edge function powered by Lovable AI
- Product knowledge (from the brochure) embedded as a system prompt so the AI stays accurate and on-brand
- No user accounts needed — open access for customers and sellers

---

## Key Details
- Mobile-friendly design (most Filipino buyers browse on phones)
- All product info sourced from the official Lifestyles combo brochure
- FDA disclaimer included where appropriate
- Fast, responsive chat with streaming AI responses

