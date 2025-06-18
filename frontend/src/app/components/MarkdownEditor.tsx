'use client';
import '../globals.css';

import { useEffect, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor'; // Editor de Toast UI
import '@toast-ui/editor/dist/i18n/es-es'; // Importación del idioma español
import '@toast-ui/editor/dist/toastui-editor.css'; // Estilos del editor
import 'tui-color-picker/dist/tui-color-picker.css'; // Estilos del selector de color
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'; // Estilos del plugin de sintaxis de color

import colorSyntax from '@toast-ui/editor-plugin-color-syntax'; // Plugin para sintaxis de color

// Importación de estilos personalizados para evitar conflictos en typescript
interface MarkdownEditorProps {
  onContentChange: (content: string) => void;
}

export default function MarkdownEditor({ onContentChange }: MarkdownEditorProps) {
	const editorRef = useRef<any>(null);

	// Efecto para manejar los cambios en el contenido del editor
	// y notificar al componente padre
	useEffect(() => {
    const instance = editorRef.current?.getInstance();
    if (!instance) return;

    const handleChange = () => {
      const content = instance.getMarkdown();
      onContentChange(content); // Avisa al padre
    };

    instance.on('change', handleChange);

    return () => {
      instance.off('change', handleChange);
    };
  }, []);

	// Efecto para agregar comandos personalizados de alineación de texto
	useEffect(() => {
    const instance = editorRef.current?.getInstance();
    if (!instance) return;

    instance.addCommand('markdown', 'alignLeft', () => {
			const text = instance.getSelectedText();
			instance.insertText(`<p style="text-align: left;">${text}</p>`);
		});

		instance.addCommand('markdown', 'alignCenter', () => {
			const text = instance.getSelectedText();
			instance.insertText(`<p style="text-align: center;">${text}</p>`);
		});

		instance.addCommand('markdown', 'alignRight', () => {
			const text = instance.getSelectedText();
			instance.insertText(`<p style="text-align: right;">${text}</p>`);
		});

	}, []);

  // Botones personalizados para undo y redo
  const customUndoRedoButtons = [
    {
      name: 'undo',
      tooltip: 'Deshacer',
			className: 'custom-button',
      style: { fontSize: '16px', cursor: 'pointer', userSelect: 'none' },
      command: 'undo',
      text: '←',
    },
    {
      name: 'redo',
      tooltip: 'Rehacer',
			className: 'custom-button',
      style: { fontSize: '16px', cursor: 'pointer', userSelect: 'none' },
      command: 'redo',
      text: '→',
    },
  ];

	// Botones personalizados para alinear texto
	const customAlignButtons = [
		{
			name: 'alignLeft',
			tooltip: 'Alinear a la izquierda',
			className: 'custom-button',
      style: { fontSize: '16px', cursor: 'pointer', userSelect: 'none' },
			command: 'alignLeft',
			text: `l≡ l`,
		},
		{
			name: 'alignCenter',
			tooltip: 'Centrar texto',
			className: 'custom-button',
      style: { fontSize: '16px', cursor: 'pointer', userSelect: 'none' },
			command: 'alignCenter',
			text: 'l ≡ l',
		},
		{
			name: 'alignRight',
			tooltip: 'Alinear a la derecha',
			className: 'custom-button',
      style: { fontSize: '16px', cursor: 'pointer', userSelect: 'none' },
			command: 'alignRight',
			text: 'l ≡l',
		},
	];

	// Inicializar el editor con un valor vacío
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      editorInstance.setMarkdown('');
    }
  }, []);

	// Cambiar el color de los botones personalizados.
	useEffect(() => {
		const editorInstance = editorRef.current?.getInstance();
		if (!editorInstance) return;

		const handleModeChange = (isPreview: boolean) => {
			const customButtons = document.querySelectorAll('.custom-button') as NodeListOf<HTMLElement>;
			customButtons.forEach((button) => {
				button.style.color = isPreview ? 'lightgray' : 'black';
			});
		};

		editorInstance.eventEmitter.listen('changePreviewTabPreview', () => handleModeChange(true));
		editorInstance.eventEmitter.listen('changePreviewTabWrite', () => handleModeChange(false));

		// Inicializar estilos al entrar
		handleModeChange(false);
	}, []);

	// Popup de imagen viene por defecto en el editor, con dos opciones:
	// Subir archivo de la computadora y agregar por URL.
	// Esta parte del código se encarga de ocultar la pestaña de subir archivo
	// y mostrar solo la pestaña de URL.
  useEffect(() => {
    const editorContainer = document.querySelector('.toastui-editor-toolbar');

		// Logica principal
    const handleImagePopup = () => {
      setTimeout(() => {
        const popup = document.querySelector<HTMLElement>('.toastui-editor-popup-add-image');
        if (!popup) return;

        const urlTab = popup.querySelector<HTMLElement>('.tab-item[aria-label="URL"]');
        const fileTab = popup.querySelector<HTMLElement>('.tab-item[aria-label="Archivo"]');

        if (urlTab) urlTab.click();
        if (fileTab) fileTab.style.display = 'none';
      }, 0);
    };

    // Esperamos que el botón esté disponible
		// Solo se ejecuta una vez que el editor está completamente cargado
		// cuando la pestaña se monta por primera vez
    const waitForButton = setInterval(() => {
      const imageBtn = document.querySelector<HTMLElement>('.toastui-editor-toolbar-icons.image');
      if (imageBtn) {
        imageBtn.addEventListener('click', handleImagePopup);
        clearInterval(waitForButton);
      }
    }, 100);

    return () => clearInterval(waitForButton);
  }, []);

  return (
    <div className= 'scrollbarLayout' style={styles.editorWrapper}>
      <Editor
        ref={editorRef}
        height="100%"
        initialEditType="markdown" // inicializado en markdown
        hideModeSwitch={true}      // oculta el botón de cambio de modo
        previewStyle="tab"         // vista previa en pestañas separadas
        usageStatistics={false}
        initialValue=" "
        language="es"
        placeholder="Escribe aquí el contenido de tu artículo..."
        plugins={[colorSyntax]}
        toolbarItems={[
          customUndoRedoButtons,
          ['heading', 'bold', 'italic', 'strike'],
					customAlignButtons,
          ['hr', 'quote'],
          ['ul', 'ol'],
          ['image', 'link', 'table'],
        ]}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
editorWrapper: {
    position: "relative",
    height: '300px',
		width: "100%",
		background: "white",
		margin: '0',
		padding: '0',
		boxSizing: "border-box",
		borderRadius: '24px',
		resize: 'vertical',
		overflowY: 'auto',
		overflowX: 'hidden',
    scrollbarWidth: 'none',        // Firefox
    msOverflowStyle: 'none',       // IE/Edge
  },
}