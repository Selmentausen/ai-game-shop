import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import type { Game } from "./types";
import { StarRating, getAverageRating } from './StarRating';
import { apiFetch } from './lib/api';
import { useCart } from './CartContext';

function Home() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await apiFetch("/games");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, gameId: number) => {
    e.stopPropagation();
    await addToCart(gameId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {loading && <p className="text-center text-lg">Loading games...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer group"
          >

            {/* Image Section */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Price tag overlay */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                ${game.price}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">

              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {game.title}
                </h2>
                <StarRating
                  rating={getAverageRating(game.reviews)}
                  count={(game.reviews || []).length}
                />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {game.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {game.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, game.id)}
                className="mt-auto w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 active:scale-95 transform"
              >
                {/* Simple SVG Icon for Cart */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;