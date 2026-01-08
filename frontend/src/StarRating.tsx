interface Props {
    rating: number;
    count?: number;
    size?: "sm" | "lg";
}

export function StarRating({ rating, count, size = "sm" }: Props) {
  const stars = [...Array(5)].map((_, i) => {
    const isFilled = i < Math.round(rating);
    return (
      <span key={i} className={isFilled ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${size === "lg" ? "text-2xl" : "text-sm"}`}>
        {stars}
      </div>
      
      {/* If count is provided, show it (e.g., "(12)") */}
      {count !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({count})</span>
      )}
    </div>
  );
}

export function getAverageRating(reviews: { rating: number }[] | undefined) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.length
}