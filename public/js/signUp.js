"use strict";
$('#signUpbutton').click(function() {
    $.ajax({
        url: '/signUp',
        type: 'POST',
        data: {
            firstName: $("#firstNameValue").val(),
            lastName: $("#lastNameValue").val(),
            userName: $("#userNameValue").val(),
            email: $("#emailValue").val(),
            password: $("#passwordValue").val(),
            userType: $("#userType").val(),
        },

        success: function(data) {
            if (data == "newAccount") {
                document.getElementById("new-account").innerHTML = "Creating new account...";
                setTimeout(() => {
                    window.location = './login';
                }, 1000);
            } else if (data == "emailExist") {
                document.getElementById("same-email").innerHTML = "This email has been used";
            }
        }
    })
})