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

//fix for Safari - does not support input type="date"
if ( $('[type="date"]').prop('type') != 'date' ) {
    $('[type="date"]').datepicker();
}