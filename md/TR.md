# PUG Şablon Projesi

Bu proje, PUG şablonlarını kullanarak dosya izleyici ile PUG dosyalarını HTML'e dönüştüren ve genel varlıkları bir çıktı dizinine kopyalayan basit bir kurulum örneği sunar. Proje ayrıca düzenli aralıklarla çıktı dizinini temizleme ve yeniden oluşturma özelliği içerir.

## Özellikler

- PUG şablonlarını HTML'e dönüştürür.
- Genel varlıkları (CSS, JS, resimler vb.) çıktı dizinine kopyalar.
- Kaynak dizinindeki değişiklikleri izler ve çıktı dizinini buna göre günceller.
- Düzenli aralıklarla çıktı dizinini temizler ve yeniden oluşturur.

## Kurulum

1. Depoyu klonlayın:

   ```bash
   git clone https://github.com/Eren-Seyfi/vanilla-PUG-generate.git
   cd PUG-template-project
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Projeyi çalıştırın:

   ```bash
   npm start
   ```

## Yapı

- **src**: PUG şablonları ve genel varlıkları içeren kaynak dizini.
  - **templates**: `layouts`, `partials`, `components` ve `pages` içerir.
  - **public**: CSS ve JS dosyaları gibi genel varlıkları içerir.
- **www**: Dönüştürülmüş HTML ve kopyalanmış varlıkların saklandığı çıktı dizini.
- **bootstrap.js**: Projeyi kurmak, değişiklikleri izlemek ve şablonları dönüştürmek için ana betik.
- **structure.json**: Yapıyı ve ayarları tanımlayan yapılandırma dosyası.

## Layouts Nasıl Çalışır:

Bu projede, PUG şablonları modüler bir yapı sağlamak için layout'lara (düzenlere) ayrılmıştır. Layout dosyaları templates/layouts dizininde yer alır. Her sayfa PUG dosyası, dosya adında layout adını belirterek hangi layout dosyasına ait olduğunu belirtir, örneğin, index.main.PUG, main.PUG layout'unun kullanılacağını gösterir.

Şablonlar render edildiğinde, layout dosyası sayfa içeriğini sarmak için kullanılır. Bu, farklı sayfalar arasında tutarlı başlık, altbilgi ve navigasyon bölümleri sağlar. Örneğin, bir index.main.PUG dosyası, main.PUG layout'u ile sarılacak ve bu layout'u kullanan tüm sayfalar için aynı başlık ve altbilgi kullanılacaktır.

## Yapılandırma

### structure.json

```json
{
  "inputDir": "src",
  "outputDir": "www",
  "interval": 5000,
  "mainTemplate": "templates/layouts/main.PUG",
  "pagesDir": "templates/pages",
  "templates": {
    "layouts": ["main.PUG", "example.PUG"],
    "partials": ["header.PUG", "footer.PUG", "nav.PUG"],
    "pages": [
      "index.main.PUG",
      "about.main.PUG",
      "index.example.PUG",
      "about.example.PUG"
    ],
    "components": []
  },
  "public": {
    "css": ["style.css"],
    "js": ["app.js"]
  }
}
```

- **inputDir**: Kaynak dizin.
- **outputDir**: Çıktı dizin.
- **interval**: Çıktı dizinini temizlemek ve yeniden oluşturmak için milisaniye cinsinden aralık.
- **mainTemplate**: Ana PUG şablonunun yolu.
- **pagesDir**: PUG sayfa şablonlarını içeren dizin.
- **templates**: Şablonların yapısı.
- **public**: Genel varlıkların yapısı.

## Betikler

- **start**: Ana betiği (`bootstrap.js`) çalıştırır.
