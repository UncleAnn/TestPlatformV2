from flask import Flask, redirect, url_for
from interface import interface
from information import information
from assist import assist

app = Flask(__name__)
app.register_blueprint(interface, url_prefix='/interface')
app.register_blueprint(information, url_prefix='/information')
app.register_blueprint(assist, url_prefix='/assist')


@app.route('/')
def index():
    return redirect(url_for('interface.page_debug'))


if __name__ == '__main__':
    app.run('127.0.0.1', debug=True, port=23333)