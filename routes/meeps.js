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
                    title: 'Tasks',
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


module.exports = router;