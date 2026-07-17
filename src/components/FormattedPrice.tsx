interface FormattedPriceProps {
  value: number;
  className?: string; // Ti permette di passare classi per il colore o la dimensione del testo principale
}

export default function FormattedPrice({ value, className = "text-xl font-bold text-gray-900" }: FormattedPriceProps) {
  // 1. Forza a 4 decimali
  const formatted = value.toFixed(4);
  
  // 2. Formato italiano con la virgola
  const formattedIt = formatted.replace('.', ',');
  
  // 3. Separazione chirurgica delle cifre
  const mainPart = formattedIt.slice(0, -2); // Es: "1,51"
  const microPart = formattedIt.slice(-2);   // Es: "23"

  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`}>
      {/* Parte principale (Euro + primi 2 centesimi) */}
      <span>{mainPart}</span>
      
      {/* Centesimi di centesimo: ereditano font e colore, ma sbiaditi via opacità */}
      <span className="text-[0.65em] opacity-75 relative -top-[0.2em] ml-[0.5px]">
        {microPart}
      </span>
      
      {/* Simbolo dell'Euro: anch'esso coordinato al colore del testo, leggermente morbido */}
      <span className="ml-1 text-[0.85em] opacity-95 font-normal">
        €
      </span>
    </span>
  );
}