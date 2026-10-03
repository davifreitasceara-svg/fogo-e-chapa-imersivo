import { createFileRoute, Link } from "@tanstack/react-router";
import { ExplodingBurger } from "@/components/ExplodingBurger";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute('/gallery')({
  component: GalleryRoute,
});

function GalleryRoute() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/" className="flex items-center justify-center bg-black text-white w-12 h-12 rounded-full hover:bg-gray-800 transition-colors shadow-lg">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>
      <ExplodingBurger />
    </div>
  );
}
