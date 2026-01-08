import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Game } from "./types";
import { StarRating, getAverageRating } from "./StarRating";
import { apiFetch } from "./lib/api";
import { useCart } from "./CartContext";

function GameDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  // State to track which image is currently big (Gallery logic)
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await apiFetch(`/games/${id}`);
        if (!response.ok) throw new Error("Game not found");
        const data = await response.json();
        setGame(data);
        // Set the main cover as the default selected image
        setSelectedImage(data.coverImage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading game details...</div>;
  if (!game) return <div className="text-center p-10">Game not found!</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        ← Back to Shop
      </Link>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT COLUMN: Gallery */}
          <div className="p-6 bg-gray-50">
            {/* Main Big Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm border border-gray-200">
              <img src={selectedImage} alt={game.title} className="w-full h-full object-cover" />
            </div>

            {/* Thumbnails (Cover + Screenshots) */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[game.coverImage, ...(game.screenshots || [])].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded border-2 transition-all ${selectedImage === img ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Info */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm font-bold tracking-wider text-blue-600 uppercase">{game.category}</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-1">{game.title}</h1>

                <div className="mt-2">
                  <StarRating
                    rating={getAverageRating(game.reviews)}
                    count={game.reviews?.length}
                    size="lg"
                  />
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                ${game.price}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {game.tags.map(tag => (
                <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              {game.content || game.description}
            </p>

            <button 
            onClick={() => game && addToCart(game.id)}
            className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-lg hover:bg-blue-700 transition-transform active:scale-95 shadow-md">
              Add to Cart
            </button>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="border-t border-gray-200 p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Player Reviews
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {game.reviews?.length || 0}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {game.reviews?.map(review => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-2 text-yellow-400">
                  {/* Star Logic */}
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{review.text}"</p>
              </div>
            ))}

            {(!game.reviews || game.reviews.length === 0) && (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GameDetails;