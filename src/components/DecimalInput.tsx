import { useState, useEffect } from 'react';

interface DecimalInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
}

export default function DecimalInput({ value, onChange, placeholder = '0.0000', className }: DecimalInputProps) {
  // Gestisce l'input come stringa per permettere la digitazione fluida di "0.000" senza azzeramenti
  const [text, setText] = useState<string>(value ? value.toString() : '');

  // Sincronizza il testo locale se il valore numerico cambia dall'esterno
  useEffect(() => {
    const currentParsed = parseFloat(text.replace(',', '.'));
    if (value !== currentParsed) {
      setText(value === 0 ? '' : value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Sostituisce la virgola con il punto per standardizzare il formato numerico
    const normalized = val.replace(',', '.');

    // Regex per accettare: stringa vuota, numeri interi, decimali parziali (es. "0." o "0.000")
    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(normalized)) {
      setText(val);

      const parsed = parseFloat(normalized);
      if (!isNaN(parsed)) {
        onChange(parsed);
      } else if (val === '') {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(text.replace(',', '.'));
    if (isNaN(parsed) || parsed === 0) {
      setText('');
      onChange(0);
    } else {
      // Pulisce la formattazione all'uscita (es. "0.5000" -> "0.5")
      setText(parsed.toString());
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      className={className}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={(e) => e.target.select()}
    />
  );
}