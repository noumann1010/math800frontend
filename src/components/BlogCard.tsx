import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types';

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article className="blog-card" whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <img src={post.image} alt={post.title} />
      <div className="blog-card__body">
        <p className="blog-card__meta">
          By {post.author} in {post.tag}
        </p>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <Link className="text-link" to={`/blog/${post.id}`}>
          Read more
        </Link>
      </div>
    </motion.article>
  );
}
