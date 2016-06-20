from flask import Flask, render_template, redirect, session
from forms import LoginForm

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


@app.route('/index')
def index():
    try:
        if len(session['username']) == 0:
            return redirect('/login')
    except:
        return redirect('/login')
    return render_template('index.html')


@app.route("/logout")
def logout():
    session.clear()
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
