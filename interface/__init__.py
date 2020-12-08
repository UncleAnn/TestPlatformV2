import re
import requests
import pymongo
from flask import Blueprint, render_template, jsonify, request
from config import MONGODB
from interface.compare import Compare
from common import generate_id

interface = Blueprint('interface', __name__, static_folder='interface_static', template_folder='interface_templates')


@interface.route('/debug')
def page_debug():
    return render_template('interface_debug.html')


@interface.route('/edit/<id>')
def edit_page(id):
    return render_template('interface_edit.html')


@interface.route('/api/v1/load_api', methods=['POST'])
def load_api():
    data = request.get_json()
    print(data)
    mongo_client = pymongo.MongoClient(MONGODB, 27017)
    mongo_db = mongo_client.get_database('interface')
    mongo_collection = mongo_db.get_collection('api')
    api = mongo_collection.find_one(data)
    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': api
    })


@interface.route('/api_list')
def page_api_list():
    return render_template('interface_api_list.html')


@interface.route('/suite_list')
def page_suite_list():
    return render_template('interface_suite_list.html')


@interface.route('/report')
def page_report():
    return render_template('interface_report.html')


@interface.route('/api/v1/send_request', methods=['POST'])
def send_request():
    data = request.get_json()
    for i in data.items():
        print(i)
    # TODO: 变量替换

    # TODO: 关键字替换

    # 发起接口请求
    kwargs = {}
    if data.get('headers'):
        kwargs['headers'] = data['headers']
    if data.get('params'):
        kwargs['params'] = data['params']
    response = requests.request(method=data['method'], url=data['url'], **kwargs)
    # 返回结果
    data['response'] = {
        'status_code': response.status_code,
        'data': response.json()
    }
    # TODO: 断言
    comp = Compare()
    for assert_item in data['assert']:
        # 断言状态码，只做相等判断
        if assert_item['type'] == 'status_code':
            assert_item['result'] = assert_item['value'] == str(response.status_code)
        # 断言响应体，使用反射精简代码
        else:
            # 解析断言表达式 $.data.cross_list.0.weight
            actual = response.json()
            try:
                expr = re.match(r'\$\..+', assert_item['expr']).group()
            except AttributeError as e:
                print(e)
            else:
                for part in expr[2:].split('.'):
                    # 优先使用key
                    try:
                        actual = actual[str(part)]
                    # 使用key出错，使用索引
                    except:
                        actual = actual[int(part)]
            func = getattr(comp, assert_item['condition'])
            assert_item.setdefault('result', func(str(actual), assert_item['value']))
    # TODO: 变量提取
    return jsonify({
        'status_code': 200,
        'message': '请求成功！',
        'data': data
    })


"""
https://ditu.amap.com/service/regeo
latitude=31.315590522490712
longitude=121.04925573429551
"""


@interface.route('/api/v1/save_request', methods=['POST'])
def save_request():
    data = request.get_json()
    print(data)
    mongo_client = pymongo.MongoClient(MONGODB, 27017)
    mongo_db = mongo_client.get_database('interface')
    mongo_collection = mongo_db.get_collection('api')
    data['_id'] = 'api_' + generate_id()
    mongo_collection.insert_one(data)
    mongo_client.close()
    return jsonify({
        'status_code': 200,
        'message': '保存成功！',
        'data': data['_id']
    })
