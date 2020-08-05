var porta;
var url;
var servidor_atual;
var servidor_rest; 

$(document).ready(function(){
    porta = "8071";
    url = new URL(window.location.href);
    servidor_atual = url["origin"];
    servidor_rest = servidor_atual.substring(0, servidor_atual.indexOf(":",6)) + ":" + porta;

    $("#user").change(function(){
        $("#inputUser").val("");
        $("#startCall").val("");
        $("#source").val("");
        $("#destination").val("");
        $("#idVerba").val("");
        
        $.getJSON(servidor_rest + "/callverba?operador=" + $("#user").val(), function(data, status) {
            if(!("ErrorMessage" in data)) {
                $("#inputUser").val(data["destination_name"]);
                $("#startCall").val(data["idCisco"]["startCall"]);
                $("#source").val(data["idCisco"]["source"]);
                $("#destination").val(data["idCisco"]["destination"]);
                $("#idVerba").val(data["idCisco"]["idVerba"]);
            }else{
                toastr.error('Operador não está em atendimento.');
            }
        });
    });
    $("#btnGetURL").click(function(){
        $.getJSON(servidor_rest + "/url_verba?idVerba=" + $("#idVerba").val(), function(data) {
            //alert(data["url"])
            window.open(data["url"], '_blank');
        });
    });
});