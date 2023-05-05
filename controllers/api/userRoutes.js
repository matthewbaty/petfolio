const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

//POST /api/users/login
router.post('/login', async (req, res) => {
    console.log('req.body:');
    console.log(req.body);
    try {
        //lookup a user based on the email we send from the login page form
        const userData = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        //if that user exists, check their password (otherwise say "user not found")
        if (userData) {
            //check password
            const validPassword = await bcrypt.compare(req.body.password, userData.password);
            if (validPassword) {
                req.session.save(() => {
                    req.session.user_id = userData.id;
                    req.session.logged_in = true;

                    res.json({
                        success: true,
                        user: userData,
                        message: 'You are now logged in!'
                    });
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong password :('
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'User not found :('
            });
        }
        console.log(userData);

    } catch (e) {
        res.status(500).json(e);
    }

});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;