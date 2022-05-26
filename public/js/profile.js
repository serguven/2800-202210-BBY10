"use strict";

// const { format } = require("path");

//////////////// Full page tab /////////////
//https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
function openMenu(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("profile-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("profile-menu");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();






///////////////////////populate user info/////////////////////////////////////////////////////////////////
$(document).ready(function () {
    $.ajax({
        url: "/getUserInfo",
        type: "GET",
        success: function (user) {
            $("#welcome-name").append(user.userName);
            $("#userNameInput").attr('value', user.userName);
            $("#fnameInput").attr('value', user.firstName);
            $("#lnameInput").attr('value', user.lastName);
            $("#emailInput").attr('value', user.email);
            $("#userTypeInput").attr('value', user.userType);
            $("#photo").attr('src', './../uploads/'+user.Image);
        }
    })
})


////////////////////////////////// edit button enables form for editing //////////////////////////////////////
function editProfile() {
    /////////////////////////////////////////
    document.getElementById("emailInput").disabled = false;
    /////////////////////////////////////////

    document.getElementById("userNameInput").disabled = false;
    document.getElementById("fnameInput").disabled = false;
    document.getElementById("lnameInput").disabled = false;
    document.getElementById("formFileLg").disabled = false;
}



//////////////////////////////////////////change password//////////////////////////////////////////////////////////
function changePassword() {
    document.getElementById("newPasswordMessage").removeAttribute("hidden");
    document.getElementById("newPasswordLabel").removeAttribute("hidden");
    document.getElementById("newPasswordInput").setAttribute("type", "text");
    document.getElementById("submitNewPassword").removeAttribute("hidden");
    document.getElementById("passwordChangeButton").setAttribute("hidden", "hidden");
}

$('#submitNewPassword').click(function () {
    $.ajax({
        url: '/changePassword',
        type: 'POST',
        data: {
            password: $("#newPasswordInput").val(),
        },
        success: function (data) {
            if (data == "samePassword") {
                document.getElementById("samePassword").innerHTML = "New password cannot be the same as old password!";
            } else if (data == "passChangeSuccess") {
                document.getElementById("newPasswordMessage").setAttribute("hidden", "hidden");
                document.getElementById("newPasswordLabel").setAttribute("hidden", "hidden");
                document.getElementById("newPasswordInput").setAttribute("type", "hidden");
                document.getElementById("submitNewPassword").setAttribute("hidden", "hidden");
                document.getElementById("passwordChangeButton").removeAttribute("hidden");

                document.getElementById("samePassword").innerHTML = "Your password changed successfully.";
            }
        }
    })
})




/////////////////////////////edit profile///////////////////////////////////////////////////////
$('#saveInfo').click(function () {
    //console.log("Hello world");
    $.ajax({
        url: '/update',
        type: 'POST',
        data: {
            firstName: $("#fnameInput").val(),
            lastName: $("#lnameInput").val(),
            userName: $("#userNameInput").val(),
            email: $("#emailInput").val(),
            userType: $("#userTypeInput").val(),
        },
        success: function (data) {
            if (data == "emailExist") {
                document.getElementById("emailExist").innerHTML = "This email address already exists.";
            } else {
                //location.reload();
                document.getElementById("updatedMessage").innerHTML = "User profile updated";

                document.getElementById("userNameInput").disabled = true;
                document.getElementById("fnameInput").disabled = true;
                document.getElementById("lnameInput").disabled = true;
                document.getElementById("formFileLg").disabled = true;

                /////////////////////////////////////////////////////
                document.getElementById("emailInput").disabled = true;
                ///////////////////////////////////////////////////////
            }


        }
    })
})





///////////////////////////////////// populate posts ////////////////////////////////////
$(document).ready(function () {
    $.ajax({
        url: "/getUserPosts",
        type: "GET",
        success: function (data) {
            if (data == "noPost") {
                // console.log("nopost");
                document.getElementById("noPostExist").innerHTML = "User doesn't have any posts to display."
            } else {
                data.forEach(post => {
                    var date = new Date(post.updatedAt);
                    var s = `<div class="card br post-card">`
                    s += `<div class="card-body">`
                    s += `<div class="card-title d-flex">`
                    s += `<h3 id="post-title">${post.title}</h3>`
                    s += `</div>`
                    s += `<div class="card-text d-flex mb-5">`
                    s += `<div id="post-desc">${post.content}</div>`
                    s += `</div>`

                    if (post.postImage.length > 0) {

                        for (let i = 0; i < post.postImage.length; i++) {
                            s += `<div class="card-text post-images mb-5">`
                            s += `<img id="responsive" src="/uploads/${post.postImage[i]}" alt = "unsuccessful" />`
                            s += `</div>`
                        }
                    }

                    s += `<div class="card-text d-flex">`
                    s += `<div id="time">${date.toLocaleString("en-us", {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"})}</div>`
                    s += `</div>`

                    s += `<div class="btn d-flex justify-content-center mt-3" id="${post._id}">`
                    s += `<button type="button" class="btn btn-primary mx-2 br" id="EditCardButton">Edit post</button>`
                    s += `<button type="button" class="btn btn-secondary mx-2 br" id="DeleteCardButton">Delete post</button>`
                    s += `</div>`
                    s += `</div>`
                    s += `</div>`
                    $('#populatePosts').append(s);
                })
            }
        }
    })
})

///////////////////////////////////// show post submission form /////////////////////////////////
function showPostSubmissionForm() {
    document.getElementById("addPostForm").removeAttribute("hidden");
}


///////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////// update post ////////////////////////////////////////////////
$(document).on('click', '#EditCardButton', function () {
    $.ajax({
        url: '/getPostInfo',
        type: 'POST',
        data: {
            _id: $(this).parent().attr('id')
        },
        success: function(data) {
            document.getElementById("addPostForm").removeAttribute("hidden");
            window.scrollTo({ top: 0, behavior: 'smooth' })
            console.log(data);
            document.getElementById("addBlogHeading").innerHTML = "Update Post";
            $('#postIdValue').val(data._id);
            $('#postTitleValue').val(data.title);
            tinymce.activeEditor.setContent(data.content);

            document.getElementById("imageSelectorHeading").removeAttribute("hidden");
            document.getElementById("imageSelector").removeAttribute("hidden");
            for(let i = 0; i < data.postImage.length; i++) {
                document.getElementById("image".concat(i+1)).setAttribute("value", data.postImage[i]);
                document.getElementById("image".concat(i+1, "src")).setAttribute("src", "/uploads/".concat(data.postImage[i]));
                document.getElementById("image".concat(i+1, "Label")).innerHTML = data.postImage[i];
            }

        }
    })
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////// Delete timeline post//////////////////
$(document).on('click', '#DeleteCardButton', function () {
    $.ajax({
        url: '/deletePost',
        type: 'POST',
        data: {
            _id: $(this).parent().attr('id')
        },
        success: function (data) {
            location.reload();
        }
    })
})



/////////////////////////////////////// Doctor info form ////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $.ajax({
        url: "/getAllDoctorsInfo",
        type: "GET",
        success: function (data) {
            if (data == "noPost") {
                // console.log("nopost");
                document.getElementById("noPostExist").innerHTML = "User doesn't have any posts to display."
            } else {
                // var a = 1;
                data.forEach(post => {
                    // if(a == 1){
                    // console.log(post);

                    var s = `<table class='table'>`
                    s += `<td>${post.Name}</td>`
                    s += `<br><br>`
                    s += `<td>${post.Address}</td>`
                    s += `<td>${post.Qualification}</td>`
                    s += `<td>${post.Email}</td>`
                    s += `<td>${post.Contact}</td>`
                    s += `<td>${post.openAt}</td>`
                    s += `<td>${post.closeAt}</td>`
                    s += `<td><a href="appointment.html?id=${post._id}" class="btn btn-secondary mx-2 br" id="Book an appointment">Book an appointment</a></td>`


                    // s += `<div class="modal" id="myModal${post._id}">`
                    // s += `<div class="modal-dialog">`
                    // s += `<div class="modal-content">`
                    // s += `<div class="modal-header">`
                    // s += `<h4 class="modal-title">Book with ${post.Name}</h4>`
                    // s += `<button type="button" class="btn-close" data-bs-dismiss="modal"></button>`
                    // s += `</div>`
                    // s += `<div class="modal-body">`

                    // s += `<form id="myform${post._id}" action="/booknewappointment" method="get">`
                    // s += `<input type='text' name='uid' value="${post.Name}" >`
                    // s += `<label class="booking-label" for="name">Name</label>`
                    // s += `<div class="mb-3">`
                    // s += `<input id="name" type="text" name="name" class="form-control" placeholder="Enter your name" required />`
                    // s += `</div>`
                    // s += `<label class="booking-label" for="date">Date</label>`
                    // s += `<div class="mb-3">`
                    // s += `<input id="dateInput" type="date" name="dateInput" class="form-control" placeholder="date" required />`
                    // s += `</div>`
                    // s += `<label class="booking-label" for="day">Day</label>`
                    // s += `<div class="mb-3">`
                    // s += `<input id="date" type="text" name="date" class="form-control" placeholder="Day" required />`
                    // s += `</div>`
                    // s += `<label class="booking-label" for="time">Time</label>`
                    // s += `<div class="mb-3">`
                    // s += `<input id="time" type="time" name="time" class="form-control" placeholder="time" required>`
                    // s += `</div>`
                    // s += `<label class="booking-label" for="Contact">Contact</label>`
                    // s += `<div class="mb-3">`
                    // s += `<input id="Contact" type="tel" name="Contact" class="form-control" placeholder="456-975-9652" required>`
                    // s += `</div>`
                    // s += `<div class="d-grid">`
                   
                    // s += `<button class="btn btn-primary btn-confirm text-uppercase fw-bold mb-3" type="submit">Book an Appointment</button>`

                    // s += `</div>`
                    // s += `</form>`

                    // s += `</div>`
                    // s += `<div class="modal-footer">`
                    // s += `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`
                    // s += `</div>`
                    // s += `</div>`
                    // s += `</div>`
                    // s += `</div>`

                    s += `</table>`
                    $('#allDoctors').append(s);

                        

                    // }
                    // a++;
                })
            }
        }
    })
})


////////////////////////////////////Appointment Booking/////////////////////////////////////////
$(document).ready(function () {
    var a;
    $.ajax({
        url: "/viewappointment",
        type: "GET",
        success: function (user) {
            // console.log(user);
            user.forEach((succ) => {
                a += `<tr>`;
                a += `<td>`;
                a += `${succ.dname}`;
                a += `</td>`;
                a += `<td>`;
                a += `${succ.name}`;
                a += `</td>`;
                a += `<td>`;
                a += `${succ.dateInput}`;
                a += `</td>`;
                a += `<td>`;
                a += `${succ.text}`;
                a += `</td>`;
                a += `<td>`;
                a += `${succ.time}`;
                a += `</td>`;
                a += `<td>`;
                a += `${succ.Contact}`;
                a += `</td>`;
                a += `</tr>`;
            })
            $('#myapoin').html(a);
        }
    })
})



///////////////////// profile picture js code ///////////////////////////////////////////
const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

//if user hover on img div
imgDiv.addEventListener('mouseenter', function () {
    uploadBtn.style.display = "block";
});

//if we hover out from img div
imgDiv.addEventListener('mouseleave', function () {
    uploadBtn.style.display = "none";
});

//when we choose a photo to upload
file.addEventListener('change', function () {
    const chosen = this.files[0];
    if (chosen) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            img.setAttribute('src', reader.result);
            document.getElementById('upd').style.display = 'block';
        });
        reader.readAsDataURL(chosen);
    }
});



/////logout modal, code could possibly be reused in other sections/////
// code derived from https://www.youtube.com/watch?v=MBaw_6cPmAw
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.popup-modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.popup-modal')
        closeModal(modal)
    })
})


function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}