import re
from typing import Union
from datetime import datetime
from uuid import uuid1


def id_email_valid(email: str) -> bool:
    # Regular expression for a valid email format
    email_regex = r'^\S+@\S+\.\S+$'
    return bool(re.match(email_regex, email))


def is_digit(value: Union[str, int] ) -> bool:
    if not value: return False
    return re.search(r'^[0-9]+$', str(value))


def is_numeric(value: str) -> bool:
    try:
        float(value)
        return True
    except (TypeError, ValueError):
        return False


def timestamp_utc():
    return datetime.timestamp(datetime.utcnow())


def generate_order_uuid(user_id: int):
    rev = '%d%s' % (user_id, str(uuid1().time)[::-1])
    return '%s-%s-%s' % (rev[:4], rev[4:12], rev[12:])
