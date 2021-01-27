import re
import requests
import pymongo
from flask import Blueprint, render_template, jsonify, request
from config import MONGO_IP
from interface.service import Assert
from common import generate_id, MongoDB

interface = Blueprint('interface', __name__, static_folder='interface_static', template_folder='interface_templates')
db = MongoDB(MONGO_IP, 27017)


@interface.route('/debug')
def page_debug():
    return render_template('interface_debug.html')


@interface.route('/edit/<id>')
def page_edit(id):
    return render_template('interface_edit.html')


@interface.route('/api/v2/load_api', methods=['POST'])
def load_api():
    data = request.get_json()
    db.switch_database_collection('interface', 'api')
    return jsonify({
        'status_code': 200,
        'message': 'ok',
        'data': db.find_one(data)
    })


@interface.route('/api_list')
def page_api_list():
    return render_template('interface_api_list.html')


@interface.route('/api/v1/api_list', methods=['POST'])
def get_api_list():
    db.switch_database_collection('interface', 'api')
    data = request.values.to_dict()
    print(data)

    page_size = int(data.pop('limit'))
    page_no = int(data.pop('page'))

    if not data.get('team'):
        data.pop('team')
    if not data.get('product'):
        data.pop('product')
    if not data.get('version'):
        data.pop('version')

    if not data.get('title'):
        if data.get('title') == '':
            data.pop('title')
    else:
        title = data.get('title')
        # 模糊查询，须借住re模块
        data['title'] = re.compile(r'.*{}.*'.format(title))

    page_result = db.page_query(data, page_size, page_no)
    total_result = db.find_all(data)
    # 返回字段的key要与layui table保持一致
    return jsonify({
        'status': 0,
        'message': 'ok',
        'data': page_result,
        'length': len(list(total_result))
    })


@interface.route('/api/v1/delete', methods=['POST'])
def delete_api():
    data = request.get_json()
    print(data)
    db.switch_database_collection('interface', 'api')
    count = 0
    failed_list = []
    for _id in data['id_list']:
        try:
            count += db.delete({'_id': _id})
        except:
            failed_list.append(_id)
    if failed_list:
        return jsonify({
            'data': failed_list,
            'message': f'成功删除接口{count}个，失败{len(data["id_list"]-count)}个！',
            'status_code': 400
        })
    else:
        return jsonify({
            'data': data['id_list'],
            'message': f'成功删除接口{count}个！',
            'status_code': 200
        })


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
    # 1. 本地变量替换

    # 2. 临时变量替换

        # TODO: 关键字替换

    # 发起接口请求
    kwargs = {}
    if data.get('headers'):
        kwargs['headers'] = data['headers']
    if data.get('params'):
        kwargs['params'] = data['params']
    response = requests.request(method=data['method'], url=data['url'], **kwargs)
    # print(response.json())
    # 返回结果
    data['response'] = {
        'status_code': response.status_code,
        'data': response.json()
    }
    # 断言
    comp = Assert()
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


@interface.route('/api/v2/insert', methods=['POST'])
def insert_api():
    data = request.get_json()
    db.switch_database_collection('interface', 'api')
    data['_id'] = 'api_' + generate_id()
    db.insert_one(data)
    return jsonify({
        'status_code': 200,
        'message': '保存成功！',
        'data': data['_id']
    })


@interface.route('/api/v2/update', methods=['POST'])
def update_api():
    data = request.get_json()
    db.switch_database_collection('interface', 'api')
    query = {'_id': data['_id']}
    if db.update_one(query, data):
        return jsonify({
            'status_code': 200,
            'message': '保存成功！',
            'data': data['_id']
        })