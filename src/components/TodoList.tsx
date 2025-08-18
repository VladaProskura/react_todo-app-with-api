import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorTypes } from '../types/ErrorTypes';

type TodoListProps = {
  filteredTodos: Todo[];
  onChange: (id: number, data: { completed: boolean }) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleEditTodo: (id: number, newTitle: string) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodos: number[];
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  onChange,
  handleDeleteTodo,
  handleEditTodo,
  tempTodo,
  loadingTodos,
  inputRef,
  isLoading,
  setIsLoading,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChange={onChange}
          handleDeleteTodo={handleDeleteTodo}
          handleEditTodo={handleEditTodo}
          inputRef={inputRef}
          isLoading={loadingTodos.includes(todo.id)}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          onChange={onChange}
          handleDeleteTodo={handleDeleteTodo}
          inputRef={inputRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
          handleEditTodo={handleEditTodo}
        />
      )}
    </section>
  );
};
