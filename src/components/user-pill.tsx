"use client";

import { UserPill } from "@privy-io/react-auth/ui";
import { usePrivy } from "@privy-io/react-auth";

export function TrumpUserPill() {
	const { authenticated, ready } = usePrivy();

	if (!ready) {
		return (
			<div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
		);
	}

	if (!authenticated) {
		return (
			<UserPill
				action={{
					type: "login",
					options: {
						loginMethods: [
							"email",
							"wallet",
							"twitter",
							"google",
							"discord",
							"apple",
							"farcaster",
							"passkey",
						],
					},
				}}
				expanded={true}
				size={40}
			/>
		);
	}

	// When authenticated, display the user pill with expanded view and logout button
	return (
		<div className="flex items-center gap-2">
			<UserPill expanded={true} size={20} />
		</div>
	);
}
