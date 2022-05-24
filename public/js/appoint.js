
function checkid(){
    var id = new URLSearchParams(window.location.search).get('id');
    console.log(id);
    if(id){
        $.ajax({
            url: '/getOneDoctorsInfo',
            type: 'POST',
            data: {
                id: id,
            },
            success: function (data) {
                console.log(data);
                $(document).ready(function() {
                    $('#drname').html(data.Name);
                    $('#did').val(data._id);
                    $('#dname').val(data.Name);
                })
            }
        })
    }
}
checkid();
