import { useCallback, useEffect, useMemo, useState } from 'react'

export type Todo = {
  id: string
  title: string
  completed: boolean
}

export type TodoFilter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'diffkit-playground-todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is Todo =>
        t &&
        typeof t === 'object' &&
        typeof (t as Todo).id === 'string' &&
        typeof (t as Todo).title === 'string' &&
        typeof (t as Todo).completed === 'boolean',
    )
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: trimmed, completed: false },
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }, [])

  const counts = useMemo(() => {
    const active = todos.filter((t) => !t.completed).length
    const completed = todos.length - active
    return { active, completed, total: todos.length }
  }, [todos])

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    counts,
  }
}

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    default:
      return todos
  }
}

/** Narrows a list by case-insensitive substring match on title. Empty query keeps all. */
export function searchTodos(todos: Todo[], query: string): Todo[] {
  const q = query.trim().toLowerCase()
  if (!q) return todos
  return todos.filter((t) => t.title.toLowerCase().includes(q))
}
