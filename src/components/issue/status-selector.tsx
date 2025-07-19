import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
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
import { orpc } from "~/orpc/react-query";

interface StatusSelectorProps {
  statusId: string;
}

export function StatusSelector({ statusId }: StatusSelectorProps) {
  const statuses = useSuspenseQuery(orpc.statuses.getAll.queryOptions());

  const [value, setValue] = useState<string>(statusId);

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
    <div className="*:not-first:mt-2">
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
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon statusId={item.id} />
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
