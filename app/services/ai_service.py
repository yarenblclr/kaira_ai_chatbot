from groq import Groq
from config import Config


class AIService:

    def __init__(self):
        self.client = Groq(
            api_key=Config.GROQ_API_KEY
        )

    def cevap_ver(self, kullanici_mesaji):

        cevap = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": Config.BUSINESS_CONTEXT
                },
                {
                    "role": "user",
                    "content": kullanici_mesaji
                }
            ],

            temperature=0.4,
            max_tokens=400
        )

        return cevap.choices[0].message.content
    