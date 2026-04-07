"use client";

import { useState, useRef, useEffect } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="w-5 h-5 transition-all duration-200"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        className={`transition-all duration-200 ${
          checked ? "fill-emerald-500 stroke-emerald-500" : "fill-white stroke-zinc-300"
        }`}
        strokeWidth="1.5"
      />
      {checked && (
        <path
          d="M6 10.5l2.5 2.5 5.5-5.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M7 4V3a1 1 0 011-1h4a1 1 0 011 1v1m2 0H5m1 0v11a1 1 0 001 1h6a1 1 0 001-1V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9v4M11 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-start justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            やること
          </h1>
          {todos.length > 0 && (
            <p className="mt-1 text-sm text-zinc-400">
              残り <span className="font-semibold text-zinc-600">{remaining}</span> 件
            </p>
          )}
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={() => { isComposingRef.current = false; }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isComposingRef.current) addTodo();
            }}
            placeholder="タスクを入力..."
            className="flex-1 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="h-11 px-5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 active:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            追加
          </button>
        </div>

        {/* タスクリスト */}
        {todos.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 text-sm">
            タスクがありません
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-zinc-100 hover:border-zinc-200 shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 focus:outline-none"
                  aria-label={todo.done ? "未完了に戻す" : "完了にする"}
                >
                  <CheckIcon checked={todo.done} />
                </button>
                <span
                  className={`flex-1 text-sm leading-relaxed transition-all duration-200 ${
                    todo.done
                      ? "line-through text-zinc-400"
                      : "text-zinc-800"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  aria-label="削除"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 完了済みをまとめて削除 */}
        {todos.some((t) => t.done) && (
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
            className="mt-4 w-full py-2 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            完了済みをすべて削除
          </button>
        )}
      </div>
    </div>
  );
}
