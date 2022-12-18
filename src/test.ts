import { verbose } from 'sqlite3';
const sqlite3 = verbose();
const db = new sqlite3.Database('./assets/main.db');
import { UsersTableType } from './assets/DatabaseTypes.js';


db.serialize(() => {
    // db.run("CREATE TABLE lorem (info TEXT)");

    // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    db.get('SELECT id,level FROM users WHERE id=412350076065677313', function (err: Error, row: UsersTableType) {
        if (err) throw err;
        console.log(typeof (row.id));
    });
});

db.close();