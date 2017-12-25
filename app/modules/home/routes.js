var express = require('express');
var router = express.Router();
var routerAdmin = express.Router();
var routerEnforcer = express.Router();
var mobAPI = express.Router();
var routerAPI = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();

routerAPI.post('/accounts', (req, res) => {
    const queryString = `SELECT * FROM tbluser WHERE strUsername = ? AND strPassword = ?;`;
     db.query(queryString, [req.body.strUsername, req.body.strPassword ],function (err, results, fields) {
        console.log(results[0]);
        if(results[0] == null){
            console.log('hellooo')
            console.log(results[0])
            res.send({accounts: {strUsername: "", strPassword: ""}});
        }
        else{
            req.session.user = results[0];
            res.send({accounts: req.body});
        }
        
    });
    console.log(req.body);
});

routerAPI.post('/checkAccounts/:id', (req, res) => {
    console.log(req.body);
    if(req.params.id == 'username'){
        const queryString = `SELECT * FROM tbluser WHERE strUsername = ?`;
        db.query(queryString, [req.body.strUsername],function (err, results, fields) {
            if(results.length > 0){
                res.send({ "username": false });
            }
            else{
                res.send({ "username": true });
            }
        });
    }
    if(req.params.id == 'email'){
        const queryString = `SELECT * FROM tbluser WHERE strEmail = ?`;
        db.query(queryString, [req.body.strEmail],function (err, results, fields) {
            if(err) console.log(err);
            if(results.length > 0){
                res.send({ "email": false });
            }
            else{
                res.send({ "email": true });
            }
        });
    }
    if(req.params.id == 'license'){
        const queryString = `SELECT * FROM tbluser WHERE strLicenseNo = ? AND booIsVerified = 1`;
        db.query(queryString, [req.body.strLicenseNo],function (err, results, fields) {
            if(err) console.log(err);
            if(results.length > 0){
                res.send({ "license": false });
            }
            else{
                res.send({ "license": true });
            }
        });
    }
})



mobAPI.post('/checkAccounts/:id', (req, res) => {
    console.log(req.body);
    if(req.params.id == 'username'){
        const queryString = `SELECT * FROM tbluser WHERE strUsername = ?`;
        db.query(queryString, [req.body.strUsername],function (err, results, fields) {
            if(results.length > 0){
                res.send({username:  false });
            }
            else{
                res.send({ username: true });
            }
        });
    }
    if(req.params.id == 'email'){
        const queryString = `SELECT * FROM tbluser WHERE strEmail = ?`;
        db.query(queryString, [req.body.strEmail],function (err, results, fields) {
            if(err) console.log(err);
            if(results.length > 0){
                res.send({ email: false });
            }
            else{
                res.send({ email: true });
            }
        });
    }
    if(req.params.id == 'license'){
        const queryString = `SELECT * FROM tbluser WHERE strLicenseNo = ? AND booIsVerified = 1`;
        db.query(queryString, [req.body.strLicenseNo],function (err, results, fields) {
            if(err) console.log(err);
            if(results.length > 0){
                res.send({ license: false });
            }
            else{
                res.send({ license: true });
            }
        });
    }
})

// Admin Page
routerAdmin.use(authMiddleware.hasAuthorityAdmin);

routerAdmin.get('/', (req, res) => {
    console.log(req.session.authority)
    res.redirect('http://www.facebook.com')
});

// Enforcer Page
routerEnforcer.use(authMiddleware.hasAuthorityEnforcer);

routerEnforcer.get('/', (req, res) => {
    console.log(req.session.authority)
    res.redirect('http://www.facebook.com')
});

exports.index = router;
exports.api = routerAPI;
exports.admin = routerAdmin;
exports.enforcer = routerEnforcer;
exports.mob = mobAPI;