from flask import Flask, render_template, flash, redirect
from forms import LoginForm

app = Flask(__name__)
app.config.from_object('config')


@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Logged In User: %s' % form.username.data)
        return redirect('/index')
    return render_template('home.html',
                           title='Sign In',
                           form=form)


@app.route('/index')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
