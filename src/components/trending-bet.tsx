import { TrendingUp } from "lucide-react";

interface TrendingBetProps {
	question: string;
	volume: string;
	progress: number;
}

export function TrendingBet({ question, volume, progress }: TrendingBetProps) {
	return (
		<div>
			<p className="font-medium mb-2">{question}</p>
			<div className="flex items-center gap-2 mb-2">
				<div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-blue-500 to-orange-500"
						style={{ width: `${progress}%` }}
					></div>
				</div>
				<div className="flex items-center gap-1 text-sm text-gray-400">
					<TrendingUp size={14} />
					<span>{volume}</span>
				</div>
			</div>
		</div>
	);
}
