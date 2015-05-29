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
        switch (page) {
          case 0:
            return [ "b310", "b330", "b340" ];
        };
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
            return [ "b510", "b515", "b525", "b530", "b535" ];
          case 1:
            return [ "b540", "b545", "b550" ];
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
        switch (page) {
          case 0:
            return []; // FIXME
        }
      case 'e1':
        switch (page) {
          case 0:
            return [];
          case 1:
            return [];
        }
    }
    return [];
  },

  chapter2cif : function(chapter) {
    var result = {};

    switch (chapter) {
      case 'b1':
        result.titles = [
          "Funções mentais globais",
          "Funções mentais específicas"
        ];
        break;

      case 'b2':
        result.titles = [
          "Visão e funções relacionadas",
          "Funções auditivas e vestibulares",
          "Funções sensoriais adicionais",
          "Dor"
        ];
        break;

      case 'b3':
        result.titles = [
          "Funções da voz e da fala"
        ];
        break;

      case 'b4':
        result.titles = [
          "Funções do Aparelho Cardiovascular, dos Sistemas Hematológico e Imunológico e do Aparelho Respiratório",
          "Funções do Sistema Hematológico e Imunológico",
          "Funções do Aparelho Respiratório",
          "Funções e Sensações Adicionais dos Aparelhos Cardiovascular e Respiratório"
        ];
        break;

      case 'b5':
        result.tiles = [
          "Funções Relacionadas com o Aparelho Digestivo",
          "Funções Relacionadas com os Sistemas Metabólicos e Endócrinos"
        ];
        break;

      case 'b6':
        result.titles = [
          "Funções Urinárias",
          "Funções Sexuais e Reprodutivas"
        ];
        break;

      case 'b7':
        result.titles = [
          "Funções das Articulações e dos Ossos",
          "Funções Musculares"
        ];
        break;

      case 'b8':
        result.titles = [
          "Funções da Pele e Estruturas Relacionadas"
        ];
        break;
    }

    result.first = this.page2cif(chapter, 0);
    return result;
  },

};
