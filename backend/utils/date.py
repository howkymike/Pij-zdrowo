import datetime

def date_to_epoch(date):
    date = datetime.datetime.strptime(str(date), "%d-%m-%Y")
    return date

def epoch_to_date(date_epoch):
    date = datetime.datetime.fromtimestamp(date_epoch).strftime("%d-%m-%Y %H:%M:%S")
    return date

def convert_datetime_from_data_array(date_type, data):
    print(type(data))
    if date_type == "readable":
        if type({}) == type(data):
            data["date"] = epoch_to_date(data["date"])
        else:
            for index, one in enumerate(data):
                data[index]["date"] = epoch_to_date(one["date"])
    return data