import pymongo
from flask import request, jsonify, Blueprint
from config import MONGO_IP
from common import MongoDB

information = Blueprint('information', __name__, static_folder='information_static', template_folder='information_templates')
db = MongoDB(MONGO_IP, 27017)


@information.route('/team')
def team():
    db.switch_database_collection('information', 'version')
    # 得到的数据格式为 {"_id": "$team"}
    pipeline = [{"$group": {"_id": "$team"}}]
    team_list = list(db.aggregate(pipeline))
    team_list = list(t['_id'] for t in team_list)
    return jsonify({
        'message': 'ok',
        'status_code': 200,
        'data': team_list
    })


@information.route('/product')
def product():
    data = dict(request.values)
    db.switch_database_collection('information', 'version')
    products = list(set(vs['product'] for vs in list(db.find_all(data))))
    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': products
    })


@information.route('/version')
def version():
    data = dict(request.values)
    db.switch_database_collection('information', 'version')
    versions = list(vs['version'] for vs in list(db.find_all(data)))
    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': versions
    })
