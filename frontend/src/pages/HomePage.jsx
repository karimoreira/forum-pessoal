import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Erro ao buscar posts', err));
  }, []);

  return (
    <div>
      <h2>Posts recentes</h2>
      {posts.length === 0 ? (
        <p>Nenhum post ainda.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/post/${post._id}`}>Ver mais</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;
