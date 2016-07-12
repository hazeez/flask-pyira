// document.on function is used here as the ajax call will only fire on DOM that has been generated during the time of document.ready function. It will not fire on DOM elements generated asynchronously. w
$(document).on('click', 'a.dashboard-issue-link', function(event){
	// function to populate the list of issues when a link is clicked in the dashboard
	event.preventDefault();
	$.ajax({
		url: $(this).attr('href'),
		success: function(list_of_issues){
			alert(list_of_issues);
		}
	}); // end of ajax function
	return false;
});