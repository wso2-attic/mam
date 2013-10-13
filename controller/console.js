var dashboard = function(appController){
	context = appController.context();
	context.title = context.ui.TITLE + " | Dashboard";	
	context.jsFile= "console_dashboard.js";
	context.page = "dashboard";
	context.data = {		
	}
	return context;
}