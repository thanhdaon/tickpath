"use client";

import { CheckIcon } from "lucide-react";
import { useId, useState } from "react";
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
import { status as allStatus, Status } from "~/data/status";

interface StatusSelectorProps {
  status: Status;
}

export function StatusSelector({ status }: StatusSelectorProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(status.id);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            className="size-7 flex items-center justify-center"
            size="icon"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
          >
            {(() => {
              const selectedItem = allStatus.find((item) => item.id === value);
              if (selectedItem) {
                const Icon = selectedItem.icon;
                return <Icon />;
              }
              return null;
            })()}
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
                {allStatus.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
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
