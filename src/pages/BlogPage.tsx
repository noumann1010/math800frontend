import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import { FadeIn } from '../components/FadeIn';
import { blogPosts as localBlogPosts } from '../data/mockData';
import { api } from '../lib/api';
import type { BlogPost } from '../types';

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(localBlogPosts);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const response = await api.getBlogPosts();
        if (isMounted) {
          setPosts(response.data);
        }
      } catch {
        // keep fallback
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const [featured, ...rest] = posts;

  return (
    <main>
      <section className="section section--muted">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">By Nouman in inspiration</p>
            <div className="featured-blog">
              <div>
                <h1>{featured?.title}</h1>
                <p>{featured?.excerpt}</p>
                <button
                  className="btn btn--solid"
                  onClick={() => featured && navigate(`/blog/${featured.id}`)}
                >
                  Start learning now
                </button>
              </div>
              <img src={featured?.image} alt={featured?.title} />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Reading blog list</h2>
            <button className="btn btn--ghost" onClick={() => navigate('/courses')}>
              See all courses
            </button>
          </div>

          <div className="blog-grid">
            {rest.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.08}>
                <BlogCard post={post} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
