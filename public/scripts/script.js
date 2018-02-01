//clicking on list item disables it
$(".to-do").on("click", ".to-do-item", function(){
	$(this).toggleClass("to-do-done");
});

//clicking on trashcan deletes corresponding list element
$(".to-do").on("click", ".to-do-delete", function(event){
	$(this).parent().fadeOut(200, function () {
		$(this).remove();
	});
	event.stopPropagation();
});


//clicking on bars moves li up or down
$( ".sortable" ).sortable({ 
	handle: '.handle', 
	cursor: 'move', 
	opacity: 0.5
});
$( ".sortable" ).disableSelection();

//add new item to list
$("input.to-do-add[type='text']").on("keypress", function (event) {
	if ( event.which == 13 && $(this).val() != "" ) { //after user hit Enter and if input value is not empty
		var newTask = $(this).val();
		$("ul.list-group").append(`
			<li class="list-group-item d-flex align-items-center to-do-item ui-state-default">
				<i class="fa fa-bars p-2 handle" aria-hidden="true"></i>
				<span class="p-2">${newTask}</span>
				<i class="fa fa-trash ml-auto px-3 to-do-delete align-self-stretch" aria-hidden="true"></i>
			</li>
		`); //ES6
		
		$(this).val("");
	}
});

$(".fa-pencil").on("click", function () {
	$("input.to-do-add[type='text']").fadeToggle();
});