import React from 'react'

import Box from '../../components/Box'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"


const SettingsAccount: React.FC = () => {
	const { isSignedIn, user, isLoaded } = useUser()


	return (
		<div className="w-full max-w-2xl mx-auto px-4 space-y-8">
			<div className="flex flex-row gap-2 items-center pt-8">
				<h1 className="text-2xl font-bold flex-grow">Account</h1>
			</div>

			<Box title="Account">
				<p>Account is optional. We use it for security. Turns out, it's risky to store your API keys in your browser.</p>
				<p>By creating an account, we're using that to store the API keys on an encrypted server, and each key is encrypted again.</p>

				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<div className="flex flex-row gap-2 items-center">
						<UserButton />
						<span>{user?.fullName}</span>
					</div>
				</SignedIn>
			</Box>
		</div>
	)
}

export default SettingsAccount
