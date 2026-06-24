interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10">
      {children}
    </main>
  );
}
