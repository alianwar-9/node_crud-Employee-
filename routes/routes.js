const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

// insert an user into database route
router.post('/add', upload, (req, res) => { 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully'
            };
            res.redirect('/');
        }
    })
});

// Get all users route

router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        }
    });
});

router.get('/add', (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// Edit an user route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect('/');
        } else {
            if (user == null) {
                res.redirect('/');
            } else {
                res.render('edit_users', {
                    title: 'Edit User',
                    user: user,
                });
            }
        }
    });
});

// About Route
router.get('/About', (req, res) => {
    res.send("Hi, My Name Is Mohd Ali Anwar");
})

// Contact Route
router.get('/contact', (req, res) => {
    res.send("Hi, My Name Is Mohd Ali Anwar");
})

// Update user route
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image= '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch(err){
            console.log(err);
        }        
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    }, (err, result) => {
        if(err){
            res.json({message: err.message, type: 'danger'});            
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated Succesfully!',
            };
            res.redirect('/');
        }
    })
});

// Delete user route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'info',
                message: 'User deleted Succesfully!',
            };
            res.redirect('/');
        }
    })
})

module.exports = router;
