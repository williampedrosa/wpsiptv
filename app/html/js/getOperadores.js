var Operador;
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
        method = "delete";
        Operador = ($(this).attr('id')).split("|");
        conteudo = "Operador: " + Operador[1] + "."
        $("#modalBody").html(conteudo);
    });

    $( "#dataTable" ).on( "click", ".editOperador", function() {
        method = "edit";
        Operador = ($(this).attr('id')).split("|");
        $(".titleModal").html("Editar");
        $("#btnOK").html("Salvar");
        $("#txNome").val(Operador[1]);
        $("#txApelido").val(Operador[6]);
        $("#txLoginOperador").val(Operador[2]);
        $("#txDataInicio").val(Operador[3]);
        $("#txDataFim").val(Operador[4]);
        $("#slMonitor").html("");
        $("#slTipoAtendimento").html("");
        $("#slTipoAtendimento").append("<option value='Externo' "+(Operador[7] === "Externo" ? "selected" : "")+">Externo</option>");
        $("#slTipoAtendimento").append("<option value='Interno' "+(Operador[7] === "Interno" ? "selected" : "")+">Interno</option>");

        $.ajax({
            cache: false,
            url: servidor_rest + "/monitores?API_KEY="+$("#API_KEY").val(),
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                data.forEach(function(item) {
                    if(Operador[5] == item.ID) {
                        $("#slMonitor").append("<option value='"+item.ID+"' SELECTED>"+item.NOME+"</option>");
                    }else{
                        $("#slMonitor").append("<option value='"+item.ID+"'>"+item.NOME+"</option>");
                    }
                });
            }
        });
    });

    $( ".addOperador" ).on( "click", function() {
        method = "create";
        $(".titleModal").html("Adicionar");
        $("#btnOK").html("Adicionar");

        $("#txNome").val("");
        $("#txApelido").val("");
        $("#txLoginOperador").val("");
        $("#txDepartamento").val("");
        $("#txDataInicio").val("");
        $("#txDataFim").val("");
        $("#slMonitor").html("<option value=''>Selecione...</option>");
        $("#slTipoAtendimento").html("");
        $("#slTipoAtendimento").append("<option value=''>Selecione...</option>");
        $("#slTipoAtendimento").append("<option value='Externo'>Externo</option>");
        $("#slTipoAtendimento").append("<option value='Interno'>Interno</option>");

        

        $.ajax({
            cache: false,
            url: servidor_rest + "/monitores?API_KEY="+$("#API_KEY").val(),
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                data.forEach(function(item) {
                    $("#slMonitor").append("<option value='"+item.ID+"'>"+item.NOME+"</option>");
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
                    "apelido": $("#txApelido").val(),
                    "login": $("#txLoginOperador").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val(),
                    "id_monitor": $("#slMonitor").val(),
                    "tipo_atendimento": $("#slTipoAtendimento").val()
                }
              );
        }else if(method == "edit"){
            tipo = 'PUT';
            conteudo = JSON.stringify( 
                { 
                    "id": Operador[0],
                    "nome": $("#txNome").val(),
                    "apelido": $("#txApelido").val(),
                    "login": $("#txLoginOperador").val(),
                    "data_inicio": $("#txDataInicio").val(),
                    "data_fim": $("#txDataFim").val(),
                    "id_monitor": $("#slMonitor").val(),
                    "tipo_atendimento": $("#slTipoAtendimento").val()
                }
              );
        }else if(method == "delete"){
            tipo = 'DELETE';
            conteudo = JSON.stringify( 
                { 
                    "id": Operador[0]
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





});