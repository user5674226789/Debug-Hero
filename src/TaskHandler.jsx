import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

const DragDropTask = ({ blocks, solution, onSuccess, taskText }) => {
  const [currentBlocks, setCurrentBlocks] = useState(() => 
    blocks ? [...blocks].sort(() => Math.random() - 0.5) : []
  );

  const moveBlock = (fromIndex, toIndex) => {
    const updated = [...currentBlocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCurrentBlocks(updated);
    
    if (updated.join('\n').trim() === solution.trim()) {
      onSuccess();
    }
  };

  return (
    <div className="dnd-container">
      {/* ВИВОДИМО ТЕКСТ ЗАВДАННЯ ТУТ */}
      <div className="task-description" style={{ color: '#00ff41', marginBottom: '15px', fontSize: '1.1rem', borderBottom: '1px solid #00ff4133', paddingBottom: '10px' }}>
        {taskText}
      </div>
      
      <p className="task-hint" style={{color: '#888', fontSize: '0.9rem', marginBottom: '10px'}}>
        [Перетягніть блоки для правильної послідовності]
      </p>

      {currentBlocks.map((block, index) => (
        <div 
          key={index} 
          className="dnd-block"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("index", index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => moveBlock(e.dataTransfer.getData("index"), index)}
          style={{
            background: '#1a1a1a',
            border: '1px solid #00ff4155',
            padding: '12px',
            margin: '6px 0',
            cursor: 'grab',
            fontFamily: 'monospace',
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          <code>{block}</code>
        </div>
      ))}
    </div>
  );
};

const TaskHandler = (props) => {
  // Перевіряємо тип завдання
  if (props.type === 'dnd') {
    return <DragDropTask {...props} taskText={props.task} />;
  }

  // Для звичайного CodeEditor теж додаємо заголовок із завданням
  return (
    <div className="editor-wrapper">
      <div className="task-description" style={{ color: '#00ff41', marginBottom: '15px', fontSize: '1.1rem' }}>
        {props.task}
      </div>
      <CodeEditor {...props} />
    </div>
  );
};

export default TaskHandler;