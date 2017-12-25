var express = require('express');
var loginRouter = express.Router();
var logoutRouter = express.Router();
var signupRouter = express.Router();
var adminRouter = express.Router();
var db = require('../../lib/database')();
const nodemailer = require('nodemailer');
const moment = require('moment');

var authMiddleware = require('./middlewares/auth');

loginRouter.route('/')
    .get(authMiddleware.noAuthed, (req, res) => {
        res.render('auth/views/login', req.query);
    })
    .post((req, res) => {
        

        db.query(`SELECT * FROM users WHERE email="${req.body.email}"`, (err, results, fields) => {
            if (err) throw err;
            if (results.length === 0) return res.redirect('/login?incorrect');

            var user = results[0];

            if (user.password !== req.body.password) return res.redirect('/login?incorrect');

            delete user.password;

            req.session.user = user;

            return res.redirect('/index');
        });
    });

logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/login');
    });
});


signupRouter.post('/', (req, res) => {
    console.log(req.body);
    const queryForVerification = `SELECT * FROM tbllicense WHERE strLicenseLicenseNo = ? AND datLicenseBirthDate = ?`
    db.query(queryForVerification, [req.body.strLicenseNo, req.body.datBirthDate], (err, results, fields) => {
    if(err) return console.log(err);
        var today = moment(new Date).format('YYYY-MM-DD');
        
        if(results.length > 0 && new Date(today) > new Date(results[0].datLicenseExpirationDate)){
            console.log('Expired');
            nodemailer.createTestAccount((err, account) => {

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com.',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'suyoteam@gmail.com',
                        pass: 'froyefritzkobisherwin'
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Isabel Team" <contact@isabel.com>', // sender address
                    to: req.body.strEmail, // list of receivers
                    subject: `Isabel - Sorry, `+results[0].strLicenseFirstName+' '+results[0].strLicenseLastName+`, Your Driver's License has Expired!`, // Subject line
                    html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title>Empty Template</title>
    <!--[if !mso]><!-- -->
	<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
	<!--<![endif]-->
    
    <style type="text/css" id="media-query">
      body {
  margin: 0;
  padding: 0; }

table, tr, td {
  vertical-align: top;
  border-collapse: collapse; }

.ie-browser table, .mso-container table {
  table-layout: fixed; }

* {
  line-height: inherit; }

a[x-apple-data-detectors=true] {
  color: inherit !important;
  text-decoration: none !important; }

[owa] .img-container div, [owa] .img-container button {
  display: block !important; }

[owa] .fullwidth button {
  width: 100% !important; }

[owa] .block-grid .col {
  display: table-cell;
  float: none !important;
  vertical-align: top; }

.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
  width: 600px !important; }

.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
  line-height: 100%; }

.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
  width: 200px !important; }

.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
  width: 400px !important; }

.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
  width: 300px !important; }

.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
  width: 200px !important; }

.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
  width: 150px !important; }

.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
  width: 120px !important; }

.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
  width: 100px !important; }

.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
  width: 85px !important; }

.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
  width: 75px !important; }

.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
  width: 66px !important; }

.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
  width: 60px !important; }

.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
  width: 54px !important; }

.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
  width: 50px !important; }

@media only screen and (min-width: 620px) {
  .block-grid {
    width: 600px !important; }
  .block-grid .col {
    vertical-align: top; }
    .block-grid .col.num12 {
      width: 600px !important; }
  .block-grid.mixed-two-up .col.num4 {
    width: 200px !important; }
  .block-grid.mixed-two-up .col.num8 {
    width: 400px !important; }
  .block-grid.two-up .col {
    width: 300px !important; }
  .block-grid.three-up .col {
    width: 200px !important; }
  .block-grid.four-up .col {
    width: 150px !important; }
  .block-grid.five-up .col {
    width: 120px !important; }
  .block-grid.six-up .col {
    width: 100px !important; }
  .block-grid.seven-up .col {
    width: 85px !important; }
  .block-grid.eight-up .col {
    width: 75px !important; }
  .block-grid.nine-up .col {
    width: 66px !important; }
  .block-grid.ten-up .col {
    width: 60px !important; }
  .block-grid.eleven-up .col {
    width: 54px !important; }
  .block-grid.twelve-up .col {
    width: 50px !important; } }

@media (max-width: 620px) {
  .block-grid, .col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important; }
  .block-grid {
    width: calc(100% - 40px) !important; }
  .col {
    width: 100% !important; }
    .col > div {
      margin: 0 auto; }
  img.fullwidth, img.fullwidthOnMobile {
    max-width: 100% !important; }
  .no-stack .col {
    min-width: 0 !important;
    display: table-cell !important; }
  .no-stack.two-up .col {
    width: 50% !important; }
  .no-stack.mixed-two-up .col.num4 {
    width: 33% !important; }
  .no-stack.mixed-two-up .col.num8 {
    width: 66% !important; }
  .no-stack.three-up .col.num4 {
    width: 33% !important; }
  .no-stack.four-up .col.num3 {
    width: 25% !important; } }

    </style>
</head>
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #557f90">
  <style type="text/css" id="media-query-bodytag">
    @media (max-width: 520px) {
      .block-grid {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

      .col {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

        .col > div {
          margin: 0 auto;
        }

      img.fullwidth {
        max-width: 100%!important;
      }
			img.fullwidthOnMobile {
        max-width: 100%!important;
      }
      .no-stack .col {
				min-width: 0!important;
				display: table-cell!important;
			}
			.no-stack.two-up .col {
				width: 50%!important;
			}
			.no-stack.mixed-two-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.mixed-two-up .col.num8 {
				width: 66%!important;
			}
			.no-stack.three-up .col.num4 {
				width: 33%!important
			}
			.no-stack.four-up .col.num3 {
				width: 25%!important
			}
    }
  </style>
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #557f90;width: 100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #557f90;"><![endif]-->

    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center  autowidth  fullwidth" style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth  fullwidth" align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994938_10210813839401870_1463649648136564357_n.jpg?oh=a2a86ca83f9563aa1f8f1406507ab9d1&oe=5AC54D39" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center fixedwidth" align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994859_10210815952734702_7676610915308117067_n.jpg?oh=72b3380f6457e51eb89daccf657c33bc&oe=5AFB9EBC" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 330px" width="330">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;"><!--<![endif]-->

                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px;"><![endif]-->
<div style="font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:150%;color:#ffffff; padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px;">	
	<div style="font-size:12px;line-height:18px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center"><span style="font-size: 48px; line-height: 72px;"><strong><span style="line-height: 72px; font-size: 48px;">License Expired</span></strong></span></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#ffffff;line-height:120%;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">Sorry, `+results[0].strLicenseFirstName+` `+results[0].strLicenseLastName+`, your driver's licensed has expired, should you renew it? Yes! Of course. So you can use Isabel app and monitor the expiration date next time!</p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&#160;</p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#ffffff;line-height:120%;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><a style="color:#FF6B6B;text-decoration: underline;" href="http://www.lto.gov.ph/license-permit-issuance/286-advance-renewal-of-driver-s-license.html" target="_blank" rel="noopener" data-mce-selected="1">﻿Renew your License now! Click here.</a></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
                  
                    
<div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;">
  <div style="line-height:10px;font-size:1px">&#160;</div>
  <div style="display: table; max-width:171px;">
  <!--[if (mso)|(IE)]><table width="151" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse; padding-right: 10px; padding-left: 10px; padding-bottom: 10px;"  align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:151px;"><tr><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://www.facebook.com/isabelteam" title="Facebook" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25594346_10210815952414694_615194259199933671_n.jpg?oh=570d0500683ae0fc58da523a2acd404f&oe=5AB17976" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="http://twitter.com/isabelteam" title="Twitter" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25660218_10210815952854705_1199529839954998358_n.jpg?oh=360f8c03c797ddc09326a5e382825f38&oe=5AB9805C" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 0;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="http://plus.google.com/" title="Google+" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994902_10210815952374693_4730920194199746737_n.jpg?oh=5f45100464550cb351e318050bccfa3d&oe=5AB7096E" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
  </div>
</div>
                  
                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#ffffff; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 12px; line-height: 14px;">Copyright © 2017 Isabel, All rights reserved. </span><span style="font-size: 12px; line-height: 14px;"><span style="color: rgb(255, 255, 255); font-size: 12px; line-height: 14px;"></span></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&#160;<br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><br></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->


</body></html>` // html body
                            };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    res.redirect('/login');

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            });
        }
        else if(results.length > 0 && !(new Date(today) > new Date(results[0].datLicenseExpirationDate))){
            var user = results[0];
            var hashURL = '';

            const queryForInsert = `INSERT INTO tbluser (strLicenseNo, strUsername, strEmail, datBirthDate) VALUES (?,?,?,?)`
            db.query(queryForInsert, [req.body.strLicenseNo, req.body.strUsername, req.body.strEmail, req.body.datBirthDate], (err, results, fields) => {
                if(err) return res.send(err);

                // Getting hashURL
                const queryForHash = `SELECT PASSWORD(strUsername) as hashURL FROM tbluser WHERE strUsername = ?`
                db.query(queryForHash, [req.body.strUsername], (err, results, fields) => {
                    if(err) return console.log(err);
                    console.log(results[0].hashURL)
                    hashURL = results[0].hashURL;

                    console.log('there is.');

                    nodemailer.createTestAccount((err, account) => {

                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com.',
                            port: 587,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: 'suyoteam@gmail.com',
                                pass: 'froyefritzkobisherwin'
                            }
                        });

                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"Isabel Team" <contact@isabel.com>', // sender address
                            to: req.body.strEmail, // list of receivers
                            subject: 'Isabel - Hello, '+user.strLicenseFirstName+' '+userstrLicenseLastName+', you have been verified!', // Subject line
                            html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
                        <!--[if gte mso 9]><xml>
                        <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                        </xml><![endif]-->
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                        <title>BF-simple-template</title>
                        
                        
                        <style type="text/css" id="media-query">
                        body {
                        margin: 0;
                        padding: 0; }

                        table, tr, td {
                        vertical-align: top;
                        border-collapse: collapse; }

                        .ie-browser table, .mso-container table {
                        table-layout: fixed; }

                        * {
                        line-height: inherit; }

                        a[x-apple-data-detectors=true] {
                        color: inherit !important;
                        text-decoration: none !important; }

                        [owa] .img-container div, [owa] .img-container button {
                        display: block !important; }

                        [owa] .fullwidth button {
                        width: 100% !important; }

                        [owa] .block-grid .col {
                        display: table-cell;
                        float: none !important;
                        vertical-align: top; }

                        .ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
                        width: 500px !important; }

                        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
                        line-height: 100%; }

                        .ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
                        width: 164px !important; }

                        .ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
                        width: 328px !important; }

                        .ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
                        width: 250px !important; }

                        .ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
                        width: 166px !important; }

                        .ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
                        width: 125px !important; }

                        .ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
                        width: 100px !important; }

                        .ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
                        width: 83px !important; }

                        .ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
                        width: 71px !important; }

                        .ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
                        width: 62px !important; }

                        .ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
                        width: 55px !important; }

                        .ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
                        width: 50px !important; }

                        .ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
                        width: 45px !important; }

                        .ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
                        width: 41px !important; }

                        @media only screen and (min-width: 520px) {
                        .block-grid {
                            width: 500px !important; }
                        .block-grid .col {
                            vertical-align: top; }
                            .block-grid .col.num12 {
                            width: 500px !important; }
                        .block-grid.mixed-two-up .col.num4 {
                            width: 164px !important; }
                        .block-grid.mixed-two-up .col.num8 {
                            width: 328px !important; }
                        .block-grid.two-up .col {
                            width: 250px !important; }
                        .block-grid.three-up .col {
                            width: 166px !important; }
                        .block-grid.four-up .col {
                            width: 125px !important; }
                        .block-grid.five-up .col {
                            width: 100px !important; }
                        .block-grid.six-up .col {
                            width: 83px !important; }
                        .block-grid.seven-up .col {
                            width: 71px !important; }
                        .block-grid.eight-up .col {
                            width: 62px !important; }
                        .block-grid.nine-up .col {
                            width: 55px !important; }
                        .block-grid.ten-up .col {
                            width: 50px !important; }
                        .block-grid.eleven-up .col {
                            width: 45px !important; }
                        .block-grid.twelve-up .col {
                            width: 41px !important; } }

                        @media (max-width: 520px) {
                        .block-grid, .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important; }
                        .block-grid {
                            width: calc(100% - 40px) !important; }
                        .col {
                            width: 100% !important; }
                            .col > div {
                            margin: 0 auto; }
                        img.fullwidth, img.fullwidthOnMobile {
                            max-width: 100% !important; }
                        .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important; }
                        .no-stack.two-up .col {
                            width: 50% !important; }
                        .no-stack.mixed-two-up .col.num4 {
                            width: 33% !important; }
                        .no-stack.mixed-two-up .col.num8 {
                            width: 66% !important; }
                        .no-stack.three-up .col.num4 {
                            width: 33% !important; }
                        .no-stack.four-up .col.num3 {
                            width: 25% !important; } }

                        </style>
                    </head>
                    <body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">
                    <style type="text/css" id="media-query-bodytag">
                        @media (max-width: 520px) {
                        .block-grid {
                            min-width: 320px!important;
                            max-width: 100%!important;
                            width: 100%!important;
                            display: block!important;
                        }

                        .col {
                            min-width: 320px!important;
                            max-width: 100%!important;
                            width: 100%!important;
                            display: block!important;
                        }

                            .col > div {
                            margin: 0 auto;
                            }

                        img.fullwidth {
                            max-width: 100%!important;
                        }
                                img.fullwidthOnMobile {
                            max-width: 100%!important;
                        }
                        .no-stack .col {
                                    min-width: 0!important;
                                    display: table-cell!important;
                                }
                                .no-stack.two-up .col {
                                    width: 50%!important;
                                }
                                .no-stack.mixed-two-up .col.num4 {
                                    width: 33%!important;
                                }
                                .no-stack.mixed-two-up .col.num8 {
                                    width: 66%!important;
                                }
                                .no-stack.three-up .col.num4 {
                                    width: 33%!important
                                }
                                .no-stack.four-up .col.num3 {
                                    width: 25%!important
                                }
                        }
                    </style>
                    <!--[if IE]><div class="ie-browser"><![endif]-->
                    <!--[if mso]><div class="mso-container"><![endif]-->
                    <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #FFFFFF;width: 100%" cellpadding="0" cellspacing="0">
                        <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->

                        <div style="background-color:#557f90;">
                        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#557f90;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="250" style=" width:250px; padding-right: 0px; padding-left: 0px; padding-top:20px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num6" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div style="background-color: transparent; width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:20px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                                    
                                        <div align="center" class="img-container center  autowidth " style="padding-right: 0px;  padding-left: 0px;">
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
                    <a href="https://beefree.io" target="_blank">
                        <img class="center  autowidth " align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994938_10210813839401870_1463649648136564357_n.jpg?oh=a2a86ca83f9563aa1f8f1406507ab9d1&oe=5AC54D39" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 191px" width="191">
                    </a>
                    <!--[if mso]></td></tr></table><![endif]-->
                    </div>

                                    
                                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><td align="center" width="250" style=" width:250px; padding-right: 0px; padding-left: 0px; padding-top:20px; padding-bottom:20px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num6" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                                <div style="background-color: transparent; width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:20px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                                    
                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]-->
                    <div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:150%;color:#6E6F7A; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;">	
                        <div style="font-size:12px;line-height:18px;color:#6E6F7A;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="text-align: right; line-height:18px; font-size:12px;"><strong><span style="font-size: 16px; line-height: 24px; color: white">Traffic Violation Management System</span></strong></div></div>	
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->

                                    
                                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                </div>
                                </div>
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                        </div>    <div style="background-color:#7ca8ba;">
                        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#7ca8ba;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                                <div style="background-color: transparent; width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                                    
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                        <tbody>
                            <tr style="vertical-align: top">
                                <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 10px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                            <tr style="vertical-align: top">
                                                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                    <span></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                                    
                                    
                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 30px; padding-bottom: 30px;"><![endif]-->
                    <div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:120%;color:#ffffff; padding-right: 0px; padding-left: 0px; padding-top: 30px; padding-bottom: 30px;">	
                        <div style="line-height:14px;font-size:12px;color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;line-height: 14px;text-align: center;font-size: 12px"><span style="font-size: 28px; line-height: 33px;"><b>Welcome to Isabel, ` + user.strLicenseFirstName + ' ' + user.strLicenseLastName + `</b></span></p></div>	
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->

                                    
                                    
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                        <tbody>
                            <tr style="vertical-align: top">
                                <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 10px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                            <tr style="vertical-align: top">
                                                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                    <span></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                                    
                                    
                                        <div align="center" class="img-container center  autowidth " style="padding-right: 0px;  padding-left: 0px;">
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
                    <a href="https://beefree.io" target="_blank">
                        <img class="center  autowidth " align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/26001301_10210813839321868_4674542032371238430_n.jpg?oh=c9628655c8f54dbd046c52bf8c259e93&oe=5AB5781F" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 402px" width="402">
                    </a>
                    <!--[if mso]></td></tr></table><![endif]-->
                    </div>

                                    
                                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                </div>
                                </div>
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                        </div>    <div style="background-color:#557f90;">
                        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#557f90;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                                <div style="background-color: transparent; width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                                    
                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 25px; padding-bottom: 10px;"><![endif]-->
                    <div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:120%;color:#ffffff; padding-right: 10px; padding-left: 10px; padding-top: 25px; padding-bottom: 10px;">	
                        <div style="font-size:12px;line-height:14px;color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 18px;line-height: 22px;text-align: center"><span style="font-size: 24px; line-height: 28px;"><strong>You have been confirmed!</strong></span></p></div>	
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->

                                    
                                    
                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px;"><![endif]-->
                    <div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:150%;color:#B8B8C0; padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px;">	
                        <div style="font-size:12px;line-height:18px;color:#B8B8C0;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">Please click the button below to get started setting up your account on Isabel.</p><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">Violating traffic law would never be as good as with Isabel!<br></p></div>	
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->

                                    
                                    
                                        
                    <div align="center" class="button-container center" style="padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:10px;">
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31pt; v-text-anchor:middle; width:94pt;" arcsize="60%" strokecolor="#C7702E" fillcolor="#C7702E"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:16px;"><![endif]-->
                        <a href="http://`+req.hostname+`:3009/setup/u=` + hashURL +`" style="padding: 20px; color: white; background-color: transparent; text-align: center; border: 2px solid #ffffff; text-transform: uppercase; font-weight: bold; letter-spacing: 0.2em;">
                        <span style="font-size:16px;line-height:32px;"><span style="font-size: 14px; line-height: 28px;" data-mce-style="font-size: 14px;">Get Started</span></span>
                        </a>
                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                    </div>

                                    
                                    
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                        <tbody>
                            <tr style="vertical-align: top">
                                <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                            <tr style="vertical-align: top">
                                                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                    <span></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                                    
                                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                </div>
                                </div>
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                        </div>    <div style="background-color:#ffffff;">
                        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                                <div style="background-color: transparent; width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                                    
                                        
                    <div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;">
                    <div style="line-height:10px;font-size:1px">&#160;</div>
                    <div style="display: table; max-width:151px;">
                    <!--[if (mso)|(IE)]><table width="131" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse; padding-right: 10px; padding-left: 10px; padding-bottom: 10px;"  align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:131px;"><tr><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">
                        <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                            <a href="https://www.facebook.com/" title="Facebook" target="_blank">
                            <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25552299_10210813586875557_5047792989486465589_n.jpg?oh=dcd1d022dbfc616b2f655c7bdc550dfb&oe=5AFA4F91" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                            </a>
                        </td></tr>
                        </tbody></table>
                        <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">
                        <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                            <a href="http://twitter.com/" title="Twitter" target="_blank">
                            <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25594290_10210813587435571_425219159191717587_n.jpg?oh=bb6502206c74608fba00ba9b06ca0cef&oe=5AD0473F" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                            </a>
                        </td></tr>
                        </tbody></table>
                        <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 0;" valign="top"><![endif]-->
                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">
                        <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                            <a href="http://plus.google.com/" title="Google+" target="_blank">
                            <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25593884_10210813586835556_5343924039554281578_n.jpg?oh=c5765e30c4a503115e72781d80cd1d9e&oe=5AC5014A" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                            </a>
                        </td></tr>
                        </tbody></table>
                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                    </div>
                    </div>
                                    
                                    
                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;"><![endif]-->
                    <div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:150%;color:#959595; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;">	
                        <div style="font-size:12px;line-height:18px;color:#959595;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">If you think this isn't for you, please disregard.</p></div>	
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->

                                    
                                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                </div>
                                </div>
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                        </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                    </tr>
                    </tbody>
                    </table>
                    <!--[if (mso)|(IE)]></div><![endif]-->


                    </body></html>` // html body
                                    };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            // Preview only available when sending through an Ethereal account
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                            res.redirect('/login');

                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                        });
                    });
                })
                
            });
        }
        else{
            console.log('wala');
            nodemailer.createTestAccount((err, account) => {

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com.',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'suyoteam@gmail.com',
                        pass: 'froyefritzkobisherwin'
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Isabel Team" <contact@isabel.com>', // sender address
                    to: req.body.strEmail, // list of receivers
                    subject: `Isabel - Sorry, the license number you entered does not exist!`, // Subject line
                    html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title>Empty Template</title>
    <!--[if !mso]><!-- -->
	<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
	<!--<![endif]-->
    
    <style type="text/css" id="media-query">
      body {
  margin: 0;
  padding: 0; }

table, tr, td {
  vertical-align: top;
  border-collapse: collapse; }

.ie-browser table, .mso-container table {
  table-layout: fixed; }

* {
  line-height: inherit; }

a[x-apple-data-detectors=true] {
  color: inherit !important;
  text-decoration: none !important; }

[owa] .img-container div, [owa] .img-container button {
  display: block !important; }

[owa] .fullwidth button {
  width: 100% !important; }

[owa] .block-grid .col {
  display: table-cell;
  float: none !important;
  vertical-align: top; }

.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
  width: 600px !important; }

.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
  line-height: 100%; }

.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
  width: 200px !important; }

.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
  width: 400px !important; }

.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
  width: 300px !important; }

.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
  width: 200px !important; }

.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
  width: 150px !important; }

.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
  width: 120px !important; }

.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
  width: 100px !important; }

.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
  width: 85px !important; }

.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
  width: 75px !important; }

.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
  width: 66px !important; }

.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
  width: 60px !important; }

.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
  width: 54px !important; }

.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
  width: 50px !important; }

@media only screen and (min-width: 620px) {
  .block-grid {
    width: 600px !important; }
  .block-grid .col {
    vertical-align: top; }
    .block-grid .col.num12 {
      width: 600px !important; }
  .block-grid.mixed-two-up .col.num4 {
    width: 200px !important; }
  .block-grid.mixed-two-up .col.num8 {
    width: 400px !important; }
  .block-grid.two-up .col {
    width: 300px !important; }
  .block-grid.three-up .col {
    width: 200px !important; }
  .block-grid.four-up .col {
    width: 150px !important; }
  .block-grid.five-up .col {
    width: 120px !important; }
  .block-grid.six-up .col {
    width: 100px !important; }
  .block-grid.seven-up .col {
    width: 85px !important; }
  .block-grid.eight-up .col {
    width: 75px !important; }
  .block-grid.nine-up .col {
    width: 66px !important; }
  .block-grid.ten-up .col {
    width: 60px !important; }
  .block-grid.eleven-up .col {
    width: 54px !important; }
  .block-grid.twelve-up .col {
    width: 50px !important; } }

@media (max-width: 620px) {
  .block-grid, .col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important; }
  .block-grid {
    width: calc(100% - 40px) !important; }
  .col {
    width: 100% !important; }
    .col > div {
      margin: 0 auto; }
  img.fullwidth, img.fullwidthOnMobile {
    max-width: 100% !important; }
  .no-stack .col {
    min-width: 0 !important;
    display: table-cell !important; }
  .no-stack.two-up .col {
    width: 50% !important; }
  .no-stack.mixed-two-up .col.num4 {
    width: 33% !important; }
  .no-stack.mixed-two-up .col.num8 {
    width: 66% !important; }
  .no-stack.three-up .col.num4 {
    width: 33% !important; }
  .no-stack.four-up .col.num3 {
    width: 25% !important; } }

    </style>
</head>
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #557f90">
  <style type="text/css" id="media-query-bodytag">
    @media (max-width: 520px) {
      .block-grid {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

      .col {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

        .col > div {
          margin: 0 auto;
        }

      img.fullwidth {
        max-width: 100%!important;
      }
			img.fullwidthOnMobile {
        max-width: 100%!important;
      }
      .no-stack .col {
				min-width: 0!important;
				display: table-cell!important;
			}
			.no-stack.two-up .col {
				width: 50%!important;
			}
			.no-stack.mixed-two-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.mixed-two-up .col.num8 {
				width: 66%!important;
			}
			.no-stack.three-up .col.num4 {
				width: 33%!important
			}
			.no-stack.four-up .col.num3 {
				width: 25%!important
			}
    }
  </style>
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #557f90;width: 100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #557f90;"><![endif]-->

    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center  autowidth  fullwidth" style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth  fullwidth" align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994938_10210813839401870_1463649648136564357_n.jpg?oh=a2a86ca83f9563aa1f8f1406507ab9d1&oe=5AC54D39" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center fixedwidth" align="center" border="0" src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994859_10210815952734702_7676610915308117067_n.jpg?oh=72b3380f6457e51eb89daccf657c33bc&oe=5AFB9EBC" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 330px" width="330">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;"><!--<![endif]-->

                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px;"><![endif]-->
<div style="font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:150%;color:#ffffff; padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px;">	
	<div style="font-size:12px;line-height:18px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center"><span style="font-size: 48px; line-height: 72px;"><strong><span style="line-height: 72px; font-size: 48px;">Your License Number Does Not Exist</span></strong></span></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#ffffff;line-height:120%;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">Sorry, `+req.body.strUsername+`, the license number you entered does not exist. If you think this is a mistake, check if this is right: `+req.body.strLicenseNo+`. If it is wrong, please sign up again.</p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&#160;</p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#ffffff;line-height:120%;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><a style="color:#FF6B6B;text-decoration: underline;" href="http://`+req.hostname+`:3009/login" target="_blank" rel="noopener" data-mce-selected="1">﻿Click here to sign up.</a></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
                  
                    
<div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;">
  <div style="line-height:10px;font-size:1px">&#160;</div>
  <div style="display: table; max-width:171px;">
  <!--[if (mso)|(IE)]><table width="151" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse; padding-right: 10px; padding-left: 10px; padding-bottom: 10px;"  align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:151px;"><tr><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://www.facebook.com/isabelteam" title="Facebook" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25594346_10210815952414694_615194259199933671_n.jpg?oh=570d0500683ae0fc58da523a2acd404f&oe=5AB17976" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="http://twitter.com/isabelteam" title="Twitter" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25660218_10210815952854705_1199529839954998358_n.jpg?oh=360f8c03c797ddc09326a5e382825f38&oe=5AB9805C" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 0;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="http://plus.google.com/" title="Google+" target="_blank">
          <img src="https://scontent.fmnl5-1.fna.fbcdn.net/v/t1.0-9/25994902_10210815952374693_4730920194199746737_n.jpg?oh=5f45100464550cb351e318050bccfa3d&oe=5AB7096E" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
  </div>
</div>
                  
                  
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#ffffff; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	<div style="font-size:12px;line-height:14px;color:#ffffff;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 12px; line-height: 14px;">Copyright © 2017 Isabel, All rights reserved. </span><span style="font-size: 12px; line-height: 14px;"><span style="color: rgb(255, 255, 255); font-size: 12px; line-height: 14px;"></span></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&#160;<br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><br></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->


</body></html>` // html body
                            };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    res.redirect('/login');

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            });
            
        }
    });

    
});



adminRouter.get('/', authMiddleware.noAuthedAuthority, (req, res) => {
    res.render('auth/views/loginadmin');
});

adminRouter.post('/', (req, res) => {
    const queryString = `SELECT * FROM tblauthority WHERE strAuthorityUsername = ? AND strAuthorityPassword = ?;`
    db.query(queryString, [req.body.strAuthorityUsername, req.body.strAuthorityPassword], (err, results, fields) => {
        if (err) return res.send(err)
            console.log(results);
            if(results.length == 0){
                res.send("");
            }
            else if(results[0].booAuthorityUserType == 1){
                req.session.authority = results[0];
                admin = req.session.authority;
                res.send(admin);
            }
            else if(results[0].booAuthorityUserType == 2){
                req.session.authority = results[0];
                enforcer = req.session.authority;
                res.send(enforcer);
            }
            
    });
});

exports.login = loginRouter;
exports.logout = logoutRouter;
exports.signup = signupRouter;
exports.loginadmin = adminRouter;