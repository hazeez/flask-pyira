$(document).ready(function(){

$('a.project').click(function (event){ 
     event.preventDefault(); 
     $.ajax({
        url: $(this).attr('href')
        ,success: function(response) {
            $('#issue-list').html('');
            for (var key in response.issues) {
                var val = response.issues[key].key;
                console.log(val);
            }
        }
     })
     return false; //for good measure
});

});

