import { useRef } from "react";

export default function ImageUpload({ value, onChange, label = "Upload image", className = "" }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(URL.createObjectURL(file));
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className={`flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-card text-copy font-semibold text-menu transition hover:border-primary ${className}`}
      >
        {value ? <img src={value} alt="" className="size-full object-contain p-3" /> : label}
      </button>
    </>
  );
}