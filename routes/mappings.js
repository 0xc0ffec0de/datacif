module.exports = {

  page2cif : function(chapter, page) {
    page = parseInt(page);

    switch (chapter) {
      case 'b1':
        switch (page) {
          case 0:
            return [ "b110", "b114", "b126", "b130", "b134" ];
          case 1:
            return [ "b140", "b144", "b152", "b156", "b160", "b164", "b167", "b172", "b180" ];
        };
      case 'b2':
        switch (page) {
          case 0:
            return [ "b210", "b215" ];
          case 1:
            return [ "b230", "b235", "b240" ];
          case 2:
            return [ "b250", "b255", "b260", "b265", "b270" ];
          case 3:
            return [ "b280" ];
        };
      case 'b3':
        return [ "b310", "b330", "b340" ];
      case 'b4':
        switch (page) {
          case 0:
            return [ "b410", "b415", "b420" ];
          case 1:
            return [ "b430", "b435" ];
          case 2:
            return [ "b440", "b445" ];
          case 3:
            return [ "b450", "b455" ];
        };
      case 'b5':
        switch (page) {
          case 0:
            return [ "b510", "b515", "b520", "b525", "b530", "b535", "b539" ];
          case 1:
            return [ "b540", "b545", "b550", "b555", "b559", "b598", "b599" ];
        };
      case 'b6':
        switch (page) {
          case 0:
            return [ "b610", "b620" ];
          case 1:
            return [ "b640", "b650", "b660", "b670" ];
        };
      case 'b7':
        switch (page) {
          case 0:
            return [ "b710", "b715", "b720" ];
          case 1:
            return [ "b730", "b735", "b740", "b750", "b760", "b765", "b770" ];
        };
      case 'b8':
        return [ "b810", "b820", "b830", "b840", "b850", "b860" ];
      case 's1':
        return [ "s110", "s120", "s130", "s140", "s150" ];
      case 's2':
        return [ "s210", "s220", "s230", "s240", "s250", "s260" ];
      case 's3':
        return [ "s310", "s320", "s330", "s340" ];
      case 's4':
        return [ "s410", "s420", "s430", "s498", "s499" ];
      case 's5':
        return [ "s510", "s520", "s530", "s540", "s550", "s570", "s580" ];
      case 's6':
        return [ "s610", "s620", "s630" ];
      case 's7':
        return [ "s710", "s720", "s730", "s740", "s750", "s7501", "s770" ];
      case 's8':
        return [ "s810", "s820", "s830", "s840" ];
      case 'd1':
        switch (page) {
          case 0:
            return [ "d110", "d115", "d120", "d129" ];
          case 1:
            return [ "d130", "d135", "d140", "d150", "d155", "d159" ];
          case 2:
            return [ "d160", "d163", "d166", "d170", "d172", "d175", "d177", "d179", "d198", "d199" ];
        }
      case 'd2':
        return [ "d210", "d220", "d230", "d240", "d298", "d299" ];
      case 'd3':
        switch (page) {
          case 0:
            return [ "d310", "d315", "d320", "d325", "d329" ];
          case 1:
            return [ "d330", "d335", "d340", "d345", "d349" ];
          case 2:
            return [ "d350", "d355", "d360", "d398", "d399" ];
        }
      case 'd4':
        switch (page) {
          case 0:
            return [ "d410", "d415", "d420", "d430" ];
          case 1:
            return [ "d430", "d435", "d440", "d445" ];
          case 2:
            return [ "d450", "d455", "d460", "d465", "d469" ];
          case 3:
            return [ "d470", "d475", "d480", "d489" ]; // d489, d498, d499
          }
      case 'd5':
        return [ "d510", "d520", "d530", "d540", "d550", "d560", "d570" ];
      case 'd6':
        switch (page) {
          case 0:
            return [ "d610", "d620", "d629" ];
          case 1:
            return [ "d630", "d640", "d649" ];
          case 2:
            return [ "d650", "d660", "d698", "d699" ];
        }

    }
    return [];
  },

  chapter2cif : function(chapter) {
    var result = {};

    result.titles = function(chapter) {
      switch (chapter) {
        case 'b1':
          return [
            "Funções mentais globais",
            "Funções mentais específicas"
          ];
        case 'b2':
          return [
            "Visão e funções relacionadas",
            "Funções auditivas e vestibulares",
            "Funções sensoriais adicionais",
            "Dor"
          ];
        case 'b3':
          return [
            "Funções da voz e da fala"
          ];
        case 'b4':
          return [
            "Funções do Aparelho Cardiovascular, dos Sistemas Hematológico e Imunológico e do Aparelho Respiratório",
            "Funções do Sistema Hematológico e Imunológico",
            "Funções do Aparelho Respiratório",
            "Funções e Sensações Adicionais dos Aparelhos Cardiovascular e Respiratório"
          ];
        case 'b5':
          return [
            "Funções Relacionadas com o Aparelho Digestivo",
            "Funções Relacionadas com os Sistemas Metabólicos e Endócrinos"
          ];
        case 'b6':
          return [
            "Funções Urinárias",
            "Funções Sexuais e Reprodutivas"
          ];
        case 'b7':
          return [
            "Funções das Articulações e dos Ossos",
            "Funções Musculares"
          ];
        case 'b8':
          return [
            "Funções da Pele e Estruturas Relacionadas"
          ];
        case 's1':
          return [
            "Estrutura do sistema nervoso",
          ];
        case 's2':
          return [
            "Olho, ouvido e estruturas relacionadas"
          ];
        case 's3':
          return [
            "Estruturas relacionadas com a voz e a fala"
          ];
        case 's4':
          return [
            "Estrutura do Aparelho Cardiovascular, do Sistema Imunol. e do Aparelho Respirat."
          ];
        case 's5':
          return [
            "Estruturas Relacionadas com o Apar. Digestivo e com os Sist. Metaból. e Endócrino"
          ];
        case 's6':
          return [
            "Estruturas Relacionadas com o Aparelho Geniturinário e Reprodutivo"
          ];
        case 's7':
          return [
            "Estruturas Relacionadas com o Movimento"
          ];
        case 's8':
          return [
            "Pele e Estruturas Relacionadas"
          ];
        case 'd1':
          return [
            "Experiências sensoriais e intencionais",
            "Aprendizagem básica",
            "Aplicação do conhecimento"
          ];
        case 'd2':
          return [
            "Tarefas e exigências gerais"
          ]
        case 'd3':
          return [
            "Comunicar e receber mensagens",
            "Comunicar e produzir mensagens",
            "Conversação e utilização de dispositivos e de técnicas de comunicação"
          ]
        case 'd4':
          return [
            "Mudar e manter a posição do corpo",
            "Transportar, mover e manusear objetos",
            "Andar e deslocar-se",
            "Deslocar-se utilizando transporte"
          ];
        case 'd5':
          return [
            "Autos cuidados"
          ];
        case 'd6':
          return [
            "Aquisição do necessário para sobreviver",
            "Tarefas domésticas",
            "Cuidar dos objetos da casa e ajudar os outros"
          ];
        case 'd7':
          return [
            "Relações e interações interpessoais"
          ];
        case 'd8':
          return [
            "Áreas principais da vida"
          ];
        case 'd9':
          return [
            "Vida comunitária, social e cívica"
          ];
      }
    }(chapter);

    result.first = this.page2cif(chapter, 0);
    return result;
  },

};
