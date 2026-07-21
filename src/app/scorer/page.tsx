import FaktenScorer from "@/components/FaktenScorer";

type PageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function ScorerPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;

  return (
    <main className="flex-1 bg-background">
      <FaktenScorer editCaseId={edit} />
    </main>
  );
}
