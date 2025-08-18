import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState } from 'react';
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
    inputRef.current?.focus();
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
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={saveChanges}
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
        disabled={isLoading}
      >
        ×
      </button>

      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
