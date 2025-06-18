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
    <div style={{ margin: '0px 48px' }}>
      <div style={{ padding: '24px', fontFamily: '"Helvetica Neue", sans-serif' }}>
        <div style={{ height: '32px' }}></div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
						Nuevo articulo
					</div>
        <label htmlFor="articleTitle" style={{ marginLeft: '16px' }}>Título del articulo</label>
        <input
          type="text"
          id="articleTitle"
          style={styles.editorWrapper}
          value={titleLayout}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título del artículo"
        />
        <label htmlFor="articleContent" style={{ marginLeft: '16px' }}>Contenido del articulo</label>
        <div id="articleContent" style={{ marginBottom: '16px' }}>
          <MarkdownEditor onContentChange={setContent} />
        </div>
        <label htmlFor="articleLayout" style={{ marginLeft: '16px' }}>Disposición del articulo</label>
        <div id="articleLayout" style={styles.articleLayoutWrapper}>
          <LayoutCarousel layouts={PreviewLayouts({title: titleLayout})} onSelect={handleLayoutChange} />
        </div>
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
  articleLayoutWrapper: {
    borderRadius: '24px',
    padding: '24px 0px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: '16px',
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