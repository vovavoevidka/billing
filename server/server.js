var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');
var log4js = require('log4js');
var RedisSessions = require("redis-sessions");

var app = express();
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
var logger = log4js.getLogger();


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
        req.userId = resp.d.userId;
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
            logger.error("[500] select user from db error", err);
            return res.send(401);
        }

        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


        var re = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
        var _ip = ip.match(re)[0] ? ip.match(re)[0] : "";
        logger.info("client ip: ", _ip);

        if (rows.length > 0) {
            logger.warn("loggined user id", rows[0].id);
            rs.create({
                    app: rsapp,
                    id: username,
                    ip: _ip
                },
                function(err, resp) {
                    if (err) {
                        logger.error("[500] redis session create error", err);
                        return res.send(401);
                    }
                    rs.set({
                        app: rsapp,
                        token: resp.token,
                        d: {
                            userId: rows[0].id
                        }
                    }, function() {
                        logger.warn("generated token", resp.token);
                        res.send({
                            result: 'success',
                            authorizationToken: resp.token
                        });
                    })
                });
        } else {
            logger.error("[401] redis session create, user not found");
            return res.send(401);
        }
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
    logger.info("[IN_CONNECTION]select dash info");
    client.query("SELECT fu.*, plans.name as pl_name, plans.descr as pl_descr FROM fullusers AS fu JOIN plans2 AS plans ON fu.paket = plans.id WHERE fu.name = ?", [user], function(err, rows, fields) {
        if (err) {
            res.statusCode = 500;
            logger.error("[500] select dash info", err);
            return res.send({
                result: 'error',
                err: err.code
            });
        }
        logger.info("[200] select dash info", rows);
        if (rows && rows[0]) {
            var user = rows[0];
            delete user.passwd;
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

app.post('/changePassword', isAuthUser, function(req, res) {
    var user = req.username;
    var userId = req.userId;

    var password = req.body['password'];
    logger.info("[200] change password init", user , password);
    if(userId && password) {
        client.query("UPDATE users SET passwd=AES_ENCRYPT(?, ?) WHERE name = ?", [password, salt, user], function(err, rows, fields) {
            if (err) {
                res.statusCode = 500;
                logger.error("[500] change password", err);
                return res.send({
                    result: 'error',
                    err: err.code
                });
            }
            logger.info("[200] change password");
            return res.send({
                user: rows[0]
            }); 
        });
    }

});

app.post('/payments', isAuthUser, function(req, res) {
    var user = req.username;
    var userId = req.userId;

    var from = req.body['from'] || 0;
    var count = req.body['length'] || 20;
    var firstItemId = req.body['fid'] || null;

    logger.warn("selecting payment for user", userId);
    client.query("SELECT *, mid as 'rmid', time as 'rtime', (SELECT SUM(cash) FROM pays WHERE mid=rmid AND type IN (10,20) AND time<=rtime) as 'balance' FROM pays WHERE mid = ? AND type IN (10,20) ORDER BY time DESC", [userId], function(err, rows, fields) {
        if (err || !rows || rows.length == 0) {
            logger.error("[500] select payments error", err);
            logger.error("[500] select payments rows", rows);
            logger.error("[500] select payments rows.length", rows.length);
            res.statusCode = 500;
            return res.send({
                result: 'error',
                err: err.code
            });
        }

        var err = function(err) {
            logger.error("[500] select payments error", err);
            res.statusCode = 500;
            return res.send({
                result: 'error',
                err: err.code
            });
        };

        if (from == -1 && firstItemId) {
            var payments = [];
            var i = 0;
            while (rows[i].id != firstItemId && rows[i]) {
                payments.push(rows[i]);
                i++;
            }
            return res.send({
                payments: payments,
                isEnd: false
            });
        }

        var isEnd = false;
        if (from + count >= rows.length)
            isEnd = true;
        return res.send({
            payments: rows.slice(from, from + count),
            isEnd: isEnd
        });
    });
});

/*app.post('/traffic', isAuthUser, function(req, res) {
    var user = req.username;
    var userId = req.userId;

    logger.warn("selecting traffic for user", userId);
    client.query("SELECT SUM(`in`) AS a ,SUM(`out`) AS b,time FROM x$tname WHERE mid IN ($Sel_id) AND class=$class AND (`in`>0 OR `OUT`>0) GROUP BY time ORDER BY time DESC", [], function(err, rows, fields) {
        
    });
});*/

app.listen(port);
console.log('Magic happens on port ' + port);