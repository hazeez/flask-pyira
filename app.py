from flask import Flask, render_template, redirect, session, flash, jsonify
import requests
from forms import LoginForm
from config import SERVER_URL

app = Flask(__name__)
app.config.from_object('config')


@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        session['username'] = form.username.data
        session['pwd'] = form.password.data
        return redirect('/index')
    return render_template('home.html',
                           title='Sign In',
                           form=form)


@app.route('/index', methods=['GET', 'POST'])
def index():
    # if the user directly enters /index without authenticating, send him back
    # to login page for authentication
    try:
        if len(session['username']) == 0:
            flash('User needs to be logged in first!')
            return redirect('/login')
    except:
        return redirect('/login')
    username = session['username']
    password = session['pwd']
    jql = '/rest/api/2/project/TEST1111'
    try:
        response = requests.get(SERVER_URL + jql,
                                verify=False,
                                auth=(username, password))
        issue_json_response = response.json()
        json_data = jsonify(issue_json_response)
    except ValueError:
        flash('Invalid credentials! Try again!')
        return redirect('/login')
    return render_template('index.html',
                           issue_json_response=json_data)


@app.route("/logout")
def logout():
    session.clear()
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
