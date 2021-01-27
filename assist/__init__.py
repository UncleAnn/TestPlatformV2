import re
from flask import Blueprint, request, jsonify, render_template
from common import MongoDB, generate_id
from config import MONGO_IP

assist = Blueprint('assist', __name__, static_folder='assist_static', template_folder='assist_templates')
db = MongoDB(MONGO_IP, 27017)


@assist.route('/variable_list')
def page_variable_list():
    return render_template('variable_list.html')


@assist.route('/keyword')
def keyword_debug():
    return render_template('keyword_debug.html')


@assist.route('/keyword_list')
def keyword_list():
    return render_template('keyword_list.html')


@assist.route('/api/v2/variable_list', methods=['POST'])
def get_variable_list():
    data = request.values.to_dict()
    db.switch_database_collection('assist', 'variables')

    page_size = int(data.pop('limit'))
    page_no = int(data.pop('page'))

    if not data.get('team'):
        data.pop('team')
    if not data.get('product'):
        data.pop('product')
    if not data.get('version'):
        data.pop('version')

    if not data.get('variable'):
        if data.get('variable') == '':
            data.pop('variable')
    else:
        variable = data.get('variable')
        # 模糊查询，须借住re模块
        data['variable'] = re.compile(r'.*{}.*'.format(variable))

    page_result = db.page_query(data, page_size, page_no)
    total_result = db.find_all(data)

    return jsonify({
        'data': page_result,
        'message': 'ok',
        'status': 0,
        'length': len(total_result)
    })


@assist.route('/api/v2/add_variable', methods=['POST'])
def add_variable():
    data = request.get_json()
    data['_id'] = 'var_' + generate_id()
    # 根据产品和变量名判断是否已存在变量
    db.switch_database_collection('assist', 'variables')
    variable = db.find_one({'variable': data['variable'], 'product': data['product']})
    if variable:
        return jsonify({
            'status': 400,
            'message': '已存在同名变量！',
            'data': variable['_id']
        })
    new_variable = db.insert_one(data)
    if new_variable.inserted_id:
        return jsonify({
            'status': 200,
            'message': 'ok',
            'data': new_variable.inserted_id
        })
