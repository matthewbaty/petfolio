const router = require('express').Router();
const { Pet, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const petData = await Pet.findAll({
            include: [
                {
                    model: User,
                    attributes: [
                        'first_name',
                        'last_name'
                    ]
                },
            ],
        });

        const pets = petData.map((pet) => pet.get({ plain: true }));

        res.render('landing', {
            pets,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/pet/:id', async (req, res) => {
    try {
        const petData = await Pet.findByPk(req.params.id, {
            include: [
                {
                    model: Pet,
                    attributes: [
                        'pet_id',
                        'name',
                        'species',
                        'breed',
                        'birthdate',
                        'weight'
                    ],
                },
            ],
        });

        const pet = petData.get({ plain: true });

        res.render('landing', {
            ...pet,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// locked with auth to prevent viewing a users profile without being logged in
router.get('/landing', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Pet }],
        });

        const user = userData.get({ plain: true });

        res.render('landing', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // if the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

//test
router.get('/signup', (req,res) => {
    res.render('signup')
});

module.exports = router;