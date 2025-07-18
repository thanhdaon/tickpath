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
import { priorities, Priority } from "~/data/priorities";

interface PrioritySelectorProps {
  priority: Priority;
}

export function PrioritySelector({ priority }: PrioritySelectorProps) {
  const id = useId();
  const [value, setValue] = useState<string>(priority.id);

  function icon() {
    const selectedItem = priorities.find((item) => item.id === value);

    if (selectedItem) {
      const Icon = selectedItem.icon;
      return <Icon className="text-muted-foreground size-4" />;
    }
  }

  return (
    <div className="*:not-first:mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            className="size-7 flex items-center justify-center"
            size="icon"
            variant="ghost"
          >
            {icon()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0">
          <Command>
            <CommandInput placeholder="Set priority..." />
            <CommandList>
              <CommandEmpty>No priority found.</CommandEmpty>
              <CommandGroup>
                {priorities.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="text-muted-foreground size-4" />
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
