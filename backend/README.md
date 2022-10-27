# Jak odpalić backend

Wersja Python - 3.10.7

1. Zainstalować paczki które są w requirements.txt

```
pip3 install -r requirements.txt
```

2. Mondodb

```
docker pull mongo
docker run -d -p 27017:27017 --name test-mongo mongo:latest
```

- może wymagać sudo

Aby wejść na mongodb użyj

```
docker exec -ti <container ID> /bin/bash
mongosh
```

- `mongosh` zostało zmienione z `mongo` w jednej z ostatnich wersji.
