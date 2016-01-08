#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
pacientes = db.pacientes
dados = db.dados

def fill_cif_type(cif, dados):
    if cif.startswith(u'b'):
        dados[ u'v' ].append(0)
    elif cif.startswith(u'e'):
        dados[ u'v' ].append(0)
    elif cif.startswith(u'p'):
        dados[ u'v' ].append(0) # 2
        dados[ u'v' ].append(0)
    elif cif.startswith(u's'):
        dados[ u'v' ].append(0) # 3
        dados[ u'v' ].append(0)
        dados[ u'v' ].append(0)
    elif cif.startswith(u'd'):
        dados[ u'v' ].append(0) # 4
        dados[ u'v' ].append(0)
        dados[ u'v' ].append(0)
        dados[ u'v' ].append(0)

    return dados


for cif1st in itens.find(): # 1o nível

    if 'items' in cif1st and len(cif1st[u'items']) > 0:

        for cif2nd in cif1st[u'items']: # 2o nível

            if 'items' in cif2nd and len(cif2nd[u'items']) > 0:

                for cif3rd in cif2nd[u'items']:
                    dados = dict()
                    dados[u'_id'] = cif3rd[u'cif']
                    dados[ u'c' ] = cif3rd[u'cif']
                    dados[ u'p' ] = None
                    dados[ u'v' ] = list()
                    fill_cif_type(cif3rd[u'cif'], dados)
                    db.dados.save(dados)
            else:
                dados = dict()
                dados[u'_id'] = cif2nd[u'cif']
                dados[ u'c' ] = cif2nd[u'cif']
                dados[ u'p' ] = None
                dados[ u'v' ] = list()
                fill_cif_type(cif2nd[u'cif'], dados)
                db.dados.save(dados)

    elif 'description' in cif1st:
        dados = dict()
        dados[u'_id'] = cif1st[u'cif']
        dados[ u'c' ] = cif1st[u'cif']
        dados[ u'p' ] = None
        dados[ u'v' ] = list()
        fill_cif_type(cif1st[u'cif'], dados)
        db.dados.save(dados)
