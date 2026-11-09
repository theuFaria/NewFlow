export default function ProductColor({ color }: { color: string }) {
  return (
    <div
      className={`w-4.5 h-4.5 border rounded-full ${color} border-[#DDDED7] border-2 hover:border-gray-700 hover:w-6 hover:h-6 transition-all duration-300 hover:cursor-pointer`}
    ></div>
  );
}
