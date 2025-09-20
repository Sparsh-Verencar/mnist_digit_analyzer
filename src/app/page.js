import DrawingBoard from "@/components/DrawingBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Draw on 28×28 Grid</h1>
      <DrawingBoard />
    </main>
  );
}
