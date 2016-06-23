$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

$(document).ready(function(){

$('a.project').click(function (event){ 
     event.preventDefault(); 
     $.ajax({
        url: $(this).attr('href')
        ,success: function(issuedata) {
            $('#issue-list').html('');
            for (var key in issuedata.issues) {
                var issueid = issuedata.issues[key].key;
                $('#issue-list').append("<li><a class='issue' data-issue-key="+issueid+ " href=/index/issue/"+issueid+">"+issueid+"</a></li>");
            }
        }
     })
     return false; //for good measure
});

});

