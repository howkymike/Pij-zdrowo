# file contains code to fulfill database with example data
import uuid
import random
import time

from main import db, db_data
from utils.sha256 import hash_password_with_salt


NUMBER_OF_USER_FULFILL_DB = 10
NUMBER_OF_DATA_FULFILL_DB = 10

def fulfill_data_db():

    random_uuid_users = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_USER_FULFILL_DB)]
    random_uuid_db_id = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_DATA_FULFILL_DB)]
    random_uuid_db_source = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_DATA_FULFILL_DB)]


    if db.users.find_one({"name": "test0"}) == None:
        for one in range(NUMBER_OF_USER_FULFILL_DB):
            new_user = {
                "_id": random_uuid_users[one],
                "name": "test" + str(one),
                "password": hash_password_with_salt("super_password"),
                "email": "test" + str(one) + "@testowy.com"
            }

            new_data = {
                "_id": random_uuid_db_id[one],
                "TDS": random.randint(0, 100),
                "PH": random.randint(0, 15),
                "source": random_uuid_db_source[one],
                "date": round(time.time())
            }
            db.users.insert_one(new_user)
            db_data.measurement.insert_one(new_data)

        
def generate_random_date():
    start_date = round(time.time())

    dates = []
    for one in range(NUMBER_OF_DATA_FULFILL_DB):
        start_date += 216000 # 25 days
        dates.append(start_date)

    return dates


fulfill_data_db()
#print(generate_random_date())
