$("#btn-add").click(function() {
	
	$( 'form').parsley( 'validate' );	
	if(!$('form').parsley('isValid')){
		noty({
				text : 'Input validation failed!',
				'layout' : 'center',
				'type' : 'error'
		});		
		return;
	}
	

	var name = $('#inputName').val();
	var type = $('#inputType').val();
	var users = $('#inputUsers').val();
	var tenantId = $('#tenantId').val();

	var usersArray = []
	if (users != null) {
		usersArray = users.toString().split(",");
	}
	// alert(JSON.stringify(userGroupsArray));
	jso = {
		"tenant_id" : tenantId,
		"name" : name,
		"type" : type,
		"users" : usersArray
	};

	

	jQuery.ajax({
		url : getServiceURLs("groupsCRUD", ""),
		type : "POST",		
		data : JSON.stringify(jso),
		contentType : "application/json",
     	dataType : "json",
     	statusCode: {
			400: function() {
				noty({
					text : 'Error occured!',
					'layout' : 'center',
					'type': 'error'
				});
			},
			404: function() {
				noty({
					text : 'API not found!',
					'layout' : 'center',
					'type': 'error'
				});
			},
			500: function() {
				noty({
					text : 'Fatal error occured!',
					'layout' : 'center',
					'type': 'error'
				});
			},
			201: function() {
				noty({
					text : 'Group Added successfully!',
					'layout' : 'center'
				});
				window.location.assign("configuration");
			},
			409: function() {
				noty({
					text : 'Group already exist!',
					'layout' : 'center',
					'type': 'error'
				});				
			}
		}			
	});
	
	
	

});



$( document ).ready(function() {
	
     
    
     
     
     jQuery.ajax({
				url : "/mam/api/apps",
				type : "GET",
				dataType : "json",		
			}).done(function(data) {
				for(i = 0; i < data.length; i++){
					data[i].name = data[i].attributes.overview_name;
				}
				
								
					$('#ms6').magicSuggest({
		    width: 590,
		    highlight: false,
		    data: data,
		    renderer: function(v){
		    return '<div>' +
		        '<div style="float:left;"><img style="width: 50px" src="' + v.attributes.images_thumbnail + '"/></div>' +
		        '<div style="padding-left: 85px;">' +
		            '<div style="padding-top: 20px;font-style:bold;font-size:120%;color:#333">' + v.attributes.overview_name + '</div>' +
		            '<div style="color: #999">' + v.attributes.overview_name + '</div>' +
		            '</div>' +
		        '</div><div style="clear:both;"></div>';
		    }
		});
	});
     
     
     
});