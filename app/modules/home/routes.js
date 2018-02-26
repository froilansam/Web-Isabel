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

router.get('/dashboard', (req, res) => {
    console.log(req.session.user)
    res.render('home/views/dashboard', {user: req.session.user});
});

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

router.post('/ticket', (req, res) => {
    const queryticket = `SELECT * FROM (((tblticket JOIN tbluserviolation ON intUserViolationTicketID = intTicketID) JOIN tblviolation ON intUserViolationViolationID = intViolationid) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo) JOIN tblauthority ON strTicketAuthorityUsername = strAuthorityUsername WHERE intTicketID = ?`;
    db.query(queryticket, [req.body.intUserViolationTicketID],function (err, results, fields) {
        console.log(results);
        results[0].strTicketDate = moment(results[0].strTicketDate).format('MMMM Do YYYY');
        res.send(results)
    });
});

router.post('/violation', (req, res) => {
    if(req.body.isPaid == 2){
        var queryViolation = `SELECT intTicketID FROM tblticket WHERE strTicketLicenseNo = ?`;
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryViolation, [req.session.user.strLicenseNo],function (err, results, fields) {
            console.log(results);
            res.send({violations: results})
        });
    }
    else{
        var queryViolation = `SELECT intTicketID FROM tblticket WHERE isPaid = ? AND strTicketLicenseNo = ?`;
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryViolation, [req.body.isPaid, req.session.user.strLicenseNo],function (err, results, fields) {
            console.log(results);
            res.send({violations: results})
        });
    }

    
});


router.post('/vio', (req, res) => {
    if(req.body.isPaid == 2){
        var queryVio = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tblauthority ON strAuthorityUserName = strTicketAuthorityUsername) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo WHERE strLicenseLicenseNo = ? GROUP BY intUserViolationTicketID ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryVio, [ req.session.user.strLicenseNo], function (err, results, fields) {
            console.log(results)
            for(var i = 0; i < results.length; i++){
                results[i].strTicketDate = moment(results[i].strTicketDate).format('MMMM Do YYYY');
                if( i == results.length-1){
                    res.send({vio: results})
                }
            }
        });
    }
    else{
        var queryVio = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tblauthority ON strAuthorityUserName = strTicketAuthorityUsername) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo WHERE isPaid = ? AND strLicenseLicenseNo = ? GROUP BY intUserViolationTicketID ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryVio, [req.body.isPaid,  req.session.user.strLicenseNo],function (err, results, fields) {
            console.log(results)
            for(var i = 0; i < results.length; i++){
                results[i].strTicketDate = moment(results[i].strTicketDate).format('MMMM Do YYYY');
                if( i == results.length-1){
                    res.send({vio: results})
                }
            }
        });
    }  
});

router.get('/license', (req, res) => {
    console.log(req.session.user)
    const queryString = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo WHERE strUsername = ? AND strPassword = ? AND booIsVerified = 1`;
    db.query(queryString, [req.session.user.strUsername, req.session.user.strPassword ], function (err, results, fields) {
       if(err) return console.log(err);
        console.log(results[0]);
        req.session.user = results[0];
        req.session.user.datBirthDate = moment(req.session.user.datBirthDate).format('MMMM Do YYYY')
        var queque = `SELECT *, strTicketLicenseNo AS LICENSE, (SELECT COUNT(*) FROM tblticket WHERE strTicketLicenseNo = LICENSE) AS Fa, (SELECT COUNT(*) FROM tblticket WHERE strTicketLicenseNo = LICENSE AND isPaid = 1) AS Sa from tblticket JOIN tbluser ON strTicketLicenseNo = strLicenseNo JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo WHERE strLicenseNo = ? GROUP BY strTicketLicenseNo`
        db.query(queque, [req.session.user.strLicenseNo], function (err, results, fields) {
            if(err) console.log(err);
            if(results[0].Fa == results[0].Sa){
                res.render('home/views/license', {user: req.session.user, location: "CTMDO Marikina", answer: 0});
            }
            else if(results[0].Fa != results[0].Sa){
                var answer =  results[0].Fa - results[0].Sa;
                res.render('home/views/license', {user: req.session.user, location: "", answer: answer});   
            }
        })    
    });
})


router.get('/receipt/:intTicketID', (req, res) => {
    const queryticket = `SELECT * FROM tblticket JOIN tbluserviolation ON intTicketID = intUserViolationTicketID JOIN tblviolation ON intUserViolationViolationID = intViolationid WHERE intTicketID = ?`;
    db.query(queryticket, [req.params.intTicketID],function (err, results, fields) {
        res.render('home/views/receipt', {details: results});
    });
});

router.post('/payment', (req, res) => {
    const queryticket = `UPDATE tblticket SET intReceiptNumber = ?, isPaid = 3 WHERE intTicketID = ?`;
    db.query(queryticket, [req.body.x, req.body.y],function (err, results, fields) {
        res.send('success');
    });
});

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

mobAPI.get('/session', (req, res) => {
    res.send({user: req.session.user.strLicenseNo})
});

mobAPI.get('/sessionchecker', (req, res) => {
    if(req.session.user){
        res.send('2');
    }
    else{
        res.send('1');
    }
});

mobAPI.get('/violation', (req, res) => {
    const queryForViolation = `SELECT * FROM tblviolation;`
    db.query(queryForViolation, function (err, results, fields) {
        if(err) return console.log(err);
        var violation = results;
        var vio = {}
        for(var i = 0; i < results.length; i++){
            vio[results[i].strSection] = results[i].strSection + ' - ' +results[i].strViolation;
            if(i == results.length - 1){
                res.send({violations: vio})
            }
        }
        
    })
});


mobAPI.get('/tickets', (req, res) => {
    var queryDash = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tbluser ON strLicenseNo = strTicketLicenseNo) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo WHERE strLicenseNo = ? GROUP BY intUserViolationTicketID;`
    db.query(queryDash, [req.session.user.strLicenseNo],function (err, results, fields) {
        if(err) console.log(err);

        res.send(results)
    })
});

mobAPI.post('/ticvio', (req, res) => {
    var queryDash = `SELECT * FROM tbluserviolation JOIN tblviolation ON intUserViolationViolationID = intViolationid WHERE intUserViolationTicketID = ?;`
    db.query(queryDash, [req.body.intTicketID],function (err, results, fields) {
        if(err) console.log (err)
            
        res.send(results)
    })
});

mobAPI.post('/multa', (req, res) => {
    var queryDash = `SELECT * FROM tbllicense JOIN tbluser ON strLicenseLicenseNo = strLicenseNo WHERE strLicenseNo = ?;`
    db.query(queryDash, [req.body.strLicenseNo],function (err, results, fields) {
        if(err) console.log (err)
        console.log(results)
        res.send(results[0])
    })
});


mobAPI.post('/putvio', (req, res) => {
    console.log(req.body);
    var queryDash = `INSERT INTO tblticket (strTicketAddress, strTicketDate, strTicketLicenseNo) VALUES (?, now(), ?);`
    db.query(queryDash, [req.body.strTicketAdress, req.body.strLicenseNo], function (err, results, fields) {
        if(err) console.log (err)
            console.log('----');
        var se = results
        console.log('seesesese')
        console.log(se.insertId)
        var viol = req.body.violation;
        
        for(var i = 0; i < viol.length; i++){
            var violation = viol[i].split(" - ")
            var dustin = `SELECT * FROM tblviolation WHERE strSection = ?;`
            db.query(dustin, [violation[0]], function (err, results, fields) {
                console.log('11111111111')
                if(err) console.log (err)
                console.log(results)
                var santos = `INSERT INTO tbluserviolation (intUserViolationViolationID, intUserViolationTicketID) VALUES (?, ?)`
                 db.query(santos, [results[0].intViolationid, se.insertId], function (err, results, fields) {
                     if(err) console.log (err)
                     console.log('success');
                 });
            });

        }
    })
});

mobAPI.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.send('success');
    });
});

// Admin Page
routerAdmin.use(authMiddleware.hasAuthorityAdmin);

routerAdmin.get('/', (req, res) => {
    console.log(req.session.authority)
    res.render('home/views/admin',{ admin: req.session.authority});
});

routerAdmin.post('/violation', (req, res) => {
    if(req.body.isPaid == 2){
        var queryViolation = `SELECT intTicketID FROM tblticket`;
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryViolation, function (err, results, fields) {
            console.log(results);
            res.send({violations: results})
        });
    }
    else{
        var queryViolation = `SELECT intTicketID FROM tblticket WHERE isPaid = ?`;
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryViolation, [req.body.isPaid],function (err, results, fields) {
            console.log(results);
            res.send({violations: results})
        });
    }
});


routerAdmin.post('/vio', (req, res) => {
    if(req.body.isPaid == 2){
        var queryVio = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tblauthority ON strAuthorityUserName = strTicketAuthorityUsername) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo GROUP BY intUserViolationTicketID ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryVio, function (err, results, fields) {
            console.log(results)
            for(var i = 0; i < results.length; i++){
                results[i].strTicketDate = moment(results[i].strTicketDate).format('MMMM Do YYYY');
                if( i == results.length-1){
                    res.send({vio: results})
                }
            }
        });
    }
    else{
        var queryVio = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tblauthority ON strAuthorityUserName = strTicketAuthorityUsername) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo WHERE isPaid = ? GROUP BY intUserViolationTicketID ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
        console.log("isPaid = " + req.body.isPaid);
        db.query(queryVio, [req.body.isPaid],function (err, results, fields) {
            console.log(results)
            for(var i = 0; i < results.length; i++){
                results[i].strTicketDate = moment(results[i].strTicketDate).format('MMMM Do YYYY');
                if( i == results.length-1){
                    res.send({vio: results})
                }
            }
        });
    }  
    
    
});




routerAdmin.post('/search', (req, res) => {
    const querySearch = `SELECT * FROM ((tbluserviolation JOIN tblticket ON intUserViolationTicketID = intTicketID)  JOIN tblauthority ON strAuthorityUserName = strTicketAuthorityUsername) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo WHERE `+req.body.attrib+` LIKE '%`+req.body.input+`%' GROUP BY intUserViolationTicketID`;
    
    db.query(querySearch, function (err, results, fields) {
        console.log('---------')
        console.log(results)
        if(results){
            for(var i = 0; i < results.length; i++){
                results[i].strTicketDate = moment(results[i].strTicketDate).format('MMMM Do YYYY');
                if( i == results.length-1){
                    res.send({search: results});
                }
            }
        }
        else
            console.log('waley')

    });
});

routerAdmin.post('/ticket', (req, res) => {
    const queryticket = `SELECT * FROM (((tblticket JOIN tbluserviolation ON intUserViolationTicketID = intTicketID) JOIN tblviolation ON intUserViolationViolationID = intViolationid) JOIN tbllicense ON strLicenseLicenseNo = strTicketLicenseNo) JOIN tblauthority ON strTicketAuthorityUsername = strAuthorityUsername WHERE intTicketID = ?`;
    db.query(queryticket, [req.body.intUserViolationTicketID],function (err, results, fields) {
        console.log(results);
        results[0].strTicketDate = moment(results[0].strTicketDate).format('MMMM Do YYYY');
        res.send(results)
    });
});





routerAdmin.post('/license1', (req, res) => {
    if(req.body.status == 0)
        var queryLicense = `SELECT strTicketLicenseNo FROM tblticket WHERE isPaid = 0 GROUP BY strTicketLicenseNo`;
    else if(req.body.status == 1){
        var queryLicense = `SELECT strTicketLicenseNo FROM tblticket JOIN tbluser ON strLicenseNo = strTicketLicenseNo WHERE isPaid = 1 AND strLocation != 'Owner' GROUP BY strTicketLicenseNo`;
    }
    else if(req.body.status == 2){
         var queryLicense = `SELECT strTicketLicenseNo FROM tblticket JOIN tbluser ON strLicenseNo = strTicketLicenseNo WHERE isPaid = 1 AND strLocation = 'Owner' GROUP BY strTicketLicenseNo`;
    }
    db.query(queryLicense, function (err, results, fields) {
        console.log(results);
        res.send({license: results})
    });
});


routerAdmin.post('/paymentconfirm', (req, res) => {
    const querySearch = `UPDATE tblticket SET isPaid = 1, strSignature = ? WHERE intTicketID = ?`;
    
    db.query(querySearch, [req.body.strSignature, req.body.intTicketID], function (err, results, fields) {
        res.send('success');
    });
});

routerAdmin.post('/license2', (req, res) => {
    
        var queryVio = `SELECT *, strTicketLicenseNo AS LICENSE, (SELECT COUNT(*) FROM tblticket WHERE strTicketLicenseNo = LICENSE) AS Fa, (SELECT COUNT(*) FROM tblticket WHERE strTicketLicenseNo = LICENSE AND isPaid = 1) AS Sa from tblticket JOIN tbluser ON strTicketLicenseNo = strLicenseNo JOIN tbllicense ON strLicenseNo = strLicenseLicenseNo GROUP BY strTicketLicenseNo ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`

    db.query(queryVio, function (err, results, fields) {
        if(results){ 
            if(req.body.status == 0){
                var array = []
                for(var i = 0; i < results.length; i++){
                    if(results[i].Fa != results[i].Sa && results[i].strLocation != 'Owner'){
                        array.push(results[i]);
                        if(i == results.length - 1){
                            console.log(array)
                            res.send({lisensya: array})
                        }
                    }
                }
            }
            else if(req.body.status == 1){
                var array = []
                for(var i = 0; i < results.length; i++){
                    if(results[i].Fa == results[i].Sa && results[i].strLocation != 'Owner'){
                        array.push(results[i]);
                        if(i == results.length - 1){
                            console.log(array)
                            res.send({lisensya: array})
                        }
                    }
                }
            }
            else if(req.body.status == 2){
                var array = []
                for(var i = 0; i < results.length; i++){
                    if(results[i].Fa == results[i].Sa && results[i].strLocation == 'Owner'){
                        array.push(results[i]);
                        if(i == results.length - 1){
                            console.log(array)
                            res.send({lisensya: array})
                        }
                    }
                }
            }
        }
        


    });
});
//motorist
routerAdmin.get('/motorist', (req, res) => {
    var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo;`
    db.query(queryUser, function (err, results, fields) {
        if(results){
            for(var i = 0; i < results.length; i++){
                results[i].datBirthDate = moment(results[i].datBirthDate).format('MMMM Do YYYY')
                if(i == results.length - 1)
                    res.render('home/views/motorist', {user: req.session.authority, motorist: results});
            }
        }
    });
});

routerAdmin.post('/motorist', (req, res) => {
    var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo WHERE strLicenseNo = ?;`
    db.query(queryUser, [req.body.strLicenseNo], function (err, results, fields) {
        if(results){
            results[0].datLicenseBirthDate = moment(results[0].datLicenseBirthDate).format('MMMM Do YYYY')
            console.log(results[0])
            res.send({motor: results[0]});
        }
    });
});

routerAdmin.post('/rotom1', (req, res) => {
    if(req.body.status == 0){
        var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo;`
        db.query(queryUser, function (err, results, fields) {
            if(results){
                console.log(results)
                res.send({rotom: results});
            }
        });
    }

    else if(req.body.status == 1 || req.body.status == 2){
        var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo WHERE booStatus = ?;`
        db.query(queryUser, [req.body.status], function (err, results, fields) {
            if(results){
                console.log(results)
                res.send({rotom: results});
            }
        });
    }

    
});

routerAdmin.post('/rotom2', (req, res) => {
        if(req.body.status == 0){
            var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
            db.query(queryUser, function (err, results, fields) {
                    console.log(results)
                    res.send({rotom2: results});
                
            });
        }
        else{
            var queryUser = `SELECT * FROM tbluser JOIN tbllicense ON strLicenseLicenseNo = strLicenseNo WHERE booStatus = ? ORDER BY `+req.body.sortie+` LIMIT `+req.body.intStart+`, `+req.body.intPage+`;`
            db.query(queryUser, [req.body.status], function (err, results, fields) {
                    console.log(results)
                    res.send({rotom2: results});
                
            });
        }
});

// enforcer

routerAdmin.get('/enforcer', (req, res) => {
    var queryUser = `SELECT * FROM tblauthority WHERE booAuthorityUserType = 0;`
    db.query(queryUser, [req.body.strAuthUsername], function (err, results, fields) {
       
        res.render('home/views/enforcer', {user: req.session.authority, auths: results});
    });
          
});

routerAdmin.post('/checkenfo', (req, res) => {
    var queryUser = `SELECT * FROM tblauthority WHERE strAuthorityUserName = ?;`
    db.query(queryUser, [req.body.strAuthUsername], function (err, results, fields) {
        if(results.length > 0){
            res.send({ "enforcer": false });
        }
        else{
            res.send({ "enforcer": true });
        }
    });

          
});

routerAdmin.post('/editenfo', (req, res) => {
    console.log(req.body)
    var queryUser = `SELECT * FROM tblauthority WHERE strAuthorityUserName = ?;`
    db.query(queryUser, [req.body.strAuthorityUsername], function (err, results, fields) {
        if(results){
            console.log(results)
            res.send({authauth: results[0]})
        }
    });

          
});

routerAdmin.post('/updateenfo', (req, res) => {
    console.log(req.body)
    if(req.body.strAuthPassword2 != null || req.body.strAuthPassword2 != ""){
        var queryUser = `UPDATE tblauthority SET strAuthorityUserName = ?, strAuthorityPassword = PASSWORD(?), strAuthorityFirstName = ?, strAuthorityMiddleName = ?, strAuthorityLastName = ? WHERE strAuthorityUserName = ?`
        db.query(queryUser, [req.body.strAuthUsername2, req.body.strAuthPassword2, req.body.strAuthFirstName2, req.body.strAuthMiddleName2, req.body.strAuthLastName2, req.body.strAuthUsername3], function (err, results, fields) {
            if(err) res.send(err)
                console.log(results)
                res.redirect('/admin/enforcer')
            
        });
    }
    else{
        var queryUser = `UPDATE tblauthority SET strAuthorityUserName = ?, strAuthorityFirstName = ?, strAuthorityMiddleName = ?, strAuthorityLastName = ? WHERE strAuthorityUserName = ?`
        db.query(queryUser, [req.body.strAuthUsername2, req.body.strAuthFirstName2, req.body.strAuthMiddleName2, req.body.strAuthLastName2, req.body.strAuthUsername3], function (err, results, fields) {
            if(err) res.send(err)
                console.log(results)
                res.redirect('/admin/enforcer')
        });
    }

          
});

routerAdmin.get('/deleteenfo/:deleteuser', (req, res) => {
    console.log(req.body)
        var queryUser = `DELETE FROM tblauthority WHERE strAuthorityUserName = ?`
        db.query(queryUser, [req.params.deleteuser], function (err, results, fields) {
            if(err) res.send(err)
                console.log(results)
                res.redirect('/admin/enforcer')
        });
});

routerAdmin.post('/saveenfo', (req, res) => {
    console.log(req.body)
    var queryUser = `INSERT INTO tblauthority (strAuthorityUsername, strAuthorityPassword, booAuthorityUserType, strAuthorityFirstName, strAuthorityLastName, strAuthorityMiddleName) VALUES (?,PASSWORD(?),?,?,?,?);`
    db.query(queryUser, [req.body.strAuthorityUsername, req.body.strAuthorityPassword, 0, req.body.strAuthorityFirstName, req.body.strAuthorityLastName, req.body.strAuthorityMiddleName], function (err, results, fields) {
        if (err) console.log(err);
        res.send({newauth: req.body});
    });

          
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
