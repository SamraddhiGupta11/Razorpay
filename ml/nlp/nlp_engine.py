"""
REVIVEAI VOICE OF CUSTOMER NLP ENGINE
Lightweight, ultra-fast, CPU-friendly multilingual customer voice intelligence engine.
Supports English, Hindi, and Hinglish / Indic expressions.

Capabilities:
1. Language Detection (English, Indic / Hinglish, Other)
2. Text Normalization & Emoji Handling
3. Sentiment Analysis (Score: -1.0 to +1.0, Confidence, Label: POSITIVE/NEUTRAL/NEGATIVE)
4. Aspect-Based Sentiment Mining across 10 E-Commerce Aspects:
   - QUALITY, PRICE, DELIVERY, PACKAGING, SIZE, FIT, PAYMENT,
     CUSTOMER_SUPPORT, PRODUCT_DESCRIPTION, RETURN_PROCESS
5. Topic Detection & Categorization
6. Contextual Customer Suggestion Generation
7. Seller / Merchant Recommendation Synthesis
"""

import re
import unicodedata
from typing import Dict, List, Any, Tuple

# Multilingual Vocabulary Dictionaries
INDIC_POSITIVE_WORDS = {
    "accha", "achha", "achhi", "acchi", "badhiya", "badiya", "mast", "zabardast",
    "pasand", "shandar", "shandaar", "pyara", "sundar", "sahi", "sasta", "bahut accha",
    "bohot accha", "ekdum sahi", "lajawab", "fabulous", "superb", "best"
}

INDIC_NEGATIVE_WORDS = {
    "kharab", "bakwas", "bekar", "ghatiya", "dhoka", "fraud", "toota", "tuta",
    "chhota", "chota", "bada", "faltu", "late", "deri", "der", "ganda", "loot",
    "paise barbad", "barbad", "galat", "mat lo", "nakli", "fake", "bekaar"
}

ENGLISH_POSITIVE_WORDS = {
    "great", "excellent", "good", "amazing", "awesome", "fantastic", "love",
    "perfect", "superb", "smooth", "comfortable", "satisfied", "happy", "crisp",
    "soft", "durable", "clear", "intact", "flawless", "prompt", "fast", "worth"
}

ENGLISH_NEGATIVE_WORDS = {
    "bad", "terrible", "poor", "horrible", "worst", "hate", "broken", "damaged",
    "defective", "delayed", "late", "slow", "failed", "unresponsive", "waste",
    "disappointed", "pathetic", "fake", "uncomfortable", "tight", "loose", "rude",
    "smaller", "tight", "loose", "mismatch", "unfit", "return"
}

ASPECT_KEYWORDS = {
    "QUALITY": [
        "quality", "fabric", "material", "finish", "stitching", "cloth", "build",
        "durability", "sound", "anc", "bass", "audio", "battery", "hardware",
        "screen", "display", "plastic", "cotton", "silk", "leather", "pehle wash"
    ],
    "PRICE": [
        "price", "cost", "value", "expensive", "cheap", "affordable", "deal",
        "mrp", "discount", "offer", "worth", "money", "paise", "loot"
    ],
    "DELIVERY": [
        "delivery", "courier", "shipping", "dispatch", "tracking", "delay", "late",
        "days", "hours", "partner", "bluedart", "delhivery", "shadowfax", "arrived",
        "ndr", "unavailable", "calling"
    ],
    "PACKAGING": [
        "packaging", "package", "box", "bubble wrap", "wrap", "carton", "packing",
        "crushed", "torn", "seal", "dab gaya", "damaged box"
    ],
    "SIZE": [
        "size", "small", "chhota", "bada", "large", "xl", "xxl", "medium",
        "chart", "measure", "dimension", "sizing", "tight", "loose"
    ],
    "FIT": [
        "fit", "fitting", "glove", "comfort", "waist", "sleeve", "length",
        "grip", "sole", "heel", "ankle", "contour", "posture"
    ],
    "PAYMENT": [
        "payment", "upi", "card", "debit", "credit", "gateway", "razorpay",
        "money deducted", "deducted", "refund", "transaction", "checkout", "otp", "failed"
    ],
    "CUSTOMER_SUPPORT": [
        "support", "customer care", "agent", "executive", "helpdesk", "ticket",
        "call", "chat", "email", "rude", "script", "resolution", "unhelpful"
    ],
    "PRODUCT_DESCRIPTION": [
        "description", "picture", "photo", "image", "color", "colour", "look",
        "as shown", "different", "not as pictured", "actual", "misleading"
    ],
    "RETURN_PROCESS": [
        "return", "replace", "exchange", "pickup", "policy", "cancellation",
        "cancel", "refund process", "wapas"
    ]
}

TOPIC_PATTERNS = [
    ("Late Delivery", ["delivery late", "deri", "delayed", "took 6 days", "not arrived", "delay by", "slow delivery"]),
    ("Wrong Size", ["size small", "size chart", "wrong size", "chhota", "too tight", "too loose", "sizing"]),
    ("Poor Packaging", ["packaging", "box crushed", "dab gaya", "damaged box", "carton torn"]),
    ("Good Quality", ["fabric quality", "fantastic", "pure silk", "superb finish", "excellent quality", "bahut accha"]),
    ("Payment Issue", ["upi payment failed", "money deducted", "transaction failed", "double deduction"]),
    ("Fake NDR", ["fake ndr", "without even calling", "marked customer unavailable", "courier excuse"]),
    ("Difficult Return", ["cancel karne ka process", "return policy", "difficult return", "pickup delayed"]),
    ("Value for Money", ["value for money", "discount", "great deal", "worth"]),
    ("Damaged Product", ["stopped working", "broken", "toota", "stitching khul gayi", "damaged"])
]

class VoiceOfCustomerNLP:
    """Lightweight NLP Processor for E-Commerce Reviews."""

    @staticmethod
    def normalize_text(text: str) -> str:
        if not text:
            return ""
        text = unicodedata.normalize("NFKD", text)
        text = text.lower().strip()
        # Keep alphanumeric, common punctuation and whitespace
        text = re.sub(r'[\r\n\t]+', ' ', text)
        return text

    @classmethod
    def detect_language(cls, text: str) -> str:
        norm = text.lower()
        # Check if Hindi devanagari script
        if re.search(r'[\u0900-\u097F]', text):
            return "Hindi"
        
        # Check Hinglish vocabulary tokens
        tokens = set(re.findall(r'\b\w+\b', norm))
        hinglish_hits = tokens.intersection(INDIC_POSITIVE_WORDS.union(INDIC_NEGATIVE_WORDS).union({
            "hai", "tha", "thi", "hain", "ke", "liye", "mein", "aur", "pura", "kuch",
            "kaise", "karein", "ho", "gaya", "wali", "wala", "bahut", "bohot"
        }))
        if len(hinglish_hits) >= 1:
            return "Hinglish"
        
        return "English"

    @classmethod
    def analyze_sentiment(cls, text: str) -> Tuple[str, float, float]:
        """
        Computes polarity score (-1.0 to 1.0), confidence, and discrete sentiment.
        """
        norm = cls.normalize_text(text)
        tokens = re.findall(r'\b\w+\b', norm)
        
        if not tokens:
            return "NEUTRAL", 0.0, 0.50

        pos_score = 0
        neg_score = 0

        # Scan for English + Indic sentiment words
        for token in tokens:
            if token in ENGLISH_POSITIVE_WORDS or token in INDIC_POSITIVE_WORDS:
                pos_score += 1
            elif token in ENGLISH_NEGATIVE_WORDS or token in INDIC_NEGATIVE_WORDS:
                neg_score += 1

        # Check for negation words flipping sentiment (e.g. "not good", "nahi hai")
        for i in range(len(tokens) - 1):
            pair = f"{tokens[i]} {tokens[i+1]}"
            if tokens[i] in ["not", "never", "nahi", "na"]:
                if tokens[i+1] in ENGLISH_POSITIVE_WORDS or tokens[i+1] in INDIC_POSITIVE_WORDS:
                    pos_score -= 1
                    neg_score += 1.5

        total = pos_score + neg_score
        if total == 0:
            return "NEUTRAL", 0.0, 0.60

        raw_score = (pos_score - neg_score) / max(total, 1)
        score = max(min(round(raw_score, 4), 1.0), -1.0)
        confidence = round(min(0.60 + (total * 0.10), 0.98), 2)

        if score > 0.15:
            sentiment = "POSITIVE"
        elif score < -0.15:
            sentiment = "NEGATIVE"
        else:
            sentiment = "NEUTRAL"

        return sentiment, score, confidence

    @classmethod
    def extract_aspects(cls, text: str) -> List[Dict[str, Any]]:
        """
        Extracts aspects from review text, attributing sentiment and specific evidence snippets.
        """
        norm = cls.normalize_text(text)
        sentences = re.split(r'[.!?,\n]+', norm)
        detected_aspects = []
        seen_aspects = set()

        for sent in sentences:
            sent = sent.strip()
            if not sent:
                continue

            for aspect_name, keywords in ASPECT_KEYWORDS.items():
                if aspect_name in seen_aspects:
                    continue

                for kw in keywords:
                    if re.search(r'\b' + re.escape(kw) + r'\b', sent):
                        # Determine local sentiment of this sentence
                        aspsent, score, conf = cls.analyze_sentiment(sent)
                        detected_aspects.append({
                            "aspect": aspect_name,
                            "sentiment": aspsent,
                            "confidence": conf,
                            "evidence": sent[:150]
                        })
                        seen_aspects.add(aspect_name)
                        break

        # Fallback if no specific aspect keywords matched
        if not detected_aspects:
            gen_sent, _, gen_conf = cls.analyze_sentiment(text)
            detected_aspects.append({
                "aspect": "QUALITY",
                "sentiment": gen_sent,
                "confidence": gen_conf,
                "evidence": text[:120]
            })

        return detected_aspects

    @classmethod
    def detect_topics(cls, text: str) -> List[str]:
        """Detects high-level topic tags from text matching."""
        norm = cls.normalize_text(text)
        topics = []
        for topic_name, patterns in TOPIC_PATTERNS:
            for pat in patterns:
                if pat in norm:
                    topics.append(topic_name)
                    break
        return topics if topics else ["General Feedback"]

    @classmethod
    def generate_suggestion(cls, aspect: str, sentiment: str, evidence: str) -> Dict[str, str]:
        """Generates evidence-backed action recommendations from feedback."""
        if sentiment != "NEGATIVE":
            return {}

        suggestions_map = {
            "DELIVERY": {
                "text": "Review courier partner SLA and reallocate volume away from underperforming regional hubs.",
                "impact": "HIGH", "priority": "HIGH"
            },
            "SIZE": {
                "text": "Update garment size chart with centimeter chest/waist measurements and fit recommendation guide.",
                "impact": "HIGH", "priority": "HIGH"
            },
            "FIT": {
                "text": "Add customer body fit comparison widget on product detail page to prevent return friction.",
                "impact": "MEDIUM", "priority": "MEDIUM"
            },
            "PAYMENT": {
                "text": "Activate instant UPI payment retry fallback and pre-fill customer checkout details.",
                "impact": "CRITICAL", "priority": "CRITICAL"
            },
            "PACKAGING": {
                "text": "Mandate bubble-wrap and reinforced 5-ply cartons for fragile category shipments.",
                "impact": "MEDIUM", "priority": "MEDIUM"
            },
            "QUALITY": {
                "text": "Conduct supplier inspection on batch fabric quality, seam integrity, and color-fastness.",
                "impact": "HIGH", "priority": "HIGH"
            },
            "CUSTOMER_SUPPORT": {
                "text": "Provide tier-1 support agents with 1-click refund authorization and proactive ticket escalation.",
                "impact": "MEDIUM", "priority": "MEDIUM"
            },
            "RETURN_PROCESS": {
                "text": "Simplify return scheduling to 1-tap door pickup and instant wallet refund.",
                "impact": "HIGH", "priority": "MEDIUM"
            }
        }
        return suggestions_map.get(aspect, {
            "text": f"Review customer feedback regarding {aspect.lower()} to identify friction points.",
            "impact": "MEDIUM", "priority": "MEDIUM"
        })

    @classmethod
    def process_review(cls, text: str, rating: int = 5) -> Dict[str, Any]:
        """Full end-to-end NLP review pipeline."""
        lang = cls.detect_language(text)
        sentiment, score, confidence = cls.analyze_sentiment(text)
        
        # Cross-check with star rating
        if rating <= 2 and sentiment in ["POSITIVE", "NEUTRAL"]:
            sentiment = "NEGATIVE"
            score = -0.50 if score >= 0 else score
        elif rating >= 4 and sentiment in ["NEGATIVE", "NEUTRAL"]:
            sentiment = "POSITIVE"
            score = 0.50 if score <= 0 else score

        aspects = cls.extract_aspects(text)
        topics = cls.detect_topics(text)

        suggestions = []
        for asp in aspects:
            if asp["sentiment"] == "NEGATIVE":
                sug = cls.generate_suggestion(asp["aspect"], asp["sentiment"], asp["evidence"])
                if sug:
                    suggestions.append({
                        "aspect": asp["aspect"],
                        "suggestion": sug["text"],
                        "impact": sug["impact"],
                        "priority": sug["priority"]
                    })

        return {
            "language_detected": lang,
            "sentiment": sentiment,
            "sentiment_score": score,
            "confidence": confidence,
            "aspects": aspects,
            "topics": topics,
            "suggestions": suggestions
        }
