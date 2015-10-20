// Funções comuns
var _preloadedPage = {};
var _WIDTH;
var _HEIGHT;

$(function() {
  _WIDTH = $("body").width();
  _HEIGHT = $("body").height();
});

isTransparentUnderMouse = function(canvas, e) {
  var left = 0, top = 0;

  if (canvas.offsetParent) {
      var element = canvas;
      do {
          left += element.offsetLeft;
          top += element.offsetTop;
      } while (element = element.offsetParent);
  }
  var x = e.pageX - left;
  var y = e.pageY - top;
  var imgdata = canvas.getContext('2d').getImageData(x, y, 1, 1).data;

  if (imgdata[0] == 0 && imgdata[1] == 0 && imgdata[2] == 0 && imgdata[3] == 0) {
    return true;
  }

  return false;
};

loadCanvasImage = function(canvas, url) {
  var context = canvas[0].getContext('2d');
  var imageObj = new Image();
  imageObj.onload = function() {
    context.drawImage(this, 0, 0);
  };
  imageObj.src = url;
};

sendAction = function(button, id) {
  var $button = $(button);
  var $form = $("form");
  var action = $form.attr("action");
  var pos = action.lastIndexOf('/') + 1;

  if (id == null) {
    id = $button.attr("id");
  }

  $form.attr("action", action.substring(0, pos) + id);
  $(document).tooltip("disable");
  document.funcao.submit();

  return false;
};

inputRegistro = function(divId, label, value) {
  var $div = $("<div></div>");
  var $p1 = $('<p>Tipo de registro</p>');
  var $p2 = $('<p>Número do registro</p>');
  var $label = $("<input type='text'></input>");
  var $value = $("<input type='text'></input>");

  $label.attr("name", "tiposRegistro")
  $label.val(label);
  $value.attr("name", "registros");
  $value.val(value);

  $p1.append($label);
  $p2.append($value);

  $div.append($p1);
  $div.append($p2);
  $div.attr("id", divId);

  return $div;
};

// Cria caixa de texto que busca profissões.
comboProfissao = function($parent, name) {
  var $code = $("<textarea></textarea>");
  var $value = $("<input type='text'></input>");

  $code.attr("name", name);
  $code.addClass("cid");
  $code.prop("readonly", "true");
  $code.attr("cols", 5);
  $code.attr("rows", 1);

  $value.attr("name", "descricao");
  $value.attr("class", "ui-widget");
  $value.autocomplete({
    source: function(request, response) {
      $.get("http://localhost:3000/usuario/profissao/" + request.term,
      function(data) {
        // Store data for later.
        //$("input#cidlist").val(JSON.stringify(data));
        console.log(data);
        response(data);
      });
    },
    minLength: 3,
    select: function(event, ui) {
      //var source = $("input#cidlist").val();
      var $parent = $(this).parent();
      var $code = $parent.find("textarea");
      $code.val(ui.item.codigo);
    },
    open: function() {
      $(this).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $(this).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  $parent.append($code);
  $parent.append($value);
};

// Cria caixa de texto que faz busca por CID10.
comboCID = function(divId, label, name, cid) {
  var $div = $("<div></div>");
  var $p = $('<p>' + label + '</p>');
  var $cid = $("<textarea></textarea>");
  var $value = $("<input type='text'></input>");

  $cid.attr("name", name);
  $cid.text(cid);
  $cid.prop("readonly", "true");
  $cid.attr("cols", 5);
  $cid.attr("rows", 1);
  $cid.addClass("cid");

  $value.attr("name", "descricoes");
  $value.attr("class", "ui-widget");
  $value.autocomplete({
    source: function(request, response) {
      $.get("http://localhost:3000/cid/descricao/" + request.term,
      function(data) {
        // Store data for later.
        // $("input#cidlist").val(JSON.stringify(data));
        response(data);
      });
    },
    minLength: 4,
    select: function(event, ui) {
      var source = $("input#cidlist").val();
      var $parent = $(this).parent();
      var $cid = $parent.find("textarea");
      $cid.val(ui.item.cid);
    },
    open: function() {
      $(this).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $(this).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  $p.append($cid);
  $p.append($value);

  $div.append($p);
  $div.attr("id", divId);

  return $div;
};

//
onChangeCID = function(input, event) {
  if (event.which == 40) return;
  //console.log(event.which);
  var address = "/cid/descricao/" + input.val();
  console.log("address = " + address);
  console.log(event);
  $.get(address, function(response) {
    console.log("response = ", response);
    input.autocomplete({source: response});
    input.autocomplete("search", "");
  });
};

// Salva os dados da CIF do paciente.
saveCIF = function(cif, pos, value) {
  var id = $("input#id").val();
  var address = "/cif/save/" + cif + "/" + pos + "/" + value;
  console.log("address=", address);
  var data = { id: id };

  $.post(address, data, function(response) {
    if (response['r'] != 'OK') {
      // TODO: tratamento de erros.
      console.log(response);
    }
  });
};

// Escape de seletor jquery.
e = function(s) {
  return s.replace( /(:|\.|\[|\])/g, "\\$1" );
};

addTopic = function($node, text, cif, width) {
  var $div = $("<div>");
  var $text = $("<span>");
  var $label = $("<label>");

  $text.text(text + " (" + cif + ")").addClass("ui-button-text");
  $label.append($text);
  $label.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $label.css({ width: width || '1030px', height: '34px', 'vertical-align': 'middle' });

  $div.append($label);
  $div.addClass("topic");

  $node.append($div);
};

addRadio = function($parent, cif, id, name, text, checked, value) {
  var value = parseInt(value);

  var $radio = $("<input " + (checked ? "checked" : "") + ">");
  $radio.attr('type', 'radio');
  $radio.attr('name', name);
  $radio.attr('id', name + '-' + id);

  var $label = $("<label>");
  $label.attr('for', name + '-' + id);

  if (Array.isArray(text)) {
    $label.text(text[0]);
    $parent.attr("title", text[1])
  } else {
    $label.text(text);
  }

  if (value != null) {
    $radio.val(value);
  }

  $parent.append($radio);
  $parent.append($label);
  return $radio;
}

// Se usuário selecionar opção em funcionalidade.
onSelectFunctionOption = function(e, ui) {
  console.log("onSelectFunctionOption called =", this);
  var $select = $(this);
  var name = $select.attr("name")
  // último caracter de selectmenu1, selectmenu2 ou selectmenu3.
  var pos = parseInt(name[name.length - 1]);
  var value = $select.find("option:selected").val().match(/\d/);
  var $div = $(this).parent().parent().parent();
  var $span = $($div.find("label > span")[0]);
  var cif = $span.text();
  console.log("id=", id);

  if (pos != undefined && value != undefined) {
    saveCIF(cif, pos, value);
  }
}

onSelectEnvironmentOption = function(e, ui) {
  console.log("onSelectEnvironmentOption called =", this);
  var $select = $(this);
  var name = $select.attr("name")
  // último caracter de selectmenu1, selectmenu2 ou selectmenu3.
  var pos = parseInt(name[name.length - 1]);
  var value = $select.find("option:selected").val().match(/\d/);
  var $div = $(this).parent().parent().parent();
  var $span = $($div.find("label > span")[0]);
  var $radio = $div.find(":radio:checked");
  var mul = parseInt($radio.val());
  var cif = $span.text();

  if (pos != undefined && value != undefined) {
    saveCIF(cif, pos, mul * value);
  }
}

addFunctionOptions = function($parent, cif, name, value, parOptions, width) {
  var value = parseInt(value);
  var $td = $("<td id='" + cif + "-span'>");
  var $div = $("<div>");
  var $leftSpan = $("<span>");

  $leftSpan.css({ overflow: 'hidden' });
  $leftSpan.attr('id', cif + '-radio');

  var $rightSpan = $("<span>");

  $rightSpan.css({ overflow: 'hidden' });
  $rightSpan.attr('id', cif + '-radio');

  var $select = $("<select id='" + cif + "-" + name + "'>");
  var options = parOptions || [
    "1 : disfunção leve, 5%-24%",
    "2 : disfunção moderada, 25%-49%",
    "3 : disfunção severa, 50%-95%",
    "4 : disfunção total, 96%-100%"
  ];

  $select.attr("name", cif + "-" + name);

  for (var i = 0; i < options.length; ++i) {
    var option;

    if ((value - 1) === i) {
      option = $("<option selected>" + options[i] + "</option>");
    } else {
      option = $("<option>" + options[i] + "</option>");
    }

    $select.append(option);
  }

  if (value === 0 || value === 8 || value === 9) {
    $select.prop("disabled", "true");
  }

  var $f = addRadio($leftSpan, cif, 1, cif + "-" + name + "-radio", ["F", "Funcionalidade"], value === 0).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    $select.selectmenu("option", "disabled", true);
    saveCIF(cif, pos, 0);
  });
  $f.parent().find('label').addClass('fix-radio-left');

  var $i = addRadio($rightSpan, cif, 2, cif + "-" + name + "-radio", ["I", "Incapacidade"], value > 0 && value < 8).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    $select.selectmenu("option", "disabled", false);
    // var $select = $select.parent().find('select');
    onSelectFunctionOption.call($select[0], null);
  });
  $i.parent().find('label').addClass('fix-radio');

  var $ne = addRadio($rightSpan, cif, 3, cif + "-" + name + "-radio", ["NE", "Não especificado"], value === 8).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    $select.selectmenu("option", "disabled", true);
    saveCIF(cif, pos, 8);
  });
  $ne.parent().find('label').addClass('fix-radio');

  var $na = addRadio($rightSpan, cif, 4, cif + "-" + name + "-radio", ["NA", "Não aplicável"], value === 9).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    $select.selectmenu("option", "disabled", true);
    saveCIF(cif, pos, 9);
  });
  $na.parent().find('label').addClass('fix-radio');

  $td.append($div);
  $div.append($leftSpan);
  $div.append($select);
  $div.append($rightSpan);
  $div.css({ width: '412px', 'background-color': 'white', overflow: 'hidden', height: '38px',
            'text-align': 'left' });
  $div.buttonset();
  $td.css({ width: '412px', 'background-color': 'white' });
  $td.append($div);

  $select.selectmenu({ select: onSelectFunctionOption, width: width || "230px", height: "28px" });
  $select.parent().children('span').addClass('fix-selector');

  $parent.append($td);
};

// Se usuário selecionar opção em funcionalidade.
onSelectQualifierOption = function(e, ui) {
  console.log("onSelectMenu called =", this);
  var $select = $(this);
  var name = $select.attr("name")
  // último caracter de selectmenu1, selectmenu2 ou selectmenu3.
  var pos = parseInt(name[name.length - 1]);
  var value = $select.find("option:selected").val().match(/\d/);
  var $div = $(this).parent().parent();
  var $span = $($div.find("label > span")[0]);
  var cif = $span.text();
  console.log("id=", id, "cif=", cif);

  if (pos != undefined && value != undefined) {
    saveCIF(cif, pos, value);
  }
}

addQualifier = function($parent, cif, name, title, value) {
  var value = parseInt(value);
  var $span = $("<span id='" + cif + "-span'>");
  var $select = $("<select id='" + cif + "-" + name + "'>");
  var options = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
  ];

  $select.attr("name", cif + "-" + name);

  for (var i = 0; i < options.length; ++i) {
    var option;

    if (value === i) {
      option = $("<option selected>" + options[i] + "</option>");
    } else {
      option = $("<option>" + options[i] + "</option>");
    }

    $select.append(option);
  }

  $span.append($select);

  if (title != null) {
    $span.attr("title", title);
  }

  $span.addClass("fix-down");
  $parent.append($span);

  $select.selectmenu({ select: onSelectQualifierOption, width: "50px", height: "28px" });
};

addEnvironmentOptions = function($parent, cif, name, value, parOptions, width) {
  var value = parseInt(value);
  var absValue = Math.abs(value);
  var $span = $("<span id='" + cif + "-span'>");
  var $radio1span = $("<span>");
  var $radio2span = $("<span>");
  var $radio3span = $("<span>");
  var $radio4span = $("<span>");
  var $selectSpan = $("<span>");
  var $select = $("<select id='" + cif + "-" + name + "'>");
  var options = parOptions || [
    "1 : leve",
    "2 : moderado",
    "3 : grave",
    "4 : completo"
  ];

  $select.attr("name", cif + "-" + name);

  for (var i = 0; i < options.length; ++i) {
    var option;

    if ((absValue - 1) === i) {
      option = $("<option selected>" + options[i] + "</option>");
    } else {
      option = $("<option>" + options[i] + "</option>");
    }

    $select.append(option);
  }

  if (absValue === 8 || absValue === 9) {
    $select.prop("disabled", "true");
  }

  addRadio($radio1span, cif, cif + "-" + name + "-radio", ["F", "Facilitador"], value >= 0 && value < 8, 1).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    var value = $select.find("option:selected").val().match(/\d/);
    saveCIF(cif, pos, value);
    $select.selectmenu("option", "disabled", false);
    // console.log("value[1] =" + value);
  });

  addRadio($radio2span, cif, cif + "-" + name + "-radio", ["O", "Obstáculo"], value > -8 && value < 0, -1).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    var value = $select.find("option:selected").val().match(/\d/);
    saveCIF(cif, pos, -value);
    $select.selectmenu("option", "disabled", false);
    // var $select = $select.parent().find('select');
    // console.log("value[2] =" + value);
  });

  addRadio($radio3span, cif, cif + "-" + name + "-radio", ["NE", "Não especificado"], value === 8).change(function() {
    console.log("value[3] =" + value);
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    saveCIF(cif, pos, 8);
    $select.selectmenu("option", "disabled", true);
  });

  addRadio($radio4span, cif, cif + "-" + name + "-radio", ["NA", "Não aplicável"], value === 9).change(function() {
    console.log("value[4] =" + value);
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    var pos = parseInt(name[name.length - 1]);
    saveCIF(cif, pos, 9);
    $select.selectmenu("option", "disabled", true);
  });

  $radio1span.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $radio1span.css({ width: '55px', height: '34px', 'vertical-align': 'middle' });
  $radio2span.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $radio2span.css({ width: '55px', height: '34px', 'vertical-align': 'middle' });
  $radio3span.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $radio3span.css({ width: '55px', height: '34px', 'vertical-align': 'middle' });
  $radio4span.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $radio4span.css({ width: '55px', height: '34px', 'vertical-align': 'middle' });

  $selectSpan.append($select);
  $selectSpan.addClass("fix-down");

  $span.append($radio1span);
  $span.append($radio2span);
  $span.append($selectSpan);
  $span.append($radio3span);
  $span.append($radio4span);
  $parent.append($span);

  $select.selectmenu({ select: onSelectEnvironmentOption, width: width || "230px", height: "28px" });
};

// (*)createFunctionItem
addBodyItem = function($parent, cif, text, value, shrunk) {
  // CIF
  var $cif = $("<td id='" + cif + "-code'>");
  var $cifText = $("<span>");

  $cifText.text(cif);
  $cifText.addClass("ui-button-text");
  $cif.append($cifText);
  $cif.attr("name", "cif"); // new
  $cif.addClass("ui-widget ui-state-default ui-button-text-only ui-corner-left");
  $cif.css({ width: '110px', height: '38px', overflow: 'hidden' });
  $parent.append($cif);

  // Descrição
  var $desc = $("<td id='" + cif + "-description'>");
  var $descText = $("<span>");
  $descText.text(text);
  $descText.css({ 'text-overflow': 'ellipsis', 'white-space': 'nowrap' });
  $descText.addClass("ui-button-text");
  $desc.append($descText);
  $desc.attr("title", text);
  $desc.addClass("ui-widget ui-state-default ui-button-text-only ui-corner-right");
  $desc.css({ overflow: 'hidden', height: '38px', 'text-align': 'left' });
  $parent.append($desc);

  // Botões
  addFunctionOptions($parent, cif, "selectmenu1", Array.isArray(value) ? value[0] : 0);

  // Botão de expandir/retrair
  if (shrunk) {
    var $shrinkSpace = $('<td>');
    var $shrinkButton = $('<button>expandir</button>');

    $shrinkButton.button({ icons: { primary: 'ui-icon-arrowthick-1-s' }, text: false });
    $shrinkButton.click(function(event) {
      event.preventDefault();
      $('tbody[name=' + cif + '-children]').toggleClass('toggleVisible');
      $(".ui-button-icon-primary", this).toggleClass("ui-icon-arrowthick-1-s ui-icon-arrowthickstop-1-n");
      console.log("lol." + cif);
    });

    $shrinkSpace.append($shrinkButton);
    $shrinkSpace.css({ width: '10px', 'background-color': 'white' });
    $parent.append($shrinkSpace);
  }
};

//
addStructureItem = function(node, cif, text, values) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");
    var options1 = [ 1, 2, 3, 4 ];
    var options2 = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    // CIF
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '34px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text").css({ 'white-space': 'nowrap',
      'overflow': 'hidden', 'text-overflow': 'ellipsis' });
    tailText.attr("title", text);
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '34px', 'text-align': 'left' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");
    div.append(desc);

    addFunctionOptions(div, cif, "selectmenu1", Array.isArray(values) ? values[0] : 0, options1, "50px");
    addQualifier(div, cif, "selectmenu2", null, Array.isArray(values) ? values[1] : 0, options2, "50px");
    addQualifier(div, cif, "selectmenu3", null, Array.isArray(values) ? values[2] : 0, options2, "50px");
    // div.append(span);
    div.addClass("enclosed");

    node.append(div);
}

//
addDevelopmentItem = function(node, cif, text, values) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");
    var options = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    // CIF
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '34px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text").css({ 'white-space': 'nowrap',
      'overflow': 'hidden', 'text-overflow': 'ellipsis' });
    tailText.attr("title", text);
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '34px', 'text-align': 'left' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");
    div.append(desc);

    addQualifier(div, cif, "selectmenu1", "Desempenho", Array.isArray(values) ? values[0] : 0, options, "50px");
    addQualifier(div, cif, "selectmenu2", "Participação", Array.isArray(values) ? values[1] : 0, options, "50px");
    addQualifier(div, cif, "selectmenu3", "Capacidade com auxílio", Array.isArray(values) ? values[2] : 0, options, "50px");
    addQualifier(div, cif, "selectmenu4", "Desempenho sem auxílio", Array.isArray(values) ? values[3] : 0, options, "50px");
    // div.append(span);
    div.addClass("enclosed");

    node.append(div);
};

//
addEnvironmentItem = function(node, cif, text, value) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");

    // CIF
    headText.text(cif).addClass("ui-button-text");
    tailText.attr("title", text);
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '34px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text").css({ 'white-space': 'nowrap',
      'overflow': 'hidden', 'text-overflow': 'ellipsis' });
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '34px', 'text-align': 'left' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");
    div.append(desc);

    addEnvironmentOptions(div, cif, "selectmenu1", Array.isArray(value) ? value[0] : 0);
    // div.append(span);
    div.addClass("enclosed");

    node.append(div);
};

addSeparator = function(node) {
    var sep = $("<p>&nbsp;</p>");
    node.append(sep);
};

parseCIF = function(line) {
    if (/\(\w[0-9]+\)/.test(line)) {
        var match = line.match(/(.*)\((\w[0-9]+)\)/);
        return [match[1], match[2]]; // line.match(/b[0-9]+/)[0];
    }
};

createChapterPage = function($accordion, chapter, titles, page, data) {
  var id = $("input#id").val();

  // console.log("page, ", JSON.stringify(page));
  titles.forEach(function(title, n) {
    var $a = $("<a/>", {
      href : "/cif/capitulo/" + chapter + "/pagina/" + (n + 1),
      text : title
    });
    var $title = $("<h3/>");
    var $div = $("<div/>");
    var $p = $("<p/>");

    if (n == 0) {
      populateCIF($div, page, data);
      _preloadedPage[$a.attr("href")] = true;
      console.log("_preloadedPage[%s] = true", $a.attr("href"));
    } else {
      $p.text("Carregando página. Aguarde...");
    }

    $title.append($a);
    $div.append($p);
    $accordion.append($title);
    $accordion.append($div);
  });

  // $accordion.accordion();
  $accordion.accordion({
    collapsible: true,
    active : true,
    heightStyle: "content",
    activate: function (e, ui) {
      var $p = $(ui.newPanel).find('p');
      var url = $(ui.newHeader).children('a').attr('href');
      // console.log("a = " + url);
      // console.log("$p = " + $p.attr('id'));
      if (url && _preloadedPage[url] != true) {
        _preloadedPage[url] = true;
        // console.log("loading: ", _preloadedPage[url]);
        $.post(url, { id: id }, function (result) {
          var page = result.page;
          var data = result.data;
          populateCIF($p, JSON.parse(page), JSON.parse(data), true);
        });
      }
    }
  });
};

// Popula tela com grupos de CIF.
populateCIF = function(anchor, page, data, overwrite) {
  var map = {};

  if (overwrite) {
    anchor.text("");
  }

  // Converte lista em mapeamento.
  if (data instanceof Array) {
    data.forEach(function(datum) {
      // console.log(datum.c + " = ", datum.v);
      map[datum.c] = datum.v;
    });
  }

  // Add table elements.
  var $table = $('<table>');
  $table.css({ border: '0px', width: '100%' });
  anchor.append($table);

  // console.log("page =", page);
  page.forEach(function(group) {
    if (group == null)
      return;

    // Add table body and table row.
    var shrunk = (group.items && group.items.length > 0);
    var $tbody = $('<tbody>');
    var $tr = $('<tr>');

    $tbody.append($tr);
    $table.append($tbody);

    switch (group.cif[0]) {
      case 'b':
        addBodyItem($tr, group.cif, group.description, map[group.cif], shrunk);
        break;
      case 's':
        addStructureItem($tr, group.cif, group.description, map[group.cif]);
        break;
      case 'd':
        addDevelopmentItem($tr, group.cif, group.description, map[group.cif]);
        break;
      case 'e':
        addEnvironmentItem($tr, group.cif, group.description, map[group.cif]);
    }

    // 3rd level.
    if (group.items.length > 0) {

      group.items.forEach(function(item) {
        if (item == null)
          return;

        // Add table body and table row.
        var shrunk = (item.items && item.items.length > 0);
        var $tr = $('<tr>');
        var $tbody = $('<tbody>');

        $tbody.attr('name', group.cif + '-children');
        $tbody.addClass('toggleVisible');
        $tbody.append($tr);
        $table.append($tbody);

        console.log("item = " + item.cif);
        switch (item.cif[0]) {
          case 'b':
            addBodyItem($tr, item.cif, item.description, map[item.cif], shrunk);
            break;
          case 's':
            addStructureItem($tr, item.cif, item.description, map[item.cif]);
            break;
          case 'd':
            addDevelopmentItem($tr, item.cif, item.description, map[item.cif]);
            break;
          case 'e':
            addEnvironmentItem($tr, item.cif, item.description, map[item.cif]);
        }

        // 4rd level.
        if (item.items && item.items.length > 0) {

          // Group elements in new tbody.
          var $tbody = $('<tbody>');

          $tbody.attr('name', item.cif + '-children');
          $tbody.addClass('toggleVisible');
          $table.append($tbody);

          item.items.forEach(function(subitem) {
            if (subitem == null)
              return;

            // Add table row.
            var $tr = $('<tr>');
            $tbody.append($tr);

            console.log("subitem = ", subitem.cif);
            switch (subitem.cif[0]) {
              case 'b':
                addBodyItem($tr, subitem.cif, subitem.description, map[subitem.cif]);
                break;
              case 's':
                addStructureItem($tr, subitem.cif, subitem.description, map[subitem.cif]);
                break;
              case 'd':
                addDevelopmentItem($tr, subitem.cif, subitem.description, map[subitem.cif]);
                break;
              case 'e':
                addEnvironmentItem($tr, subitem.cif, subitem.description, map[subitem.cif]);
            }
          });

        }
      });

    }
  });
};

// Carrega grupos de CIF do servidor.
loadCIF = function(items, anchor) {
  var results = [];

  items.forEach(function(query) {
    var address = "/cif/itens/" + query;
    console.log(address);

    $.get(address, function(group) {
      results.push(group);

      // Items terminados.
      if (results.length == items.length) {
        results.sort(function(item1, item2) { return item1.cif.localeCompare(item2.cif); });
        populateCIF(anchor, results);
      }
    });
  });
};

// Carrega grupos de CIF do servidor.
loadChapter = function(chapter, anchor) {
  var results = [];
  var address = "/cif/chapter/" + chapter;
  console.log(address);

  $.get(address, function(results) {
    populateCIF(anchor, results);
  });
};
