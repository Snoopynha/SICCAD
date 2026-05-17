export default function InputField({
  type,
  value,
  setValue,
  placeholder,
  onEnter,
  temaClaro
}){

  return(

    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {

        if(e.key === "Enter"){

          onEnter();

        }

      }}
      className={`
        w-full
        h-14
        bg-transparent
        border-b
        outline-none
        text-base
        transition

        ${temaClaro
          ? "border-zinc-300 text-black"
          : "border-zinc-700 text-white"}

        focus:border-sky-400
      `}
    />

  );

}