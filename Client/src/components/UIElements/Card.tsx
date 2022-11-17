const Card = (props: any) => {
    return (
        <div className={`${props.additionalStyle} m-0 rounded-2xl p-2`}>
            {props.children}
        </div>
    );
};
export default Card;
