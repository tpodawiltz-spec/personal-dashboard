function clampPercent(value) {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

// Shows confirmed ("actual") progress as a solid fill, and planned/estimated
// contributions as a lighter overlay reaching further along the bar.
function ProgressBar({ actual, planned, target }) {
  const hasTarget = Number.isFinite(target) && target > 0
  const actualPercent = hasTarget ? clampPercent((actual / target) * 100) : 0
  const plannedPercent = hasTarget
    ? clampPercent(((actual + planned) / target) * 100)
    : 0
  const isComplete = hasTarget && actual >= target

  return (
    <div className="progress-wrap">
      <div className={`progress-track${isComplete ? ' complete' : ''}`}>
        <div className="progress-planned" style={{ width: `${plannedPercent}%` }} />
        <div className="progress-actual" style={{ width: `${actualPercent}%` }} />
      </div>
      <div className="progress-label">
        {hasTarget ? (
          <>
            ${actual.toLocaleString()} / ${target.toLocaleString()}
            {planned > 0 && (
              <span className="progress-planned-text">
                {' '}
                (+${planned.toLocaleString()} planned)
              </span>
            )}
            {isComplete && <span className="progress-complete-badge"> Goal reached!</span>}
          </>
        ) : (
          `$${actual.toLocaleString()} saved`
        )}
      </div>
    </div>
  )
}

export default ProgressBar
