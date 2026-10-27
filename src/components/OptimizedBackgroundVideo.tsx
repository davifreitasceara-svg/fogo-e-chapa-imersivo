import React, { useRef, useEffect } from "react";

interface OptimizedBackgroundVideoProps {
  src: string;
  webmSrc?: string;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
}

/**
 * OptimizedBackgroundVideo
 * - Suporta WebM (VP9) e MP4 (H.264) com GOP curto (keyframe a cada 1s) e sem áudio
 * - Pausa quando fora da tela ou quando active=false para liberar 100% da GPU
 * - Previne micro-travamentos e frame drops do compositor
 * - Isola camadas CSS (GPU compositing layer) para fluidez de 60fps
 */
export function OptimizedBackgroundVideo({
  src,
  webmSrc,
  active = true,
  className = "w-full h-full object-cover opacity-50",
  style,
  objectPosition,
}: OptimizedBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deriva webmSrc automaticamente se for quero_mais_chamas.mp4
  const resolvedWebmSrc = webmSrc || (src.includes("quero_mais_chamas") ? "/quero_mais_chamas.webm" : undefined);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Configuração de propriedades nativas de baixo nível
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    if (!active) {
      if (!video.paused) {
        video.pause();
      }
      return;
    }

    let isIntersecting = false;

    const playVideo = () => {
      if (video.paused && active) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && active) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "250px", // Margem ampla para iniciar decodificação antes de aparecer
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      pauseVideo();
    };
  }, [src, resolvedWebmSrc, active]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        contain: "strict",
        transform: "translateZ(0)",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className={className}
        style={{
          transform: "translateZ(0)",
          objectPosition,
          ...style,
        }}
      >
        {resolvedWebmSrc && <source src={resolvedWebmSrc} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
