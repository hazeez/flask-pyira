// document.on function is used here as the ajax call will only fire on DOM that has been generated during the time of document.ready function. It will not fire on DOM elements generated asynchronously. w
$(document).on('click', 'a.dashboard-issue-link', function(event){
	// function to populate the list of issues when a link is clicked in the dashboard
	event.preventDefault();
	// get the url last part - issue code
	var issueUrl = $(this).attr('href');
	var issueTitleKey = issueUrl.split("/");
	// this would return something like C$1&RL
	var issueTitleKey = issueTitleKey[issueTitleKey.length - 1];
	$.ajax({
		url: $(this).attr('href'),
		success: function(list_of_issues){
			// clear the div element first
			$('#issue-listing').html('');
			for (var issueKey in list_of_issues){
				if (list_of_issues.hasOwnProperty(issueKey)){
					$('#issue-listing').append('<li class=list-group-item>' + list_of_issues[issueKey] + '</li>');
				}
			}
		}
	}); // end of ajax function
	return false;
});