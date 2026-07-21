# Pusty Grafik — CRM salonu

Publiczna demonstracja prostego CRM-u dla salonu medycyny estetycznej. Łączy rejestr wizyt, koszt preparatów, operacyjny podgląd finansów, przypomnienia SMS i pomoc w wypełnianiu wolnych terminów.

## Demonstracja online

https://kubowc.github.io/pusty-grafik-demo/

Repozytorium i GitHub Pages są publiczne. Wszystkie klientki, numery telefonów, wizyty, koszty oraz wyniki zapisane w kodzie są fikcyjne. Nigdy nie należy umieszczać tutaj prawdziwego eksportu z Booksy.

## Co pokazuje obecna wersja

- pulpit właścicielki z najważniejszymi zadaniami,
- rejestr wizyt i formularz dodawania nowej wizyty,
- cenę, rabat, zadatek, kosmetyki, sprzedaż i realizację vouchera,
- formę płatności i kwotę pobraną przy wizycie,
- użyty preparat, ilość i demonstracyjny koszt jednostkowy,
- wartość zabiegu i szacunkową marżę przed kosztami stałymi i podatkami,
- automatyczne wyliczenie dat przypomnień według zabiegu,
- edytowalne wiadomości SMS z linkiem do zapisów Booksy,
- ręczne zatwierdzanie, anulowanie i historię przypomnień,
- bazę klientek i operacyjny raport finansowy,
- dobieranie klientek do demonstracyjnych wolnych terminów,
- eksport wizyt, raportu miesięcznego i kopii danych.

## Zasady przypomnień w demonstracji

| Zabieg | Reguła |
|---|---|
| BTX | od razu wiadomość o bezpłatnej konsultacji za 2 tygodnie oraz kolejna po 3 miesiącach |
| Modelowanie ust | przypomnienie po 8 miesiącach |
| Wolumetria twarzy | przypomnienie po roku |
| Biostymulacja | przypomnienie po miesiącu |
| Lift powięziowo-skroniowy | przypomnienie po 46 dniach, czyli 2 tygodnie przed kolejnym etapem po 2 miesiącach |
| Kwas polimlekowy | przypomnienie po 46 dniach |
| Hydroksyapatyt wapnia | przypomnienie po 46 dniach |

SMS-y nie są wysyłane automatycznie. W publicznej wersji można je skopiować i ręcznie oznaczyć jako wysłane. Wiadomość można też anulować, gdy klientka zdążyła już umówić kolejną wizytę.

## Ważne rozróżnienia finansowe

Demonstracja pokazuje trzy osobne wartości:

1. **Wartość zabiegu** — cena po rabacie, niezależnie od tego, czy klientka płaci gotówką, zadatkiem czy voucherem.
2. **Wpłata przypisana** — kwota pobrana przy wizycie wraz z zadatkiem; wykorzystany voucher obniża wpłatę przy wizycie.
3. **Marża szacunkowa** — wartość zabiegu minus demonstracyjny koszt zużytego preparatu.

To nie jest system księgowy. W obliczeniach nie są automatycznie odejmowane VAT, CIT, koszty stałe, prowizje płatnicze ani pozostałe koszty spółki. Reguły podatkowe dla zabiegów, kosmetyków, zadatków i voucherów musi potwierdzić księgowa salonu.

## Uruchomienie

Otwórz `index.html` w aktualnej przeglądarce. Aplikacja nie wymaga instalacji, konta ani serwera. Dane są przechowywane lokalnie w `localStorage` przeglądarki.

Wersja `Pusty-Grafik-Demo.html` w folderze `outputs` zawiera HTML, CSS i JavaScript w jednym pliku. Na telefonie najpewniejsza pozostaje demonstracja pod zwykłym adresem GitHub Pages, ponieważ podglądy załączników często blokują skrypty.

## Granice publicznej demonstracji

- Brak serwera, logowania i synchronizacji między urządzeniami.
- Brak prawdziwego importera Booksy — pierwszy anonimowy eksport trzeba dopiero przeanalizować i dopasować.
- Brak integracji sprawdzającej, czy klientka już zarezerwowała wizytę.
- Brak dostawcy SMS i automatycznej wysyłki.
- Koszty preparatów są fikcyjne i służą wyłącznie do pokazania sposobu działania.

Wdrożenie z prawdziwymi danymi wymaga prywatnego hostingu, dostępu tylko dla salonu, kopii zapasowych, zasad retencji, podstawy prawnej kontaktu oraz konfiguracji operatora SMS.
