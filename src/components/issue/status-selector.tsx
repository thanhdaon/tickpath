import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { StatusIcon } from "~/components/issue/status-icon";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { orpc } from "~/orpc/client";

interface StatusSelectorProps {
  issueId: number;
  statusId: string;
}

export function StatusSelector({ issueId, statusId }: StatusSelectorProps) {
  const options = orpc.statuses.getAll.queryOptions({ staleTime: Infinity });
  const statuses = useSuspenseQuery(options);
  const mutation = useIssueStatusMutation();

  if (statuses.isLoading) {
    return null;
  }

  if (statuses.isError) {
    return null;
  }

  const status = statuses.data.find((s) => s.id === statusId);

  if (status === undefined) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="size-7 flex items-center justify-center"
          size="icon"
          variant="ghost"
          role="combobox"
        >
          <StatusIcon statusId={status.id} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Set status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => {
                    mutation.mutate({ issueId, statusId: item.id });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon statusId={item.id} />
                    {item.name}
                  </div>
                  {statusId === item.id && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                  <span className="text-muted-foreground text-xs">10</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function useIssueStatusMutation() {
  const queryClient = useQueryClient();

  const mutationOptions = orpc.issues.updateStatus.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.issues.getAll.queryOptions());
    },
    onError: (error) => {
      toast.error("Failed to update status", {
        description: error.message,
      });
    },
  });

  return useMutation(mutationOptions);
}
