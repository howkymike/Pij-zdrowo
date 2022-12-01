from config import PH_MIN_RANGE, PH_MAX_RANGE, TDS_MAX_RANGE, TDS_MIN_RANGE

def detect_abnormal_all(data):
	abnormal_data = []

	for one in data:
		if one["PH"] < PH_MIN_RANGE or one["PH"] > PH_MAX_RANGE:
			abnormal_data.append(one)
		elif one["TDS"] < TDS_MIN_RANGE or one["TDS"] > TDS_MAX_RANGE:
			abnormal_data.append(one)
		else:
			continue
	return abnormal_data

def detect_abnormal_ph(data):
	pass

def detect_abnormal_tds(data):
	pass