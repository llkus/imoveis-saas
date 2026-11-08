import { videoEmbed } from "@/lib/midia";

// Vídeo (YouTube ou Instagram) incorporado e link do tour virtual.
export default function SecaoMidia({ videoUrl, tourUrl, cor }: { videoUrl?: string; tourUrl?: string; cor: string }) {
  const video = videoEmbed(videoUrl);
  if (!video && !tourUrl) return null;

  return (
    <section className="mt-10 space-y-8 animate-fade-up">
      {video && (
        <div>
          <h2 className="font-display text-3xl font-medium">Vídeo</h2>
          <div
            className={`mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-black ${video.provedor === "instagram" ? "mx-auto max-w-sm" : ""}`}
          >
            <iframe
              src={video.embed}
              title="Vídeo do imóvel"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className={`w-full ${video.provedor === "instagram" ? "h-[560px] bg-white" : "aspect-video"}`}
            />
          </div>
          <a
            href={video.original}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold hover:underline"
            style={{ color: cor }}
          >
            {video.provedor === "instagram" ? "Ver no Instagram ↗" : "Ver no YouTube ↗"}
          </a>
        </div>
      )}

      {tourUrl && (
        <div>
          <h2 className="font-display text-3xl font-medium">Tour virtual</h2>
          <a href={tourUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-4">
            Abrir tour virtual ↗
          </a>
        </div>
      )}
    </section>
  );
}
