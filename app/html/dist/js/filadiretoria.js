

$(document).ready(function(){
    $(".put-include-here").load("html/sidebar.html");
    $("html").show();
	
    getDados();
    setInterval(function(){ 
        getDados();
    }, 30000);
});

function getDados() {
    var porta = "8071";
    var url = new URL(window.location.href);
    var servidor_atual = url["origin"];
    var servidor_rest = servidor_atual.substring(0, servidor_atual.length - 4) + porta;

    $.getJSON(servidor_rest + '/get_dados_fila_diretoria', function(data) {
        var nInc = 0;
        var nReq = 0;
        var nInt = 0;

        $("#registroInc").empty();
        $("#registroReq").empty();
        $("#registroInt").empty();
        $.each(data, function (key, item) {
            var id = "";
            var color = "";
            var url = "";
            var tag = "";
            var prioridade = "";

            if(item["ATUALIZACAO_DASHBOARD"] == undefined){
                //Separação de Int, Req e Inc
                if(item.CATEGORIA == "INTERAÇÃO") {
                    tag = item.ID_INTERACAO;
                    id = "Int";
                    nInt += 1; 
                }else if(item.CATEGORIA == "INCIDENTE") {
                    url = "http://csti/sm/index.do?ctx=docEngine&file=probsummary&query=number%3D%22" + item.REGISTRO_RELACIONADO + "%22";
                    tag = "<a href='" + url + "' target='_blank'>" + item.ID_INTERACAO + "<a>";
                    id = "Inc";
                    nInc += 1; 
                }else if(item.CATEGORIA == "REQUISICAO") {
                    url = "http://gsti/sm/index.do?ctx=docEngine&file=request&query=number%3D%22" + item.REGISTRO_RELACIONADO + "%22";
                    tag = "<a href='" + url + "' target='_blank'>" + item.ID_INTERACAO + "<a>";
                    id = "Req";
                    nReq += 1; 
                }

                $('#registro' + id).append(
                    "<tr>" + 
                    "	<td class='center'>" + tag + "</td>" + 
                    "	<td class='"+prioridade+"'>" + item.TITULO + "</td>" + 
                    "	<td class='center "+prioridade+"'>" + (new Date(item.ABERTURA)).format("dd/mm/yyyy HH:MM:ss") + "</td>" + 
                    "	<td class='center "+prioridade+"'>" + item.TEMPO_FILA + "</td>" + 
                    "	<td class='"+prioridade+"'>" + item.CONTATO + "</td>" + 
                    "	<td class='"+prioridade+"'>" + (item.DESIGNADO_PARA === null ? "" : item.DESIGNADO_PARA) + "</td>" + 
                    "	<td class='"+prioridade+"'>" + item.STATUS + "</td>" + 
                    "</tr>"
                );
            }else{
                $("#lbAtualizacao").html("Última atualização: " + (new Date(item["ATUALIZACAO_DASHBOARD"])).format("dd/mm/yyyy HH:MM:ss"));
            }
        });

        $("#nIncidente").html(nInc);
        $("#nRequisicao").html(nReq);
        $("#nInteracao").html(nInt);
        
        $( ".divAtualizar" ).remove();

        inforAtualizacao();

    });
}

function inforAtualizacao() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    Toast.fire({
        type: 'success',
        title: ' Atualizado com sucesso.'
    });
}

function zeros(str,len) {
    return ("000000"+str).slice(-len);
}