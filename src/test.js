"use strict";
// exports.__esModule = true;
import pkg from 'sqlite3';
const { verbose } = pkg
const sqlite3 = (0, verbose)();
var db = new sqlite3.Database('./assets/main.db');
db.serialize(function () {
    // db.run("CREATE TABLE lorem (info TEXT)");
    // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();
    db.run("UPDATE users SET coins=coins+$coins, exp=exp+$exp, correct_trivia=correct_trivia+1, trivia_streak=trivia_streak+1 WHERE id=$id",
        {
          $coins: 1000,
          $exp: 10,
          $id: 774980691016024085n
        },
        function (err) { if (err) throw err; })
    // db.get("SELECT id,trivia_streak FROM users WHERE id=?", ["774980691016024085"], function (err, row) {
    //     if (err) throw err;
    //     console.log(typeof ((row.id)*1n));
    //     console.log(row.trivia_streak)
    // });
});
db.close();
