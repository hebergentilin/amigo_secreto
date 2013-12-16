jogadores = jogadoresNotSortearam = jogadoresWasNotSorteados = ['Heber','Giovana','Gabriela','Thais', 'Mailson', 'Juliana', 'Bruno', 'Rafaela', 'Wesley', 'Giane', 'Shayene', 'Juliane', 'Lorena', 'Adilson', 'Aira'];
resultados = [];
timeOutMSG = 0;

AmigoChocolate = (function() {    
    var log = function(msg) {
        $('#log').html('Opa! ' + msg);
    }
    
    var pushResultado = function(Participante, ParticipanteSorteado) {
        if (ParticipanteSorteado) {
            var r = new Object();
            r[Participante.getNome()] = ParticipanteSorteado.getNome();
            resultados.push(r);
            return true;
        }
        return false;
    }
    
    return {
        sortear : function(jogador) {
            if (jogador.jaSorteou()) {
                log ('Participante já Sorteou');
                return false;
            } else {
                var idJogadorSorteado = jogador.getId(), participanteSorteado = null;
                
                do
                    idJogadorSorteado = Math.floor(Math.random()*(jogadoresWasNotSorteados.length));
                while (jogadoresWasNotSorteados[idJogadorSorteado] == jogadoresNotSortearam[jogador.getId()]);
                
                participanteSorteado = new Participante(idJogadorSorteado, jogadoresWasNotSorteados[idJogadorSorteado]);
                
                pushResultado(jogador, participanteSorteado);
                
                jogadoresNotSortearam = jogadoresNotSortearam.slice(0,jogador.getId()).concat(jogadoresNotSortearam.slice(jogador.getId()+1,jogadoresNotSortearam.length));
                
                jogadoresWasNotSorteados = jogadoresWasNotSorteados.slice(0,idJogadorSorteado).concat(jogadoresWasNotSorteados.slice(idJogadorSorteado+1,jogadoresWasNotSorteados.length));
                
                return participanteSorteado.getNome();
            }
        }
    };
    
})();

Participante = (function() {
    function Participante(idParticipante, nome) {
        this.idParticipante = parseInt(idParticipante,10);
        this.nome = nome;
    }
    
    Participante.prototype.getId = function() {
        return this.idParticipante;
    };
    
    Participante.prototype.getNome = function() {
        return this.nome;
    };
    
    Participante.prototype.jaFoiSortiado = function() {
        var participanteJaFoiSortiado = false, _this = this;
        resultados.forEach(function(value, index){ 
            if (value[Object.keys(value)] == jogadoresWasNotSorteados[_this.idParticipante]) {
                participanteJaFoiSortiado = true; 
                return false;
            } 
        });        
        return participanteJaFoiSortiado;
    }
    
    Participante.prototype.jaSorteou = function() {
        var participanteJaSortiou = false, _this = this;        
        resultados.forEach(function(value, index){ 
            if (Object.keys(value) == jogadoresNotSortearam[_this.idParticipante]) {
                participanteJaSortiou = true; 
                return false;
            } 
        });        
        return participanteJaSortiou;
    }
    
    return Participante;
})();

$(document).ready(function() {
	form    	= $('<form>');
	select  	= $('<select></select>');
	button  	= $('<button>Buscar</button>').click(function() {
	    clearTimeout(timeOutMSG);
	    
	    var amigoChocolate = AmigoChocolate.sortear(new Participante(select.val(), jogadoresNotSortearam[parseInt(select.val(), 10)]));
	    
	    console.debug('Amigo sorteado é ' + amigoChocolate);
	    
	    $([select, button]).each(function(i, e) {e.fadeOut('fast')});
	    $('#amigochocolate').html(amigoChocolate ? '<b>' + amigoChocolate + '</b>' : '').fadeIn('fast');
	    
	    timeOutMSG = setTimeout(function(){
	    	$('#amigochocolate').fadeOut('fast');
	    	$([select, button]).each(function(i, e) {e.show('fast')});
	    }, 7000);
	    
	    refreshSelect();
	});
	form.append(select).append(button).append('<div id="amigochocolate"></div><div id="log"></div>');
	refreshSelect = (function d() {
	    select.html('');
	    if (jogadoresNotSortearam.length > 0)
	        jogadoresNotSortearam.forEach(function(value, index) {
	            select.append('<option value='+index+'>'+value+'</option>');
	        });
	    else 
	        $([select, button]).each(function(i, e) {e.hide()});
	    return d;
	})();
	$('body').append(form)
	.on('submit', function() {
	    console.debug('Submit');
	    return false;
	});
	$('form').delegate( "#amigochocolate", "click", function() { 
	    clearTimeout(timeOutMSG);
	    $('#amigochocolate').fadeOut('fast');
	});
});