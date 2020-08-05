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

                if (item.strResourceState == 'Talking') {
                    cor = 'backgroundTalking'
                    if (item.durationInStateMillis >= 300000 && item.durationInStateMillis <= 600000) {
                        pulse = 'pulse_yellow'
                    } else if (item.durationInStateMillis >= 600000) {
                        pulse = 'pulse_red'
                    }
                } else if (item.strResourceState == 'Not Ready') {
                    cor = 'backgroundLogout'
                } else if (item.strResourceState == 'Reserved') {
                    cor = 'backgroundReserved'
                } else {
                    cor = 'backgroundElse'
                }

                if (item.durationInStateMillis >= 300000 && item.durationInStateMillis <= 600000 && item.strResourceState == 'Talking') {
                    pulse = 'pulse_yellow'
                } else if (item.durationInStateMillis >= 600000 && item.strResourceState == 'Talking') {
                    pulse = 'pulse_red'
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
                    "	  <h3 style='font-size: 24px;'>"+item.resourceName+"</h3>" +
                    "	  <hr>" +
                    "	  <h3 style='font-size: 36px;'>"+clock+"</h3>" +
                    "	  <h3 style='font-size: 24px;'>Status:</h3>" +
                    "	  <h4 style='font-size: 18px;'>"+item.strResourceState.replace("Talking", "Atendendo").replace("Not Ready", "Ocupado").replace("Ready", "Pronto").replace("Reserved", "Chamando")+"</h4>" +
                    "	  <hr>" +
                    "	  <h4 style='font-size: 18px;'>"+item.rsrcCurrentStateReason.replace("Offhook", "Ligação ativa")+"</h4>" +
                    "	</div>" +
                    "	<div class='flip-card-back'>" +
                    "	  <h4>Maior Ligação:</h4>" +
                    "	  <h4>"+moment(item.longestTalkDuration).format("mm:ss")+"</h4>" +
                    "	  <h4>Maior tempo ocupado:</h4>" +
                    "	  <h4>"+moment(item.maxNotReadyTime).format("mm:ss")+"</h4>" +
                    "	  <h4>Media de resposta:</h4>" +
                    "	  <h4>"+moment(item.avgSpeedOfAnswer).format("ss")+" Seg</h4>" +
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
}