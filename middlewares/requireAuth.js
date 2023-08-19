function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        //Si hay una sesion y un usuario en la sesion, el usuario esta encendido.
        next();
    } else {
        // Si no hay sesion 
        res.redirect('/');
    }
}
module.exports = requireAuth;