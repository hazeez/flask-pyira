// document.on function is used here as the ajax call will only fire on DOM that has been generated during the time of document.ready function. It will not fire on DOM elements generated asynchronously. w
$(document).ready(function() {
    $("#issue-detail").hide();
    $("#issue-listing").hide();
    $('#issue-listing').html('');

});

$(document).on('click', 'a.dashboard-issue-link', function(event) {
    // function to populate the list of issues when a link is clicked in the dashboard

    event.preventDefault();
    // get the url last part - issue code
    var issueUrl = $(this).attr('href');
    var issueTitleKey = issueUrl.split("/");
    // this would return something like C$1&RL
    var issueTitleKey = issueTitleKey[issueTitleKey.length - 1];
    var project_url = $("#project-dashboard-link").attr('href')
        // this would return the project key from the url
    var project_name = project_url.split("/")[2]
    // add a class to the selected element for highlighing
    $("td").removeClass("selected");
    $(this).parent().addClass("selected");

    $("#issue-detail").show();
    $("#issue-listing").show();
    $.ajax({
        url: $(this).attr('href'),
        success: function(list_of_issues) {
            // clear the div element first
            $("ul.nav.nav-pills li").removeClass("active");
            //add logic here - if the nav pill has been already added to the DOM then don't add it again, instead maake the corresponding nav pill active
            var divInDOM = $("div#issue-detail").find("div[id='" + issueTitleKey + "']");
            if (divInDOM.length != 0) {
                console.log(issueTitleKey);
                $("ul.nav.nav-pills li").removeClass("active");
                $("[nav-key='"+ issueTitleKey +"']").addClass("active");
                $('#issue-listing div').removeClass('active');
                $("div[id='" + issueTitleKey + "']").addClass("active");
            } else {
                $('ul.nav.nav-pills').append('<li class=active nav-key=' + issueTitleKey + '> <a data-toggle=tab href=#' + issueTitleKey + '>' + issueTitleKey + '</a></li>')
                $('#issue-listing div').removeClass('active');
                $('#issue-listing').append("<div id='" + issueTitleKey + "' class='tab-pane fade in active'></div>");

                for (var issueKey in list_of_issues) {
                    if (list_of_issues.hasOwnProperty(issueKey)) {
                        $("div[id='" + issueTitleKey + "']").append("<li><a  class='issue-detail list-group-item' href='/index/" + project_name + "/" + list_of_issues[issueKey] + "'>" + list_of_issues[issueKey] + "</a></li>");
                    }
                }
            }
        }
    }); // end of ajax function
    return false;
});

$(document).on('click', 'ul.nav.nav-pills li', function(event) {
    $("ul.nav.nav-pills li").removeClass("active");
    $(this).addClass("active");
    // find the href of the nav pill and add the active class
    var hrefDiv = $(this).find("a").attr('href');
    $('#issue-listing div').removeClass('active');
    var actualHrefDiv = hrefDiv.split("#")[1];
    $("div[id='" + actualHrefDiv + "']").addClass("active");
    // the following code highlights the corresponding td element
    $("td").removeClass("selected");
    $("td").find("[data-key='"+ actualHrefDiv+"']").addClass("selected");
});
