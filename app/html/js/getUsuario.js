var usuario;
var method;
var porta;
var url;
var servidor_atual;
var servidor_rest;

$(document).ready(function(){
    porta = "8073";
    url = new URL(window.location.href);
    servidor_atual = url["origin"];
    servidor_rest = servidor_atual.substring(0, servidor_atual.indexOf(":",6)) + ":" + porta;

    $( ".delUsuario" ).on( "click", function() {
        usuario = ($(this).attr('id')).split("|");
        conteudo = "Usuario: " + usuario[1] + ".<BR>" +
                    "Login: " + usuario[2] + "."
        $("#modalBody").html(conteudo);
    });

    $("#txLoginUsuario").on("input", function(){
        $("#txUsuario").val('');
    });

    $( ".addUsuario" ).on( "click", function() {
        method = "create";
        $(".titleModal").html("Adicionar");
        $("#btnOK").html("Adicionar");

        $("#txUsuario").val("");
        $("#txLoginUsuario").val("");
        $("#txRamal").val("");
    });

    $( ".delUsuario" ).on( "click", function() {
        method = "delete";
    });

    $( "#btnSearchUsuario" ).on( "click", function() {

        $.ajax({
            cache: false,
            url: servidor_rest + "/info_user?API_KEY="+$("#API_KEY").val()+"&search_login="+$("#txLoginUsuario").val(),
            type: "GET",
            crossDomain: true,
            dataType: "json",
            data: null,
            success: function(data) {
                if(data["error"] != undefined) {
                    toastr.error(data["error"]);
                }else{
                    $("#txUsuario").val(data["FUNC_NOME"]);
                }
            }
        });

    });    

    $( "#btnOK,#btnDelete" ).on( "click", function() {
        var tipo;

        if(method == "create"){
            tipo = 'POST';
            conteudo = JSON.stringify( 
                { 
                    "nome": $("#txUsuario").val(),
                    "login": $("#txLoginUsuario").val(),
                    "id_tipousuario": $("#TipoUsuario").val(),
                    "p_cadastrar": $("#permitirCadastrar").prop("checked")
                }
              );
        }else if(method == "edit"){
            tipo = 'PUT';
            conteudo = JSON.stringify( 
                { 
                    "id": usuario[0],
                    "nome": $("#txUsuario").val(),
                    "login": $("#txLoginUsuario").val(),
                    "id_tipousuario": $("#TipoUsuario").val(),
                    "p_cadastrar": $("#permitirCadastrar").prop("checked")
                }
              );
        }else if(method == "delete"){
            tipo = 'DELETE';
            conteudo = JSON.stringify( 
                { 
                    "id": usuario[0]
                }
              );
        }

        $.ajax({
            cache: false,
            url: servidor_rest + "/usuarios?API_KEY="+$("#API_KEY").val(),
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
