var json;
var funcionario;
var servidor_rest;
var atualizacaoForcado;

$(document).ready(function(){
    var porta = "8071";
    var url = new URL(window.location.href);
    var servidor_atual = url["origin"];
    servidor_rest = servidor_atual.substring(0, servidor_atual.length - 4) + porta;

    json = null;
    funcionario = null;
    $(".put-include-here").load("html/sidebar.html");
    $("html").show();
    getDados();
    setInterval(function(){ 
        getDados();
    }, 5000);
    setInterval(function(){ 
        $('#agendaBACEN').attr('src', $('iframe').attr('src'));
    }, 360*1000);


    $(".btnSalvar").click(function(){
        Array.prototype.clone = function(){
            return this.map(e => Array.isArray(e) ? e.clone() : e);
          };

        var jsonTemp = json.clone();
        for (i = 0; i < jsonTemp.length; i++) {
            if(jsonTemp[i].nome == funcionario) {
                jsonTemp[i].local = $(".cidades").val();
            }
        }

        atualizacaoForcado = true;

        $.post(
            servidor_rest + "/set_dados_agenda_diretoria", 
            JSON.stringify( { "JSON": jsonTemp, "PASS": $(".pass").val() } ), 
            function(data) {
                //console.log( data.result );
                if(data.result)
                    inforAtualizacao('success',"Atualizado.");
                else
                    inforAtualizacao('warning',"Erro de senha.");
                //inforAtualizacao('success',"Atualizado.");
                //inforAtualizacao('warning',"Mantem.");
            }, 'json'
        );

        $(".pass").val("");

        getDados();
    });
});

function getDados() {
    var conteudo = "";

    $.ajax({
        cache: false,
        url: servidor_rest + "/get_dados_agenda_diretoria", //"dist/dados/Funcionarios.json",
        dataType: "json",
        success: function(data) {
            if((JSON.stringify(data) != JSON.stringify(json)) || atualizacaoForcado) {
                $.each(data, function (key, item) {
                    conteudo += "<div class='col-md-3'>" +
                                "  <div class='card card-widget widget-user'>" +
                                "	<div class='widget-user-header bg-" + ((item.local.toUpperCase() === "BRASÍLIA" || item.local.toUpperCase() === "BRASILIA") ? "success" : "danger") + "'>" +
                                "	  <h3 class='widget-user-username'>" + item.nome + "</h3>" +
                                "	  <h5 class='widget-user-desc'>" + item.diretoria + "</h5>" +
                                "	</div>" +
                                "	<div class='widget-user-image divCard' value='" + item.nome + "' data-toggle='modal' data-target='#modal-sm'>" +
                                "	  <img class='img-circle elevation-2' src='dist/img/agenda_diretoria/" + item.nome + ".png' alt='User Avatar'>" +
                                "	</div>" +
                                "	<div class='card-footer divCard' value='" + item.nome + "' data-toggle='modal' data-target='#modal-sm'>" +
                                "	  <div class='description-block'>" +
                                "		<span class='description-text'>" + item.local + "</span>" +
                                "	  </div>" +
                                "	</div>" +
                                "  </div>" +
                                "</div>";
                });
                $("#cards").html(conteudo);

                $(".divCard").click(function(){
                    funcionario = $(this).attr('value');
                });

                atualizacaoForcado = false;
                json = data;
            }
        }

    });
}

function inforAtualizacao(cor,titulo) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    Toast.fire({
        type: cor,
        title: titulo
    });
}

function zeros(str,len) {
    return ("000000"+str).slice(-len);
}