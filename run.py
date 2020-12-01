from flask import Flask, redirect, render_template
from interface import interface

app = Flask(__name__)
app.register_blueprint(interface, url_prefix='/interface')


@app.route('/')
def index():
    return render_template('interface_debug.html')


if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)