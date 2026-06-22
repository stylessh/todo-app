import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  filterTodos,
  searchTodos,
  type TodoFilter,
  useTodos,
} from './useTodos'
import './App.css'

export default function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    counts,
  } = useTodos()
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')

  const afterFilter = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  )

  const visible = useMemo(
    () => searchTodos(afterFilter, search),
    [afterFilter, search],
  )

  const emptyMessage = useMemo(() => {
    if (todos.length === 0) return 'No tasks yet. Add one above.'
    if (afterFilter.length === 0) return 'Nothing to show for this filter.'
    if (visible.length === 0) return 'No tasks match your search.'
    return ''
  }, [todos.length, afterFilter.length, visible.length])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    addTodo(draft)
    setDraft('')
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Todos</h1>
        <p className="app__subtitle">DiffKit playground</p>
      </header>

      <form className="todo-form" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor="new-todo">
          New task
        </label>
        <input
          id="new-todo"
          className="todo-form__input"
          type="text"
          autoComplete="off"
          placeholder="What needs to be done?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="todo-form__submit" type="submit">
          Add
        </button>
      </form>

      {todos.length > 0 && (
        <div className="todo-search">
          <label className="visually-hidden" htmlFor="todo-search">
            Search tasks
          </label>
          <input
            id="todo-search"
            className="todo-search__input"
            type="search"
            autoComplete="off"
            placeholder="Search tasks… (e.g. buy milk)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <ul className="todo-list" aria-label="Task list">
        {visible.length === 0 ? (
          <li className="todo-list__empty">{emptyMessage}</li>
        ) : (
          visible.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                id={`todo-${todo.id}`}
                className="todo-item__check"
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <label
                className={`todo-item__label${todo.completed ? ' todo-item__label--done' : ''}`}
                htmlFor={`todo-${todo.id}`}
              >
                {todo.title}
              </label>
              <button
                type="button"
                className="todo-item__delete"
                onClick={() => removeTodo(todo.id)}
                aria-label={`Delete: ${todo.title}`}
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <footer className="todo-footer">
          <span className="todo-footer__count">
            {counts.active === 1 ? '1 item left' : `${counts.active} items left`}
          </span>
          <div className="todo-footer__filters" role="group" aria-label="Filter tasks">
            {(
              [
                ['all', 'All'],
                ['active', 'Active'],
                ['completed', 'Done'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`todo-footer__filter${filter === value ? ' todo-footer__filter--active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {counts.completed > 0 && (
            <button
              type="button"
              className="todo-footer__clear"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </div>
  )
}
