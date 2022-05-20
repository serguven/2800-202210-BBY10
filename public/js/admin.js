"use strict";
///////////////////////////////////////populate all users to cards //////////////////////////////////////////////////////////////
$(document).ready(function() {
    $.ajax({
        url: "/getAllUsersInfo",
        type: "GET",
        success: function(data) {
            data.forEach(user => {
                var s = `<div class="card br">`
                s += `<div class="card-body">`;
                s += `<div class="card-title d-flex">`;
                s += `<h3>User information</h3>`
                s += `</div>`
                s += `<div class="card-text d-flex">`
                s += `<label class="me-3">User Name:</label>`
                s += `<div id="userName" contenteditable="true">${user.userName}</div>`
                s += `</div>`
                s += `<div class="card-text d-flex">`
                s += `<label class="me-3">First Name:</label>`
                s += `<div id="firstName" contenteditable="true">${user.firstName}</div>`
                s += `</div>`
                s += `<div class="card-text d-flex">`
                s += `<label class="me-3">Last Name:</label>`
                s += `<div id="lastName" contenteditable="true">${user.lastName}</div>`
                s += `</div>`
                s += `<div class="card=text d-flex">`
                s += `<label class="me-3">Email:</label>`
                s += `<div id="email" contenteditable="true">${user.email}</div>`
                s += `</div>`
                s += `<div class="card=text d-flex">`
                s += `<label class="me-3">Password:</label>`
                s += `<div id="password" contenteditable="true">${user.password}</div>`
                s += `</div>`
                s += `<div class="card=text d-flex">`
                s += `<label class="me-3">User Type:</label>`
                s += `<div id="userType" contenteditable="true">${user.userType}</div>`
                s += `</div>`
                s += `<div class="btn-group d-flex mt-3" role="group" aria-label="Basic mixed styles example" id="${user._id}">`
                s += `<button type="button" class="btn btn-success mx-2" id="action-button">Update</button>`
                s += `<button type="button" class="btn btn-primary mx-2" id="action-button-2">Delete</button>`
                s += `</div>`
                s += `</div>`
                s += `</div>`
                $('#populate').append(s);
            });
        }
    })
})



//////////////////////////////////////////delete card data //////////////////////////////////////////////////////////
$(document).on('click', '#action-button-2', function() {
    $.ajax({
        url: '/delete',
        type: 'POST',
        data: {
            _id: $(this).parent().attr('id')
        },
        success: function(data) {
            console.log($(this).parent().attr('id'));
            location.reload();
        }
    })
})


/////////////////////////////////////////////update card data //////////////////////////////////////////////////////////////////
$(document).on('click', '#action-button', function() {
    $.ajax({
        url: '/adminUpdates',
        type: 'POST',
        data: {
            _id: $(this).parent().attr('id'),
            userName: $(this).parent().prev().prev().prev().prev().prev().prev().children("div").text(),
            firstName: $(this).parent().prev().prev().prev().prev().prev().children("div").text(),
            lastName: $(this).parent().prev().prev().prev().prev().children("div").text(),
            email: $(this).parent().prev().prev().prev().children("div").text(),
            password: $(this).parent().prev().prev().children("div").text(),
            userType: $(this).parent().prev().children("div").text(),
        },
        success: function(data) {
            location.reload();
        }
    })
})


///////////////////////////////////////////// create new dataset //////////////////////////////////////////////////////////////////
$("#addCardButton").click(function() {
    $.ajax({
        url: '/adminCreatesUser',
        type: 'POST',
        data: {
            userName: $(this).parent().prev().prev().prev().prev().prev().prev().children("div").text(),
            firstName: $(this).parent().prev().prev().prev().prev().prev().children("div").text(),
            lastName: $(this).parent().prev().prev().prev().prev().children("div").text(),
            email: $(this).parent().prev().prev().prev().children("div").text(),
            password: $(this).parent().prev().prev().children("div").text(),
            userType: $(this).parent().prev().children("div").text(),
        },
        success: function(data) {
            if (data == "newAccount") {
                document.getElementById("message").innerHTML = "New account created";
                setTimeout(() => {
                    window.location = './admin';
                }, 1000);
            } else if (data == "invalidUser") {
                document.getElementById("message").innerHTML = "Not a Doctor or Patient";
            } else if (data == "emailExists") {
                document.getElementById("message").innerHTML = "Email is already used";
            }
        }
    })
})