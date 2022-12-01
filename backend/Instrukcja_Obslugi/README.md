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

Ten endpoint zwraca również source ID/IDs na login i hasła usera oraz do którego ma dostęp

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
!!Nowe po zmianie!!

1.  6dc5c21be4264f6fa7ed5367f1454c54
2.  1d610b7f9c8741fcb8d15125c3f89768
3.  5a8f5239b61a4002a5bd9d6baba773ba
4.  2167915ff76b4c728d79fd688c8a56a4
5.  bacdc5b24e484bc49c26db97d039e1d1
6.  c88638860956488f920d35974fcb2fda
7.  8306f80d6b9e4efbb429b77ebd582d44
8.  018d06a5f0434da08c6f98cdb647c367
9.  767d31b13c4443a384167984b656466c
10. 630b19c4a01245abac60f5855dc604a2
11. b9232ab84c11471e88e88a87c4781cd9
12. 91bb2dd05b714549b1e08388261343db

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

## /abnormalData

```
GET /abnormalData HTTP/1.1
Host: 127.0.0.1:8000
Auth: 8eae769c-4a08-446a-bcb7-c264d2ee6e41
Connection: close

```

Istnieje parametr `count` za pomocą którego można określić liczbę zwracanych rekordów (jeśli mniejsza niż obecna liczba wszystkich).

Endpoint zwraca rekordy, zgodnie z zachowaniem polityk dostępu dla ról `analyst` oraz `customer`, rekordy które przekraczają wartości PH oraz TDS.
Uznaje się, że rekord przekroczył dany limit jeśli ma:

1. PH < 6.5 or PH > 9.5
2. TDS < 50 or TDS > 300

# Wygenerowane dane

Zostały wygenerowane nowe dane, które bardziej przypominają realistyczne dane.
Dane poprawne, mają wartości PH oraz TDS różniące się o max 10% względem średniej z ustawionych limitów (PH -> (6.5 + 9.5) / 2 = 8 itp)
Dane niepoprawne, czyli te które mają przekroczone limity są ustawione randomowo, ale z pewnym wyczuciem, nie będą to dane makabrycznie różne.
Poniżej została przedstawiona tabela schematu wygenerowanych rekordów, wraz ze schematami generacji przedziałów czasowych

| source_id                        | przedział czasowy |
| -------------------------------- | ----------------- |
| 6dc5c21be4264f6fa7ed5367f1454c54 | co miesiąc        |
| 1d610b7f9c8741fcb8d15125c3f89768 | co 3 tygodnie     |
| 5a8f5239b61a4002a5bd9d6baba773ba | co 2 tygodnie     |
| 2167915ff76b4c728d79fd688c8a56a4 | co tydzień        |
| bacdc5b24e484bc49c26db97d039e1d1 | co 5 dni          |
| c88638860956488f920d35974fcb2fda | co 3 dni          |
| 8306f80d6b9e4efbb429b77ebd582d44 | co 1 dzień        |
| 018d06a5f0434da08c6f98cdb647c367 | random            |
| 767d31b13c4443a384167984b656466c | random            |
| 630b19c4a01245abac60f5855dc604a2 | random            |
| b9232ab84c11471e88e88a87c4781cd9 | random            |
| 91bb2dd05b714549b1e08388261343db | random            |

! Wszystkie daty nie wykraczają poza 1 rok wstecz względem daty wygenerowania 28.11!
