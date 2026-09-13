// ==========================================================
// KAIRA - SİPARİŞ VER SAYFASI
// ==========================================================
//
// Bu kod Sipariş Ver sayfasındaki formu yönetir.
//
// Yaptığı işlemler:
// 1. Ürünleri dropdown menüsüne ekler.
// 2. Formdaki müşteri bilgilerini alır.
// 3. Seçilen ürünün birim fiyatını bulur.
// 4. Ürün adedine göre toplam tutarı hesaplar.
// 5. Otomatik sipariş numarası oluşturur.
// 6. Siparişi "Siparisler" CMS koleksiyonuna kaydeder.
// 7. Kayıt başarılı olursa form alanlarını temizler.
//
// ==========================================================


// Wix CMS üzerinde veri işlemleri yapabilmek için
// wix-data modülünü projeye dahil ediyoruz.
import wixData from 'wix-data';


// ==========================================================
// 1. ÜRÜNLER VE BİRİM FİYATLARI
// ==========================================================
//
// Her ürün için sistemde kullanılacak bir değer ve
// o ürüne ait birim fiyat tanımlanmıştır.
//
// Örneğin:
// serum seçildiğinde sistem birim fiyatı 56 TL olarak alır.
//
// Fiyat değişikliği gerektiğinde sadece bu bölümdeki
// rakamların değiştirilmesi yeterlidir.
// ==========================================================

const fiyatlar = {
    serum: 56,
    krem: 48,
    tonik: 42,
    nemlendirici: 52
};


// ==========================================================
// 2. SAYFA HAZIR OLDUĞUNDA ÇALIŞACAK İŞLEMLER
// ==========================================================
//
// $w.onReady(), Wix sayfasındaki bileşenler tamamen
// yüklendikten sonra kodun çalışmasını sağlar.
// ==========================================================

$w.onReady(function () {

    console.log("Sipariş Ver sayfası hazır.");


    // ======================================================
    // 3. ÜRÜN DROPDOWN MENÜSÜNÜ OLUŞTURMA
    // ======================================================
    //
    // dropdown1 isimli Wix bileşeninin seçeneklerini
    // doğrudan kod üzerinden oluşturuyoruz.
    //
    // label = müşterinin ekranda gördüğü ürün adı
    // value = kod içerisinde kullanılan ürün değeri
    // ======================================================

    $w("#dropdown1").options = [
        { label: "Lumi Serum", value: "serum" },
        { label: "Lumi Krem", value: "krem" },
        { label: "Lumi Tonik", value: "tonik" },
        { label: "Lumi Nemlendirici", value: "nemlendirici" }
    ];


    // ======================================================
    // 4. GÖNDER BUTONU
    // ======================================================
    //
    // button1 kullanıcının formdaki "Gönder" butonudur.
    //
    // Kullanıcı butona bastığında aşağıdaki işlemler
    // sırasıyla gerçekleştirilecektir.
    // ======================================================

    $w("#button1").onClick(async () => {

        console.log("Gönder butonuna basıldı.");


        // ==================================================
        // 5. FORMDAKİ VERİLERİ ALMA
        // ==================================================
        //
        // input1    = İşletme / Şirket Adı
        // input2    = E-posta
        // dropdown1 = Seçilen ürün
        // input4    = Sipariş adedi
        //
        // trim() metnin başındaki ve sonundaki gereksiz
        // boşlukları kaldırır.
        //
        // Number() ürün adedini sayısal değere dönüştürür.
        // ==================================================

        const musteri = $w("#input1").value.trim();
        const eposta = $w("#input2").value.trim();
        const urunAdi = $w("#dropdown1").value;
        const urunAdedi = Number($w("#input4").value);


        // Test ve hata kontrolü sırasında formdan alınan
        // değerleri geliştirici konsolunda görebilmek için:
        console.log({
            musteri,
            eposta,
            urunAdi,
            urunAdedi
        });


        // ==================================================
        // 6. FORM DOĞRULAMA
        // ==================================================
        //
        // Zorunlu alanlardan herhangi biri boşsa veya
        // ürün adedi 0 ya da daha küçükse sipariş
        // oluşturulmaz.
        // ==================================================

        if (!musteri || !eposta || !urunAdi || urunAdedi <= 0) {
            console.log("Eksik veya hatalı alan var.");
            return;
        }


        // ==================================================
        // 7. ÜRÜNÜN BİRİM FİYATINI BULMA
        // ==================================================
        //
        // Dropdown'dan gelen ürün değerini kullanarak
        // yukarıdaki fiyatlar nesnesinden fiyatı çekiyoruz.
        //
        // Örneğin:
        // urunAdi = "serum"
        // birimFiyat = 56
        // ==================================================

        const birimFiyat = fiyatlar[urunAdi];


        // Herhangi bir nedenle ürünün fiyatı bulunamazsa
        // hatalı sipariş oluşmasını engelliyoruz.
        if (!birimFiyat) {
            console.log("Ürün fiyatı bulunamadı.");
            return;
        }


        // ==================================================
        // 8. TOPLAM TUTARI HESAPLAMA
        // ==================================================
        //
        // Formda müşteriden toplam fiyat istemiyoruz.
        // Sistem bunu otomatik hesaplıyor.
        //
        // Formül:
        // Birim Fiyat × Ürün Adedi = Toplam Tutar
        //
        // Örnek:
        // 56 TL × 100 adet = 5.600 TL
        // ==================================================

        const toplamTutar = birimFiyat * urunAdedi;


        // ==================================================
        // 9. OTOMATİK SİPARİŞ NUMARASI
        // ==================================================
        //
        // Her sipariş için KR- ile başlayan otomatik
        // bir sipariş numarası oluşturuyoruz.
        //
        // Date.now() mevcut zamanı milisaniye olarak verir.
        // Son 6 haneyi kullanarak sipariş numarası üretiyoruz.
        //
        // Örnek:
        // KR-486716
        // ==================================================

        const siparisNo =
            "KR-" + Date.now().toString().slice(-6);


        // ==================================================
        // 10. CMS'E GÖNDERİLECEK VERİYİ HAZIRLAMA
        // ==================================================
        //
        // yeniSiparis nesnesi, Wix CMS'deki "Siparisler"
        // koleksiyonuna kaydedilecek bilgileri içerir.
        //
        // Buradaki alan isimleri CMS'deki Alan Kimlikleri
        // ile eşleşmektedir.
        // ==================================================

        const yeniSiparis = {
            siparisNo: siparisNo,
            tarihVeSaat: new Date(),
            musteri: musteri,
            eposta: eposta,
            urunAdi: urunAdi,
            urunAdedi: urunAdedi,
            tutar: toplamTutar,
            durum: "Yeni Sipariş"
        };


        // ==================================================
        // 11. SİPARİŞİ WIX CMS'E KAYDETME
        // ==================================================
        //
        // wixData.insert() ile hazırladığımız sipariş
        // "Siparisler" koleksiyonuna eklenir.
        //
        // await kullanıldığı için kayıt işleminin
        // tamamlanması beklenir.
        // ==================================================

        try {

            console.log("CMS'e gönderiliyor:", yeniSiparis);

            const sonuc = await wixData.insert(
                "Siparisler",
                yeniSiparis
            );


            // İşlem başarılı olduğunda kayıt bilgilerini
            // geliştirici konsoluna yazdırıyoruz.
            console.log(
                "Sipariş başarıyla kaydedildi:",
                sonuc
            );


            // ==================================================
            // 12. BAŞARILI SİPARİŞTEN SONRA FORMU TEMİZLEME
            // ==================================================
            //
            // Sipariş CMS'e başarıyla kaydedildikten sonra
            // kullanıcının doldurduğu alanları temizliyoruz.
            //
            // Böylece form yeni bir sipariş için hazır hale gelir.
            // ==================================================

            $w("#input1").value = "";
            $w("#input2").value = "";
            $w("#dropdown1").value = undefined;
            $w("#input4").value = "";


        } catch (error) {

            // ==================================================
            // 13. HATA YÖNETİMİ
            // ==================================================
            //
            // CMS'e kayıt sırasında bir problem oluşursa
            // sayfanın tamamen bozulması yerine hata
            // geliştirici konsoluna yazdırılır.
            // ==================================================

            console.error(
                "Sipariş kaydedilemedi:",
                error
            );
        }
    });
});
