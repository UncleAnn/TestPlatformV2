from flask import Blueprint, render_template, jsonify, request

interface = Blueprint('interface', __name__, static_folder='interface_static', template_folder='interface_templates')


@interface.route('/debug')
def page_debug():
    return render_template('interface_debug.html')


@interface.route('/api_list')
def page_api_list():
    return render_template('interface_api_list.html')


@interface.route('/suite_list')
def page_suite_list():
    return render_template('interface_suite_list.html')


@interface.route('/report')
def page_report():
    return render_template('interface_report.html')


@interface.route('/save_request')
def save_request():
    data = request.json()
    print(data)
    return jsonify({
        'status_code': 200,
        'message': '保存成功！',
        'data': data
    })