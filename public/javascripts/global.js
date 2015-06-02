// Funções comuns
_preloadedPage = {};

send = function(button, suffix) {
  var $form = $("form");
  var action = $form.attr("action");
  var pos = action.lastIndexOf('/') + 1;

  $form.attr("action", action.substring(0, pos) + suffix);
  // console.log("form.action = " + $form.attr("action"));
  $(document).tooltip("disable");

  return true;
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

  if (cif != undefined) {
    text = text + " (" + cif + ")";
  }

  $text.text(text).addClass("ui-button-text");

  $label.append($text);
  $label.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all");
  $label.css({ width: width || '1030px', height: '34px', 'vertical-align': 'middle' });

  $div.append($label);
  $div.addClass("topic");

  $node.append($div);
};

addRadio = function($parent, cif, name, text, checked) {
  var value = parseInt(value);
  var $span = $("<span>");
  var $radio = $("<input type='radio' name='" + name + "' " + (checked ? "checked" : "") + ">");
  var $label = $("<label for='" + cif + "-" + name + "'>");

  $label.text(text);
  //$radio.prop("checked", checked);

  $span.append($radio);
  $span.append($label);
  $span.addClass("fix-radio-down");

  $parent.append($span);

  return $radio;
}

// Se usuário selecionar opção em funcionalidade.
onSelectFunctionOption = function(e, ui) {
  console.log("onSelectMenu called =", this);
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

addFunctionOptions = function($parent, cif, name, value, parOptions, width) {
  var value = parseInt(value);
  var $span = $("<span id='" + cif + "-span'>");
  var $radio1span = $("<span>");
  var $radio2span = $("<span>");
  var $radio3span = $("<span>");
  var $radio4span = $("<span>");
  var $selectSpan = $("<span>");
  var $select = $("<select id='" + cif + "-" + name + "'>");
  var options = parOptions || [
  	"1 : disfunção leve",
  	"2 : disfunção moderada",
  	"3 : disfunção severa",
  	"4 : disfunção total"
  	// "8 : outra disfunção especificada",
  	// "9 : disfunção não especificada"
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

  addRadio($radio1span, cif, cif + "-" + name + "-radio", "F", value === 0).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    // var pos = parseInt(name[name.length - 1]);
    $select.selectmenu("option", "disabled", true);
    var pos = parseInt(name[name.length - 1]);
    saveCIF(cif, pos, 0);
  });

  addRadio($radio2span, cif, cif + "-" + name + "-radio", "I", value > 0 && value < 8).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    $select.selectmenu("option", "disabled", false);
    var $select = $select.parent().find('select');
    onSelectMenu.call($select[0], null);
  });

  addRadio($radio3span, cif, cif + "-" + name + "-radio", "NE", value === 8).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    $select.selectmenu("option", "disabled", true);
    var pos = parseInt(name[name.length - 1]);
    saveCIF(cif, pos, 8);
  });

  addRadio($radio4span, cif, cif + "-" + name + "-radio", "NA", value === 9).change(function() {
    var $parent = $(this).parent().parent().parent();
    var $select = $parent.find("select");
    $select.selectmenu("option", "disabled", true);
    var pos = parseInt(name[name.length - 1]);
    saveCIF(cif, pos, 9);
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
  $span.append($selectSpan);
  $span.append($radio2span);
  $span.append($radio3span);
  $span.append($radio4span);
  $parent.append($span);

  $select.selectmenu({ select: onSelectFunctionOption, width: width || "230px", height: "28px" });
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

addQualifier = function($parent, cif, name, value) {
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
  $span.addClass("fix-down");
  $parent.append($span);

  $select.selectmenu({ select: onSelectQualifierOption, width: "50px", height: "28px" });
};

// (*)createFunctionItem
addBodyItem = function(node, cif, text, value) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");

    // CIF
    headText.attr("name", "cif"); // new
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '34px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '450px', height: '34px', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");

    div.append(desc);
    addFunctionOptions(div, cif, "selectmenu1", Array.isArray(value) ? value[0] : 0);
    div.addClass("enclosed");

    node.append(div);
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
    headLabel.css({ width: '110px', height: '30px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '30px', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");
    div.append(desc);

    addFunctionOptions(div, cif, "selectmenu1", Array.isArray(values) ? values[0] : 0, options1, "50px");
    addQualifier(div, cif, "selectmenu2", Array.isArray(values) ? values[1] : 0, options2, "50px");
    addQualifier(div, cif, "selectmenu3", Array.isArray(values) ? values[2] : 0, options2, "50px");
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
    var options1 = [ 1, 2, 3, 4 ];
    var options2 = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    // CIF
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '30px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '30px', 'white-space': 'nowrap',
      'overflow': 'hidden', 'text-overflow': 'ellipsis', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");
    div.append(desc);

    addQualifier(div, cif, "selectmenu1", Array.isArray(values) ? values[0] : 0, options1, "50px");
    addQualifier(div, cif, "selectmenu2", Array.isArray(values) ? values[1] : 0, options2, "50px");
    addQualifier(div, cif, "selectmenu3", Array.isArray(values) ? values[2] : 0, options2, "50px");
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

  console.log("page, ", JSON.stringify(page));
  titles.forEach(function(title, n) {
    var $a = $("<a/>", {
      href : "/cif/capitulo/" + chapter + "/pagina/" + n,
      text : title
    });
    // console.log("a=", $a, "title=", title);
    var $title = $("<h3/>");
    var $div = $("<div/>");
    var $p = $("<p/>");

    if (n == 0) {
      populateCIF($div, page, data);
      _preloadedPage[$a.attr("href")] = true;
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
      var $p = $(ui.newHeader[0]).parent().find('p');
      var url = $(ui.newHeader[0]).children('a').attr('href');
      if (url != undefined && !(url in _preloadedPage)) {
        $.post(url, { id: id }, function (result) {
          var page = result.page;
          var data = result.data;
          populateCIF($p, JSON.parse(page), JSON.parse(data), true);
        });
        _preloadedPage[url] = true;
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

  // console.log("page =", page);
  page.forEach(function(group) {
    if (group == null)
      return;

    // console.log("cif = ", group.cif, "desc = ", group.description);
    if (group.items.length > 0) {
      addTopic(anchor, group.description, group.cif);
      group.items.forEach(function(item) {
        // console.log("item = " + map[item.cif]);
        switch (item.cif[0]) {
          case 'b':
            addBodyItem(anchor, item.cif, item.description, map[item.cif]);
            break;
          case 's':
            addStructureItem(anchor, item.cif, item.description, map[item.cif]);
            break;
          case 'd':
            addDevelopmentItem(anchor, item.cif, item.description, map[item.cif]);
        }
      });
    } else {
      console.log("caso2", JSON.stringify(group));
      switch (group.cif[0]) {
        case 'b':
          addBodyItem(anchor, group.cif, group.description, map[group.cif]);
          break;
        case 's':
          addStructureItem(anchor, group.cif, group.description, map[group.cif]);
          break;
        case 'd':
          addDevelopmentItem(anchor, group.cif, group.description, map[group.cif]);
      }
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
