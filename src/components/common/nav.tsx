import React from "react";
import { ThemeToggle } from "../theme-toggle";
import { TrumpUserPill } from "../user-pill";

export default function nav() {
	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between">
					<div className="text-2xl font-bold text-orange-600">
						Trump.fun
					</div>
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<TrumpUserPill />
					</div>
				</div>
			</header>
		</>
	);
}
