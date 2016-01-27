#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
#pacientes = db.pacientes

cif = []

for cif1st in itens.find().sort('cif'): # 1o nível

    if 'items' in cif1st and len(cif1st['items']) > 0:

        for cif2nd in cif1st['items']: # 2o nível

            if cif2nd['cif'][:cif2nd['cif'].len - 1] != cif1st['cif']:
                print "%s != %s" % (cif2nd['cif'], cif1st['cif'])
