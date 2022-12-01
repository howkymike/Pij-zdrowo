# file contains code to fulfill database with example data
import uuid
import random
import time

from pymongo import MongoClient
from utils.sha256 import hash_password_with_salt
from utils.date import epoch_to_date
from config import PH_AVG, TDS_AVG

client = MongoClient("127.0.0.1", 27017)
db = client["authorization"]
db_data = client["data"]

NUMBER_OF_USER_FULFILL_DB = 10
NUMBER_OF_DATA_FULFILL_DB = 12


#random_uuid_users = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_USER_FULFILL_DB)]
#random_uuid_db_id = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_DATA_FULFILL_DB)]
#random_uuid_db_source = [str(uuid.uuid4()).replace("-", "") for x in range(NUMBER_OF_DATA_FULFILL_DB)]

data_id = [
    'e4d1fe7741fe4dd9ab2ca46f242c4e09', 
    'a3ed6f7bd6ca4bb08df3acc185419e38', 
    '971a1c938bf844d6afefc60fdd5d75b6', 
    'dbbd24a7957945dc862f06350bfbb9fa', 
    '927f0cf8a4e14886bb9991ced0bd68db', 
    '3d741f49d0cb40ad8e47d1f5b42e9420', 
    'bdadf73be1ef4a5ebec7ec2e8854f9e7', 
    '4146e521efb746a295b3d67ad603888a', 
    '7e65eac6cffb405d8c7fbdc37428202d', 
    '60c7ebf1af864a29862e0287a0bafa0f',
    '1873e11a8e904ab195fe10e37641deb0',
    '803c4fe18e57440a973cdc41d6af9f68'
]

source_id = [
    ['6dc5c21be4264f6fa7ed5367f1454c54', "Poland, Warszawa"], 
    ['1d610b7f9c8741fcb8d15125c3f89768', "Poland Dabrowa Gornica"],
    ['5a8f5239b61a4002a5bd9d6baba773ba', "Poland, Krakow"],
    ['2167915ff76b4c728d79fd688c8a56a4', "Poland, Malbork"], 
    ['bacdc5b24e484bc49c26db97d039e1d1', "Poland, Jaworzno"], 
    ['c88638860956488f920d35974fcb2fda', "Poland, Lodz"], 
    ['8306f80d6b9e4efbb429b77ebd582d44', "Poland, Wroclaw"], 
    ['018d06a5f0434da08c6f98cdb647c367', "Poland, Poznan"], 
    ['767d31b13c4443a384167984b656466c', "Poland, Gdansk"], 
    ['630b19c4a01245abac60f5855dc604a2', "Poland, Gdynia"],
    ['b9232ab84c11471e88e88a87c4781cd9', "Poland, Sopot"],
    ['91bb2dd05b714549b1e08388261343db', "Poland, Radom"],
]

Location = [
    "Poland, Warszawa",
    "Poland Dąbrowa Górnica",
    "Poland, Kraków",
    "Poland, Malbork",
    "Poland, Jaworzno",
    "Poland, Łódź",
    "Poland, Wrocław",
    "Poland, Poznań",
    "Poland, Gdańsk",
    "Poland, Gdynia",
    "Poland, Sopot",
    "Poland, Radom"
]

date = [
    2592000, # co miesiac
    1814400, # co 3 tygodnie
    1209600, # co 2 tygodnie
    604800, # co tydzien
    432000, # co 5 dni
    259200, # co 3 dni
    86400, # co dzień
    random.randint(86400, 2592000), # random
    random.randint(86400, 2592000), # random 
    random.randint(86400, 2592000), # random
    random.randint(86400, 2592000), # random
    random.randint(86400, 2592000) # random
]

def fulfill_data_db():

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
                "date": round(time.time()),
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

def generate_abnormal_data():
    for index in range(NUMBER_OF_DATA_FULFILL_DB):
        for one in range(random.randint(1, 4)):
            new_data = {
                "_id": uuid.uuid4().hex,
                "TDS": round((1 + (random.random())) * TDS_AVG) if one % 2 == 0 else round((1 - (random.random())) * TDS_AVG) ,
                "PH": round((1 + (random.random())/4) * PH_AVG, 2) if one % 2 == 0 else round((1 - (random.random()) / 4) * PH_AVG, 2),
                "source": source_id[index][0],
                "date": int(time.time()) - (random.randint(1, 20) * date[index]),
                "location": source_id[index][1]
            }
            db_data.measurement.insert_one(new_data)
            #print(new_data)

def fulfill_data_data_new():

    for index in range(len(data_id)):

        for one in range(NUMBER_OF_DATA_FULFILL_DB):
            new_data = {
                "_id": uuid.uuid4().hex,
                "TDS": round((1 + (random.random() / 10)) * TDS_AVG) if one % 2 == 0 else round((1 - (random.random() / 10)) * TDS_AVG),
                "PH": round((1 + (random.random() / 10)) * PH_AVG, 2) if one % 2 == 0 else round((1 - (random.random() / 10)) * PH_AVG, 2),
                "source": source_id[index][0],
                "date": int(time.time()) - (one * date[index]),
                "location": source_id[index][1]
            }
            db_data.measurement.insert_one(new_data)
            #print(new_data)

fulfill_data_data_new()
print("*" * 50)
generate_abnormal_data()
