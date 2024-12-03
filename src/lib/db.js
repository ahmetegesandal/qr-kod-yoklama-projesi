import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root', // Veritabanı kullanıcı adınız
    password: '', // Veritabanı şifreniz
    database: 'my_auth_db'
};

export async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Veritabanı bağlantısı başarılı!');
        return connection;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error.message);
        throw error; // Hata fırlat
    }
}
