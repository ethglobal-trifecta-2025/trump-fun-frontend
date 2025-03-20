import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { BettingPost } from "@/components/betting-post";
import { TrendingBet } from "@/components/trending-bet";
import { EndingSoonBet } from "@/components/ending-soon-bet";

export default function BettingPlatform() {
	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div className="hidden md:flex flex-col w-60 border-r border-gray-800 p-4">
					<div className="flex items-center gap-3 mb-6">
						<Avatar className="size-14 rounded-full overflow-hidden">
							<AvatarImage src="/trump.jpeg" alt="Trump.fun" />
							<AvatarFallback>
								<span className="text-2xl font-bold text-orange-500">
									T
								</span>
							</AvatarFallback>
						</Avatar>
						<span className="text-xl font-bold">@Trump.fun</span>
					</div>

					<Link href="/">
						<Button
							variant="outline"
							className="mb-6 justify-start gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
							</svg>
							Follow @Trump.fun
						</Button>
					</Link>

					<Separator className="my-4" />

					<nav className="space-y-1">
						<Button
							variant="ghost"
							className="w-full justify-start font-medium"
						>
							Newest
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start font-medium"
						>
							Highest Vol.
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start font-medium"
						>
							Ending Soon
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start font-medium"
						>
							Recently Closed
						</Button>
						<Separator className="my-2" />
					</nav>
				</div>

				{/* Main Content */}
				<main className="flex-1 flex flex-col md:flex-row overflow-y-hidden">
					{/* Feed */}
					<div className="flex-1 p-4 flex justify-center overflow-y-auto scrollbar-hide scroll-hide">
						<div className="w-full max-w-2xl">
							{/* Mobile Search */}
							<div className="md:hidden mb-4">
								<div className="relative">
									<Search
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
										size={18}
									/>
									<Input
										placeholder="Search pools..."
										className="pl-10 bg-gray-900 border-gray-700 text-white"
									/>
								</div>
							</div>

							{/* Mobile Tabs */}
							<div className="md:hidden mb-4 overflow-x-auto scrollbar-hide scroll-hide">
								<Tabs defaultValue="newest" className="w-full">
									<TabsList className="bg-gray-900">
										<TabsTrigger
											value="newest"
											className="data-[state=active]:bg-gray-800"
										>
											Newest
										</TabsTrigger>
										<TabsTrigger
											value="highest"
											className="data-[state=active]:bg-gray-800"
										>
											Highest Vol.
										</TabsTrigger>
										<TabsTrigger
											value="ending"
											className="data-[state=active]:bg-gray-800"
										>
											Ending Soon
										</TabsTrigger>
										<TabsTrigger
											value="recent"
											className="data-[state=active]:bg-gray-800"
										>
											Recent
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							{/* Betting Posts */}
							<div className="space-y-4 flex-1">
								<BettingPost
									id="1"
									avatar="/placeholder.svg?height=40&width=40"
									username="RichardFer47658"
									time="1 minute ago"
									question="Will the CanIBetOn team successfully complete a live demo without technical issues during the interview on March 20, 2025?"
									options={[
										{
											text: "Yes, they will complete without issues",
											color: "text-blue-400",
										},
										{
											text: "No, there will be technical issues",
											color: "text-red-500",
										},
									]}
									commentCount={5}
									volume="$700"
								/>

								<BettingPost
									id="2"
									avatar="/placeholder.svg?height=40&width=40"
									username="Mark_M007"
									time="1 minute ago"
									question="Will the CanIBetOn AI agent successfully launch a new betting pool during the live demo on March 20, 2025?"
									options={[
										{ text: "Yes", color: "text-blue-400" },
										{ text: "No", color: "text-red-500" },
									]}
									commentCount={2}
									volume="$500"
								/>

								<BettingPost
									id="3"
									avatar="/placeholder.svg?height=40&width=40"
									username="crypto_whale"
									time="5 minutes ago"
									question="Will Trump announce a new major policy position on crypto regulations before April 15, 2025?"
									options={[
										{ text: "Yes", color: "text-blue-400" },
										{ text: "No", color: "text-red-500" },
									]}
									commentCount={12}
									volume="$1,200"
								/>

								<BettingPost
									id="4"
									avatar="/placeholder.svg?height=40&width=40"
									username="TruthSeeker2024"
									time="15 minutes ago"
									question="Will Trump post more than 10 times on Truth Social on Election Day 2024?"
									options={[
										{ text: "Yes, more than 10 posts", color: "text-blue-400" },
										{ text: "No, 10 or fewer posts", color: "text-red-500" },
									]}
									commentCount={8}
									volume="$850"
								/>

								<BettingPost
									id="5"
									avatar="/placeholder.svg?height=40&width=40"
									username="alphabridgez"
									time="30 minutes ago"
									question="Will Trump mention AI or artificial intelligence in his next rally speech?"
									options={[
										{ text: "Yes", color: "text-blue-400" },
										{ text: "No", color: "text-red-500" },
									]}
									commentCount={3}
									volume="$300"
								/>
							</div>
						</div>
					</div>
				</main>

				{/* Right Sidebar */}
				<div className="hidden md:block w-80 p-4 border-l border-gray-800 overflow-y-auto">
					{/* Search */}
					<div className="mb-6">
						<div className="relative">
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<Input
								placeholder="Search pools..."
								className="pl-10 bg-background border-gray-700 text-white"
							/>
						</div>
					</div>

					{/* Highest Volume */}
					<div className="bg-background rounded-lg p-4 mb-6 border border-gray-800 shadow-lg">
						<div className="flex items-center gap-2 mb-4">
							<TrendingUp size={20} className="text-orange-500" />
							<h2 className="text-lg font-bold">
								Highest Volume
							</h2>
						</div>

						<div className="space-y-6">
							<TrendingBet
								question="Will Hollow Knight: Silksong be released before or on December 31, 2025?"
								volume="$700 vol."
								progress={60}
							/>

							<TrendingBet
								question="Which streaming service will have the most subscribers by the end of 2025?"
								volume="$200 vol."
								progress={90}
							/>

							<TrendingBet
								question="Will the Monster Hunter Wilds Mizutsune Title Update be released before or on April 30, 2025?"
								volume="$100 vol."
								progress={80}
							/>
						</div>
					</div>

					{/* Ending Soon */}
					<div className="bg-background rounded-lg p-4 border border-gray-800 shadow-lg">
						<div className="flex items-center gap-2 mb-4">
							<Clock size={20} className="text-orange-500" />
							<h2 className="text-lg font-bold">Ending Soon</h2>
						</div>

						<div className="space-y-4">
							<EndingSoonBet
								avatar="/placeholder.svg?height=30&width=30"
								question="Will the L1X team announce a major partnership during their live..."
								volume="$0 vol."
								timeLeft="01:15:39"
							/>

							<EndingSoonBet
								avatar="/placeholder.svg?height=30&width=30"
								question="Will the CanIBetOn team successfully complete their live..."
								volume="$0 vol."
								timeLeft="01:15:39"
							/>

							<EndingSoonBet
								avatar="/placeholder.svg?height=30&width=30"
								question="Will the CanIBetOn team successfully complete their live..."
								volume="$0 vol."
								timeLeft="01:15:39"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
