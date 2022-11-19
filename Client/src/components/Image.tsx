import React from "react";
import Loading from "./Loading";

export default function Image({
    type,
    className,
    onLoad,
}: {
    type: string;
    className?: string;
    onLoad?: Function;
}) {
    const [image, setImage] = React.useState<string | undefined>(undefined);
    React.useLayoutEffect(() => {
        if (type !== undefined && type !== null) {
            setImage("assets/images/" + type + "Mine.png");
        }
    }, [type]);
    return type !== null ? (
        <img
            src={image}
            className={`w-full object-contain ${className} `}
            onLoad={() => (onLoad ? onLoad() : {})}
            alt=""
        />
    ) : (
        <Loading visible={type === null} />
    );
}
