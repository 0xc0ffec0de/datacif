#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
pacientes = db.pacientes
dados = db.dados

print '<ul>'

for cif1st in itens.find().sort('cif'): # 1o nível

    if 'cif' in cif1st:
        print '<li>%s: %s</li>' % (cif1st['cif'].encode('utf-8'), cif1st['description'].encode('utf-8'))

    if 'items' in cif1st and len(cif1st['items']) > 0:

        print '<ul>';

        for cif2nd in cif1st['items']: # 2o nível

            if 'cif' in cif2nd:
                print '<li>%s: %s</li>' % (cif2nd['cif'].encode('utf-8'), cif2nd['description'].encode('utf-8'))

            if 'items' in cif2nd and len(cif2nd['items']) > 0:

                print '<ul>';

                for cif3rd in cif2nd['items']:

                    print '<li>%s: %s</li>' % (cif3rd['cif'].encode('utf-8'), cif3rd['description'].encode('utf-8'))

                print '</ul>'

        print '</ul>'

print '</ul>'
