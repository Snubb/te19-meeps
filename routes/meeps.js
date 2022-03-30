const express = require('express');
const pool = require('../database');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let sql = "SELECT * FROM meeps";
    const json = req.query.json;
    const sort = req.query.sort;
    let keyword = "";
    if(req.query.keyword) {
        keyword = req.query.keyword.toLowerCase();
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
            case 'rand':
                sql += " ORDER BY RAND()";
                break;
        }
    }

    await pool.promise()
        .query(sql)
        .then(([rows, fields]) => {
            numOfItemsPerPage = 5;
            let newRows = rows.slice((page-1)*numOfItemsPerPage, ((page-1)*numOfItemsPerPage)+numOfItemsPerPage);
            
            console.log(newRows);
            if (json == "true") {
                res.json({
                    tasks: {
                        data: newRows
                    }
                });
            } else {
                let  data = {
                    message: 'Displaying tasks',
                    layout:  'layout.njk',
                    title: 'Meeps',
                    items: newRows,
                    keyword: keyword,
                    sort: sort,
                    page: parseInt(page)
                }
                res.render('meeps.njk', data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: "Cannot retrieve tasks"
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
        const sql = 'INSERT INTO meeps (title, body) VALUES (?, ?)';
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
                tasks: {
                    error: "Cannot retrieve tasks"
                }
            });
        });
});


module.exports = router;