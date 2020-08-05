var operador;
var method;
var porta;
var url;
var servidor_atual;
var servidor_rest;
var servidor_rest_sem_porta;

$(document).ready(function(){
    porta = "8073";
    url = new URL(window.location.href);
    servidor_atual = url["origin"];
    servidor_rest_sem_porta = servidor_atual.substring(0, servidor_atual.indexOf(":",6))
    servidor_rest = servidor_atual.substring(0, servidor_atual.indexOf(":",6)) + ":" + porta;

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

    $( "#dataTable" ).on( "click", ".delOperador", function() {
        operador = ($(this).attr('id')).split("|");
        conteudo = "Operador: " + operador[1] + ".<BR>" +
                    "Ramal: " + operador[3] + "."
        $("#modalBody").html(conteudo);
    });

    $( "#dataTable" ).on( "click", ".editOperador", function() {
        method = "edit";
        operador = ($(this).attr('id')).split("|");
        $(".titleModal").html("Editar");
        $("#btnOK").html("Salvar");
        $("#txOperador").val(operador[1]);
        $("#txLoginOperador").val(operador[2]);
        $("#txRamal").val(operador[3]);
        $("#txDepartamento").val(operador[4]);
    });

    $( ".addOperador" ).on( "click", function() {
        method = "create";
        $(".titleModal").html("Adicionar");
        $("#btnOK").html("Adicionar");

        $("#txOperador").val("");
        $("#txLoginOperador").val("");
        $("#txRamal").val("");
        $("#txDepartamento").val("");
    });

    $( ".delOperador" ).on( "click", function() {
        method = "delete";
    });    

    $( "#btnOK,#btnDelete" ).on( "click", function() {
        var tipo;

        if(method == "create"){
            tipo = 'POST';
            conteudo = JSON.stringify( 
                { 
                    "operador": $("#txOperador").val(),
                    "ramal": $("#txRamal").val(),
                    "login": $("#txLoginOperador").val(),
                    "departamento": $("#txDepartamento").val()
                }
              );
        }else if(method == "edit"){
            tipo = 'PUT';
            conteudo = JSON.stringify( 
                { 
                    "id": operador[0],
                    "operador": $("#txOperador").val(),
                    "ramal": $("#txRamal").val(),
                    "login": $("#txLoginOperador").val(),
                    "departamento": $("#txDepartamento").val()
                }
              );
        }else if(method == "delete"){
            tipo = 'DELETE';
            conteudo = JSON.stringify( 
                { 
                    "id": operador[0]
                }
              );
        }

        $.ajax({
            cache: false,
            url: servidor_rest + "/operadores?API_KEY="+$("#API_KEY").val(),
            type: tipo,
            crossDomain: true,
            dataType: "json",
            data: conteudo,
            success: function(data) {
                if(data["error"] != undefined) {
                    toastr.error(data["error"]);
                }else if(data["result"] != undefined) {
                    toastr.success(data["result"]);
                    location.reload();
                }
            }
        });
    });


    $( ".btnCall" ).on( "click", function() {
        idVerba = $(this).attr('id');
    });


});