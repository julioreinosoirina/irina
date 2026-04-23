interface SectionLabelProps {
  texto: string;
}

export function SectionLabel({ texto }: SectionLabelProps) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-wide mb-3"
      style={{ color: "#a8a29e" }}
    >
      {texto}
    </p>
  );
}
