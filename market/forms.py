from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileRequired
from wtforms import (BooleanField, FileField, FloatField, IntegerField,
                     PasswordField, SelectField, StringField, SubmitField)
from wtforms.validators import (DataRequired, Email, EqualTo, Length,
                                NumberRange, ValidationError)

from models import User


class LoginForm(FlaskForm):
    email = StringField("Почта", validators=[DataRequired(), Email()])
    password = PasswordField("Пароль", validators=[DataRequired()])
    remember_me = BooleanField("Запомнить меня")
    submit = SubmitField("Войти")


class RegistrationForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    confirm_password = PasswordField(
        "Confirm Password", validators=[DataRequired(), EqualTo("password")]
    )
    role = SelectField("Role", choices=["user", "admin"], validators=[DataRequired()])
    submit = SubmitField("Sign Up")

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError("Please use a different email address.")


class ProductForm(FlaskForm):
    name = StringField("Название", validators=[DataRequired(), Length(max=255)])
    category = StringField("Категория", validators=[DataRequired()])
    description = StringField("Описание", validators=[DataRequired()])
    image = FileField(
        "Изображение",
        validators=[
            FileRequired(),
            FileAllowed(
                ["jpg", "png", "jpeg"], "Только изображения формата JPG, PNG и JPEG."
            ),
        ],
    )
    price = IntegerField("Цена", validators=[DataRequired(), NumberRange(min=1)])
    quantity = IntegerField(
        "Количество", validators=[DataRequired(), NumberRange(min=1)]
    )
    approved = BooleanField("Одобрено")
    submit = SubmitField("Отправить")


class EditProfileForm(FlaskForm):
    username = StringField("Имя пользователя", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Пароль", validators=[DataRequired()])
    submit = SubmitField("Сохранить изменения")


# class AddProductForm(FlaskForm):
#     name = StringField('Product Name', validators=[DataRequired()])
#     description = StringField('Product Description', validators=[DataRequired()])
#     image = StringField('Image URL', validators=[DataRequired()])
#     price = IntegerField('Цена', validators=[DataRequired(), NumberRange(min=0)])
#     quantity = IntegerField('Quantity', validators=[DataRequired()])
#     submit = SubmitField('Add Product')

# class EditProductForm(FlaskForm):
#     name = StringField('Product Name', validators=[DataRequired()])
#     description = StringField('Product Description', validators=[DataRequired()])
#     image = StringField('Image URL', validators=[DataRequired()])
#     price = FloatField('Price', validators=[DataRequired()])
#     quantity = IntegerField('Quantity', validators=[DataRequired()])
#     submit = SubmitField('Save Changes')

# class DeleteProductForm(FlaskForm):
#     submit = SubmitField('Delete Product')
