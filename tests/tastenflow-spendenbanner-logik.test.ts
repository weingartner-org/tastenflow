/**
 * WÄCHTER: die Schwellen-/Sperr-Logik des Spendenbanners.
 * ===========================================================================
 * Johannes, 18.09.2026: alle 5 Stunden ein Banner, danach wieder von vorne
 * (aber mit der richtigen Stundenzahl), nie öfter als alle zwei Monate, pro
 * KONTO nicht pro Klasse - reine Zahlenlogik, ohne Kinder, ohne Backend.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  spendenBannerFaellig,
  spendenBannerMeilenstein,
  spendenBannerMerken,
  spendenBannerTextIndex,
  spendenBannerZustandLesen,
  spendenBannerZustandNeuestes,
} from "../src/lib/spendenbanner";

beforeEach(() => {
  localStorage.clear();
});

describe("spendenBannerMeilenstein", () => {
  it("unter 5 Stunden gibt es keinen Meilenstein", () => {
    expect(spendenBannerMeilenstein(0)).toBe(0);
    expect(spendenBannerMeilenstein(4.9)).toBe(0);
  });

  it("rundet auf das zuletzt erreichte Vielfache von 5 ab", () => {
    expect(spendenBannerMeilenstein(5)).toBe(5);
    expect(spendenBannerMeilenstein(7.9)).toBe(5);
    expect(spendenBannerMeilenstein(24.99)).toBe(20);
    expect(spendenBannerMeilenstein(37)).toBe(35);
  });
});

describe("spendenBannerTextIndex - zyklisch, fünf Texte", () => {
  it("die ersten fünf Meilensteine treffen die Texte der Reihe nach", () => {
    expect(spendenBannerTextIndex(5)).toBe(0);
    expect(spendenBannerTextIndex(10)).toBe(1);
    expect(spendenBannerTextIndex(15)).toBe(2);
    expect(spendenBannerTextIndex(20)).toBe(3);
    expect(spendenBannerTextIndex(25)).toBe(4);
  });

  it("★★★★★ der zweite Durchlauf beginnt wieder bei Text 1 - mit der RICHTIGEN Stundenzahl", () => {
    // „Wenn alle durch sind wieder von vorne, aber dann müssen die Stunden
    // stimmen" (Johannes) - der TEXT wiederholt sich, der MEILENSTEIN nicht.
    expect(spendenBannerTextIndex(30)).toBe(0);
    expect(spendenBannerTextIndex(50)).toBe(4);
    expect(spendenBannerTextIndex(55)).toBe(0);
  });
});

describe("spendenBannerFaellig - die beiden Schranken", () => {
  it("unter 5 Stunden nie fällig, auch ohne bisherigen Zustand", () => {
    expect(spendenBannerFaellig(0, null)).toBe(false);
  });

  it("★★★★★ der ALLERERSTE Banner darf sofort kommen, nicht erst nach zwei Monaten Wartezeit", () => {
    expect(spendenBannerFaellig(5, null)).toBe(true);
  });

  it("derselbe Meilenstein erscheint kein zweites Mal", () => {
    const zustand = { meilensteinH: 10, zuletztGezeigtMs: Date.now() };
    expect(spendenBannerFaellig(10, zustand)).toBe(false);
    // Auch nicht rückwärts, falls der Durchschnitt je sinken sollte.
    expect(spendenBannerFaellig(5, zustand)).toBe(false);
  });

  it("★★★★★ ein neuer Meilenstein bleibt gesperrt, solange die zwei Monate nicht um sind", () => {
    const vorEinerWoche = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const zustand = { meilensteinH: 10, zuletztGezeigtMs: vorEinerWoche };
    expect(spendenBannerFaellig(15, zustand)).toBe(false);
  });

  it("nach zwei Monaten öffnet derselbe neue Meilenstein wieder", () => {
    const vorZweiMonatenUndEinemTag = new Date();
    vorZweiMonatenUndEinemTag.setMonth(vorZweiMonatenUndEinemTag.getMonth() - 2);
    vorZweiMonatenUndEinemTag.setDate(vorZweiMonatenUndEinemTag.getDate() - 1);
    const zustand = { meilensteinH: 10, zuletztGezeigtMs: vorZweiMonatenUndEinemTag.getTime() };
    expect(spendenBannerFaellig(15, zustand)).toBe(true);
  });
});

describe("Zustand: Speicher lesen und schreiben - pro KONTO, nicht pro Klasse", () => {
  it("ohne gespeicherten Zustand liefert das Lesen null", () => {
    expect(spendenBannerZustandLesen("konto-1")).toBeNull();
  });

  it("merkt Meilenstein und Zeitpunkt je Konto getrennt", () => {
    const jetzt = Date.now();
    spendenBannerMerken("konto-1", 10, jetzt);
    spendenBannerMerken("konto-2", 25, jetzt);
    expect(spendenBannerZustandLesen("konto-1")).toEqual({
      meilensteinH: 10,
      zuletztGezeigtMs: jetzt,
    });
    expect(spendenBannerZustandLesen("konto-2")).toEqual({
      meilensteinH: 25,
      zuletztGezeigtMs: jetzt,
    });
  });

  it("★★★ EIN Konto mit mehreren Klassen hat trotzdem nur EINEN Zustand - die höchste Klasse zählt für alle", () => {
    // So ruft der Aufrufer es auf: bei mehreren Klassen wird der höchste
    // Meilenstein hereingereicht, nicht je Klasse eigens geprüft.
    const jetzt = Date.now();
    spendenBannerMerken("lehrkraft-a", 10, jetzt);
    const zustand = spendenBannerZustandLesen("lehrkraft-a");
    // Klasse B derselben Lehrkraft steht bereits bei 15 Stunden im Schnitt -
    // trotzdem gesperrt, weil erst vor Sekunden ein Banner lief.
    expect(spendenBannerFaellig(15, zustand, jetzt + 1000)).toBe(false);
  });

  it("★★★★★ verschiedene Programme TEILEN sich den Zustand - appübergreifend EIN Schlüssel (Nachbesserung 19.09.2026)", () => {
    // Bis 19.09.2026 hing der Schlüssel zusätzlich am Programm - eine
    // Lehrkraft konnte in Tastenflow UND in Punktgenau je einen eigenen
    // Banner sehen. Der Aufrufer reicht `app` seither nur noch für die TEXTE
    // herein (`SpendenBanner.tsx`), nicht mehr in den Speicher-Schlüssel.
    spendenBannerMerken("konto-1", 20, Date.now());
    expect(spendenBannerZustandLesen("konto-1")).not.toBeNull();
    expect(spendenBannerZustandLesen("konto-1")?.meilensteinH).toBe(20);
  });
});

describe("spendenBannerZustandNeuestes - Server und localStorage, der NEUERE gilt", () => {
  it("ohne beide Zustände: null", () => {
    expect(spendenBannerZustandNeuestes(null, null)).toBeNull();
  });

  it("nur einer vorhanden: der gilt, unabhängig davon, ob a oder b", () => {
    const z = { meilensteinH: 10, zuletztGezeigtMs: 1000 };
    expect(spendenBannerZustandNeuestes(z, null)).toEqual(z);
    expect(spendenBannerZustandNeuestes(null, z)).toEqual(z);
  });

  it("★★★★★ von zwei Zuständen gewinnt der NEUERE - nicht der mit dem höheren Meilenstein", () => {
    const aelter = { meilensteinH: 20, zuletztGezeigtMs: 1000 };
    const neuer = { meilensteinH: 10, zuletztGezeigtMs: 2000 };
    expect(spendenBannerZustandNeuestes(aelter, neuer)).toEqual(neuer);
    expect(spendenBannerZustandNeuestes(neuer, aelter)).toEqual(neuer);
  });
});
