import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/pagination-controls";
import { Loader2, Search } from "lucide-react";
import { Pensioner } from "@shared/schema";
import debounce from "lodash/debounce";

interface PensionerResponse {
  pensioners: Pensioner[];
  total: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export function PensionersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching } = useQuery<PensionerResponse>({
    queryKey: ["/api/pensioners", page, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      if (search) searchParams.append("search", search);
      
      const response = await fetch(`/api/pensioners?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch pensioners');
      return response.json();
    },
  });

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, 300);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search pensioners..."
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-10"
        />
        {isFetching ? (
          <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.pensioners.map((pensioner) => (
              <Card key={pensioner.id} className="p-4">
                <h3 className="font-medium">
                  {pensioner.firstname} {pensioner.surname}
                </h3>
                <p className="text-sm text-gray-500">{pensioner.code}</p>
                <p className="text-sm">{pensioner.email || 'No email'}</p>
                <p className="text-sm text-gray-600">{pensioner.department}</p>
              </Card>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            Showing {((data?.currentPage || 1) - 1) * (data?.itemsPerPage || 50) + 1} to{" "}
            {Math.min(
              (data?.currentPage || 1) * (data?.itemsPerPage || 50),
              data?.total || 0
            )}{" "}
            of {data?.total || 0} entries
          </p>
        </>
      )}
    </div>
  );
}
