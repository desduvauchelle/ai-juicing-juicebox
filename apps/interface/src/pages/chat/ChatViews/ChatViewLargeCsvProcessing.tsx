import { FC } from "react"



const ChatViewLargeCsvProcessor: FC = () => {

	return <>
		<p>IDEA:<br />
			Monika Doanova<br />
			Hiii! I have a csv file of 32000 survey responses (nps) and I’ve been trying to find a way to filter then to specific topic + tag the topics and generate a new csv for me. I tried Claude which did a pretty good job at filtering but I could not export the csv with the filtered list not even in batches.
			Anyone who could recommend a no-code solution for this? 🥹
		</p>
		<p>
			My thought:
			- Allow the user to upload a csv
			- Specificy what they want to do, add a column, filter, etc
			- If add column, add a prompt builder to say what should go into that row
			- If filter, allow them to specify the filter
			- Then the system goes through each row, one by one, and applies the filter or adds the column
			- Allow the user to download the new csv
		</p>
	</>
}

export default ChatViewLargeCsvProcessor
