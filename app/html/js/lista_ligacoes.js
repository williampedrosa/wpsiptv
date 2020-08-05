$(document).ready(function(){
    var table = $('#dataTable').DataTable( {
        buttons: [ 'copy', 'excel', {extend: 'pdfHtml5',download: 'open'}, 'print' ]
    } );
 
    table.buttons().container()
        .appendTo( '.btnExport:eq(0)' );
    
    $( ".btnCopy" ).on( "click", function() {
        $( ".buttons-copy" ).click()
    });
    $( ".btnExcel" ).on( "click", function() {
        $( ".buttons-excel" ).click()
    });
    $( ".btnPDF" ).on( "click", function() {
        $( ".buttons-pdf" ).click()
    });
    $( ".btnPrint" ).on( "click", function() {
        $( ".buttons-print" ).click()
    });

});