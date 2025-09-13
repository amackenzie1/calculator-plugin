import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadResourceById, Resource } from "@/lib/config/resources";

function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);

  useEffect(() => {
    if (id) {
      loadResourceById(id).then(r => setResource(r ?? null)).catch(() => setResource(null));
    }
  }, [id]);

  if (!resource) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
      <img src={`/${resource.image}`} alt={resource.title} className="w-full h-56 md:h-72 object-cover rounded-lg border" />
      <h1>{resource.title}</h1>
      <div className="text-xs text-muted-foreground">{new Date(resource.date).toLocaleDateString()} · {resource.author}</div>
      <p>{resource.content}</p>
    </article>
  );
}

export default ResourceDetail;


