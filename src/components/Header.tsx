import React from 'react';
import classNames from 'classnames';
import { NewTodoInput } from './NewTodoInput';
import { ErrorTypes } from '../types/ErrorTypes';

type HeaderProps = {
  handleAddTodo: (title: string) => Promise<void>;
  addTodo: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllTodos: () => Promise<void>;
  allCompleted: boolean;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<HeaderProps> = ({
  handleAddTodo,
  addTodo,
  setErrorMessage,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  toggleAllTodos,
  allCompleted,
  loading,
  setIsLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
        aria-pressed={allCompleted}
      >
        {allCompleted ? 'Remove marks' : 'Mark all'}
      </button>

      <NewTodoInput
        addTodo={addTodo}
        setErrorMessage={setErrorMessage}
        handleAddTodo={handleAddTodo}
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        inputRef={inputRef}
        loading={loading}
        setIsLoading={setIsLoading}
      />
    </header>
  );
};
