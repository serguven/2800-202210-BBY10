"use strict";
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user");
const Doctor = require("./models/doctor");
const Appointment = require("./models/appointment");
const session = require('express-session');
const multer = require('multer');
const fs = require("fs");
///////////////////////////////////////////
const Post = require("./models/post");
///////////////////////////////////////////


const port = process.env.PORT || 8000;

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
    res.sendFile(path.resolve('public/index.html'));
})

//////login/logout browser back button cache problem solution ////////////////////
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
        email: req.body.email
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            res.send("noUser");
            console.log('No user with such email.');
        } else {
            return authenticate(req, res, user); // checks password
        }
    });
})

////////checks for password///////
function authenticate(req, res, user) {
    if (req.body.password !== user.password) {
        res.send("wrongPassword");
        console.log("Incorrect password");
    } else {
        req.session.user = user;
        req.session.isLoggedIn = true;
        if (req.session.user.userType == "Doctor") {
            res.send("isAdmin");
        } else {
            res.send("isUser");
        }
    }
}

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
            //console.log(JSON.stringify(user))
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
            res.redirect('/signUp')
        }
        if (!user) {
            new_user.save()
                .then((result) => {
                    console.log(result);
                });

            res.send("newAccount");
        } else {
            console.log('Account with this email adress exists.');
            res.send("emailExist");
        }
    })
})


app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

/////////////////// user profile updating /////////////////////
app.post('/update', (req, res) => {
    /////////////////////////////
    User.findOne({
            email: req.body.email,
        }, function(err, user) {
            if (err) {
                console.log(err);
                res.redirect('/profile');
            }
            if (!user) {
                User.updateOne({ "_id": req.session.user._id }, {
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "userName": req.body.userName,
                    "email": req.body.email
                }, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    res.send();
                })
            } else {
                res.send("emailExist");
            }
        })
        ///////////////////////////////////

})

app.post('/changePassword', (req, res) => {
    if (req.session.isLoggedIn) {
        User.findOne({
            _id: req.session.user._id
        }, function(err, user) {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            if (!user) {
                console.log('User does not exist.');
                res.redirect('/login');
            } else {
                if (req.session.user.password === req.body.password) {
                    res.send("samePassword");
                } else {
                    User.updateOne({ "_id": req.session.user._id }, { "password": req.body.password }, function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        res.send("passChangeSuccess");
                    })
                }
            }
        });
    }
})

////////////////////admin dashboard CRUD features////////////////////
app.post('/delete', (req, res) => {
    User.count({ userType: "Doctor" }, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result > 1) {
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
        email: req.body.email,
        userType: req.body.userType
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            new_user.save()
                .then((result) => {
                    console.log(result);
                });

            // res.redirect('/login');
            res.send("newAccount");

        } else {
            console.log('Account with this email adress exists.');
            // res.redirect('/signUp');
            res.send("emailExists");
        }
    })
})

///////////////////////////////////////////////////////////////////////////////


////////////////////////////// post Image ///////////////////////////////////////////////

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

/////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////// timeline part //////////////////////////////////////////
app.post('/submitPost', upload.array("postImages", 3), async(req, res) => {
    console.log(req.body);
    let filenames = [];
    for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].filename) {
            filenames.push(req.files[i].filename);
        }
    }


    let changingImages = [];
    if (req.body.postImage1) {
        changingImages.push(req.body.postImage1);
    }
    if (req.body.postImage2) {
        changingImages.push(req.body.postImage2);
    }
    if (req.body.postImage3) {
        changingImages.push(req.body.postImage3);
    }



    if (req.body.postId) {
        Post.findOne({
            _id: req.body.postId
        }, function(err, post) {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            if (post) {
                let index = 0;
                let changedImages = post.postImage;
                for (let i = 0; i < changingImages.length; i++) {
                    for (let j = 0; j < changedImages.length; j++) {
                        if (changingImages[i] === changedImages[j]) {
                            if (filenames[index]) {
                                changedImages[j] = filenames[index];
                                index++;
                            }
                        }
                    }
                }


                Post.updateOne({ "_id": req.body.postId }, {
                    //"userId": req.session.user._id,
                    "title": req.body.postTitle,
                    "content": req.body.postContent,
                    "postImage": changedImages
                }, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    //res.send();
                    res.redirect("/profile");
                })
            }
        })
    } else {
        const new_post = new Post({
            userId: req.session.user._id,
            title: req.body.postTitle,
            content: req.body.postContent,
            postImage: filenames

        });

        //console.log(req.files);

        new_post.save()
            .then((result) => {
                console.log(result);
            });

        //res.send();
        res.redirect("/profile");
    }
})


app.get('/getUserPosts', (req, res) => {
    Post.find({
        userId: req.session.user._id
    }, function(err, post) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (post.length == 0) {
            console.log("nopost");
            res.send("noPost");
        } else {
            //console.log(post);
            //console.log(JSON.stringify(post));
            res.json(post);
        }
    })
})

//////////////////////////////// semih update version timeline //////////////////////////////////
app.post('/getPostInfo', (req, res) => {
    Post.findOne({
        _id: req.body._id
    }, function(err, post) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (post.length == 0) {
            console.log("nopost");
            res.send("noPost");
        } else {
            res.json(post);
        }
    })
})


/////////////////////////////////////////////////////////////////////////////////////////////////


//////Delete the timeline post////////////////

app.post('/deletePost', (req, res) => {
    Post.deleteOne({
        "_id": req.body._id
    }, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.send();
    })
})

//////////////////////////Adding doctor/////////////////////////////////////////////////////
app.post('/addNewDoctor', (req, res) => {

    const new_doctor = new Doctor(req.body);
    // console.log(req.body);
    new_doctor.save().then((succ) => {
        // res.send('Ok');
        res.redirect('/admin');
    })


})

///////////////////////////////Appointment booking/////////////////////////////////////////////
app.post('/booknewappointment', (req,res) => {

    console.log(req.body);
    const newappointment = new Appointment(req.body);
    // console.log(req.body);

    // new_user.save()
    // .then((result) => {
    //     console.log(result);
    // });

    newappointment.save().then((succ) => {
    //     // res.send('Ok');
       res.redirect('profile.html');
    })

})


app.get('/viewappointment', (req,res) => {

    // console.log(req.body);
    // const new_appointment = new Appointment(req.body);
    // console.log(req.body);
    // new_appointment.save().then((succ) => {
        // res.send('Ok');
    //    res.redirect('/profile.html');
    // })
    Appointment.find({}, function(err, succ){
        // console.log(succ);
        res.send(succ);
    })


})

////////////////////////////getting all doctors info/////////////////////////////////////////////////
app.get('/getAllDoctorsInfo', (req, res) => {
    Doctor.find({}, function(err, user) {
        // console.log(user);
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('User not found while populating data on profile page');
            res.redirect('/login');
        } else {
            // console.log(JSON.stringify(user))
            res.json(user);
        }
    });
})


app.post('/getOneDoctorsInfo', (req, res) => {
    var id = req.body.id;
    // console.log(id);
    Doctor.findOne({_id : id}, function(err, user) {
        // console.log(user);
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('User not found while populating data on profile page');
            res.redirect('/login');
        } else {
            // console.log(user);
            res.json(user);
        }
    });
})



app.listen(port, () => {
    console.log('App is listening');
})