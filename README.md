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


1. Yeni Dal Oluşturma
Yeni bir özellik üzerinde çalışmaya başlamak için yeni bir dal oluşturabilirsiniz. Bunun için git checkout -b yeni-ozellik komutunu kullanabilirsiniz.

2. Dalda Çalışma
Yeni dalda dosyalar üzerinde değişiklik yapın. Değişiklikleri ekleyip commit etmek için:

Öncelikle değişiklikleri eklemek için git add . komutunu kullanın. Ardından, değişiklikleri commit etmek için git commit -m "Yeni özellik eklendi" komutunu kullanabilirsiniz.

3. Ana Dal (Master) ile Birleştirme (Merge)
Değişikliklerinizi ana dal ile birleştirmek için önce ana dala geçin, sonra merge komutunu kullanın. Şu adımları izleyebilirsiniz:

Öncelikle ana dala geçmek için git checkout master komutunu kullanın. Daha sonra, yeni oluşturduğunuz dalı ana dala birleştirmek için git merge yeni-ozellik komutunu çalıştırın.

4. Dal Silme
İşiniz bittiğinde dalı silebilirsiniz. Bunun için:

Yerel dalı silmek için git branch -d yeni-ozellik komutunu, uzak depodaki dalı silmek için ise git push origin --delete yeni-ozellik komutunu kullanabilirsiniz.

5. Yeni Dalı Göndermek
Yeni dalınızı uzak depoya göndermek için git push origin yeni-ozellik komutunu kullanabilirsiniz.

6. Uzak Depodan Güncellemeleri Çekmek
Uzak depodaki güncellemeleri çekmek için git pull origin master komutunu kullanabilirsiniz.

Visual Studio Code İndirme
Visual Studio Code'u indirmek için şu linki ziyaret edin:
Visual Studio Code İndir

Git Yükleme
Eğer bilgisayarınızda Git yüklü değilse, Git'i buradan indirebilirsiniz.

Proje Dizini Oluşturma
Proje dizininizi oluşturun ve bu dizine geçiş yapın:

mkdir arelim komutuyla dizini oluşturun, ardından cd arelim komutuyla dizine geçin.

Git Reposunu Klonlama
Git reposunu klonlamak için şu komutu kullanabilirsiniz:

git clone https://github.com/ahmetegesandal/arelim.git .

Bağımlılıkları Yükleme
Eğer proje bir Node.js projesiyse, bağımlılıkları yüklemek için şu komutu kullanın:

npm install

Eğer Node.js yüklü değilse, Node.js yükleyebilirsiniz.

Projeyi Çalıştırma
Projeyi çalıştırmak için şu komutu kullanabilirsiniz:

npm run dev

Veritabanı Kurulumu (XAMPP ile)
XAMPP'yi indirin ve yükleyin.
XAMPP'yi başlatın, Apache ve MySQL servisini çalıştırın.
MySQL'in karşısındaki "Admin" butonuna tıklayın.
Sol üstte "Yeni" sekmesine tıklayın, veritabanı adı olarak my_auth_db yazın ve "Oluştur" butonuna basın.
Sol menüde oluşturduğunuz my_auth_db veritabanına tıklayın.
Ortadaki menülerden "İçe Aktar" sekmesini seçin.
GitHub'dan indirdiğiniz veritabanı dosyasını seçin ve "Yürüt" butonuna basın.
Bu adımları takip ederek projeyi kurabilir ve geliştirme yapabilirsiniz.


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

