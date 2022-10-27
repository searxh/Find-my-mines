import Card from "../components/UIElements/Card";

const HowToPlay = () => {
	return (
		<>
			<h1 className='text-slate-100 text-3xl mb-10'>
				How to play: Find My Minds
			</h1>
			<Card additionalStyle=' h-96'>
				<li>There are 11 Bombs randomly placed in a 6x6 grid.</li>
				<li>
					Each player has to find the bombs as many as he/she can. The player
					has only 10 seconds to choose a slot in the grid that contains the
					bomb per one turn.
				</li>
				<li>
					The more bombs you pick, the more points you get. The game will end
					after all bombs have been found.
				</li>
			</Card>
		</>
	);
};

export default HowToPlay;
