from flask import Flask, render_template, redirect, session, flash, jsonify
import requests
from forms import LoginForm
from config import SERVER_URL

app = Flask(__name__)
app.config.from_object('config')


@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        session['username'] = form.username.data
        session['pwd'] = form.password.data
        global username, password
        username = session['username']
        password = session['pwd']
        return redirect('/index')
    return render_template('home.html',
                           title='Sign In',
                           form=form)


def get_response(jql):
    response = requests.get(SERVER_URL + jql,
                            verify=False,
                            auth=(username, password))
    return response


@app.route('/index', methods=['GET', 'POST'])
def index():
    # if the user directly enters /index without authenticating, send him back
    # to login page for authentication
    try:
        if not username:
            flash('Login Required!')
            return redirect('/login')
    except:
        return redirect('/login')
    # if the user is authenticated in jira - redirect to index
    # else ask user to try again
    try:
        jql = '/rest/api/2/project'
        response = get_response(jql)
        project_data = response.json()
    except ValueError:
        flash('Invalid credentials! Try again!')
        return redirect('/login')
    return render_template('index.html',
                           project_data=project_data)


@app.route('/index/<project_key>/<int:num>/', methods=['GET', 'POST'])
def project_issues(project_key, num):
    jql = ''
    if (num == 1):
        jql = '/rest/api/2/search?jql=project=%s' % (project_key)
    else:
        start_at = 50 * (num - 1)  # if the page is 2, then start at should be
        # from 50
        jql = '/rest/api/2/search?jql=project=%s&startAt=%d' % (project_key,
                                                                start_at)
    response = get_response(jql)
    # response_data = response.json()['total']
    issue_data = jsonify(response.json())
    return issue_data


@app.route("/logout")
def logout():
    session.clear()
    flash('You have successfully logged out')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
