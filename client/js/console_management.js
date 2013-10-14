$(document).ready(function() {
	var oTable = $('.main-table').dataTable({
		"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
		"iDisplayLength" : 20,		
		"bStateSave" : false,
		"oTableTools" : {
			"aButtons" : ["copy", "print", {
				"sExtends" : "collection",
				"sButtonText" : 'Save <span class="caret" />',
				"aButtons" : ["csv", "xls", "pdf"]
			}]
		}
	});
	$('.app_box a').click(function(){
		$('.app_box a').removeClass('selected');
		$(this).addClass('selected');
		$(this).parent().css("cursor", "default");
		$(this).fadeTo("slow", 1);
		changeState();
	});
	var changeState = function(){
		$('.app_box a').not('.selected').each(function(){
			$(this).fadeTo("slow", 0.1);
		});
	}
});
