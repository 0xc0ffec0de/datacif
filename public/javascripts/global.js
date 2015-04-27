// Funções comuns

onChangeCID = function(input) {
  var address = "/cid/descricao/" + input.val();
  console.log("address = " + address);
  $.get(address, function(response) {
    console.log("response = ", response);
  });
}

//
onSelectMenu = function(e, ui) {
  var select = $(this);
  var option = select.find("option:selected").val().match(/\d/);
  var div = $(this).parent().parent();
  var span = div.find("span[name='cif']");
  var cif = span.text();
  var pacient = window.location.href.match(/[0-9a-z]+$/);

  if (pacient != undefined && option != undefined) {
    var address = "/cif/save";
    var data = { p: pacient, c: cif, v: option };

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

createFunctionalityOptions = function(cif, name) {
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
        var option = $("<option>" + options[i] + "</option>");
        select.append(option);
    }

    return select;
}

// (*)createFunctionItem
addBodyItem = function(node, cif, text) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu = createFunctionalityOptions(cif, "selectmenu");

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
createStructureItem = function(node, cif, text) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu1 = createFunctionalityOptions(cif, "selectmenu1");
    var selectMenu2 = createFunctionalityOptions(cif, "selectmenu2");
    var selectMenu3 = createFunctionalityOptions(cif, "selectmenu3");

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
createDevelopmentItem = function(node, cif, text) {
    var div = $("<div id='" + cif + "'>");
    var desc = $("<span id='" + cif + "-radio'>");

    var head = $("<input type='radio' id='" + cif + "-radio-head'>");
    var headLabel = $("<label>");
    var headText = $("<span>");

    var tail = $("<input type='radio' id='" + cif + "-radio-desc'>");
    var tailLabel = $("<label>");
    var tailText = $("<span>");

    var span = $("<span id='" + cif + "-span'>");
    var selectMenu1 = createFunctionalityOptions(cif, "selectmenu1");
    var selectMenu2 = createFunctionalityOptions(cif, "selectmenu2");

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
}
addSeparator = function(node) {
    var sep = $("<p>&nbsp;</p>");
    node.append(sep);
};

parseCIF = function(line) {
    if (/\(\w[0-9]+\)/.test(line)) {
        var match = line.match(/(.*)\((\w[0-9]+)\)/);
        return [match[1], match[2]]; // line.match(/b[0-9]+/)[0];
    }
}

selectCIF = function(queries, anchor) {
  console.log(queries);

  queries.forEach(function(query) {
    var address = "/cif/itens/" + query;
    console.log(address);

    $.get(address, function(group) {
      console.log(group);
      addTopic(anchor, group.description, group.cif);

      group.items.forEach(function(item) {
        addBodyItem(anchor, item.cif, item.description);
      });

    });

  });
}
