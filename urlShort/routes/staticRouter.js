const express = require('express');
const URL = require('../models/url');
const router = express.Router();

router.get('/',async(req, res)=>{
    if(!req.user)
    return res.redirect('/login');
    const allURL =await URL.find({createdBy : req.user._id});
    var currentPath  = req.protocol + '://' + req.get('host');
    console.log(currentPath);
    return res.render('home', {
        urls : allURL,
        currentPath: currentPath,
    });
})

router.get('/signup', (req, res)=>{
    return res.render("signup");
})
router.get('/login', (req, res)=>{
    return res.render("login");
})
module.exports = router; 