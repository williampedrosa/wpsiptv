var monitor;
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

    $( "#dataTable" ).on( "click", ".delMonitor", function() {
        method = "delete";
        monitor = ($(this).attr('id')).split("|");
        conteudo = "Monitor: " + monitor[1] + "."
        $("#modalBody").html(conteudo);
    });

    $( "#dataTable" ).on( "click", ".editMonitor", function() {
        method = "edit";
        monitor = ($(this).attr('id')).split("|");
        $(".titleModal").html("Editar");
        $("#btnOK").html("Salvar");
        $("#txNome").val(monitor[1]);
        $("#txLoginMonitor").val(monitor[2]);
        $("#txDataInicio").val(monitor[3]);
        $("#txDataFim").val(monitor[4]);
        $("#slSupervisor").html("");

        $.ajax({
            cache: false,
            url: servidor_rest + "/supervisores?API_KEY="+$("#API_KEY").val(),
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                data.forEach(function(item) {
                    if(monitor[5] == item.ID) {
                        $("#slSupervisor").append("<option value='"+item.ID+"' SELECTED>"+item.NOME+"</option>");
                    }else{
                        $("#slSupervisor").append("<option value='"+item.ID+"'>"+item.NOME+"</option>");
                    }
                });
            }
        });
    });

    $( ".addMonitor" ).on( "click", function() {
        method = "create";
        $(".titleModal").html("Adicionar");
        $("#btnOK").html("Adicionar");

        $("#txNome").val("");
        $("#txLoginMonitor").val("");
        $("#txDepartamento").val("");
        $("#txDataInicio").val("");
        $("#txDataFim").val("");
        $("#slSupervisor").html("<option value=''>Selecione...</option>");

        $.ajax({
            cache: false,
            url: servidor_rest + "/supervisores?API_KEY="+$("#API_KEY").val(),
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                data.forEach(function(item) {
                    $("#slSupervisor").append("<option value='"+item.ID+"'>"+item.NOME+"</option>");
                });
            }
        });
    });   

    $( "#btnOK,#btnDelete" ).on( "click", function() {
        var tipo;

        if(method == "create"){
            tipo = 'POST';
            conteudo = JSON.stringify( 
                { 
                    "nome": $("#txNome").val(),
                    "login": $("#txLoginMonitor").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val(),
                    "id_supervisor": $("#slSupervisor").val()
                }
              );
        }else if(method == "edit"){
            tipo = 'PUT';
            conteudo = JSON.stringify( 
                { 
                    "id": monitor[0],
                    "nome": $("#txNome").val(),
                    "login": $("#txLoginMonitor").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val(),
                    "id_supervisor": $("#slSupervisor").val()
                }
              );
        }else if(method == "delete"){
            tipo = 'DELETE';
            conteudo = JSON.stringify( 
                { 
                    "id": monitor[0]
                }
              );
        }

        $.ajax({
            cache: false,
            url: servidor_rest + "/monitores?API_KEY="+$("#API_KEY").val(),
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