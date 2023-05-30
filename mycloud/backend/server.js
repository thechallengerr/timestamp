const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

app.get('/posts', (req, res) => {
    const sql = "SELECT * FROM posts";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
})

app.get('/posts/:id', (req, res) => {
    const fileId = req.params.id;
    const sql = "SELECT * FROM posts WHERE id = ?";
    db.query(sql, [fileId], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

app.post('/newposts', (req, res) => {
    // console.log(req.body)
    time = req.body.time;
    name = req.body.name;
    const sql = "SELECT * FROM posts WHERE date = ? AND name = ?";
    db.query(sql, [time, name], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });

});

app.post('/posts', (req, res) => {
    // console.log(req.body);
    const sql = "INSERT INTO posts (`name`, `desc`, `date`) VALUES (?)";
    const values = [req.body.name, req.body.desc, req.body.date];

    db.query(sql,[values], (err, result) => {
        if (err) return res.json(err);
        return res.json("post has been added");
    });
})

app.delete('/posts/:id', (req, res) => {
    const fileId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ?";

    db.query(q, [fileId], (err, result) => {
        if (err) return res.json(err);
        return res.json("post has been deleted");
    });
});

app.put('/posts/:id', (req, res) => {
    const fileId = req.params.id;
    console.log(fileId);
    const q = "UPDATE posts SET name = ?, `desc` = ? WHERE id = ?";
    const values = [req.body.name, req.body.desc];
    db.query(q, [...values,fileId], (err, result) => {
        if (err) return res.json(err);
        return res.json("post has been updated");
    });
});

app.post('/historys', (req, res) => {
    console.log(req.body);
    const sql = "INSERT INTO historys (`fileId`, `fileName`,`fileSize`,`time`,`operation`,`operator`,`blockHash`) VALUES (?)";
    const values = [req.body.fileId, req.body.fileName, req.body.fileSize, req.body.time, req.body.operation, req.body.operator, req.body.blockHash];

    db.query(sql,[values], (err, result) => {
        if (err) return res.json(err);
        return res.json("post has been added");
    });
})

app.get('/historys', (req, res) => {
    const sql = "SELECT * FROM historys";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
})

app.get('/historys/:id', (req, res) => {
    const fileId = req.params.id;
    const sql = "SELECT blockHash FROM historys where fileId = ? ORDER BY time DESC LIMIT 1"
    db.query(sql, [fileId], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
})

// app.get('/books', (req, res) => {
//     const sql = "SELECT * FROM books";
//     db.query(sql, (err, result) => {
//         if (err) return res.json(err);
//         return res.json(result);
//     });
// });

// app.post('/books', (req, res) => {
//     const sql = "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES (?)";
//     const values = [req.body.title, req.body.desc, req.body.cover, req.body.price];

//     db.query(sql,[values], (err, result) => {
//         if (err) return res.json(err);
//         return res.json("book has been added");
//     });
// });

// app.delete('/books/:id', (req, res) => {
//     const fileId = req.params.id;
//     const q = "DELETE FROM books WHERE id = ?";

//     db.query(q, [fileId], (err, result) => {
//         if (err) return res.json(err);
//         return res.json("book has been deleted");
//     });
// });

// app.put('/books/:id', (req, res) => {
//     const fileId = req.params.id;
//     const q = "UPDATE books SET title = ?, `desc` = ?, cover = ?, price = ? WHERE id = ?";
//     const values = [req.body.title, req.body.desc, req.body.cover, req.body.price];
//     db.query(q, [...values,fileId], (err, result) => {
//         if (err) return res.json(err);
//         return res.json("book has been updated");
//     });
// });

app.listen(8800, () => {
    console.log("Listening on port 8800")
});