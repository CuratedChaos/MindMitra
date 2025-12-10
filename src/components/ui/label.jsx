export function Label({ children, ...props }) {
  return (
    <label className="text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
}
