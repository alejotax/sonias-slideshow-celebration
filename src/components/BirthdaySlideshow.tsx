import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Sparkles, RotateCw, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

interface Media {
  id: number;
  src: string;
  type: 'image' | 'video';
  caption?: string;
}

const BirthdaySlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());
  const [imageRotation, setImageRotation] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showImageControls, setShowImageControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // Nuevo estado

  // Generate media array: 64 photos
  const media: Media[] = Array.from({ length: 64 }, (_, i) => ({
    id: i + 1,
    src: `foto${i + 1}.jpg`,
    type: 'image' as const,
    caption: `Recuerdo especial ${i + 1}`
  }));

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % media.length);
    setImageRotation(0);
    setImageZoom(1);
  }, [media.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + media.length) % media.length);
    setImageRotation(0);
    setImageZoom(1);
  }, [media.length]);

  const rotateImage = (direction: 'left' | 'right') => {
    setImageRotation(prev => direction === 'right' ? prev + 90 : prev - 90);
  };

  const zoomImage = (direction: 'in' | 'out') => {
    setImageZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const resetImageTransform = () => {
    setImageRotation(0);
    setImageZoom(1);
  };

  const handleImageError = (id: number) => {
    setImageLoadError(prev => new Set(prev).add(id));
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !showWelcome) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide, showWelcome]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showWelcome) return;
      if (isFullscreen) {
        if (event.key === 'Escape') {
          setIsFullscreen(false);
        }
        return;
      }
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          event.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying, showWelcome, isFullscreen]);

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-pink to-secondary flex items-center justify-center p-6 rgb-lights">
        <Card className="max-w-2xl mx-auto text-center p-12 birthday-shadow animate-celebration-entrance rgb-glow">
          <div className="relative">
            {/* Floating hearts decoration */}
            <div className="absolute -top-6 -left-6 text-celebration animate-float">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="absolute -top-4 -right-8 text-golden animate-sparkle">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
            <div className="absolute -bottom-4 -left-8 text-primary animate-sparkle delay-1000">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            {/* Main content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold font-dancing celebration-text animate-slide-in-left">
                  ¡Feliz Cumpleaños!
                </h1>
                <h2 className="text-4xl md:text-5xl font-semibold font-dancing golden-text animate-slide-in-right delay-300">
                  Sonia
                </h2>
              </div>
              <div className="space-y-6 animate-celebration-entrance delay-500">
                <p className="text-xl font-quicksand text-foreground/80 leading-relaxed">
                  Una celebración de momentos preciosos y recuerdos invaluables.
                  <br />
                  Disfruta de esta presentación especial creada con mucho amor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    onClick={() => setShowWelcome(false)}
                    size="lg"
                    className="bg-primary hover:bg-celebration text-primary-foreground px-8 py-4 text-lg font-semibold font-quicksand birthday-shadow hover:scale-105 transition-all duration-300 rgb-border"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Comenzar Presentación
                  </Button>
                  <p className="text-sm font-quicksand text-muted-foreground">
                    Usa las flechas ← → o la barra espaciadora para navegar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentMedia = media[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-pink/30 to-secondary/50 rgb-lights">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary/20 px-6 py-4 rgb-pulse">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Heart className="w-8 h-8 text-celebration fill-current animate-float" />
            <div>
              <h1 className="text-2xl font-bold font-dancing celebration-text">Cumpleaños de Sonia</h1>
              <p className="text-sm font-quicksand text-muted-foreground">
                {currentSlide + 1} de {media.length} • {currentMedia.type === 'video' ? 'Video' : 'Fotografía'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-primary/30 hover:bg-primary/10 font-quicksand rgb-border"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWelcome(true)}
              className="border-primary/30 hover:bg-primary/10 font-quicksand rgb-border"
            >
              Inicio
            </Button>
          </div>
        </div>
      </div>

      {/* Main slideshow area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative max-w-5xl w-full">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-primary/30 hover:bg-primary/10 w-12 h-12 birthday-shadow"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-primary/30 hover:bg-primary/10 w-12 h-12 birthday-shadow"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Image controls - positioned above the card */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => rotateImage('left')}
                className="text-white hover:bg-white/20 p-2 h-auto"
                title="Rotar izquierda"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => rotateImage('right')}
                className="text-white hover:bg-white/20 p-2 h-auto"
                title="Rotar derecha"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-white/30 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => zoomImage('out')}
                className="text-white hover:bg-white/20 p-2 h-auto"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => zoomImage('in')}
                className="text-white hover:bg-white/20 p-2 h-auto"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetImageTransform}
                className="text-white hover:bg-white/20 p-2 h-auto text-xs"
                title="Resetear"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Media container */}
          <Card className="relative overflow-hidden card-shadow animate-gentle-glow group rgb-glow rgb-border">
            <div className="aspect-[16/10] bg-gradient-to-br from-muted to-secondary/30 flex items-center justify-center overflow-hidden">
              {imageLoadError.has(currentMedia.id) ? (
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-dancing text-foreground mb-2">
                    {currentMedia.caption}
                  </h3>
                  <p className="font-quicksand text-muted-foreground">
                    Imagen: {currentMedia.src}
                  </p>
                  <p className="text-sm font-quicksand text-muted-foreground mt-2">
                    (Coloca la imagen en la carpeta public del proyecto)
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={currentMedia.src}
                    alt={currentMedia.caption}
                    className="max-w-full max-h-full object-contain transition-all duration-300 ease-out cursor-pointer"
                    style={{
                      transform: `rotate(${imageRotation}deg) scale(${imageZoom})`,
                      transformOrigin: 'center'
                    }}
                    onError={() => handleImageError(currentMedia.id)}
                    onClick={() => setIsFullscreen(true)}
                  />
                </div>
              )}
            </div>
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h3 className="text-white text-lg font-semibold font-dancing mb-1">
                {currentMedia.caption}
              </h3>
              <p className="text-white/80 text-sm font-quicksand">
                {currentMedia.type === 'video' ? 'Video especial' : `Fotografía ${currentMedia.id}`}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Pantalla completa */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center animate-fade-in"
          onClick={() => setIsFullscreen(false)}
          style={{ cursor: 'zoom-out' }}
        >
          <img
            src={currentMedia.src}
            alt={currentMedia.caption}
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-8 right-8 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
            onClick={() => setIsFullscreen(false)}
            aria-label="Cerrar pantalla completa"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-primary/20 px-6 py-4 rgb-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium font-quicksand text-foreground">
              Progreso de la presentación
            </span>
            <span className="text-sm font-quicksand text-muted-foreground">
              {Math.round(((currentSlide + 1) / media.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-celebration h-2 rounded-full transition-all duration-500 golden-shadow"
              style={{ width: `${((currentSlide + 1) / media.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="fixed top-20 left-10 text-celebration/30 animate-float delay-500">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="fixed top-32 right-16 text-golden/40 animate-sparkle delay-1000">
        <Heart className="w-5 h-5" />
      </div>
      <div className="fixed bottom-20 left-20 text-primary/30 animate-float delay-700">
        <Sparkles className="w-4 h-4" />
      </div>
    </div>
  );
};

export default BirthdaySlideshow;
