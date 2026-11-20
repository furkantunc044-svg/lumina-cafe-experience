# Proje Gereksinim Dokümanı (PRD): Akıllı Kafe & Restoran Deneyim Uygulaması

## 1. Proje Özeti ve Amaç
Bu proje, kafe ve restoranların masalarına yerleştirilen NFC kartlar veya QR kodlar aracılığıyla çalışan, uygulama indirme ve üyelik gerektirmeyen (Mobile-First Web App / PWA) yeni nesil bir **Müşteri Deneyim ve Satış Artırma Platformu**dur.

**Birincil Hedef (MVP & Satış Demosu):**
Uygulama ilk aşamada B2B satış görüşmelerinde mekan sahiplerine canlı olarak gösterilecek bir **Demo/Vitrin Ürün** olarak kusursuz çalışmalıdır. Satış görüşmesinde tek bir mekanın (ör. "Lumina Coffee & Bistro") zengin demo verileriyle tüm akışlar (GIF menü, anlık garson bildirimi, hesap bölme, yorum yönlendirme vb.) gerçek zamanlı deneyimlenebilmelidir.

---

## 2. Temel İlkeler ve Kısıtlar
- **Sıfır Üyelik / Düşük Sürtünme:** Müşteri telefon numarası, e-posta veya şifre girmeden doğrudan masaya özel URL (`domain.com/[mekan-slug]/masa-[no]`) ile uygulamaya girer.
- **KVKK Dostu Mimari:** Kişisel veri tutulmaz. Tüm masa etkileşimleri anonim oturum (session) üzerinden yürür.
- **Ödeme ve POS Yaklaşımı (Demo-Ready):** Bahşiş, bölmeli adisyon ve dijital hediye çeki modülleri kullanıcı arayüzünde eksiksiz çalışmalı; gerçek sanal POS entegrasyonu yerine ilk sürümde **gerçekçi bir simülasyon ödeme ekranı** (Apple Pay / Kredi Kartı mock akışı) ile tamamlanmalıdır. Kod yapısı ileride Iyzico/Stripe entegrasyonuna uygun modüler kurulmalıdır.
- **%100 Mobil Öncelikli (Mobile-First):** Müşteri ekranı tamamen telefon ekranına ve tek elle (başparmak) kullanıma göre tasarlanacaktır.

---

## 3. Sistem Mimarisi (İki Ayrı Arayüz)
Uygulama satış demosunda etki yaratmak için senkronize çalışan 2 ana arayüzden oluşur:

1. **Müşteri Ekranı (`/[mekan]/masa-[no]`):** Masadaki müşterinin gördüğü şık, hızlı ve interaktif arayüz.
2. **Personel / İşletme Canlı Paneli (`/[mekan]/panel`):** Garsonun veya kasanın ekranı. Müşteri "Garson Çağır", "Hesap İste", "1-3 Yıldız Geri Bildirim" veya "Bahşiş" gönderdiğinde bu ekrana **anlık (Realtime) sesli ve görsel bildirim** düşer.

---

## 4. Detaylı Modül ve Özellik Gereksinimleri

### Modül 1: Hareketli (GIF / Loop Video) Görsel Menü
- Klasik statik menü yerine iştah açıcı, modern bir vitrin deneyimi sunar.
- Her ürün kartında yüksek kaliteli, hızlı yüklenen **hareketli GIF veya sessiz otomatik dönen (autoplay, loop, muted) kısa video/WebP** bulunur (ör. kahveye dökülen süt, kesilen San Sebastian, dumanı tüten yemek).
- **Performans Kuralı:** Medyalar *Lazy Loading* ile yüklenmeli, mobil interneti yormamalıdır.
- Kategori geçişleri (İmza Kahveler, Tatlılar, Ana Yemekler vb.) üstte yatay kaydırılabilir (sticky) sekmelerle yapılır.
- Ürün detayında açıklama, fiyat, hazırlama süresi ve alerjen ikonları yer alır.

### Modül 2: Akıllı Yan Ürün Öneri Motoru (Sessiz Çapraz Satış)
- Garsonların yoğunlukta unuttuğu *"Kahvenizin yanına tatlı ister misiniz?"* sorusunu dijitalde şık bir şekilde çözer.
- **Tetiklenme:** Müşteri bir içecek veya ana yemek detayına tıkladığında (veya listesine eklediğinde), ekranın alt kısmında veya özel bir kartta o ürünle eşleştirilmiş yan ürün önerilir.
  - *Örnek:* Filtre Kahve açıldığında → *"Baristanın Eşleştirmesi: Bu kahvenin notalarını en iyi Taze Kruvasan veya San Sebastian tamamlar."* + Tek tıkla incele/ekle butonu.
- Eşleştirmeler veritabanında `paired_product_id` ilişkisiyle dinamik yönetilir.

### Modül 3: Tek Tıkla Masa Servisi (Garson Çağır)
- Ana ekranın her yerinden kolayca erişilebilen sabit (floating) veya üstte belirgin bir aksiyon butonu bulunur.
- Tıklandığında sade bir alt pencere (Bottom Sheet) açılır:
  - **Garson Çağır**
  - **Hesap İste**
  - **Su / Peçete İste**
- Seçim yapıldığında anında İşletme Paneline *"Masa 12 - Garson Çağırıyor"* bildirimi düşer. Müşteri ekranında *"Talebiniz iletildi, hemen geliyoruz"* onayı ve spam'ı önlemek için 60 saniyelik geri sayım görünür.

### Modül 4: Bölmeli Adisyon (Hesap Bölüşme)
- Kalabalık masalardaki hesap karmaşasını çözer. Demo için masaya önceden atanmış örnek bir adisyon (ör. 2 Latte, 1 San Sebastian, 1 Burger, 1 Limonata) görüntülenir.
- Müşteri iki moddan birini seçebilir:
  1. **Ürüne Göre Böl:** Kendi yediği/içtiği ürünleri seçer, sadece kendi tutarını görür.
  2. **Eşit Böl:** Masa kişi sayısını seçer (ör. 4 kişi), kişi başı tutar otomatik hesaplanır.
- Seçilen tutar için "Ödemeyi Tamamla (Demo)" akışı çalışır ve ödenen kalemler masanın toplam adisyonundan canlı olarak düşer.

### Modül 5: Dijital Bahşiş (Tip) Modülü
- Adisyon ekranında veya ana menüdeki ayrı bir kartta yer alır.
- Müşteri hazır oranlardan (%5, %10, %15) veya hazır tutarlardan (50₺, 100₺, 200₺) birini seçer ya da özel tutar girer.
- İsteğe bağlı olarak *"Baristaya / Mutfağa / Servise"* seçimi ve kısa bir teşekkür notu ("Kahve harikaydı!") bırakabilir.
- Gönderildiğinde İşletme Paneline pozitif bir bildirim olarak düşer.

### Modül 6: İtibar Kalkanı (Akıllı Google Yorum Yönlendirme)
- Ana ekranda ve ödeme/çıkış akışında şık bir *"Deneyiminizi Puanlayın"* kartı yer alır.
- Müşteri 1 ile 5 arasında yıldız seçer:
  - **4 veya 5 Yıldız seçerse:** *"Harika! Bizi Google'da da desteklemek ister misiniz?"* mesajı çıkar ve tek tıkla doğrudan mekanın **Google Haritalar Yorum Linkine** yönlendirilir.
  - **1, 2 veya 3 Yıldız seçerse:** Google'a yönlendirilmez! Bunun yerine *"Üzgünüz, deneyiminizi nasıl düzeltebiliriz?"* diyen anonim bir geri bildirim kutusu açılır. Yazılan mesaj **sadece İşletme Paneline** (kırmızı öncelikli uyarı olarak) düşer.

### Modül 7: Dijital Hediye Çeki (Gift Card)
- Müşterinin bir arkadaşına o mekandan kahve veya belirli bir tutarda (ör. 250₺, 500₺, 1000₺ veya "2 Kişilik Kahve & Tatlı") dijital hediye çeki oluşturmasını sağlar.
- **Akış:** Tutar/Paket seç → Gönderen adı ve kısa not yaz → Ödeme simülasyonunu tamamla → Sistem benzersiz bir **QR Kod / 6 Haneli Hediye Kodu** ve WhatsApp'tan paylaşılabilir şık bir dijital kart görseli üretir.
- İşletme Panelinde bu kodu doğrulayıp "Kullanıldı" olarak işaretleyecek basit bir kod sorgulama alanı bulunur.

### Modül 8: Sosyal Medya & Mekan Vitrini Kartı
- Ana ekranda dikkat çekici bir kart olarak yer alır.
- Mekanın Instagram, TikTok, Spotify (mekan çalma listesi) hesaplarına tek tıkla yönlendirme sağlar.
- *"Bizi Hikayende Paylaş"* / *"Konumu Arkadaşına Gönder (WhatsApp)"* hızlı aksiyonlarını içerir.

---

## 5. Tasarım Dili ve UI/UX Standartları
- **Estetik:** Lüks, modern, minimalist. Koyu tema (Dark Mode - ör. kömür siyahı/koyu antrasit zemin, sıcak kahve/amber/altın vurgu renkleri) varsayılan olmalı; mekanın markasına göre renklerin tek yerden değiştirilebileceği (theming) bir yapı kurulmalıdır.
- **Bento Grid Ana Ekran:** Müşteri NFC/QR ile girdiğinde karşısına karmaşık listeler değil, modern **Bento Grid (kart tabanlı)** bir ana sayfa çıkmalıdır:
  - Üstte: Mekan Logosu + "Masa 12" rozeti.
  - Ana Büyük Kart: "Hareketli Menüyü Keşfet" (arka planda hafif hareketli GIF).
  - Orta Kartlar: "Garson Çağır", "Hesabı Böl & Öde", "Bahşiş Bırak".
  - Alt Kartlar: "Dijital Hediye Çeki", "Bizi Puanla (Google)", "Sosyal Medya".
- **Mikro Etkileşimler:** Buton basışlarında akıcı animasyonlar, başarı ekranlarında (bahşiş, hediye çeki, 5 yıldız) zarif konfeti veya onay animasyonları.

---

## 6. Önerilen Veri Modeli (Özet Şema)
- `venues`: `id`, `name`, `slug`, `logo_url`, `primary_color`, `google_review_url`, `instagram_url`, `tiktok_url`
- `tables`: `id`, `venue_id`, `table_number`, `status`
- `categories`: `id`, `venue_id`, `name`, `sort_order`
- `products`: `id`, `venue_id`, `category_id`, `name`, `description`, `price`, `media_url` (GIF/WebP/MP4), `allergens[]`, `paired_product_id` (akıllı yan ürün için)
- `service_requests`: `id`, `venue_id`, `table_id`, `type` (`'waiter' | 'bill' | 'water'`), `status` (`'pending' | 'completed'`), `created_at`
- `demo_orders`: `id`, `venue_id`, `table_id`, `items` (JSON: product, price, is_paid), `total_amount`
- `feedbacks`: `id`, `venue_id`, `table_id`, `rating` (1-5), `comment`, `redirected_to_google` (boolean), `created_at`
- `tips`: `id`, `venue_id`, `table_id`, `amount`, `department`, `note`, `created_at`
- `gift_cards`: `id`, `venue_id`, `code`, `amount`, `sender_name`, `message`, `is_redeemed`, `created_at`

---

## 7. Teknoloji Yığını (Önerilen)
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion (akıcı animasyonlar için) + Lucide Icons.
- **Backend & Realtime:** Supabase (PostgreSQL + Realtime subscriptions ile anlık garson bildirimi ve canlı adisyon bölüşme).
- **Deployment:** Vercel (hızlı demo linki paylaşımı için).

---

## 8. AI Geliştirme Talimatı (Adım Adım İlerleme)
Bu dokümanı okuduktan sonra **doğrudan tüm kodu yazmaya başlama**. Şu sırayla ilerleyelim:
1. Önce klasör yapısını, veritabanı tablolarını ve ekran akışını (User Flow) özetle ve onayıma sun.
2. Onay sonrası **Faz 1:** Demo mekan verilerini ("Lumina Coffee & Bistro") ve Bento Grid Müşteri Ana Ekranını + Hareketli GIF Menüyü + Akıllı Yan Ürün modülünü kodla.
3. **Faz 2:** Tek Tıkla Garson Çağırma + Canlı Personel Panelini (Realtime bildirimli) kodla.
4. **Faz 3:** Bölmeli Adisyon + Bahşiş + Dijital Hediye Çeki (demo ödeme akışlı) modüllerini kodla.
5. **Faz 4:** İtibar Kalkanı (1-3 / 4-5 yıldız akışı) + Sosyal Medya Kartını ekleyip tüm sistemi cilala.