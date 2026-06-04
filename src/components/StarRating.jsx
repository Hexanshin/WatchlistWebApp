import "../css/StarRating.css"

function StarRating({ value = 0, max = 10, onRate, editable = false }) {
  const stars = []
  for (let i = 1; i <= max; i++) {
    const filled = i <= value
    stars.push(
      <button
        key={i}
        type="button"
        className={`star ${filled ? 'filled' : ''} ${editable ? 'editable' : ''}`}
        onClick={() => editable && onRate?.(i)}
        aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
      >
        {filled ? '★' : '☆'}
      </button>
    )
  }

  return <div className="star-rating">{stars}</div>
}

export default StarRating
