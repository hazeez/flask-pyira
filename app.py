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
    username1 = username
    password1 = password  # assign local variables to improve performance
    response = requests.get(SERVER_URL + jql,
                            verify=False,
                            auth=(username1, password1))
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
    global response
    global total_issue_count
    if (num == 1):
        start_at = 1
        jql = '/rest/api/2/search?jql=project=%s&startAt=%d' % (project_key,
                                                                start_at)
    else:
        start_at = 50 * (num - 1)  # if the page is 2, then start at should be
        # from 50
        jql = '/rest/api/2/search?jql=project=%s&startAt=%d' % (project_key,
                                                                start_at)
    response = get_response(jql)
    total_issue_count = response.json()['total']
    issue_data = jsonify(response.json())
    return issue_data


@app.route('/index/<project_key>/dashboard/', methods=['GET', 'POST'])
def project_dashboard(project_key):
    # declare arrays to store the number of a , b, c, d, e issues
    # itr1_issues_a = []
    # itr1_issues_b = []
    # itr1_issues_c = []
    # itr1_issues_d = []
    # itr1_issues_e = []
    #
    # itr2_issues_a = []
    # itr2_issues_b = []
    # itr2_issues_c = []
    # itr2_issues_d = []
    # itr2_issues_e = []
    #

    jql = ''
    # if the total issue count is less than 50 for a project don't request
    # again to the server. if more than 50 request the server
    # to increase performance by avoiding an unnecessary call to the server
    if (total_issue_count <= 50):
        dashboard_response = response
    else:
        jql = '/rest/api/2/search?jql=project=%s&maxResults=%d' % (project_key,
                                                                total_issue_count)
        dashboard_response = get_response(jql)

    for issue in dashboard_response.json()['issues']:
        try:
            itr_round = issue['fields']['customfield_10755']['value']
            issue_type = issue['fields']['customfield_10764']['value']
            if itr_round.lower() == 'itr1':
                # if issue_type.lower() == 'a':
                print issue['key']
                print issue_type
        except Exception as e:
            print "Error Occurred ", e
    return render_template('dashboard.html', response=dashboard_response)


@app.route("/logout")
def logout():
    session.clear()
    flash('You have successfully logged out')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
