var url;
var servidor_atual;
var servidor_rest_sem_porta;

$(document).ready(function(){
    url = new URL(window.location.href);
    servidor_atual = url["origin"];
    servidor_rest_sem_porta = servidor_atual.substring(0, servidor_atual.indexOf(":",6));

    getDados();
    setInterval(function(){ 
        getDados();
    }, 5000);
});

function rigthPad(value, totalWidth, paddingChar) {
    var length = totalWidth - value.toString().length + 1;
    return value + Array(length).join(paddingChar || '0');
};


function getDados() {
    $.ajax({
        cache: false,
        url: servidor_rest_sem_porta + ":8072/filaAtendimento?departamento="+ $("#usuarioDepartamento").html(),
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: null,
        success: function(data) {
            var cor;
            var pulse;

            $("#flip_cards").empty();
            $.each(data, function (key, item) {
                pulse = "";

                if (item.rsrcCurrentStateReason == "Pausa Particular" || item.rsrcCurrentStateReason == "Pausa Supervisão" || item.rsrcCurrentStateReason == "Pausa Almoço" || item.rsrcCurrentStateReason == "Descanso 10 minutos" || item.rsrcCurrentStateReason == "Descanso 20 minutos") {
                    cor = 'backgroundCinza'
                } else if (item.strResourceState == 'Talking' || item.rsrcCurrentStateReason == "Acessos Remotos" || item.rsrcCurrentStateReason == "Phone Working" || item.rsrcCurrentStateReason == "Offhook" || item.rsrcCurrentStateReason == "Non ACD Busy") {
                    cor = 'backgroundTalking'
                    if (item.durationInStateMillis >= 420000) {
                        cor = 'backgroundLogout'
                    }else if (item.durationInStateMillis >= 300000) {
                        pulse = 'pulse_yellow'
                    } 
                } else if (item.rsrcCurrentStateReason == "Call Ended") {
                    cor = 'backgroundLogout'
                    pulse = 'pulse_red'
                } else if (item.rsrcCurrentStateReason == "Phone Failure" || item.rsrcCurrentStateReason == "Agent Logon") {
                    cor = 'backgroundLogout'
                } else if (item.strResourceState == 'Reserved') {
                    cor = 'backgroundReserved'
                } else {
                    cor = 'backgroundElse'
                }

                ms = item.durationInStateMillis;
                hours = parseInt(ms / 3600000); // 1 Hour = 36000 Milliseconds
                minutes = parseInt((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
                seconds = parseInt(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
                clock = ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + seconds).slice(-2); // formata o relogio

                $('#flip_cards').append(
                    "<div class='flip-card'>" +
                    "  <div class='flip-card-inner "+pulse+" "+cor+"'>" +
                    "	<div class='flip-card-front'>" +
                    "	  <h1 style='font-size: 15px;margin-top: 10px;margin-bottom: 0px;'>"+item.resourceName+"</h3>" +
                    "	  <h1 style='font-size: 22px;margin-bottom: 0px;'>"+clock+"</h3>" +
                    "	  <h1 style='font-size: 15px;margin-bottom: 0px;'>"+item.strResourceState.replace("Talking", "Atendendo").replace("Not Ready", "Ocupado").replace("Ready", "Pronto").replace("Reserved", "Chamando")+"</h4>" +
                    "	  <hr>" +
                    "	  <h4 style='font-size: 12px;margin-bottom: 0px;'>"+item.rsrcCurrentStateReason.replace("Offhook", "Ligação ativa")+"</h4>" +
                    "	</div>" +
                    "	<div class='flip-card-back'>" +
                    "	  <h4>Maior Ligação: "+moment(item.longestTalkDuration).format("mm:ss")+"</h4>" +
                    "	  <h4>Maior Ocupado: "+moment(item.maxNotReadyTime).format("mm:ss")+"</h4>" +
                    "	  <h4>Media Resposta: "+moment(item.avgSpeedOfAnswer).format("ss")+" Seg</h4>" +
                    "	  <h4>Apresentadas: "+item.nPresentedContacts+"</h4>" +
                    "	  <h4>Capturadas: "+item.nHandledContacts+"</h4>" +
                    "	  <h4>Login: "+item.resourceId+"</h4>" +
                    "	</div>" +
                    "  </div>" +
                    "</div>"
                );
            });
        }
    });
    $.ajax({
        cache: false,
        url: "http://sbcdf54b.bcnet.bcb.gov.br:8082/resumo_diario_atendimento",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        data: null,
        success: function(data) {
            $('#idAtendidasInterno').html(data[0]["Internos"][0]["Atendidas"]);
            $('#idAtendidasExterno').html(data[1]["Externos"][0]["Atendidas"]);

            $('#idEmAtendimentoInterno').html(data[0]["Internos"][0]["Atendendo"]);
            $('#idEmAtendimentoExterno').html(data[1]["Externos"][0]["Atendendo"]);

            $('#idDisponiveisInterno').html(data[0]["Internos"][0]["Prontos"]);
            $('#idDisponiveisExterno').html(data[1]["Externos"][0]["Prontos"]);

            $('#idEmFilaInterno').html(data[0]["Internos"][0]["Fila"]);
            $('#idEmFilaExterno').html(data[1]["Externos"][0]["Fila"]);

            $('#idAbandonadasInterno').html(data[0]["Internos"][0]["Abandonadas"]);
            $('#idAbandonadasExterno').html(data[1]["Externos"][0]["Abandonadas"]);

        }
    });
}