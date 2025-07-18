import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
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

interface PrioritySelectorProps {
  priorityId: string;
}

export function PrioritySelector({ priorityId }: PrioritySelectorProps) {
  const priorities = useSuspenseQuery(orpc.priorities.getAll.queryOptions());

  const [value, setValue] = useState<string>(priorityId);

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
            <PriorityIcon priorityId={value} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0">
          <Command>
            <CommandInput placeholder="Set priority..." />
            <CommandList>
              <CommandEmpty>No priority found.</CommandEmpty>
              <CommandGroup>
                {priorities.data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <PriorityIcon
                        priorityId={item.id}
                        className="text-muted-foreground size-4"
                      />
                      {item.name}
                    </div>
                    {value === item.id && (
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
