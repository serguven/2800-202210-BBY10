"use strict";

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
            $("#welcome-name").append(user.firstName);
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
            if(data == "emailExist") {
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