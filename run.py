# app paketinden Flask uygulamasını oluşturan fonksiyonu alıyoruz
from app import create_app


# Flask uygulamamızı oluşturuyoruz
app = create_app()


# Bu dosya doğrudan çalıştırılırsa Flask sunucusunu başlatıyoruz
if __name__ == "__main__":
    app.run(debug=True)