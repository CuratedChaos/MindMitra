export const Tabs = ({ children }) => (
  <div>{children}</div>
);

export const TabsList = ({ children }) => (
  <div className="flex gap-2 border-b pb-2 mb-2">{children}</div>
);

export const TabsTrigger = ({ children, ...props }) => (
  <button className="px-3 py-1 rounded bg-purple-200 text-purple-800" {...props}>
    {children}
  </button>
);

export const TabsContent = ({ children }) => (
  <div className="mt-2">{children}</div>
);
