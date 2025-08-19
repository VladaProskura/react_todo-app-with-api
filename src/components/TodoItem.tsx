import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState, useEffect } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  todo: Todo;
  onChange: (id: number, data: { completed: boolean }) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleEditTodo: (id: number, newTitle: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onChange,
  handleDeleteTodo,
  handleEditTodo,
  inputRef,
  isLoading,
  setIsLoading,
  setErrorMessage,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const resetFocus = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const activateEditMode = () => {
    setIsEditing(true);
    resetFocus();
  };

  const saveChanges = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);
      resetFocus();

      return;
    }

    if (!trimmedTitle) {
      try {
        setIsLoading(true);
        await handleDeleteTodo(id);
      } catch {
        setErrorMessage(ErrorTypes.DELETE_TODO_FAILED);
      } finally {
        setIsLoading(false);
        resetFocus();
      }

      return;
    }

    try {
      setIsLoading(true);
      await handleEditTodo(id, trimmedTitle);
      setIsEditing(false);
    } catch {
      setErrorMessage(ErrorTypes.UPDATE_TODO_FAILED);
    } finally {
      setIsLoading(false);
      resetFocus();
    }
  };

  const handleBlur = async () => {
    await saveChanges();
  };

  const handleKey = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await saveChanges();
    }

    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-${id}`} className="todo__status-label">
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChange(id, { completed: !completed })}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          data-cy="TodoTitleField"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKey}
          ref={inputRef}
          disabled={isLoading}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={activateEditMode}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(id)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
