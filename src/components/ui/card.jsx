export const Card = ({ children }) => (
  <div className="bg-white shadow rounded p-4">{children}</div>
);

export const CardHeader = ({ children }) => <div>{children}</div>;

export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

export const CardContent = ({ children }) => <div>{children}</div>;
