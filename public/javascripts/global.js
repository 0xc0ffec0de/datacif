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

//
onSelectMenu = function(e, ui) {
  console.log("onSelectMenu called.");
  var $select = $(this);
  var name = $select.attr("name")
  var num = name[name.length - 1];
  console.log("$select = ", num);
  var option = $select.find("option:selected").val().match(/\d/);
  var div = $(this).parent().parent();
  var span = div.find("label > span")[0];
  var $span = $(span);
  console.log("span =", $span.text());
  // var span = div.find("span[name='cif']");
  // console.log("span", span);
  var cif = $span.text();
  var id = $("input#id").val();

  if (id != undefined && option != undefined) {
    var address = "/cif/save/" + cif + "/" + num + "/" + option;
    var data = { id: id };

    $.post(address, data, function(response) {
      if (response['r'] != 'OK') {
        // Do stuff on error.
        console.log(response);
      }
    });
  }
}

// Escape de seletor jquery.
e = function(s) {
  return s.replace( /(:|\.|\[|\])/g, "\\$1" );
};

addTopic = function(node, text, cif) {
  var div = $("<div>");
  var label = $("<label>");

  if (cif != undefined) {
    text = text + " (" + cif + ")";
  }

  label.text(text);
  div.append(label);
  div.addClass("topic");

  node.append(div);
};

createFunctionalityOptions = function(cif, name, value) {
  value = parseInt(value);
  // if (value > 0) console.log("value = ", value);
  var select = $("<select id='" + cif + "-" + name + "'>");
  var options = [
  	"0 : funcional",
  	"1 : disfunção level",
  	"2 : disfunção moderada",
  	"3 : disfunção severa",
  	"4 : disfunção total",
  	"8 : outra disfunção especificada",
  	"9 : disfunção não especificada"
  ];

  select.attr("name", cif + "-" + name).css({ height: '59px', width: '50px' });

  for (var i = 0; i < options.length; ++i) {
    var option;

    if (value === i) {
      option = $("<option selected>" + options[i] + "</option>");
    } else {
      option = $("<option>" + options[i] + "</option>");
    }

    select.append(option);
  }

  return select;
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

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu = createFunctionalityOptions(cif, "selectmenu1", value ? value[0] : null);

    span.append(selectMenu);
    span.addClass("fix-down");

    // CIF
    headText.attr("name", "cif"); // new
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '59px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '615px', height: '59px', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");

    div.append(desc);

    div.append(span);
    div.addClass("enclosed");

    node.append(div);

    // Invoca mágica do jQuery-UI
    selectMenu.selectmenu({ select: onSelectMenu });
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

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu1 = createFunctionalityOptions(cif, "selectmenu1", values ? values[0] : null);
    var selectMenu2 = createFunctionalityOptions(cif, "selectmenu2", values ? values[1] : null);
    var selectMenu3 = createFunctionalityOptions(cif, "selectmenu3", values ? values[2] : null);

    span.append(selectMenu1);
    span.append(selectMenu2);
    span.append(selectMenu3);
    span.addClass("fix-down");

    // CIF
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '59px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '515px', height: '59px', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");

    div.append(desc);

    div.append(span);
    div.addClass("enclosed");

    node.append(div);

    // Invoca mágica do jQuery-UI
    selectMenu1.selectmenu({ select: onSelectMenu });
    selectMenu2.selectmenu({ select: onSelectMenu });
    selectMenu3.selectmenu({ select: onSelectMenu });
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

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu1 = createFunctionalityOptions(cif, "selectmenu1", values ? values[0] : null);
    var selectMenu2 = createFunctionalityOptions(cif, "selectmenu2", values ? values[1] : null);

    span.append(selectMenu1);
    span.append(selectMenu2);
    span.addClass("fix-down");

    // CIF
    headText.text(cif).addClass("ui-button-text");
    headLabel.append(headText);
    headLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left");
    headLabel.css({ width: '110px', height: '59px', 'vertical-align': 'middle' });

    // Descrição
    tailText.text(text).addClass("ui-button-text");
    tailLabel.append(tailText);
    tailLabel.addClass("ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right");
    tailLabel.css({ width: '565px', height: '59px', 'word-break': 'normal' });

    desc.append(headLabel);
    desc.append(tailLabel);
    desc.addClass("buttonset");

    div.append(desc);

    div.append(span);
    div.addClass("enclosed");

    node.append(div);

    // Invoca mágica do jQuery-UI
    selectMenu1.selectmenu({ select: onSelectMenu });
    selectMenu2.selectmenu({ select: onSelectMenu });
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
    active : false,
    heightStyle: "content",
    activate: function (e, ui) {
      var $p = $(ui.newHeader[0]).parent().find('p');
      var url = $(ui.newHeader[0]).children('a').attr('href');
      if (url != undefined && !(url in _preloadedPage)) {
        // console.log("url = ", url);
        $.post(url, { id: id }, function (result) {
          var page = result.page;
          var data = result.data;
          // console.log("data=",data);
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
        }
      });
    } else {
      switch (group.cif[0]) {
        case 'b':
          addBodyItem(anchor, group.cif, group.description, map[group.cif]);
          break;
        case 's':
          addStructureItem(anchor, group.cif, group.description, map[group.cif]);
          break;
        case 'd':
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
