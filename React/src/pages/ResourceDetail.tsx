import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadResourceById, Resource } from "@/lib/config/resources";

const AUTHOR_BIOS: Record<string, string> = {
  "Warren MacKenzie":
    "Warren MacKenzie is a Chartered Professional Accountant and veteran financial advisor. He has authored several books on investing and retirement planning and holds the CFP, CIMA, and CIM designations.",
};

function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    if (id) {
      loadResourceById(id)
        .then(r => {
          if (!isMounted) return;
          setResource(r ?? null);
        })
        .catch((e) => {
          if (!isMounted) return;
          console.error("Failed to load resource", e);
          setError("Failed to load resource.");
          setResource(null);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setResource(null);
    }
    return () => { isMounted = false };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 max-w-3xl py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container mx-auto px-6 max-w-3xl py-12">
        <div className="text-destructive">{error ?? "Resource not found."}</div>
      </div>
    );
  }

  const paragraphs = resource.content.split("\n\n");

  return (
    <div className="container mx-auto px-6 max-w-3xl py-12">
      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <img
          src={`/${resource.image}`}
          alt={resource.title}
          className="w-full h-56 md:h-72 object-cover rounded-lg border mb-6"
        />
        <h1 className="mt-0">{resource.title}</h1>
        <div className="text-xs text-muted-foreground mb-6">
          {new Date(resource.date).toLocaleDateString()} · {resource.author}
        </div>
        <div className="space-y-4">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">{para}</p>
          ))}
        </div>
      </article>

      <section className="mt-12 rounded-lg border border-border/50 bg-card p-6 flex items-start gap-4">
        {resource.authorImage ? (
          <img
            src={`/${resource.authorImage}`}
            alt={resource.author}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-border/50"
          />
        ) : null}
        <div>
          <div className="font-medium">{resource.author}</div>
          <div className="text-sm text-muted-foreground max-w-none">
            {AUTHOR_BIOS[resource.author] ?? "Contributor to Use It Wisely on topics including retirement planning, investing, and using capital to improve quality of life."}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResourceDetail;


