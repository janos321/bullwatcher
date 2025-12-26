# 📊 BullWatcher — Crypto portfólió követő webalkalmazás

A **BullWatcher** egy modern, Angular alapú webalkalmazás, amely lehetővé teszi,
hogy a felhasználók saját kriptovaluta-portfóliójukat rögzítsék, kövessék
és elemezzék (felhőben tárolva), biztonságos bejelentkezéssel.

Cél: egyszerű, gyors és átlátható eszköz mindenki számára,
aki szeretné látni, hogyan teljesít a portfóliója.

---

## ✨ Fő funkciók

### 📈 Portfólió kezelés
- saját coinok felvétele
- vételi ár, mennyiség és dátum megadása
- aktuális érték automatikus számítása
- összesített profit / veszteség kijelzése

### 📊 Valós idejű árfolyamok
- **TradingView** integráció
- grafikonok és árfolyam-nézetek
- kedvencek listázása

### 🔐 Bejelentkezés (Google)
- Firebase Authentication
- Google-alapú bejelentkezés
- felhasználónként elkülönített adatok
- biztonságos hozzáférés a portfólióhoz

### ☁️ Felhő alapú mentés
- Firebase Firestore
- valós idejű szinkronizáció
- adatok elérhetők több eszközről is

---

## 🧱 Technológiai stack

### 🌐 Frontend
**Angular**
- komponens alapú architektúra  
- szolgáltatások (services) az adatkezeléshez  
- reaktív űrlapok  
- moduláris felépítés  
- state kezelés és megosztott állapot

### ☁️ Backend / Adat
**Firebase / Firestore**
- real-time adatbázis
- Google Authentication
- biztonsági szabályok
- skálázható adatmodell

### ➕ Integrációk
- TradingView widget
- (tervezett) külső árfolyam API-k

---

## 🧭 Felhasználói folyamat

1. Felhasználó bejelentkezik Google-lel  
2. Portfólió létrehozása vagy betöltése  
3. Coinok felvétele és szerkesztése  
4. Az alkalmazás automatikusan számol:
   - aktuális érték
   - teljes profit / veszteség  
5. Árfolyamok követése TradingView grafikonokon  

---

## 👨‍💻 Fejlesztői fókusz

- tiszta, jól szervezett Angular struktúra
- újrafelhasználható komponensek
- service-alapú adatkezelés
- Firebase integráció
- biztonság + felhasználó-specifikus adatok
- reszponzív felület

---

## 🚀 Tervek

- értesítések árfolyamváltozás esetén
- több külön portfólió kezelése
- fejlettebb statisztikák
- dark / light mód
- export (CSV / PDF)

---

## 📌 Megjegyzés

Tanulási és portfólió projekt,
de célja, hogy valós, használható eszközzé fejlődjön.

---

## 📩 Kapcsolat

Fejlesztő: **Horváth János**
