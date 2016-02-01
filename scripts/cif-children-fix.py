#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
#pacientes = db.pacientes

new = []
cif = []

for cif1st in itens.find().sort('cif'): # 1o nível
    #print cif1st

    if 'items' in cif1st and len(cif1st['items']) > 0:

        for cif2nd in cif1st['items']: # 2o nível

            if 'items' in cif2nd and len(cif2nd['items']) > 0:

                for cif3rd in cif2nd['items']: # 2o nível

                    if cif3rd['cif'][:len(cif3rd['cif']) - 1] != cif2nd['cif']:

                        #itens.insert_one(cif2nd)
                        #n = cif1st['items'].index(cif2nd)
                        #del cif1st['items'][n]
                        #itens.replace_one({ '_id' : cif1st['_id'] }, cif1st)
                        print "%s != %s" % (cif3rd['cif'], cif2nd['cif'])






