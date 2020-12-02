from flask import Flask, redirect, render_template, url_for
from interface import interface
from assist import assist

app = Flask(__name__)
app.register_blueprint(interface, url_prefix='/interface')
app.register_blueprint(assist, url_prefix='/assist')


@app.route('/')
def index():
    return redirect(url_for('interface.page_debug'))


if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)