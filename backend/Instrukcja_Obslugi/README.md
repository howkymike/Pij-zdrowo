# WebSockets

Websockety chodzą na porcie 7000, działają jedynie gdy serwer HTTP jest poprawnie uruchomiony, ze względu na klasy które siedzą w serwerze. Takto, websockety chodza na innym serwerze.
Na tę chwilę, websockety akceptują podany format:

```
{"TDS": int, "PH": int, "source": int/string}.
```

Inne formaty nie są akceptowane przez serwer, wyjątek jest przejmowany i serwer nadal działa.
Podane danę są wpisywane od razu do bazy i dostępne przez klienta.

Przykładowy klient w Python do ws -> `backend/client-test-ws.py`

# Uwierzytelnienie

Uwierzytelnie zostało zmienione z cookie-based na header-based.
Obecnie aby nabyć token należy wysłać request na /login, tak jak poprzednio.
Token (UUIDv4) zostanie zwrócony w JSON.

Następne operacje są uwierzytelnianie za pomocą headera.

```
Auth: <token>
```

Każde nowe logowanie zwraca nowy token i kasuje stary!

# Polityka dostępu

Przy rejestracji doszły dodatkowe 2 pola (role i source), na podstawie informacji na trello. Pierwszym polem jest `role`, czyli "customer' albo "analyst". Ten pierwszy ma dostęp jedynie do rekordów danych które pochodzą od podanego przy rejestracji `source`. Ten drugi ma dostęp do każdego rekordu w bazie.

# Przykładowe requesty - uwierzytelnienie

## Login

```
POST /login HTTP/1.1
Host: 3.125.155.58:80
Content-Type: application/x-www-form-urlencoded
Content-Length: 47

email=test1@testowy.com&password=super_password
```

## Register

```
POST /register HTTP/1.1
Host: 3.125.155.58:80
Content-Type: application/x-www-form-urlencoded
Content-Length: 58

email=test103@testowy.com&password=super_password&name=test&role=analyst&source=34811126dda548698a1c3f17f8e6d099

```

Zostały wprowadzone role. Rola `customer` dostaje dostęp jedynie dostęp do `source`, które poda przy rejestracji. Rola `analyst` posiada dostęp do każdego rekordu danych o stanie wody w bazie danych.
Pole `source` obecnie przyjmuje obojętnie jaką strukture. Przykładowe `source` które siedzą w bazie to:

1. 6f61d185daf34503bd0bf3be63d048fa2
2. d7e80311278d46b08c794e644b40be83
3. 7fd584f64c2c4040a5b4927f6753d171
4. 47e04c924d62429491f06c3033fdc321
5. ArduinoPrototypeSensor
6. e3c51e35edbc435192e1eb550c1ea2d8
7. ec18198321d54cd6a77e9645645d6c67
8. 21978653c9474cd693655f58403c5742
9. f866e6f6c1e8479eb13e4fec549baa84
10. ef93b824f1d24d4f894312f2a8dd9975

# Endpointy do danych

- pole `source` pelni funkcje identyfikatora sensora

## /data/source oraz /data/id

to w sumie to samo. Wyjmowane są wszystkie dane.

```
GET /data/source HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

Można do tego dodać parametry (opcjonalne):

```
sort: "TDS"/"PH"/"date"
order: "ASC"/"DESC"
start_date: <RRRR-MM-DD> > "2022-10-10"
end_date:   <RRRR-MM-DD> -> "2022-11-11"
date_type: "epoch"/"readable" -> domyślnie serwer zwraca date w formacie "readable", natomiast po dodaniu parametru "epoch" będzie zwracał w formacie UNIXowym

```

## /data/source/{uuid}

```
GET /data/source/6f61d185daf34503bd0bf3be63d048fa HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close


```

Ten endpoint ma nadane polityki dostępu, w przypadku gdy użytkownik nie ma dostępu do `source` o podanym UUID, serwer zwraca null.

## /data/id/{uuid}

```
GET /data/id/b8abf01abeca4e2baec50d60670fb5d5 HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

Ten endpoint ma nadane polityki dostępu, w przypadku gdy użytkownik nie ma dostępu do danego `id` rekordu, na podstawie `source`, zostanie zwrócony null.

## /lastData

```
GET /lastData?count=123 HTTP/1.1
Host: 3.125.155.58:80
Auth: cab98674-a950-4ec3-bb3c-c174a2be8a1b
Connection: close
```

Obecnie parametr count określ maksymalną ilość wyników
Domyślnie parametr `count` przyjmuje wartość 10.
Ten endpoint ma nadane polityki dostępu, zostaną jedynie wyświetlone ostatnie dane do których ma dostęp.
