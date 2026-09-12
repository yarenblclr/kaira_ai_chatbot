import wixData from 'wix-data';

// Ürünlerin birim fiyatları
const fiyatlar = {
    serum: 56,
    krem: 48,
    tonik: 42,
    nemlendirici: 52
};

$w.onReady(function () {

    // Ürün seçeneklerini dropdown içine ekler
    $w("#dropdown1").options = [
        { label: "Lumi Serum", value: "serum" },
        { label: "Lumi Krem", value: "krem" },
        { label: "Lumi Tonik", value: "tonik" },
        { label: "Lumi Nemlendirici", value: "nemlendirici" }
    ];

    // Sipariş butonuna basıldığında çalışır
    $w("#button1").onClick(async () => {

        const musteri = $w("#input1").value;
        const eposta = $w("#input2").value;
        const urunAdi = $w("#dropdown1").value;
        const urunAdedi = Number($w("#input4").value);

        // Form kontrolü
        if (!musteri || !eposta || !urunAdi || !urunAdedi || urunAdedi <= 0) {
            console.log("Eksik veya hatalı bilgi var.");
            return;
        }

        // Toplam fiyat hesaplanır
        const birimFiyat = fiyatlar[urunAdi];
        const toplamTutar = birimFiyat * urunAdedi;

        // Sipariş numarası oluşturulur
        const siparisNo = "KR-" + Date.now().toString().slice(-6);

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

        try {
            await wixData.insert("Siparisler", yeniSiparis);

            console.log("Sipariş başarıyla kaydedildi.");
            console.log("Toplam tutar:", toplamTutar);

            // Form temizlenir
            $w("#input1").value = "";
            $w("#input2").value = "";
            $w("#dropdown1").value = undefined;
            $w("#input4").value = "";

        } catch (error) {
            console.error("Sipariş kaydedilemedi:", error);
        }
    });
});
