const router = require('express').Router();
const { File } = require('../../models');
const withAuth = require('../../utils/auth');
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


// Add a new file
router.put('/', withAuth, async (req, res) => {
    try {
        const response = await File.create({
            file_id: req.body.file_id,
            path: req.body.file_path,
            type: req.body.file_type,
            owner_id: req.body.owner_id
        });

        res.json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});


// Delete file by id
// Cant have this as well as one below or else will create the request wrong
// router.delete('/:file_id', withAuth, async (req, res) => {
//     try {
//         const file_id = req.params.file_id;
//         if (file_id) {
//             const file_count = await File.destroy({
//                 where: {
//                     file_id: file_id
//                 }
//             });
//             res.json(file_count);
//         } else {
//             res.json(`Issue with file_id param`);
//         };
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     };
// });


// Delete a file by owner id and file type
router.delete('/file_by_owner', withAuth, async (req, res) => {
    try {
        const fileData = await File.findAll({
            where: {
                owner_id: req.body.owner_id,
                type: req.body.file_type
            }
        });
        const file_list = fileData.map((file) => file.get({ plain: true }).file_id);

        console.log(file_list);

        if (file_list.length > 0) {
            const api_response = await imagekit.bulkDeleteFiles(file_list)
                .then(response => { return response });
        }

        const file_count = await File.destroy({
            where: {
                owner_id: req.body.owner_id,
                type: req.body.file_type
            }
        });

        res.json(file_count);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;