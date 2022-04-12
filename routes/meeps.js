const express = require('express');
const pool = require('../database');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let sql = "SELECT * FROM olrlut_meeps";
    const json = req.query.json;
    const sort = req.query.sort;
    let limit = 5;
    if (req.query.limit) {
        limit = req.query.limit;
    }
    let keyword = "";
    if(req.query.keyword) {
        keyword = req.query.keyword.toLowerCase();
        sql += " WHERE title LIKE '%" + keyword + "%' OR body LIKE '%" + keyword + "%'"
    }
    let page = 1;
    if(req.query.page) {
        page = req.query.page;
    }

    if(sort) {
        switch (sort) {
            case 'date':
                sql += " ORDER BY createdAt";
                break;
            case 'alphabetically':
                sql += " ORDER BY title";
                break;
            case 'random':
                sql += " ORDER BY RAND()";
                break;
        }
    }

    console.log(sql);
    await pool.promise()
        .query(sql)
        .then(([rows, fields]) => {
            let newRows = rows;
            let numOfPages = 1;
            if (limit != -1) {
                newRows = rows.slice((page-1)*limit, (page)*limit);
                numOfPages = Math.ceil(rows.length/limit);
            } 
            if (json == "true") {
                res.json({
                    meeps: {
                        data: newRows
                    }
                });
            } else {
                let  data = {
                    message: 'Displaying meeps',
                    layout:  'layout.njk',
                    title: 'Meeps',
                    items: newRows,
                    keyword: keyword,
                    sort: sort,
                    page: parseInt(page),
                    limit: limit,
                    numOfPages: numOfPages
                }
                res.render('meeps.njk', data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Cannot retrieve meeps"
                }
            });
        });
});


// Post a meep
router.get('/post',
  (req, res, next) => {
    let  data = {
        message: 'Post a new meep',
        layout:  'layout.njk',
        title: 'Post a new meep'
    }
    res.render('postMeep.njk', data);
});

router.post('/',
    async (req, res, next) => {
        const sql = 'INSERT INTO olrlut_meeps (title, body) VALUES (?, ?)';
        await pool.promise()
        .query(sql, [req.body.meepTitle, req.body.meepBody])
        .then((response) => {
            console.log(response);
            if (response[0].affectedRows == 1) {
                res.redirect('/meeps');
            } else {
                res.status(400).json({
                    task: {
                        error: "Invalid task"
                    }
                })
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Cannot retrieve meeps"
                }
            });
        });
});


module.exports = router;