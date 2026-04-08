import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zen-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('zen-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodos = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circle */}
      <motion.div
        className="absolute top-[-20vh] right-[-10vw] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-[#C4A484]/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-[-15vh] left-[-5vw] w-[40vw] h-[40vw] max-w-[350px] max-h-[350px] rounded-full bg-[#8B9A7E]/8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      />

      <main className="flex-1 relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <motion.header
          className="mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2D2A26] tracking-tight mb-2">
            Today
          </h1>
          <p className="text-[#2D2A26]/50 font-serif italic text-base sm:text-lg">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.header>

        {/* Input Area */}
        <motion.div
          className="mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs your attention?"
              className="w-full bg-white/60 backdrop-blur-sm border-0 border-b-2 border-[#2D2A26]/10
                         px-4 py-4 sm:py-5 text-lg sm:text-xl text-[#2D2A26] placeholder-[#2D2A26]/30
                         focus:outline-none focus:border-[#C4A484] transition-colors duration-300
                         font-serif rounded-t-lg"
            />
            <motion.button
              onClick={addTodo}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12
                         flex items-center justify-center text-[#2D2A26]/40 hover:text-[#C4A484]
                         transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm sm:text-base font-serif capitalize transition-all duration-300 pb-1 min-h-[44px] flex items-center
                ${filter === f
                  ? 'text-[#2D2A26] border-b-2 border-[#C4A484]'
                  : 'text-[#2D2A26]/40 hover:text-[#2D2A26]/70'
                }`}
            >
              {f}
              {f === 'active' && activeTodos > 0 && (
                <span className="ml-2 text-xs bg-[#C4A484]/20 text-[#C4A484] px-2 py-0.5 rounded-full">
                  {activeTodos}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Todo List */}
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20, rotate: -1 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: index % 2 === 0 ? 0.3 : -0.3
                }}
                exit={{
                  opacity: 0,
                  x: 100,
                  rotate: 5,
                  transition: { duration: 0.4 }
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                className={`group relative bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md
                           transition-shadow duration-300 ${
                             todo.completed ? 'bg-[#8B9A7E]/5' : ''
                           }`}
                style={{
                  boxShadow: '0 2px 8px rgba(45, 42, 38, 0.06), 0 1px 2px rgba(45, 42, 38, 0.04)'
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-1 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2
                               flex items-center justify-center transition-all duration-300 min-w-[44px] min-h-[44px] -m-2 p-2"
                    style={{
                      borderColor: todo.completed ? '#8B9A7E' : 'rgba(45, 42, 38, 0.2)',
                      backgroundColor: todo.completed ? '#8B9A7E' : 'transparent'
                    }}
                  >
                    {todo.completed && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </button>

                  {/* Todo Text */}
                  <span
                    className={`flex-1 font-serif text-base sm:text-lg leading-relaxed transition-all duration-300
                      ${todo.completed
                        ? 'text-[#2D2A26]/30 line-through decoration-[#8B9A7E]/50'
                        : 'text-[#2D2A26]'
                      }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300
                               text-[#2D2A26]/30 hover:text-[#C4A484] min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <motion.div
            className="text-center py-12 sm:py-16 md:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[#2D2A26]/20 mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M30 50 Q 50 30, 70 50 Q 50 70, 30 50" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <p className="text-[#2D2A26]/40 font-serif text-lg sm:text-xl italic">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                  ? 'All tasks complete. Breathe.'
                  : 'A blank canvas awaits'
              }
            </p>
          </motion.div>
        )}

        {/* Clear Completed */}
        {todos.some(t => t.completed) && (
          <motion.div
            className="mt-8 sm:mt-10 md:mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={clearCompleted}
              className="text-sm font-serif text-[#2D2A26]/40 hover:text-[#C4A484]
                         transition-colors duration-300 underline underline-offset-4
                         decoration-dotted min-h-[44px] px-4"
            >
              Clear completed tasks
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 sm:py-8 text-center">
        <p className="text-xs sm:text-sm text-[#2D2A26]/30 font-serif">
          Requested by <span className="text-[#2D2A26]/40">@web-user</span> · Built by <span className="text-[#2D2A26]/40">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
