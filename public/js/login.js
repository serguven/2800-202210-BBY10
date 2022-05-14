"use strict";
$('#loginbutton').click(() => {
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function(data) {

            console.log(data);
            if (data == "noUser") {
                document.getElementById("failed-login").innerHTML = "Login failed"
            }
        }
    })
})