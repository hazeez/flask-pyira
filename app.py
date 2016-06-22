from flask import Flask, render_template, redirect, session, flash, jsonify
import requests
from forms import LoginForm
from config import OPTIONS, SERVER_URL
from jira import JIRA

app = Flask(__name__)
app.config.from_object('config')


@app.route('/', methods=['GET', 'POST'])
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
    global jira
    jira = JIRA(OPTIONS, basic_auth=(username, password))

    jql = '/rest/api/2/project'
    try:
        response = requests.get(SERVER_URL + jql,
                                verify=False,
                                auth=(username, password))
        project_data = response.json()
    except ValueError:
        flash('Invalid credentials! Try again!')
        return redirect('/login')
    return render_template('index.html',
                           project_data=project_data)


@app.route('/index/<project_key>', methods=['GET'])
def project_issues(project_key):
    issue_dict = {} # creating an empty dictionary
    count = 1
    issue_data = jira.search_issues('project=%s' % project_key)
    for issue in issue_data:
        issue_dict[count] = issue.key
        # issue_dict['issue%d' % count] = issue.key
        count+=1 # increment the count
    issue_json_data = jsonify(issue_dict)
    return issue_json_data

@app.route("/logout")
def logout():
    session.clear()
    flash('You have successfully logged out')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
