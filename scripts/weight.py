#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens

for cif1st in itens.find(): # 1o nível
    weight = 0
    n_2nd = 0

    if 'items' in cif1st and len(cif1st[u'items']) > 0:

        for cif2nd in cif1st[u'items']: # 2o nível
            n_3rd = 0

            if 'items' in cif2nd and len(cif2nd[u'items']) > 0:
                sub_weight = 0

                for cif3rd in cif2nd[u'items']:
                    cif1st[u'items'][n_2nd][u'items'][n_3rd][u'w'] = '1'
                    sub_weight += 1
                    print "cif(3): " + cif3rd.__str__()
                    changed = True
                    n_3rd += 1

                cif1st[u'items'][n_2nd][u'w'] = sub_weight
                weight += sub_weight
                changed = True;
            else:
                cif1st[u'items'][n_2nd][u'w'] = '1'
                weight += 1
                changed = True;

            print "cif(2): ", n_2nd, cif2nd.__str__()
            n_2nd += 1

    elif 'description' in cif1st:
        db.itens.update({ u'_id': cif1st[u'_id'] }, { '$set': { u'w': 1 } })
        print; print "cif(1): " + cif1st.__str__()

    if changed:
        cif1st[u'w'] = weight
        result = db.itens.find_and_modify({ u'_id': cif1st[u'_id'] }, cif1st )
        print "result: " + result.__str__(); print
        changed = False

