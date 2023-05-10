const router = require('express').Router();
const { Pet } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newPet = await Pet.create({
            ...req.body,
            pet_id: req.session.pet_id,
            user_id: req.session.user_id
        });

        res.status(200).json(newPet);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
    
router.put('/:id', withAuth, async (req, res) => {
    // update a pet's name by its `id` value
    try {
        const petData = await Pet.update(
                req.body, {
                    where: {
                        pet_id: req.params.id
                    }
                })
            .then(petData => {
                if (!petData) {
                    res.status(404).json({
                        message: 'No pet found with this id!'
                    });
                    return;
                }
                res.status(200).json(petData);
            })
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const petData = await Pet.destroy({
            where: {
                pet_id: req.params.pet_id,
                user_id: req.session.user_id,
            },
        });

        if (!petData) {
            res.status(404).json({
                message: 'No pet found with this id!'
            });
            return;
        }

        res.status(200).json(petData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;