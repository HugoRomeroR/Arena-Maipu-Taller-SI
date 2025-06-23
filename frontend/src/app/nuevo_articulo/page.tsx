'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import LayoutCarousel from '../components/LayoutCarousel';
import { PreviewLayouts } from '../components/PreviewLayouts';

const MarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function nuevoArticulo() {
  const [titleLayout, setTitle] = useState('');
  const [articleLayout, setArticleLayout] = useState(0);
  const [content, setContent] = useState('');

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  }

  const handleLayoutChange = (index: number) => {
    setArticleLayout(index);
  };

  const handleSubmit = () => {
    const post = {
      titleLayout: titleLayout,
      content: content,
      articleLayout: articleLayout,
      dateLayout: new Date().toISOString(),
    };

    console.log('Artículo para guardar:', post);
  };

  return (
    <div style={styles.nuevoArticuloBody}>

      { /* Título del artículo */ }
      <div style={styles.whiteContainer}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Creando un nuevo artículo:
        </div>
        <hr style={styles.nuevoArticuloLineStyle} />
        <label htmlFor="articleTitle" style={{ margin: '0px 0px 16px 16px', display: 'block' }}>
          Título del artículo
        </label>
        <input
          type="text"
          id="articleTitle"
          style={styles.articleTitleBox}
          value={titleLayout}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Escribe aquí el título de tu artículo..."
        />
      </div>

      { /* Contenido del artículo */ }
      <div style={styles.whiteContainer}>
        <label htmlFor="articleContent" style={{ margin: '0px 0px 16px 16px', display: 'block' }}>
          Contenido del artículo
        </label>
        <div id="articleContent" style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)', borderRadius: '16px' }}>
          <MarkdownEditor
            onContentChange={setContent}
          />
        </div>
      </div>

      { /* Disposición del artículo */ }
      <div style={styles.whiteContainer}>
        <label htmlFor="articleLayout" style={{ margin: '0px 0px 16px 16px', display: 'block' }}>
          Disposición del artículo
        </label>
        <div id="articleLayout" style={styles.articleLayoutWrapper}>
          <LayoutCarousel
            layouts={PreviewLayouts({title: titleLayout})}
            onSelect={handleLayoutChange} 
          />
        </div>
      </div>

      <button onClick={handleSubmit} style={styles.publishButton}>
        Publicar
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nuevoArticuloBody: {
    fontFamily: '"Helvetica Neue", sans-serif',
    margin: '48px',
    padding: '0px 48px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  whiteContainer: {
    padding: '18px',
    backgroundColor: 'white',
    borderRadius: '16px' 
  },
  nuevoArticuloLineStyle: {
    border: 'none',
    height: '2px',
    width: '100%',
    backgroundColor: '#AEAEAE',
    margin: '16px 0px',
  },
  articleTitleBox: {
    position: "relative",
    height: "48px",
    width: "100%",
    fontFamily: '"Helvetica Neue", sans-serif',
    background: "white",
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: "border-box",
    borderRadius: '24px',
    border: 'none',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  articleLayoutWrapper: {
    borderRadius: '24px',
    padding: '24px 0px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
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
  },
}