//prevent cloud9 jQwery warnigns
/* global $ */

//clicking on bars moves li up or down - TODO: handle in db
$( ".sortable" ).sortable({ 
	handle: '.handle', 
	cursor: 'move', 
	opacity: 0.5
});

$( ".sortable" ).disableSelection();

$(".fa-pencil").on("click", function () {
	$("input.to-do-add[type='text']").fadeToggle();
});