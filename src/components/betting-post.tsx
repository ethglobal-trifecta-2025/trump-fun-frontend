import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

interface BettingPostProps {
	avatar: string;
	username: string;
	time: string;
	question: string;
	options: { text: string; color: string }[];
}

export function BettingPost({
	avatar,
	username,
	time,
	question,
	options,
}: BettingPostProps) {
	return (
		<div className="border border-gray-800 rounded-lg bg-background overflow-hidden">
			<div className="p-4">
				<div className="flex items-center gap-2 mb-2">
					<Avatar className="h-10 w-10 rounded-full overflow-hidden">
						<AvatarImage src={avatar} alt={username} />
						<AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="font-bold">{username}</div>
					</div>
					<div className="flex items-center gap-2 text-gray-400 text-sm">
						<span>{time}</span>
						<X size={16} />
					</div>
				</div>
				<p className="text-lg mb-4">{question}</p>
				<div className="bg-gray-800 rounded-md p-2 mb-3 text-center text-gray-400">
					No bets
				</div>
				<div className="space-y-2">
					{options.map((option, index) => (
						<div
							key={index}
							className="flex justify-between items-center"
						>
							<span className={option.color}>{option.text}</span>
							<div className="flex items-center gap-1">
								<div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-xs">
									0
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
