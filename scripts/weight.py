#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import sys

client = MongoClient('mongodb://localhost:27017')
db = client.pf
itens = db.itens

for cif1st in itens.find(): # 1o nível

    if 'items' in cif1st and len(cif1st[u'items']) > 0:
        for cif2nd in cif1st[u'items']:
            print "cif(2): " + cif2nd.__str__()

            if 'items' in cif2nd and len(cif2nd[u'items']) > 0:
                for cif3rd in cif2nd[u'items']:
                    print "cif(3): " + cif3rd.__str__()

    elif 'description' in cif1st:
        cif1st[u'w'] = 1;
        db.itens.update({u'_id': cif1st[u'_id']}, { '$set': { u'w': 1 } })
        print; print "cif(1): " + cif1st.__str__()

