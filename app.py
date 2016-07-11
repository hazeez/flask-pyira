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
        jql = '/rest/api/2/search?jql=project=%s' % (project_key)
    else:
        start_at = 50 * (num - 1)  # if the page is 2, then start at should be
        # from 50
        jql = '/rest/api/2/search?jql=project=%s&startAt=%d' % (project_key,
                                                                start_at)
    response = get_response(jql)
    total_issue_count = response.json()['total']
    issue_data = jsonify(response.json())
    return issue_data


def summary_dict(list_def1, list_def2, total_issues_list):
    """ This function will convert the issue count into a dict """
    global itr_issues_dict
    global itr1_summary_dict

    itr1_a_issues, itr1_b_issues, itr1_c_issues, itr1_d_issues, \
        itr1_e_issues = 0, 0, 0, 0, 0
    itr2_a_issues, itr2_b_issues, itr2_c_issues, itr2_d_issues, \
        itr2_e_issues = 0, 0, 0, 0, 0

    itr1_a_closed, itr1_b_closed, itr1_c_closed, itr1_d_closed, \
        itr1_e_closed = 0, 0, 0, 0, 0
    itr2_a_closed, itr2_b_closed, itr2_c_closed, itr2_d_closed, \
        itr2_e_closed = 0, 0, 0, 0, 0

    itr1_a_resolved, itr1_b_resolved, itr1_c_resolved, itr1_d_resolved, \
        itr1_e_resolved = 0, 0, 0, 0, 0
    itr2_a_resolved, itr2_b_resolved, itr2_c_resolved, itr2_d_resolved, \
        itr2_e_resolved = 0, 0, 0, 0, 0

    itr1_a_in_progs, itr1_b_in_progs, itr1_c_in_progs, itr1_d_in_progs, \
        itr1_e_in_progs = 0, 0, 0, 0, 0
    itr2_a_in_progs, itr2_b_in_progs, itr2_c_in_progs, itr2_d_in_progs, \
        itr2_e_in_progs = 0, 0, 0, 0, 0

    itr1_a_reopen, itr1_b_reopen, itr1_c_reopen, itr1_d_reopen, \
        itr1_e_reopen = 0, 0, 0, 0, 0
    itr2_a_reopen, itr2_b_reopen, itr2_c_reopen, itr2_d_reopen, \
        itr2_e_reopen = 0, 0, 0, 0, 0

    itr1_a_open, itr1_b_open, itr1_c_open, itr1_d_open, \
        itr1_e_open = 0, 0, 0, 0, 0
    itr2_a_open, itr2_b_open, itr2_c_open, itr2_d_open, \
        itr2_e_open = 0, 0, 0, 0, 0

    itr1_summary_dict = {}
    itr_issues_dict = {}

    itr1_a_issues, itr2_a_issues = list_def1.count('A'), list_def2.count('A')
    itr1_b_issues, itr2_b_issues = list_def1.count('B'), list_def2.count('B')
    itr1_c_issues, itr2_c_issues = list_def1.count('C'), list_def2.count('C')
    itr1_d_issues, itr2_d_issues = list_def1.count('D'), list_def2.count('D')
    itr1_e_issues, itr2_e_issues = list_def1.count('E'), list_def2.count('E')

    itr1_a_closed, itr2_a_closed = list_def1.count('A$Closed'), \
        list_def2.count('A$Closed')
    itr1_b_closed, itr2_b_closed = list_def1.count('B$Closed'), \
        list_def2.count('B$Closed')
    itr1_c_closed, itr2_c_closed = list_def1.count('C$Closed'), \
        list_def2.count('C$Closed')
    itr1_d_closed, itr2_d_closed = list_def1.count('D$Closed'), \
        list_def2.count('D$Closed')
    itr1_e_closed, itr2_e_closed = list_def1.count('E$Closed'), \
        list_def2.count('E$Closed')

    itr1_a_resolved, itr2_a_resolved = list_def1.count('A$Resolved'), \
        list_def2.count('A$Resolved')
    itr1_b_resolved, itr2_b_resolved = list_def1.count('B$Resolved'), \
        list_def2.count('B$Resolved')
    itr1_c_resolved, itr2_c_resolved = list_def1.count('C$Resolved'), \
        list_def2.count('C$Resolved')
    itr1_d_resolved, itr2_d_resolved = list_def1.count('D$Resolved'), \
        list_def2.count('D$Resolved')
    itr1_e_resolved, itr2_e_resolved = list_def1.count('E$Resolved'), \
        list_def2.count('E$Resolved')

    itr1_a_in_progs, itr2_a_in_progs = list_def1.count('A$In Progress'), \
        list_def2.count('A$In Progress')
    itr1_b_in_progs, itr2_b_in_progs = list_def1.count('B$In Progress'), \
        list_def2.count('B$In Progress')
    itr1_c_in_progs, itr2_c_in_progs = list_def1.count('C$In Progress'), \
        list_def2.count('C$In Progress')
    itr1_d_in_progs, itr2_d_in_progs = list_def1.count('D$In Progress'), \
        list_def2.count('D$In Progress')
    itr1_e_in_progs, itr2_e_in_progs = list_def1.count('E$In Progress'), \
        list_def2.count('E$In Progress')

    itr1_a_reopen, itr2_a_reopen = list_def1.count('A$Reopened'), \
        list_def2.count('A$Reopened')
    itr1_b_reopen, itr2_b_reopen = list_def1.count('B$Reopened'), \
        list_def2.count('B$Reopened')
    itr1_c_reopen, itr2_c_reopen = list_def1.count('C$Reopened'), \
        list_def2.count('C$Reopened')
    itr1_d_reopen, itr2_d_reopen = list_def1.count('D$Reopened'), \
        list_def2.count('D$Reopened')
    itr1_e_reopen, itr2_e_reopen = list_def1.count('E$Reopened'), \
        list_def2.count('E$Reopened')

    itr1_a_open, itr2_a_open = list_def1.count('A$Open'), \
        list_def2.count('A$Open')
    itr1_b_open, itr2_b_open = list_def1.count('B$Open'), \
        list_def2.count('B$Open')
    itr1_c_open, itr2_c_open = list_def1.count('C$Open'), \
        list_def2.count('C$Open')
    itr1_d_open, itr2_d_open = list_def1.count('D$Open'), \
        list_def2.count('D$Open')
    itr1_e_open, itr2_e_open = list_def1.count('E$Open'), \
        list_def2.count('E$Open')

    itr1_summary_dict = dict(A1=itr1_a_issues, B1=itr1_b_issues,
        C1=itr1_c_issues, D1=itr1_d_issues, E1=itr1_e_issues,
        A2=itr2_a_issues, B2=itr2_b_issues, C2=itr2_c_issues,
        D2=itr2_d_issues, E2=itr2_e_issues, A1C=itr1_a_closed,
        B1C=itr1_b_closed, C1C=itr1_c_closed, D1C=itr1_d_closed,
        E1C=itr1_e_closed, A2C=itr2_a_closed, B2C=itr2_b_closed,
        C2C=itr2_c_closed, D2C=itr2_d_closed, E2C=itr2_e_closed,
        A1R=itr1_a_resolved, B1R=itr1_b_resolved, C1R=itr1_c_resolved,
        D1R=itr1_d_resolved, E1R=itr1_e_resolved, A2R=itr2_a_resolved,
        B2R=itr2_b_resolved, C2R=itr2_c_resolved, D2R=itr2_d_resolved,
        E2R=itr2_e_resolved, A1IP=itr1_a_in_progs, B1IP=itr1_b_in_progs,
        C1IP=itr1_c_in_progs, D1IP=itr1_d_in_progs, E1IP=itr1_e_in_progs,
        A2IP=itr2_a_in_progs, B2IP=itr2_b_in_progs, C2IP=itr2_c_in_progs,
        D2IP=itr2_d_in_progs, E2IP=itr2_e_in_progs, A1RO=itr1_a_reopen,
        B1RO=itr1_b_reopen, C1RO=itr1_c_reopen, D1RO=itr1_d_reopen,
        E1RO=itr1_e_reopen, A2RO=itr2_a_reopen, B2RO=itr2_b_reopen,
        C2RO=itr2_c_reopen, D2RO=itr2_d_reopen, E2RO=itr2_e_reopen,
        A1O=itr1_a_open, B1O=itr1_b_open, C1O=itr1_c_open, D1O=itr1_d_open,
        E1O=itr1_e_open, A2O=itr2_a_open, B2O=itr2_b_open, C2O=itr2_c_open,
        D2O=itr2_d_open, E2O=itr2_e_open)

    for issue in total_issues_list:
        issue_key = issue.split('@')[0]
        issue_value = issue.split('@')[1]
        itr_issues_dict[issue_key]=issue_value
    return jsonify(itr1_summary_dict)


@app.route('/index/<project_key>/dashboard/', methods=['GET', 'POST'])
def project_dashboard(project_key):
    # declare arrays to store the number of a , b, c, d, e issues
    global itr1_issues, itr2_issues
    count = 0
    total_itr_issues = []  # get the total issues in a list
    itr1_issues, itr2_issues = [], []
    status_dict = {'Total': 'TO', 'Closed': 'CL', 'Resolved': 'RL',
                   'In Progress': 'IP', 'Reopened': 'RO', 'Open': 'OP'}
    jql = ''
    # if the total issue count is less than 50 for a project don't request
    # again to the server. if more than 50 request the server
    # to increase performance by avoiding an unnecessary call to the server
    if (total_issue_count <= 50):
        dashboard_response = response
    else:
        jql = '/rest/api/2/search?jql=project=%s&maxResults=%d' % \
            (project_key, total_issue_count)
        dashboard_response = get_response(jql)

    for issue in dashboard_response.json()['issues']:
        try:
            itr_round = issue['fields']['customfield_10755']['value']
            issue_type = issue['fields']['customfield_10764']['value']
            issue_status = issue['fields']['status']['name']
            count += 1
            if itr_round.lower() == 'itr1':
                if issue_type.lower() == 'a':
                    itr1_issues.append('A')
                    total_itr_issues.append('A$1&'+status_dict[issue_status]+
                                       '|'+ str(count) + '@'+ issue['key'])
                    itr1_issues.append('A$'+issue_status)
                if issue_type.lower() == 'b':
                    itr1_issues.append('B')
                    total_itr_issues.append('B$1&'+status_dict[issue_status]
                                       +'|'+ str(count) + '@'+ issue['key'])
                    itr1_issues.append('B$'+issue_status)
                if issue_type.lower() == 'c':
                    itr1_issues.append('C')
                    total_itr_issues.append('C$1&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr1_issues.append('C$'+issue_status)
                if issue_type.lower() == 'd':
                    itr1_issues.append('D')
                    total_itr_issues.append('D$1&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr1_issues.append('D$'+issue_status)
                if issue_type.lower() == 'e':
                    itr1_issues.append('E')
                    total_itr_issues.append('E$1&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr1_issues.append('E$'+issue_status)

            if itr_round.lower() == 'itr2':
                if issue_type.lower() == 'a':
                    itr2_issues.append('A')
                    total_itr_issues.append('A$2&'+status_dict[issue_status]
                                        +'|'+  str(count) + '@'+ issue['key'])
                    itr2_issues.append('A$'+issue_status)
                if issue_type.lower() == 'b':
                    itr2_issues.append('B')
                    total_itr_issues.append('B$2&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr2_issues.append('B$'+issue_status)
                if issue_type.lower() == 'c':
                    itr2_issues.append('C')
                    total_itr_issues.append('C$2&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr2_issues.append('C$'+issue_status)
                if issue_type.lower() == 'd':
                    itr2_issues.append('D')
                    total_itr_issues.append('D$2&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr2_issues.append('D$'+issue_status)
                if issue_type.lower() == 'e':
                    itr2_issues.append('E')
                    total_itr_issues.append('E$2&'+status_dict[issue_status]
                                       +'|'+  str(count) + '@'+ issue['key'])
                    itr2_issues.append('E$'+issue_status)
        except Exception as e:
            print "Error Occurred ", e

    summary_response = summary_dict(itr1_issues, itr2_issues,total_itr_issues)
    return summary_response


@app.route('/index/dashboard/issuesummary/<issue_summary_key>', methods= ['GET', 'POST'])
def issue_summary(issue_summary_key):
    issue_dict = itr_issues_dict
    issue_subset_dict = {}  # declaring an empty dict to collect all related issues
    # get the key from the dict and check if the issue_summary_key matches with it. If it matches, find those issue values and create a new dict and jsonify it

    for key, value in issue_dict.iteritems():
        if (str(key).split('|')[0] == issue_summary_key):
            issue_subset_dict[key] = value
    return jsonify(issue_subset_dict)


@app.route("/logout")
def logout():
    session.clear()
    flash('You have successfully logged out')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
