#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens
pacientes = db.pacientes
dados = db.dados

print "<ul>"

for cif1st in itens.find().sort('cif'): # 1o nível

    if 'cif' in cif1st:
        print "<li>%s: %s</li>\n" % (cif1st['cif'], cif1st['description'])

    if 'items' in cif1st and len(cif1st['items']) > 0:

        print "<ul>\n";

        for cif2nd in cif1st['items']: # 2o nível

            if 'cif' in cif2nd:
                print "<li>%s: %s</li>\n" % (cif2nd['cif'], cif2nd['description'])

            if 'items' in cif2nd and len(cif2nd['items']) > 0:

                print "<ul>\n";

                for cif3rd in cif2nd['items']:

                    print "<li>%s: %s</li>\n" % (cif3rd['cif'], cif3rd['description'])

                print "</ul>"

        print "</ul>"

print "</ul>"
