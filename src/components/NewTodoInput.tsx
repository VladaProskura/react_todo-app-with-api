import React, { useEffect } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  addTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewTodoInput: React.FC<Props> = ({
  setErrorMessage,
  addTodo,
  handleAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  loading,
  setIsLoading,
}) => {
  const resetFocus = () => {
    inputRef.current?.focus();
  };

  const showError = (error: ErrorTypes) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const saveTodo = async () => {
    const trimmedValue = newTodoTitle.trim();

    if (!trimmedValue) {
      showError(ErrorTypes.EMPTY_TITLE);
      resetFocus();

      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await handleAddTodo(trimmedValue);
      setNewTodoTitle('');
    } catch (error) {
      showError(ErrorTypes.ADD_TODO_FAILED);
    } finally {
      setIsLoading(false);
      resetFocus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addTodo) {
      await saveTodo();
    }
  };

  const handleBlur = async () => {
    if (!addTodo && newTodoTitle.trim()) {
      await saveTodo();
    }
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTodoTitle('');
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleEscKey);

    return () => {
      window.removeEventListener('keyup', handleEscKey);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleInputChange}
        onBlur={handleBlur}
        ref={inputRef}
        disabled={loading}
      />
    </form>
  );
};
