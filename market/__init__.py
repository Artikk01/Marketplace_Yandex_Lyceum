import base64

from flask import (Flask, abort, flash, redirect, render_template, request,
                   session, url_for)
from flask.json import jsonify
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
from flask_migrate import Migrate

from forms import *
from models import *

# from flask_mail import Mail, Message


app = Flask(__name__)
# mail = Mail(app)
app.secret_key = "my_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///marketplace.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = "static"
db.init_app(app)
with app.app_context():
    db.create_all()
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = "login"


# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = 'markethub169@gmail.com' # замените на вашу электронную почту
# app.config['MAIL_PASSWORD'] = '125678aa' # замените на ваш пароль электронной почты


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route("/")
@app.route("/home")
def index():
    if "cart" not in session:
        session["cart"] = {}
    return render_template(
        "home.html", products=Product.query, quantity=session["cart"]
    )


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash("Неправильная почта или пароль")
            return redirect(url_for("login"))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for("lc"))
    return render_template("login.html", title="Sign In", form=form)


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            password=form.password.data,
            role=form.role.data,
        )
        db.session.add(user)
        db.session.commit()
        return redirect(url_for("login"))
    return render_template("register.html", title="Register", form=form)


@app.route("/lc", methods=["GET", "POST"])
@login_required
def lc():
    form = EditProfileForm()
    if form.validate_on_submit():
        print("Form submitted successfully")
        redirect(url_for("lc"))
    return render_template("lc.html", form=form)


@app.route("/uploadproduct", methods=["GET", "POST"])
def upload():
    if not current_user.is_authenticated or current_user.role != "seller":
        abort(404)
    form = ProductForm()
    if form.validate_on_submit():
        image = Product(
            name=form.name.data,
            description=form.description.data,
            price=form.price.data,
            quantity=form.quantity.data,
            image=base64.b64encode(form.image.data.read()).decode(),
            category=form.category.data,
            seller_id=current_user.id,
        )
        db.session.add(image)
        db.session.commit()
        return redirect(url_for("lc"))
    return render_template("product.html", title="nnn", form=form)


@app.route("/product/<int:id_product>")
def product(id_product):
    return render_template(
        "products.html", product=Product.query.filter_by(id=id_product).first()
    )


@app.route("/cart", methods=["GET", "POST"])
def cart():
    if "cart" not in session:
        session["cart"] = {}
    products = Product.query.filter(
        Product.id.in_([int(i) for i in session["cart"]])
    ).all()
    return render_template("cart.html", products=products, quantity=session["cart"])


@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    product_id = request.form["product_id"]
    quantity = request.form["quantity"]

    product = Product.query.filter_by(id=product_id).first()

    if "cart" not in session:
        session["cart"] = {}

    if str(product.id) not in session["cart"]:
        session["cart"][str(product.id)] = {
            "name": product.name,
            "price": product.price,
            "quantity": int(quantity),
        }
    else:
        session["cart"][str(product.id)]["quantity"] += int(quantity)
        if session["cart"][str(product.id)]["quantity"] > product.quantity:
            session["cart"][str(product.id)]["quantity"] = product.quantity

    session.modified = True
    print(session["cart"])
    return jsonify({"success": True})


@app.route("/remove_from_cart", methods=["POST"])
def remove_from_cart():
    product_id = request.form["product_id"]

    if "cart" in session and product_id in session["cart"]:
        del session["cart"][product_id]
        session.modified = True
    return jsonify({"success": True})


@app.route("/about", methods=["GET", "POST"])
def about():
    return render_template("about.html")


@app.route("/design")
def design():
    return "Оформление заказа в разаработке."


# @app.route('/feedback', methods=['GET', 'POST'])
# def feedback():
#     if request.method == 'POST':
#         # получение данных из формы
#         name = request.form['name']
#         email = request.form['email']
#         message = request.form['message']

#         # создание сообщения
#         msg = Message(subject='Feedback from your website', sender='markethub169@gmail.com', recipients=['markethub169@gmail.com']) # замените на вашу электронную почту
#         msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"

#         # отправка сообщения
#         mail.send(msg)

#         return 'Thank you for your feedback!'

#     return render_template('feedback.html')


class UserView(ModelView):
    def is_accessible(self):
        return current_user.role == "admin"


class ProductView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.role == "admin"

    def get_query(self):
        if current_user.role == "admin":
            return self.session.query(self.model)
        # else:
        #     return self.session.query(self.model).filter_by(seller_id=current_user.id)

    def get_count_query(self):
        if current_user.role == "admin":
            return db.session.query(db.func.count(self.model.id))


class CustomAdminIndexView(AdminIndexView):
    @expose("/")
    def index(self):
        if not current_user.is_authenticated or current_user.role != "admin":
            abort(404)
        return super().index()


admin = Admin(app, index_view=CustomAdminIndexView())
admin.add_view(UserView(User, db.session))
admin.add_view(
    ProductView(Product, db.session, category="Products", name="Edit Products")
)


if __name__ == "__main__":
    app.run(debug=True)
