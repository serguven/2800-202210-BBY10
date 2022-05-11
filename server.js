const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user");
const session = require('express-session');

const port = 8000;

const uri = "mongodb+srv://serguven:y74h9k231@cluster0.tjtky.mongodb.net/COMP2800?retryWrites=true&w=majority";
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));


app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "password",
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    //res.send('This is the index page');
    res.sendFile(path.resolve('public/index.html'));
})

//////login/logout browser back button cache problem solution (may need checking. revisit this part).///////////////////
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/login', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.sendFile(path.resolve('public/login.html'));
    } else {
        if(req.session.user.userType == "Doctor") {
            res.redirect('/admin');
        } else {
            res.redirect('/profile');
        }
    }
})



app.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('No user with such email.');
            res.redirect('/login');
        } else {
            req.session.user = user;
            req.session.isLoggedIn = true;
            if(req.session.user.userType == "Doctor") {
                res.redirect('/admin');
            } else{
                res.redirect('/profile');
            }
        }
    });
})

app.get('/profile', (req, res) => {
    if (req.session.isLoggedIn && req.session.user.userType != "Doctor") {
        res.sendFile(path.resolve('public/profile.html'));
    } else {
        res.redirect('/login');
    }
})



app.get('/admin', (req, res) => {
    if(req.session.isLoggedIn && req.session.user.userType == "Doctor") {
        res.sendFile(path.resolve('public/admin.html'));
    } else {
        res.sendFile(path.resolve('public/notAllowed.html'));
    }
})


app.get('/signUp', (req, res) => {
    res.sendFile(path.resolve('public/signUp.html'));
})


app.post('/signUp', async(req, res) => {
    const new_user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType
    });


    User.findOne({email: req.body.email}, function(err, user){
        if(err) {
            console.log(err);
        }
        if(!user){
            new_user.save()
                .then((result) => {
                    console.log(result);
                });

             res.redirect('/login');
        } else {
            console.log('Account with this email adress exists.');
            res.redirect('/signUp');
        }
    })
})


app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

////////////////////////////////////////
app.post('/update', async (req, res) => {
    if(req.session.isLoggedIn) {
        User.updateOne({"_id": req.session.user._id},
            {$set : {"firstName": req.body.firstName,
                     "lastName": req.body.lastName,
                     "userName": req.body.userName,
                     "email": req.body.email}})
                    //  .then((obj) => {
                    //     res.json("updated"); (Work on this part)
                    //  });
    }
})

////////////////////////////////////////


app.listen(port, () => {
    console.log('App is listening');
})