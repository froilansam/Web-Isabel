var express = require('express');
var router = express.Router();
var routerAdmin = express.Router();
var routerEnforcer = express.Router();
var mobAPI = express.Router();
var routerAPI = express.Router();
var routerSetup = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var db = require('../../lib/database')();
const moment = require('moment');
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
var upload = multer({ storage: storage})

router.use(authMiddleware.hasAuth);

router.get('/', (req, res) => {
    console.log(req.session.user)
    const queryString = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo WHERE strUsername = ? AND strPassword = ? AND booIsVerified = 1`;
    db.query(queryString, [req.session.user.strUsername, req.session.user.strPassword ], function (err, results, fields) {
       if(err) return console.log(err);
        console.log(results[0]);
        req.session.user = results[0];
        req.session.user.datBirthDate = moment(req.session.user.datBirthDate).format('MMMM Do YYYY')
        res.render('home/views/profile', {user: req.session.user});
    });
    
})

router.post('/', upload.single('strImage'), (req, res) => {
    req.body.strImage = req.file.filename;
    console.log(req.body.strImage);

    const queryForImage = `UPDATE tbluser SET strImage = ? WHERE strUsername = ?`
    db.query(queryForImage, [req.body.strImage, req.session.user.strUsername],function (err, results, fields) {
        if(err) return console.log(err)
        console.log('uploaded')
        res.redirect('/index');
    });
})

router.get('/license', (req, res) => {
    console.log(req.session.user)
    const queryString = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo WHERE strUsername = ? AND strPassword = ? AND booIsVerified = 1`;
    db.query(queryString, [req.session.user.strUsername, req.session.user.strPassword ], function (err, results, fields) {
       if(err) return console.log(err);
        console.log(results[0]);
        req.session.user = results[0];
        req.session.user.datBirthDate = moment(req.session.user.datBirthDate).format('MMMM Do YYYY')
        res.render('home/views/license', {user: req.session.user});
    });
})

router.get('/settings', (req, res) => {
    res.render('home/views/settings', {user: req.session.user})
})


routerAPI.post('/accounts', (req, res) => {
    if(req.body.strPassword == null || req.body.strPassword == ""){
        res.send({accounts: {strUsername: "", strPassword: ""}});
    }
    else{
        const queryString = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo WHERE strUsername = ? AND strPassword = PASSWORD(?);`;
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
    }
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

//Login Mobile
mobAPI.post('/login', (req, res) => {
    const queryForLogin = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo WHERE strUsername = ? and strPassword = PASSWORD(?);`;
    db.query(queryForLogin, [req.body.strUsername, req.body.strPassword],function (err, results, fields) {
        if(err) return console.log(err);
        if(results.length > 0){
            req.session.user = results[0];
            res.send({user: req.session.user})
        }
        else
            res.send({user: 'none'});
    });
});

// Admin Page
routerAdmin.use(authMiddleware.hasAuthorityAdmin);

routerAdmin.get('/', (req, res) => {
    console.log(req.session.authority)
    res.render('home/views/admin',{ admin: req.session.authority});
});

// Enforcer Page
routerEnforcer.use(authMiddleware.hasAuthorityEnforcer);

routerEnforcer.get('/', (req, res) => {
    console.log(req.session.authority)
    res.redirect('http://www.facebook.com')
});

//password
routerSetup.get('/', (req, res) => {
    
    const queryForSetup = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo WHERE PASSWORD(strUsername) = ?`;
    db.query(queryForSetup, [req.query.u],function (err, results, fields) {
        if(err) return console.log(err);
        console.log(results[0])
        if(results.length > 0 && ( results[0].strPassword == '' || results[0].strPassword == null)){
            var user = results[0];
            res.render('home/views/password', {user: user});
        }
        else{
            res.redirect('/login?x=9is0dha8hd546y4trht2yhr4wy4');
        }
    });
})

routerSetup.post('/', (req, res) => {
    console.log(req.body);
    if(req.body.strPassword == req.body.strPassword2){
        const queryForPassword = `UPDATE tbluser SET strPassword = PASSWORD(?), booIsVerified = 1 WHERE strUsername = ? `;
        db.query(queryForPassword, [req.body.strPassword, req.body.strUsername], function (err, results, fields) {
            if (err) return console.log(err);
            const queryForUsername = `SELECT PASSWORD(strUsername) AS username FROM tbluser WHERE strUsername = ?`
            db.query(queryForUsername, [req.body.strUsername],function (err, results, fields) {
                if (err) return console.log(err);
                if(results.length>0)
                    res.redirect('/login?dstn='+results[0].username)
                else
                    res.redirect('/login?x=9is0dha8hd546y4trht2yhr4wy4');
            });
        });
    }
       
})

exports.index = router;
exports.api = routerAPI;
exports.admin = routerAdmin;
exports.enforcer = routerEnforcer;
exports.mob = mobAPI;
exports.setup = routerSetup;
