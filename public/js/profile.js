"use strict";

// const { type } = require("express/lib/response");

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
$(document).ready(function() {
    $.ajax({
        url: "/getUserInfo",
        type: "GET",
        success: function(user) {
            $("#welcome-name").append(user.userName);
            $("#userNameInput").attr('value', user.userName);
            $("#fnameInput").attr('value', user.firstName);
            $("#lnameInput").attr('value', user.lastName);
            $("#emailInput").attr('value', user.email);
            $("#userTypeInput").attr('value', user.userType);
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

$('#submitNewPassword').click(function() {
    $.ajax({
        url: '/changePassword',
        type: 'POST',
        data: {
            password: $("#newPasswordInput").val(),
        },
        success: function(data) {
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
$('#saveInfo').click(function() {
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
        success: function(data) {
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
                document.getElementById("emailInput").disabled = false;
                ///////////////////////////////////////////////////////
            }


        }
    })
})



////////////////////////////////////// submit post /////////////////////////////////////////////
$('#postButton').click(function() {
    $.ajax({
        url: '/submitPost',
        type: 'POST',
        data: {
            title: $("#postTitleValue").val(),
            content: tinymce.get("postContentValue").getContent(),
        },
        success: function(data) {
            location.reload();
        }
    })
})





////////////////////////////////////// update post /////////////////////////////////////////////
$('#updateButton').click(function() {
    var searchparams = new URLSearchParams(window.location.search).get('id');
    $.ajax({
        url: '/updatePost',
        type: 'POST',
        data: {
            pid: searchparams,
            title: $("#postTitleValue2").val(),
            content: tinymce.get("postContentValue2").getContent(),
        },
        success: function(data) {
            // location.reload();
            window.location.href = '/profile';
        }
    })
})


$(document).ready(function() {
    var searchparams = new URLSearchParams(window.location.search).get('id');
    if (searchparams) {
        $.ajax({
            url: "/getUserPostsOne",
            type: "POST",
            data: { url: searchparams },
            success: function(data) {
                console.log(data);
                $('#postTitleValue2').val(data.title);
                // $('#postContentValue22').html(data.content);
                // tinymce.get("#postContentValue").setContent(data.content);
                console.log(data.content);
                tinyMCE.activeEditor.setContent(data.content);
                // if(data == "noPost") {
                //     console.log("nopost");
                //     document.getElementById("noPostExist").innerHTML = "User doesn't have any posts to display."
                // } else {
                // }
            }
        })
    }
})

///////////////////////////////////// populate posts ////////////////////////////////////
$(document).ready(function() {
    $.ajax({
        url: "/getUserPosts",
        type: "GET",
        success: function(data) {
            if (data == "noPost") {
                console.log("nopost");
                document.getElementById("noPostExist").innerHTML = "User doesn't have any posts to display."
            } else {
                data.forEach(post => {
                    var s = `<div class="card br">`
                    s += `<div class="card-body">`
                    s += `<div class="card-title d-flex">`
                    s += `<h3 id="post-title">${post.title}</h3>`
                    s += `</div>`
                    s += `<div class="card-text d-flex mb-5">`
                    s += `<div id="post-desc">${post.content}</div>`
                    s += `</div>`
                    s += `<div class="card-text d-flex">`
                    s += `<div id="time">${post.updatedAt}</div>`
                    s += `</div>`
                    s += `<div class="btn d-flex justify-content-center mt-3">`
                    s += `<a href="profile?id=${post._id}" class="btn btn-primary mx-2 br" id="EditCardButton">Edit post</a>`
                    s += `<button type="button" class="btn btn-danger mx-2 br" id="DeleteCardButton">Delete post</button>`
                    s += `<div class="btn d-flex justify-content-center mt-3" id="${post._id}">`
                    s += `<button type="button" class="btn btn-primary mx-2 br" id="EditCardButton">Edit post</button>`
                    s += `<button type="button" class="btn btn-secondary mx-2 br" id="DeleteCardButton">Delete post</button>`
                    s += `</div>`
                    s += `</div>`
                    s += `</div>`
                        // s += `<div class="modal" id='myModal${post._id}'>`
                        // s += `<div class="modal-dialog">`
                        // s += `<div class="modal-content">`
                        //     s += `<div class="modal-body">`

                    //     s += `<fieldset>`
                    //     s += `<label class="profile-label">Title</label>`
                    //     s += `<div class="profile-info">`
                    //     s += `<input type="text" id="postTitleValue" class="form-control" name="postTitle" placeholder="Post Title" value="${post.title}">`
                    //     s += `</div>`
                    //     s += `<label class="profile-label">Content</label>`
                    //     s += `<div class="profile-info">`
                    //     s += `<textarea class="postContentValue" name="postContent"></textarea>`
                    //     s += `</div>`
                    //     s += `<label class="profile-label form-label" for="formFileLg2">Select Image</label>`
                    //     s += `<div class="profile-info">`
                    //     s += `<input class="form-control" id="formFileLg2" type="file">`
                    //     s += `</div>`
                    //     s += `<br>`
                    //     s += `<div class="profile-container">`
                    //     s += `<!-- <button type="button" class="btn btn-primary" onclick="editProfile()">Edit</button> -->`
                    //     s += `<!-- <button type="button" class="btn btn-success" id="saveInfo">Save</button> -->`
                    //     s += `<!-- <button type="submit" class="btn btn-danger" id="logout">Log out</button> -->`
                    //     s += `<button type="button" class="btn btn-success" id="postButton">Save</button>`
                    //     s += `<button type="button" class="btn btn-danger" id="cancelPostButton">Cancel</button>`
                    //     s += `</div>`
                    //     s += `</fieldset>`


                    //     s += `</div>`
                    // s += `</div>`
                    // s += `</div>`
                    // s += `</div>`
                    $('#populatePosts').append(s);
                })
            }
        }
    })
})


////////////////////// Delete timeline post//////////////////
$(document).on('click', '#DeleteCardButton', function() {
    $.ajax({
        url: '/deletePost',
        type: 'POST',
        data: {
            _id: $(this).parent().attr('id')
        },
        success: function(data) {
            location.reload();
        }
    })
})


function checkedit() {
    var searchparams = new URLSearchParams(window.location.search).get('id');
    if (searchparams) {
        $(document).ready(function() {
            $('#edited').show();
            $('#original').hide();
        })
    } else {
        $(document).ready(function() {
            $('#edited').hide();
            $('#original').show();
        })
    }
}
checkedit();




///////////////////// profile picture js code ///////////////////////////////////////////
const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

//if user hover on img div
imgDiv.addEventListener('mouseenter', function() {
    uploadBtn.style.display = "block";
});

//if we hover out from img div
imgDiv.addEventListener('mouseleave', function() {
    uploadBtn.style.display = "none";
});

//when we choose a photo to upload
file.addEventListener('change', function() {
    const chosen = this.files[0];
    if (chosen) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            img.setAttribute('src', reader.result);
        });
        reader.readAsDataURL(chosen);
    }
});