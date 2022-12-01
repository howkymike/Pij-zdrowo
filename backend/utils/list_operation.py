def unique_list(data):
    if type(data) == type("a"):
        return data
    if type(data[0]) == type({}):
        data = [x["source"] for x in data]
    data_unique = set(data)
    return list(data_unique)