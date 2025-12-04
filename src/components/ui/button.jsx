export const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 rounded bg-purple-500 text-white" {...props}>
    {children}
  </button>
);
