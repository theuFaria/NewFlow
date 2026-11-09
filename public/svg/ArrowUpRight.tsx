export default function ArrowUpRight({
  width,
  length,
}: {
  width?: string;
  length?: string;
}) {
  return (
    <svg
      width={width ? width : 8}
      height={length ? length : 8}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.999 6.999V0.75H0.75M6.999 0.75L0.75 6.999"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke="#252722"
      />
    </svg>
  );
}
