import wixData from 'wix-data';

$w.onReady(function () {

    $w("#repeater1").onItemReady(($item, itemData) => {

        $item("#text11").text = itemData.siparisNo || "-";

        if (itemData.tarihVeSaat) {
            const tarih = new Date(itemData.tarihVeSaat);
            $item("#text16").text = tarih.toLocaleDateString("tr-TR");
        } else {
            $item("#text16").text = "-";
        }

        $item("#text15").text = itemData.musteri || "-";

        $item("#text14").text =
            itemData.urunAdedi != null
                ? Number(itemData.urunAdedi).toLocaleString("tr-TR")
                : "-";

        $item("#text13").text =
            itemData.tutar != null
                ? Number(itemData.tutar).toLocaleString("tr-TR")
                : "-";

        $item("#text12").text = itemData.durum || "-";
    });

    wixData.query("Siparisler")
        .descending("_createdDate")
        .limit(100)
        .find()
        .then((results) => {

            $w("#repeater1").data = results.items;

            console.log(
                "Dashboard'a yüklenen sipariş sayısı:",
                results.items.length
            );
        })
        .catch((error) => {
            console.error("Siparişler yüklenemedi:", error);
        });
});
