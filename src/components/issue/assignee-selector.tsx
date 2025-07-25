import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon, CircleUserRound, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { orpc } from "~/orpc/client";

interface AssigneeSelectorProps {
  issueId: number;
  userId: string | null;
}

export function AssigneeSelector({ issueId, userId }: AssigneeSelectorProps) {
  const options = orpc.users.getAll.queryOptions({ staleTime: Infinity });
  const users = useSuspenseQuery(options);
  const changeAssignee = useAssigneeMutation();

  function renderAssignee() {
    const found = users.data.find((user) => user.id === userId);

    if (found) {
      return (
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={found.image ?? undefined} alt={found.name} />
          <AvatarFallback>{found.name[0]}</AvatarFallback>
        </Avatar>
      );
    }

    return (
      <div className="size-6 flex items-center justify-center">
        <CircleUserRound className="size-5 text-zinc-600" />
      </div>
    );
  }

  function renderAssigneeOptions() {
    if (users.isLoading || users.isError || users.data.length === 0) {
      return <Skeleton className="h-6 w-full" />;
    }

    return users.data.map((user) => {
      const onAssign = () => {
        changeAssignee.mutate({ issueId, userId: user.id });
      };

      return (
        <DropdownMenuItem key={user.id} onClick={onAssign}>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
          {userId === user.id && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      );
    });
  }

  function assignToNoOne() {
    changeAssignee.mutate({ issueId, userId: null });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative w-fit focus:outline-none">
          {renderAssignee()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[260px]">
        <DropdownMenuLabel>Assign to...</DropdownMenuLabel>
        <DropdownMenuItem onClick={assignToNoOne}>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            <span>No assignee</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[200px]">{renderAssigneeOptions()}</ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useAssigneeMutation() {
  const queryClient = useQueryClient();

  const mutationOptions = orpc.issues.updateAssignee.mutationOptions({
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: orpc.issues.getAll.queryKey(),
      });
      toast.success("Issue assigned successfully");
    },
    onError(error) {
      toast.error("Failed to assign issue", {
        description: error.message,
      });
    },
  });

  return useMutation(mutationOptions);
}
