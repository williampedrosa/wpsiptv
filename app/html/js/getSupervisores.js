var supervisor;
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

    $( "#dataTable" ).on( "click", ".delSupervisor", function() {
        method = "delete";
        supervisor = ($(this).attr('id')).split("|");
        conteudo = "Supervisor: " + supervisor[1] + "."
        $("#modalBody").html(conteudo);
    });

    $( "#dataTable" ).on( "click", ".editSupervisor", function() {
        method = "edit";
        supervisor = ($(this).attr('id')).split("|");
        $(".titleModal").html("Editar");
        $("#btnOK").html("Salvar");
        $("#txNome").val(supervisor[1]);
        $("#txLoginSupervisor").val(supervisor[2]);
        $("#txDataInicio").val(supervisor[3]);
        $("#txDataFim").val(supervisor[4]);
    });

    $( ".addSupervisor" ).on( "click", function() {
        method = "create";
        $(".titleModal").html("Adicionar");
        $("#btnOK").html("Adicionar");

        $("#txNome").val("");
        $("#txLoginSupervisor").val("");
        $("#txDepartamento").val("");
        $("#txDataInicio").val("");
        $("#txDataFim").val("");
    });   

    $( "#btnOK,#btnDelete" ).on( "click", function() {
        var tipo;

        if(method == "create"){
            tipo = 'POST';
            conteudo = JSON.stringify( 
                { 
                    "nome": $("#txNome").val(),
                    "login": $("#txLoginSupervisor").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val()
                }
              );
        }else if(method == "edit"){
            tipo = 'PUT';
            conteudo = JSON.stringify( 
                { 
                    "id": supervisor[0],
                    "nome": $("#txNome").val(),
                    "login": $("#txLoginSupervisor").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val()
                }
              );
        }else if(method == "delete"){
            tipo = 'DELETE';
            conteudo = JSON.stringify( 
                { 
                    "id": supervisor[0]
                }
              );
        }

        $.ajax({
            cache: false,
            url: servidor_rest + "/supervisores?API_KEY="+$("#API_KEY").val(),
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


});