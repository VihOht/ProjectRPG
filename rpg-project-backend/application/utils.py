import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Environment, FileSystemLoader, select_autoescape
import os

# Configure template engine
env = Environment(
    loader=FileSystemLoader("application/templates"),
    autoescape=select_autoescape(["html", "xml"])
)


def render_template(template_name: str, data: dict) -> str:
    """
    Render an HTML template using Jinja2.
    """
    template = env.get_template(template_name)
    return template.render(**data)


def send_email(
    recipient_email: str,
    subject: str,
    template_name: str,
    template_data: dict
):
    html_body = render_template(template_name, template_data)

    msg = MIMEMultipart("alternative")
    msg["From"] = os.getenv("SENDER_EMAIL")
    msg["To"] = recipient_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as server:
        try:
            server.starttls()
            server.login(os.getenv("SENDER_EMAIL"), os.getenv("SENDER_PASSWORD"))
            server.send_message(msg)
        except Exception as e:
            return str(e)