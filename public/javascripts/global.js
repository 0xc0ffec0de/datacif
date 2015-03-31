// Funções comuns

//
onSelectMenu = function(e, ui) {
    var li = e.currentTarget;
    var select = $(this);
    //b = ui.selectTarget;
    //console.log("this.q = [" + select.text() + "]");
    var a = select.find("span.ui-selectmenu-text");

    //a.html("a");
    console.log("a = ", a.html());
    //console.log("e = ", e);
    //console.log("ui = ", ui);
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

selectCIF = function(queries, anchor, func) {
  console.log(queries);

  queries.forEach(function(query) {
    var address = "/cif/items/" + query;
    console.log(address);

    $.get(address, function(group) {
      console.log(group);
      addTopic(anchor, group.description, group.cif);

      group.items.forEach(function(item) {
        func(anchor, item.cif, item.description);
      });

    });

  });
}

// Faz parsing do arquivo contendo tabela CIF lida do arquivo XCL.
processCIF = function(url, anchor, func) {

    $.get(url, function(data) {
        var lines = data.split("\n");
        var maybeTitle = true;
        var oldLine;

        for (i = 0; i < lines.length; ++i) {
            var line = lines[i].split("\t");

            // Linha pode ser um título? Sim.
            if (line.length > 1 && line[1].length == 0) {
                if (maybeTitle && oldLine) {
                    cif = parseCIF(oldLine[0]);
                    // Imprime linha antiga como item já que a próxima linha pode ser um título.
                    console.log("ITEM1: ", cif, oldLine[0]);
                    func(anchor, cif[1], cif[0]);
                }

                maybeTitle = true;
                oldLine = line;

            // Não.
            } else if (line.length > 1) {
                if (maybeTitle && oldLine) {
                    addSeparator(anchor);
                    // Se a próxima linha é um item e a anterior pode ser um título, imprime linha anterior como título.
                    console.log("TITLE: ", oldLine[0]);
                    addTopic(anchor, oldLine[0]);
                }

                maybeTitle = false;
                // Se linha anterior é um item, imprime esta linha como item também.
                console.log("ITEM2: ", line[0], line[1]);
                func(anchor, line[0], line[1]);

            } else if (line[0].length > 0) {
                cif = parseCIF(line[0]);
                // Por exclusão, linha é um item.
                func(anchor, cif[1], cif[0]);
            }
        }

        if (maybeTitle && oldLine) {
            cif = parseCIF(oldLine[0]);
            // Última linha não pode ser título, então imprime como item.
            console.log("ITEM3: ", line[0], line[1]);
            func(anchor, cif[1], cif[0]);
        }
    });
};
