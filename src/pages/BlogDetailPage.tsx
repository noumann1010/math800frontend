import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import { FadeIn } from '../components/FadeIn';
import { blogPosts } from '../data/mockData';

export function BlogDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useMemo(() => blogPosts.find((item) => item.id === postId) ?? blogPosts[0], [postId]);
  const relatedPosts = useMemo(
    () => blogPosts.filter((item) => item.id !== post.id).slice(0, 2),
    [post.id],
  );

  return (
    <main>
      <section className="section section--tight">
        <div className="container">
          <img src={post.image} alt={post.title} className="rounded-image blog-detail-image" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">{post.tag}</p>
            <h1>{post.title}</h1>
            <p className="muted">
              By {post.author} | {post.readTime} read | {post.createdAt}
            </p>
            <p>{post.content}</p>
            <div className="tag-row">
              <span>#education</span>
              <span>#sat</span>
              <span>#learning</span>
              <span>#mathprep</span>
            </div>
            <button className="btn btn--ghost" onClick={() => navigate('/blog')}>
              Back to Blog
            </button>
          </FadeIn>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-heading">
            <h2>Related Blog</h2>
          </div>
          <div className="blog-grid">
            {relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
