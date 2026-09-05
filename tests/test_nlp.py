"""
PAYREVIVE NLP & VOICE OF CUSTOMER AUTOMATED TEST SUITE
Tests multilingual language detection, aspect-based sentiment mining,
Hinglish vocabulary extraction, and suggestion generation.
"""

import pytest
from ml.nlp.nlp_engine import VoiceOfCustomerNLP

def test_language_detection_english():
    text = "The fabric quality is fantastic and fits comfortably."
    lang = VoiceOfCustomerNLP.detect_language(text)
    assert lang == "English"

def test_language_detection_hinglish():
    text = "Product accha hai but delivery bahut late thi!"
    lang = VoiceOfCustomerNLP.detect_language(text)
    assert lang == "Hinglish"

def test_language_detection_hindi_devanagari():
    text = "बहुत ही बढ़िया जूते हैं"
    lang = VoiceOfCustomerNLP.detect_language(text)
    assert lang == "Hindi"

def test_hinglish_aspect_sentiment_extraction():
    text = "Product accha hai but delivery bahut late thi!"
    result = VoiceOfCustomerNLP.process_review(text, rating=2)
    assert result["language_detected"] == "Hinglish"
    assert result["sentiment"] in ["NEGATIVE", "NEUTRAL"]
    
    aspect_names = [a["aspect"] for a in result["aspects"]]
    assert "QUALITY" in aspect_names or "DELIVERY" in aspect_names

def test_size_negative_suggestion_generation():
    text = "Size was way smaller than described in size chart. Had to return it."
    result = VoiceOfCustomerNLP.process_review(text, rating=1)
    assert result["sentiment"] == "NEGATIVE"
    
    aspect_names = [a["aspect"] for a in result["aspects"]]
    assert "SIZE" in aspect_names or "RETURN_PROCESS" in aspect_names
    assert len(result["suggestions"]) >= 1
    assert "size" in result["suggestions"][0]["suggestion"].lower() or "return" in result["suggestions"][0]["suggestion"].lower()

def test_payment_complaint_critical_suggestion():
    text = "UPI payment failed twice on checkout and money got deducted."
    result = VoiceOfCustomerNLP.process_review(text, rating=1)
    assert result["sentiment"] == "NEGATIVE"
    aspect_names = [a["aspect"] for a in result["aspects"]]
    assert "PAYMENT" in aspect_names
    assert any(s["aspect"] == "PAYMENT" for s in result["suggestions"])

def test_empty_and_noise_handling():
    result = VoiceOfCustomerNLP.process_review("", rating=3)
    assert result["sentiment"] == "NEUTRAL"
    assert len(result["aspects"]) >= 1

    result2 = VoiceOfCustomerNLP.process_review("!!! ??? 12345", rating=3)
    assert result2["sentiment"] in ["NEUTRAL", "POSITIVE"]
