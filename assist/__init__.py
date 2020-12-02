from flask import Blueprint, request, jsonify, render_template

assist = Blueprint('assist', __name__, static_folder='assist_static', template_folder='assist_templates')
@assist.route('/variable_list')
def variable_list():
    return render_template('variable.html')