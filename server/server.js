var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');
var RedisSessions = require("redis-sessions");
var rs = new RedisSessions();
var rsapp = "billing";
var salt = "hardpass3";
var port = 3000;
var client = mysql.createPool({
    user: 'sa',
    password: '1111',
    host: '192.168.254.13',
    port: '3306',
    database: 'bill',
    _socket: '/var/run/mysqld/mysqld.sock',
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, username, password');
    if ('OPTIONS' == req.method)
        res.send(200);
    else
        next();
};

app.configure(function() {
    app.use(bodyParser());
    app.use(allowCrossDomain);
});

function isAuthUser(req, res, next) {
    var token = req.header('Authorization') || '';
    if (token == '')
        return res.send(401);
    rs.get({
        app: rsapp,
        token: token
    }, function(err, resp) {
        if (err)
            return res.send(401);
        req.username = resp.id;
        next();
    });
};

app.post('/login', function(req, res) {
    var username = req.header('username') || '';
    var password = req.header('password') || '';
    if (username == '' || password == '')
        return res.send(401);

    client.query('SELECT * FROM fullusers WHERE name = ? AND passwd = AES_ENCRYPT(?, ?)', [username, password, salt], function(err, rows, fields) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err: err.code
            });
        }

        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        rs.create({
                app: rsapp,
                id: username,
                ip: ip.substr(ip.length - 15)
            },
            function(err, resp) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err: err.code
                    });
                }
                res.send({
                    result: 'success',
                    authorizationToken: resp.token
                });
            });
    });
});

app.post('/logout', isAuthUser, function(req, res) {
    var user = req.username;

    rs.killsoid({
            app: rsapp,
            id: user
        },
        function(err, resp) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err: err.code
                });
            }
            res.send({
                result: 'success'
            });
        });
});

app.get('/', isAuthUser, function(req, res) {
    var user = req.username;
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

app.get('/dashInfo', isAuthUser, function(req, res) {
    var user = req.username;
    client.query("SELECT fu.*, plans.name as pl_name, plans.descr as pl_descr FROM fullusers AS fu JOIN plans2 AS plans ON fu.paket = plans.id WHERE fu.name = ?", [user], function(err, rows, fields) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.send({
                result: 'error',
                err: err.code
            });
        }
        if (rows && rows[0]) {
            var user = rows[0];
            return res.send({
                user: user
            });
        } else {
            res.statusCode = 500;
            return res.send({
                result: 'error'
            });
        }
    });
});

app.listen(port);
console.log('Magic happens on port ' + port);