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
    $('#project-dashboard-link').hide();
    $('a.project').click(function(event) {
        event.preventDefault();
        var totalpages = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(issuedata) {
                // if the issues are present then show the dashboard link
                $('#project-dashboard-link').show();
                $('div#dashboard-summary').html('');
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
                $('#project-dashboard-link').attr('href','/index/'+project_name+'/dashboard');
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
                    });
                    
                    $('ul.pagination.bootpag li').click(function() {
                        var num = $(this).attr('data-lp');
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
                        }); // ajax function ends here
                    });
                } //if construct ends here
            }
        })
        return false; //for good measure
    });


    // function to generate dashboard via ajax
    $('a#project-dashboard-link').click(function(event){
        event.preventDefault();
        $.ajax({
            url : $(this).attr('href'),
            // success: function (summary_response, itr2_response) {
            success: function (summary_response) {
               $("#dashboard-summary").html('');
               var total_itr1_issues = 0;
               var total_itr2_issues = 0;
                total_itr1_issues = summary_response["A1"] + summary_response["B1"] + summary_response["C1"] + summary_response["D1"] + summary_response["E1"];
               total_itr2_issues = summary_response["A2"] + summary_response["B2"] + summary_response["C2"] + summary_response["D2"] + summary_response["E2"];

               $("#dashboard-summary").html('<table class=table id="total-issues-summary-table"> \
                <tr><th id="total-issues-table-row">Total Issues</th></tr>\
                <td>Round</td> \
                <td>A</td> \
                <td>B</td> \
                <td>C</td> \
                <td>D</td> \
                <td>E</td> \
                <td>Total</td> \
               <tr><td>ITR1</td>\
                   <td>'+summary_response["A1"]+'</td>\
                   <td>'+summary_response["B1"]+'</td>\
                   <td>'+summary_response["C1"]+'</td>\
                   <td>'+summary_response["D1"]+'</td>\
                   <td>'+summary_response["E1"]+'</td>\
                   <td>'+total_itr1_issues+'</td>\
                   </tr><tr>\
                   <td>ITR2</td>\
                   <td>'+summary_response["A2"]+'</td>\
                   <td>'+summary_response["B2"]+'</td>\
                   <td>'+summary_response["C2"]+'</td>\
                   <td>'+summary_response["D2"]+'</td>\
                   <td>'+summary_response["E2"]+'</td>\
                   <td>'+total_itr2_issues+'</td>\
                   </tr><tr>'+
                   '<td>Total</td>\
                   <td>'+(summary_response["A1"] + summary_response["A2"])+'</td>\
                   <td>'+(summary_response["B1"] + summary_response["B2"])+'</td>\
                   <td>'+(summary_response["C1"] + summary_response["C2"])+'</td>\
                   <td>'+(summary_response["D1"] + summary_response["D2"])+'</td>\
                   <td>'+(summary_response["E1"] + summary_response["E2"])+'</td>\
                   <td>'+(total_itr1_issues + total_itr2_issues)+'</td></tr></table>');
            }
        }); // ajax function ends here

    });

});

