import re


def validate_email(email):
    # Regular expression for a valid email format
    email_regex = r'^\S+@\S+\.\S+$'
    return bool(re.match(email_regex, email))
