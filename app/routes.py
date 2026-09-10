# Flask'tan ihtiyacımız olan araçları alıyoruz
from flask import Blueprint, request, jsonify

# Groq ile konuşan AIService sınıfımızı alıyoruz
from app.services.ai_service import AIService


# API işlemlerimizi topladığımız Blueprint
api = Blueprint("api", __name__)

# AI servisini kullanıma hazır hale getiriyoruz
ai_service = AIService()


# Wix'ten gelen mesajların ulaşacağı adres
# Sadece POST isteği kabul eder
@api.route("/sohbet", methods=["POST"])
def sohbet():

    # Wix'ten gönderilen JSON verisini al
    data = request.get_json() or {}

    # JSON içindeki "mesaj" bilgisini al
    # Örnek: {"mesaj": "Kaira nedir?"}
    mesaj = data.get("mesaj", "").strip()

    # Kullanıcı boş mesaj gönderdiyse hata döndür
    if not mesaj:
        return jsonify({
            "basari": False,
            "hata": "Lütfen bir mesaj yazın."
        }), 400

    try:
        # Kullanıcının mesajını Groq'a gönder
        cevap = ai_service.cevap_ver(mesaj)

        # Groq'tan gelen cevabı Wix'e geri gönder
        return jsonify({
            "basari": True,
            "cevap": cevap
        })

    except Exception as hata:

        # Hatanın ne olduğunu VS Code terminalinde göster
        print("CHATBOT HATASI:", hata)

        # Kullanıcıya teknik detay göstermeden hata mesajı gönder
        return jsonify({
            "basari": False,
            "hata": "Şu anda cevap oluşturulamıyor."
        }), 500