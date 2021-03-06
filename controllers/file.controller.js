const File = require('../models/file.model');
const User = require('../models/user.model');

module.exports = {
    uplaod: (req, res) => {
        let fileId = [];
        req.files.forEach(file => {
            let new_file = new File({
                name: file.originalname,
                url: file.cloudStoragePublicUrl,
                like: 0
            });
            console.log(new_file);
            fileId.push(new_file._id);

            new_file.save(err => {
                if (err) return res.status(500).send({ message: err });
            });
        });

        User.findById(req.headers.id, (err, user) => {
            console.log(user);
            user.file = user.file.concat(fileId);
            user.save(err => {
                if (err) return res.status(500).send({ message: err });

                return res.status(201).send({
                    message: 'upload success',
                    url: req.files.map(file => {
                        return file.cloudStoragePublicUrl;
                    })
                });
            })
        });
    },

    findAll: (req, res) => {
        File.find((err, file) => {
            if (err) return res.status(500).send({ message: err });

            return res.status(200).send({
                message: 'get file success',
                file
            });
        })
    }
};