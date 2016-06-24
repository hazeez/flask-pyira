$body = $("body");

$(document).on({
    ajaxStart: function() {
        $body.addClass("loading");
    },
    ajaxStop: function() {
        $body.removeClass("loading");
    }
});

$(document).ready(function() {
    var project_name = '';
    $('a.project').click(function(event) {
        event.preventDefault();
        var totalpages = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(issuedata) {
                // get the total issues
                total_issues = issuedata.total;
                //if total_issues more than 50 implement pagination
                if (total_issues > 50) {
                    // get the reminder of total to add an extra page in pagination
                    // else keep the total pages intact 
                    extrapage = total_issues % 50;
                    if (extrapage > 0) {
                        totalpages = Math.floor(total_issues / 50) + 1;
                    } else {
                        totalpages = total_issues / 50;
                    }
                } else {
                    $('#page-selection').html('');
                }
                $('#issue-list').html('');
                project_name = issuedata.issues[0].fields.project.key;
                console.log(project_name);
                /* use this project name and pass it as an ajax call to the 
                paginated numbers and return the issues for each page */

                for (var key in issuedata.issues) {
                    var issueid = issuedata.issues[key].key;
                    $('#issue-list').append("<li><a class='issue' data-issue-key=" + issueid + " href=/index/issue/" + issueid + ">" + issueid + "</a></li>");
                }

                // if more than one page then execute the following code
                if (totalpages > 1) {
                    $('#issue-group').append("<div id='page-selection'></div>");
                    // using jquery bootpag plugin
                    $('#page-selection').bootpag({
                        total: totalpages,
                        page: 1,
                        maxVisible: 4 // display maximum 4 pages
                    }).on('page', function(event, num) {
                        url = '/index/' + project_name + '/' + num;
                        $.ajax({
                            url: url,
                            success: function(nextissuedata) {
                                $('#issue-list').html('');
                                for (var key in nextissuedata.issues) {
                                    var issueid = nextissuedata.issues[key].key;
                                    $('#issue-list').append("<li><a class='issue' data-issue-key=" + issueid + " href=/index/issue/" + issueid + ">" + issueid + "</a></li>");
                                }
                            }
                        });
                    });
                }
            }
        })
        return false; //for good measure
    });

});

