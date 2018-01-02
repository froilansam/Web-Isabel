exports.hasAuth = (req, res, next) => {
    console.log("Has Dest");
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) return next();
    return res.redirect('/login?unauthorized');
}

exports.noAuthed = (req, res, next) => {
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) return res.redirect('/index');
    return next();
}

exports.noAuthedAuthority = (req, res, next) => {
    if (req.session && req.session.authority && Object.keys(req.session.authority).length > 0 && req.session.authority.booAuthorityUserType == 1) return res.redirect('/admin')
    if (req.session && req.session.authority && Object.keys(req.session.authority).length > 0 && req.session.authority.booAuthorityUserType == 2) return res.redirect('/enforcer')
    return next();
}



exports.hasAuthorityAdmin = (req, res, next) => {
    
    if (req.session && req.session.authority && Object.keys(req.session.authority).length > 0 && req.session.authority.booAuthorityUserType == 1) return next();
    return res.redirect('/loginadmin');
}

exports.hasAuthorityEnforcer = (req, res, next) => {
    
    if (req.session && req.session.authority && Object.keys(req.session.authority).length > 0 && req.session.authority.booAuthorityUserType == 2) return next();
    return res.redirect('/loginadmin');
}