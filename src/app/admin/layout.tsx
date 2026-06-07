export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
