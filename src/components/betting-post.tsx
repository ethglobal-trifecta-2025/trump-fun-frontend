'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, MessageCircle, ThumbsUp } from "lucide-react"
import Link from "next/link"

interface BettingPostProps {
	id: string;
	avatar: string;
	username: string;
	time: string;
	question: string;
	options: { text: string; color: string }[];
	commentCount?: number;
	volume?: string;
}

export function BettingPost({
	id,
	avatar,
	username,
	time,
	question,
	options,
	commentCount = 0,
	volume = "0"
}: BettingPostProps) {
	const [betAmount, setBetAmount] = useState('')
	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const [showBetForm, setShowBetForm] = useState(false)
	const { authenticated, login } = usePrivy()

	const handleBetClick = () => {
		if (!authenticated) {
			login()
			return
		}
		setShowBetForm(!showBetForm)
	}

	const placeBet = () => {
		if (!authenticated) {
			login()
			return
		}

		if (!betAmount || selectedOption === null) return

		// Here you would connect to the smart contract
		alert(`Placing ${betAmount} USDC bet on "${options[selectedOption].text}"`)

		// Reset form
		setBetAmount('')
		setSelectedOption(null)
		setShowBetForm(false)
	}

	return (
		<div className="border border-gray-800 rounded-lg bg-background overflow-hidden hover:border-gray-700 transition-colors">
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
				
				<Link href={`/pools/${id}`} className="block">
					<p className="text-lg mb-4 font-medium hover:text-orange-500 transition-colors">{question}</p>
				</Link>
				
				<div className="bg-gray-800 rounded-md p-2 mb-3 text-center text-gray-400 flex justify-between items-center">
					<span>No bets</span>
					{volume !== "0" && <span className="text-orange-400">{volume} vol.</span>}
				</div>
				
				<div className="space-y-2 mb-4">
					{options.map((option, index) => (
						<div
							key={index}
							className={`flex justify-between items-center p-2 rounded-md transition-colors ${
								selectedOption === index ? 'bg-gray-800' : 'hover:bg-gray-900'
							} cursor-pointer`}
							onClick={() => setSelectedOption(index)}
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
				
				<div className="flex justify-between items-center">
					<Button 
						variant="ghost" 
						size="sm" 
						className="text-gray-400 hover:text-gray-300"
						asChild
					>
						<Link href={`/pools/${id}`}>
							<MessageCircle size={18} className="mr-1" />
							{commentCount > 0 ? commentCount : 'Comment'}
						</Link>
					</Button>
					
					<Button 
						variant="ghost" 
						size="sm"
						className="text-gray-400 hover:text-orange-500"
						onClick={handleBetClick}
					>
						<ThumbsUp size={18} className="mr-1" />
						Bet
					</Button>
				</div>
				
				{showBetForm && (
					<div className="mt-4 border-t border-gray-800 pt-4">
						<h4 className="text-sm font-medium mb-2">Place your bet</h4>
						<div className="flex gap-2">
							<Input
								type="number"
								placeholder="Amount (USDC)"
								className="flex-1"
								value={betAmount}
								onChange={(e) => setBetAmount(e.target.value)}
							/>
							<Button 
								className="bg-orange-600 hover:bg-orange-700"
								onClick={placeBet}
								disabled={!betAmount || selectedOption === null}
							>
								Place Bet
							</Button>
						</div>
						{selectedOption !== null && (
							<p className="text-xs mt-2 text-gray-400">
								You are betting {betAmount || '0'} USDC on &quot;{options[selectedOption].text}&quot;
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
