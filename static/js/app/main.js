$('a.project').click(function (event){ 
     event.preventDefault(); 
     $.ajax({
        url: $(this).attr('href')
        ,success: function(response) {
            console.log(response.issues[0].key);
        }
     })
     return false; //for good measure
});
