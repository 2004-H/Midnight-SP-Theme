import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Inbox,
  Layers,
  Maximize2,
  Menu,
  Minimize2,
  Monitor,
  Pause,
  Play,
  Plus,
  Smartphone,
  Sun,
  Tablet,
  X,
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  project: 'Today' | 'Inbox' | 'Nordic Fork';
  trackedSeconds: number;
  estimateSeconds: number;
  done: boolean;
  tag: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: 'Audit WCAG contrast ratios on #1a1d24 dark canvas',
    project: 'Today',
    trackedSeconds: 1620,
    estimateSeconds: 2700,
    done: false,
    tag: 'Accessibility',
  },
  {
    id: 't2',
    title: 'Calibrate #81a1c1 accent rings for active task focus',
    project: 'Today',
    trackedSeconds: 940,
    estimateSeconds: 1800,
    done: false,
    tag: 'Tokens',
  },
  {
    id: 't3',
    title: 'Verify prefers-color-scheme light & dark transitions',
    project: 'Today',
    trackedSeconds: 1200,
    estimateSeconds: 1200,
    done: true,
    tag: 'System Pref',
  },
  {
    id: 't4',
    title: 'Test responsive drawer and touch targets at 375px',
    project: 'Today',
    trackedSeconds: 480,
    estimateSeconds: 1800,
    done: false,
    tag: 'Responsive',
  },
  {
    id: 't5',
    title: 'Update theme documentation for Super Productivity install',
    project: 'Inbox',
    trackedSeconds: 0,
    estimateSeconds: 900,
    done: false,
    tag: 'Docs',
  },
  {
    id: 't6',
    title: 'Preserve --surface-0 through --surface-4 legacy hooks',
    project: 'Nordic Fork',
    trackedSeconds: 1500,
    estimateSeconds: 1500,
    done: true,
    tag: 'CSS Vars',
  },
  {
    id: 't7',
    title: 'Refine focus-mode full-width session band padding',
    project: 'Nordic Fork',
    trackedSeconds: 600,
    estimateSeconds: 1200,
    done: false,
    tag: 'Layout',
  },
];

function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${String(mins).padStart(2, '0')}m`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

type ViewportFrame = 'desktop' | 'tablet' | 'mobile';
type TaskFilter = 'all' | 'active' | 'done';

export function SuperProductivityPreview() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [currentTaskId, setCurrentTaskId] = useState<string>('t1');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [activeProject, setActiveProject] = useState<'Today' | 'Inbox' | 'Nordic Fork'>('Today');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [viewportFrame, setViewportFrame] = useState<ViewportFrame>('desktop');

  useEffect(() => {
    if (!isTimerRunning || !currentTaskId) return;
    const interval = window.setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === currentTaskId && !task.done
            ? { ...task, trackedSeconds: task.trackedSeconds + 1 }
            : task
        )
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning, currentTaskId]);

  const projectCounts = useMemo(() => {
    return {
      Today: tasks.filter((t) => t.project === 'Today' && !t.done).length,
      Inbox: tasks.filter((t) => t.project === 'Inbox' && !t.done).length,
      'Nordic Fork': tasks.filter((t) => t.project === 'Nordic Fork' && !t.done).length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.project !== activeProject) return false;
      if (taskFilter === 'active') return !t.done;
      if (taskFilter === 'done') return t.done;
      return true;
    });
  }, [tasks, activeProject, taskFilter]);

  const currentTask = useMemo(
    () => tasks.find((t) => t.id === currentTaskId) ?? tasks[0],
    [tasks, currentTaskId]
  );

  const todayProgress = useMemo(() => {
    const projectTasks = tasks.filter((t) => t.project === activeProject);
    if (projectTasks.length === 0) return { done: 0, total: 0, pct: 0, tracked: 0, est: 0 };
    const doneCount = projectTasks.filter((t) => t.done).length;
    const tracked = projectTasks.reduce((acc, t) => acc + t.trackedSeconds, 0);
    const est = projectTasks.reduce((acc, t) => acc + t.estimateSeconds, 0);
    return {
      done: doneCount,
      total: projectTasks.length,
      pct: Math.round((doneCount / projectTasks.length) * 100),
      tracked,
      est,
    };
  }, [tasks, activeProject]);

  const handleToggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    if (id === currentTaskId) {
      setIsTimerRunning(false);
    }
  };

  const handleToggleTimer = (id: string) => {
    if (currentTaskId === id) {
      setIsTimerRunning((prev) => !prev);
    } else {
      setCurrentTaskId(id);
      setIsTimerRunning(true);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: false } : t))
      );
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    const newItem: TaskItem = {
      id: `t-${Date.now()}`,
      title: trimmed,
      project: activeProject,
      trackedSeconds: 0,
      estimateSeconds: 1800,
      done: false,
      tag: 'Custom',
    };
    setTasks((prev) => [newItem, ...prev]);
    setNewTaskTitle('');
  };

  const frameMaxWidthClass =
    viewportFrame === 'desktop'
      ? 'max-w-full'
      : viewportFrame === 'tablet'
      ? 'max-w-[768px]'
      : 'max-w-[390px]';

  const isSimulatedNarrow = viewportFrame !== 'desktop';

  return (
    <section id="preview" className="scroll-mt-20">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-strong)]">
            Interactive Workspace Preview
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)] max-w-2xl">
            Simulated Super Productivity surface powered directly by the Nordic Midnight CSS variables. Start a task timer, complete items, toggle Focus Mode, or test responsive viewport breakpoints.
          </p>
        </div>

        {/* Responsive Viewport Inspector Controls */}
        <div
          role="group"
          aria-label="Preview viewport size"
          className="hidden md:inline-flex items-center gap-1 rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] p-1 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              setViewportFrame('desktop');
              setDrawerOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
              viewportFrame === 'desktop'
                ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] shadow-xs'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewportFrame('tablet');
              setDrawerOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
              viewportFrame === 'tablet'
                ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] shadow-xs'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewportFrame('mobile');
              setDrawerOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
              viewportFrame === 'mobile'
                ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] shadow-xs'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Simulated Super Productivity Window */}
      <div
        className={`mx-auto transition-[max-width] duration-200 ${frameMaxWidthClass}`}
      >
        <div className="relative overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--surface-1)] shadow-lg">
          {/* Simulated mat-toolbar */}
          <div className="flex h-13 items-center justify-between gap-3 border-b border-[var(--divider)] bg-[var(--surface-4)] px-3 sm:px-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen((o) => !o)}
                aria-label="Toggle workspace sidebar"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink)] transition-colors hover:bg-[var(--surface-3)] cursor-pointer ${
                  isSimulatedNarrow ? 'inline-flex' : 'lg:hidden'
                }`}
              >
                {drawerOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <span className="truncate text-sm font-semibold text-[var(--ink-strong)]">
                {activeProject}
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:inline text-xs text-[var(--ink-muted)]"
              >
                ·
              </span>
              <span className="hidden sm:inline text-xs text-[var(--ink-muted)] font-mono tabular-nums whitespace-nowrap">
                {formatDuration(todayProgress.tracked)} / {formatDuration(todayProgress.est)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentTask && !currentTask.done && (
                <button
                  type="button"
                  onClick={() => handleToggleTimer(currentTask.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--separator)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--nm-accent)] cursor-pointer"
                >
                  {isTimerRunning ? (
                    <Pause className="h-3.5 w-3.5 text-[var(--nm-accent)]" aria-hidden="true" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-[var(--nm-accent)]" aria-hidden="true" />
                  )}
                  <span className="font-mono tabular-nums">
                    {formatDuration(currentTask.trackedSeconds)}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsFocusMode((f) => !f)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isFocusMode
                    ? 'bg-[var(--nm-accent)] text-[var(--ink-on-accent)]'
                    : 'bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--divider)] hover:border-[var(--nm-accent)]'
                }`}
              >
                {isFocusMode ? (
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
              </button>
            </div>
          </div>

          {/* Workspace Body: Sidenav + Content */}
          <div className="relative flex min-h-[440px]">
            {/* Mobile / Narrow Drawer Scrim */}
            {drawerOpen && (
              <div
                onClick={() => setDrawerOpen(false)}
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-[var(--scrim)] lg:hidden"
              />
            )}

            {/* Simulated mat-sidenav */}
            <aside
              aria-label="Simulated Super Productivity sidebar"
              className={`border-r border-[var(--divider)] bg-[var(--surface-0)] p-3 flex flex-col justify-between transition-transform duration-200 ${
                isSimulatedNarrow
                  ? `absolute inset-y-0 left-0 z-20 w-[230px] ${
                      drawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                  : `absolute inset-y-0 left-0 z-20 w-[230px] lg:static lg:translate-x-0 ${
                      drawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
              }`}
            >
              <div className="space-y-1">
                <p className="px-2.5 pb-1.5 pt-1 text-xs font-medium text-[var(--ink-muted)]">
                  Views
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject('Today');
                    setDrawerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeProject === 'Today'
                      ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] border border-[var(--separator)]'
                      : 'text-[var(--ink-muted)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--ink)] border border-transparent'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Sun
                      className={`h-4 w-4 ${
                        activeProject === 'Today' ? 'text-[var(--nm-accent)]' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>Today</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                    {projectCounts.Today}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveProject('Inbox');
                    setDrawerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeProject === 'Inbox'
                      ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] border border-[var(--separator)]'
                      : 'text-[var(--ink-muted)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--ink)] border border-transparent'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Inbox
                      className={`h-4 w-4 ${
                        activeProject === 'Inbox' ? 'text-[var(--nm-accent)]' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>Inbox</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                    {projectCounts.Inbox}
                  </span>
                </button>

                <p className="px-2.5 pb-1.5 pt-4 text-xs font-medium text-[var(--ink-muted)]">
                  Projects
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject('Nordic Fork');
                    setDrawerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeProject === 'Nordic Fork'
                      ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] border border-[var(--separator)]'
                      : 'text-[var(--ink-muted)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--ink)] border border-transparent'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Layers
                      className={`h-4 w-4 ${
                        activeProject === 'Nordic Fork' ? 'text-[var(--nm-accent)]' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>Nordic Fork</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                    {projectCounts['Nordic Fork']}
                  </span>
                </button>
              </div>

              {/* Daily Completion Summary */}
              <div className="border-t border-[var(--divider)] pt-3 px-2">
                <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                  <span>Completion</span>
                  <span className="font-mono tabular-nums text-[var(--ink)]">
                    {todayProgress.done}/{todayProgress.total} ({todayProgress.pct}%)
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--nm-accent)] transition-[width] duration-200"
                    style={{ width: `${todayProgress.pct}%` }}
                  />
                </div>
              </div>
            </aside>

            {/* Simulated Main Content Area */}
            <div className="flex-1 bg-[var(--surface-1)] p-4 sm:p-6 min-w-0">
              {isFocusMode && currentTask ? (
                /* Simulated Focus Mode Full-Width Band */
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center py-6">
                  <div className="w-full max-w-[680px] rounded-xl border border-[var(--nm-accent)] bg-[var(--surface-2)] p-5 sm:p-8 shadow-[0_0_0_1px_var(--nm-accent),0_0_24px_rgba(129,161,193,0.18)]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
                      <span>Focus Session · {currentTask.project}</span>
                      <span className="font-mono tabular-nums">
                        Est. {formatDuration(currentTask.estimateSeconds)}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg sm:text-2xl font-semibold text-[var(--ink-strong)] leading-snug">
                      {currentTask.title}
                    </h3>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-[var(--nm-accent)]">
                        {formatDuration(currentTask.trackedSeconds)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleTimer(currentTask.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--nm-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--nm-accent-hover)] cursor-pointer"
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="h-4 w-4" aria-hidden="true" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" aria-hidden="true" />
                              <span>Resume</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleToggleDone(currentTask.id);
                            setIsFocusMode(false);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-[var(--divider)] bg-[var(--surface-3)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--nm-accent)] cursor-pointer"
                        >
                          <Check className="h-4 w-4 text-[var(--nm-accent)]" aria-hidden="true" />
                          <span>Complete Task</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Task List View */
                <div className="mx-auto max-w-[740px]">
                  {/* Quick Add + Filter Bar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <form onSubmit={handleAddTask} className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder={`Add task to ${activeProject}...`}
                        aria-label={`Add task to ${activeProject}`}
                        className="h-10 w-full rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--nm-accent)] focus:outline-none"
                      />
                      <button
                        type="submit"
                        aria-label="Add task"
                        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--nm-accent)] px-3.5 text-xs font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--nm-accent-hover)] cursor-pointer"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </form>

                    <div
                      role="group"
                      aria-label="Filter tasks"
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] p-1 self-start sm:self-auto shrink-0"
                    >
                      {(['all', 'active', 'done'] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          type="button"
                          onClick={() => setTaskFilter(filterKey)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors cursor-pointer ${
                            taskFilter === filterKey
                              ? 'bg-[var(--surface-2)] text-[var(--ink-strong)]'
                              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {filterKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated .task Cards */}
                  <div className="space-y-2">
                    {visibleTasks.length === 0 ? (
                      <div className="rounded-lg border border-[var(--divider)] bg-[var(--surface-2)] px-4 py-8 text-center">
                        <p className="text-sm font-medium text-[var(--ink)]">
                          No tasks in this view
                        </p>
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">
                          Add a task above or switch filters to see completed items.
                        </p>
                      </div>
                    ) : (
                      visibleTasks.map((task) => {
                        const isCurrent = task.id === currentTaskId && !task.done;
                        return (
                          <div
                            key={task.id}
                            className={`group flex items-center justify-between gap-3 rounded-[10px] border px-3.5 py-3 transition-all duration-150 ${
                              isCurrent
                                ? 'border-[var(--nm-accent)] bg-[var(--surface-2)] shadow-[0_0_0_1px_var(--nm-accent),0_0_16px_rgba(129,161,193,0.18)]'
                                : 'border-[var(--card-border)] bg-[var(--surface-2)] hover:border-[var(--separator)] hover:bg-[var(--surface-3)]'
                            } ${task.done ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => handleToggleDone(task.id)}
                                aria-label={
                                  task.done ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`
                                }
                                className={`mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                                  task.done
                                    ? 'border-[var(--nm-accent)] bg-[var(--nm-accent)] text-[var(--ink-on-accent)]'
                                    : 'border-[var(--ink-muted)]/60 hover:border-[var(--nm-accent)]'
                                }`}
                              >
                                {task.done && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm font-medium leading-snug ${
                                    task.done
                                      ? 'line-through text-[var(--ink-muted)]'
                                      : 'text-[var(--ink)]'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                                  <span>{task.tag}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums">
                                    {formatDuration(task.trackedSeconds)} / {formatDuration(task.estimateSeconds)}
                                  </span>
                                  {isCurrent && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-medium text-[var(--nm-accent)]">
                                        {isTimerRunning ? 'Tracking' : 'Paused'}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {!task.done && (
                              <button
                                type="button"
                                onClick={() => handleToggleTimer(task.id)}
                                aria-label={
                                  isCurrent && isTimerRunning
                                    ? `Pause timer for ${task.title}`
                                    : `Start timer for ${task.title}`
                                }
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${
                                  isCurrent && isTimerRunning
                                    ? 'bg-[var(--nm-accent)] text-[var(--ink-on-accent)]'
                                    : 'bg-[var(--surface-0)] text-[var(--nm-accent)] border border-[var(--divider)] hover:border-[var(--nm-accent)]'
                                }`}
                              >
                                {isCurrent && isTimerRunning ? (
                                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                                ) : (
                                  <Play className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
