import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { PriorityIcon } from "~/components/issue/priority-icon";
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
import { orpc } from "~/orpc/react-query";

interface Props {
  issueId: number;
  priorityId: string;
}

export function PrioritySelector({ issueId, priorityId }: Props) {
  const options = orpc.priorities.getAll.queryOptions({ staleTime: Infinity });
  const priorities = useSuspenseQuery(options);
  const mutation = useIssuePriorityMutation();

  if (priorities.isLoading) {
    return null;
  }

  if (priorities.isError) {
    return null;
  }

  return (
    <div className="*:not-first:mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="size-7 flex items-center justify-center"
            size="icon"
            variant="ghost"
          >
            <PriorityIcon priorityId={priorityId} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Set priority..." />
            <CommandList>
              <CommandEmpty>No priority found.</CommandEmpty>
              <CommandGroup>
                {priorities.data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      mutation.mutate({ issueId, priorityId: item.id });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <PriorityIcon
                        priorityId={item.id}
                        className="text-muted-foreground size-4"
                      />
                      {item.name}
                    </div>
                    {priorityId === item.id && (
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
    </div>
  );
}

function useIssuePriorityMutation() {
  const queryClient = useQueryClient();

  const mutationOptions = orpc.issues.updatePriority.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.issues.getAll.queryOptions());
    },
    onError: (error) => {
      toast.error("Failed to update priority", {
        description: error.message,
      });
    },
  });

  return useMutation(mutationOptions);
}
