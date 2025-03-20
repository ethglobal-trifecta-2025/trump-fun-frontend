"use client";

import React from "react";
import { ThemeToggle } from "../theme-toggle";
import { TrumpUserPill } from "../user-pill";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from "@/components/ui/sheet";

export default function Nav() {
	return (
		<>
			<header className="px-4 py-2 md:py-0 h-full md:h-16 flex items-center justify-between">
				<div className="text-2xl font-bold text-orange-500">
					Trump.fun
				</div>
				<div className="h-full flex items-center gap-4">
					{/* Desktop navigation */}
					<div className="hidden md:flex items-center gap-4">
						<ThemeToggle />
						<TrumpUserPill />
					</div>

					{/* Mobile navigation */}
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								aria-label="Toggle menu"
							>
								<Menu size={24} />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="h-full flex flex-col"
						>
							<SheetTitle></SheetTitle>
							<div className="flex-1 mt-6 space-y-4 flex flex-col items-center">
								<TrumpUserPill />
							</div>
							<div className="pb-6 flex justify-center">
								<ThemeToggle />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</header>
		</>
	);
}
