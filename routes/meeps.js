const express = require('express');
const pool = require('../database');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const sql = "SELECT * FROM meeps";
    const json = req.params.json;
    await pool.promise()
        .query(sql)
        .then(([rows, fields]) => {
            console.log(rows)
            if (json == "true") {
                res.json({
                    tasks: {
                        data: rows
                    }
                });
            } else {
                let  data = {
                    message: 'Displaying tasks',
                    layout:  'layout.njk',
                    title: 'Meeps',
                    items: rows,
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