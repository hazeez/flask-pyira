$body = $("body");

$(document).on({
    ajaxStart: function() {
        $body.addClass("loading");
    },
    ajaxStop: function() {
        $body.removeClass("loading");
    }
});


// adjust the window size every time the browser height changes
$(window).resize(function() {
    // 93 px is the height of the top bar and the projects title
    var windowHeight = $(window).height() - 93;
    $("#project-group").css("height", windowHeight);
    $("#issue-group").css("height", windowHeight);
    // setting the height of the issue listing div
    var issueListingDivHeight = windowHeight - 338;
    $("#issue-listing").css("height", issueListingDivHeight);
});


$(document).ready(function() {
    var project_name = '';
    var windowHeight = $(window).height() - 93

    $("#project-group").css("height", windowHeight);
    $("#issue-group").css("height", windowHeight);
    var issueListingDivHeight = windowHeight - 338;
    $("#issue-listing").css("height", issueListingDivHeight);
    $('#project-dashboard-link').hide();
    $('div#issue-listing').hide();

    $('a.project').click(function(event) {
        event.preventDefault();
        $("a.project.list-group-item.active").removeClass("active");
        $(this).addClass('active');
        // clear the html for the current project
        $('div#dashboard-summary').html('');
        $('ul.nav.nav-tabs').html('');
        $('ul.nav.nav-tabs').hide('');
        $('div#issue-listing').html('');
        $('#project-dashboard-link').hide();
        var totalpages = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(issuedata) {
                // if the issues are present then show the dashboard link
                $('#issue-title').show();
                $('#issue-group').show();
                $('#project-dashboard-link').show();
                $('div#issue-listing').hide();
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
                $('#project-dashboard-link').attr('href', '/index/' + project_name + '/dashboard');
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
    function table_data_issue(issue_count, itr_round, status, type) {
        if (issue_count == 0) {
            return '<span class=zero>' + issue_count + '</span>'
        } else {
            return '<a class="dashboard-issue-link" href=/index/dashboard/issuesummary/' + type + '$' + itr_round + '&' + status + '>' + issue_count + '</a>'
        }
    };

    // function to generate dashboard via ajax when clicking the generate dashboard link
    $('a#project-dashboard-link').click(function(event) {
        $('#issue-listing').html(''); 
        $('div#issue-listing').hide();
        $("ul.nav.nav-tabs").html('');
        event.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            // success: function (summary_response, itr2_response) {
            success: function(summary_response) {
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
               <td class="table-top">\
                   <table class="table col-md-4">\
                   <th class=blank-table-header></th>\
                    <th id="table-itr1" class="table-heading" colspan=6>ITR1</th>\
                        <tr>\
                            <td class="description"><strong>Issues</strong></td> \
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                        <td class="description"><strong>[TO] Total</strong></td>\
                        <td>' + summary_response["A1"] + '</td>\
                        <td>' + summary_response["B1"] + '</td>\
                        <td>' + summary_response["C1"] + '</td>\
                        <td>' + summary_response["D1"] + '</td>\
                        <td>' + summary_response["E1"] + '</td>\
                        <td>' + total_itr1_issues + '</td>\
                    </tr>\
                    <tr class="highlight-row">\
                        <td class="description"><strong>[CL] Closed</strong></td>\
                        <td data-key=A$1&CL>' + table_data_issue(summary_response["A1C"], 1, 'CL', 'A') + '</td>\
                        <td data-key=B$1&CL>' + table_data_issue(summary_response["B1C"], 1, 'CL', 'B') + '</td>\
                        <td data-key=C$1&CL>' + table_data_issue(summary_response["C1C"], 1, 'CL', 'C') + '</td>\
                        <td data-key=D$1&CL >' + table_data_issue(summary_response["D1C"], 1, 'CL', 'D') + '</td>\
                        <td data-key=E$1&CL>' + table_data_issue(summary_response["E1C"], 1, 'CL', 'E') + '</td>\
                        <td>' + total_itr1_closed + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td class="description"><strong>[RL] Resolved</strong></td>\
                        <td data-key=A$1&RL>' + table_data_issue(summary_response["A1R"], 1, 'RL', 'A') + '</td>\
                        <td data-key=B$1&RL>' + table_data_issue(summary_response["B1R"], 1, 'RL', 'B') + '</td>\
                        <td data-key=C$1&RL >' + table_data_issue(summary_response["C1R"], 1, 'RL', 'C') + '</td>\
                        <td data-key=D$1&RL>' + table_data_issue(summary_response["D1R"], 1, 'RL', 'D') + '</td>\
                        <td data-key=E$1&RL>' + table_data_issue(summary_response["E1R"], 1, 'RL', 'E') + '</td>\
                        <td>' + total_itr1_resolved + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td class="description"><strong>[IP] InProgress</strong></td>\
                        <td data-key=A$1&IP>' + table_data_issue(summary_response["A1IP"], 1, 'IP', 'A') + '</td>\
                        <td data-key=B$1&IP>' + table_data_issue(summary_response["B1IP"], 1, 'IP', 'B') + '</td>\
                        <td data-key=C$1&IP>' + table_data_issue(summary_response["C1IP"], 1, 'IP', 'C') + '</td>\
                        <td data-key=D$1&IP>' + table_data_issue(summary_response["D1IP"], 1, 'IP', 'D') + '</td>\
                        <td data-key=E$1&IP>' + table_data_issue(summary_response["E1IP"], 1, 'IP', 'E') + '</td>\
                        <td>' + total_itr1_inprogress + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td class="description"><strong>[RO] ReOpened</strong></td>\
                        <td data-key=A$1&RO>' + table_data_issue(summary_response["A1RO"], 1, 'RO', 'A') + '</td>\
                        <td data-key=B$1&RO>' + table_data_issue(summary_response["B1RO"], 1, 'RO', 'B') + '</td>\
                        <td data-key=C$1&RO>' + table_data_issue(summary_response["C1RO"], 1, 'RO', 'C') + '</td>\
                        <td data-key=D$1&RO>' + table_data_issue(summary_response["D1RO"], 1, 'RO', 'D') + '</td>\
                        <td data-key=E$1&RO>' + table_data_issue(summary_response["E1RO"], 1, 'RO', 'E') + '</td>\
                        <td>' + total_itr1_reopened + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                        <td class="description"><strong>[OP] Open</strong></td>\
                        <td data-key=A$1&OP>' + table_data_issue(summary_response["A1O"], 1, 'OP', 'A') + '</td>\
                        <td data-key=A$1&OP>' + table_data_issue(summary_response["B1O"], 1, 'OP', 'B') + '</td>\
                        <td data-key=A$1&OP>' + table_data_issue(summary_response["C1O"], 1, 'OP', 'C') + '</td>\
                        <td data-key=A$1&OP>' + table_data_issue(summary_response["D1O"], 1, 'OP', 'D') + '</td>\
                        <td data-key=A$1&OP>' + table_data_issue(summary_response["E1O"], 1, 'OP', 'E') + '</td>\
                        <td>' + total_itr1_opened + '</td>\
                    </tr>\
                    </table>\
                    </td>\
                \
                    <td class="table-top">\
                    <table class="table col-md-4">\
                    <th id="table-itr2" class="table-heading" colspan=6>ITR2</th>\
                        <tr>\
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                    <td>' + summary_response["A2"] + '</td>\
                    <td>' + summary_response["B2"] + '</td>\
                    <td>' + summary_response["C2"] + '</td>\
                    <td>' + summary_response["D2"] + '</td>\
                    <td>' + summary_response["E2"] + '</td>\
                    <td>' + total_itr2_issues + '</td>\
                    </tr>\
                    <tr class="highlight-row">\
                    <td data-key=A$2&CL>' + table_data_issue(summary_response["A2C"], 2, 'CL', 'A') + '</td>\
                    <td data-key=B$2&CL>' + table_data_issue(summary_response["B2C"], 2, 'CL', 'B') + '</td>\
                    <td data-key=C$2&CL>' + table_data_issue(summary_response["C2C"], 2, 'CL', 'C') + '</td>\
                    <td data-key=D$2&CL>' + table_data_issue(summary_response["D2C"], 2, 'CL', 'D') + '</td>\
                    <td data-key=E$2&CL>' + table_data_issue(summary_response["E2C"], 2, 'CL', 'E') + '</td>\
                    <td>' + total_itr2_closed + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td data-key=A$2&RL>' + table_data_issue(summary_response["A2R"], 2, 'RL', 'A') + '</td>\
                    <td data-key=B$2&RL>' + table_data_issue(summary_response["B2R"], 2, 'RL', 'B') + '</td>\
                    <td data-key=C$2&RL>' + table_data_issue(summary_response["C2R"], 2, 'RL', 'C') + '</td>\
                    <td data-key=D$2&RL>' + table_data_issue(summary_response["D2R"], 2, 'RL', 'D') + '</td>\
                    <td data-key=E$2&RL>' + table_data_issue(summary_response["E2R"], 2, 'RL', 'E') + '</td>\
                    <td>' + total_itr2_resolved + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td data-key=A$2&IP>' + table_data_issue(summary_response["A2IP"], 2, 'IP', 'A') + '</td>\
                    <td data-key=B$2&IP>' + table_data_issue(summary_response["B2IP"], 2, 'IP', 'B') + '</td>\
                    <td data-key=C$2&IP>' + table_data_issue(summary_response["C2IP"], 2, 'IP', 'C') + '</td>\
                    <td data-key=D$2&IP>' + table_data_issue(summary_response["D2IP"], 2, 'IP', 'D') + '</td>\
                    <td data-key=E$2&IP>' + table_data_issue(summary_response["E2IP"], 2, 'IP', 'E') + '</td>\
                    <td>' + total_itr2_inprogress + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td data-key=A$2&RO>' + table_data_issue(summary_response["A2RO"], 2, 'RO', 'A') + '</td>\
                    <td data-key=B$2&RO>' + table_data_issue(summary_response["B2RO"], 2, 'RO', 'B') + '</td>\
                    <td data-key=C$2&RO>' + table_data_issue(summary_response["C2RO"], 2, 'RO', 'C') + '</td>\
                    <td data-key=D$2&RO>' + table_data_issue(summary_response["D2RO"], 2, 'RO', 'D') + '</td>\
                    <td data-key=E$2&RO>' + table_data_issue(summary_response["E2RO"], 2, 'RO', 'E') + '</td>\
                    <td>' + total_itr2_reopened + '</td>\
                    <tr class="highlight-row-sub">\
                    <td data-key=A$2&OP>' + table_data_issue(summary_response["A2O"], 2, 'OP', 'A') + '</td>\
                    <td data-key=B$2&OP>' + table_data_issue(summary_response["B2O"], 2, 'OP', 'B') + '</td>\
                    <td data-key=C$2&OP>' + table_data_issue(summary_response["C2O"], 2, 'OP', 'C') + '</td>\
                    <td data-key=D$2&OP>' + table_data_issue(summary_response["D2O"], 2, 'OP', 'D') + '</td>\
                    <td data-key=E$2&OP>' + table_data_issue(summary_response["E2O"], 2, 'OP', 'E') + '</td>\
                    <td>' + total_itr2_opened + '</td>\
                    </tr>\
                    </tr>\
                    </table>\
                    </td>\
                    \
                    <td class="table-top">\
                    <table class="table col-md-4">\
                    <th id="table-total" class="table-heading" colspan=6>Total (ITR1 + ITR2)</th>\
                        <tr>\
                            <td>A</td> \
                            <td>B</td> \
                            <td>C</td> \
                            <td>D</td> \
                            <td>E</td> \
                            <td>Total</td> \
                        </tr>\
                    <tr>\
                    <td>' + (summary_response["A1"] + summary_response["A2"]) + '</td>\
                    <td>' + (summary_response["B1"] + summary_response["B2"]) + '</td>\
                    <td>' + (summary_response["C1"] + summary_response["C2"]) + '</td>\
                    <td>' + (summary_response["D1"] + summary_response["D2"]) + '</td>\
                    <td>' + (summary_response["E1"] + summary_response["E2"]) + '</td>\
                    <td>' + (total_itr1_issues + total_itr2_issues) + '</td>\
                    </tr>\
                    <tr class="highlight-row">\
                    <td>' + (summary_response["A1C"] + summary_response["A2C"]) + '</td>\
                    <td>' + (summary_response["B1C"] + summary_response["B2C"]) + '</td>\
                    <td>' + (summary_response["C1C"] + summary_response["C2C"]) + '</td>\
                    <td>' + (summary_response["D1C"] + summary_response["D2C"]) + '</td>\
                    <td>' + (summary_response["E1C"] + summary_response["E2C"]) + '</td>\
                    <td>' + (total_itr1_closed + total_itr2_closed) + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>' + (summary_response["A1R"] + summary_response["A2R"]) + '</td>\
                    <td>' + (summary_response["B1R"] + summary_response["B2R"]) + '</td>\
                    <td>' + (summary_response["C1R"] + summary_response["C2R"]) + '</td>\
                    <td>' + (summary_response["D1R"] + summary_response["D2R"]) + '</td>\
                    <td>' + (summary_response["E1R"] + summary_response["E2R"]) + '</td>\
                    <td>' + (total_itr1_resolved + total_itr2_resolved) + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>' + (summary_response["A1IP"] + summary_response["A2IP"]) + '</td>\
                    <td>' + (summary_response["B1IP"] + summary_response["B2IP"]) + '</td>\
                    <td>' + (summary_response["C1IP"] + summary_response["C2IP"]) + '</td>\
                    <td>' + (summary_response["D1IP"] + summary_response["D2IP"]) + '</td>\
                    <td>' + (summary_response["E1IP"] + summary_response["E2IP"]) + '</td>\
                    <td>' + (total_itr1_inprogress + total_itr2_inprogress) + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>' + (summary_response["A1RO"] + summary_response["A2RO"]) + '</td>\
                    <td>' + (summary_response["B1RO"] + summary_response["B2RO"]) + '</td>\
                    <td>' + (summary_response["C1RO"] + summary_response["C2RO"]) + '</td>\
                    <td>' + (summary_response["D1RO"] + summary_response["D2RO"]) + '</td>\
                    <td>' + (summary_response["E1RO"] + summary_response["E2RO"]) + '</td>\
                    <td>' + (total_itr1_reopened + total_itr2_reopened) + '</td>\
                    </tr>\
                    <tr class="highlight-row-sub">\
                    <td>' + (summary_response["A1O"] + summary_response["A2O"]) + '</td>\
                    <td>' + (summary_response["B1O"] + summary_response["B2O"]) + '</td>\
                    <td>' + (summary_response["C1O"] + summary_response["C2O"]) + '</td>\
                    <td>' + (summary_response["D1O"] + summary_response["D2O"]) + '</td>\
                    <td>' + (summary_response["E1O"] + summary_response["E2O"]) + '</td>\
                    <td>' + (total_itr1_opened + total_itr2_opened) + '</td>\
                    </tr>\
                    </table>\
                </td>\
                </tr>\
                </table>');
            }
        }); // ajax function ends here

    });



}); // document ready function closed here
