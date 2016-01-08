#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
pacientes = db.pacientes
dados = db.dados


cif = []

for cif1st in itens.find().sort('cif'): # 1o nível

    if 'items' in cif1st and len(cif1st['items']) > 0:

        for cif2nd in cif1st['items']: # 2o nível
            cif.append(cif2nd['cif'])

            if 'items' in cif2nd and len(cif2nd['items']) > 0:

                for cif3rd in cif2nd['items']:
                    cif.append(cif3rd['cif'])

    elif 'description' in cif1st:
        cif.append(cif1st['cif'])

print cif
db.ordem.insert(cif)
