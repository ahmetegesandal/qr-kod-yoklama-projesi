Proje Başlatmak İçin:
npm run dev

DB:
my_auth_db.sql

Örnek Kullanıcılar:
Kullanıcı Adı: ege
Şifre: ege123

Örnek Adminler:
Kullanıcı Adı: efe
Şifre: efe123


1. Yeni Dal Oluşturma: Yeni bir özellik üzerinde çalışmaya başlamak için yeni bir dal oluşturabilirsiniz.
git checkout -b yeni-ozellik


2. Dalda Çalışma: Yeni dalda dosyalar üzerinde değişiklik yapın. Değişiklikleri ekleyip commit edin:
git add .          # Değişiklikleri ekle
git commit -m "Yeni özellik eklendi"  # Commit et


3. Ana Dal (Master) ile Birleştirme (Merge): Değişikliklerinizi ana dal ile birleştirmek için önce ana dala geçin, sonra merge komutunu kullanın.
git checkout master   # Ana dala geç
git merge yeni-ozellik  # Yeni özellik dalını ana dala birleştir


4. Dal Silme: İşiniz bittiğinde dalı silebilirsiniz.
git branch -d yeni-ozellik  # Yerel dalı sil
git push origin --delete yeni-ozellik  # Uzak depodaki dalı sil


5. Yeni Dalı Göndermek:
git push origin yeni-ozellik


6. Uzak depodan güncellemeleri çekin:
git pull origin master


visual studio codu indirin
https://code.visualstudio.com/


Git'i Yükleyin: Eğer bilgisayarınızda yüklü değilse, Git yükleyin.
https://git-scm.com/downloads

Proje Dizini Oluşturun:
mkdir arelim
cd arelim

Git Reposunu Klonlayın:
git clone https://github.com/ahmetegesandal/arelim.git .

Bağımlılıkları Yükleyin: Eğer proje bir Node.js projesiyse, aşağıdaki komutla bağımlılıkları yükleyebilirsiniz:
https://nodejs.org/en/download/prebuilt-installer node js yoksa
npm install


Projeyi Çalıştırın: Projeyi çalıştırmak için şu komutu kullanabilirsiniz:
npm run dev


db için xammp:
https://www.apachefriends.org/tr/download.html
apache ve mysql startla mysql in karşısındaki admine bas açılan yerden sol üstte yeni de veritabanı adı yazan yere my_auth_db
yaz ve oluştur ardından sol üstte çıkan my_auth_db ye tıkla sonra ortadaki menülerden içe aktar de githubdaki db dosyasını seç ve onayla db kuruldu

BU PROGRAM HER BİLGİSAYAR AÇILDIĞINDA AÇILMASI GEREK VE START TUŞLARINA BASILMASI GEREK




## Görev Dağılımı

### Web ve Mobil Geliştirme:
- **Ege**:
  - Genel sistemin web arayüz geliştirmesi
  - Mobil sisteme yönelik web uyumluluğu

### Modül Geliştirme:
- **Emir**:
  - Kulüp Üyelik Sistemi
  - Akademik Takvim Modülü
- **Ufuk**:
  - Anket Sistemi
- **Furkan**:
  - Sistem için Dark Mod geliştirmesi
  - Genel tasarım ve estetik hatalarının giderilmesi css

### Veritabanı ve Dil Desteği:
- **Hatice**:
  - SQL veritabanına kayıt girişi
  - Dil desteği dosyası geliştirilmesi
  - Genel fikir üretimi
- **Sena**:
  - SQL veritabanı yapısının kontrolü
  - SQL veritabanına kayıt girişi
  - Dil desteği dosyası geliştirilmesi
  - Genel fikir üretimi

