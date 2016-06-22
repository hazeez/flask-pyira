$(document).ready(function(){

$('a.project').click(function (event){ 
     event.preventDefault(); 
     $.ajax({
        url: $(this).attr('href')
        ,success: function(response) {
            $('#issue-list').html(''); 
            $.each(response, function(key,value) {
                $('#issue-list').append("<li><a class='issue' data-issue-key="+value+ " href=/index/issue/"+value+">"+value+"</a></li>");
            }); 
        }
     })
     return false; //for good measure
});

});

