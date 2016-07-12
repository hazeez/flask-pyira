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
        $("a.project.list-group-item.active").removeClass("active"); 
        $(this).addClass('active');
        event.preventDefault();
        var totalpages = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(issuedata) {
                // if the issues are present then show the dashboard link
                $('#issue-title').show();
                $('#issue-group').show();
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
                    $('#issue-list').append("<li><a class='issue list-group-item' data-issue-key=" + issueid + " href=/index/issue/" + issueid + ">" + issueid + "</a></li>");
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
                                    $('#issue-list').append("<li><a class='issue list-group-item' data-issue-key=" + issueid + " href=/index/issue/" + issueid + ">" + issueid + "</a></li>");
                                }
                            }
                        }); // ajax function ends here
                    });
                } //if construct ends here
            }
        })
        return false; //for good measure
    });

    // this function creates hyperlink based on the issue count
    function table_data_issue(issue_count, itr_round, status, type){
        if (issue_count == 0){
            return '<span class=zero>' + issue_count + '</span>'
        }else{
            return '<a class="dashboard-issue-link" href=/index/dashboard/issuesummary/'+ type +'$'+ itr_round +'&'+ status + '>'+issue_count +'</a>'
        } 
    };

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
               var total_itr1_closed = 0;
               var total_itr2_closed = 0;
               var total_itr1_resolved = 0;
               var total_itr2_resolved = 0;
               var total_itr1_inprogress = 0;
               var total_itr2_inprogress = 0;
               var total_itr1_reopened = 0;
               var total_itr2_reopened = 0;
               var total_itr1_opened = 0;
               var total_itr2_opened = 0;

                total_itr1_issues = summary_response["A1"] + summary_response["B1"] + summary_response["C1"] + summary_response["D1"] + summary_response["E1"];
               total_itr2_issues = summary_response["A2"] + summary_response["B2"] + summary_response["C2"] + summary_response["D2"] + summary_response["E2"];

                total_itr1_closed = summary_response["A1C"] + summary_response["B1C"] + summary_response["C1C"] + summary_response["D1C"] + summary_response["E1C"];
               total_itr2_closed = summary_response["A2C"] + summary_response["B2C"] + summary_response["C2C"] + summary_response["D2C"] + summary_response["E2C"];

                total_itr1_resolved = summary_response["A1R"] + summary_response["B1R"] + summary_response["C1R"] + summary_response["D1R"] + summary_response["E1R"];
               total_itr2_resolved = summary_response["A2R"] + summary_response["B2R"] + summary_response["C2R"] + summary_response["D2R"] + summary_response["E2R"];

                total_itr1_inprogress = summary_response["A1IP"] + summary_response["B1IP"] + summary_response["C1IP"] + summary_response["D1IP"] + summary_response["E1IP"];
               total_itr2_inprogress = summary_response["A2IP"] + summary_response["B2IP"] + summary_response["C2IP"] + summary_response["D2IP"] + summary_response["E2IP"];

                total_itr1_reopened = summary_response["A1RO"] + summary_response["B1RO"] + summary_response["C1RO"] + summary_response["D1RO"] + summary_response["E1RO"];
               total_itr2_reopened = summary_response["A2RO"] + summary_response["B2RO"] + summary_response["C2RO"] + summary_response["D2RO"] + summary_response["E2RO"];

                total_itr1_opened = summary_response["A1O"] + summary_response["B1O"] + summary_response["C1O"] + summary_response["D1O"] + summary_response["E1O"];
               total_itr2_opened = summary_response["A2O"] + summary_response["B2O"] + summary_response["C2O"] + summary_response["D2O"] + summary_response["E2O"];

               $("#dashboard-summary").html('<table class="table col-md-12" id=total-issues-summary-table>\
               <tr>\
               <td>\
                   <table class="table col-md-4">\
                   <th class=blank-table-header></th>\
                    <th id="table-itr1" colspan=6>ITR1</th>\
                        <tr>\
                            <td><strong>Issues</strong></td> \
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                        <td><strong>Total</strong></td>\
                        <td>'+summary_response["A1"]+'</td>\
                        <td>'+summary_response["B1"]+'</td>\
                        <td>'+summary_response["C1"]+'</td>\
                        <td>'+summary_response["D1"]+'</td>\
                        <td>'+summary_response["E1"]+'</td>\
                        <td>'+total_itr1_issues+'</td>\
                    </tr>\
                    <tr class="highlight-row">\
                        <td><strong>Closed</strong></td>\
                        <td>'+table_data_issue(summary_response["A1C"],1,'CL','A')+'</td>\
                        <td>'+table_data_issue(summary_response["B1C"],1,'CL','B')+'</td>\
                        <td>'+table_data_issue(summary_response["C1C"],1,'CL','C')+'</td>\
                        <td>'+table_data_issue(summary_response["D1C"],1,'CL','D')+'</td>\
                        <td>'+table_data_issue(summary_response["E1C"],1,'CL','E')+'</td>\
                        <td>'+total_itr1_closed+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td><strong>Resolved</strong></td>\
                        <td>'+table_data_issue(summary_response["A1R"],1,'RL','A')+'</td>\
                        <td>'+table_data_issue(summary_response["B1R"],1,'RL','B')+'</td>\
                        <td>'+table_data_issue(summary_response["C1R"],1,'RL','C')+'</td>\
                        <td>'+table_data_issue(summary_response["D1R"],1,'RL','D')+'</td>\
                        <td>'+table_data_issue(summary_response["E1R"],1,'RL','E')+'</td>\
                        <td>'+total_itr1_resolved+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td><strong>InProgress</strong></td>\
                        <td>'+table_data_issue(summary_response["A1IP"],1,'IP','A')+'</td>\
                        <td>'+table_data_issue(summary_response["B1IP"],1,'IP','B')+'</td>\
                        <td>'+table_data_issue(summary_response["C1IP"],1,'IP','C')+'</td>\
                        <td>'+table_data_issue(summary_response["D1IP"],1,'IP','D')+'</td>\
                        <td>'+table_data_issue(summary_response["E1IP"],1,'IP','E')+'</td>\
                        <td>'+total_itr1_inprogress+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td><strong>ReOpened</strong></td>\
                        <td>'+table_data_issue(summary_response["A1RO"],1,'RO','A')+'</td>\
                        <td>'+table_data_issue(summary_response["B1RO"],1,'RO','B')+'</td>\
                        <td>'+table_data_issue(summary_response["C1RO"],1,'RO','C')+'</td>\
                        <td>'+table_data_issue(summary_response["D1RO"],1,'RO','D')+'</td>\
                        <td>'+table_data_issue(summary_response["E1RO"],1,'RO','E')+'</td>\
                        <td>'+total_itr1_reopened+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td><strong>Open</strong></td>\
                        <td>'+table_data_issue(summary_response["A1O"],1,'OP','A')+'</td>\
                        <td>'+table_data_issue(summary_response["B1O"],1,'OP','B')+'</td>\
                        <td>'+table_data_issue(summary_response["C1O"],1,'OP','C')+'</td>\
                        <td>'+table_data_issue(summary_response["D1O"],1,'OP','D')+'</td>\
                        <td>'+table_data_issue(summary_response["E1O"],1,'OP','E')+'</td>\
                        <td>'+total_itr1_opened+'</td>\
                    </tr>\
                    </table>\
                    </td>\
                \
                    <td>\
                    <table class="table col-md-4">\
                    <th id="table-itr2" colspan=6>ITR2</th>\
                        <tr>\
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                    <td>'+summary_response["A2"]+'</td>\
                    <td>'+summary_response["B2"]+'</td>\
                    <td>'+summary_response["C2"]+'</td>\
                    <td>'+summary_response["D2"]+'</td>\
                    <td>'+summary_response["E2"]+'</td>\
                    <td>'+total_itr2_issues+'</td>\
                    </tr>\
                    <tr class="highlight-row">\
                    <td>'+table_data_issue(summary_response["A2C"],2,'CL','A')+'</td>\
                    <td>'+table_data_issue(summary_response["B2C"],2,'CL','B')+'</td>\
                    <td>'+table_data_issue(summary_response["C2C"],2,'CL','C')+'</td>\
                    <td>'+table_data_issue(summary_response["D2C"],2,'CL','D')+'</td>\
                    <td>'+table_data_issue(summary_response["E2C"],2,'CL','E')+'</td>\
                    <td>'+total_itr2_closed+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+table_data_issue(summary_response["A2R"],2,'RL','A')+'</td>\
                    <td>'+table_data_issue(summary_response["B2R"],2,'RL','B')+'</td>\
                    <td>'+table_data_issue(summary_response["C2R"],2,'RL','C')+'</td>\
                    <td>'+table_data_issue(summary_response["D2R"],2,'RL','D')+'</td>\
                    <td>'+table_data_issue(summary_response["E2R"],2,'RL','E')+'</td>\
                    <td>'+total_itr2_resolved+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+table_data_issue(summary_response["A2IP"],2,'IP','A')+'</td>\
                    <td>'+table_data_issue(summary_response["B2IP"],2,'IP','B')+'</td>\
                    <td>'+table_data_issue(summary_response["C2IP"],2,'IP','C')+'</td>\
                    <td>'+table_data_issue(summary_response["D2IP"],2,'IP','D')+'</td>\
                    <td>'+table_data_issue(summary_response["E2IP"],2,'IP','E')+'</td>\
                    <td>'+total_itr2_inprogress+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+table_data_issue(summary_response["A2RO"],2,'RO','A')+'</td>\
                    <td>'+table_data_issue(summary_response["B2RO"],2,'RO','B')+'</td>\
                    <td>'+table_data_issue(summary_response["C2RO"],2,'RO','C')+'</td>\
                    <td>'+table_data_issue(summary_response["D2RO"],2,'RO','D')+'</td>\
                    <td>'+table_data_issue(summary_response["E2RO"],2,'RO','E')+'</td>\
                    <td>'+total_itr2_reopened+'</td>\
                    <tr class="highlight-row-sub">\
                    <td>'+table_data_issue(summary_response["A2O"],2,'OP','A')+'</td>\
                    <td>'+table_data_issue(summary_response["B2O"],2,'OP','B')+'</td>\
                    <td>'+table_data_issue(summary_response["C2O"],2,'OP','C')+'</td>\
                    <td>'+table_data_issue(summary_response["D2O"],2,'OP','D')+'</td>\
                    <td>'+table_data_issue(summary_response["E2O"],2,'OP','E')+'</td>\
                    <td>'+total_itr2_opened+'</td>\
                    </tr>\
                    </tr>\
                    </table>\
                    </td>\
                    \
                    <td>\
                    <table class="table col-md-4">\
                    <th id="table-total" colspan=6>Total (ITR1 + ITR2)</th>\
                        <tr>\
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                    <td>'+(summary_response["A1"] + summary_response["A2"])+'</td>\
                    <td>'+(summary_response["B1"] + summary_response["B2"])+'</td>\
                    <td>'+(summary_response["C1"] + summary_response["C2"])+'</td>\
                    <td>'+(summary_response["D1"] + summary_response["D2"])+'</td>\
                    <td>'+(summary_response["E1"] + summary_response["E2"])+'</td>\
                    <td>'+(total_itr1_issues + total_itr2_issues)+'</td>\
                    </tr>\
                    <tr class="highlight-row">\
                    <td>'+(summary_response["A1C"] + summary_response["A2C"])+'</td>\
                    <td>'+(summary_response["B1C"] + summary_response["B2C"])+'</td>\
                    <td>'+(summary_response["C1C"] + summary_response["C2C"])+'</td>\
                    <td>'+(summary_response["D1C"] + summary_response["D2C"])+'</td>\
                    <td>'+(summary_response["E1C"] + summary_response["E2C"])+'</td>\
                    <td>'+(total_itr1_closed + total_itr2_closed)+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+(summary_response["A1R"] + summary_response["A2R"])+'</td>\
                    <td>'+(summary_response["B1R"] + summary_response["B2R"])+'</td>\
                    <td>'+(summary_response["C1R"] + summary_response["C2R"])+'</td>\
                    <td>'+(summary_response["D1R"] + summary_response["D2R"])+'</td>\
                    <td>'+(summary_response["E1R"] + summary_response["E2R"])+'</td>\
                    <td>'+(total_itr1_resolved + total_itr2_resolved)+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+(summary_response["A1IP"] + summary_response["A2IP"])+'</td>\
                    <td>'+(summary_response["B1IP"] + summary_response["B2IP"])+'</td>\
                    <td>'+(summary_response["C1IP"] + summary_response["C2IP"])+'</td>\
                    <td>'+(summary_response["D1IP"] + summary_response["D2IP"])+'</td>\
                    <td>'+(summary_response["E1IP"] + summary_response["E2IP"])+'</td>\
                    <td>'+(total_itr1_inprogress + total_itr2_inprogress)+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+(summary_response["A1RO"] + summary_response["A2RO"])+'</td>\
                    <td>'+(summary_response["B1RO"] + summary_response["B2RO"])+'</td>\
                    <td>'+(summary_response["C1RO"] + summary_response["C2RO"])+'</td>\
                    <td>'+(summary_response["D1RO"] + summary_response["D2RO"])+'</td>\
                    <td>'+(summary_response["E1RO"] + summary_response["E2RO"])+'</td>\
                    <td>'+(total_itr1_reopened + total_itr2_reopened)+'</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>'+(summary_response["A1O"] + summary_response["A2O"])+'</td>\
                    <td>'+(summary_response["B1O"] + summary_response["B2O"])+'</td>\
                    <td>'+(summary_response["C1O"] + summary_response["C2O"])+'</td>\
                    <td>'+(summary_response["D1O"] + summary_response["D2O"])+'</td>\
                    <td>'+(summary_response["E1O"] + summary_response["E2O"])+'</td>\
                    <td>'+(total_itr1_opened + total_itr2_opened)+'</td>\
                    </tr>\
                    </table>\
                <td>\
                </tr>\
                </table>');
            }
        }); // ajax function ends here

    });



}); // document ready function closed here
