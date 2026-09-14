interface ProgressProps {
  current: number
  total?: number
}

export function Progress({ current, total = 5 }: ProgressProps) {
  return (
    <div className="progress" aria-label={`Step ${current} of about ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < current ? 'progress-dot active' : 'progress-dot'} />
      ))}
    </div>
  )
}
