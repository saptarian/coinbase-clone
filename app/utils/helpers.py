import re

def validate_email(email):
    # Regular expression for a valid email format
    email_regex = r'^\S+@\S+\.\S+$'
    return bool(re.match(email_regex, email))


def is_digit(value: str | int) -> bool:
    if not value: return False
    return re.search(r'^[0-9]+$', str(value))


def is_numeric(value: str) -> bool:
    try:
        float(value)
        return True
    except Exception:
        return False