# WebSockets

Websockety chodzą na porcie 7000, działają jedynie gdy serwer HTTP jest poprawnie uruchomiony, ze względu na klasy które siedzą w serwerze. Takto, websockety chodza na innym serwerze.
Na tę chwilę, websockety akceptują podany format:

```
{"TDS": int, "PH": int, "source": int/string}.
```

Inne formaty nie są akceptowane przez serwer, wyjątek jest przejmowany i serwer nadal działa.
Podane danę są wpisywane od razu do bazy i dostępne przez klienta.

Przykładowy klient w Python do ws -> backend/client-test-ws.py

# Uwierzytelnienie

Uwierzytelnie zostało zmienione z cookie-based na header-based.
Obecnie aby nabyć token należy wysłać request na /login, tak jak poprzednio.
Token (UUIDv4) zostanie zwrócony w JSON.

Następne operacje są uwierzytelnianie za pomocą headera.

```
Auth: <token>
```

Każde nowe logowanie zwraca nowy token i kasuje stary!

## Przykładowe requesty

Login

```
POST /login HTTP/1.1
Host: 3.125.155.58:80
Content-Type: application/x-www-form-urlencoded
Content-Length: 47

email=test1@testowy.com&password=super_password
```

Register

```
POST /register HTTP/1.1
Host: 3.125.155.58:80
Content-Type: application/x-www-form-urlencoded
Content-Length: 58

email=test12@testowy.com&name=test&password=super_password

```

# Endpointy do danych

## /data/source oraz /data/id

to w sumie to samo. Wyjmowane są wszystkie dane.

```
GET /data/source HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

Można do tego dodać parametry:

```
sort: TDS/PH/date
order: ASC/DESC

* parametr date może być sprawiać problemy - w trakcie realizacji
```

## /data/source/{uuid}

```
GET /data/source/6f61d185daf34503bd0bf3be63d048fa HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close


```

## /data/id/{uuid}

```
GET /data/id/b8abf01abeca4e2baec50d60670fb5d5 HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

## /lastData

```
GET /lastData?count=123 HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

Obecnie parametr count określ maksymalną ilość wyników
!!! Brak tego parametry powoduje błąd -> w trakcie naprawy.
