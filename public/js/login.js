"use strict";
$('#loginbutton').click(function() {
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function(data) {

            console.log(data);
            if (data == "noUser") { //////////error message for wrong email ///////////
                document.getElementById("failed-login").style.display = 'block';
                document.getElementById("failed-login").innerHTML = "Login failed - Incorrect Email";
            } else if (data == "wrongPassword") { /////////// error message for wrong password ///////////
                document.getElementById("failed-login").style.display = 'block';
                document.getElementById("failed-login").innerHTML = "Login failed - Incorrect Password";
            } else if (data == "isAdmin") { /////////////////// redirects for admin //////////////////
                document.getElementById("failed-login").style.color = 'black';
                document.getElementById("failed-login").innerHTML = "Redirecting to Admin...";
                setTimeout(() => {
                    window.location = './admin';
                }, 1000);
            } else if (data == "isUser") { ////////////////redirects to user profile////////////
                document.getElementById("failed-login").style.color = 'black';
                document.getElementById("failed-login").innerHTML = "Logging in...";
                setTimeout(() => {
                    window.location = './profile';
                }, 1000);
            }
        }
    })
})