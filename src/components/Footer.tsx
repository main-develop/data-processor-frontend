export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-transparent py-4">
      <div className="container mx-auto px-4 select-none text-center text-base text-gray-200 font-medium opacity-40">
        <p>Powered by FastAPI & Dask</p>
        <p>© 2025 Data Processor</p>
      </div>
    </footer>
  );
}
