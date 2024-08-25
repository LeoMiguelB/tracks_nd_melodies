interface ProgressCSSProps extends React.CSSProperties {
  '--progress-width': number;
}

interface AudioProgressBarProps
  extends React.ComponentPropsWithoutRef<'input'> {
  duration: number;
  currentProgress: number;
}

export default function AudioProgressBar(props: AudioProgressBarProps) {
  const { duration, currentProgress, ...rest } = props;

  const progressBarWidth = isNaN(currentProgress / duration)
    ? 0
    : currentProgress / duration;

  const progressStyles: ProgressCSSProps = {
    '--progress-width': progressBarWidth,
  };

  return (
    <div className="absolute h-1 -top-[4px] left-0 right-0 group">
      <input
        type="range"
        name="progress"
        className={`progress-bar absolute inset-0 w-full m-0 h-full appearance-none cursor-pointer bg-gray-700 accent-[background] group-hover:h-2 transition-all`}
        style={progressStyles}
        min={0}
        max={duration}
        value={currentProgress}
        {...rest}
      />
    </div>
  );
}

