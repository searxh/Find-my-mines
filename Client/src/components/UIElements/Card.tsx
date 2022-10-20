const Card = (props: any) => {
	return (
		<div className={`${props.additionalStyle} m-0 rounded-md p-2 bg-gray-400 `}>
			{props.children}
		</div>
	);
};
export default Card;
