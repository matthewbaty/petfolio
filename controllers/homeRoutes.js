const ImageKit = require("imagekit");
const router = require('express').Router();
const { Pet, User, File } = require('../models');
const withAuth = require('../utils/auth');
require('dotenv').config();


router.get('/', withAuth, async (req, res) => {
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

router.get('/pet/:id', withAuth, async (req, res) => {
    try {
        const petData = await Pet.findByPk(req.params.id, {
            include: [
                {
                    model: File
                },
            ],
        });

        const pet = petData.get({ plain: true });

        pet_file_paths = {};
        pet.files.forEach((file) => {
            pet_file_paths[`${file.type}_path`] = file.path;
        });

        res.render('pet', {
            ...pet,
            ...pet_file_paths,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// locked with auth to prevent viewing a users profile without being logged in
router.get('/pets', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Pet }],
        });

        const user = userData.get({ plain: true });

        res.render('pets', {
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

// Used to authenticate login for image upload
router.get('/signature', (req, res) => {
    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    var authentcationParameters = imagekit.getAuthenticationParameters();
    res.send(authentcationParameters);
});

router.get('/create_pet', withAuth, (req,res) => {
    res.render('create_pet')
});

//test
router.get('/signup', (req,res) => {
    res.render('signup')
});

module.exports = router;