import pymongo
from flask import request, jsonify, Blueprint
from config import MONGODB
from common import MongoDB
from information.service import Service

information = Blueprint('information', __name__, static_folder='information_static',
                        template_folder='information_templates')


@information.route('/team')
def team():
    service = Service()
    service.db_search()
    mongo_client = pymongo.MongoClient(MONGODB, 27017)
    mongo_db = mongo_client.get_database('information')
    mongo_collection = mongo_db.get_collection('version')
    pipeline = [{"$group": {"_id": "$team"}}]
    team_list = list(mongo_collection.aggregate(pipeline))
    teams = list(t['_id'] for t in team_list)
    mongo_client.close()
    return jsonify({
        'message': 'ok',
        'status_code': 200,
        'data': teams
    })


@information.route('/product')
def product():
    data = dict(request.values)
    mongo_client = pymongo.MongoClient(MONGODB, 27017)
    mongo_db = mongo_client.get_database('information')
    mongo_collection = mongo_db.get_collection('version')
    # print(list(mongo_collection.find(data)))
    products = list(set(vs['product'] for vs in list(mongo_collection.find(data))))
    mongo_client.close()

    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': products
    })


@information.route('/version')
def version():
    data = dict(request.values)
    mongo_client = pymongo.MongoClient(MONGODB, 27017)
    mongo_db = mongo_client.get_database('information')
    mongo_collection = mongo_db.get_collection('version')
    versions = list(mongo_collection.find(data))
    mongo_client.close()

    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': versions
    })
