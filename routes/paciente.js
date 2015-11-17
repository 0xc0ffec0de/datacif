module.exports = function(app, passport) {
  var express   = require('express');
  var router    = express.Router();
  var ObjectId  = require('mongolian').ObjectId;
  var mongodb   = require('mongodb');

  router.get('/', app.isLoggedIn, function(req, res) {
    // res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.get('/lista', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var pacientes = db.collection('pacientes');
    pacientes.find().sort({ 'nome' : 1 }).toArray(function(err, item) {

      if (err) {
        res.send("Erro ao tentar listar pacientes");
      }

      res.render('pacientes', {
        title : 'Lista de sujeitos',
        pacientes : item
      });
    });
  });

  router.get('/edita/:id', app.isLoggedIn, function(req, res) {
    var id = req.params['id'];
    var db = req.db;
    var pacientes = db.collection('pacientes');

    // pacientes.findOne({ _id: id }, {}, function(err, item) {
    pacientes.findOne({ _id: new ObjectId(id) }, function(err, item) {
      if (err) {
        res.send("Erro ao tentar editar um paciente");
      } else if (item) {
        var queryResult = {
          title           : "Edita paciente",
          _id             : item._id,
          nome            : item.nome,
          dataNascimento  : item.dataNascimento,
          sexo            : item.sexo == 'm' ? true : false,
          peso            : item.peso,
          altura          : item.altura,
          cpf             : item.cpf,
          dependente      : item.dependente,
          logradouro      : item.endereco.logradouro,
          complemento     : item.endereco.complemento,
          bairro          : item.endereco.bairro,
          cep             : item.endereco.cep,
          registros       : item.registros,
          morbidades      : item.morbidades,
          anamnese        : item.anamnese ? item.anamnese : '',
          address         : '/paciente/altera'
        };

        console.log("[edt]paciente = ", queryResult);
        res.render('paciente', queryResult);
      } else {
        res.send({});
      }
    });
  });

  router.get('/novo', app.isLoggedIn, function(req, res) {
    res.render('paciente', {
      title           : 'Adiciona novo paciente',
      _id             : '',
      nome            : '',
      dataNascimento  : '',
      sexo            : true,
      peso            : '',
      altura          : '',
      cpf             : '',
      dependente      : false,
      registros       : '',
      logradouro      : '',
      complemento     : '',
      bairro          : '',
      cep             : '',
      morbidades      : [],
      anamnese        : '',
      address         : '/paciente/adiciona'
    });
  });

  router.get('/adiciona', app.isLoggedIn, function(req, res) {
    res.redirect("/paciente/lista");
  });

  router.post('/adiciona', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    if (values && values.length > 0) {
      values.forEach(function(value, i) {
        registros.push({ nome: labels[i], valor: value });
      });
    }

    var paciente = {
      nome            : req.body.nome,
      dataNascimento  : req.body.dataNascimento,
      sexo            : req.body.sexo,
      peso            : req.body.peso,
      altura          : req.body.altura,
      cpf             : req.body.cpf,
      dependente      : req.body.dependente == 't' ? true : false,
      registros       : registros,
      morbidades      : req.body.morbidades.slice(1, req.body.morbidades.length),
      anamnese        : req.body.anamnese
    };

    var endereco = {
      logradouro  : req.body.logradouro,
      complemento : req.body.complemento,
      bairro      : req.body.bairro,
      cep         : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[add]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.insert(paciente, function(err, item) {
      if (err) {
        res.send("Erro ao tentar inserir um novo paciente");
      } else {
        var id = item._id.toString();
        // res.location("/paciente/dominio/" + id);
        res.redirect("/paciente/" + id + "/dominio");
      }
    })
  });

  router.get('/altera', app.isLoggedIn, function(req, res) {
    res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.post('/altera', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var id = new ObjectId(req.body._id);

    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    if (values && values.length > 0) {
      values.forEach(function(value, i) {
        registros.push({ nome: labels[i], valor: value });
      });
    }

    var paciente = {
      nome            : req.body.nome,
      dataNascimento  : req.body.dataNascimento,
      sexo            : req.body.sexo,
      peso            : req.body.peso,
      altura          : req.body.altura,
      cpf             : req.body.cpf,
      dependente      : req.body.dependente == 't' ? true : false,
      registros       : registros,
      morbidades      : req.body.morbidades.slice(1, req.body.morbidades.length),
      anamnese        : req.body.anamnese
    };

    var endereco = {
      logradouro  : req.body.logradouro,
      complemento : req.body.complemento,
      bairro      : req.body.bairro,
      cep         : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[alt]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.update({ _id: id }, paciente,
      function(err, doc) {
        if (err) {
          res.send("Erro ao tentar alterar um paciente");
        } else {
          res.redirect("/paciente/" + id + "/dominio");
        }
      });
  });

  // Menu inicial.
  router.get('/:id/dominio', app.isLoggedIn, function(req, res) {
    var db = req.db2;
    var pacientes = db.collection('pacientes');
    var id = req.params['id'];

    pacientes.aggregate([
      { $match : { _id : mongodb.ObjectId(id) } },
      { $project : { _id : 0, sexo : 1 } },
    ], function(err, result) {
      console.log("result = ", result);
      if (err) {
        res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
      } else if (result) {
        var sexo = result.pop().sexo;
        // res.render("dominio", { id : req.params['id'] });
        res.render("dominio",
          {
            id      : req.params['id'],
            sex     : sexo ? sexo : 'm'
          });
        }
      }
    );
  });

  // Menu de função e estrutura.
  router.get('/:id/funcao_e_estrutura', app.isLoggedIn, function(req, res) {
    var db = req.db2;
    var pacientes = db.collection('pacientes');
    var id = req.params['id'];

    pacientes.aggregate([
      { $match : { _id : mongodb.ObjectId(id) } },
      { $project : { _id : 0, sexo : 1 } },
    ], function(err, result) {
      console.log("result = ", result);
      if (err) {
        res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
      } else if (result) {
        var sexo = result.pop().sexo;
        res.render("funcao_e_estrutura",
          {
            id      : req.params['id'],
            address : '/cif/capitulo/',
            sex     : sexo ? sexo : 'm'
          });
        }
      }
    );
  });

  // Menu de atividade e partipação.
  router.get('/:id/atividade_e_participacao', app.isLoggedIn, function(req, res) {
    res.render("atividade_e_participacao", {
      id      : req.params['id'],
      address : '/cif/capitulo/'
    });
  });

  // Menu de ambiente.
  router.get('/:id/ambiente', app.isLoggedIn, function(req, res) {
    res.render("ambiente", {
      id      : req.params['id'],
      address : '/cif/capitulo/'
    });
  });

  fillZeroData = function(db, pacient) {
    var itens = db.collection('itens');
    var id = req.params['id'];

    pacientes.aggregate([
      { $match : { _id : mongodb.ObjectId(id) } }
    ], function(err, result) {
      if (err) {
        res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
      } else if (result) {
        result.forEach(function(pacient) {
          pacient.cif = {};

          dados.aggregate([
            { $match : { p : String(pacient._id) } },
            { $sort  : { c : 1 } }
          ], function(err, result) {
            if (err) {
              res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
            } else {
              result.forEach(function(datum, index) {});
            }
          }
        );
      })
    }})
  };

  repeat = function(s, n) {
    var a = [];
    while (a.length < n) {
      a.push(s);
    }

    return a.join('');
  }

  writePositionalValue = function(pos, max, value) {
    var data = "";
    var separator = ",0";

    console.log("writePositionalValue(%s,%s,%s)", pos, max, value);
    if (pos < max) {
      data += repeat(separator, pos + 1);
      data += value;
      data += repeat(separator, max - pos - 1);
    }

    return data;
  }

  // Gera planilha em formato csv.
  serializePacientData = function(pacient, separator) {
    console.log("pacient =", pacient);

    if (separator == null) {
      separator = ',';
    }

    // Título dos dados.
    data  = "Nome" + separator;
    data += "Data de Nascimento" + separator;
    data += "Gênero" + separator;
    data += "Peso" + separator;
    data += "Altura" + separator;
    data += "CPF" + separator;
    data += "Dependente";
    data += "\n";

    // Informações do paciente.
    data += pacient.nome + separator;
    data += pacient.dataNascimento + separator;
    data += pacient.sexo + separator;
    data += pacient.peso + separator;
    data += pacient.altura + separator;
    data += pacient.cpf + separator;
    data += pacient.dependente ? "sim" : "não";
    data += "\n\n";

    // Registros
    data += "Registros\n";
    pacient.registros.forEach(function(registro) {
      data += registro.nome + separator + registro.valor + separator;
    });
    data += "\n";

    // Morbidades
    data += "Morbidades\n";
    if (pacient.morbidades.length != 0) {
      pacient.morbidades.forEach(function(morbidade) {
        data += morbidade + separator
      });
    }
    data += "\n";

    // Anamnese
    data += "Anamnese\n";
    data += pacient.anamnese + separator;
    data += "\n";

    // CIF
    bodyTitle = false;
    structureTitle = false;
    dTitle = false;
    data += "CIF\n";

    for (var key in pacient.cif) {
      var values = pacient.cif[key];
      //console.log("values =", typeof values, values, Array.isArray(values));

      if (key[0] == 'b') {
        var codes = [0, 1, 2, 3, 4, 8, 9];
        var value = parseInt(values.pop());

        if (!bodyTitle) {
          for (var index in codes) {
            data += separator + codes[index];
          }
          data += "\n";
          bodyTitle = true;
        }
        data += key;
        data += writePositionalValue(codes.indexOf(value), codes.length, 1);
        data += "\n";
      }
      else if (key[0] == 's')
      {
        var codes = [0, 1, 2, 3, 4, 8, 9]
        var position = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var value1 = parseInt(values.pop());
        var value2 = parseInt(values.pop());
        var value3 = parseInt(values.pop());

        if (!structureTitle) {
          for (var index in codes) {
            data += separator + codes[index];
          }
          for (var index in position) {
            data += separator + position[index];
          }
          for (var index in position) {
            data += separator + position[index];
          }
          data += "\n";
          structureTitle = true;
        }

        data += key;
        data += writePositionalValue(codes.indexOf(value1), codes.length, 1);
        data += writePositionalValue(position.indexOf(value2), position.length, 1);
        data += writePositionalValue(position.indexOf(value3), position.length, 1);
        data += "\n";
      }
      else if (key[0] == 'd') {
        var codes = [0, 1, 2, 3, 4, 8, 9];
        var value = parseInt(values.pop());

        if (!dTitle) {
          for (var index in codes) {
            data += separator + codes[index];
          }
          data += "\n";
          dTitle = true;
        }
        data += key;
        data += writePositionalValue(codes.indexOf(value), codes.length, 1);
        data += "\n";
      }

//      else if (key[0] == 'd')
//      {
//        data += '.';
//
//        // HERE
//        values.forEach(function(value) {
//          data += value;
//        });
//
//        data += separator;
//      }
//      else if (key[0] == 'e')
//      {
//        var value = values.pop();
//
//        if (value < 0)
//          data += '.' + Math.abs(value) + separator;
//        else
//          data += '+' + value + separator;
//      }
    }

    return data;
  };

  sortObject = function(aObject) {
    var keys = Object.keys(aObject).sort();
    var sorted = [];

    for (key in keys) {
      var property = keys[key];
      sorted[property] = aObject[property];
    }

    return sorted;
  };

  // Monta tabela CIF.
  router.get('/:id/data', app.isLoggedIn, function(req, res) {
    var db = req.db2;
    var pacientes = db.collection('pacientes');
    var dados = db.collection('dados');
    var id = req.params['id'];

    pacientes.aggregate([
      { $match : { _id : mongodb.ObjectId(id) } }
    ], function(err, result) {
      if (err) {
        res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
      } else if (result) {
        result.forEach(function(pacient) {
          pacient.cif = {};

          dados.aggregate([
            { $match : { p : null } },
            { $sort  : { c : 1 } },
          ], function(err, generic) {
            if (err) {
              console.log('Erro ao ler dados de paciente');
              res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente default') });
            } else {
              generic.forEach(function(datum, index) {
                pacient.cif[datum.c] = datum.v;

                // Terminado?
                if (index == generic.length - 1) {
                  dados.aggregate([
                    { $match : { p : String(pacient._id) } },
                    { $sort  : { c : 1 } }
                  ], function(err, result) {
                    if (err) {
                      res.render('/lista', { messages: req.flash('Erro ao ler dados de paciente') });
                    } else {
                      result.forEach(function(datum, index) {
                        console.log("rewriting: ", datum.c, ':', datum.v)
                        pacient.cif[datum.c] = datum.v;

                        // Envia como arquivo.
                        if (index == result.length - 1) {
                          // Ordena objeto contendo CIF.
                          pacient.cif = sortObject(pacient.cif);
                          var csvData = serializePacientData(pacient);
                          res.set({
                            'Content-Disposition': 'attachment; filename=sujeito.csv',
                            'Content-type': 'text/csv'
                          });
                          res.send(csvData);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  });

  return router;
};
