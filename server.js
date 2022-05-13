const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user");
const session = require('express-session');
const multer = require('multer');
const fs = require("fs");
const Image = require("./models/image.js");


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
    if (!req.session.isLoggedIn) {
        res.sendFile(path.resolve('public/login.html'));
    } else {
        if (req.session.user.userType == "Doctor") {
            res.redirect('/admin');
        } else {
            res.redirect('/profile');
        }
    }
})



app.post('/login', async(req, res) => {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            res.json("noUser");
            console.log('No user with such email.');
        } else {

            req.session.user = user;
            req.session.isLoggedIn = true;
            if (req.session.user.userType == "Doctor") {
                res.redirect('/admin');
            } else {
                res.redirect('/profile');
            }
        }
    });
})

app.get('/profile', async(req, res) => {
    if (req.session.isLoggedIn) {
        res.sendFile(path.resolve('public/profile.html'));
    } else {
        res.redirect('/login');
    }
})

app.get('/getUserInfo', (req, res) => {
    User.findOne({
        _id: req.session.user._id
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('User not found while populating data on profile page');
            res.redirect('/login');
        } else {
            res.json(user);
        }
    });
})


app.get('/getAllUsersInfo', (req, res) => {
    User.find({}, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('User not found while populating data on profile page');
            res.redirect('/login');
        } else {
            res.json(user);
        }
    });
})


app.get('/admin', (req, res) => {
    if (req.session.isLoggedIn && req.session.user.userType == "Doctor") {
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
        userType: req.body.userType,
    });


    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
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
app.post('/update', (req, res) => {
    if (req.session.isLoggedIn) {
        User.updateOne({ "_id": req.session.user._id }, {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "userName": req.body.userName
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
            res.send();
            //console.log("Hello world");
        })
    }
})

app.post('/changePassword', (req, res) => {
    if(req.session.isLoggedIn) {
        User.findOne({
            _id: req.session.user._id
        }, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            if (!user) {
                console.log('User does not exist.');
                res.redirect('/login');
            } else {
                if(req.session.user.password === req.body.password) {
                    res.send("samePassword");
                } else {
                    User.updateOne({"_id": req.session.user._id},
                                   {"password": req.body.password}, function(err, result) {
                                       if(err) {
                                           console.log(err);
                                       }
                                       res.send("passChangeSuccess");
                                   })
                    //res.send("passChangeSuccess");
                }
                //res.json(user);
            }
        });
    }
})

////////////////////////////////////////
app.post('/delete', (req, res) => {
    User.count({userType: "Doctor"}, (err, result) => {
        if(err) {
            console.log(err);
        }
        if(result > 1) {
            User.deleteOne({ "_id": req.body._id }, function(err, result) {
                if (err) {
                    console.log(err);
                }
                res.send();

            })
        } else {
            console.log("1 Admin");
        }
    })
})


app.post('/adminUpdates', (req, res) => {
    User.updateOne({ "_id": req.body._id }, {
        "userName": req.body.userName,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "userType": req.body.userType
    }, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.send();
    })
})


app.post('/adminCreatesUser', async(req, res) => {
    const new_user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType,
    });


    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
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





///////////////////store photo to mongoDB///////////////////////
// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })
// var upload = multer({ storage: storage })
// app.post('/uploadphoto', upload.single('myImage'), (req, res) => {
//     console.log(req.file);
//     var img = fs.readFileSync(req.file.path);
//     var encode_img = img.toString('base64');
//     var final_img = {
//         contentType: req.file.mimetype,
//         image: new Buffer(encode_img, 'base64')
//     };

//     Image.create(final_img, function(err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(result.img.Buffer);
//             console.log("Saved To database");
//             res.contentType(final_img.contentType);
//             res.send(final_img.image);
//         }
//     })
// })

// app.get('/image', function(_, res) {
//     const doc = fs.readFileSync("./public/profile.html", "utf8");
//     res.send(doc);
// });
/////////////////////store photo to mongoDB//////////////////////

// const profilePicStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     fileName: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     },
// });

// const profilePicUpload = multer({storage: profilePicStorage});

// app.post('/uploadProfilePic', profilePicUpload.single('avatar'), (req, res) => {
//     if(req.file) {
//         User.updateOne({"_id": req.session.user._id},
//                         {"profilePic": "./uploads/" + req.file.filename}, function(err, result) {
//                             if(err) {
//                                 console.log(err);
//                             }
//                             res.send();
//                         })
//     }
// })


//////////////////////////////////////////////////////////////////



app.listen(port, () => {
    console.log('App is listening');
})