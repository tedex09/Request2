import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Request } from "@/types/models";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = statusFilter === "all"
    ? requests
    : requests.filter(request => request.status === statusFilter);

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Acompanhe o status das suas solicitações
          </p>
        </div>
        <Button onClick={() => navigate("/request")}>Nova solicitação</Button>
      </div>

      <div className="mb-6">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em análise</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request._id}
            className="rounded-lg border p-4 hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {request.type === 'add' && 'Adicionar'}
                  {request.type === 'update' && 'Atualizar'}
                  {request.type === 'fix' && 'Corrigir'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Solicitado em {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {request.status === "pending" && "Pendente"}
                  {request.status === "in_progress" && "Em análise"}
                  {request.status === "completed" && "Concluído"}
                  {request.status === "rejected" && "Rejeitado"}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate(`/request/${request._id}`)}>
                  Ver detalhes
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma solicitação encontrada
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;