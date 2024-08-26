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
    <div className="h-6">
      <input
        type="range"
        name="progress"
        className={`w-full m-0 cursor-pointer bg-gray-700 accent-[background]`}
        style={progressStyles}
        min={0}
        max={duration}
        value={currentProgress}
        {...rest}
      />
    </div>
  );
}

