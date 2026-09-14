import React, { useEffect, useMemo, useState } from "react";
import "./credit-card-form.css";

export type CardState = {
  number: string;
  holder: string;
  month: string;
  year: string;
  cvv: string;
};

export type CardValidity = {
  number: boolean;
  holder: boolean;
  month: boolean;
  year: boolean;
  cvv: boolean;
  allValid: boolean;
};

type Props = {
  defaultNumber?: string;
  defaultHolder?: string;
  defaultMonth?: string;
  defaultYear?: string;
  defaultCVV?: string;
  maskMiddle?: boolean;
  ring1?: string;
  ring2?: string;
  showSubmit?: boolean;
  onChange?: (state: CardState, validity: CardValidity) => void;
  onSubmit?: (state: CardState, validity: CardValidity) => void;
  className?: string;
};

function formatNumberSpaces(num: string): string {
  return num.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
}

function clampDigits(value: string, maxLen: number) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

export const CreditCardForm = ({
  defaultNumber = "",
  defaultHolder = "",
  defaultMonth = "",
  defaultYear = "",
  defaultCVV = "",
  maskMiddle = true,
  ring1 = "#ff9d00",
  ring2 = "#ff5500",
  showSubmit = false,
  onChange,
  onSubmit,
  className = "",
}: Props) => {
  const [number, setNumber] = useState(clampDigits(defaultNumber, 19));
  const [holder, setHolder] = useState(defaultHolder.toUpperCase());
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [cvv, setCVV] = useState(clampDigits(defaultCVV, 4));
  const [focusField, setFocusField] = useState<null | "number" | "holder" | "expire" | "cvv">(null);

  const flip = focusField === "cvv";
  const years = useMemo(() => {
    const start = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => String(start + i));
  }, []);

  const validity: CardValidity = useMemo(() => {
    const nValidLength = number.length >= 13;
    const numberValid = nValidLength;
    const holderValid = holder.trim().length >= 2;
    const monthValid = !!month && +month >= 1 && +month <= 12;
    const yearValid = !!year && +year >= new Date().getFullYear();
    const cvvValid = /^\d{3,4}$/.test(cvv);
    return {
      number: numberValid,
      holder: holderValid,
      month: monthValid,
      year: yearValid,
      cvv: cvvValid,
      allValid: numberValid && holderValid && monthValid && yearValid && cvvValid,
    };
  }, [number, holder, month, year, cvv]);

  useEffect(() => {
    onChange?.({ number, holder, month, year, cvv }, validity);
  }, [number, holder, month, year, cvv, validity, onChange]);

  const displayDigits = useMemo(() => number.slice(0, 16).split(""), [number]);

  const displayedSlots = useMemo(() => {
    const arr: { textTop: string; filed: boolean }[] = [];
    for (let i = 0; i < 16; i++) {
      let content = "#";
      if (i < displayDigits.length) {
        const d = displayDigits[i];
        const shouldMask = maskMiddle && i >= 4 && i <= 11;
        content = shouldMask ? "*" : d;
      }
      arr.push({ textTop: content, filed: i < displayDigits.length });
    }
    return arr;
  }, [displayDigits, maskMiddle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ number, holder, month, year, cvv }, validity);
  };

  return (
    <section className={`ccp ${className}`}>
      <div className="wrap w-full">
        <section id="card" className={`card-container ${flip ? "flip" : ""}`}>
          <section className="card__front" style={{ ["--ring1" as any]: ring1, ["--ring2" as any]: ring2 }}>
            <div className="card__header">
              <svg viewBox="0 0 48 48" width="40" height="40">
                <path fill="#444" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                <path fill="#fff" d="M41 10H7c-1.654 0-3 1.346-3 3v22c0 1.654 1.346 3 3 3h34c1.654 0 3-1.346 3-3V13c0-1.654-1.346-3-3-3zm1 25c0 .551-.449 1-1 1H7c-.551 0-1-.449-1-1V13c0-.551.449-1 1-1h34c.551 0 1 .449 1 1v22z"/>
                <path fill="#fff" d="M11 28H19V30H11zM23 28H31V30H23z"/>
              </svg>
              <div>FOGO E CHAPA</div>
            </div>

            <div id="card_number" className="card__number" aria-label="Card number">
              {displayedSlots.map((slot, idx) => (
                <span key={idx} className="slot">
                  <span className={`digit ${slot.filed ? "filed" : ""}`}>
                    <span className="row placeholder text-white/30">#</span>
                    <span className="row value font-bold">{slot.textTop}</span>
                  </span>
                </span>
              ))}
            </div>

            <div className="card__footer">
              <div className="card__holder">
                <div className="card__section__title">Titular do Cartao</div>
                <div id="card_holder" className="font-bold tracking-wider">{holder || "NOME NO CARTAO"}</div>
              </div>
              <div className="card__expires text-right">
                <div className="card__section__title">Validade</div>
                <div className="font-bold tracking-wider">
                  <span id="card_expires_month">{month || "MM"}</span>/
                  <span id="card_expires_year">{year ? year.slice(-2) : "AA"}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card__back" style={{ ["--ring1" as any]: ring1, ["--ring2" as any]: ring2 }}>
            <div className="card__hide_line" />
            <div className="card_cvv">
              <span>CVV</span>
              <div id="card_cvv_field" className="card_cvv_field">
                {"*".repeat(cvv.length)}
              </div>
            </div>
          </section>
        </section>

        <form className="cc-form" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="number">Numero do Cartao</label>
            <input
              id="number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={formatNumberSpaces(number)}
              onChange={(e) => setNumber(clampDigits(e.target.value, 19))}
              onFocus={() => setFocusField("number")}
              onBlur={() => setFocusField(null)}
              aria-invalid={!validity.number}
            />
          </div>

          <div>
            <label htmlFor="holder">Nome do Titular</label>
            <input
              id="holder"
              type="text"
              autoComplete="cc-name"
              placeholder="NOME COMO ESTA NO CARTAO"
              value={holder}
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
              onFocus={() => setFocusField("holder")}
              onBlur={() => setFocusField(null)}
              aria-invalid={!validity.holder}
            />
          </div>

          <div className="filed__group">
            <div>
              <label>Validade</label>
              <div className="filed__date">
                <select
                  id="expiration_month"
                  value={month || ""}
                  onChange={(e) => setMonth(e.target.value)}
                  onFocus={() => setFocusField("expire")}
                  onBlur={() => setFocusField(null)}
                  aria-invalid={!validity.month}
                >
                  <option value="" disabled>Mes</option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  id="expiration_year"
                  value={year || ""}
                  onChange={(e) => setYear(e.target.value)}
                  onFocus={() => setFocusField("expire")}
                  onBlur={() => setFocusField(null)}
                  aria-invalid={!validity.year}
                >
                  <option value="" disabled>Ano</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCVV(clampDigits(e.target.value, 4))}
                onFocus={() => setFocusField("cvv")}
                onBlur={() => setFocusField(null)}
                aria-invalid={!validity.cvv}
                maxLength={4}
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};