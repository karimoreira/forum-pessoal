import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts`)
      .then(res => {
        const p = res.data.find(p => p._id === id);
        setPost(p);
      })
      .catch(err => console.error('Erro ao buscar post', err));
  }, [id]);

  if (!post) return <p>Carregando post...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="imagem" style={{ maxWidth: 400 }} />}
    </div>
  );
}

export default PostPage;
