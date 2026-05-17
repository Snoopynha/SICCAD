import { Fingerprint } from "lucide-react";

export default function LoginIcon() {

  return (

    <div
      className="
        w-15
        h-8
        rounded-full
        flex
        items-center
        justify-center
        transition-all
        duration-300
        bg-inherit
      "
    >
      <Fingerprint
        size={47}
        strokeWidth={1.7}
        className="text-sky-400"
      />

    </div>

  );

}