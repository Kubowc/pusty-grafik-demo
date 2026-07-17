# Pusty Grafik

Lokalny MVP dla małego salonu beauty. Pomaga znaleźć klientki gotowe na kolejną wizytę, przygotować wiadomość do zatwierdzenia i policzyć odzyskany przychód.

## Wersja demonstracyjna online

Po uruchomieniu GitHub Pages aplikacja będzie dostępna pod adresem:

https://kubowc.github.io/pusty-grafik-demo/

Repozytorium i strona są publiczne. Wszystkie klientki, numery telefonów, terminy i wyniki zawarte w kodzie są fikcyjne. Nie wolno dodawać do repozytorium prawdziwego eksportu z Booksy ani innych danych salonu.

## Jak uruchomić

Otwórz plik `index.html` w Chrome, Edge, Safari lub Firefox. Aplikacja nie wymaga instalacji ani konta. Dane demonstracyjne pojawią się automatycznie.

### Telefon

Do wysłania na telefon użyj pliku `Pusty-Grafik-Demo.html` z głównego folderu `outputs`. Jest to wersja jednoplikowa — wygląd i działanie aplikacji są zapisane w środku, więc telefon nie musi odnajdywać osobnych plików CSS i JavaScript.

Plik trzeba otworzyć w prawdziwej przeglądarce. Podgląd załącznika w WhatsAppie, Messengerze, Gmailu lub aplikacji Pliki może blokować działanie stron HTML. Najpewniejszą opcją dla odbiorcy mobilnego nadal jest zwykły adres internetowy.

## Jak pokazać aplikację

1. Otwórz aplikację. Przykładowy salon jest już gotowy, więc nie trzeba niczego konfigurować.
2. Na ekranie **Dzisiaj** wybierz wolny termin i pokaż sugerowaną klientkę oraz gotową wiadomość.
3. Kliknij **Dodaj do sprawdzenia**, a następnie przycisk z haczykiem. Wiadomość zostanie skopiowana do wklejenia w SMS-ie, WhatsAppie lub Instagramie.
4. Wejdź w **Wyniki** i zmień rezultat kontaktu na **Zarezerwowano**. Odzyskany przychód zaktualizuje się automatycznie.
5. Kliknij **Dodaj dane z Booksy**, aby pokazać nietechniczny proces rozpoczęcia pracy z prawdziwymi danymi.

## Pierwszy pilotaż z Booksy

Właścicielka nie musi wiedzieć, czym jest CSV ani przygotowywać tabel. Interfejs prowadzi ją przez dwa proste kroki:

1. Poproszenie Booksy o listę klientek, historię wizyt i listę usług przy użyciu gotowej wiadomości.
2. Dodanie otrzymanych plików bez ich otwierania i poprawiania.

Pierwszy rzeczywisty eksport powinien zostać sprawdzony wspólnie. Po uzyskaniu anonimowego przykładu importer można dopasować do faktycznej struktury plików danego konta. Aktualna wersja automatycznie odczytuje przygotowany plik demonstracyjny, a dla pozostałych formatów pokazuje zrozumiałą informację o konieczności jednorazowego dopasowania.

## Dane i prywatność

Dane są przechowywane w pamięci tej przeglądarki (`localStorage`) i nie są wysyłane do serwera. Nie importuj informacji o zdrowiu, alergiach, przeciwwskazaniach ani zdjęć zabiegów. Przed realnym użyciem salon powinien potwierdzić podstawę prawną kontaktu i zasady retencji danych.

GitHub Pages służy wyłącznie do prezentacji na fikcyjnych lub zanonimizowanych danych. Wdrożenie dla konkretnego salonu wymaga prywatnego hostingu, kontroli dostępu, kopii zapasowych i uzgodnienia zasad przetwarzania danych.

## Zakres MVP

- działa bez serwera i bez klucza API,
- prowadzi właścicielkę przez dodawanie danych z Booksy bez technicznego słownictwa,
- automatycznie odczytuje przygotowany plik demonstracyjny,
- wybiera kandydatki według usługi, cyklu wizyt i zgody,
- tworzy edytowalne wiadomości po polsku,
- wymaga zatwierdzenia przez człowieka,
- rejestruje odpowiedzi i odzyskany przychód,
- pobiera raport wyników i kopię danych.

Wolne terminy w tej wersji są danymi demonstracyjnymi. Kolejnym krokiem po pilotażu powinien być import grafiku z konkretnego systemu rezerwacji używanego przez salon.
