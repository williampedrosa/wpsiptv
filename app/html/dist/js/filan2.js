var cargos = [
        "Procurador",
        "Chefe de Unidade",
        "Consultor",
        "Chefe Adjunto",
        "Chefe Adjunto de Unidade",
        "Assessor Sênior",
        "Chefe de Subunidade",
        "Assessor Pleno",
        "Coordenador",
        "Supervisor Operacional I",
        "Supervisor Operacional II",
        "Supervisor Operacional III"
    ];

var status = "ABERTO";
var porta;
var url;
var servidor_atual;
var servidor_rest;

$(document).ready(function(){
    porta = "8072";
    url = new URL(window.location.href);
    servidor_atual = url["origin"];
    servidor_rest = servidor_atual.substring(0, servidor_atual.length - 4) + porta;

    if(url.searchParams.get("status") != null) {
        if((url.searchParams.get("status")).toUpperCase() == "SUSPENSO") {
            status = (url.searchParams.get("status")).toUpperCase();
            $( "#showSuspensos" ).prop( "checked", true );
        }
    }

    $(".put-include-here").load("html/sidebar.html");
    $("html").show();
    $( "#showSuspensos" ).on( "click", function() {
        getDados();
    });
	
    getDados();
    setInterval(function(){ 
        getDados();
    }, 30000);
});

function getDados() {

    if($("#showSuspensos").is(':checked')){
        status = "SUSPENSO";
        $(".colStatus").html("Data/hora retorno");
    }else{
        status = "ABERTO";
        $(".colStatus").html("Status");
    }
    
    $("#titulo").html("Fila N2 - " + (url.searchParams.get("regional")).toUpperCase() + " - " + status);

    $.getJSON(servidor_rest + '/n2fila/' + url.searchParams.get("regional") + '/' + status, function(data) {
        var nInc = 0;
        var nReq = 0;
        var nSoft = 0;

        $("#registroInc").empty();
        $("#registroReq").empty();
        $("#registroSoft").empty();
        $.each(data["ANALITICO"], function (key, item) {
            var id = "";
            var color = "";
            var url = "";
            var prioridade_img = "";
            var prioridade_color = "";
            
            //Separação de Soft, Req e Inc
            if(item.GRUPO_DESIGNADO == "DEINF-DIATE-SOFTWARE_ESPECIFICO"){
                url = "http://gsti/sm/index.do?ctx=docEngine&file=request&query=number%3D%22" + item.REGISTRO_RELACIONADO + "%22";
                id = "Soft";
                nSoft += 1; 
            }else if(item.CATEGORIA == "INCIDENTE") {
                url = "http://csti/sm/index.do?ctx=docEngine&file=probsummary&query=number%3D%22" + item.REGISTRO_RELACIONADO + "%22";
                id = "Inc";
                nInc += 1; 
            }else if(item.CATEGORIA == "REQUISICAO") {
                url = "http://gsti/sm/index.do?ctx=docEngine&file=request&query=number%3D%22" + item.REGISTRO_RELACIONADO + "%22";
                id = "Req";
                nReq += 1; 
            }

            //Cor do tempo de estouro
            if(item.TEMPO_FILA <= 60){
                color = "bg-primary"
            }else if(item.TEMPO_FILA <= 90){
                color = "bg-success"
            }else if(item.TEMPO_FILA <= 120){
                color = "bg-warning"
            }else{
                color = "bg-danger"
            }

            if(cargos.includes(item.CARGO)) {
                prioridade_img = "<img src='dist/img/diretor.png' height='24' width='24'>";
                prioridade_color = 'style="color:red;"';
            }

            $('#registro' + id).append(
                "<tr "+prioridade_color+">" + 
                "	<td class='center cel_imagem'>"+prioridade_img+"</td>" + 
                "	<td class='center'><a href='" + url + "' target='_blank'>" + item.REGISTRO_RELACIONADO + "<a></td>" + 
                "	<td class=''>" + item.TITULO + "</td>" + 
                "	<td class='center'>" + (new Date(item.ABERTURA)).format("dd/mm/yyyy HH:MM:ss") + "</td>" + 
                "	<td class='center'>" + zeros(parseInt(item.TEMPO_FILA/60),2) + ":" + zeros(parseInt(item.TEMPO_FILA%60),2) + ":00</td>" + 
                "	<td class=''>" + item.CONTATO + "</td>" + 
                "	<td class=''>" + (item.DESIGNADO_PARA === null ? "" : item.DESIGNADO_PARA) + "</td>" + 
                "	<td class='center'>" + (status === "ABERTO" ? item.STATUS : (item.RETORNO_SUSPENSO === null ? "" : (new Date(item.RETORNO_SUSPENSO)).format("dd/mm/yyyy HH:MM:ss"))) + "</td>" + 
                "	<td class='center'><span class='badge " + color + "'>" + item.ESTOURO + "%</span></td>" + 
                "</tr>"
            );
        });

        $("#nIncidente").html(nInc);
        $("#nRequisicao").html(nReq);
        $("#nSoftware").html(nSoft);
        //$("#lbAtualizacao").html("Última atualização: " + (new Date()).format("dd/mm/yyyy HH:MM:ss"));

        $.each(data["TOTALIZADOR"], function (key, item) {
            $("#nTotalInc" + item.CENTRAL).html(item.INCIDENTE);
            $("#nTotalReq" + item.CENTRAL).html(item.REQUISICAO);
            $("#nTotalSoft" + item.CENTRAL).html(item.SOFTWARE);

            if(item["ATUALIZACAO"] != undefined){
                $("#lbAtualizacao").html("Última atualização: " + (new Date(item["ATUALIZACAO"])).format("dd/mm/yyyy HH:MM:ss"));
            }
        });
        
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