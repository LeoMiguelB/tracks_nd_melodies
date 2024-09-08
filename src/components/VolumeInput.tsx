interface VolumeInputProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeInput({
  volume,
  onVolumeChange,
}: VolumeInputProps) {
  return (
    <input
      aria-label="volume"
      name="volume"
      type="range"
      min={0}
      step={0.01}
      max={1}
      value={volume}
      // mobile users don't really use in built volume controls rather they use the phones volume controls
      className="hidden sm:inline w-[70px] sm:w-[130px] m-0 h-2 rounded-full accent-[background] bg-gray-700 appearance-none cursor-pointer"
      onChange={(e) => {
        onVolumeChange(e.currentTarget.valueAsNumber);
      }}
    />
  );
}

