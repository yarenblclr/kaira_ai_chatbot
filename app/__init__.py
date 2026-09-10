# Flask uygulamasını oluşturmak için Flask'ı alıyoruz
from flask import Flask

# Wix'in bizim backend'imize bağlanabilmesi için CORS'u alıyoruz
from flask_cors import CORS

# routes.py dosyasında oluşturduğumuz API'yi buraya getiriyoruz
from app.routes import api


# Flask uygulamasını oluşturan fonksiyon
def create_app():

    # Flask uygulamamızı oluşturuyoruz
    app = Flask(__name__)

    # Wix'ten gelen isteklere izin veriyoruz
    CORS(app)

    # routes.py içindeki yolları Flask'a bağlıyoruz
    # routes.py'deki "/sohbet" böylece "/api/sohbet" oluyor
    app.register_blueprint(api, url_prefix="/api")

    # Hazırladığımız uygulamayı geri gönderiyoruz
    return app