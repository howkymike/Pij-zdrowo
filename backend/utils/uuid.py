import uuid


def validate_uuidv4(uuid_string):
    try:
        val = uuid.UUID(uuid_string, version=4)
    except ValueError:
        return False

    return uuid_string