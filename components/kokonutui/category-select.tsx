"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { EXPENSE_CATEGORIES } from "@/lib/constants"

interface CategorySelectProps {
    value?: string
    onSelect: (value: string) => void
}

export function CategorySelect({ value, onSelect }: CategorySelectProps) {
    const [open, setOpen] = useState(false)

    // Find the selected icon and label for display
    let selectedLabel = "Select category"
    let SelectedIcon = null

    if (value) {
        // Check if it's a main group
        if (EXPENSE_CATEGORIES[value]) {
            selectedLabel = value
            // Use the first icon of the group as a fallback or a generic icon if available?
            // For now let's just use the first item's icon or no icon for group
            SelectedIcon = EXPENSE_CATEGORIES[value][0]?.icon
        } else {
            // Check sub-items
            for (const group of Object.values(EXPENSE_CATEGORIES)) {
                const found = group.find(item => item.label === value)
                if (found) {
                    selectedLabel = found.label
                    SelectedIcon = found.icon
                    break
                }
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2 truncate">
                        {SelectedIcon && <SelectedIcon className="w-4 h-4 shrink-0 text-gray-500" />}
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {selectedLabel}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>No category found.</CommandEmpty>
                        {Object.entries(EXPENSE_CATEGORIES).map(([group, items], index) => (
                            <div key={group}>
                                {index > 0 && <CommandSeparator />}
                                <CommandGroup heading={group}>
                                    {/* Add Group as selectable option */}
                                    <CommandItem
                                        value={group}
                                        onSelect={() => {
                                            onSelect(group)
                                            setOpen(false)
                                        }}
                                        className="font-medium bg-gray-50 dark:bg-gray-800/50"
                                    >
                                        <span>{group} (General)</span>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === group ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                    {items.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <CommandItem
                                                key={item.label}
                                                value={item.label}
                                                onSelect={(currentValue) => {
                                                    onSelect(item.label) // use exact label casing
                                                    setOpen(false)
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-gray-500" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === item.label ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </div>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
