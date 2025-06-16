'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function Inicio() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function setNewTitle(newTitle: string) {
    setTitle(newTitle);
  }

  const handleSubmit = () => {
    const post = {
      title: title,
      content: content,
      date: new Date().toISOString(),
    };

    console.log('Artículo para guardar:', post);
  };

  return (
    <div>
      <div style={{ padding: '24px', fontFamily: '"Helvetica Neue", sans-serif' }}>
        <h1>Cosas que faltan:</h1>
        <ul>
          <li>Opcion para modificar informacion general de la pagina</li>
          <li>Agregar boton para colocar eventos en el articulo</li>
          <li>Agregar textos descriptivos (Nueva publicacion, boton publicar, etc)</li>
          <li>Elegir disposicion de vista (Imagen arriba, fecha abajo, titulo izquierda etc)</li>
        </ul>
        <div style={{ height: '32px' }}></div>
        <input
          type="text"
          style={styles.editorWrapper}
          value={title}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Título del artículo"
        />
        <MarkdownEditor onContentChange={setContent} />
        <button onClick={handleSubmit} style={styles.publishButton}>Publicar</button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
editorWrapper: {
    position: "relative",
    height: "48px",
		width: "100%",
    fontFamily: '"Helvetica Neue", sans-serif',
		background: "white",
		marginBottom: '24px',
		paddingLeft: '24px',
    paddingRight: '24px',
		boxSizing: "border-box",
		borderRadius: '24px',
    border: '0px solid',
		overflow: 'hidden',
  },
  publishButton: {
    backgroundColor: '#FF9D25',
    color: 'black',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center', // horizontal
    alignContent: 'center', // vertical
    border: 'none',
    borderRadius: '24px',
    margin: '12px 24px',
    padding: '2px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  publishButtonHover: {
    backgroundColor: 'white',
  },
}