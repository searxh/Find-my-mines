import { UserType } from "../../types";

export const getUserColor = (activeUsers: Array<UserType>, name: string) => {
    const userInfo = activeUsers.find((user: UserType) => user.name === name);
    return userInfo?.color ? userInfo?.color : "";
};
